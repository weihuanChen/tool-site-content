/**
 * Strapi Server Configuration, 解决 PaaS (如 Zeabur) 环境下
 * Admin Panel 重定向到 127.0.0.1 和 Secure Cookie 问题。
 */

export default ({ env }) => {
  const port = env.int("PORT") || env.int("WEB_PORT") || env.int("ZEABUR_PORT") || 1337;
  const isDevelopment = env("NODE_ENV") === "development";
  // 1. Admin UI URL 修复: 优先使用 STRAPI_ADMIN_BACKEND_URL
  const adminUrl = env("STRAPI_ADMIN_BACKEND_URL") || env("PUBLIC_URL");
  const host = env("HOST", "0.0.0.0");

  console.log("🔍 Strapi Configuration Debug:");
  console.log(`   - NODE_ENV: ${env("NODE_ENV")}`);
  console.log(`   - Host Binding: ${host}:${port}`);
  console.log(`   - Admin/Public URL: ${adminUrl}`);

  return {
    host: host,
    port: port,
    // 2. 代理信任修复: 使用 KOA_PROXY_TRUST 解决 Secure Cookie 问题
    proxy: env('KOA_PROXY_TRUST', 'true') === 'all' ? 'all' : env.bool("TRUST_PROXY", true),
    // 服务器的外部 URL，用于生成链接
    url: env("PUBLIC_URL") || adminUrl,
    app: {
      keys: env.array("APP_KEYS"),
    },

    // 3. Admin Panel URL 修复: 确保 Admin 前端知道正确的后端地址
    admin: {
      url: adminUrl,
      auth: {
        secret: env('ADMIN_JWT_SECRET'),
      },
      watchIgnoreFiles: isDevelopment ? [
        "**/node_modules/**",
        "**/dist/**",
        "**/.cache/**",
        "**/build/**",
        "**/docs/**",
        "**/README.md",
        "**/*.md",
      ] : [],
    },
  };
};
