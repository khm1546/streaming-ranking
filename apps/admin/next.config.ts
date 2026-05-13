import path from 'node:path';
import { loadEnvConfig } from '@next/env';
import type { NextConfig } from 'next';

const monorepoRoot = path.join(__dirname, '..', '..');
loadEnvConfig(monorepoRoot);

const nextConfig: NextConfig = {
  turbopack: {
    root: monorepoRoot,
  },
  transpilePackages: ['@streaming/ui', '@streaming/shared', '@streaming/db'],
};

export default nextConfig;
