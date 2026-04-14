# Claude AI 协助开发指南

这是 XX中学官方网站项目的 Claude AI 协助开发指南，用于优化 Claude 在本项目的开发体验。

## 项目概述

本项目是一个基于前后端分离架构的学校官方网站系统，使用 React + TypeScript 作为前端，FastAPI + Python 作为后端。

- **前端**: React 18 + TypeScript + Vite + Ant Design 5
- **后端**: FastAPI + SQLAlchemy + SQLite
- **部署**: Docker Compose

## 开发模式

### 前端开发模式

前端项目位于 `frontend/` 目录，使用 Vite 作为开发服务器。

**启动前端开发服务器**:
```bash
cd frontend
npm run dev
```

前端开发服务器默认运行在 `http://localhost:5173`，但在 Docker Compose 中配置为 8083 端口。

### 后端开发模式

后端项目位于 `backend/` 目录，使用 FastAPI 和 Uvicorn。

**启动后端开发服务器**:
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8084
```

后端 API 文档可通过 `http://localhost:8084/docs` 访问。

### Docker 开发模式

使用 Docker Compose 可以同时启动前后端服务：

```bash
docker-compose up -d
```

## 代码规范

### 前端代码规范

- **文件命名**: 使用 kebab-case（如 `news-list.tsx`）
- **组件命名**: 使用 PascalCase（如 `NewsList`）
- **类型定义**: 统一放在 `src/types/` 目录
- **API 调用**: 统一放在 `src/services/` 目录
- **页面组件**: 统一放在 `src/pages/` 目录
- **通用组件**: 统一放在 `src/components/` 目录

**示例**:
```typescript
// src/pages/News/List.tsx
import React from 'react';
import type { NewsItem } from '@/types';

export const NewsList: React.FC = () => {
  return <div>News List</div>;
};
```

### 后端代码规范

- **API 路由**: 统一放在 `app/api/` 目录，每个模块一个文件
- **数据模型**: 统一放在 `app/models/` 目录
- **Pydantic 模式**: 统一放在 `app/schemas/` 目录
- **业务逻辑**: 统一放在 `app/services/` 目录
- **中间件**: 统一放在 `app/middleware/` 目录
- **核心配置**: 统一放在 `app/core/` 目录

**示例**:
```python
# app/api/news.py
from fastapi import APIRouter, Depends
from app.services.news_service import news_service

router = APIRouter(prefix="/api/news", tags=["news"])

@router.get("/")
async def get_news():
    return await news_service.get_all()
```

## 常用命令

### 前端
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

### 后端
```bash
# 安装依赖
pip install -r requirements.txt

# 运行测试
pytest

# 初始化数据库
python -m app.scripts.init_db
```

### Docker
```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 查看日志
docker-compose logs -f

# 重新构建
docker-compose build
```

## Git 工作流

### 分支命名
- `main` - 主分支
- `feature/xxx` - 新功能分支
- `fix/xxx` - 修复分支
- `hotfix/xxx` - 紧急修复分支

### 提交信息规范
```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型(type)**:
- `feat`: 新功能
- `fix`: 修复
- `docs`: 文档
- `style`: 代码格式
- `refactor`: 重构
- `test`: 测试
- `chore`: 构建/工具

**示例**:
```
feat(frontend): add news category filter

Implement category filtering in news list page
with support for multiple categories selection.
```

## 测试

### 前端测试
前端测试框架待配置。

### 后端测试
```bash
cd backend
pytest tests/
```

## 数据库

### 数据库类型
本项目使用 SQLite 作为开发数据库，数据文件位于 `backend/data/school.db`。

### 数据库迁移
当前版本未配置数据库迁移工具，如需修改数据库结构请手动更新模型文件。

### 重置数据库
```bash
cd backend
rm -f data/school.db
python -m app.scripts.init_db
```

## API 文档

FastAPI 自动生成 API 文档，启动服务后访问 `http://localhost:8084/docs` 查看 Swagger UI。

## 常见问题

### Q: 如何添加新的 API 端点？
A:
1. 在 `app/models/` 创建数据模型
2. 在 `app/schemas/` 创建 Pydantic 模式
3. 在 `app/services/` 实现业务逻辑
4. 在 `app/api/` 创建路由
5. 在 `app/main.py` 注册路由

### Q: 如何添加新的前端页面？
A:
1. 在 `src/pages/` 创建页面组件
2. 在 `src/router.tsx` 添加路由配置
3. 如需类型定义，在 `src/types/` 添加

### Q: 如何调试后端 API？
A:
1. 启动后端服务：`uvicorn app.main:app --reload`
2. 访问 API 文档：`http://localhost:8084/docs`
3. 使用 Swagger UI 或其他 API 工具测试

## 注意事项

1. 前端和后端通信使用 Axios，基地址在 `src/services/index.ts` 配置
2. 后端 CORS 已配置允许所有来源，生产环境请限制域名
3. SQLite 数据库文件不应提交到版本控制
4. Docker Compose 配置已包含前后端服务的网络连接

## 获取帮助

如遇到问题，请：
1. 查阅相关文档
2. 检查 API 文档 `http://localhost:8084/docs`
3. 提交 Issue
