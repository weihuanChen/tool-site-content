#!/bin/bash

# Strapi + Supabase 快速设置脚本
# 用于快速生成 .env 文件

echo "🚀 Strapi + Supabase 快速设置"
echo "================================"

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js，请先安装 Node.js"
    exit 1
fi

# 检查是否已存在 .env 文件
if [ -f ".env" ]; then
    echo "⚠️  警告: .env 文件已存在"
    read -p "是否要覆盖现有文件? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "操作已取消"
        exit 0
    fi
fi

# 获取用户输入
echo
read -p "请输入您的 Supabase 项目引用 ID: " RAW_PROJECT_REF
read -s -p "请输入您的 Supabase 数据库密码: " DB_PASSWORD
echo

# 验证和清理项目引用 ID
PROJECT_REF=$(echo "$RAW_PROJECT_REF" | sed 's|^https://||' | sed 's|\.supabase\.co$||' | sed 's|^db\.||')

echo "🔍 验证输入信息:"
echo "   - 原始项目 ID: $RAW_PROJECT_REF"
echo "   - 清理后项目 ID: $PROJECT_REF"
echo "   - 数据库密码: $(printf '*%.0s' $(seq 1 ${#DB_PASSWORD}))"

if [ "$PROJECT_REF" != "$RAW_PROJECT_REF" ]; then
    echo "⚠️  注意: 已自动清理项目 ID 格式，移除了不必要的前缀和后缀"
fi
echo

# 生成安全密钥
echo "🔐 生成安全密钥..."
APP_KEYS=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
ADMIN_JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('base64'))")
API_TOKEN_SALT=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
TRANSFER_TOKEN_SALT=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
ENCRYPTION_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")

# 创建 .env 文件
cat > .env << EOF
# =================================
# Strapi 环境变量配置
# 使用 Supabase 作为数据库
# 生成时间: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
# =================================

# =================================
# 应用基础配置
# =================================
# 应用密钥 (必需) - 用于加密会话和应用数据
APP_KEYS=${APP_KEYS}

# 服务器配置
HOST=0.0.0.0
PORT=1337

# =================================
# 数据库配置 (Supabase PostgreSQL)
# =================================
# 数据库客户端类型
DATABASE_CLIENT=postgres

# Supabase 数据库连接 URL
DATABASE_URL=postgresql://postgres:${DB_PASSWORD}@db.${PROJECT_REF}.supabase.co:5432/postgres

# 或者使用单独的连接参数
DATABASE_HOST=db.${PROJECT_REF}.supabase.co
DATABASE_PORT=5432
DATABASE_NAME=postgres
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=${DB_PASSWORD}

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
ADMIN_JWT_SECRET=${ADMIN_JWT_SECRET}

# API 令牌盐值
API_TOKEN_SALT=${API_TOKEN_SALT}

# 传输令牌盐值
TRANSFER_TOKEN_SALT=${TRANSFER_TOKEN_SALT}

# 数据加密密钥
ENCRYPTION_KEY=${ENCRYPTION_KEY}

# =================================
# 功能标志
# =================================
# 启用 NPS 调查
FLAG_NPS=true

# 推广企业版功能
FLAG_PROMOTE_EE=true

# =================================
# 开发环境配置
# =================================
# 环境类型
NODE_ENV=development

# 日志级别
LOG_LEVEL=info
EOF

echo "✅ .env 文件已成功创建！"
echo "📁 文件位置: $(pwd)/.env"
echo
echo "📋 配置摘要:"
echo "   - Supabase 项目: ${PROJECT_REF}"
echo "   - 数据库: PostgreSQL"
echo "   - SSL: 启用"
echo "   - 连接池: 2-10 连接"
echo
echo "🔑 已生成的安全密钥:"
echo "   - APP_KEYS: ${APP_KEYS:0:20}..."
echo "   - ADMIN_JWT_SECRET: ${ADMIN_JWT_SECRET:0:20}..."
echo "   - API_TOKEN_SALT: ${API_TOKEN_SALT:0:20}..."
echo "   - TRANSFER_TOKEN_SALT: ${TRANSFER_TOKEN_SALT:0:20}..."
echo "   - ENCRYPTION_KEY: ${ENCRYPTION_KEY:0:20}..."
echo
echo "🚀 下一步:"
echo "   1. 安装 PostgreSQL 依赖: npm install pg"
echo "   2. 启动开发服务器: npm run develop"
echo "   3. 访问管理面板: http://localhost:1337/admin"
echo
echo "⚠️  安全提醒:"
echo "   - 请确保 .env 文件已添加到 .gitignore"
echo "   - 不要将 .env 文件提交到版本控制系统"
echo "   - 定期轮换密钥"
