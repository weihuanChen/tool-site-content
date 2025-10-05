# 作者国际化 API 使用指南

## 概述

作者模型已成功配置国际化支持，支持以下语言：
- 简体中文 (zh-Hans) - 默认语言
- 繁体中文 (zh)
- 英文 (en)
- 日文 (ja)
- 韩文 (ko)

## API 端点

### 基础 CRUD 操作

#### 1. 获取所有作者
```http
GET /api/authors?locale=zh-Hans
GET /api/authors?locale=en
```

#### 2. 获取单个作者
```http
GET /api/authors/1?locale=zh-Hans
GET /api/authors/1?locale=en
```

#### 3. 创建作者
```http
POST /api/authors?locale=zh-Hans
Content-Type: application/json

{
  "data": {
    "username": "zhang_san",
    "displayName": "张三",
    "bio": "资深前端开发工程师",
    "email": "zhangsan@example.com",
    "socialLinks": {
      "github": "https://github.com/zhangsan",
      "twitter": "https://twitter.com/zhangsan"
    }
  }
}
```

#### 4. 更新作者
```http
PUT /api/authors/1?locale=zh-Hans
Content-Type: application/json

{
  "data": {
    "displayName": "张三（更新）",
    "bio": "更新后的个人简介"
  }
}
```

### 国际化专用 API

#### 1. 获取作者的所有语言版本
```http
GET /api/authors/1/all-locales
```

响应示例：
```json
{
  "data": {
    "id": 1,
    "username": "zhang_san",
    "displayName": "张三",
    "bio": "资深前端开发工程师",
    "locale": "zh-Hans",
    "localizations": [
      {
        "id": 2,
        "displayName": "Zhang San",
        "bio": "Senior Frontend Developer",
        "locale": "en"
      },
      {
        "id": 3,
        "displayName": "張三",
        "bio": "資深前端開發工程師",
        "locale": "zh"
      }
    ]
  }
}
```

#### 2. 根据语言获取作者
```http
GET /api/authors/1/locale/en
```

#### 3. 创建多语言作者
```http
POST /api/authors/multi-locale
Content-Type: application/json

{
  "data": {
    "username": "zhang_san",
    "displayName": "张三",
    "bio": "资深前端开发工程师",
    "email": "zhangsan@example.com"
  },
  "locales": ["zh-Hans", "en", "ja"]
}
```

#### 4. 获取作者可用的语言版本
```http
GET /api/authors/1/available-locales
```

响应示例：
```json
{
  "data": ["zh-Hans", "en", "ja"]
}
```

#### 5. 同步作者信息到所有语言版本
```http
PUT /api/authors/1/sync-all-locales
Content-Type: application/json

{
  "data": {
    "bio": "更新后的个人简介",
    "socialLinks": {
      "github": "https://github.com/zhangsan",
      "linkedin": "https://linkedin.com/in/zhangsan"
    }
  }
}
```

## 数据模型

### 作者字段说明

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| username | string | 是 | 用户名（唯一） |
| displayName | string | 是 | 显示名称（可本地化） |
| bio | text | 否 | 个人简介（可本地化） |
| email | email | 否 | 邮箱地址（唯一） |
| avatar | media | 否 | 头像图片 |
| socialLinks | json | 否 | 社交媒体链接 |
| locale | string | 是 | 语言环境 |
| localizations | relation | 否 | 其他语言版本 |

### 社交媒体链接格式
```json
{
  "github": "https://github.com/username",
  "twitter": "https://twitter.com/username",
  "linkedin": "https://linkedin.com/in/username",
  "website": "https://example.com"
}
```

## 使用场景

### 1. 多语言网站
为不同语言的网站版本提供相应的作者信息。

### 2. 内容管理
在管理后台中为不同语言版本创建和管理作者信息。

### 3. API 集成
前端应用可以根据用户的语言偏好获取相应的作者信息。

## 注意事项

1. **默认语言**：系统默认语言为简体中文 (zh-Hans)
2. **唯一性约束**：username 和 email 字段在所有语言版本中必须唯一
3. **本地化字段**：displayName 和 bio 字段支持本地化
4. **关联关系**：localizations 字段自动维护不同语言版本之间的关联
5. **媒体文件**：avatar 字段支持图片上传，建议使用统一的头像

## 错误处理

### 常见错误码

- `400` - 请求参数错误
- `404` - 作者不存在
- `409` - 用户名或邮箱已存在
- `422` - 数据验证失败

### 错误响应示例
```json
{
  "data": null,
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "username is required",
    "details": {
      "errors": [
        {
          "path": ["username"],
          "message": "username is required",
          "name": "ValidationError"
        }
      ]
    }
  }
}
```

## 最佳实践

1. **创建作者时**：建议先创建默认语言版本，再创建其他语言版本
2. **更新信息时**：使用同步功能可以一次性更新所有语言版本
3. **查询优化**：使用 locale 参数可以只获取特定语言的数据
4. **数据一致性**：定期检查不同语言版本之间的数据一致性
