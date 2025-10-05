#!/bin/sh

# 启动 Strapi 应用
echo "🚀 启动 Strapi 应用..."
cd /app
su -s /bin/sh strapi -c "npm start" &

# 等待 Strapi 启动
echo "⏳ 等待 Strapi 启动..."
sleep 10

# 检查 Strapi 是否启动成功
while ! curl -f http://localhost:1337/health > /dev/null 2>&1; do
    echo "⏳ 等待 Strapi 启动..."
    sleep 2
done

echo "✅ Strapi 启动成功"

# 启动 Nginx
echo "🚀 启动 Nginx..."
nginx -g "daemon off;"
