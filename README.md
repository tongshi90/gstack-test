# XX中学官方网站

## 项目简介

XX中学官方网站是一个基于前后端分离架构的现代化学校网站系统，包含前台信息展示、在线报名系统和后台管理功能。

## 技术栈

### 前端
- React 18
- TypeScript
- Vite
- Ant Design
- React Router
- Axios

### 后端
- Python 3.10+
- FastAPI
- SQLAlchemy
- SQLite

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
- 在线报名系统（分步表）
- 报名须知和联系方式

### 后台管理
- 新闻管理（CRUD）
- 公告管理（CRUD）
- 报名管理（查看、搜索、导出）

## 访问地址

- 前台：http://localhost:8083
- 后台 API：http://localhost:8084
- API 文档：http://localhost:8084/docs

## 联系方式

- 技术支持：待定
- 项目负责人：待定
