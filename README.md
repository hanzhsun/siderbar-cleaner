# siderbar-cleaner

本仓库收集/维护若干站点净化向油猴脚本。

---

## X/Twitter Clean menu and sidebar

清理 X/Twitter 侧栏与菜单（多语言），可隐藏 Grok、Premium、右侧栏等，并自定义帖文区域宽度。

- 脚本：`X-Twitter Clean menu and sidebar (Supports multiple language)-3.7.user.js`
- 版本：**3.7.1**

### 安装

用 [Tampermonkey](https://www.tampermonkey.net/) 或 [Violentmonkey](https://violentmonkey.github.io/) 导入上述 `.user.js`，打开 x.com 后在扩展菜单进入 Settings。

### v3.7.1 修改说明

- **修复 Hide Right Column**：原先依赖会失效的 `.r-*` / `.css-*` class，已改为稳定选择器 `div[data-testid="sidebarColumn"]`。
- **隐藏右侧栏后居中放大帖文区**：开启该选项后，主栏按 Custom width（默认 680px）加宽，并在主内容区居中后略向左偏（约 48px）；保存时会自动启用 Larger Post Area。
- **去掉易碎布局 class**：放大逻辑不再依赖 `.r-obd0qt`、`.r-10f7w94` 等生成 class。

---

## 微博净化器·内容屏蔽助手

微博网页端内容屏蔽（信息流 / 正文 / 导航 / 侧边栏 / 评论等）。

- 脚本：`微博净化器·内容屏蔽助手-7.3.user.js`
- 版本：**7.3.1**（基于上游 7.3 的本地修改，非原作者发布）

### 出处

| 项 | 链接 |
| --- | --- |
| 作者 | MRBANK |
| ScriptCat | https://scriptcat.org/zh-CN/script-show-page/5964 |
| GitHub 源码 | https://github.com/hangzai1667/my-tampermonkey-scripts/blob/main/weibo.user.js |
| 更新地址 | https://cdn.jsdelivr.net/gh/hangzai1667/my-tampermonkey-scripts@main/weibo.user.js |
| 吾爱破解讨论帖 | https://www.52pojie.cn/thread-2091758-1-1.html |

请优先从 ScriptCat / GitHub 对照上游；吾爱帖中的代码可能被论坛自动把 `@version` 转成用户主页链接，不能直接当 userscript 头使用。

### v7.3.1 完整修改说明

相对上游 **7.3**，本仓库改动如下：

1. **修复脚本头**
   - 修正从吾爱破解复制时被 Discuz 污染的 `@version`（`[url=...]@version[/url]` → 正常的 `// @version 7.3.1`）。

2. **新增「隐藏整个右侧栏并铺满帖文」**
   - 配置面板 → **侧边栏** → 勾选「隐藏整个右侧栏并铺满帖文」后生效。
   - 按当前微博 DOM 隐藏右侧整列：`main > [class*="_side_"]`（以及 `.wbpro-side` 所在列），不再依赖已失效的 `Main_side` / `Main_full` / `Frame_main`。
   - 主栏（`main > [class*="_full_"]`）按剩余空间拉宽铺满。
   - 宽屏下不再沿用微博默认「整块居中」留下的超大空白。

3. **布局参数**
   - 桌面（宽度 ≥ 1100）：**左边距 40px**、**右边距 80px**，左侧栏约 **150px**（栏内菜单略向左靠）。
   - 右边距按 `viewport - 左 - 内容宽` 保留，避免 flex `stretch` / midGap 误算把右侧空白挤掉。
   - iPad 横屏 / 小笔电（900–1100）：左边距约 24px、右边距约 48px，左侧栏约 **135px**。
   - iPad 竖屏（700–900）：左边距约 16px、右边距约 32px，左侧栏约 **120px**。
   - 更窄屏幕：进一步收紧，尽量保证主栏可读。
   - 使用 `clientWidth` 计算宽度，并监听 `resize`、`orientationchange`。

4. **iPad 使用说明**
   - 请用 Safari + [Userscripts](https://apps.apple.com/app/userscripts/id1463298887)（或支持的油猴扩展）安装本脚本，打开 **桌面版** `weibo.com`（不要用手机版 `m.weibo.cn`）。
   - 若脚本不生效，多半是 Safari 的 CSP 限制；可在脚本头尝试增加 `// @inject-into content`（视扩展支持情况而定）。
   - 横竖屏切换后若布局未跟上，刷新一次页面即可。

5. **其它**
   - 保存配置后会立即应用右侧栏布局，无需整页刷新（仍建议改完脚本后重新导入并刷新一次页面）。
   - 脚本内日志前缀为 `【微博屏蔽 v7.3.1】`。
