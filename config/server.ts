export default ({ env }) => {
  const isProduction = env("NODE_ENV") === "production";
  const publicUrl = env("PUBLIC_URL");
  // 支持多种端口环境变量
  const port =
    env.int("PORT") || env.int("WEB_PORT") || env.int("ZEABUR_PORT") || 1337;

  console.log("🔍 端口配置调试:");
  console.log(`   - PORT: ${env("PORT")}`);
  console.log(`   - WEB_PORT: ${env("WEB_PORT")}`);
  console.log(`   - 最终端口: ${port}`);
  console.log(`   - PUBLIC_URL: ${env("PUBLIC_URL")}`);
  console.log("🔍 安全配置调试:");
  console.log(`   - NODE_ENV: ${env("NODE_ENV")}`);
  console.log(`   - PUBLIC_URL: ${env("PUBLIC_URL")}`);
  console.log(`   - TRUST_PROXY: ${env("TRUST_PROXY")}`);
  console.log(`   - CORS_ORIGIN: ${env("CORS_ORIGIN")}`);
  return {
    host: env("HOST", "0.0.0.0"),
    port: port,
    app: {
      keys: env.array("APP_KEYS"),
    },
    // 修复 URL 配置
    url: env("PUBLIC_URL") || `http://localhost:${port}`,
    // 生产环境安全配置
    ...(publicUrl && publicUrl.startsWith('https://') && {
      secure: true,
      protocol: 'https',
      // 修改：信任所有代理（在 PaaS 环境中更安全）
      trustProxy: true, // 或者使用 '10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16'
    }),
    // 开发模式配置
    ...(env("NODE_ENV") === "development" && {
      watchIgnoreFiles: [
        "**/node_modules/**",
        "**/dist/**",
        "**/.cache/**",
        "**/build/**",
        "**/docs/**",
        "**/README.md",
        "**/*.md",
      ],
    }),
  };
};
