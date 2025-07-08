// ==UserScript==
// @name         TouchGal VNDB链接转换器
// @namespace    https://github.com/dccif
// @version      1.0.1
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
  function execute() {
    if (executed) return;
    const { href, pathname } = location;
    if (!(href.includes("?") || href.includes("#") || pathname !== "/")) return;
    const gridWithFlex = document.querySelector(
      'div[class*="grid"] div[class*="flex"]'
    );
    if (!gridWithFlex) return;
    const vndbSpans = document.querySelectorAll("span");
    if (!vndbSpans.length) return;
    const refLink = document.querySelector(".kun-prose a");
    const { className: refClass = "", role: refRole = null } = refLink || {};
    const vndbRegex = /VNDB ID:\s*(v\d+)/;
    let hasChanges = false;
    for (let i = 0; i < vndbSpans.length; i++) {
      const span = vndbSpans[i];
      const text = span.textContent;
      if (!(text == null ? void 0 : text.includes("VNDB ID:"))) continue;
      const match = text.match(vndbRegex);
      if (!match) continue;
      const vndbId = match[1];
      span.innerHTML = `VNDB ID: <a href="https://vndb.org/${vndbId}" target="_blank" rel="noopener noreferrer"${refClass ? ` class="${refClass}"` : ""}${refRole ? ` role="${refRole}"` : ""}>${vndbId}</a>`;
      hasChanges = true;
      console.log(`替换VNDB ID: ${vndbId}`);
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