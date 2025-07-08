// 脚本执行状态
let executed = false;
let stylesCached = false;
let cachedRefClass = "";
let cachedRefRole: string | null = null;
let styleAttempts = 0;
let vndbAttempts = 0;
let pollCount = 0;
let currentInterval = 300; // 初始轮询间隔
const maxStyleAttempts = 5; // 增加样式尝试次数
const maxVndbAttempts = 8; // 增加VNDB尝试次数
const maxPollCount = 30; // 最大轮询次数（约15秒）
const intervals = [300, 500, 800, 1200, 2000]; // 递增间隔序列

// 检查URL是否需要运行脚本
function shouldRun(): boolean {
  const { href, pathname } = location;
  return href.includes("?") || href.includes("#") || pathname !== "/";
}

// 尝试缓存样式信息（自适应次数）
function tryCacheStyles(): void {
  if (stylesCached || styleAttempts >= maxStyleAttempts) return;

  styleAttempts++;
  const refLink = document.querySelector(".kun-prose a") as HTMLAnchorElement;

  if (refLink) {
    cachedRefClass = refLink.className || "";
    cachedRefRole = refLink.getAttribute("role");
    stylesCached = true;
    console.log("✅ 样式信息已缓存");
  } else if (styleAttempts >= maxStyleAttempts) {
    // 多次尝试后使用默认样式
    stylesCached = true;
    console.log("⚠️ 未找到参考样式，使用默认样式");
  }
}

// 检查页面是否准备就绪
function isPageReady(): boolean {
  // 检查是否有grid和flex元素
  const hasGrid = document.querySelector('div[class*="grid"]');
  const hasFlex = document.querySelector('div[class*="flex"]');
  return !!(hasGrid && hasFlex);
}

// 执行VNDB ID替换（限制尝试次数）
function replaceVNDBIds(): boolean {
  if (executed) return true;

  vndbAttempts++;

  const vndbSpans = document.querySelectorAll("span");
  if (!vndbSpans.length) {
    if (vndbAttempts >= maxVndbAttempts) {
      console.log("⚠️ 多次尝试后未找到VNDB ID，页面上可能没有相关内容");
      return true; // 停止尝试
    }
    return false; // 继续尝试
  }

  const vndbRegex = /VNDB ID:\s*(v\d+)/;
  let hasChanges = false;

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
    return true;
  }

  // 没有找到VNDB ID，检查是否达到最大尝试次数
  if (vndbAttempts >= maxVndbAttempts) {
    console.log("⚠️ 多次尝试后未找到VNDB ID，页面上可能没有相关内容");
    return true; // 停止尝试
  }

  return false; // 继续尝试
}

// 主执行函数
function execute(): void {
  if (!shouldRun() || executed) return;

  // 尝试缓存样式
  tryCacheStyles();

  // 检查页面是否准备就绪
  if (!isPageReady()) return;

  // 确保样式已处理完成
  if (!stylesCached) return;

  // 执行替换，返回是否应该停止尝试
  const shouldStop = replaceVNDBIds();
  if (shouldStop) {
    executed = true;
  }
}

// 自适应轮询
function poll(): void {
  pollCount++;

  // 检查是否超过最大轮询次数
  if (pollCount > maxPollCount) {
    console.log("⚠️ 轮询超时，停止执行");
    return;
  }

  execute();

  if (!executed) {
    // 动态调整轮询间隔
    const intervalIndex = Math.min(
      Math.floor(pollCount / 6),
      intervals.length - 1
    );
    currentInterval = intervals[intervalIndex];

    console.log(`🔄 轮询第${pollCount}次，间隔${currentInterval}ms`);
    setTimeout(poll, currentInterval);
  }
}
poll();
