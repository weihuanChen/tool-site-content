# ---- Stage 1: Dependencies (安装依赖) ----
# 使用 Node 22-alpine 基础镜像，轻量且稳定
FROM node:22-alpine AS dependencies

WORKDIR /opt/app

# 设置构建和运行所需的 ARG/ENV 变量，确保 Admin Panel 构建时能找到正确的 URL
# 注意：敏感变量（如 DB 密码）将在运行时由 Zeabur 注入
ENV PATH /opt/app/node_modules/.bin:$PATH

# 复制 package.json 和 lockfile
# 修复: 将 yarn.lock 替换为 package-lock.json (或只复制 package.json)
COPY package.json package-lock.json ./ 

# 安装生产依赖
RUN npm install --omit=dev

# ---- Stage 2: Build (构建 Admin Panel) ----
FROM dependencies AS build

# 复制依赖
COPY --from=dependencies /opt/app/node_modules ./node_modules

# 复制所有项目文件 (包括修复后的 config/server.ts 和 config/database.ts)
COPY . .

# 运行 Strapi 构建命令 (生成 Admin Panel 静态文件)
# 确保在构建阶段使用 production 模式，这样 Admin Panel 才能正确加载 PUBLIC_URL
ARG NODE_ENV=production
RUN npm run build -- --production

# ---- Stage 3: Release (最终运行镜像) ----
# 使用更轻量的镜像，仅包含运行所需的文件
FROM node:22-alpine AS release

# 设置工作目录
WORKDIR /opt/app

# 复制 Node 依赖
COPY --from=dependencies /opt/app/node_modules ./node_modules

# 复制构建输出和源代码
COPY --from=build /opt/app/build ./build
COPY --from=build /opt/app/config ./config
COPY --from=build /opt/app/src ./src
COPY --from=build /opt/app/public ./public
COPY --from=build /opt/app/package.json ./package.json

# 暴露 Strapi 端口
EXPOSE 1337

# 设置运行时环境变量（这些值会被 Zeabur 环境变量覆盖）
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=1337

# 启动 Strapi
CMD ["npm", "run", "start"]
