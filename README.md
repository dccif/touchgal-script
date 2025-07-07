# TouchGal VNDB链接转换器

一个用于TouchGal网站的用户脚本，自动将页面上的VNDB ID转换为可点击的链接，方便用户直接跳转到VNDB页面查看游戏详情。

## 🚀 快速安装

### 一键安装
[![Install Script](https://img.shields.io/badge/Install-UserScript-brightgreen?style=for-the-badge&logo=tampermonkey)](https://update.greasyfork.org/scripts/541927/TouchGal%20VNDB%E9%93%BE%E6%8E%A5%E8%BD%AC%E6%8D%A2%E5%99%A8.user.js)

**点击上方按钮直接安装脚本**

### 脚本链接
- **Greasy Fork**: [TouchGal VNDB链接转换器](https://greasyfork.org/zh-CN/scripts/541927)
- **直接安装**: [点击安装](https://update.greasyfork.org/scripts/541927/TouchGal%20VNDB%E9%93%BE%E6%8E%A5%E8%BD%AC%E6%8D%A2%E5%99%A8.user.js)

## 功能特性

- 🔗 **自动转换**: 自动识别页面中的"VNDB ID: v****"格式文本
- 🎨 **样式一致**: 新生成的链接与页面原有链接保持一致的样式

## 支持网站

- [TouchGal.io](https://www.touchgal.io/)
- [TouchGal.us](https://www.touchgal.us/)

## 安装方法

### 方法一：从Greasy Fork安装（推荐）

1. **安装用户脚本管理器**：
   - Chrome/Edge: [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - Firefox: [Tampermonkey](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/) 或 [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)

2. **安装脚本**：
   - 访问 [Greasy Fork 脚本页面](https://greasyfork.org/zh-CN/scripts/541927)
   - 或者直接点击 [安装链接](https://update.greasyfork.org/scripts/541927/TouchGal%20VNDB%E9%93%BE%E6%8E%A5%E8%BD%AC%E6%8D%A2%E5%99%A8.user.js)

### 方法二：从GitHub安装

1. 下载 `dist/touch-script.user.js` 文件
2. 在Tampermonkey管理面板中选择"添加新脚本"
3. 将文件内容粘贴到编辑器中
4. 保存脚本

## 使用说明

安装脚本后，访问TouchGal网站的任何游戏页面，脚本会自动：

1. 检测页面中的"VNDB ID: v****"文本
2. 将数值部分转换为可点击的链接
3. 点击链接将在新标签页打开对应的VNDB页面

## 许可证

本项目采用 [MIT 许可证](LICENSE) - 查看 LICENSE 文件了解详情。

## 相关链接

- [TouchGal官网](https://www.touchgal.io/)
- [VNDB数据库](https://vndb.org/)
- [Greasy Fork](https://greasyfork.org/)
- [Tampermonkey](https://www.tampermonkey.net/)

## 支持项目

如果这个脚本对你有帮助，请考虑：
- ⭐ 给项目点个Star
- 🐛 报告Bug或提出改进建议
- 📢 分享给其他TouchGal用户 