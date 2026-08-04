# X/Twitter Clean menu and sidebar

油猴脚本：清理 X/Twitter 侧栏与菜单（多语言），可隐藏 Grok、Premium、右侧栏等，并自定义帖文区域宽度。

脚本文件：`X-Twitter Clean menu and sidebar (Supports multiple language)-3.7.user.js`  
当前版本：**3.7.1**

## 安装

用 [Tampermonkey](https://www.tampermonkey.net/) 或 [Violentmonkey](https://violentmonkey.github.io/) 导入上述 `.user.js`，打开 x.com 后在扩展菜单进入 Settings。

## v3.7.1 修改说明

- **修复 Hide Right Column**：原先依赖会失效的 `.r-*` / `.css-*` class，已改为稳定选择器 `div[data-testid="sidebarColumn"]`。
- **隐藏右侧栏后居中放大帖文区**：开启该选项后，主栏按 Custom width（默认 680px）加宽，并在主内容区居中；保存时会自动启用 Larger Post Area。
- **去掉易碎布局 class**：放大逻辑不再依赖 `.r-obd0qt`、`.r-10f7w94` 等生成 class。
