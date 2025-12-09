<div align="center">
  
  # 🧠 思源笔记 MCP 服务器
  
  **为 Claude Desktop 提供思源笔记集成的 Model Context Protocol 服务器**
  
  [![npm version](https://img.shields.io/npm/v/@fromsko/siyuan-mcp-server.svg)](https://www.npmjs.com/package/@fromsko/siyuan-mcp-server)
  [![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)](https://nodejs.org/)
  
  🚀 让 AI 助手直接管理您的思源笔记
  
</div>

---

## 📖 项目介绍

**思源笔记 MCP 服务器** 是一个专为 [思源笔记](https://b3log.org/siyuan/) 设计的 Model Context Protocol 服务器实现。通过此服务器，您可以在 Claude Desktop 等支持 MCP 的 AI 客户端中直接操作思源笔记，实现笔记管理、内容搜索、文档编辑等功能的无缝集成。

### ✨ 主要特性

- 🔗 **原生集成** - 在 AI 助手中直接操作思源笔记
- 📚 **功能完整** - 支持笔记本、文档、块级操作的全套功能
- 🔍 **智能搜索** - 全文检索、SQL 查询、标签搜索等多种搜索方式
- 🛠️ **开发者友好** - TypeScript 编写，提供完整的类型定义和 API 文档
- 📦 **简单部署** - 支持 npm、Docker 多种安装方式
- 🔒 **安全认证** - 基于 Token 的安全认证机制

## 🚀 快速开始

### 📋 环境要求

- **Node.js** >= 18.0.0
- **思源笔记** 正在运行且已开启 API 服务
- **Claude Desktop** 或其他支持 MCP 的客户端
- 思源笔记 API Token（设置 → 关于 → API token）

### 📥 安装方式

#### 1. 全局安装（推荐）

```bash
# 使用 npm
npm install -g @fromsko/siyuan-mcp-server

# 使用 pnpm
pnpm add -g @fromsko/siyuan-mcp-server
```

#### 2. 直接使用（无需安装）

```bash
npx @fromsko/siyuan-mcp-server
```

#### 3. Docker 方式

```bash
docker pull fromsko/siyuan-mcp-server
```

### ⚙️ 快速配置

#### 环境变量设置

| 环境变量       | 必需 | 说明                            |
| -------------- | ---- | ------------------------------- |
| `SIYUAN_TOKEN` | ✅   | 思源笔记 API 令牌，用于身份验证 |

#### 在 Claude Desktop 中配置

在 Claude Desktop 配置文件中添加以下内容：

```json
{
	"mcpServers": {
		"siyuan": {
			"command": "npx",
			"args": ["-y", "@fromsko/siyuan-mcp-server"],
			"env": {
				"SIYUAN_TOKEN": "your-api-token"
			}
		}
	}
}
```

**配置文件位置：**

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

#### 命令行直接使用

```bash
# 全局安装后直接使用
SIYUAN_TOKEN=your-token siyuan-mcp-server

# 使用 npx（无需安装）
SIYUAN_TOKEN=your-token npx @fromsko/siyuan-mcp-server

# Docker 运行
docker run --rm -i \
  -e SIYUAN_TOKEN=your-token \
  fromsko/siyuan-mcp-server

# 以远程 MCP (HTTP + SSE) 方式运行
docker run -d --name siyuan-mcp-server \
  -p 3001:3001 \
  -e SIYUAN_TOKEN=your-token \
  -e SIYUAN_API_URL=http://host.docker.internal:6806 \
  fromsko/siyuan-mcp-server

# 远程客户端配置要点
# SSE 地址:    http://<host>:3001/sse
# 消息 POST:   http://<host>:3001/messages?sessionId=<从 /sse 事件里拿到的 sessionId>
# 若宿主启用了代理，请为 3001 关闭代理（如 curl 加 --noproxy '*'）
```

远程调试/自测示例（获取 sessionId 并列出笔记本）：
```bash
# 1) 取 sessionId
curl -Ns --no-buffer --noproxy '*' http://<host>:3001/sse
# 输出中的 data: /messages?sessionId=xxxx

# 2) 发送命令（列出笔记本）
SESSION=xxxx
curl --noproxy '*' -X POST "http://<host>:3001/messages?sessionId=$SESSION" \
  -H 'Content-Type: application/json' \
  -d '{
    "jsonrpc":"2.0",
    "id":"1",
    "method":"tools/call",
    "params":{
      "name":"executeCommand",
      "arguments":{"type":"notebook.lsNotebooks","params":{}}
    }
  }'
```

## 📚 功能与使用

### 🔧 可用工具

本 MCP 服务器提供以下核心功能：

| 功能类别          | 描述                     | 主要命令     |
| ----------------- | ------------------------ | ------------ |
| 📓 **笔记本管理** | 创建、删除、重命名笔记本 | `notebook.*` |
| 📄 **文档操作**   | 创建、编辑、删除文档     | `filetree.*` |
| 🧱 **块级操作**   | 插入、更新、删除内容块   | `block.*`    |
| 🔍 **搜索功能**   | 全文搜索、SQL 查询       | `search.*`   |
| 📋 **模板系统**   | 模板创建和渲染           | `template.*` |
| 📊 **数据查询**   | 复杂数据库查询           | `sql.*`      |

### 💡 使用示例

#### 1. 创建新笔记本

```json
{
	"type": "executeCommand",
	"params": {
		"type": "notebook.createNotebook",
		"params": {
			"name": "AI 学习笔记"
		}
	}
}
```

#### 2. 全文搜索内容

```json
{
	"type": "executeCommand",
	"params": {
		"type": "search.fullTextSearch",
		"params": {
			"query": "机器学习",
			"method": 0
		}
	}
}
```

#### 3. 创建带内容的文档

```json
{
	"type": "executeCommand",
	"params": {
		"type": "filetree.createDocWithMd",
		"params": {
			"notebook": "notebook-id",
			"path": "/今日学习总结",
			"markdown": "# 今日学习总结\n\n## 主要收获\n\n1. 学习了...\n2. 理解了..."
		}
	}
}
```

### 🆘 获取帮助

获取特定命令的详细帮助信息：

```json
{
	"type": "help",
	"params": {
		"type": "notebook.createNotebook"
	}
}
```

## 🔧 开发指南

### 本地开发环境搭建

```bash
# 克隆项目
git clone https://github.com/fromsko/siyuan-mcp-server.git
cd siyuan-mcp-server

# 安装依赖
pnpm install

# 开发模式启动
SIYUAN_TOKEN=your-token pnpm dev

# 构建生产版本
pnpm build

# 运行测试
pnpm test
```

### 技术栈与要求

- **运行时**: Node.js >= 18.0.0
- **语言**: TypeScript >= 5.0.0
- **包管理**: pnpm（推荐）或 npm
- **框架**: @modelcontextprotocol/sdk
- **构建工具**: TypeScript Compiler

### Docker 开发

```bash
# 构建开发镜像
docker build -t siyuan-mcp-server:dev .

# 运行开发容器
docker run --rm -it \
  -e SIYUAN_TOKEN=your-token \
  -v $(pwd):/app \
  siyuan-mcp-server:dev
```

## 🐛 问题排查

### 常见问题解答

**❓ 服务器启动失败，提示"缺少 SIYUAN_TOKEN"**

> 请确保正确设置了 `SIYUAN_TOKEN` 环境变量。获取方式：思源笔记 → 设置 → 关于 → API token

**❓ 无法连接到思源笔记**

> 请检查以下几点：
>
> - 思源笔记是否正在运行
> - API 服务是否已开启（默认端口 6806）
> - Token 是否正确且未过期
> - 防火墙是否阻止了连接

**❓ Claude Desktop 无法识别 MCP 服务器**

> 请尝试以下解决方案：
>
> - 检查配置文件 JSON 格式是否正确
> - 重启 Claude Desktop 应用
> - 查看 Claude Desktop 日志获取详细错误信息
> - 确认 npx 命令可以正常执行

**❓ 命令执行失败或返回错误**

> - 确认思源笔记中存在相应的笔记本或文档
> - 检查 Token 权限是否足够
> - 查看服务器日志获取详细错误信息

### 调试模式

启用详细的调试日志：

```bash
DEBUG=siyuan-mcp:* SIYUAN_TOKEN=your-token siyuan-mcp-server
```

### 日志分析

服务器会输出以下类型的日志：

- `INFO`: 一般信息，如服务启动、连接状态
- `WARN`: 警告信息，如参数错误、连接异常
- `ERROR`: 错误信息，如 API 调用失败、认证失败

## 🤝 贡献指南

我们热烈欢迎社区贡献！您可以通过以下方式参与：

### 如何贡献

1. **Fork 项目** - 点击右上角的 Fork 按钮
2. **创建分支** - `git checkout -b feature/awesome-feature`
3. **提交代码** - `git commit -am 'Add awesome feature'`
4. **推送分支** - `git push origin feature/awesome-feature`
5. **创建 PR** - 在 GitHub 上创建 Pull Request

### 开发规范

- **代码风格**: 遵循 TypeScript 严格模式
- **测试覆盖**: 为新功能编写单元测试
- **文档更新**: 更新相关的 API 文档和使用说明
- **提交规范**: 使用清晰的 commit message

### 报告问题

发现 Bug 或有改进建议？请通过以下方式报告：

- [GitHub Issues](https://github.com/fromsko/siyuan-mcp-server/issues)
- 详细描述问题的复现步骤
- 提供相关的错误日志和环境信息

## 📜 开源协议

本项目采用 ISC 协议开源，详情请查看 [LICENSE](LICENSE) 文件。

## 🔗 相关资源

### 官方链接

- 📚 [思源笔记官网](https://b3log.org/siyuan/)
- 🔗 [Model Context Protocol](https://modelcontextprotocol.io/)
- 🤖 [Claude Desktop](https://claude.ai/download)
- 📦 [npm 包页面](https://www.npmjs.com/package/@fromsko/siyuan-mcp-server)

### 社区与支持

- 💬 [思源笔记社区](https://ld246.com/domain/siyuan)
- 🐙 [项目 GitHub](https://github.com/fromsko/siyuan-mcp-server)
- 📧 [问题反馈](mailto:hnkong666@gmail.com)

## ❤️ 特别感谢

- 🌟 **原始项目作者** [onigeya](https://github.com/onigeya/siyuan-mcp-server) - 本项目基于其优秀的开源工作进行改进和扩展
- 🙏 [思源笔记](https://github.com/siyuan-note/siyuan) 团队 - 提供优秀的笔记软件
- 🤖 [Anthropic](https://www.anthropic.com/) - 推动 MCP 协议发展
- 👥 所有贡献者和用户 - 让项目变得更好

---

<div align="center">
  
  **🌟 如果这个项目对您有帮助，请给我们一个 Star！**
  
  <strong>💻 用 TypeScript 和 ❤️ 精心构建</strong>
  
</div>
