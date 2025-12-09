#!/usr/bin/env node
import express, { Request, Response } from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
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

function createServer() {
    const server = new McpServer({
        name: "siyuan-mcp-server",
        version: "1.2.7"
    });

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

    return server;
}

// 环境变量配置
function getEnvironmentConfig() {
    const token = process.env.SIYUAN_TOKEN ||
        process.env.SIYUAN_API_TOKEN ||
        process.env.SIYUAN_AUTH_TOKEN;

    if (!token) {
        console.warn('⚠️  警告: 未检测到 SIYUAN_TOKEN 环境变量');
        console.log('💡 请通过以下方式之一设置 Token:');
        console.log('   1. 环境变量: export SIYUAN_TOKEN=your_token');
        console.log('   2. MCP 配置: 在客户端配置中设置 env.SIYUAN_TOKEN');
        console.log('   3. 系统环境: 添加到系统环境变量中');
        console.log('🔄 服务器将继续启动，但可能无法正常访问思源笔记 API');
        return null;
    }

    return token;
}

const port = Number(process.env.PORT) || 3001;
const server = createServer();
const app = express();
app.use(express.json({ limit: '1mb' }));

// 用 sessionId 保存多个连接的 transport
const transports: Record<string, SSEServerTransport> = {};

app.get('/sse', async (_: Request, res: Response) => {
    const transport = new SSEServerTransport('/messages', res);
    transports[transport.sessionId] = transport;
    res.on('close', () => {
        delete transports[transport.sessionId];
    });
    await server.connect(transport);
});

app.post('/messages', async (req: Request, res: Response) => {
    const sessionId = req.query.sessionId as string;
    const transport = transports[sessionId];
    if (!transport) {
        res.status(400).send('No transport found for sessionId');
        return;
    }
    await transport.handlePostMessage(req, res, req.body);
});

app.get('/', (_req, res) => {
    res.json({
        status: 'ok',
        name: 'siyuan-mcp-server',
        transport: 'sse',
        sse: '/sse',
        messages: '/messages'
    });
});

const siyuanToken = getEnvironmentConfig();

if (siyuanToken) {
    console.log('✅ 环境变量检查通过');
    console.log('🔑 SIYUAN_TOKEN: ****' + siyuanToken.slice(-4));
} else {
    console.log('🟡 服务器将在有限模式下启动');
}

app.listen(port, () => {
    console.log('🚀 启动思源笔记 MCP 服务器...');
    console.log('📝 服务器名称: siyuan-mcp-server');
    console.log('🔢 版本: 1.2.7');
    console.log('🔗 传输协议: HTTP + SSE');
    console.log(`📡 SSE 地址: http://0.0.0.0:${port}/sse`);
    console.log(`📨 消息上行地址: http://0.0.0.0:${port}/messages`);
});

export { server };
