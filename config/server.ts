export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  // 开发模式配置
  ...(env('NODE_ENV') === 'development' && {
    watchIgnoreFiles: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.cache/**',
      '**/build/**',
      '**/docs/**',           // 忽略docs目录，避免文档修改时重载
      '**/README.md',         // 忽略README文件
      '**/*.md',              // 忽略所有markdown文件
    ],
  }),
});
