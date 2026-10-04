# siderbar-cleaner

本仓库收集/维护若干站点净化向油猴脚本。

---

## X/Twitter Clean menu and sidebar（主脚本 · 3.7）

清理 X/Twitter 侧栏与菜单（多语言），可隐藏 Grok、Premium、书签、右侧栏等，并自定义帖文区域宽度。

---

## X/Twitter Sidebar Pin（增强脚本 · 1.1）

与 3.7 配合使用，提供：

- 隐藏主页 / 隐藏关注 / 隐藏发帖 / 隐藏右侧栏 / 钉选书签
- 隐藏右侧栏时：左侧栏保持原靠边；主栏尽量居中，左边界不超过侧栏
- iPad / 捏合缩放：按可见视口（`visualViewport`）计算宽度与位置

详细实现说明见 [docs/X-Twitter-Sidebar-Pin.md](docs/X-Twitter-Sidebar-Pin.md)。

---

## 更好的 X（BetterX · 3.8.0）

X 帖子记录与管理、黄推 / 广告过滤、界面简化与宽屏、一键下载图片 / 视频 / GIF 等。本仓库保存上游 **3.8.0** 原版，以及一份适配 iPad Stay 的修改版。

- 原版：`更好的 X（BetterX）-3.8.0.user.js`（未改动）
- Stay 版：`更好的 X（BetterX）-3.8.0-stay.user.js`
- 菜单：脚本管理器 → **BetterX：显示 / 隐藏应用徽标**；面板快捷键 `Alt+X`

### 出处


| 项           | 链接                                                                             |
| ----------- | ------------------------------------------------------------------------------ |
| 作者          | 流萤可爱捏                                                                          |
| Greasy Fork | [https://greasyfork.org/scripts/588748](https://greasyfork.org/scripts/588748) |


### Stay 版修改

在 iPad Safari + Stay 上，原版**完全不注入**（没有徽标、没有右侧小蓝条，脚本第一行代码都不执行）。逐项排查确认原因是 Stay 遇到 `@grant unsafeWindow` 就跳过整个脚本。

相对原版只改了文件头，脚本正文逐字相同：

- 删除 `// @grant        unsafeWindow`
- 删除 `@downloadURL` / `@updateURL`，避免被自动更新回原版
- 删除多语言 `@name:*`，`@name` 改为 **更好的 X（BetterX）Stay 版**，便于和原版区分

### 功能影响

没有 `unsafeWindow` 时，`getPageWindow()` 退回到脚本自己的 `window`，拦截不到 X 页面的 `fetch` / `XMLHttpRequest`（与上游 Firefox 兼容模式的降级相同）：

- 部分视频 / GIF 拿不到真实下载地址
- 部分年龄限制视频无法在页面内直接显示
- 无法从接口响应识别关注关系，改为主要依靠主页按钮和“正在关注”时间线

帖子记录、面板、内容净化、广告过滤、布局、图片下载不受影响。

注：上游的“兼容 Firefox”开关只在 Firefox 下生效，并且是在脚本运行后才判断，因此无法替代这项文件头修改。Userscripts 扩展本身不提供 `unsafeWindow`，换用它也无法恢复上述功能。

---

## 微博净化器·内容屏蔽助手（主脚本 · 7.3）

微博网页端内容屏蔽（信息流 / 正文 / 导航 / 侧边栏模块 / 评论等）。本仓库保持上游 **7.3**，不在此脚本里加整栏布局。

### 出处


| 项         | 链接                                                                                                                                                                       |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 作者        | MRBANK                                                                                                                                                                   |
| ScriptCat | [https://scriptcat.org/zh-CN/script-show-page/5964](https://scriptcat.org/zh-CN/script-show-page/5964)                                                                   |
| GitHub 源码 | [https://github.com/hangzai1667/my-tampermonkey-scripts/blob/main/weibo.user.js](https://github.com/hangzai1667/my-tampermonkey-scripts/blob/main/weibo.user.js)         |
| 更新地址      | [https://cdn.jsdelivr.net/gh/hangzai1667/my-tampermonkey-scripts@main/weibo.user.js](https://cdn.jsdelivr.net/gh/hangzai1667/my-tampermonkey-scripts@main/weibo.user.js) |
| 吾爱破解讨论帖   | [https://www.52pojie.cn/thread-2091758-1-1.html](https://www.52pojie.cn/thread-2091758-1-1.html)                                                                         |


请优先从 ScriptCat / GitHub 对照上游；吾爱帖中的代码可能被论坛自动把 `@version` 转成用户主页链接，不能直接当 userscript 头使用。

---

## 微博藏藏藏（增强脚本 · 1.0）

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

净化器里的「侧边栏」页仍负责按模块开关（热搜 / 感兴趣的人等）。整栏隐藏请用本脚本，避免两套布局互相覆盖。

