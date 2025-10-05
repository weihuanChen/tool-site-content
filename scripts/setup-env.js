#!/usr/bin/env node

/**
 * Supabase 环境变量设置脚本
 * 用于自动生成 .env 文件
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');

// 创建 readline 接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 生成随机密钥的辅助函数
function generateKey(length = 32) {
  return crypto.randomBytes(length).toString('base64');
}

// 生成 JWT 密钥
function generateJWTSecret() {
  return crypto.randomBytes(64).toString('base64');
}

// 询问用户输入
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// 验证项目引用 ID 格式
function validateProjectRef(projectRef) {
  // 移除可能的前缀和后缀
  let cleanRef = projectRef.trim();
  
  // 移除 https:// 前缀
  if (cleanRef.startsWith('https://')) {
    cleanRef = cleanRef.replace('https://', '');
  }
  
  // 移除 .supabase.co 后缀
  if (cleanRef.endsWith('.supabase.co')) {
    cleanRef = cleanRef.replace('.supabase.co', '');
  }
  
  // 移除 db. 前缀
  if (cleanRef.startsWith('db.')) {
    cleanRef = cleanRef.replace('db.', '');
  }
  
  return cleanRef;
}

// 验证密码格式
function validatePassword(password) {
  return password.trim();
}

// 生成 .env 文件内容
function generateEnvContent(config) {
  return `# =================================
# Strapi 环境变量配置
# 使用 Supabase 作为数据库
# 生成时间: ${new Date().toISOString()}
# =================================

# =================================
# 应用基础配置
# =================================
# 应用密钥 (必需) - 用于加密会话和应用数据
APP_KEYS=${config.appKeys}

# 服务器配置
HOST=0.0.0.0
PORT=1337

# =================================
# 数据库配置 (Supabase PostgreSQL)
# =================================
# 数据库客户端类型
DATABASE_CLIENT=postgres

# Supabase 数据库连接 URL
DATABASE_URL=postgresql://postgres:${config.dbPassword}@db.${config.projectRef}.supabase.co:5432/postgres

# 或者使用单独的连接参数
DATABASE_HOST=db.${config.projectRef}.supabase.co
DATABASE_PORT=5432
DATABASE_NAME=postgres
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=${config.dbPassword}

# SSL 配置 (Supabase 要求 SSL 连接)
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false

# 数据库连接池配置
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10
DATABASE_CONNECTION_TIMEOUT=60000

# 数据库模式
DATABASE_SCHEMA=public

# =================================
# 安全配置 (必需)
# =================================
# 管理员 JWT 密钥
ADMIN_JWT_SECRET=${config.adminJWTSecret}

# API 令牌盐值
API_TOKEN_SALT=${config.apiTokenSalt}

# 传输令牌盐值
TRANSFER_TOKEN_SALT=${config.transferTokenSalt}

# 数据加密密钥
ENCRYPTION_KEY=${config.encryptionKey}

# =================================
# 功能标志
# =================================
# 启用 NPS 调查
FLAG_NPS=true

# 推广企业版功能
FLAG_PROMOTE_EE=true

# =================================
# Supabase 特定配置 (可选)
# =================================
# Supabase 项目 URL
# NEXT_PUBLIC_SUPABASE_URL=https://${config.projectRef}.supabase.co

# Supabase 匿名密钥 (如果需要前端集成)
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Supabase 服务角色密钥 (如果需要服务端操作)
# SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# =================================
# 开发环境配置
# =================================
# 环境类型
NODE_ENV=development

# 日志级别
LOG_LEVEL=info

# =================================
# 文件上传配置 (可选)
# =================================
# 文件上传大小限制 (字节)
# UPLOAD_SIZE_LIMIT=200000000

# 允许的文件类型
# UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/gif,image/webp,application/pdf

# =================================
# 邮件配置 (可选)
# =================================
# 邮件提供商
# EMAIL_PROVIDER=sendgrid
# EMAIL_API_KEY=your-email-api-key
# EMAIL_FROM=noreply@yourdomain.com

# =================================
# 缓存配置 (可选)
# =================================
# Redis 连接 URL (如果使用 Redis 缓存)
# REDIS_URL=redis://localhost:6379

# =================================
# 监控配置 (可选)
# =================================
# Sentry DSN (如果使用 Sentry 错误监控)
# SENTRY_DSN=your-sentry-dsn
`;
}

// 主函数
async function main() {
  console.log('🚀 Strapi + Supabase 环境变量设置向导');
  console.log('=====================================\n');

  try {
    // 收集用户输入
    const rawProjectRef = await askQuestion('请输入您的 Supabase 项目引用 ID: ');
    const rawDbPassword = await askQuestion('请输入您的 Supabase 数据库密码: ');
    
    // 验证和清理输入
    const projectRef = validateProjectRef(rawProjectRef);
    const dbPassword = validatePassword(rawDbPassword);
    
    console.log(`\n🔍 验证输入信息:`);
    console.log(`   - 原始项目 ID: ${rawProjectRef}`);
    console.log(`   - 清理后项目 ID: ${projectRef}`);
    console.log(`   - 数据库密码: ${'*'.repeat(dbPassword.length)}`);
    
    if (projectRef !== rawProjectRef) {
      console.log(`\n⚠️  注意: 已自动清理项目 ID 格式，移除了不必要的前缀和后缀`);
    }
    
    // 生成安全密钥
    console.log('\n🔐 生成安全密钥...');
    const config = {
      projectRef: projectRef.trim(),
      dbPassword: dbPassword.trim(),
      appKeys: generateKey(32),
      adminJWTSecret: generateJWTSecret(),
      apiTokenSalt: generateKey(32),
      transferTokenSalt: generateKey(32),
      encryptionKey: generateKey(32)
    };

    // 生成 .env 文件内容
    const envContent = generateEnvContent(config);

    // 写入 .env 文件
    const envPath = path.join(process.cwd(), '.env');
    fs.writeFileSync(envPath, envContent);

    console.log('\n✅ .env 文件已成功创建！');
    console.log(`📁 文件位置: ${envPath}`);
    console.log('\n📋 配置摘要:');
    console.log(`   - Supabase 项目: ${config.projectRef}`);
    console.log(`   - 数据库: PostgreSQL`);
    console.log(`   - SSL: 启用`);
    console.log(`   - 连接池: 2-10 连接`);
    console.log('\n🔑 已生成的安全密钥:');
    console.log(`   - APP_KEYS: ${config.appKeys.substring(0, 20)}...`);
    console.log(`   - ADMIN_JWT_SECRET: ${config.adminJWTSecret.substring(0, 20)}...`);
    console.log(`   - API_TOKEN_SALT: ${config.apiTokenSalt.substring(0, 20)}...`);
    console.log(`   - TRANSFER_TOKEN_SALT: ${config.transferTokenSalt.substring(0, 20)}...`);
    console.log(`   - ENCRYPTION_KEY: ${config.encryptionKey.substring(0, 20)}...`);

    console.log('\n🚀 下一步:');
    console.log('   1. 安装 PostgreSQL 依赖: npm install pg');
    console.log('   2. 启动开发服务器: npm run develop');
    console.log('   3. 访问管理面板: http://localhost:1337/admin');

    console.log('\n⚠️  安全提醒:');
    console.log('   - 请确保 .env 文件已添加到 .gitignore');
    console.log('   - 不要将 .env 文件提交到版本控制系统');
    console.log('   - 定期轮换密钥');

  } catch (error) {
    console.error('\n❌ 错误:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// 检查是否已存在 .env 文件
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  console.log('⚠️  警告: .env 文件已存在');
  rl.question('是否要覆盖现有文件? (y/N): ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      main();
    } else {
      console.log('操作已取消');
      rl.close();
    }
  });
} else {
  main();
}
