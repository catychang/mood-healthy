// AI 接口调用配置
const API_CONFIG = {
    endpoint: 'YOUR_AI_API_ENDPOINT', // 需要替换为实际的 AI API 端点
    maxRetries: 3,
    timeout: 10000, // 10 秒超时
};

// 模拟的安慰话语
const mockResponses = [
    {
        text: "每一个困难都是成长的机会，相信自己能够克服。",
        source: "《积极心理学》"
    },
    {
        text: "你的感受是重要的，但不要让它们完全控制你的生活。",
        source: "马克·吐温"
    },
    {
        text: "放慢脚步，给自己一些空间和时间来处理情绪。",
        source: "《冥想的艺术》"
    }
];

// 生成安慰话语的函数
async function generateComfortingWords(text) {
    try {
        // 实际项目中，取消下面的模拟代码，使用真实API调用
        console.log("生成安慰话语，输入:", text);
        
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 返回模拟数据
        return mockResponses.map(quote => ({
            content: quote.text,
            source: quote.source
        }));
        
        /*
        // 真实API调用代码
        const response = await fetch(API_CONFIG.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 如果需要认证，在这里添加认证头
                // 'Authorization': 'Bearer YOUR_API_KEY'
            },
            body: JSON.stringify({
                text: text,
                max_length: 100, // 生成文本的最大长度
                num_return_sequences: 2, // 返回的序列数量
            })
        });

        if (!response.ok) {
            throw new Error('API 请求失败');
        }

        const data = await response.json();
        return data.quotes.map(quote => ({
            content: quote.text,
            source: quote.source || "— AI 助手"
        }));
        */
    } catch (error) {
        console.error('AI 生成失败:', error);
        throw error;
    }
}

// 敏感词过滤函数
function filterSensitiveWords(text) {
    const sensitiveWords = [
        // 在这里添加敏感词列表
        "暴力", "自杀", "伤害"
    ];
    
    for (const word of sensitiveWords) {
        if (text.includes(word)) {
            return false;
        }
    }
    return true;
}

// 将函数绑定到全局对象上
window.apiUtils = {
    generateComfortingWords,
    filterSensitiveWords
};

console.log("API 工具已加载"); 