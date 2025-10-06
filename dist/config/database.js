"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Strapi 数据库配置 (Fixed for PaaS/Zeabur)
 * 优先使用 DATABASE_URL，并强制 SSL/IPv4 兼容 PaaS 环境。
 */
const node_path_1 = __importDefault(require("node:path"));
exports.default = ({ env }) => {
    const client = env('DATABASE_CLIENT', 'sqlite');
    const databaseUrl = env('DATABASE_URL'); // 优先读取完整的 DATABASE_URL
    // 默认 PostgreSQL 连接配置 (使用单独变量)
    const defaultPostgresConnection = {
        host: env('DATABASE_HOST', 'localhost'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'strapi'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi'),
        schema: env('DATABASE_SCHEMA', 'public'),
    };
    // SSL 配置对象部分 (修复 Line 24 的类型问题，避免与 Knex.ConnectionConfig 冲突)
    const sslConnectionPart = env.bool('DATABASE_SSL', false) ? {
        ssl: {
            key: env('DATABASE_SSL_KEY', undefined),
            cert: env('DATABASE_SSL_CERT', undefined),
            ca: env('DATABASE_SSL_CA', undefined),
            capath: env('DATABASE_SSL_CAPATH', undefined),
            cipher: env('DATABASE_SSL_CIPHER', undefined),
            // 关键修复: 强制使用 false 解决云数据库证书验证问题
            rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', false),
        }
    } : {};
    // PostgreSQL 配置逻辑
    const postgresConfig = {
        client: 'postgres',
        // 优先使用 DATABASE_URL，并合并 SSL 配置
        connection: databaseUrl
            ? { connectionString: databaseUrl, ...sslConnectionPart } // 修复 Line 24 关联的类型问题
            : { ...defaultPostgresConnection, ...sslConnectionPart },
        pool: {
            min: env.int('DATABASE_POOL_MIN', 2),
            max: env.int('DATABASE_POOL_MAX', 10)
        },
    };
    const connections = {
        mysql: {
            client: 'mysql',
            connection: {
                host: env('DATABASE_HOST', 'localhost'),
                port: env.int('DATABASE_PORT', 3306),
                database: env('DATABASE_NAME', 'strapi'),
                user: env('DATABASE_USERNAME', 'strapi'),
                password: env('DATABASE_PASSWORD', 'strapi'),
                ssl: env.bool('DATABASE_SSL', false) && {
                    rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
                },
            },
            pool: {
                min: env.int('DATABASE_POOL_MIN', 2),
                max: env.int('DATABASE_POOL_MAX', 10)
            },
        },
        postgres: postgresConfig, // 使用修复后的 PostgreSQL 配置
        sqlite: {
            client: 'sqlite',
            connection: {
                filename: node_path_1.default.join(__dirname, '..', '..', env('DATABASE_FILENAME', '.tmp/data.db')),
            },
            useNullAsDefault: true,
        },
    };
    // 基础配置对象
    const baseConfig = {
        client,
        ...connections[client],
        acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    };
    // 关键修复: 强制 IPv4 解析 (解决 ENETUNREACH)
    if (client === 'postgres' && env.int('KNEX_DNS_LOOKUP_FAMILY')) {
        const family = env.int('KNEX_DNS_LOOKUP_FAMILY');
        // 检查连接是否为对象，然后使用类型断言安全地添加 options 属性
        if (typeof baseConfig.connection === 'object' && baseConfig.connection !== null && !Array.isArray(baseConfig.connection)) {
            const conn = baseConfig.connection;
            conn.options = {
                ...(conn.options || {}),
                family: family
            };
        }
    }
    return {
        connection: baseConfig,
    };
};
