import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export * from '@prisma/client';
export { getOrCreateDevUser, requireUser, requireAdmin } from './auth-shim';
export { matchSongFromText, type MatchResult } from './song-matcher';
export {
  getStorageClient,
  ensureBucket,
  uploadProofImage,
  getPublicUrl,
} from './storage';
