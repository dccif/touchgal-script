// 脚本执行状态
let executed = false;
let stylesCached = false;
let cachedRefClass = "";
let cachedRefRole: string | null = null;
let observer: MutationObserver | null = null;
let debounceTimer: number | null = null;

// 检查URL是否需要运行脚本
function shouldRun(): boolean {
  const { href, pathname } = location;
  return href.includes("?") || href.includes("#") || pathname !== "/";
}

// 尝试缓存样式信息
function tryCacheStyles(): void {
  if (stylesCached) return;

  const refLink = document.querySelector(".kun-prose a") as HTMLAnchorElement;
  if (refLink) {
    cachedRefClass = refLink.className || "";
    cachedRefRole = refLink.getAttribute("role");
    stylesCached = true;
    console.log("✅ 样式信息已缓存");
  }
}

// 执行VNDB ID替换
function replaceVNDBIds(): void {
  if (executed) return;

  const vndbSpans = document.querySelectorAll("span");
  if (!vndbSpans.length) return;

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

    // 停止观察
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }
}

// 检查grid元素及其flex子元素（优化版）
function checkGridAndFlex(): boolean {
  // 使用更高效的单次查询
  return !!document.querySelector('div[class*="grid"] div[class*="flex"]');
}

// 防抖处理函数
function debouncedHandle(): void {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = window.setTimeout(() => {
    if (executed) return;

    // 每次变化时都尝试缓存样式
    tryCacheStyles();

    // 检查grid和flex结构
    if (checkGridAndFlex()) {
      // 立即尝试替换
      replaceVNDBIds();
    }

    debounceTimer = null;
  }, 100); // 100ms防抖
}

// DOM变化处理函数（优化版）
function handleMutations(mutations: MutationRecord[]): void {
  if (executed) return;

  // 快速过滤：只处理相关变化
  let hasRelevantChange = false;

  for (const mutation of mutations) {
    // 检查是否是我们关心的变化
    if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
      // 有新元素添加
      hasRelevantChange = true;
      break;
    } else if (
      mutation.type === "attributes" &&
      mutation.attributeName === "class" &&
      mutation.target instanceof Element
    ) {
      // class属性变化，检查是否包含grid或flex
      const className = (mutation.target as Element).className;
      if (className.includes("grid") || className.includes("flex")) {
        hasRelevantChange = true;
        break;
      }
    }
  }

  if (hasRelevantChange) {
    debouncedHandle();
  }
}

// 启动监听器（优化版）
function startObserver(): void {
  if (!shouldRun() || executed) return;

  // 创建观察器
  observer = new MutationObserver(handleMutations);

  // 优化的观察配置
  observer.observe(document.body, {
    childList: true, // 监听子元素变化
    subtree: true, // 监听所有后代
    attributes: true, // 监听属性变化
    attributeFilter: ["class"], // 只监听class属性
    attributeOldValue: false, // 不需要旧值
    characterData: false, // 不监听文本内容
    characterDataOldValue: false,
  });

  console.log("🔍 开始监听DOM变化");

  // 立即检查一次（使用防抖）
  debouncedHandle();
}

// 等待DOM基本就绪后启动
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startObserver);
} else {
  startObserver();
}
