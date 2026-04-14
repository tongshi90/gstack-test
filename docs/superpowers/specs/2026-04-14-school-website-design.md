# XX中学官方网站设计文档

## 项目概述

为XX中学开发一个官方网站，包含学校信息展示、在线报名系统和后台管理功能。

**项目类型**：新建项目
**项目规模**：中型 Web 应用
**开发方式**：前后端分离
**容器化**：Docker + Docker Compose

---

## 需求摘要

### 1. 功能需求

#### 前台网站（面向公众）
- 学校介绍页面（学校简介、师资力量、校园风光）
- 新闻中心（新闻列表、新闻详情）
- 通知公告（公告列表、公告详情，支持置顶）
- 在线报名系统（分步表单）
- 报名须知（报名流程、所需材料、联系方式）
- 联系我们页面

#### 在线报名系统
- 分步表单设计（3步）
  - 步骤1：学生基本信息（姓名、性别、出生日期、身份证号、家庭住址、联系电话）
  - 步骤2：父母/监护人信息（父亲、母亲姓名、电话、工作单位）
  - 步骤3：确认提交
- 报名完成后显示报名号
- 支持修改和保存草稿

#### 后台管理系统
- 新闻管理（发布、编辑、删除、列表查询）
- 公告管理（发布、编辑、删除、列表查询、置顶）
- 报名管理（查看列表、查看详情、导出Excel）

### 2. 非功能需求

- **安全性**：基础验证（前端表单验证 + 后端必填字段检查）
- **可用性**：响应式设计，支持主流浏览器
- **可维护性**：前后端分离，代码结构清晰
- **可部署性**：Docker 容器化部署

---

## 技术选型

### 前端技术栈
- **框架**：React 18
- **语言**：TypeScript
- **构建工具**：Vite
- **UI 框架**：Ant Design
- **状态管理**：React Context API
- **路由**：React Router
- **HTTP 客户端**：Axios
- **表单处理**：Ant Design Form

### 后端技术栈
- **运行时**：Python 3.10+
- **框架**：FastAPI
- **语言**：Python 3
- **ORM**：SQLAlchemy
- **验证**：Pydantic
- **Excel 导出**：openpyxl
- **异步支持**：asyncio

### 数据库
- **数据库**：SQLite

### 开发工具
- **容器化**：Docker + Docker Compose
- **代码规范**：ESLint + Prettier
- **Git**：版本控制

---

## 系统架构

### 架构概览

```
┌─────────────────┐
│                 │
│   前端 (React)  │
│   Nginx:8083     │
│                 │
└────────┬────────┘
         │ HTTP/HTTPS
         │
┌────────▼────────┐
│                 │
│  后端 (FastAPI) │
│   Port:8084     │
│                 │
└────────┬────────┘
         │
         │
┌────────▼────────┐
│                 │
│   SQLite        │
│   (文件存储)     │
│                 │
└─────────────────┘
```

### 架构说明

1. **前后端分离**：前端和后端独立开发和部署
2. **RESTful API**：前后端通过 HTTP API 通信
3. **SQLite**：轻量级文件数据库，适合中小型应用
4. **Docker Compose**：统一管理服务容器

---

## 数据模型设计

### NewsCategory（新闻分类枚举）

新闻分类固定为以下三种：
- `SCHOOL_INTRO` - 学校简介
- `CAMPUS_NEWS` - 校园动态
- `EXCELLENT_TEACHERS_STUDENTS` - 优秀师生

### News（新闻）

