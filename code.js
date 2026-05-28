figma.showUI(__html__, {
  width: 520,
  height: 470,
  title: "批量导出链接与 Key"
});

function toNodeIdForUrl(id) {
  return id.replace(/:/g, "-");
}

function toUrlSlug(name) {
  return encodeURIComponent(name || "file");
}

function canExportLink(node) {
  return node.type === "FRAME" || node.type === "COMPONENT" || node.type === "COMPONENT_SET";
}

function canExportKey(node) {
  return node.type === "COMPONENT" || node.type === "COMPONENT_SET";
}

function createNodeLink(node) {
  const fileKey = figma.fileKey;

  if (!fileKey) {
    return null;
  }

  return `https://www.figma.com/design/${fileKey}/${toUrlSlug(figma.root.name)}?node-id=${toNodeIdForUrl(node.id)}`;
}

function createKeyRow(node) {
  if (!("key" in node) || !node.key) {
    return null;
  }

  return `${node.name}：${node.key}`;
}

function exportSelectedData() {
  const selection = figma.currentPage.selection;
  const selectedLinkNodes = selection.filter(canExportLink);
  const selectedKeyNodes = selection.filter(canExportKey);

  if (!selectedLinkNodes.length && !selectedKeyNodes.length) {
    figma.ui.postMessage({
      type: "export-result",
      linksText: "",
      keysText: "",
      linksCount: 0,
      keysCount: 0,
      error: "请先选中一个或多个画板（Frame）、组件（Component）或组件集（Component set）。"
    });
    figma.notify("请先选中画板、组件或组件集");
    return;
  }

  const linkRows = [];

  for (const node of selectedLinkNodes) {
    const link = createNodeLink(node);

    if (!link) {
      figma.ui.postMessage({
        type: "export-result",
        linksText: "",
        keysText: "",
        linksCount: 0,
        keysCount: 0,
        error: "无法获取当前文件链接，请确认文件已经保存并可访问。"
      });
      figma.notify("无法获取当前文件链接");
      return;
    }

    linkRows.push(`${node.name}：${link}`);
  }

  const keyRows = selectedKeyNodes.map(createKeyRow).filter(Boolean);

  figma.ui.postMessage({
    type: "export-result",
    linksText: linkRows.join("\n"),
    keysText: keyRows.join("\n"),
    linksCount: linkRows.length,
    keysCount: keyRows.length,
    error: ""
  });
  figma.notify(`已导出 ${linkRows.length} 个链接，${keyRows.length} 个 Key`);
}

figma.ui.onmessage = (message) => {
  if (message.type === "export-selected-data") {
    exportSelectedData();
  }
};
