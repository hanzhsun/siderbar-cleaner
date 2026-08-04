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
- **隐藏右侧栏后居中放大帖文区**：开启该选项后，主栏按 Custom width（默认 680px）加宽，并在主内容区居中；保存时会自动启用 Larger Post Area。
- **去掉易碎布局 class**：放大逻辑不再依赖 `.r-obd0qt`、`.r-10f7w94` 等生成 class。

---

## 微博净化器·内容屏蔽助手

微博网页端内容屏蔽（信息流 / 正文 / 导航 / 侧边栏 / 评论等）。

- 脚本：`微博净化器·内容屏蔽助手-0.0.user.js`
- 版本：**7.3**（与上游一致；本地仅修正论坛复制导致的 `@version` BBCode 污染）

### 出处（非本人原创）

| 项 | 链接 |
| --- | --- |
| 作者 | MRBANK |
| ScriptCat | https://scriptcat.org/zh-CN/script-show-page/5964 |
| GitHub 源码 | https://github.com/hangzai1667/my-tampermonkey-scripts/blob/main/weibo.user.js |
| 更新地址 | https://cdn.jsdelivr.net/gh/hangzai1667/my-tampermonkey-scripts@main/weibo.user.js |
| 吾爱破解讨论帖 | https://www.52pojie.cn/thread-2091758-1-1.html |

请优先从 ScriptCat / GitHub 安装与更新；吾爱帖中的代码可能被论坛自动把 `@version` 转成用户主页链接，不能直接当 userscript 头使用。
