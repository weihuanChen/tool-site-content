# Article 文章数据库字段说明

## 概述

本文档详细说明了 Article 文章模型在数据库中的字段结构、类型映射和约束条件。Article 模型支持多语言国际化（i18n）和草稿发布功能。

## 数据库表信息

- **表名**: `articles`
- **内容类型**: Collection Type
- **国际化支持**: 是
- **草稿发布**: 是

## 字段详细说明

### 1. 基础字段

#### `id`
- **Strapi 类型**: 自动生成
- **数据库类型**: `SERIAL PRIMARY KEY`
- **说明**: 主键，自动递增
- **约束**: 非空，唯一

#### `document_id`
- **Strapi 类型**: 自动生成
- **数据库类型**: `VARCHAR(255)`
- **说明**: 文档唯一标识符，用于国际化版本关联
- **约束**: 非空，唯一

#### `created_at`
- **Strapi 类型**: 自动生成
- **数据库类型**: `TIMESTAMP`
- **说明**: 创建时间
- **约束**: 非空

#### `updated_at`
- **Strapi 类型**: 自动生成
- **数据库类型**: `TIMESTAMP`
- **说明**: 更新时间
- **约束**: 非空

#### `published_at`
- **Strapi 类型**: 自动生成
- **数据库类型**: `TIMESTAMP`
- **说明**: 发布时间（草稿发布功能）
- **约束**: 可为空

#### `created_by_id`
- **Strapi 类型**: 自动生成
- **数据库类型**: `INTEGER`
- **说明**: 创建者用户ID
- **约束**: 可为空

#### `updated_by_id`
- **Strapi 类型**: 自动生成
- **数据库类型**: `INTEGER`
- **说明**: 更新者用户ID
- **约束**: 可为空

### 2. 内容字段

#### `title`
- **Strapi 类型**: `string`
- **数据库类型**: `VARCHAR(255)`
- **说明**: 文章标题
- **国际化**: 是
- **约束**: 非空，唯一
- **用途**: 文章主标题，用于显示和SEO

#### `slug`
- **Strapi 类型**: `uid`
- **数据库类型**: `VARCHAR(255)`
- **说明**: URL友好的唯一标识符
- **国际化**: 是
- **约束**: 非空
- **用途**: 生成文章URL路径

#### `description`
- **Strapi 类型**: `text`
- **数据库类型**: `TEXT`
- **说明**: 文章描述/摘要
- **国际化**: 是
- **约束**: 唯一
- **用途**: 文章简介，用于列表显示和SEO

#### `content`
- **Strapi 类型**: `richtext`
- **数据库类型**: `TEXT`
- **说明**: 文章正文内容（富文本）
- **国际化**: 是
- **约束**: 无
- **用途**: 文章主要内容

### 3. 媒体字段

#### `coverImage`
- **Strapi 类型**: `media`
- **数据库类型**: `INTEGER` (关联到 files 表)
- **说明**: 封面图片
- **国际化**: 否
- **约束**: 可为空
- **允许类型**: images, files, videos, audios
- **用途**: 文章封面图片

### 4. 关系字段

#### `author`
- **Strapi 类型**: `relation` (manyToOne)
- **数据库类型**: `INTEGER` (关联到 authors 表)
- **说明**: 文章作者
- **关系类型**: 多对一
- **约束**: 可为空
- **用途**: 关联文章作者信息

#### `originalArticle`
- **Strapi 类型**: `relation` (oneToOne)
- **数据库类型**: `INTEGER` (关联到 articles 表)
- **说明**: 原始文章（用于多语言版本关联）
- **关系类型**: 一对一
- **约束**: 可为空
- **用途**: 链接不同语言版本的同一篇文章

### 5. JSON 字段

#### `tags`
- **Strapi 类型**: `json`
- **数据库类型**: `JSONB`
- **说明**: 文章标签
- **国际化**: 是
- **约束**: 无
- **用途**: 存储文章标签数组

#### `codeSnippets`
- **Strapi 类型**: `json`
- **数据库类型**: `JSONB`
- **说明**: 代码片段
- **国际化**: 是
- **约束**: 无
- **用途**: 存储文章中的代码示例

### 6. SEO 字段

#### `metaTitle`
- **Strapi 类型**: `string`
- **数据库类型**: `VARCHAR(255)`
- **说明**: SEO 元标题
- **国际化**: 是
- **约束**: 无
- **用途**: 页面标题，用于搜索引擎优化

