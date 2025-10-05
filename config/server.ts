export default ({ env }) => {
  // 支持多种端口环境变量
  const port = env.int('PORT') ||
               env.int('WEB_PORT') ||
               env.int('ZEABUR_PORT') ||
               1337;

  console.log('🔍 端口配置调试:');
  console.log(`   - PORT: ${env('PORT')}`);
  console.log(`   - WEB_PORT: ${env('WEB_PORT')}`);
  console.log(`   - 最终端口: ${port}`);

  return {
    host: env('HOST', '0.0.0.0'),
    port: port,
    app: {
      keys: env.array('APP_KEYS'),
    },
    // 添加 URL 配置
    url: env('PUBLIC_URL', `http://${env('HOST', '0.0.0.0')}:${port}`),
    // 开发模式配置
    ...(env('NODE_ENV') === 'development' && {
      watchIgnoreFiles: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.cache/**',
        '**/build/**',
        '**/docs/**',
        '**/README.md',
        '**/*.md',
      ],
    }),
  };
};