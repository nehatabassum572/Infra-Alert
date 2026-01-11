import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

import { hash } from "bcryptjs";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  setupAuth(app);

  // Issues API
  app.get(api.issues.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    const allIssues = await storage.getIssues();
    // RBAC: Admin sees all, User sees theirs
    if (req.user!.role === 'admin') {
      res.json(allIssues);
    } else {
      res.json(allIssues.filter(i => i.userId === req.user!.id));
    }
  });

  app.post(api.issues.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    try {
      const input = api.issues.create.input.parse(req.body);
      const issue = await storage.createIssue({ ...input, userId: req.user!.id });
      res.status(201).json(issue);
    } catch (e) {
      if (e instanceof z.ZodError) {
        res.status(400).json(e.errors);
      } else {
        res.status(500).send();
      }
    }
  });

  app.get(api.issues.get.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    const issue = await storage.getIssue(Number(req.params.id));
    if (!issue) return res.status(404).send();
    // Allow if admin or owner
    if (req.user!.role !== 'admin' && issue.userId !== req.user!.id) {
       return res.status(403).send();
    }
    res.json(issue);
  });

  app.put(api.issues.update.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    const issue = await storage.getIssue(Number(req.params.id));
    if (!issue) return res.status(404).send();

    if (req.user!.role !== 'admin') {
        return res.status(403).json({ message: "Only admins can update issues" });
    }

    try {
        const input = api.issues.update.input.parse(req.body);
        const updated = await storage.updateIssue(Number(req.params.id), input);
        res.json(updated);
    } catch (e) {
        if (e instanceof z.ZodError) {
          res.status(400).json(e.errors);
        } else {
          res.status(500).send();
        }
    }
  });

  app.delete(api.issues.delete.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    if (req.user!.role !== 'admin') return res.status(403).send();
    await storage.deleteIssue(Number(req.params.id));
    res.status(204).send();
  });
  
  app.get(api.stats.get.path, async (req, res) => {
     if (!req.isAuthenticated() || req.user!.role !== 'admin') return res.status(401).send();
     const stats = await storage.getStats();
     res.json(stats);
  });

  // Seeding
  if (await storage.getUserByUsername('admin') === undefined) {
    const adminPass = await hash('admin123', 10);
    await storage.createUser({ username: 'admin', password: adminPass, role: 'admin', name: 'System Admin' });
    
    const userPass = await hash('user123', 10);
    const user = await storage.createUser({ username: 'user', password: userPass, role: 'user', name: 'John Doe' });
    
    await storage.createIssue({ title: 'Pothole on Main St', description: 'Large pothole.', category: 'Road', location: 'Downtown', userId: user.id, status: 'pending' });
    await storage.createIssue({ title: 'Leaking Pipe', description: 'Water leak.', category: 'Water', location: 'Suburbia', userId: user.id, status: 'resolved' });
  }

  return httpServer;
}
