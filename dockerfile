FROM node:22
LABEL "language"="nodejs"
LABEL "framework"="strapi"

WORKDIR /src
RUN npm install -f -g npm@10
COPY . .
RUN npm install
RUN npm run build

EXPOSE 8080
CMD ["npm", "run", "start"]
