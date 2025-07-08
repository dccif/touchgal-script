// 脚本执行状态
let executed = false;
let stylesCached = false;
let cachedRefClass = "";
let cachedRefRole: string | null = null;

// 更可靠的页面加载检测
function isPageReady(): boolean {
  // 1. 检查基本DOM状态
  if (document.readyState !== "complete") return false;

  // 2. 检查关键元素是否存在
  const hasGrid = document.querySelector('div[class*="grid"]');
  const hasFlex = document.querySelector('div[class*="flex"]');
  if (!hasGrid || !hasFlex) return false;

  // 3. 检查是否有span元素（目标元素）
  const spans = document.querySelectorAll("span");
  if (!spans.length) return false;

  // 4. 检查页面是否有实际内容（避免空白页面）
  const bodyText = document.body.textContent?.trim();
  if (!bodyText || bodyText.length < 50) return false;

  return true;
}

// 缓存样式信息
function cacheStyles(): void {
  if (stylesCached) return;

  const refLink = document.querySelector(".kun-prose a") as HTMLAnchorElement;
  if (refLink) {
    cachedRefClass = refLink.className || "";
    cachedRefRole = refLink.getAttribute("role");
    stylesCached = true;
    console.log("✅ 样式信息已缓存");
  }
}

// 主执行函数
function execute(): void {
  if (executed) return;

  // 快速检查URL
  const { href, pathname } = location;
  if (!(href.includes("?") || href.includes("#") || pathname !== "/")) return;

  // 检查页面是否真正准备就绪
  if (!isPageReady()) return;

  // 尝试缓存样式（如果还没缓存的话）
  cacheStyles();

  // 批量查询所有需要的元素
  const vndbSpans = document.querySelectorAll("span");
  if (!vndbSpans.length) return;

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
    const parentNode = span.parentNode;

    if (parentNode) {
      // 创建新的内容片段
      const fragment = document.createDocumentFragment();

      // 添加前缀文本
      fragment.appendChild(document.createTextNode("VNDB ID: "));

      // 创建链接元素
      const link = document.createElement("a");
      link.href = `https://vndb.org/${vndbId}`;
      link.textContent = vndbId;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      // 应用样式
      if (cachedRefClass) {
        link.className = cachedRefClass;
      }
      if (cachedRefRole) {
        link.setAttribute("role", cachedRefRole);
      }

      fragment.appendChild(link);

      // 在原位置替换
      parentNode.replaceChild(fragment, span);

      hasChanges = true;
      console.log(`替换VNDB ID: ${vndbId}`);
    }
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
