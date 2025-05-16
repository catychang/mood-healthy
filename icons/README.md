# 心语安慰 图标集

这个文件夹包含了"心语安慰"网站使用的SVG图标集。所有图标都使用`currentColor`属性，这意味着它们会继承父元素的颜色，便于样式定制。

## 使用方法

### 在HTML中直接使用

可以直接将SVG代码复制到HTML中：

```html
<button class="action-button">
    <!-- 直接粘贴SVG代码 -->
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <!-- SVG路径 -->
    </svg>
</button>
```

### 作为背景图像使用

```css
.icon-button {
    background-image: url('icons/trash.svg');
    background-size: 16px 16px;
    background-position: center;
    background-repeat: no-repeat;
}
```

### 使用img标签

```html
<img src="icons/heart.svg" alt="收藏" width="16" height="16">
```

## 可用图标

- `trash.svg` - 垃圾桶/删除按钮
- `trash-alt.svg` - 垃圾桶替代版本
- `trash-simple.svg` - 简化版垃圾桶
- `copy.svg` - 复制按钮
- `heart.svg` - 实心心形
- `heart-outline.svg` - 心形轮廓
- `close.svg` - 关闭按钮

## 自定义

可以通过CSS修改图标颜色：

```css
.delete-button svg {
    stroke: #FF6B6B; /* 红色删除按钮 */
}

.like-button svg {
    fill: #6AFFA0; /* 绿色收藏按钮 */
}
``` 