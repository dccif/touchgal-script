// ==UserScript==
// @name         TouchGal VNDB链接转换器
// @namespace    https://github.com/dccif
// @version      1.0.0
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

  function shouldRunScript() {
    const url = window.location.href;
    const hasParams = url.includes("?") || url.includes("#");
    const hasPath = window.location.pathname !== "/";
    return hasParams || hasPath;
  }
  let scriptExecuted = false;
  function replaceVNDBIds() {
    if (scriptExecuted) {
      return;
    }
    const spans = document.querySelectorAll("span");
    if (spans.length === 0) {
      return;
    }
    const referenceLink = document.querySelector(".kun-prose a");
    if (!referenceLink) {
      return;
    }
    const linkClassName = referenceLink.className;
    const linkRole = referenceLink.getAttribute("role");
    let hasReplaced = false;
    spans.forEach((span) => {
      const text = span.textContent;
      if (text && text.includes("VNDB ID:")) {
        const match = text.match(/VNDB ID:\s*(v\d+)/);
        if (match) {
          const vndbId = match[1];
          const vndbUrl = `https://vndb.org/${vndbId}`;
          span.innerHTML = "";
          span.appendChild(document.createTextNode("VNDB ID: "));
          const link = document.createElement("a");
          link.href = vndbUrl;
          link.textContent = vndbId;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.className = linkClassName;
          if (linkRole) {
            link.setAttribute("role", linkRole);
          }
          span.appendChild(link);
          hasReplaced = true;
          console.log(`替换VNDB ID: ${vndbId}`);
        }
      }
    });
    if (hasReplaced) {
      scriptExecuted = true;
      console.log("✅ VNDB链接替换完成");
    }
  }
  function tryExecute() {
    if (!shouldRunScript() || scriptExecuted) {
      return;
    }
    replaceVNDBIds();
    if (!scriptExecuted) {
      setTimeout(tryExecute, 500);
    }
  }
  tryExecute();

})();