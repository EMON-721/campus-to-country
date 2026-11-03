// Cloudflare-only adapter. Keep Vercel's standard next build untouched.
// Webpack traces conditional workerd exports missing from Turbopack's Node middleware trace.
import {defineCloudflareConfig} from '@opennextjs/cloudflare';
export default defineCloudflareConfig({
  buildCommand: 'npx next build --webpack',
});
