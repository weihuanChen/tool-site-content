# API 文档

## 概述

本项目基于 Strapi 5.25.0 构建，提供完整的 RESTful API 接口。API 支持内容管理、用户认证、文件上传等核心功能。

## 基础信息

- **Base URL**: `http://localhost:1337/api`
- **Content-Type**: `application/json`
- **认证方式**: JWT Token / API Token

## 认证

### 1. JWT 认证

#### 管理员登录
```http
POST /admin/auth/local
Content-Type: application/json

{
  "identifier": "admin@example.com",
  "password": "password"
}
```

**响应**:
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "admin@example.com",
      "username": "admin"
    }
  }
}
```

#### 使用 JWT Token
```http
GET /api/articles
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. API Token 认证

#### 使用 API Token
```http
GET /api/articles
Authorization: Bearer your-api-token
```

## 内容管理 API

### 1. 文章管理 (示例)

#### 获取文章列表
```http
GET /api/articles
```

**查询参数**:
- `filters` - 过滤条件
- `populate` - 关联数据
- `sort` - 排序
- `pagination[page]` - 页码
- `pagination[pageSize]` - 每页数量

**示例**:
```http
GET /api/articles?filters[title][$contains]=strapi&populate=author&sort=createdAt:desc&pagination[page]=1&pagination[pageSize]=10
```

**响应**:
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "文章标题",
        "content": "文章内容",
        "publishedAt": "2023-12-01T00:00:00.000Z",
        "createdAt": "2023-12-01T00:00:00.000Z",
        "updatedAt": "2023-12-01T00:00:00.000Z",
        "author": {
          "data": {
            "id": 1,
            "attributes": {
              "name": "作者姓名"
            }
          }
        }
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "pageCount": 5,
      "total": 50
    }
  }
}
```

#### 获取单个文章
```http
GET /api/articles/{id}
```

**响应**:
```json
{
  "data": {
    "id": 1,
    "attributes": {
      "title": "文章标题",
      "content": "文章内容",
      "publishedAt": "2023-12-01T00:00:00.000Z",
      "createdAt": "2023-12-01T00:00:00.000Z",
      "updatedAt": "2023-12-01T00:00:00.000Z"
    }
  }
}
```

#### 创建文章
```http
POST /api/articles
Content-Type: application/json
Authorization: Bearer {token}

{
  "data": {
    "title": "新文章标题",
    "content": "新文章内容",
    "publishedAt": "2023-12-01T00:00:00.000Z"
  }
}
```

**响应**:
```json
{
  "data": {
    "id": 2,
    "attributes": {
      "title": "新文章标题",
      "content": "新文章内容",
      "publishedAt": "2023-12-01T00:00:00.000Z",
      "createdAt": "2023-12-01T00:00:00.000Z",
      "updatedAt": "2023-12-01T00:00:00.000Z"
    }
  }
}
```

#### 更新文章
```http
PUT /api/articles/{id}
Content-Type: application/json
Authorization: Bearer {token}

{
  "data": {
    "title": "更新的标题",
    "content": "更新的内容"
  }
}
```

#### 删除文章
```http
DELETE /api/articles/{id}
Authorization: Bearer {token}
```

**响应**:
```json
{
  "data": {
    "id": 1,
    "attributes": {
      "title": "文章标题",
      "content": "文章内容"
    }
  }
}
```

## 用户权限 API

### 1. 用户注册
```http
POST /api/auth/local/register
Content-Type: application/json

{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password123"
}
```

### 2. 用户登录
```http
POST /api/auth/local
Content-Type: application/json

{
  "identifier": "user@example.com",
  "password": "password123"
}
```

### 3. 获取用户信息
```http
GET /api/users/me
Authorization: Bearer {token}
```

### 4. 更新用户信息
```http
PUT /api/users/me
Content-Type: application/json
Authorization: Bearer {token}

{
  "username": "newusername",
  "email": "newemail@example.com"
}
```

## 文件上传 API

### 1. 上传文件
```http
POST /api/upload
Content-Type: multipart/form-data
Authorization: Bearer {token}

file: [binary data]
```

**响应**:
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "name": "example.jpg",
        "alternativeText": null,
        "caption": null,
        "width": 1920,
        "height": 1080,
        "formats": {
          "thumbnail": {
            "name": "thumbnail_example.jpg",
            "hash": "thumbnail_example_1234567890",
            "ext": ".jpg",
            "mime": "image/jpeg",
            "width": 156,
            "height": 88,
            "size": 4.05,
            "url": "/uploads/thumbnail_example_1234567890.jpg"
          }
        },
        "hash": "example_1234567890",
        "ext": ".jpg",
        "mime": "image/jpeg",
        "size": 95.9,
        "url": "/uploads/example_1234567890.jpg",
        "previewUrl": null,
        "provider": "local",
        "provider_metadata": null,
        "createdAt": "2023-12-01T00:00:00.000Z",
        "updatedAt": "2023-12-01T00:00:00.000Z"
      }
    }
  ]
}
```

