// 情绪卡片点击交互
document.addEventListener('DOMContentLoaded', function() {
    const moodCards = document.querySelectorAll('.mood-card');
    const resultsContainer = document.getElementById('results-container');
    const quoteContainer = document.querySelector('.quote-card');
    const showMoreButton = document.querySelector('.show-more');
    
    // 初始化所有情绪卡片的默认样式
    moodCards.forEach(card => {
        if (!card.classList.contains('add')) {
            const span = card.querySelector('span');
            if (span) {
                span.style.fontSize = '14px';
                span.style.fontWeight = 'normal';
            }
        }
    });
    
    // 隐藏"展示更多"按钮
    if (showMoreButton) {
        showMoreButton.style.display = 'none';
    }
    
    // 获取模态框相关元素
    const modalOverlay = document.getElementById('add-emotion-modal');
    const newEmotionInput = document.getElementById('new-emotion-input');
    const modalCloseBtn = document.getElementById('modal-close');
    const modalCancelBtn = document.getElementById('modal-cancel');
    const modalAddBtn = document.getElementById('modal-add');
    
    let currentMood = '';
    let currentQuoteIndex = 0;
    let allQuotes = [];
    let usedQuoteIndices = new Set(); // 用于跟踪已显示过的引言索引
    const quotesPerPage = 3; // 每次显示3条
    
    // 初始化数据
    if (typeof window.moodQuotes === 'undefined') {
        console.error('moodQuotes 数据未找到');
        return;
    }
    
    // 清除现有的引言卡片
    function clearQuotes() {
        const existingQuotes = document.querySelectorAll('.quote-card');
        existingQuotes.forEach(card => {
            if (card !== quoteContainer) { // 保留第一个作为模板
                card.remove();
            }
        });
    }
    
    // Fisher-Yates 洗牌算法 - 确保真正的随机性
    function shuffleArray(array) {
        const shuffled = [...array]; // 创建数组副本
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            // 交换元素
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    // 创建重新生成按钮
    function createRegenerateButton() {
        // 检查是否已存在该按钮
        let regenerateBtn = document.querySelector('.regenerate-btn');
        if (!regenerateBtn) {
            regenerateBtn = document.createElement('button');
            regenerateBtn.className = 'regenerate-btn';
            regenerateBtn.textContent = '换一批';
            
            // 更新样式以匹配确定按钮
            regenerateBtn.style.background = 'transparent';
            regenerateBtn.style.color = 'var(--accent-color)';
            regenerateBtn.style.border = '1px solid var(--accent-color)';
            regenerateBtn.style.borderRadius = '8px';
            regenerateBtn.style.padding = '0 1.5rem';
            regenerateBtn.style.fontSize = '14px';
            regenerateBtn.style.fontWeight = '500';
            regenerateBtn.style.cursor = 'pointer';
            regenerateBtn.style.transition = 'all var(--transition-speed)';
            regenerateBtn.style.whiteSpace = 'nowrap';
            regenerateBtn.style.position = 'relative';
            regenerateBtn.style.overflow = 'hidden';
            regenerateBtn.style.height = '38px';
            regenerateBtn.style.lineHeight = '38px';
            
            // 居中显示样式
            regenerateBtn.style.display = 'block';
            regenerateBtn.style.margin = '28px auto';
            
            // 添加悬停效果 - 简化为匹配确认按钮
            regenerateBtn.addEventListener('mouseenter', function() {
                this.style.background = 'rgba(106, 255, 160, 0.1)';
            });
            
            regenerateBtn.addEventListener('mouseleave', function() {
                this.style.background = 'transparent';
            });
            
            regenerateBtn.addEventListener('mousedown', function() {
                this.style.transform = 'translateY(0)';
            });
            
            // 添加到结果容器
            resultsContainer.appendChild(regenerateBtn);
            
            // 添加点击事件
            regenerateBtn.addEventListener('click', function() {
                if (currentMood) {
                    // 重新随机显示当前情绪的引言
                    showComfortingMessages(currentMood);
                }
            });
        }
        return regenerateBtn;
    }
    
    // 显示安慰话语的函数
    function showComfortingMessages(mood) {
        console.log("开始显示情绪安慰话语，情绪:", mood);
        clearQuotes();
        currentMood = mood;
        currentQuoteIndex = 0;
        usedQuoteIndices.clear(); // 清除已使用的引言跟踪
        
        // 获取当前情绪的所有引言
        if (window.moodQuotes && window.moodQuotes[mood]) {
            console.log("找到匹配的情绪:", mood);
            allQuotes = window.moodQuotes[mood];
            // 随机打乱引言顺序
            allQuotes = shuffleArray(allQuotes);
        } else {
            console.log("未找到匹配的情绪，使用随机情绪");
            // 如果不是预定义的情绪，随机显示一些通用引言
            if (window.moodQuotes) {
                const allMoods = Object.keys(window.moodQuotes);
                if (allMoods.length > 0) {
                    const randomMood = allMoods[Math.floor(Math.random() * allMoods.length)];
                    console.log("随机选择情绪:", randomMood);
                    allQuotes = window.moodQuotes[randomMood];
                    // 随机打乱引言顺序
                    allQuotes = shuffleArray(allQuotes);
                } else {
                    console.error("情绪数据为空");
                    return;
                }
            } else {
                console.error("moodQuotes 数据未找到");
                return;
            }
        }
        
        if (!allQuotes || allQuotes.length === 0) {
            console.error("没有找到引言数据");
            return;
        }
        
        console.log("找到引言数量:", allQuotes.length);
        
        // 显示结果区域
        resultsContainer.style.display = 'block';
        
        // 确保"展示更多"按钮可见
        if (showMoreButton) {
            showMoreButton.style.display = 'block';
            console.log("已显示展示更多按钮");
        }
        
        // 创建重新生成按钮
        createRegenerateButton();
        
        // 显示第一组引言
        showNextQuotes();
    }
    
    // 创建引言卡片
    function createQuoteCard(quote) {
        // 复制模板卡片
        const newCard = quoteContainer.cloneNode(true);
        newCard.style.display = 'block'; // 确保新卡片是可见的
        
        // 更新引言内容
        const quoteContent = newCard.querySelector('.quote-content');
        const quoteSource = newCard.querySelector('.quote-source');
        const copyBtn = newCard.querySelector('.quote-actions .copy-btn');
        const favoriteBtn = newCard.querySelector('.quote-actions .favorite-btn');
        
        if (quoteContent) quoteContent.textContent = `"${quote.content}"`;
        if (quoteSource) {
            let formattedSource = "";
            const source = quote.source || "AI";
            
            if (source.includes("《") || source.includes("》")) {
                formattedSource = source;
            } else if (source === "AI" || source.toLowerCase() === "ai") {
                formattedSource = "AI";
            } else if (source.startsWith("张") || /^[\u4e00-\u9fa5]+$/.test(source)) {
                formattedSource = source;
            } else if (/^[A-Za-z\s]+$/.test(source) || source === "佚名") {
                formattedSource = source;
            } else {
                formattedSource = `《${source}》`;
            }
            
            quoteSource.textContent = formattedSource;
        }
        if (copyBtn) copyBtn.setAttribute('data-content', quote.content);
        
        // 添加到结果容器，放在按钮前面
        const regenerateBtn = document.querySelector('.regenerate-btn');
        if (regenerateBtn) {
            resultsContainer.insertBefore(newCard, regenerateBtn);
        } else if (showMoreButton) {
        resultsContainer.insertBefore(newCard, showMoreButton);
        } else {
            resultsContainer.appendChild(newCard);
        }
        
        // 添加复制功能
        if (copyBtn) {
            copyBtn.addEventListener('click', function() {
                const textToCopy = this.getAttribute('data-content');
                navigator.clipboard.writeText(textToCopy).then(() => {
                    const tooltip = this.parentNode.querySelector('.copy-tooltip');
                    if (tooltip) {
                        // 修改为和收藏页一致的显示方式
                        tooltip.classList.add('show');
                        setTimeout(() => {
                            tooltip.classList.remove('show');
                        }, 2000);
                    }
                });
            });
        }
        
        // 添加收藏功能
        if (favoriteBtn) {
            favoriteBtn.addEventListener('click', function() {
                // 切换active类
                this.classList.toggle('active');
                
                // 获取引言内容和来源
                const quoteCard = this.closest('.quote-card');
                const content = quoteCard.querySelector('.quote-content').textContent.replace(/^"|"$/g, '');
                const source = quoteCard.querySelector('.quote-source').textContent;
                
                // 生成唯一ID
                const quoteId = 'quote-' + Date.now();
                
                // 保存到localStorage
                if (this.classList.contains('active')) {
                    // 添加到收藏
                    saveFavorite(quoteId, content, source);
                } else {
                    // 从收藏中移除
                    removeFavorite(content);
                }
            });
        }
        
        // 检查引言是否已收藏
        if (favoriteBtn && quoteContent) {
            const content = quoteContent.textContent.replace(/^"|"$/g, '');
            const favorites = getFavoritesFromStorage();
            
            // 如果该引言已在收藏中，设置按钮为active状态
            const isInFavorites = favorites.some(item => {
                // 去除引号后比较内容
                const itemContent = item.content.replace(/^"|"$/g, '');
                return itemContent === content;
            });
            
            if (isInFavorites) {
                favoriteBtn.classList.add('active');
            }
        }
        
        // 确保有fade-in类
        if (!newCard.classList.contains('fade-in')) {
            newCard.classList.add('fade-in');
        }
        
        return newCard;
    }
    
    // 显示下一批引言
    function showNextQuotes() {
        // 如果已经显示了所有引言，则重新随机排序
        if (usedQuoteIndices.size >= allQuotes.length) {
            console.log("已经显示了所有引言，重新随机排序");
            allQuotes = shuffleArray(allQuotes);
            usedQuoteIndices.clear();
        }
        
        // 确定剩余引言数量
        const remainingQuotes = allQuotes.length - usedQuoteIndices.size;
        // 一次最多显示3条引言
        const quotesToShow = Math.min(quotesPerPage, remainingQuotes);
        
        console.log("显示新的引言组, 剩余引言数:", remainingQuotes);
        console.log("当前情绪:", currentMood);
        console.log("引言总数:", allQuotes.length);
        
        // 如果没有更多引言，但仍然保持按钮可见用于演示效果
        if (quotesToShow <= 0) {
            console.log("没有更多引言可显示，但保持按钮可见");
            // 不再隐藏按钮，而是保持可见
            return;
        }
        
        // 找到未显示过的引言
        let shownCount = 0;
        for (let i = 0; i < allQuotes.length && shownCount < quotesToShow; i++) {
            if (!usedQuoteIndices.has(i)) {
                const quote = allQuotes[i];
                console.log("创建引言卡片:", shownCount + 1, "内容:", quote.content.substring(0, 30) + "...");
                const card = createQuoteCard(quote);
                if (card) {
                    console.log("引言卡片创建成功");
                    usedQuoteIndices.add(i); // 标记为已使用
                    shownCount++;
                } else {
                    console.error("引言卡片创建失败");
                }
            }
        }
        
        // 确保"展示更多"按钮始终可见，无论是否还有更多引言
        if (showMoreButton) {
            showMoreButton.style.display = 'block';
            console.log("保持展示更多按钮可见");
        }
    }
    
    // 隐藏第一个模板卡片
    if (quoteContainer) {
        console.log("隐藏模板卡片");
        quoteContainer.style.display = 'none';
    } else {
        console.error("模板卡片未找到");
    }
    
    // 确保"展示更多"按钮在初始状态下是可见的
    if (showMoreButton) {
        // 移除可能导致按钮隐藏的样式
        showMoreButton.removeAttribute('style');
        // 设置样式为强制显示
        showMoreButton.style.display = 'block';
        console.log("确保展示更多按钮可见");
        
        // 添加点击事件
        showMoreButton.addEventListener('click', function() {
            console.log("点击展示更多按钮");
            showNextQuotes();
        });
    } else {
        console.error("展示更多按钮未找到");
    }
    
    // 情绪卡点击事件
    function setupMoodCardEvents() {
        const currentMoodCards = document.querySelectorAll('.mood-card');
        currentMoodCards.forEach(card => {
            // 检查卡片是否已经有事件监听器，避免重复添加
            if (card.getAttribute('data-has-event') === 'true') {
                return;
            }
            
            card.setAttribute('data-has-event', 'true');
            
            // 添加鼠标悬浮事件
            card.addEventListener('mouseenter', function() {
                // 如果不是添加按钮且不是活动状态，设置悬浮样式
                if (!this.classList.contains('add') && !this.classList.contains('active')) {
                    this.style.background = '#6AFFA0';
                    this.style.color = '#000';
                    this.style.border = 'none';
                    this.style.boxShadow = '0 0 10px rgba(106, 255, 160, 0.2)';
                    
                    const currentSpan = this.querySelector('span');
                    if (currentSpan) {
                        currentSpan.style.fontWeight = 'bold';
                    }
                    
                    // 如果是自定义情绪卡片，处理删除按钮
                    if (this.classList.contains('custom-emotion')) {
                        const deleteBtn = this.querySelector('.delete-emotion-btn');
                        if (deleteBtn) {
                            deleteBtn.style.color = '#000';
                        }
                    }
                }
            });
            
            // 添加鼠标离开事件
            card.addEventListener('mouseleave', function() {
                // 如果不是添加按钮且不是活动状态，恢复默认样式
                if (!this.classList.contains('add') && !this.classList.contains('active')) {
                    this.style.background = 'transparent';
                    this.style.color = '#fff';
                    this.style.border = '1px solid #435249';
                    this.style.boxShadow = 'none';
                    
                    const currentSpan = this.querySelector('span');
                    if (currentSpan) {
                        currentSpan.style.fontWeight = 'normal';
                    }
                    
                    // 如果是自定义情绪卡片，恢复删除按钮颜色
                    if (this.classList.contains('custom-emotion')) {
                        const deleteBtn = this.querySelector('.delete-emotion-btn');
                        if (deleteBtn) {
                            deleteBtn.style.color = '#fff';
                        }
                    }
                }
            });
            
            card.addEventListener('click', function() {
                // 如果是添加按钮，执行添加操作
                if (this.classList.contains('add')) {
                    console.log("点击了添加按钮，打开模态框");
                    
                    // 打开模态框
                    openModal();
                    
                    return;
                }
                
                console.log("情绪卡片被点击");
                
                // 获取最新的情绪卡片集合
                const allMoodCards = document.querySelectorAll('.mood-card');
            
                // 移除所有卡片的active状态
                allMoodCards.forEach(c => {
                    if (!c.classList.contains('add')) {
                        c.classList.remove('active');
                        // 重置样式
                        c.style.background = 'transparent';
                        c.style.color = '#fff';
                        c.style.border = '1px solid #435249';
                        c.style.boxShadow = 'none';
                        
                        // 重置所有卡片中的文本样式
                        const spanElement = c.querySelector('span');
                        if (spanElement) {
                            spanElement.style.fontSize = '14px';
                            spanElement.style.fontWeight = 'normal';
                        }
                        
                        // 如果是自定义情绪卡片，额外处理删除按钮颜色
                        if (c.classList.contains('custom-emotion')) {
                            const deleteBtn = c.querySelector('.delete-emotion-btn');
                            if (deleteBtn) {
                                deleteBtn.style.color = '#fff';
                            }
                        }
                    }
                });
            
                // 为当前点击的卡片添加active状态
                this.classList.add('active');
                
                // 设置选中样式
                this.style.background = '#6AFFA0';
                this.style.color = '#000';
                this.style.border = 'none';
                this.style.boxShadow = '0 0 10px rgba(106, 255, 160, 0.2)';
                
                // 将当前卡片中的文字设为加粗
                const currentSpan = this.querySelector('span');
                if (currentSpan) {
                    currentSpan.style.fontSize = '14px';
                    currentSpan.style.fontWeight = 'bold';
                }
                
                // 如果当前卡片是自定义情绪卡片，将删除按钮变为黑色
                if (this.classList.contains('custom-emotion')) {
                    const deleteBtn = this.querySelector('.delete-emotion-btn');
                    if (deleteBtn) {
                        deleteBtn.style.color = '#000';
                    }
                }
            
                // 显示该情绪的安慰话语
                // 获取情绪文本可能在直接子元素或嵌套在容器中
                let selectedMood;
                const moodSpan = this.querySelector('span');
                if (moodSpan) {
                    selectedMood = moodSpan.textContent;
                }
                
                console.log("选择了情绪:", selectedMood);
                showComfortingMessages(selectedMood);
            });
        });
    }
    
    // 初始设置情绪卡片事件
    setupMoodCardEvents();
    
    // 模态框相关函数
    function openModal() {
        // 保存当前滚动位置
        const scrollY = window.scrollY;
        
        // 显示模态框
        modalOverlay.style.display = 'flex';
        
        // 清空输入框
        newEmotionInput.value = '';
        
        // 阻止背景滚动
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.top = `-${scrollY}px`;
        document.body.dataset.scrollY = scrollY;
        
        // 触发重排后再添加active类
        setTimeout(() => {
            modalOverlay.classList.add('active');
            
            // 尝试立即聚焦
            newEmotionInput.focus();
            
            // 为确保聚焦成功，添加多次尝试
            setTimeout(() => {
                newEmotionInput.focus();
                
                // 最后再尝试一次，确保在移动设备上也能正常工作
                setTimeout(() => {
                    newEmotionInput.focus();
                }, 300);
            }, 100);
        }, 10);
    }
    
    function closeModal() {
        modalOverlay.classList.remove('active');
        
        // 等待过渡效果完成后再隐藏和恢复滚动
        setTimeout(() => {
            modalOverlay.style.display = 'none';
            
            // 恢复背景滚动
            const scrollY = parseInt(document.body.dataset.scrollY || '0');
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.top = '';
            window.scrollTo(0, scrollY);
        }, 300);
    }
    
    function addNewEmotion() {
        const newMood = newEmotionInput.value.trim();
        
        // 验证输入
        if (newMood !== '') {
            console.log("添加新情绪:", newMood);
            
            // 创建新的情绪卡片
            const moodGrid = document.querySelector('.mood-grid');
            const addButton = document.querySelector('.mood-card.add');
            const newCard = document.createElement('div');
            newCard.className = 'mood-card custom-emotion';
            
            // 创建一个包装容器，用于放置文本和删除按钮
            const container = document.createElement('div');
            container.className = 'emotion-content';
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.justifyContent = 'center'; // 居中对齐
            container.style.width = '100%'; // 确保容器占满整个卡片
            container.style.padding = '0 10px'; // 添加一些内边距
            container.style.position = 'relative'; // 添加相对定位，作为删除按钮的定位参考
            
            // 创建情绪文本
            const span = document.createElement('span');
            span.textContent = newMood;
            span.style.fontSize = '14px';
            span.style.fontWeight = 'normal';
            span.style.textAlign = 'center'; // 文本居中
            span.style.marginRight = '0'; // 移除右侧间距
            span.style.marginLeft = '0'; // 移除左侧间距
            
            // 创建删除按钮
            const deleteBtn = document.createElement('div');
            deleteBtn.className = 'delete-emotion-btn';
            deleteBtn.innerHTML = '&times;'; // × 符号
            deleteBtn.style.color = '#fff';
            deleteBtn.style.fontSize = '16px'; // 增大字体大小
            deleteBtn.style.fontWeight = '300'; // 设置更细的字重
            deleteBtn.style.cursor = 'pointer';
            deleteBtn.style.width = '20px'; // 进一步增加按钮宽度
            deleteBtn.style.height = '20px'; // 进一步增加按钮高度
            deleteBtn.style.display = 'flex';
            deleteBtn.style.justifyContent = 'center';
            deleteBtn.style.alignItems = 'center';
            deleteBtn.style.opacity = '0.6'; // 稍微增加默认不透明度
            deleteBtn.style.transition = 'opacity 0.2s';
            deleteBtn.style.position = 'absolute'; // 使用绝对定位
            deleteBtn.style.right = '8px'; // 放在卡片右侧，稍微调整位置
            deleteBtn.style.top = '50%'; // 垂直居中
            deleteBtn.style.transform = 'translateY(-50%)'; // 精确垂直居中
            deleteBtn.style.marginLeft = '0'; // 移除左侧间距
            
            // 添加删除按钮悬停效果
            deleteBtn.addEventListener('mouseover', function(e) {
                this.style.opacity = '1';
            });
            
            deleteBtn.addEventListener('mouseout', function(e) {
                this.style.opacity = '0.6';
            });
            
            // 添加删除功能
            deleteBtn.addEventListener('click', function(e) {
                e.stopPropagation(); // 防止触发卡片的点击事件
                newCard.remove();
            });
            
            // 组装卡片
            container.appendChild(span);
            container.appendChild(deleteBtn);
            newCard.appendChild(container);
            
            // 设置卡片的默认状态样式，与其他情绪卡片保持一致
            newCard.style.background = 'transparent';
            newCard.style.color = '#fff';
            newCard.style.border = '1px solid #435249';
            
            // 添加状态监听，确保选中和悬浮时删除按钮变为黑色
            newCard.addEventListener('click', function() {
                // 检查卡片是否处于选中状态
                if (this.classList.contains('active')) {
                    // 如果选中，删除按钮变为黑色
                    deleteBtn.style.color = '#000';
                } else {
                    // 如果未选中，删除按钮保持白色
                    deleteBtn.style.color = '#fff';
                }
            });
            
            // 添加悬浮状态的样式处理
            newCard.addEventListener('mouseenter', function() {
                deleteBtn.style.color = '#000';
            });
            
            newCard.addEventListener('mouseleave', function() {
                // 只有在非选中状态下才恢复白色
                if (!this.classList.contains('active')) {
                    deleteBtn.style.color = '#fff';
                }
            });
            
            // 插入到+号卡片之前
            moodGrid.insertBefore(newCard, addButton);
            
            // 重新设置所有卡片的事件
            setupMoodCardEvents();
            
            // 关闭模态框
            closeModal();
            
            // 不再自动触发点击，保持默认状态
            // 移除以下代码，使新添加的情绪词保持未选中状态
            /*
            const allCards = document.querySelectorAll('.mood-card');
            allCards.forEach(c => {
                if (c.classList.contains('custom-emotion') && 
                    c.querySelector('span').textContent === newMood) {
                    c.click();
                }
            });
            */
        }
    }
    
    // 模态框事件监听
    modalCloseBtn.addEventListener('click', closeModal);
    modalCancelBtn.addEventListener('click', closeModal);
    
    modalAddBtn.addEventListener('click', addNewEmotion);
    
    // 按Enter键添加
    newEmotionInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            addNewEmotion();
        }
    });
    
    // 点击模态框外部关闭
    modalOverlay.addEventListener('click', function(event) {
        if (event.target === modalOverlay) {
            closeModal();
        }
    });
    
    // 提交按钮点击事件
    const submitButton = document.querySelector('.submit-button');
    const textarea = document.querySelector('.text-input textarea');
    
    // 获取清空按钮
    const clearButton = document.querySelector('.clear-button');
    
    if (submitButton && textarea && clearButton) {
        // 初始状态设置按钮为禁用
        submitButton.disabled = true;
        
        // 监听输入框内容变化，动态启用/禁用按钮和显示/隐藏清空按钮
        textarea.addEventListener('input', function() {
            const hasContent = this.value.trim() !== '';
            // 根据输入框是否有内容来设置按钮状态
            submitButton.disabled = !hasContent;
            // 显示或隐藏清空按钮
            clearButton.style.display = hasContent ? 'flex' : 'none';
        });
        
        // 清空按钮点击事件
        clearButton.addEventListener('click', function() {
            textarea.value = '';  // 清空输入框
            submitButton.disabled = true;  // 禁用确定按钮
            this.style.display = 'none';  // 隐藏清空按钮
            textarea.focus();  // 保持输入框焦点
        });
        
        // 监听文本输入框的回车键事件
        textarea.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                // 只有在文本框有内容时才响应回车
                if (textarea.value.trim() !== '') {
                    event.preventDefault(); // 阻止默认的换行行为
                    submitButton.click(); // 触发确定按钮点击
                }
            }
        });
        
        submitButton.addEventListener('click', function() {
            // 只检查输入框中是否有内容
            if (textarea.value.trim() !== '') {
                const selectedMood = textarea.value.trim();
                showComfortingMessages(selectedMood);
                
                // 取消所有情绪词的选中状态
                const allMoodCards = document.querySelectorAll('.mood-card');
                allMoodCards.forEach(card => {
                    if (!card.classList.contains('add')) {
                        // 移除active类名
                        card.classList.remove('active');
                        
                        // 重置样式
                        card.style.background = 'transparent';
                        card.style.color = '#fff';
                        card.style.border = '1px solid #435249';
                        card.style.boxShadow = 'none';
                        
                        // 重置所有卡片中的文本样式
                        const spanElement = card.querySelector('span');
                        if (spanElement) {
                            spanElement.style.fontSize = '14px';
                            spanElement.style.fontWeight = 'normal';
                        }
                        
                        // 如果是自定义情绪卡片，额外处理删除按钮颜色
                        if (card.classList.contains('custom-emotion')) {
                            const deleteBtn = card.querySelector('.delete-emotion-btn');
                            if (deleteBtn) {
                                deleteBtn.style.color = '#fff';
                            }
                        }
                    }
                });
            }
        });
    }
    
    // 控制台输出调试信息
    console.log('心情互动脚本已加载');
    console.log('情绪卡片数量:', moodCards.length);
    console.log('可用情绪:', Object.keys(window.moodQuotes));
});

// 保存收藏到localStorage
function saveFavorite(id, content, source) {
    let favorites = getFavoritesFromStorage();
    
    // 检查是否已存在相同内容
    const exists = favorites.some(item => item.content === content);
    if (!exists) {
        favorites.push({
            id: id,
            content: content,
            source: source
        });
        localStorage.setItem('heartVersesFavorites', JSON.stringify(favorites));
    }
}

// 从收藏中移除
function removeFavorite(content) {
    let favorites = getFavoritesFromStorage();
    favorites = favorites.filter(item => item.content !== content);
    localStorage.setItem('heartVersesFavorites', JSON.stringify(favorites));
}

// 获取收藏数据
function getFavoritesFromStorage() {
    const storedFavorites = localStorage.getItem('heartVersesFavorites');
    if (storedFavorites) {
        try {
            return JSON.parse(storedFavorites);
        } catch (error) {
            console.error('解析收藏数据出错:', error);
            return [];
        }
    }
    return [];
}
