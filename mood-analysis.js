// 情绪分类定义
const MOOD_CATEGORIES = {
    POSITIVE: 'positive',  // 积极情绪
    NEGATIVE: 'negative',  // 消极情绪
    NEUTRAL: 'neutral',    // 中性情绪
    CUSTOM: 'custom'       // 未分类的自定义情绪
};

// 预定义情绪词分类
const MOOD_CLASSIFICATION = {
    // 积极情绪
    '喜悦': MOOD_CATEGORIES.POSITIVE,
    '欣喜': MOOD_CATEGORIES.POSITIVE,
    '感动': MOOD_CATEGORIES.POSITIVE,
    '向往': MOOD_CATEGORIES.POSITIVE,
    
    // 消极情绪
    '忧伤': MOOD_CATEGORIES.NEGATIVE,
    '担忧': MOOD_CATEGORIES.NEGATIVE,
    '烦躁': MOOD_CATEGORIES.NEGATIVE,
    '无奈': MOOD_CATEGORIES.NEGATIVE,
    '迷茫': MOOD_CATEGORIES.NEGATIVE,
    
    // 中性情绪
    '安宁': MOOD_CATEGORIES.NEUTRAL,
    '思念': MOOD_CATEGORIES.NEUTRAL
};

// 情绪相似度匹配词库（扩展预定义情绪词）
const SIMILARITY_KEYWORDS = {
    // 积极情绪相关词
    [MOOD_CATEGORIES.POSITIVE]: [
        '喜悦', '欣喜', '感动', '向往', '开心', '快乐', '兴奋', 
        '高兴', '愉悦', '幸福', '满足', '希望', '期待', '乐观', 
        '欢乐', '振奋', '雀跃', '欣慰', '喜欢', '热爱'
    ],
    
    // 消极情绪相关词
    [MOOD_CATEGORIES.NEGATIVE]: [
        '忧伤', '担忧', '烦躁', '无奈', '迷茫', '悲伤', '焦虑', 
        '恐惧', '愤怒', '失望', '沮丧', '痛苦', '委屈', '压抑', 
        '疲惫', '孤独', '厌倦', '不满', '懊恼', '困惑'
    ],
    
    // 中性情绪相关词
    [MOOD_CATEGORIES.NEUTRAL]: [
        '安宁', '思念', '平静', '平和', '淡然', '从容', '宁静', 
        '沉稳', '淡定', '坦然', '怀念', '回忆', '冷静', '理性',
        '专注', '自然', '中立', '客观', '观察', '超然'
    ]
};

// 本地存储键名
const STORAGE_KEY = 'heartVersesMoodRecords';

// 图表颜色配置
const CHART_COLORS = {
    [MOOD_CATEGORIES.POSITIVE]: '#4CAF50',  // 绿色
    [MOOD_CATEGORIES.NEGATIVE]: '#F44336',  // 红色
    [MOOD_CATEGORIES.NEUTRAL]: '#FF9800',   // 橙色
    [MOOD_CATEGORIES.CUSTOM]: '#9C27B0'     // 紫色
};

// 当前时间范围过滤器
let currentTimeRange = 'week';

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('情绪分析页面已加载');
    
    // 初始化图表
    initCharts();
    
    // 更新统计信息
    updateStatistics();
    
    // 绑定事件监听器
    bindEventListeners();
});

// 绑定事件监听器
function bindEventListeners() {
    // 时间范围过滤器
    const timeButtons = document.querySelectorAll('.time-btn');
    timeButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 更新选中状态
            timeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // 更新当前时间范围
            currentTimeRange = button.dataset.range;
            
            // 重新加载图表和统计数据
            initCharts();
            updateStatistics();
        });
    });
    
    // 清除数据按钮
    const clearButton = document.querySelector('.clear-data');
    clearButton.addEventListener('click', () => {
        if (confirm('确定要清除所有情绪记录吗？此操作不可恢复。')) {
            localStorage.removeItem(STORAGE_KEY);
            alert('所有情绪记录已清除');
            
            // 重新加载图表和统计数据
            initCharts();
            updateStatistics();
        }
    });
}

