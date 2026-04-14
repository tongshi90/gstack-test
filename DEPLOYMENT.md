# 部署文档

## 开发环境部署

### 使用 Docker Compose

```bash
# 启动服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

## 生产环境部署

### 准备工作

1. 修改环境变量
2. 配置 HTTPS 证书
3. 设置数据库备份策略

### 使用 Docker 部署

```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d
```

## 数据库管理

### 备份

```bash
# 备份 SQLite 数据库
cp backend/data/school.db backend/data/school.db.backup
```

### 恢复

```bash
# 恢复 SQLite 数据库
cp backend/data/school.db.backup backend/data/school.db
```

## 监控和日志

### 查看日志

```bash
# 查看所有服务日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 升级和维护

### 升级版本

```bash
# 拉取最新代码
git pull origin main

# 重新构建镜像
docker-compose build

# 重启服务
docker-compose up -d
```
