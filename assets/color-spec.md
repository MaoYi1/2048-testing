# 2048 小游戏颜色规范 (Color Specification)

本文档是 2048 小游戏的完整配色规范，供开发直接引用。

---

## 一、页面与棋盘背景色

| 用途 | CSS 变量建议 | HEX 色值 | 预览 |
|------|------------|---------|------|
| 页面背景色 | `--color-page-bg` | `#FAF8EF` | ![#FAF8EF](https://placehold.co/20x20/FAF8EF/FAF8EF) |
| 棋盘背景色 | `--color-board-bg` | `#BBADA0` | ![#BBADA0](https://placehold.co/20x20/BBADA0/BBADA0) |
| 空格背景色 | `--color-cell-empty` | `#CDC1B4` | ![#CDC1B4](https://placehold.co/20x20/CDC1B4/CDC1B4) |

---

## 二、UI 主色调（标题 / 按钮 / 分数框）

| 用途 | CSS 变量建议 | HEX 色值 |
|------|------------|---------|
| 主色调（标题/按钮背景） | `--color-primary` | `#8F7A66` |
| 主色调文字色 | `--color-primary-text` | `#F9F6F2` |
| 分数框背景色 | `--color-score-bg` | `#BBADA0` |
| 分数框文字色 | `--color-score-text` | `#F9F6F2` |

---

## 三、方块配色方案（数值 → 颜色映射）

| 方块数值 | 背景色（HEX） | 文字色（HEX） | 字号建议 | CSS 背景变量 |
|---------|------------|------------|--------|------------|
| 2 | `#EEE4DA` | `#776E65` | 55px | `--tile-2` |
| 4 | `#EDE0C8` | `#776E65` | 55px | `--tile-4` |
| 8 | `#F2B179` | `#F9F6F2` | 55px | `--tile-8` |
| 16 | `#F59563` | `#F9F6F2` | 55px | `--tile-16` |
| 32 | `#F67C5F` | `#F9F6F2` | 55px | `--tile-32` |
| 64 | `#F65E3B` | `#F9F6F2` | 55px | `--tile-64` |
| 128 | `#EDCF72` | `#F9F6F2` | 45px | `--tile-128` |
| 256 | `#EDCC61` | `#F9F6F2` | 45px | `--tile-256` |
| 512 | `#EDC850` | `#F9F6F2` | 45px | `--tile-512` |
| 1024 | `#EDC53F` | `#F9F6F2` | 35px | `--tile-1024` |
| 2048 | `#EDC22E` | `#F9F6F2` | 35px | `--tile-2048` |
| 4096+ | `#3C3A32` | `#F9F6F2` | 30px | `--tile-super` |

---

## 四、CSS 变量完整声明（可直接复制到样式表）

```css
:root {
  /* 页面 & 棋盘 */
  --color-page-bg:    #FAF8EF;
  --color-board-bg:   #BBADA0;
  --color-cell-empty: #CDC1B4;

  /* 主色调 */
  --color-primary:      #8F7A66;
  --color-primary-text: #F9F6F2;
  --color-score-bg:     #BBADA0;
  --color-score-text:   #F9F6F2;

  /* 方块背景色 */
  --tile-2-bg:    #EEE4DA;
  --tile-4-bg:    #EDE0C8;
  --tile-8-bg:    #F2B179;
  --tile-16-bg:   #F59563;
  --tile-32-bg:   #F67C5F;
  --tile-64-bg:   #F65E3B;
  --tile-128-bg:  #EDCF72;
  --tile-256-bg:  #EDCC61;
  --tile-512-bg:  #EDC850;
  --tile-1024-bg: #EDC53F;
  --tile-2048-bg: #EDC22E;
  --tile-super-bg:#3C3A32;

  /* 方块文字色 */
  --tile-2-text:    #776E65;
  --tile-4-text:    #776E65;
  --tile-8-text:    #F9F6F2;
  --tile-16-text:   #F9F6F2;
  --tile-32-text:   #F9F6F2;
  --tile-64-text:   #F9F6F2;
  --tile-128-text:  #F9F6F2;
  --tile-256-text:  #F9F6F2;
  --tile-512-text:  #F9F6F2;
  --tile-1024-text: #F9F6F2;
  --tile-2048-text: #F9F6F2;
  --tile-super-text:#F9F6F2;
}
```

---

## 五、字体规范

- **方块数字 / 标题**：`font-weight: bold`，优先 `"Clear Sans"`，fallback: `"Arial", "Helvetica Neue", sans-serif`
- **普通 UI 文字**：`font-weight: normal`，同上字族

---

*版本：v1.0 | 日期：2026-06-08 | 来源：2048 小游戏策划案第八节*
