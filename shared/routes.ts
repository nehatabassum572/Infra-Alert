import { z } from 'zod';
import { insertIssueSchema, insertUserSchema, issues, users } from './schema';

export * from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
  unauthorized: z.object({ message: z.string() }),
  forbidden: z.object({ message: z.string() }),
};

export const api = {
  auth: {
    register: {
      method: 'POST' as const,
      path: '/api/register',
      input: insertUserSchema,
      responses: { 201: z.custom<typeof users.$inferSelect>(), 400: errorSchemas.validation },
    },
    login: {
      method: 'POST' as const,
      path: '/api/login',
      input: z.object({ username: z.string(), password: z.string() }),
      responses: { 200: z.custom<typeof users.$inferSelect>(), 401: errorSchemas.unauthorized },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout',
      responses: { 200: z.void() },
    },
    user: {
      method: 'GET' as const,
      path: '/api/user',
      responses: { 200: z.custom<typeof users.$inferSelect>(), 401: errorSchemas.unauthorized },
    },
  },
  issues: {
    list: {
      method: 'GET' as const,
      path: '/api/issues',
      responses: { 200: z.array(z.custom<typeof issues.$inferSelect>()) },
    },
    create: {
      method: 'POST' as const,
      path: '/api/issues',
      input: insertIssueSchema,
      responses: { 201: z.custom<typeof issues.$inferSelect>(), 400: errorSchemas.validation },
    },
    get: {
      method: 'GET' as const,
      path: '/api/issues/:id',
      responses: { 200: z.custom<typeof issues.$inferSelect>(), 404: errorSchemas.notFound },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/issues/:id',
      input: insertIssueSchema.partial(),
      responses: { 200: z.custom<typeof issues.$inferSelect>(), 404: errorSchemas.notFound },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/issues/:id',
      responses: { 204: z.void(), 404: errorSchemas.notFound },
    },
  },
  stats: {
    get: {
        method: 'GET' as const,
        path: '/api/stats',
        responses: { 200: z.object({ total: z.number(), pending: z.number(), resolved: z.number(), in_progress: z.number() }) }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