// 初始化图表
function initCharts() {
    const moodRecords = getMoodRecordsForTimeRange(currentTimeRange);
    
    if (moodRecords.length === 0) {
        showNoDataMessage();
        return;
    }
    
    // 初始化情绪分布饼图
    initDistributionChart(moodRecords);
    
    // 初始化情绪变化趋势图
    initTrendChart(moodRecords);
}

// 初始化情绪分布饼图
function initDistributionChart(records) {
    const ctx = document.getElementById('moodDistribution').getContext('2d');
    
    // 按情绪类别统计
    const categoryCounts = {
        [MOOD_CATEGORIES.POSITIVE]: 0,
        [MOOD_CATEGORIES.NEGATIVE]: 0,
        [MOOD_CATEGORIES.NEUTRAL]: 0,
        [MOOD_CATEGORIES.CUSTOM]: 0
    };
    
    records.forEach(record => {
        const category = record.category;
        categoryCounts[category]++;
    });
    
    // 准备图表数据
    const data = {
        labels: ['积极情绪', '消极情绪', '中性情绪', '自定义情绪'],
        datasets: [{
            data: [
                categoryCounts[MOOD_CATEGORIES.POSITIVE],
                categoryCounts[MOOD_CATEGORIES.NEGATIVE],
                categoryCounts[MOOD_CATEGORIES.NEUTRAL],
                categoryCounts[MOOD_CATEGORIES.CUSTOM]
            ],
            backgroundColor: [
                CHART_COLORS[MOOD_CATEGORIES.POSITIVE],
                CHART_COLORS[MOOD_CATEGORIES.NEGATIVE],
                CHART_COLORS[MOOD_CATEGORIES.NEUTRAL],
                CHART_COLORS[MOOD_CATEGORIES.CUSTOM]
            ],
            borderWidth: 0
        }]
    };
    
    // 清除旧图表
    if (window.distributionChart) {
        window.distributionChart.destroy();
    }
    
    // 创建新图表
    window.distributionChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.formattedValue;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((context.raw / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// 初始化情绪变化趋势图
function initTrendChart(records) {
    const ctx = document.getElementById('moodTrend').getContext('2d');
    
    // 按日期分组并计算每天的情绪类别比例
    const groupedByDate = groupRecordsByDate(records);
    
    // 准备图表数据
    const dates = Object.keys(groupedByDate).sort();
    
    // 准备各类情绪的数据
    const datasets = [];
    
    // 积极情绪数据
    const positiveData = dates.map(date => {
        const counts = groupedByDate[date];
        return counts[MOOD_CATEGORIES.POSITIVE] || 0;
    });
    
    datasets.push({
        label: '积极情绪',
        data: positiveData,
        backgroundColor: CHART_COLORS[MOOD_CATEGORIES.POSITIVE],
        borderColor: CHART_COLORS[MOOD_CATEGORIES.POSITIVE],
        tension: 0.4,
        fill: false
    });
    
    // 消极情绪数据
    const negativeData = dates.map(date => {
        const counts = groupedByDate[date];
        return counts[MOOD_CATEGORIES.NEGATIVE] || 0;
    });
    
    datasets.push({
        label: '消极情绪',
        data: negativeData,
        backgroundColor: CHART_COLORS[MOOD_CATEGORIES.NEGATIVE],
        borderColor: CHART_COLORS[MOOD_CATEGORIES.NEGATIVE],
        tension: 0.4,
        fill: false
    });
    
    // 中性情绪数据
    const neutralData = dates.map(date => {
        const counts = groupedByDate[date];
        return counts[MOOD_CATEGORIES.NEUTRAL] || 0;
    });
    
    datasets.push({
        label: '中性情绪',
        data: neutralData,
        backgroundColor: CHART_COLORS[MOOD_CATEGORIES.NEUTRAL],
        borderColor: CHART_COLORS[MOOD_CATEGORIES.NEUTRAL],
        tension: 0.4,
        fill: false
    });
    
    // 格式化日期显示
    const formattedDates = dates.map(date => formatDate(date));
    
    // 清除旧图表
    if (window.trendChart) {
        window.trendChart.destroy();
    }
    
    // 创建新图表
    window.trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: formattedDates,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        callback: function(value) {
                            return value % 1 === 0 ? value : '';
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            }
        }
    });
}

