# Obsidian 简单倒计时小组件

<p align="center">
中文 | <a href="README.md">English</a>
</p>

一个优雅的 Obsidian 倒计时小组件插件，为重要事件和截止日期显示精美的倒计时卡片。

<p align="center">
 <img src="assets/screenshot.png" alt="插件预览" width="60%">
</p>

<details>
<summary>📖 JSON 格式示例</summary>

````
```countdown
[
  {
    "date": "2025-12-25",
    "title": "圣诞节",
    "color": "#dc3545",
    "format": "MMM Do, YYYY"
  },
  {
    "date": "2025-06-01", 
    "title": "儿童节"
    // 使用设置中的默认颜色和格式
  }
]
```
````

</details>

<p align="center">
 <img src="assets/screenshot-4.png" alt="插件预览" width="60%">
</p>

<details>
<summary>📝 文本格式示例</summary>

````
```countdown
2024-10-25 | 离开家 | #d9534f
2025-10-25 | 回家 | #2c7be5
2025-07-25 | 去布鲁塞尔 | #28a745
2025-07-22T23:00 | 睡前提交 | #6f42c1 | YY-MM-DD HH:mm:ss
```
````

</details>

## ✨ 功能特性

- 🎨 **可自定义卡片**：为每个倒计时设置颜色和日期格式
- ⚙️ **简易配置**：在设置中调整格式、颜色和字体大小
- 📝 **灵活输入**：支持 JSON 或简单文本格式
- 🧠 **智能时间显示**：根据剩余时间自动调整时间精度
  - **已过期事件**：显示已过去多少天
  - **7天以上**：仅显示天数
  - **1-7天**：显示天数和小时
  - **1小时-1天**：显示小时和分钟
  - **1小时以内**：仅显示分钟

> [!IMPORTANT]
> **刷新机制**：倒计时块只有在重新渲染时才会刷新时间显示。这种情况包括：
>
> - 重新打开笔记
> - 切换到编辑模式再回到预览模式
> - 笔记视图被刷新或重新加载
>
> 倒计时小组件不会实时自动更新。要查看最新的倒计时值，您需要使用上述方法之一触发重新渲染。

## 📦 安装

### 手动安装

