import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   reactStrictMode: true,
  experimental: {
     // @ts-ignore
    allowedDevOrigins: ['http://10.246.238.129:3000'] as any[], // <-- your dev origin
  },
};

export default nextConfig;
