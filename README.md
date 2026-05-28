# 批量导出链接与 Key Figma 插件

这个插件会读取当前选中的 Frame、Component 和 Component set，并在插件面板中输出两类结果：

```text
节点名：https://www.figma.com/design/FILE_KEY/文件名?node-id=节点ID
组件名：COMPONENT_KEY
```

## 使用方式

1. 打开 Figma 桌面端。
2. 进入 `Plugins > Development > Import plugin from manifest...`。
3. 选择本目录下的 `manifest.json`。
4. 在画布中批量选中画板、组件或组件集。
5. 运行插件，点击 `导出`。

点击 `导出` 会同时生成链接和 Key，并分别回显到 `链接` 和 `Key` 两个 tab 的文本框里。输出默认用换行分隔。点击 `复制` 会复制当前 tab 文本框中的所有内容。

> 生成完整文件链接依赖 `figma.fileKey`，适合本地开发插件或私有插件使用。Key 只会从组件（Component）和组件集（Component set）中导出。
