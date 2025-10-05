export default ({ env }) => {
  const port = env.int("PORT") || env.int("WEB_PORT") || env.int("ZEABUR_PORT") || 1337;
  const isProduction = env("NODE_ENV") === "production";

  console.log("🔍 配置调试:");
  console.log(`   - NODE_ENV: ${env("NODE_ENV")}`);
  console.log(`   - PORT: ${port}`);
  console.log(`   - HOST: ${env("HOST", "0.0.0.0")}`);

  return {
    host: env("HOST", "0.0.0.0"),
    port: port,
    app: {
      keys: env.array("APP_KEYS"),
    },
    // 简化 URL 配置 - 让 Nginx 处理 HTTPS
    url: env("PUBLIC_URL") || `http://localhost:${port}`,
    proxy: true,
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