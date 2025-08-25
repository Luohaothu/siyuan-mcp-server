/**
 * Siyuan MCP Server 使用示例脚本
 * 
 * 本脚本展示了如何通过 MCP 协议与思源笔记进行交互
 * 包括系统信息获取、笔记本管理、搜索、通知等功能
 */

interface MCPExecuteCommand {
    type: string;
    params?: Record<string, any>;
}

interface NotebookInfo {
    id: string;
    name: string;
    icon: string;
    sort: number;
    sortMode: number;
    closed: boolean;
    newFlashcardCount: number;
    dueFlashcardCount: number;
    flashcardCount: number;
}

interface SearchResult {
    id: string;
    content: string;
    created: string;
}

/**
 * Siyuan MCP 客户端示例类
 */
class SiyuanMCPDemo {

    /**
     * 获取系统版本信息
     */
    async getSystemVersion(): Promise<string> {
        const command: MCPExecuteCommand = {
            type: "system.getVersion"
        };

        console.log("🔍 获取系统版本...");
        // 这里应该是实际的 MCP 调用
        const result = "3.2.1"; // 模拟结果
        console.log(`✅ 系统版本: ${result}`);
        return result;
    }

    /**
     * 获取当前时间戳
     */
    async getCurrentTime(): Promise<number> {
        const command: MCPExecuteCommand = {
            type: "system.getCurrentTime"
        };

        console.log("🕒 获取当前时间...");
        const timestamp = Date.now();
        console.log(`✅ 当前时间戳: ${timestamp}`);
        return timestamp;
    }

    /**
     * 列出所有笔记本
     */
    async listNotebooks(): Promise<NotebookInfo[]> {
        const command: MCPExecuteCommand = {
            type: "notebook.lsNotebooks"
        };

        console.log("📚 获取笔记本列表...");

        // 模拟返回数据
        const notebooks: NotebookInfo[] = [
            {
                id: "20250812210925-gqtscc9",
                name: "cmp",
                icon: "",
                sort: 0,
                sortMode: 15,
                closed: false,
                newFlashcardCount: 0,
                dueFlashcardCount: 0,
                flashcardCount: 0
            },
            {
                id: "20250820103531-h96guot",
                name: "代码片段",
                icon: "",
                sort: 0,
                sortMode: 15,
                closed: false,
                newFlashcardCount: 0,
                dueFlashcardCount: 0,
                flashcardCount: 0
            }
        ];

        console.log(`✅ 找到 ${notebooks.length} 个笔记本:`);
        notebooks.forEach(nb => {
            console.log(`  - ${nb.name} (${nb.id})`);
        });

        return notebooks;
    }

    /**
     * 执行全文搜索
     */
    async fullTextSearch(query: string, limit: number = 10): Promise<SearchResult[]> {
        const command: MCPExecuteCommand = {
            type: "search.fullTextSearch",
            params: {
                query,
                limit,
                method: 0 // 关键词搜索
            }
        };

        console.log(`🔎 搜索: "${query}"`);

        // 模拟搜索结果
        const results: SearchResult[] = [
            {
                id: "20250812210930-7elfeye",
                content: "提示词-Codebuddy 约束",
                created: "20250812210930"
            }
        ];

        console.log(`✅ 找到 ${results.length} 个结果`);
        results.forEach(result => {
            console.log(`  - ${result.content.substring(0, 50)}...`);
        });

        return results;
    }

    /**
     * 发送通知消息
     */
    async pushNotification(message: string, timeout: number = 5000): Promise<string> {
        const command: MCPExecuteCommand = {
            type: "notification.pushMsg",
            params: {
                msg: message,
                timeout
            }
        };

        console.log(`📢 发送通知: "${message}"`);

        const notificationId = `msg_${Date.now()}`;
        console.log(`✅ 通知已发送，ID: ${notificationId}`);

        return notificationId;
    }

    /**
     * 执行 SQL 查询
     */
    async executeSQLQuery(sql: string): Promise<any[]> {
        const command: MCPExecuteCommand = {
            type: "sql.sql",
            params: {
                stmt: sql
            }
        };

        console.log(`💾 执行 SQL 查询: ${sql}`);

        // 模拟查询结果
        const results = [
            {
                id: "20250812210930-7elfeye",
                content: "提示词-Codebuddy 约束",
                created: "20250812210930"
            }
        ];

        console.log(`✅ 查询完成，返回 ${results.length} 条记录`);

        return results;
    }

    /**
     * 创建新文档
     */
    async createDocument(notebookId: string, path: string, content: string): Promise<void> {
        const command: MCPExecuteCommand = {
            type: "filetree.createDocWithMd",
            params: {
                notebook: notebookId,
                path,
                markdown: content
            }
        };

        console.log(`📝 创建文档: ${path}`);
        console.log(`✅ 文档创建成功`);
    }

    /**
     * 运行完整示例
     */
    async runDemo(): Promise<void> {
        console.log("🚀 开始 Siyuan MCP Server 使用示例\n");

        try {
            // 1. 获取系统信息
            await this.getSystemVersion();
            await this.getCurrentTime();
            console.log();

            // 2. 笔记本管理
            const notebooks = await this.listNotebooks();
            console.log();

            // 3. 搜索功能
            await this.fullTextSearch("MCP");
            console.log();

            // 4. 通知功能
            await this.pushNotification("MCP 示例运行成功！");
            console.log();

            // 5. SQL 查询
            await this.executeSQLQuery("SELECT id, content, created FROM blocks LIMIT 3");
            console.log();

            // 6. 创建文档（如果有笔记本的话）
            if (notebooks.length > 0) {
                await this.createDocument(
                    notebooks[0].id,
                    "/示例文档",
                    "# MCP 测试文档\n\n这是通过 MCP 创建的示例文档。"
                );
            }

            console.log("🎉 示例运行完成！");

        } catch (error) {
            console.error("❌ 运行出错:", error);
        }
    }
}

// 使用示例
async function main() {
    const demo = new SiyuanMCPDemo();
    await demo.runDemo();
}

// 如果直接运行此文件
if (require.main === module) {
    main().catch(console.error);
}

export { SiyuanMCPDemo };

/**
 * 实际使用时的注意事项：
 * 
 * 1. 需要确保思源笔记正在运行
 * 2. MCP Server 需要正确配置和启动
 * 3. 根据实际的 MCP 客户端库调整代码
 * 4. 处理异步操作和错误情况
 * 5. 根据具体需求调整参数和逻辑
 */