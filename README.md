# siderbar-cleaner

本仓库收集/维护若干站点净化向油猴脚本。

---

## X/Twitter Clean menu and sidebar（主脚本 · 3.7）

清理 X/Twitter 侧栏与菜单（多语言），可隐藏 Grok、Premium、书签、右侧栏等，并自定义帖文区域宽度。

- 脚本：`X-Twitter Clean menu and sidebar (Supports multiple language)-3.7.user.js`
- 版本：**3.7**
- 菜单：Tampermonkey → **Settings**

---

## X/Twitter Sidebar Pin（增强脚本 · 1.1）

与 3.7 配合使用，提供：

- 隐藏主页 / 隐藏关注 / 隐藏发帖 / 隐藏右侧栏 / 钉选书签
- 隐藏右侧栏时：左侧栏保持原靠边；主栏尽量居中，左边界不超过侧栏
- iPad / 捏合缩放：按可见视口（`visualViewport`）计算宽度与位置

- 脚本：`X-Twitter Sidebar Pin-1.1.user.js`
- 版本：**1.1**
- 作者：hanzhsun
- 菜单：Tampermonkey → **侧栏固定设置**

详细实现说明见 [docs/X-Twitter-Sidebar-Pin.md](docs/X-Twitter-Sidebar-Pin.md)。

### 安装

1. 安装主脚本 `…3.7.user.js`
2. 再安装 `X-Twitter Sidebar Pin-1.1.user.js`

---

## 微博净化器·内容屏蔽助手（主脚本 · 7.3）

微博网页端内容屏蔽（信息流 / 正文 / 导航 / 侧边栏模块 / 评论等）。本仓库保持上游 **7.3**，不在此脚本里加整栏布局。

- 脚本：`微博净化器·内容屏蔽助手-7.3.user.js`
- 版本：**7.3**
- 菜单：Tampermonkey → **打开配置面板**

### 出处

| 项 | 链接 |
| --- | --- |
| 作者 | MRBANK |
| ScriptCat | https://scriptcat.org/zh-CN/script-show-page/5964 |
| GitHub 源码 | https://github.com/hangzai1667/my-tampermonkey-scripts/blob/main/weibo.user.js |
| 更新地址 | https://cdn.jsdelivr.net/gh/hangzai1667/my-tampermonkey-scripts@main/weibo.user.js |
| 吾爱破解讨论帖 | https://www.52pojie.cn/thread-2091758-1-1.html |

请优先从 ScriptCat / GitHub 对照上游；吾爱帖中的代码可能被论坛自动把 `@version` 转成用户主页链接，不能直接当 userscript 头使用。

---

## 微博藏藏藏（增强脚本 · 1.0）

与净化器 7.3 配合使用。设置独立存储；菜单：Tampermonkey → **设置**。

相对 7.3 新增、并从净化器中拆出的能力：

- 隐藏右侧栏 / 隐藏翻译 / 隐藏赞赏
- 左侧栏贴浏览器左边缘（与 X 相同），不对左栏做平移
- 按当前微博 DOM 隐藏右侧整列：`main > [class*="_side_"]`（以及 `.wbpro-side` 所在列），不再依赖已失效的 `Main_side` / `Main_full` / `Frame_main`
- 主栏（`main > [class*="_full_"]`）按剩余空间拉宽铺满
- 宽屏下不再沿用微博默认「整块居中」留下的超大空白

**布局参数**

- 桌面（宽度 ≥ 1100）：左侧栏贴边约 **150px**，左栏与主栏间距约 **12px**，**右边距 80px**
- 右边距按 `viewport - 内容宽` 保留，避免 flex `stretch` 把右侧空白挤掉
- iPad 横屏 / 小笔电（900–1100）：左侧栏约 **135px**、右边距约 48px
- iPad 竖屏（700–900）：左侧栏约 **120px**、右边距约 32px
- 更窄屏幕：进一步收紧，尽量保证主栏可读
- 使用 `clientWidth` 计算宽度，并监听 `resize`、`orientationchange`、微博 SPA 切页

- 脚本：`微博藏藏藏-1.0.user.js`
- 版本：**1.0**
- 作者：hanzhsun
- 菜单：Tampermonkey → **设置**

### 安装

1. 安装主脚本 `微博净化器·内容屏蔽助手-7.3.user.js`（内容屏蔽）
2. 再安装 `微博藏藏藏-1.0.user.js`（整栏隐藏 + 主栏铺满）

净化器里的「侧边栏」页仍负责按模块开关（热搜 / 感兴趣的人等）。整栏隐藏请用本脚本，避免两套布局互相覆盖。

### iPad 使用说明

- 请用 Safari + [Userscripts](https://apps.apple.com/app/userscripts/id1463298887)（或支持的油猴扩展）安装本脚本，打开 **桌面版** `weibo.com`（不要用手机版 `m.weibo.cn`）。
- 若脚本不生效，多半是 Safari 的 CSP 限制；可在脚本头尝试增加 `// @inject-into content`（视扩展支持情况而定）。
- 横竖屏切换后若布局未跟上，刷新一次页面即可。
