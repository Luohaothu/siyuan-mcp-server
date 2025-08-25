#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerCommandTool } from './tools/commands.js';
import { registerAssetsHandlers } from './tools/commands/assets.js';
import { registerAttrHandlers } from './tools/commands/attr.js';
import { registerBlockHandlers } from './tools/commands/block.js';
import { registerConvertHandlers } from './tools/commands/convert.js';
import { registerExportHandlers } from './tools/commands/export.js';
import { registerFileHandlers } from './tools/commands/file.js';
import { registerFiletreeHandlers } from './tools/commands/filetree.js';
import { registerNetworkHandlers } from './tools/commands/network.js';
import { registerNotebookHandlers } from './tools/commands/notebook.js';
import { registerNotificationHandlers } from './tools/commands/notification.js';
import { registerQueryHandlers } from './tools/commands/query.js';
import { registerSearchHandlers } from './tools/commands/search.js';
import { registerSqlHandlers } from './tools/commands/sql.js';
import { registerSystemHandlers } from './tools/commands/system.js';
import { registerTemplateHandlers } from './tools/commands/template.js';
import { registerHelpTool } from './tools/help.js';
import { registerQueryTool } from './tools/queries.js';

// 创建 MCP 服务器实例
const server = new McpServer({
    name: "siyuan-mcp-server",
    version: "1.0.0",
    capabilities: {
        tools: {},
    },
});

// 创建传输层实例
const transport = new StdioServerTransport();

// 注册命令处理器
registerNotebookHandlers();
registerFiletreeHandlers();
registerBlockHandlers();
registerAttrHandlers();
registerSqlHandlers();
registerQueryHandlers();
registerSearchHandlers();
registerAssetsHandlers();
registerFileHandlers();
registerExportHandlers();
registerTemplateHandlers();
registerNotificationHandlers();
registerSystemHandlers();
registerConvertHandlers();
registerNetworkHandlers();

// 注册工具
registerCommandTool(server);
registerQueryTool(server);
registerHelpTool(server);

// 启动服务器
console.log('🚀 启动思源笔记 MCP 服务器...');
console.log('📝 服务器名称: siyuan-mcp-server');
console.log('🔢 版本: 1.2.3');
console.log('🔗 传输协议: stdio');

// 检查必要的环境变量
if (!process.env.SIYUAN_TOKEN) {
    console.error('❌ 错误: 缺少 SIYUAN_TOKEN 环境变量');
    console.error('💡 使用方法: SIYUAN_TOKEN=your_token node server.js');
    process.exit(1);
}

console.log('✅ 环境变量检查通过');
console.log('🔑 SIYUAN_TOKEN: ****' + process.env.SIYUAN_TOKEN.slice(-4));

// 启动服务器连接
try {
    server.connect(transport);
    console.log('🎉 MCP 服务器启动成功!');
    console.log('📡 等待客户端连接...');
    console.log('🛠️  服务器已就绪，可提供思源笔记相关工具');
} catch (error) {
    console.error('❌ 服务器启动失败:', error);
    process.exit(1);
}

export { server };