// 更新统计信息
function updateStatistics() {
    const moodRecords = getMoodRecordsForTimeRange(currentTimeRange);
    
    // 获取DOM元素
    const totalMoodsElement = document.getElementById('totalMoods');
    const mostFrequentMoodElement = document.getElementById('mostFrequentMood');
    const positivePercentageElement = document.getElementById('positivePercentage');
    const negativePercentageElement = document.getElementById('negativePercentage');
    
    if (moodRecords.length === 0) {
        totalMoodsElement.textContent = '0';
        mostFrequentMoodElement.textContent = '-';
        positivePercentageElement.textContent = '0%';
        negativePercentageElement.textContent = '0%';
        return;
    }
    
    // 计算记录总数
    totalMoodsElement.textContent = moodRecords.length;
    
    // 计算最常见情绪
    const moodCounts = {};
    moodRecords.forEach(record => {
        const mood = record.mood;
        moodCounts[mood] = (moodCounts[mood] || 0) + 1;
    });
    
    let maxCount = 0;
    let mostFrequentMood = '';
    
    for (const mood in moodCounts) {
        if (moodCounts[mood] > maxCount) {
            maxCount = moodCounts[mood];
            mostFrequentMood = mood;
        }
    }
    
    mostFrequentMoodElement.textContent = mostFrequentMood;
    
    // 计算积极情绪和消极情绪占比
    const categoryCounts = {
        [MOOD_CATEGORIES.POSITIVE]: 0,
        [MOOD_CATEGORIES.NEGATIVE]: 0,
        [MOOD_CATEGORIES.NEUTRAL]: 0,
        [MOOD_CATEGORIES.CUSTOM]: 0
    };
    
    moodRecords.forEach(record => {
        const category = record.category;
        categoryCounts[category]++;
    });
    
    const positivePercentage = Math.round((categoryCounts[MOOD_CATEGORIES.POSITIVE] / moodRecords.length) * 100);
    const negativePercentage = Math.round((categoryCounts[MOOD_CATEGORIES.NEGATIVE] / moodRecords.length) * 100);
    
    positivePercentageElement.textContent = `${positivePercentage}%`;
    negativePercentageElement.textContent = `${negativePercentage}%`;
}

// 显示无数据消息
function showNoDataMessage() {
    const distributionCtx = document.getElementById('moodDistribution');
    const trendCtx = document.getElementById('moodTrend');
    
    // 清除旧图表
    if (window.distributionChart) {
        window.distributionChart.destroy();
    }
    
    if (window.trendChart) {
        window.trendChart.destroy();
    }
    
    // 获取图表容器
    const distributionContainer = distributionCtx.parentElement;
    const trendContainer = trendCtx.parentElement;
    
    // 显示无数据消息
    distributionContainer.innerHTML = '<div class="no-data">暂无情绪数据</div>';
    trendContainer.innerHTML = '<div class="no-data">暂无情绪数据</div>';
}

// 获取指定时间范围内的情绪记录
function getMoodRecordsForTimeRange(range) {
    const allRecords = getMoodRecordsFromStorage();
    const now = new Date();
    
    switch (range) {
        case 'week': {
            // 最近一周
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return allRecords.filter(record => new Date(record.timestamp) >= weekAgo);
        }
        case 'month': {
            // 最近一月
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return allRecords.filter(record => new Date(record.timestamp) >= monthAgo);
        }
        case 'all':
        default:
            // 全部数据
            return allRecords;
    }
}

