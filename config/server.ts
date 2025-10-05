export default ({ env }) => {
  // 支持多种端口环境变量
  const port =
    env.int("PORT") || env.int("WEB_PORT") || env.int("ZEABUR_PORT") || 1337;

  console.log("🔍 完整配置调试:");
  console.log(`   - NODE_ENV: ${env("NODE_ENV")}`);
  console.log(`   - HOST: ${env("HOST")}`);
  console.log(`   - PORT: ${env("PORT")}`);
  console.log(`   - WEB_PORT: ${env("WEB_PORT")}`);
  console.log(`   - 最终端口: ${port}`);
  console.log(`   - PUBLIC_URL: ${env("PUBLIC_URL")}`);
  console.log(
    `   - 最终 URL: ${env("PUBLIC_URL") || `http://localhost:${port}`}`
  );

  return {
    host: env("HOST", "0.0.0.0"),
    port: port,
    app: {
      keys: env.array("APP_KEYS"),
    },
    // 修复 URL 配置
    url: env("PUBLIC_URL") || `http://localhost:${port}`,
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
