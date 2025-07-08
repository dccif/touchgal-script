// 脚本执行状态
let executed = false;

// 主执行函数 - 合并所有逻辑以减少函数调用开销
function execute(): void {
  if (executed) return;

  // 快速检查URL - 内联逻辑避免函数调用
  const { href, pathname } = location;
  if (!(href.includes("?") || href.includes("#") || pathname !== "/")) return;

  // 高效检查页面加载状态 - 使用更精确的选择器
  const gridWithFlex = document.querySelector(
    'div[class*="grid"] div[class*="flex"]'
  );
  if (!gridWithFlex) return;

  // 批量查询所有需要的元素
  const vndbSpans = document.querySelectorAll("span");
  if (!vndbSpans.length) return;

  // 获取样式参考（可选）
  const refLink = document.querySelector(".kun-prose a") as HTMLAnchorElement;
  const { className: refClass = "", role: refRole = null } = refLink || {};

  // 正则表达式复用
  const vndbRegex = /VNDB ID:\s*(v\d+)/;
  let hasChanges = false;

  // 优化的替换逻辑
  for (let i = 0; i < vndbSpans.length; i++) {
    const span = vndbSpans[i];
    const text = span.textContent;

    if (!text?.includes("VNDB ID:")) continue;

    const match = text.match(vndbRegex);
    if (!match) continue;

    const vndbId = match[1];

    // 高效的DOM构建
    span.innerHTML = `VNDB ID: <a href="https://vndb.org/${vndbId}" target="_blank" rel="noopener noreferrer"${refClass ? ` class="${refClass}"` : ""}${refRole ? ` role="${refRole}"` : ""}>${vndbId}</a>`;

    hasChanges = true;
    console.log(`替换VNDB ID: ${vndbId}`);
  }

  if (hasChanges) {
    executed = true;
    console.log("✅ VNDB链接替换完成");
  }
}

// 优化的轮询机制 - 使用requestAnimationFrame提高性能
function poll(): void {
  execute();
  if (!executed) {
    requestAnimationFrame(poll);
  }
}

// 启动
poll();