// 按日期分组记录
function groupRecordsByDate(records) {
    const grouped = {};
    
    records.forEach(record => {
        const date = new Date(record.timestamp);
        const dateString = `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())}`;
        
        if (!grouped[dateString]) {
            grouped[dateString] = {
                [MOOD_CATEGORIES.POSITIVE]: 0,
                [MOOD_CATEGORIES.NEGATIVE]: 0,
                [MOOD_CATEGORIES.NEUTRAL]: 0,
                [MOOD_CATEGORIES.CUSTOM]: 0
            };
        }
        
        grouped[dateString][record.category]++;
    });
    
    return grouped;
}

// 从本地存储获取情绪记录
function getMoodRecordsFromStorage() {
    const storedRecords = localStorage.getItem(STORAGE_KEY);
    if (storedRecords) {
        try {
            return JSON.parse(storedRecords);
        } catch (error) {
            console.error('解析情绪记录出错:', error);
            return [];
        }
    }
    return [];
}

// 保存情绪记录到本地存储
function saveMoodRecordsToStorage(records) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

// 分类情绪词
function classifyMood(mood) {
    // 检查是否在预定义分类中
    if (MOOD_CLASSIFICATION[mood]) {
        return MOOD_CLASSIFICATION[mood];
    }
    
    // 使用相似度匹配进行分类
    let bestCategory = MOOD_CATEGORIES.CUSTOM;
    let highestSimilarity = -1;
    
    // 遍历所有情绪类别
    for (const category in SIMILARITY_KEYWORDS) {
        const keywords = SIMILARITY_KEYWORDS[category];
        
        // 计算与该类别的最大相似度
        const similarity = calculateSimilarity(mood, keywords);
        
        if (similarity > highestSimilarity) {
            highestSimilarity = similarity;
            bestCategory = category;
        }
    }
    
    // 如果相似度低于阈值，则归为自定义情绪
    return highestSimilarity > 0.5 ? bestCategory : MOOD_CATEGORIES.CUSTOM;
}

// 计算情绪词与关键词列表的相似度
function calculateSimilarity(mood, keywords) {
    // 简单实现：检查关键词是否出现在情绪词中
    for (const keyword of keywords) {
        if (mood.includes(keyword) || keyword.includes(mood)) {
            // 计算相对长度，作为相似度的因素
            const ratio = Math.min(mood.length, keyword.length) / Math.max(mood.length, keyword.length);
            return 0.7 + (ratio * 0.3); // 相似度范围：0.7 - 1.0
        }
    }
    
    return 0; // 无相似性
}

// 格式化日期
function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${month}/${day}`;
}

// 数字补零
function padZero(num) {
    return num.toString().padStart(2, '0');
}

// 导出情绪分析工具
window.moodAnalytics = {
    // 记录新的情绪选择
    recordMoodSelection: function(mood) {
        const records = getMoodRecordsFromStorage();
        
        // 添加新记录
        records.push({
            mood: mood,
            category: classifyMood(mood),
            timestamp: new Date().getTime(),
            source: 'selection' // 来源：用户选择
        });
        
        // 保存记录
        saveMoodRecordsToStorage(records);
        console.log('已记录情绪选择:', mood);
    },
    
    // 记录新的文本输入
    recordTextInput: function(text, generatedMood) {
        const records = getMoodRecordsFromStorage();
        
        // 添加新记录
        records.push({
            mood: generatedMood || '未知情绪',
            text: text,
            category: generatedMood ? classifyMood(generatedMood) : MOOD_CATEGORIES.CUSTOM,
            timestamp: new Date().getTime(),
            source: 'input' // 来源：文本输入
        });
        
        // 保存记录
        saveMoodRecordsToStorage(records);
        console.log('已记录文本输入:', text);
    }
}; 