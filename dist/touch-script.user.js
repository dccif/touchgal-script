// ==UserScript==
// @name         TouchGal VNDB链接转换器
// @namespace    https://github.com/dccif
// @version      1.0.3
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
  function isPageReady() {
    var _a;
    if (document.readyState !== "complete") return false;
    const hasGrid = document.querySelector('div[class*="grid"]');
    const hasFlex = document.querySelector('div[class*="flex"]');
    if (!hasGrid || !hasFlex) return false;
    const spans = document.querySelectorAll("span");
    if (!spans.length) return false;
    const bodyText = (_a = document.body.textContent) == null ? void 0 : _a.trim();
    if (!bodyText || bodyText.length < 50) return false;
    return true;
  }
  function cacheStyles() {
    if (stylesCached) return;
    const refLink = document.querySelector(".kun-prose a");
    if (refLink) {
      cachedRefClass = refLink.className || "";
      cachedRefRole = refLink.getAttribute("role");
      stylesCached = true;
      console.log("✅ 样式信息已缓存");
    }
  }
  function execute() {
    if (executed) return;
    const { href, pathname } = location;
    if (!(href.includes("?") || href.includes("#") || pathname !== "/")) return;
    if (!isPageReady()) return;
    cacheStyles();
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
    }
  }
  function poll() {
    execute();
    if (!executed) {
      requestAnimationFrame(poll);
    }
  }
  poll();

})();