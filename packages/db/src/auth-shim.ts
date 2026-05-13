import { prisma } from './index';
import type { User } from '@prisma/client';

/**
 * DEV ONLY: returns a fixed admin user for the dev session.
 * TODO(auth): replace with real Supabase Auth session lookup.
 */
const DEV_USER = {
  email: 'dev@local',
  nickname: 'dev',
  provider: 'dev',
  providerId: 'dev-user',
  role: 'ADMIN' as const,
};

let cached: User | null = null;

export async function getOrCreateDevUser(): Promise<User> {
  if (cached) return cached;
  const user = await prisma.user.upsert({
    where: {
      provider_providerId: { provider: DEV_USER.provider, providerId: DEV_USER.providerId },
    },
    update: {},
    create: DEV_USER,
  });
  cached = user;
  return user;
}

/** Use in server actions / loaders that need a user. */
export async function requireUser(): Promise<User> {
  return getOrCreateDevUser();
}

/** Use for admin-only actions. */
export async function requireAdmin(): Promise<User> {
  const user = await getOrCreateDevUser();
  if (user.role !== 'ADMIN') throw new Error('Admin only');
  return user;
}
