# 🚀 Getting started with Strapi + Supabase

This is a Strapi application configured to work with Supabase as the database. Strapi comes with a full featured [Command Line Interface](https://docs.strapi.io/dev-docs/cli) (CLI) which lets you scaffold and manage your project in seconds.

## 🚀 Quick Setup with Supabase

### Option 1: Automated Setup (Recommended)
```bash
# Install PostgreSQL dependency
npm run install:pg

# Run interactive setup
npm run setup:supabase

# Or use quick setup script
npm run setup:supabase:quick
```

### Option 2: Manual Setup
1. Install PostgreSQL dependency: `npm install pg`
2. Create `.env` file with your Supabase credentials
3. Generate security keys using the provided scripts

For detailed setup instructions, see [Quick Start Guide](./docs/快速开始.md).

## 📚 Documentation

- [Quick Start Guide](./docs/快速开始.md) - Get up and running quickly
- [Supabase Configuration Guide](./docs/Supabase配置指南.md) - Detailed Supabase setup
- [Connection Format Guide](./docs/连接格式说明.md) - Supabase connection format reference
- [Technical Architecture](./docs/技术架构.md) - System architecture overview
- [API Documentation](./docs/API文档.md) - Complete API reference

### `develop`

Start your Strapi application with autoReload enabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-develop)

```
npm run develop
# or
yarn develop
```

### `start`

Start your Strapi application with autoReload disabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-start)

```
npm run start
# or
yarn start
```

### `build`

Build your admin panel. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-build)

```
npm run build
# or
yarn build
```

## ⚙️ Deployment

Strapi gives you many possible deployment options for your project including [Strapi Cloud](https://cloud.strapi.io). Browse the [deployment section of the documentation](https://docs.strapi.io/dev-docs/deployment) to find the best solution for your use case.

```
yarn strapi deploy
```

## 📚 Learn more

- [Resource center](https://strapi.io/resource-center) - Strapi resource center.
- [Strapi documentation](https://docs.strapi.io) - Official Strapi documentation.
- [Strapi tutorials](https://strapi.io/tutorials) - List of tutorials made by the core team and the community.
- [Strapi blog](https://strapi.io/blog) - Official Strapi blog containing articles made by the Strapi team and the community.
- [Changelog](https://strapi.io/changelog) - Find out about the Strapi product updates, new features and general improvements.

Feel free to check out the [Strapi GitHub repository](https://github.com/strapi/strapi). Your feedback and contributions are welcome!

## ✨ Community

- [Discord](https://discord.strapi.io) - Come chat with the Strapi community including the core team.
- [Forum](https://forum.strapi.io/) - Place to discuss, ask questions and find answers, show your Strapi project and get feedback or just talk with other Community members.
- [Awesome Strapi](https://github.com/strapi/awesome-strapi) - A curated list of awesome things related to Strapi.

---

<sub>🤫 Psst! [Strapi is hiring](https://strapi.io/careers).</sub>
