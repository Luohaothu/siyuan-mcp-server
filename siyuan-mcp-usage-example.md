# Siyuan MCP Server 使用示例

本文档展示了如何使用 siyuan-mcp-server 中的各种工具和命令。

## 系统信息获取

### 1. 获取系统版本

```json
{
	"type": "system.getVersion",
	"result": "3.2.1"
}
```

### 2. 获取当前时间

```json
{
	"type": "system.getCurrentTime",
	"result": "1756095198813"
}
```

## 笔记本管理

### 3. 列出所有笔记本

```json
{
	"type": "notebook.lsNotebooks",
	"result": {
		"notebooks": [
			{
				"id": "20250812210925-gqtscc9",
				"name": "cmp",
				"icon": "",
				"sort": 0,
				"sortMode": 15,
				"closed": false,
				"newFlashcardCount": 0,
				"dueFlashcardCount": 0,
				"flashcardCount": 0
			},
			{
				"id": "20250815142929-lhqufqh",
				"name": "kuazi",
				"icon": "",
				"sort": 0,
				"sortMode": 4,
				"closed": false,
				"newFlashcardCount": 0,
				"dueFlashcardCount": 0,
				"flashcardCount": 0
			},
			{
				"id": "20250820103531-h96guot",
				"name": "代码片段",
				"icon": "",
				"sort": 0,
				"sortMode": 15,
				"closed": false,
				"newFlashcardCount": 0,
				"dueFlashcardCount": 0,
				"flashcardCount": 0
			}
		]
	}
}
```

## 通知功能

### 4. 推送通知消息

```json
{
	"type": "notification.pushMsg",
	"params": {
		"msg": "MCP Server 使用示例：成功调用通知功能!",
		"timeout": 5000
	},
	"result": {
		"id": "rjen3d8"
	}
}
```

## 常用工具命令总结

### 笔记本操作

- `notebook.lsNotebooks` - 列出所有笔记本
- `notebook.createNotebook` - 创建笔记本
- `notebook.openNotebook` - 打开笔记本
- `notebook.closeNotebook` - 关闭笔记本
- `notebook.renameNotebook` - 重命名笔记本
- `notebook.removeNotebook` - 删除笔记本

### 文档操作

- `filetree.createDocWithMd` - 用 Markdown 创建文档
- `filetree.renameDoc` - 重命名文档
- `filetree.removeDoc` - 删除文档
- `filetree.moveDocs` - 移动文档

### 块操作

- `block.insertBlock` - 插入块
- `block.updateBlock` - 更新块内容
- `block.deleteBlock` - 删除块
- `block.moveBlock` - 移动块
- `block.getBlockKramdown` - 获取块的 Kramdown 内容

### 搜索功能

- `search.fullTextSearch` - 全文搜索
- `query.sql` - 执行 SQL 查询
- `query.block` - 通过 ID 查询块

### 文件操作

- `file.getFile` - 获取文件内容
- `file.putFile` - 写入文件内容
- `file.removeFile` - 删除文件
- `file.readDir` - 列出目录文件

### 系统功能

- `system.getVersion` - 获取系统版本
- `system.getCurrentTime` - 获取当前时间
- `system.getBootProgress` - 获取启动进度

### 通知功能

- `notification.pushMsg` - 推送消息通知
- `notification.pushErrMsg` - 推送错误消息通知

### 导出功能

- `export.exportNotebook` - 导出笔记本
- `export.exportDoc` - 导出文档

## 使用方式

所有命令都通过 MCP Server 的 `executeCommand` 方法调用：

```typescript
await executeCommand({
	type: "命令类型",
	params: {
		// 命令参数
	},
});
```

## 注意事项

1. 所有涉及笔记本、文档、块的操作都需要提供相应的 ID
2. 文件路径参数需要使用正确的路径格式
3. 部分命令可能需要思源笔记正在运行才能执行
4. 建议在使用前先调用 `notebook.lsNotebooks` 获取可用的笔记本信息

---

_本示例展示了 siyuan-mcp-server 的主要功能，更多详细用法请参考具体的 API 文档。_