1. 从 [GitHub Releases](https://github.com/ZiyuZ/obsidian-simple-countdown/releases) 下载最新版本
2. 将 `obsidian-simple-countdown` 文件夹解压到您知识库的 `.obsidian/plugins/` 文件夹中
3. 重新加载 Obsidian 并在社区插件设置中启用该插件

### 从社区安装插件

> 该插件尚未在 Obsidian 社区插件列表中提供，因此目前需要手动安装。

## 🚀 使用方法

### 基本文本格式

```
2025-12-25 | 圣诞节 | #dc3545 | MM月DD日
2025-06-01 | 儿童节 | #28a745
2025-01-01 | 新年
# 这是注释，会被忽略
```

### JSON 格式

```json5
[
  {
    "date": "2025-12-25",
    "title": "圣诞节",
    "color": "#dc3545",
    "format": "MMM Do, YYYY"
  },
  {
    "date": "2025-06-01", 
    "title": "儿童节"
    // 使用设置中的默认颜色和格式
  }
]
```

### 创建倒计时块

只需使用 `countdown` 语言标签创建代码块：

````markdown
```countdown
2025-12-25 | 圣诞节 | #dc3545
2025-06-01 | 暑假 | #28a745
```
````

## ⚙️ 配置

<p align="center">
 <img src="assets/config_cn.png" alt="插件预览" width="80%">
</p>

### 访问设置

您可以通过以下方式访问插件设置：

- `设置 → 社区插件 → Simple Countdown Widget → 选项`
- 或使用快捷键 `Ctrl/Cmd + ,` 打开设置，然后找到该插件

### 可用设置

**语言选择**

- 在中英文界面之间切换
- 设置面板会立即更新

**默认日期格式**

- 设置卡片上显示日期的默认格式
- 使用 dayjs 格式化语法（例如：YYYY-MM-DD、MMM Do YYYY 等）

**默认卡片颜色**

- 设置倒计时卡片的默认背景色
- 使用十六进制颜色值（例如：#007bff、#28a745）

**字体大小自定义**

- **日期字体大小**：调整日期文本的字体大小（10-24px）
- **标题字体大小**：调整事件标题的字体大小（16-36px）
- **时间字体大小**：调整倒计时时间文本的字体大小（16-32px）

> [!IMPORTANT]
> 更改设置后，您可能需要：
>
> - 切换到编辑模式再回到预览模式，或
> - 重新打开笔记以查看应用到现有倒计时小组件的更改

### 日期格式示例

| 格式代码       | 示例输出       | 描述         |
| -------------- | -------------- | ------------ |
| `YYYY-MM-DD`   | 2025-07-22     | 标准格式     |
| `MM/DD/YYYY`   | 07/22/2025     | 美式格式     |
| `DD/MM/YYYY`   | 22/07/2025     | 欧式格式     |
| `MMM Do, YYYY` | Jul 22nd, 2025 | 英文格式     |
| `MM月DD日`     | 07月22日       | 中文格式     |
| `dddd`         | Tuesday        | 仅显示星期几 |

### 优先级

设置按以下优先级顺序应用：

1. 项目特定值（最高优先级）
2. 用户默认设置
3. 内置默认值（最低优先级）

## 📖 输入格式参考

### 文本格式语法

```
日期 | 标题 | 颜色(可选) | 日期格式(可选)
```

### JSON 格式架构

```typescript
interface CountdownItem {
  date: string;        // 必需：ISO 日期字符串
  title: string;       // 必需：事件标题
  color?: string;      // 可选：十六进制颜色（例如：#ff0000）
  format?: string;     // 可选：日期格式（dayjs 格式）
}
```

### 支持的日期格式

- ISO 日期：`2025-12-25`、`2025-12-25T23:59:59`
- dayjs 库支持的各种格式

## 🎨 颜色选项

使用十六进制颜色代码进行自定义颜色：

<ul>
  <li><span style="display:inline-block; width: 1em; height: 1em; background-color:#007bff; vertical-align:middle; margin-right:0.2em;"></span> <code>#007bff</code> - 蓝色（默认）</li>
  <li><span style="display:inline-block; width: 1em; height: 1em; background-color:#28a745; vertical-align:middle; margin-right:0.2em;"></span> <code>#28a745</code> - 绿色</li>
  <li><span style="display:inline-block; width: 1em; height: 1em; background-color:#dc3545; vertical-align:middle; margin-right:0.2em;"></span> <code>#dc3545</code> - 红色</li>
  <li><span style="display:inline-block; width: 1em; height: 1em; background-color:#ffc107; vertical-align:middle; margin-right:0.2em;"></span> <code>#ffc107</code> - 黄色</li>
  <li><span style="display:inline-block; width: 1em; height: 1em; background-color:#6f42c1; vertical-align:middle; margin-right:0.2em;"></span> <code>#6f42c1</code> - 紫色</li>
</ul>

> [!TIP]
> 由于事件标题文本显示为白色，请使用较深的背景色以获得更好的可读性和对比度。

## 🔧 开发

### 前置要求

- Obsidian
- bun

### 设置

```bash
# 克隆仓库
git clone https://github.com/ZiyuZ/obsidian-simple-countdown.git
cd obsidian-simple-countdown-widget

# 安装依赖
bun install

# 启动开发构建
bun run dev
```

> [!TIP]
> 如果在 Obsidian 插件目录下开发, 可能需要手动更改 `manifest.json` 的 `main` 字段为 `dist/main.js`。

### 构建

```bash
# 生产构建
bun run build
```

然后将 dist 目录中的文件复制到 `<Obsidian 知识库>/.obsidian/plugins/obsidian-simple-countdown`

### 项目结构

```
obsidian-simple-countdown/
├── src/
│   ├── main.ts                 # 主插件入口点
│   ├── settings.ts             # 插件设置和配置
│   ├── locale.ts               # 国际化支持
│   ├── types/
│   │   └── index.ts            # 类型定义
│   ├── templates/
│   │   ├── card-templates.ts   # 卡片 HTML 模板
│   │   └── alert-templates.ts  # 错误提示模板
│   ├── parsers/
│   │   └── countdown-parser.ts    # 倒计时项目解析器
│   └── utils/
│       └── time-utils.ts       # 时间计算工具
├── assets/                     # 截图和图片
├── dist/                       # 构建文件
├── manifest.json               # 插件清单
├── package.json                # 依赖和脚本
├── tsconfig.json               # TypeScript 配置
├── esbuild.config.mjs          # 构建配置
└── README.md                   # 本文件
```

## 📝 许可证

本项目使用 MIT 许可证 - 详情请参见 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- 基于 [Obsidian Plugin API](https://github.com/obsidianmd/obsidian-api) 构建
- 使用 [dayjs](https://day.js.org/) 进行日期操作
- 特别感谢 [GitHub Copilot](https://github.com/features/copilot)

---

<p style="font-size: 1.2em; color: #F07171; text-align: center;"><b>祝您倒计时愉快！🎉</b></p>