### 2. 获取文件信息
```http
GET /api/upload/files/{id}
```

### 3. 删除文件
```http
DELETE /api/upload/files/{id}
Authorization: Bearer {token}
```

## 查询参数

### 1. 过滤 (Filters)

#### 基础过滤
```http
GET /api/articles?filters[title][$eq]=Strapi
GET /api/articles?filters[title][$ne]=Strapi
GET /api/articles?filters[title][$contains]=strapi
GET /api/articles?filters[title][$containsi]=strapi
GET /api/articles?filters[title][$startsWith]=Strapi
GET /api/articles?filters[title][$endsWith]=tutorial
```

#### 数值过滤
```http
GET /api/articles?filters[views][$gt]=100
GET /api/articles?filters[views][$gte]=100
GET /api/articles?filters[views][$lt]=1000
GET /api/articles?filters[views][$lte]=1000
```

#### 日期过滤
```http
GET /api/articles?filters[createdAt][$gte]=2023-01-01
GET /api/articles?filters[createdAt][$lte]=2023-12-31
```

#### 关联过滤
```http
GET /api/articles?filters[author][name][$eq]=John
GET /api/articles?filters[category][id][$eq]=1
```

#### 逻辑操作符
```http
GET /api/articles?filters[$or][0][title][$contains]=strapi&filters[$or][1][content][$contains]=tutorial
GET /api/articles?filters[$and][0][publishedAt][$notNull]=true&filters[$and][1][views][$gt]=100
```

### 2. 排序 (Sort)

```http
GET /api/articles?sort=title:asc
GET /api/articles?sort=createdAt:desc
GET /api/articles?sort[0]=title:asc&sort[1]=createdAt:desc
```

### 3. 分页 (Pagination)

```http
GET /api/articles?pagination[page]=1&pagination[pageSize]=10
GET /api/articles?pagination[pageSize]=25&pagination[withCount]=true
```

### 4. 关联数据 (Populate)

```http
GET /api/articles?populate=author
GET /api/articles?populate[0]=author&populate[1]=category
GET /api/articles?populate[author][populate][0]=profile
```

### 5. 字段选择 (Fields)

```http
GET /api/articles?fields[0]=title&fields[1]=content
```

## 错误处理

### 1. 错误响应格式
```json
{
  "data": null,
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Invalid input data",
    "details": {
      "errors": [
        {
          "path": ["title"],
          "message": "title is required",
          "name": "ValidationError"
        }
      ]
    }
  }
}
```

### 2. 常见错误码
- `400` - 请求参数错误
- `401` - 未授权
- `403` - 禁止访问
- `404` - 资源不存在
- `422` - 数据验证失败
- `500` - 服务器内部错误

## 速率限制

API 请求受到以下限制：
- 默认限制：25 条记录/请求
- 最大限制：100 条记录/请求
- 请求频率限制：根据配置而定

## 示例代码

### JavaScript (Fetch)
```javascript
// 获取文章列表
const response = await fetch('http://localhost:1337/api/articles', {
  headers: {
    'Authorization': 'Bearer your-token',
    'Content-Type': 'application/json'
  }
});
const data = await response.json();

// 创建文章
const newArticle = await fetch('http://localhost:1337/api/articles', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your-token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    data: {
      title: '新文章',
      content: '文章内容'
    }
  })
});
```

### cURL
```bash
# 获取文章列表
curl -X GET "http://localhost:1337/api/articles" \
  -H "Authorization: Bearer your-token"

# 创建文章
curl -X POST "http://localhost:1337/api/articles" \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{"data":{"title":"新文章","content":"文章内容"}}'
```

### Python (requests)
```python
import requests

# 获取文章列表
response = requests.get(
    'http://localhost:1337/api/articles',
    headers={'Authorization': 'Bearer your-token'}
)
data = response.json()

# 创建文章
new_article = requests.post(
    'http://localhost:1337/api/articles',
    headers={
        'Authorization': 'Bearer your-token',
        'Content-Type': 'application/json'
    },
    json={
        'data': {
            'title': '新文章',
            'content': '文章内容'
        }
    }
)
```
