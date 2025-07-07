// 检查当前URL是否有参数或路径
function shouldRunScript(): boolean {
    const url = window.location.href;
    const hasParams = url.includes('?') || url.includes('#');
    const hasPath = window.location.pathname !== '/';

    return hasParams || hasPath;
}

// 脚本是否已经执行过
let scriptExecuted = false;

// 执行VNDB ID替换
function replaceVNDBIds(): void {
    if (scriptExecuted) {
        return;
    }

    // 查找所有包含"VNDB ID:"的span元素
    const spans = document.querySelectorAll('span');
    if (spans.length === 0) {
        return;
    }

    // 获取参考链接样式
    const referenceLink = document.querySelector('.kun-prose a') as HTMLAnchorElement;
    if (!referenceLink) {
        return; // 参考样式还没加载完成
    }

    const linkClassName = referenceLink.className;
    const linkRole = referenceLink.getAttribute('role');

    let hasReplaced = false;

    spans.forEach(span => {
        const text = span.textContent;
        if (text && text.includes('VNDB ID:')) {
            // 提取VNDB ID
            const match = text.match(/VNDB ID:\s*(v\d+)/);
            if (match) {
                const vndbId = match[1];
                const vndbUrl = `https://vndb.org/${vndbId}`;

                // 清空span内容并重建
                span.innerHTML = '';

                // 添加前缀文本
                span.appendChild(document.createTextNode('VNDB ID: '));

                // 创建链接
                const link = document.createElement('a');
                link.href = vndbUrl;
                link.textContent = vndbId;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.className = linkClassName;

                if (linkRole) {
                    link.setAttribute('role', linkRole);
                }

                span.appendChild(link);
                hasReplaced = true;

                console.log(`替换VNDB ID: ${vndbId}`);
            }
        }
    });

    if (hasReplaced) {
        scriptExecuted = true;
        console.log('✅ VNDB链接替换完成');
    }
}

// 尝试执行脚本
function tryExecute(): void {
    if (!shouldRunScript() || scriptExecuted) {
        return;
    }

    replaceVNDBIds();

    // 如果还没执行成功，继续等待
    if (!scriptExecuted) {
        setTimeout(tryExecute, 500);
    }
}

// 启动脚本
tryExecute();
