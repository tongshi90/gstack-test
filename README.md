# XX中学官方网站

## 项目简介

XX中学官方网站是一个基于前后端分离架构的现代化学校网站系统，包含前台信息展示、在线报名系统和后台管理功能。

## 技术栈

### 前端
- React 18
- TypeScript
- Vite
- Ant Design 5
- React Router 6
- Axios
- Day.js

### 后端
- Python 3.10+
- FastAPI
- SQLAlchemy
- SQLite
- Pydantic

## 项目结构

```
gstack-test/
├── frontend/          # 前端项目
│   ├── src/
│   │   ├── components/  # 通用组件
│   │   ├── pages/       # 页面组件
│   │   ├── services/    # API 服务
│   │   ├── types/       # TypeScript 类型定义
│   │   └── utils/       # 工具函数
│   ├── Dockerfile
│   └── nginx.conf
├── backend/           # 后端项目
│   ├── app/
│   │   ├── api/         # API 路由
│   │   ├── models/      # 数据模型
│   │   ├── schemas/     # Pydantic 模式
│   │   ├── services/    # 业务逻辑
│   │   ├── middleware/  # 中间件
│   │   ├── core/        # 核心配置
│   │   └── scripts/     # 脚本
│   ├── tests/           # 测试
│   ├── Dockerfile
│   └── requirements.txt
├── docker-compose.yml
├── README.md
├── DEPLOYMENT.md
└── CLAUDE.md
```

## 快速开始

### 使用 Docker Compose 启动

```bash
# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 本地开发

#### 后端开发

```bash
cd backend

# 安装依赖
pip install -r requirements.txt

# 初始化数据库
python -m app.scripts.init_db

# 启动开发服务器
uvicorn app.main:app --reload --host 0.0.0.0 --port 8084
```

#### 前端开发

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 功能特性

### 前台功能
- 学校介绍展示
- 新闻中心（支持分类）
- 通知公告（支持置顶）
- 在线报名系统（分步表单）
- 报名须知和联系方式

### 后台管理
- 新闻管理（CRUD）
- 公告管理（CRUD）
- 报名管理（查看、搜索、导出）

### API 特性
- RESTful API 设计
- CORS 跨域支持
- 统一错误处理
- 请求日志记录
- 健康检查接口
- 自动生成 API 文档

## 访问地址

| 服务 | 地址 | 说明 |
|------|------|------|
| 前台 | http://localhost:8083 | 前端应用 |
| 后台 API | http://localhost:8084 | FastAPI 服务 |
| API 文档 | http://localhost:8084/docs | Swagger UI |
| 健康检查 | http://localhost:8084/health | 服务健康状态 |

## 开发规范

### 前端开发规范
- 使用 TypeScript 进行类型检查
- 组件命名使用 PascalCase
- 文件命名使用 kebab-case
- 使用 Ant Design 组件库
- 遵循 React Hooks 最佳实践

### 后端开发规范
- 遵循 FastAPI 最佳实践
- 使用 Pydantic 进行数据验证
- API 路由使用 RESTful 风格
- 错误处理统一使用中间件
- 使用 SQLAlchemy ORM 操作数据库

## 部署

详细的部署说明请参考 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 贡献

欢迎提交 Issue 和 Pull Request。

## 许可证

MIT License

## 联系方式

- 技术支持：待定
- 项目负责人：待定
