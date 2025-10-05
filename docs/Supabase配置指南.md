# Supabase 配置指南

## 概述

本指南将帮助您配置 Strapi 项目以使用 Supabase 作为数据库。Supabase 提供 PostgreSQL 数据库服务，与 Strapi 完全兼容。

## 步骤 1: 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com)
2. 注册或登录账户
3. 创建新项目
4. 记录项目信息：
   - 项目引用 ID (Project Reference)
   - 数据库密码
   - 项目 URL

## 步骤 2: 获取数据库连接信息

在 Supabase 项目仪表板中：

1. 进入 **Settings** > **Database**
2. 找到 **Connection string** 部分
3. 选择 **URI** 格式
4. 复制连接字符串

连接字符串格式：
```
postgresql://postgres:[YOUR_PASSWORD]@db.[YOUR_PROJECT_REF].supabase.co:5432/postgres
```

**重要提醒**：请确保连接字符串中不包含 `https://` 前缀，正确的格式是 `db.[YOUR_PROJECT_REF].supabase.co`，而不是 `db.https://[YOUR_PROJECT_REF].supabase.co`。

## 步骤 3: 创建 .env 文件

在项目根目录创建 `.env` 文件，内容如下：

```bash
# =================================
# Strapi 环境变量配置
# 使用 Supabase 作为数据库
# =================================

# =================================
# 应用基础配置
# =================================
# 应用密钥 (必需) - 用于加密会话和应用数据
APP_KEYS=your-app-keys-here

# 服务器配置
HOST=0.0.0.0
PORT=1337

# =================================
# 数据库配置 (Supabase PostgreSQL)
# =================================
# 数据库客户端类型
DATABASE_CLIENT=postgres

# Supabase 数据库连接 URL
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.[YOUR_PROJECT_REF].supabase.co:5432/postgres

# 或者使用单独的连接参数
DATABASE_HOST=db.[YOUR_PROJECT_REF].supabase.co
DATABASE_PORT=5432
DATABASE_NAME=postgres
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=[YOUR_PASSWORD]

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
ADMIN_JWT_SECRET=your-admin-jwt-secret-here

# API 令牌盐值
API_TOKEN_SALT=your-api-token-salt-here

# 传输令牌盐值
TRANSFER_TOKEN_SALT=your-transfer-token-salt-here

# 数据加密密钥
ENCRYPTION_KEY=your-encryption-key-here

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
```

## 步骤 4: 生成安全密钥

运行以下命令生成必需的安全密钥：

```bash
# 生成应用密钥
node -e "console.log('APP_KEYS=' + require('crypto').randomBytes(32).toString('base64'))"

# 生成管理员 JWT 密钥
node -e "console.log('ADMIN_JWT_SECRET=' + require('crypto').randomBytes(64).toString('base64'))"

# 生成 API 令牌盐值
node -e "console.log('API_TOKEN_SALT=' + require('crypto').randomBytes(32).toString('base64'))"

# 生成传输令牌盐值
node -e "console.log('TRANSFER_TOKEN_SALT=' + require('crypto').randomBytes(32).toString('base64'))"

# 生成数据加密密钥
node -e "console.log('ENCRYPTION_KEY=' + require('crypto').randomBytes(32).toString('base64'))"
```

## 步骤 5: 更新 .env 文件

将生成的密钥替换 `.env` 文件中的占位符：

1. 将 `[YOUR_PASSWORD]` 替换为您的 Supabase 数据库密码
2. 将 `[YOUR_PROJECT_REF]` 替换为您的 Supabase 项目引用 ID
3. 将生成的密钥替换相应的占位符

## 步骤 6: 安装 PostgreSQL 依赖

确保安装了 PostgreSQL 客户端：

```bash
npm install pg
```

## 步骤 7: 测试连接

启动 Strapi 开发服务器：

```bash
npm run develop
```

如果配置正确，您应该看到：
- 数据库连接成功
- Strapi 管理面板可在 `http://localhost:1337/admin` 访问

## 故障排除

### 常见问题

1. **SSL 连接错误**
   - 确保 `DATABASE_SSL=true`
   - 确保 `DATABASE_SSL_REJECT_UNAUTHORIZED=false`

2. **连接超时**
   - 检查网络连接
   - 验证 Supabase 项目是否处于活动状态
   - 检查防火墙设置

3. **认证失败**
   - 验证数据库密码是否正确
   - 检查项目引用 ID 是否正确

4. **权限错误**
   - 确保 Supabase 项目已正确配置
   - 检查数据库用户权限

5. **连接格式错误**
   - 确保 `DATABASE_URL` 格式正确：`postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres`
   - 确保 `DATABASE_HOST` 格式正确：`db.[PROJECT_REF].supabase.co`
   - 不要包含 `https://` 前缀在主机名中

### 调试模式

启用详细日志：

```bash
DEBUG=strapi:* npm run develop
```

## 生产环境配置

### 环境变量

在生产环境中，确保设置：

```bash
NODE_ENV=production
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=true
```

### 安全建议

1. 使用强密码
2. 定期轮换密钥
3. 启用 Supabase 的行级安全策略
4. 配置适当的数据库权限
5. 使用环境变量管理敏感信息

## Supabase 特定功能

### 行级安全策略 (RLS)

在 Supabase 中，您可以配置行级安全策略来控制数据访问：

```sql
-- 示例：只允许认证用户访问自己的数据
CREATE POLICY "Users can view own data" ON users
FOR SELECT USING (auth.uid() = id);
```

### 实时订阅

Supabase 支持实时数据订阅，可以与 Strapi 结合使用：

```javascript
// 示例：监听数据变化
const subscription = supabase
  .channel('articles')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'articles' },
    (payload) => console.log('Change received!', payload)
  )
  .subscribe();
```

## 监控和维护

### 数据库监控

1. 使用 Supabase 仪表板监控数据库性能
2. 设置查询性能监控
3. 配置自动备份

### 日志管理

1. 配置应用日志
2. 设置错误监控
3. 使用 Supabase 的日志功能

## 备份和恢复

### 自动备份

Supabase 提供自动备份功能：
- 每日自动备份
- 可配置保留期
- 一键恢复功能

### 手动备份

```bash
# 使用 pg_dump 创建备份
pg_dump "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres" > backup.sql

# 恢复备份
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres" < backup.sql
```

## 性能优化

### 连接池配置

```bash
# 根据应用负载调整连接池
DATABASE_POOL_MIN=5
DATABASE_POOL_MAX=20
```

### 查询优化

1. 使用适当的索引
2. 优化查询语句
3. 使用 Supabase 的查询分析工具

## 安全最佳实践

1. **网络安全**
   - 使用 HTTPS
   - 配置适当的 CORS 策略
   - 启用防火墙

2. **数据安全**
   - 加密敏感数据
   - 使用强密码策略
   - 定期安全审计

3. **访问控制**
   - 实施最小权限原则
   - 使用 API 令牌
   - 配置适当的用户角色

## 总结

通过以上配置，您的 Strapi 项目将成功连接到 Supabase 数据库。Supabase 提供了强大的 PostgreSQL 功能，包括实时订阅、行级安全策略和自动备份等特性，为您的应用提供了可靠的数据存储解决方案。
