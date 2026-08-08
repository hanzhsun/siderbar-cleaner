# X/Twitter Sidebar Pin · v1.0 实现说明

配合主脚本 3.7 使用。设置独立存储；菜单：Tampermonkey → **侧栏固定设置**。

若 3.7 里也开了「隐藏右侧栏」，建议关掉，改由本脚本负责，避免样式互相覆盖。

设置项顺序：**隐藏主页 → 隐藏关注 → 隐藏发帖 → 隐藏右侧栏（含主栏宽度）→ 钉选书签**。保存后写 `GM_setValue` 并刷新页面。

---

## 1. 隐藏主页

- **做法**：注入 CSS，对左侧 `header[role="banner"]` 内主页入口设 `display: none`。
- **选择器**：`a[data-testid="AppTabBar_Home_Link"]`，以及多语言 `aria-label`（Home / 主页 / 首頁 / ホーム）。

## 2. 隐藏关注

- **做法**：CSS + DOM 双通道。
- **CSS**：按 `aria-label`（Follow / 关注 / 關注 / フォロー）隐藏。
- **DOM**：`MutationObserver` 触发时扫描侧栏 `a` / `button`，用文案精确匹配上述标签（避免误伤 Profile / Home）；命中后给整行加 `display: none`，并标记 `data-x-pin-hide-follow` 供 CSS 兜底。

## 3. 隐藏发帖

- **做法**：CSS 隐藏侧栏发帖按钮。
- **选择器**：`a[data-testid="SideNav_NewTweet_Button"]`，以及 `href` 含 `/compose/post`、`/compose/tweet` 的链接。

## 4. 隐藏右侧栏 + 主栏居中 / 防重叠

这是相对 3.7 旧实现的主要修复（3.7 依赖易变的 `.r-*` / `.css-*` class，已失效）。

- **隐藏右侧栏**：稳定选择器 `div[data-testid="sidebarColumn"]`，`display: none` 并清零宽高 / flex，避免仍占位。
- **左侧栏不动**：不对 `header[role="banner"]` 做 `transform` / 平移（曾因此导致侧栏图标叠到时间线中间）。
- **主栏定位**：只改 `div[data-testid="primaryColumn"]` 的 `width` / `flex` / `margin-left`。
  1. 用 `visualViewport` 与 `clientWidth` 取更窄的可见宽度，并读 `offsetLeft`（iPad 捏合缩放、平移）。
  2. 量左侧栏右边界 `getBoundingClientRect().right`。
  3. 理想位置：主栏在可见视口水平居中。
  4. **夹紧**：主栏左缘 ≥ 侧栏右缘 + 12px，避免缩放后与侧栏重合；空间不够时缩小主栏宽度（下限约 280px）。
  5. 宽度优先取设置里的「主栏宽度」（默认 680），再受上述可用空间限制。
- **聊天页例外**：路径为 `/i/chat`、`/messages` 时加 `html.x-pin-chat-page`，跳过隐藏右侧栏与主栏改布局。
- **重算时机**：`resize`、`orientationchange`、`visualViewport` 的 resize/scroll、SPA 路由（劫持 `history.pushState` / `replaceState` + `popstate`）、以及 body 的 `MutationObserver`。

## 5. 钉选书签

窄侧栏 / iPad 上 X 常把书签收进「更多」；本功能把书签图标固定到 X 标正下方。

- **定位品牌链**：优先 `a[aria-label="X"]`，否则在侧栏找非 `AppTabBar_Home` 的 `/home` 链接。
- **插入方式**：`cloneNode` 品牌链，插在其 `after`；保留品牌链的 class / 结构，避免破坏 X 原有侧栏样式。
- **图标**：把 SVG `path` 换成书签 outline / filled（当前页为 `/i/bookmarks` 时用实心，并设 `aria-current="page"`）。
- **跳转**：`href` **故意不用** `/i/bookmarks`（X 会按 href 套布局 CSS，易把侧栏撑乱）；点击时 `preventDefault`，再用 `location.assign('/i/bookmarks')`；Ctrl/⌘/中键新开标签。
- **原生书签**：CSS + DOM 隐藏侧栏原有 `bookmarks` 链接，避免重复入口。
- **防抖**：插入过程用 `bookmarksInserting` 标志，避免 Observer 循环重插。

## 6. 设置面板与多语言

- 自建浮层 `#xSidebarPinSettingsPanel`，通过 `GM_registerMenuCommand` 打开。
- 文案按 `navigator.language` 选 en / zh-CN / zh-TW / ja。
- 「主栏宽度」仅在开启「隐藏右侧栏」时可编辑。