#### `metaDescription`
- **Strapi 类型**: `string`
- **数据库类型**: `VARCHAR(255)`
- **说明**: SEO 元描述
- **国际化**: 是
- **约束**: 无
- **用途**: 页面描述，用于搜索引擎优化

### 7. 多语言字段

#### `language`
- **Strapi 类型**: `enumeration`
- **数据库类型**: `VARCHAR(50)`
- **说明**: 文章语言
- **国际化**: 是
- **约束**: 非空，默认值 'ja'
- **可选值**: ja, en, zh, es
- **用途**: 标识文章的语言版本

#### `locale`
- **Strapi 类型**: 自动生成
- **数据库类型**: `VARCHAR(10)`
- **说明**: 语言环境标识
- **约束**: 非空
- **用途**: 国际化系统内部使用

### 8. 站点信息字段

#### `domain`
- **Strapi 类型**: `string`
- **数据库类型**: `VARCHAR(255)`
- **说明**: 网站域名
- **国际化**: 是
- **约束**: 非空，不唯一
- **用途**: 标识文章所属的网站域名

#### `siteName`
- **Strapi 类型**: `string`
- **数据库类型**: `VARCHAR(255)`
- **说明**: 网站名称
- **国际化**: 是
- **约束**: 非空，不唯一
- **用途**: 标识文章所属的网站名称

## 数据库索引建议

### 主要索引
```sql
-- 主键索引（自动创建）
PRIMARY KEY (id)

-- 唯一索引
CREATE UNIQUE INDEX idx_articles_document_id ON articles(document_id);
CREATE UNIQUE INDEX idx_articles_title ON articles(title);
CREATE UNIQUE INDEX idx_articles_description ON articles(description);

-- 复合索引（用于多语言查询）
CREATE INDEX idx_articles_locale_language ON articles(locale, language);
CREATE INDEX idx_articles_domain_language ON articles(domain, language);

-- 外键索引
CREATE INDEX idx_articles_author_id ON articles(author);
CREATE INDEX idx_articles_original_article_id ON articles(original_article);

-- 时间索引
CREATE INDEX idx_articles_published_at ON articles(published_at);
CREATE INDEX idx_articles_created_at ON articles(created_at);
```

### 全文搜索索引
```sql
-- 标题和内容全文搜索
CREATE INDEX idx_articles_title_gin ON articles USING gin(to_tsvector('english', title));
CREATE INDEX idx_articles_content_gin ON articles USING gin(to_tsvector('english', content));
```

## 查询优化建议

### 1. 常用查询模式
```sql
-- 按语言查询已发布文章
SELECT * FROM articles 
WHERE locale = 'ja' AND language = 'ja' AND published_at IS NOT NULL
ORDER BY published_at DESC;

-- 按作者查询文章
SELECT * FROM articles 
WHERE author = 1 AND published_at IS NOT NULL
ORDER BY created_at DESC;

-- 按域名查询文章
SELECT * FROM articles 
WHERE domain = 'example.com' AND published_at IS NOT NULL
ORDER BY published_at DESC;
```

### 2. 多语言查询
```sql
-- 查询同一文档的所有语言版本
SELECT * FROM articles 
WHERE document_id = 'doc_123'
ORDER BY language;

-- 查询特定语言的文章
SELECT * FROM articles 
WHERE language = 'zh' AND published_at IS NOT NULL
ORDER BY published_at DESC;
```

## 注意事项

1. **国际化字段**: 所有标记为 `localized: true` 的字段都会为每种语言创建单独的记录
2. **唯一性约束**: `title` 和 `description` 字段有唯一性约束，确保不会重复
3. **草稿发布**: 通过 `published_at` 字段控制文章的发布状态
4. **JSON 字段**: `tags` 和 `codeSnippets` 使用 JSONB 类型，支持高效的 JSON 查询
5. **媒体文件**: `coverImage` 字段关联到 Strapi 的文件系统
6. **关系维护**: 作者关系通过外键维护，确保数据一致性

## 版本历史

- **v1.0** - 初始版本，包含基础文章字段
- **v1.1** - 添加多语言支持
- **v1.2** - 添加 SEO 字段和站点信息字段
- **v1.3** - 优化字段类型，description 改为 text 类型
