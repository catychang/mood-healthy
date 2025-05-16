// 收藏按钮图标切换扩展
document.addEventListener('DOMContentLoaded', function() {
    // 监听收藏按钮点击事件，使用事件委托
    document.addEventListener('click', function(e) {
        const favoriteBtn = e.target.closest('.favorite-btn');
        if (favoriteBtn) {
            // 切换图标
            toggleFavoriteIcon(favoriteBtn);
        }
    });

    // 检查已有的收藏状态并设置正确的图标
    updateExistingFavoriteIcons();
});

// 切换收藏按钮的图标
function toggleFavoriteIcon(button) {
    if (button.classList.contains('active')) {
        // 已收藏状态
        button.innerHTML = '<img src="icons/已收藏.svg" alt="已收藏" width="18" height="18">';
    } else {
        // 未收藏状态
        button.innerHTML = '<img src="icons/添加收藏.svg" alt="添加收藏" width="18" height="18">';
    }
}

// 更新所有现有收藏按钮的图标
function updateExistingFavoriteIcons() {
    const favoriteBtns = document.querySelectorAll('.favorite-btn');
    
    favoriteBtns.forEach(btn => {
        if (btn.classList.contains('active')) {
            btn.innerHTML = '<img src="icons/已收藏.svg" alt="已收藏" width="18" height="18">';
        } else {
            btn.innerHTML = '<img src="icons/添加收藏.svg" alt="添加收藏" width="18" height="18">';
        }
    });
}

// 在创建新的引言卡片时使用正确的图标
const originalCreateQuoteCard = window.createQuoteCard;
if (originalCreateQuoteCard) {
    window.createQuoteCard = function(quote) {
        const card = originalCreateQuoteCard(quote);
        if (card) {
            const favoriteBtn = card.querySelector('.favorite-btn');
            if (favoriteBtn) {
                // 检查是否已收藏
                if (favoriteBtn.classList.contains('active')) {
                    favoriteBtn.innerHTML = '<img src="icons/已收藏.svg" alt="已收藏" width="18" height="18">';
                } else {
                    favoriteBtn.innerHTML = '<img src="icons/添加收藏.svg" alt="添加收藏" width="18" height="18">';
                }
            }
        }
        return card;
    };
} 