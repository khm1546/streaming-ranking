import path from 'node:path';
import { loadEnvConfig } from '@next/env';
import type { NextConfig } from 'next';

// 모노레포 루트의 .env / .env.local 등을 로드해서 process.env 채움.
const monorepoRoot = path.join(__dirname, '..', '..');
loadEnvConfig(monorepoRoot);

const nextConfig: NextConfig = {
  turbopack: {
    root: monorepoRoot,
  },
  transpilePackages: ['@streaming/ui', '@streaming/shared', '@streaming/db', '@streaming/ocr'],
};

export default nextConfig;
