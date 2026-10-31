import type {NextConfig} from 'next';
import {securityHeaders,privateHeaders} from './lib/security-headers';
// Default serverless output: API routes, cookies and private data require a server.
const nextConfig:NextConfig={
 reactStrictMode:true,poweredByHeader:false,
 experimental:{turbopackFileSystemCacheForBuild:false},
 async headers(){return [
  {source:'/:path*',headers:securityHeaders},
  ...['/admin','/admin/:path*','/api/v1/admin/:path*','/api/v1/auth/:path*','/account-security','/account-status'].map(source=>({source,headers:privateHeaders})),
 ]},
};
export default nextConfig;
