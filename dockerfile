# ---- Stage 1: Dependencies (仅安装依赖，为了缓存) ----
  FROM node:22-alpine AS dependencies

  WORKDIR /opt/app
  ENV PATH /opt/app/node_modules/.bin:$PATH
  
  # 复制 package.json 和 lockfile
  COPY package.json package-lock.json ./ 
  
  # 安装生产依赖
  RUN npm install --omit=dev
  
  # ---- Stage 2: Release (最终运行镜像) ----
  FROM node:22-alpine AS release
  
  # 设置工作目录
  WORKDIR /opt/app
  EXPOSE 1337
  
  # 复制依赖
  COPY --from=dependencies /opt/app/node_modules ./node_modules
  
  # 复制源代码和配置文件
  # 注意：这些文件必须在本地存在
  COPY ./config ./config
  COPY ./src ./src
  COPY ./public ./public
  COPY ./package.json ./package.json
  
  # *** 核心修改：复制本地预编译的 Admin Panel 文件 ***
  # 假设 Admin Panel 资产位于 dist 文件夹
  # 重要的：Admin Panel 资产必须复制到 Strapi 期望的位置，这个位置通常是 Strapi 的根目录下的 'build' 文件夹
  # 但是在运行时，Strapi 会查找其配置路径。为了通用性，我们直接复制整个 dist 文件夹到根目录，
  # 或复制到 Strapi 的 build 路径。我们使用 'build' 作为目标文件夹名，因为 Strapi 会默认查找它。
  COPY ./dist ./build 
  # *** 核心修改结束 ***
  
  # 设置运行时环境变量（将被 Zeabur 环境变量覆盖）
  ENV NODE_ENV=production
  ENV HOST=0.0.0.0
  ENV PORT=1337
  
  # 启动 Strapi
  CMD ["npm", "run", "start"]
  