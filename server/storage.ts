import { users, issues, type User, type InsertUser, type Issue, type InsertIssue } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getIssues(): Promise<Issue[]>;
  getIssue(id: number): Promise<Issue | undefined>;
  createIssue(issue: InsertIssue & { userId: number }): Promise<Issue>;
  updateIssue(id: number, issue: Partial<InsertIssue>): Promise<Issue | undefined>;
  deleteIssue(id: number): Promise<void>;

  getStats(): Promise<{ total: number; pending: number; resolved: number; in_progress: number }>;
  
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getIssues(): Promise<Issue[]> {
    return await db.select().from(issues).orderBy(desc(issues.createdAt));
  }

  async getIssue(id: number): Promise<Issue | undefined> {
    const [issue] = await db.select().from(issues).where(eq(issues.id, id));
    return issue;
  }

  async createIssue(issue: InsertIssue & { userId: number }): Promise<Issue> {
    const [newIssue] = await db.insert(issues).values(issue).returning();
    return newIssue;
  }

  async updateIssue(id: number, update: Partial<InsertIssue>): Promise<Issue | undefined> {
    const [updated] = await db.update(issues).set(update).where(eq(issues.id, id)).returning();
    return updated;
  }

  async deleteIssue(id: number): Promise<void> {
    await db.delete(issues).where(eq(issues.id, id));
  }

  async getStats() {
    const all = await db.select().from(issues);
    return {
      total: all.length,
      pending: all.filter(i => i.status === 'pending').length,
      resolved: all.filter(i => i.status === 'resolved').length,
      in_progress: all.filter(i => i.status === 'in_progress').length,
    };
  }
}

export const storage = new DatabaseStorage();
