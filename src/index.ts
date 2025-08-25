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

/**
 * 思源笔记 MCP 服务器类
 * 提供与思源笔记系统集成的 Model Context Protocol 服务器实现
 */
export class SiyuanMcpServer {
    private server: McpServer;
    private transport: StdioServerTransport;

    constructor(options?: {
        name?: string;
        version?: string;
    }) {
        this.server = new McpServer({
            name: options?.name || "siyuan-mcp-server",
            version: options?.version || "1.2.3",
            capabilities: {
                tools: {},
            },
        });

        this.transport = new StdioServerTransport();
        this.registerAllHandlers();
    }

    /**
     * 注册所有命令处理器
     */
    private registerAllHandlers() {
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
        registerCommandTool(this.server);
        registerQueryTool(this.server);
        registerHelpTool(this.server);
    }

    /**
     * 启动服务器
     */
    async start(): Promise<void> {
        // 检查必要的环境变量
        if (!process.env.SIYUAN_TOKEN) {
            throw new Error('缺少 SIYUAN_TOKEN 环境变量。使用方法: SIYUAN_TOKEN=your_token');
        }

        try {
            this.server.connect(this.transport);
            console.log('🎉 思源笔记 MCP 服务器启动成功!');
            console.log('📡 等待客户端连接...');
        } catch (error) {
            console.error('❌ 服务器启动失败:', error);
            throw error;
        }
    }

    /**
     * 获取服务器实例
     */
    getServer(): McpServer {
        return this.server;
    }

    /**
     * 获取传输层实例
     */
    getTransport(): StdioServerTransport {
        return this.transport;
    }
}

// 默认导出
export default SiyuanMcpServer;

// 如果作为脚本运行，则启动服务器
if (import.meta.url === `file://${process.argv[1]}`) {
    const server = new SiyuanMcpServer();

    console.log('🚀 启动思源笔记 MCP 服务器...');
    console.log('📝 服务器名称: siyuan-mcp-server');
    console.log('🔢 版本: 1.2.3');
    console.log('🔗 传输协议: stdio');

    if (!process.env.SIYUAN_TOKEN) {
        console.error('❌ 错误: 缺少 SIYUAN_TOKEN 环境变量');
        console.error('💡 使用方法: SIYUAN_TOKEN=your_token node server.js');
        process.exit(1);
    }

    console.log('✅ 环境变量检查通过');
    console.log('🔑 SIYUAN_TOKEN: ****' + process.env.SIYUAN_TOKEN.slice(-4));
    console.log('🛠️  服务器已就绪，可提供思源笔记相关工具');

    server.start().catch((error) => {
        console.error('❌ 服务器启动失败:', error);
        process.exit(1);
    });
}

// 重新导出工具模块
export * from './tools/index.js';
