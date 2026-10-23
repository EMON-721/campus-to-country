import type {NextConfig} from 'next';
// Default serverless output: API routes, cookies and private data require a server.
const nextConfig:NextConfig={reactStrictMode:true,poweredByHeader:false,experimental:{turbopackFileSystemCacheForBuild:false}};
export default nextConfig;
