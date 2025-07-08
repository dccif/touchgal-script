// ==UserScript==
// @name         TouchGal VNDB链接转换器
// @namespace    https://github.com/dccif
// @version      1.0.4
// @author       dccif
// @description  自动将TouchGal网站上的VNDB ID转换为可点击的链接
// @license      MIT
// @icon         https://www.touchgal.us/favicon.ico
// @source       https://github.com/dccif/touchgal-script.git
// @match        https://www.touchgal.io/*
// @match        https://www.touchgal.us/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  let executed = false;
  let stylesCached = false;
  let cachedRefClass = "";
  let cachedRefRole = null;
  let observer = null;
  let debounceTimer = null;
  function shouldRun() {
    const { href, pathname } = location;
    return href.includes("?") || href.includes("#") || pathname !== "/";
  }
  function tryCacheStyles() {
    if (stylesCached) return;
    const refLink = document.querySelector(".kun-prose a");
    if (refLink) {
      cachedRefClass = refLink.className || "";
      cachedRefRole = refLink.getAttribute("role");
      stylesCached = true;
      console.log("✅ 样式信息已缓存");
    }
  }
  function replaceVNDBIds() {
    if (executed) return;
    const vndbSpans = document.querySelectorAll("span");
    if (!vndbSpans.length) return;
    const vndbRegex = /VNDB ID:\s*(v\d+)/;
    let hasChanges = false;
    for (let i = 0; i < vndbSpans.length; i++) {
      const span = vndbSpans[i];
      const text = span.textContent;
      if (!(text == null ? void 0 : text.includes("VNDB ID:"))) continue;
      const match = text.match(vndbRegex);
      if (!match) continue;
      const vndbId = match[1];
      const parentNode = span.parentNode;
      if (parentNode) {
        const fragment = document.createDocumentFragment();
        fragment.appendChild(document.createTextNode("VNDB ID: "));
        const link = document.createElement("a");
        link.href = `https://vndb.org/${vndbId}`;
        link.textContent = vndbId;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        if (cachedRefClass) {
          link.className = cachedRefClass;
        }
        if (cachedRefRole) {
          link.setAttribute("role", cachedRefRole);
        }
        fragment.appendChild(link);
        parentNode.replaceChild(fragment, span);
        hasChanges = true;
        console.log(`替换VNDB ID: ${vndbId}`);
      }
    }
    if (hasChanges) {
      executed = true;
      console.log("✅ VNDB链接替换完成");
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    }
  }
  function checkGridAndFlex() {
    return !!document.querySelector('div[class*="grid"] div[class*="flex"]');
  }
  function debouncedHandle() {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = window.setTimeout(() => {
      if (executed) return;
      tryCacheStyles();
      if (checkGridAndFlex()) {
        replaceVNDBIds();
      }
      debounceTimer = null;
    }, 100);
  }
  function handleMutations(mutations) {
    if (executed) return;
    let hasRelevantChange = false;
    for (const mutation of mutations) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        hasRelevantChange = true;
        break;
      } else if (mutation.type === "attributes" && mutation.attributeName === "class" && mutation.target instanceof Element) {
        const className = mutation.target.className;
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
  function startObserver() {
    if (!shouldRun() || executed) return;
    observer = new MutationObserver(handleMutations);
    observer.observe(document.body, {
      childList: true,
      // 监听子元素变化
      subtree: true,
      // 监听所有后代
      attributes: true,
      // 监听属性变化
      attributeFilter: ["class"],
      // 只监听class属性
      attributeOldValue: false,
      // 不需要旧值
      characterData: false,
      // 不监听文本内容
      characterDataOldValue: false
    });
    console.log("🔍 开始监听DOM变化");
    debouncedHandle();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startObserver);
  } else {
    startObserver();
  }

})();