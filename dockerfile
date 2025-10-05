Dockerfile
FROM node:22
LABEL "language"="nodejs"
LABEL "framework"="strapi"

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=1337
# 生产环境域名
ENV PUBLIC_URL=https://tool-site-content.zeabur.app

WORKDIR /src
RUN npm install -f -g npm@10
COPY . .
RUN npm install
RUN npm run build

EXPOSE 1337
CMD ["npm", "run", "start"]