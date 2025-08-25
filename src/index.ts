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
     * 获取环境配置
     */
    private getEnvironmentConfig() {
        // 尝试从多个源获取 SIYUAN_TOKEN
        const token = process.env.SIYUAN_TOKEN ||
            process.env.SIYUAN_API_TOKEN ||
            process.env.SIYUAN_AUTH_TOKEN;

        if (!token) {
            console.warn('⚠️  警告: 未检测到 SIYUAN_TOKEN 环境变量');
            console.log('💡 请通过以下方式之一设置 Token:');
            console.log('   1. 环境变量: export SIYUAN_TOKEN=your_token');
            console.log('   2. MCP 配置: 在客户端配置中设置 env.SIYUAN_TOKEN');
            console.log('   3. 系统环境: 添加到系统环境变量中');
            return null;
        }

        return token;
    }

    /**
     * 启动服务器
     */
    async start(): Promise<void> {
        const token = this.getEnvironmentConfig();

        if (!token) {
            console.log('🟡 服务器将在有限模式下启动（部分功能可能不可用）');
        } else {
            console.log('✅ 环境变量检查通过');
            console.log('🔑 SIYUAN_TOKEN: ****' + token.slice(-4));
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
    console.log('🔢 版本: 1.2.5');
    console.log('🔗 传输协议: stdio');
    console.log('🛠️  服务器已就绪，可提供思源笔记相关工具');

    server.start().catch((error) => {
        console.error('❌ 服务器启动失败:', error);
        // 不再强制退出，让服务器尝试继续运行
        console.log('🟡 服务器将在限制模式下继续运行...');
    });
}

// 重新导出工具模块
export * from './tools/index.js';
