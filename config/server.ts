export default ({ env }) => {
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
    ...(env("NODE_ENV") === "production" && {
      // 信任代理
      proxy: true,
      // 安全配置
      security: {
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            "connect-src": ["'self'", "https:"],
            "img-src": ["'self'", "data:", "blob:", "https:"],
            "media-src": ["'self'", "data:", "blob:", "https:"],
            upgradeInsecureRequests: null,
          },
        },
      },
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