```json
{
  "id": "integer (主键，自增)",
  "title": "string (必填)",
  "content": "string (必填)",
  "category": "string (必填，枚举: SCHOOL_INTRO/CAMPUS_NEWS/EXCELLENT_TEACHERS_STUDENTS)",
  "coverImage": "string (URL, 可选)",
  "publishTime": "datetime",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Announcement（公告）

```json
{
  "id": "integer (主键，自增)",
  "title": "string (必填)",
  "content": "string (必填)",
  "isPinned": "boolean (默认: false)",
  "publishTime": "datetime",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Registration（报名）

```json
{
  "id": "integer (主键，自增)",
  "registrationNumber": "string (唯一)",
  "student": {
    "name": "string (必填)",
    "gender": "string (male/female, 必填)",
    "birthDate": "datetime (必填)",
    "idCard": "string (必填, 格式验证)",
    "address": "string (必填)",
    "phone": "string (必填, 格式验证)"
  },
  "parents": {
    "father": {
      "name": "string (必填)",
      "phone": "string (必填)",
      "workUnit": "string (可选)"
    },
    "mother": {
      "name": "string (必填)",
      "phone": "string (必填)",
      "workUnit": "string (可选)"
    }
  },
  "status": "string (draft/submitted, 默认: draft)",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

---

## API 接口设计

### 前台 API

#### 新闻相关
- `GET /api/news` - 获取新闻列表
  - Query: `page`, `pageSize`, `startDate`, `endDate`, `category`
  - Response: `{ data: News[], total: number }`

- `GET /api/news/categories` - 获取新闻分类列表
  - Response: `[SCHOOL_INTRO, CAMPUS_NEWS, EXCELLENT_TEACHERS_STUDENTS]`

- `GET /api/news/:id` - 获取新闻详情
  - Response: `News`

#### 公告相关
- `GET /api/announcements` - 获取公告列表
  - Query: `page`, `pageSize`, `startDate`, `endDate`
  - Response: `{ data: Announcement[], total: number }`
  
- `GET /api/announcements/:id` - 获取公告详情
  - Response: `Announcement`

#### 报名相关
- `POST /api/registrations` - 提交报名信息
  - Body: `Registration` (status: submitted)
  - Response: `{ registrationNumber: string }`
  
- `POST /api/registrations/draft` - 保存草稿
  - Body: `Registration` (status: draft, 若已有草稿则更新)
  - Response: `{ registrationNumber: string }`
  
- `GET /api/registrations/:registrationNumber` - 获取报名信息（包含草稿）
  - Response: `Registration`
  
- `PUT /api/registrations/:registrationNumber` - 更新报名信息（草稿状态）
  - Body: `Registration` (部分字段)
  - Response: `Registration`

### 后台 API

#### 新闻管理
- `POST /api/admin/news` - 创建新闻
  - Body: `News` (不含 _id)
  - Response: `News`
  
- `PUT /api/admin/news/:id` - 更新新闻
  - Body: `News` (部分字段)
  - Response: `News`
  
- `DELETE /api/admin/news/:id` - 删除新闻
  - Response: `{ success: boolean }`

#### 公告管理
- `POST /api/admin/announcements` - 创建公告
  - Body: `Announcement` (不含 _id)
  - Response: `Announcement`
  
- `PUT /api/admin/announcements/:id` - 更新公告
  - Body: `Announcement` (部分字段)
  - Response: `Announcement`
  
- `DELETE /api/admin/announcements/:id` - 删除公告
  - Response: `{ success: boolean }`

#### 报名管理
- `GET /api/admin/registrations` - 获取报名列表
  - Query: `page`, `pageSize`, `name`, `startDate`, `endDate`
  - Response: `{ data: Registration[], total: number }`
  
- `GET /api/admin/registrations/:id` - 获取报名详情
  - Response: `Registration`
  
- `GET /api/admin/registrations/export` - 导出报名数据
  - Query: `startDate`, `endDate`
  - Response: File (xlsx)

---

## 项目结构

### 前端仓库 (frontend/)

```
frontend/
├── src/
│   ├── components/           # 公共组件
│   │   ├── Header/          # 页头组件
│   │   ├── Footer/          # 页脚组件
│   │   └── Pagination/      # 分页组件
│   ├── pages/                # 页面组件
│   │   ├── Home/            # 首页
│   │   ├── SchoolIntro/     # 学校介绍
│   │   ├── News/            # 新闻中心
│   │   │   ├── List.tsx
│   │   │   └── Detail.tsx
│   │   ├── Announcements/   # 通知公告
│   │   │   ├── List.tsx
│   │   │   └── Detail.tsx
│   │   ├── Registration/    # 在线报名
│   │   │   ├── Form.tsx     # 分步表单
│   │   │   └── Success.tsx  # 提交成功页
│   │   ├── Notice/          # 报名须知
│   │   ├── Contact/         # 联系我们
│   │   └── Admin/           # 后台管理
│   │       ├── Layout.tsx
│   │       ├── News/
│   │       ├── Announcements/
│   │       └── Registrations/
│   ├── services/             # API 调用
│   │   ├── news.ts
│   │   ├── announcements.ts
│   │   └── registrations.ts
│   ├── hooks/                # 自定义 hooks
│   │   └── useApi.ts
│   ├── utils/                # 工具函数
│   │   └── validators.ts
│   ├── types/                # TypeScript 类型定义
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── router.tsx
├── public/                   # 静态资源
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── Dockerfile
```

### 后端仓库 (backend/)

```
backend/
├── app/
│   ├── api/                  # API 路由
│   │   ├── news.py
│   │   ├── announcements.py
│   │   └── registrations.py
│   ├── models/                # 数据模型
│   │   ├── news.py
│   │   ├── announcement.py
│   │   └── registration.py
│   ├── schemas/              # Pydantic schemas
│   │   ├── news.py
│   │   ├── announcement.py
│   │   └── registration.py
│   ├── services/              # 业务逻辑
│   │   └── export_service.py
│   ├── middleware/            # 中间件
│   │   ├── error_handler.py
│   │   └── logger.py
│   ├── core/                  # 核心配置
│   │   ├── database.py
│   │   └── config.py
│   ├── main.py                # 应用入口
│   └── enums.py               # 枚举定义（新闻分类等）
├── requirements.txt
├── pyproject.toml
└── Dockerfile
```

### Docker 配置

**docker-compose.yml**

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8084:8084"
    volumes:
      - ./backend/data:/app/data
    environment:
      - DATABASE_URL=sqlite:///data/school.db

  frontend:
    build: ./frontend
    ports:
      - "8083:80"
    depends_on:
      - backend
```

---

## 开发计划

### 阶段1：基础架构搭建
- 初始化前后端仓库
- 配置 TypeScript、ESLint、Prettier
- 配置 Docker 和 Docker Compose
- 搭建后端基础框架
- 搭建前端基础框架

### 阶段2：内容展示功能（前台）
- 实现学校介绍页面
- 实现新闻中心（列表+详情）
- 实现通知公告（列表+详情）
- 实现首页内容聚合

### 阶段3：内容管理功能（后台）
- 搭建后台管理框架
- 实现新闻管理（CRUD）
- 实现公告管理（CRUD）

### 阶段4：报名系统
- 实现报名分步表单（前台）
- 实现报名 API（后端）
- 实现数据验证
- 实现报名号生成

### 阶段5：数据管理
- 实现报名列表展示
- 实现报名详情查看
- 实现 Excel 导出功能

### 阶段6：优化和完善
- 样式调整和美化
- 响应式适配
- 错误处理优化
- 性能优化

---

## 安全考虑

### 基础安全措施
1. **输入验证**
   - 前端表单验证
   - 后端 Pydantic Schema 验证
   - 身份证号格式验证
   - 电话号码格式验证

2. **防注入**
   - 使用 SQLAlchemy参数化查询（自动防 SQL 注入）

3. **错误处理**
   - 统一错误处理中间件
   - 不暴露敏感信息

### 后续可扩展
- 管理员登录认证
- API 访问频率限制
- HTTPS 部署
- 日志记录

---

## 部署方案

### 开发环境
```bash
# 启动所有服务
docker-compose up

# 启动特定服务
docker-compose up backend
docker-compose up frontend

# 查看日志
docker-compose logs -f
```

### 生产环境
- 使用 Nginx 作为反向代理
- 配置 HTTPS 证书
- 配置环境变量
- 设置数据持久化

---

## 验收标准

### 功能验收
- [ ] 前台所有页面正常显示
- [ ] 新闻和公告可以正常发布和查看
- [ ] 报名表单可以正常填写和提交
- [ ] 后台可以正常管理内容和查看报名
- [ ] Excel 导出功能正常

### 性能验收
- [ ] 页面加载时间 < 3 秒
- [ ] API 响应时间 < 500ms
- [ ] 支持并发请求

### 兼容性验收
- [ ] 支持主流浏览器（Chrome、Firefox、Edge）
- [ ] 响应式设计适配移动端

---

## 风险与应对

| 风险 | 应对措施 |
|------|----------|
| 报名数据量大导致性能问题 | 分页查询、添加索引 |
| 并发报名导致数据冲突 | SQLite 事务、唯一索引 |
| 前后端版本不匹配 | API 版本控制 |
| Docker 部署失败 | 提供详细部署文档和故障排查指南 |

---

## 附录

### 相关技术文档
- React 官方文档：https://react.dev
- Ant Design 文档：https://ant.design
- FastAPI 文档：https://fastapi.tiangolo.com
- SQLAlchemy 文档：https://docs.sqlalchemy.org
- SQLite 文档：https://www.sqlite.org/docs.html

### 联系方式
- 技术支持：待定
- 项目负责人：待定
