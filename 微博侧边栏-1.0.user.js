// ==UserScript==
// @name         微博侧边栏
// @name:zh-CN   微博侧边栏
// @version      1.0
// @description  隐藏整个右侧栏，主栏铺满并对齐左右留白
// @description:zh-CN 隐藏整个右侧栏，主栏铺满并对齐左右留白
// @license      MIT
// @author       hanzhsun
// @match        https://weibo.com/*
// @match        https://*.weibo.com/*
// @icon         https://weibo.com/favicon.ico
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @namespace    https://github.com/siderbar-cleaner/weibo-sidebar
// @downloadURL  file:///D:/GitHub/siderbar-cleaner/微博侧边栏-1.0.user.js
// @updateURL    file:///D:/GitHub/siderbar-cleaner/微博侧边栏-1.0.user.js
// ==/UserScript==

(function () {
    'use strict';

    const SCRIPT_VERSION = '1.0';
    const PANEL_ID = 'wbSidebarSettingsPanel';
    const HIDE_CLASS = 'wb-sidebar-hide-right';
    const RIGHT_COL_ATTR = 'data-wb-sidebar-right-col';
    const LEFT_NAV_ATTR = 'data-wb-sidebar-left-nav';
    const EXPANDED_ATTR = 'data-wb-sidebar-expanded';

    const defaultSettings = {
        hideRightColumn: true,
    };

    const settings = {
        hideRightColumn: GM_getValue('hideRightColumn', defaultSettings.hideRightColumn),
    };

    function throttle(fn, wait) {
        let timer = null;
        return function (...args) {
            if (timer) return;
            timer = setTimeout(() => {
                timer = null;
                fn.apply(this, args);
            }, wait);
        };
    }

    function createSettingsPanel() {
        if (document.getElementById(PANEL_ID)) return;

        const panel = document.createElement('div');
        panel.id = PANEL_ID;
        panel.innerHTML = `
            <div class="wbsb-panel-content">
                <div class="wbsb-header">
                    <div class="wbsb-header-title">
                        <h2>侧栏设置</h2>
                        <span class="wbsb-version">v${SCRIPT_VERSION}</span>
                    </div>
                </div>
                <div class="wbsb-scroll">
                    <div class="wbsb-section">
                        <label class="wbsb-toggle">
                            <input type="checkbox" id="wbsbHideRight" ${settings.hideRightColumn ? 'checked' : ''}>
                            <span class="wbsb-slider"></span>
                            <span class="wbsb-label">隐藏右侧栏</span>
                        </label>
                    </div>
                </div>
                <div class="wbsb-buttons">
                    <button id="wbsbSave" class="wbsb-btn wbsb-btn-primary">保存并应用</button>
                    <button id="wbsbClose" class="wbsb-btn wbsb-btn-secondary">关闭</button>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        document.getElementById('wbsbSave').addEventListener('click', () => {
            settings.hideRightColumn = document.getElementById('wbsbHideRight').checked;
            GM_setValue('hideRightColumn', settings.hideRightColumn);
            applyRightColumnLayout();
            panel.style.display = 'none';
        });
        document.getElementById('wbsbClose').addEventListener('click', () => {
            panel.style.display = 'none';
        });
    }

    GM_addStyle(`
        #${PANEL_ID} {
            width: min(92vw, 440px);
            max-height: min(90vh, 100dvh - 24px);
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #fff;
            z-index: 10001;
            display: none;
            box-shadow: 0 8px 30px rgba(0,0,0,0.12);
            border-radius: 16px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            overflow: hidden;
        }
        #${PANEL_ID} .wbsb-panel-content {
            display: flex;
            flex-direction: column;
            max-height: min(90vh, 100dvh - 24px);
        }
        #${PANEL_ID} .wbsb-header {
            display: flex;
            justify-content: center;
            padding: 16px 20px;
            border-bottom: 1px solid rgba(0,0,0,0.08);
            flex-shrink: 0;
        }
        #${PANEL_ID} .wbsb-header-title {
            display: flex;
            align-items: baseline;
            gap: 8px;
        }
        #${PANEL_ID} h2 {
            margin: 0;
            font-size: 18px;
            font-weight: 700;
            color: #333;
        }
        #${PANEL_ID} .wbsb-version {
            font-size: 13px;
            color: #888;
        }
        #${PANEL_ID} .wbsb-scroll {
            flex: 1 1 auto;
            min-height: 0;
            overflow-y: auto;
            padding: 8px 20px 4px;
            -webkit-overflow-scrolling: touch;
        }
        #${PANEL_ID} .wbsb-toggle {
            display: flex;
            align-items: center;
            margin: 12px 0 8px;
            cursor: pointer;
        }
        #${PANEL_ID} .wbsb-toggle input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        #${PANEL_ID} .wbsb-slider {
            position: relative;
            width: 42px;
            height: 24px;
            background: #cfd9de;
            border-radius: 24px;
            margin-right: 12px;
            flex-shrink: 0;
            transition: .3s;
        }
        #${PANEL_ID} .wbsb-slider:before {
            content: "";
            position: absolute;
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background: #fff;
            border-radius: 50%;
            transition: .3s;
        }
        #${PANEL_ID} input:checked + .wbsb-slider { background: #ff8200; }
        #${PANEL_ID} input:checked + .wbsb-slider:before { transform: translateX(18px); }
        #${PANEL_ID} .wbsb-label {
            font-size: 16px;
            color: #333;
        }
        #${PANEL_ID} .wbsb-buttons {
            display: flex;
            justify-content: center;
            gap: 12px;
            padding: 16px 20px;
            border-top: 1px solid rgba(0,0,0,0.08);
            flex-shrink: 0;
            background: #fff;
        }
        #${PANEL_ID} .wbsb-btn {
            min-width: 112px;
            padding: 12px 28px;
            font-size: 15px;
            font-weight: 600;
            border: none;
            border-radius: 9999px;
            cursor: pointer;
        }
        #${PANEL_ID} .wbsb-btn-primary { color: #fff; background: #ff8200; }
        #${PANEL_ID} .wbsb-btn-secondary { color: #333; background: #e6e7e7; }

        html.${HIDE_CLASS} main > [class*="_side_"],
        html.${HIDE_CLASS} [${RIGHT_COL_ATTR}] {
            display: none !important;
            width: 0 !important;
            min-width: 0 !important;
            max-width: 0 !important;
            flex: 0 0 0 !important;
            overflow: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
        }

        html.${HIDE_CLASS} main,
        html.${HIDE_CLASS} main > [class*="_full_"],
        html.${HIDE_CLASS} [${EXPANDED_ATTR}] {
            max-width: none !important;
            box-sizing: border-box !important;
        }

        html.${HIDE_CLASS} main > [class*="_full_"] {
            width: 100% !important;
            flex: 1 1 auto !important;
        }

        html.${HIDE_CLASS} main > [class*="_full_"] > div,
        html.${HIDE_CLASS} main > [class*="_full_"] article {
            max-width: 100% !important;
        }

        html.${HIDE_CLASS} [${LEFT_NAV_ATTR}],
        html.${HIDE_CLASS} [${LEFT_NAV_ATTR}] > * {
            margin-left: 0 !important;
            padding-left: 0 !important;
        }
    `);

    function clearExpandedLayoutStyles() {
        document.querySelectorAll('[' + EXPANDED_ATTR + ']').forEach((el) => {
            [
                'width',
                'max-width',
                'min-width',
                'flex',
                'margin-left',
                'margin-right',
                'padding-left',
                'display',
                'flex-direction',
                'justify-content',
                'align-items',
                'align-self',
                'box-sizing',
            ].forEach((prop) => el.style.removeProperty(prop));
            el.removeAttribute(EXPANDED_ATTR);
        });
    }

    function markExpanded(el) {
        if (!el) return;
        el.setAttribute(EXPANDED_ATTR, '1');
    }

    function getLayoutMetrics(viewport, hasLeftNav) {
        // 左侧栏贴浏览器左边缘；空隙只留在左栏与主栏之间
        let midGap = 12;
        let rightEdgeGap = 80;
        let leftNavWidth = 150;

        if (viewport < 700) {
            midGap = 8;
            rightEdgeGap = 12;
            leftNavWidth = 0;
        } else if (viewport < 900) {
            midGap = 10;
            rightEdgeGap = 32;
            leftNavWidth = 120;
        } else if (viewport < 1100) {
            midGap = 12;
            rightEdgeGap = 48;
            leftNavWidth = 135;
        }

        if (!hasLeftNav) leftNavWidth = 0;
        return { midGap, rightEdgeGap, leftNavWidth };
    }

    function applyRightColumnLayout() {
        document.documentElement.classList.toggle(HIDE_CLASS, !!settings.hideRightColumn);
        document.querySelectorAll('[' + RIGHT_COL_ATTR + ']').forEach((el) => el.removeAttribute(RIGHT_COL_ATTR));
        document.querySelectorAll('[' + LEFT_NAV_ATTR + ']').forEach((el) => el.removeAttribute(LEFT_NAV_ATTR));
        clearExpandedLayoutStyles();

        if (!settings.hideRightColumn) return;

        const main = document.querySelector('main');
        if (!main) return;

        [...main.children].forEach((el) => {
            const cls = String(el.className || '');
            if (cls.includes('_side_') || el.querySelector('.wbpro-side, .wbpro-side-copy, [class*="_sideMain_"]')) {
                el.setAttribute(RIGHT_COL_ATTR, '1');
            }
        });

        const content = main.closest('[class*="_content_"]');
        const leftNav = content
            ? [...content.children].find((el) => String(el.className || '').includes('_side_') && !main.contains(el))
            : null;

        const viewport = document.documentElement.clientWidth || window.innerWidth;
        const {
            midGap: MID_GAP,
            rightEdgeGap: RIGHT_GAP,
            leftNavWidth: LEFT_NAV_WIDTH,
        } = getLayoutMetrics(viewport, !!leftNav);
        const contentWidth = Math.max(280, Math.floor(viewport - RIGHT_GAP));

        const pageWrap = content ? content.parentElement : null;
        [pageWrap, pageWrap && pageWrap.parentElement].forEach((el) => {
            if (!el || el === document.body || el === document.documentElement) return;
            markExpanded(el);
            el.style.setProperty('align-items', 'flex-start', 'important');
            el.style.setProperty('justify-content', 'flex-start', 'important');
            el.style.setProperty('width', '100%', 'important');
            el.style.setProperty('max-width', '100%', 'important');
            el.style.setProperty('margin-left', '0', 'important');
            el.style.setProperty('padding-left', '0', 'important');
            el.style.setProperty('box-sizing', 'border-box', 'important');
        });

        if (leftNav && LEFT_NAV_WIDTH > 0) {
            leftNav.setAttribute(LEFT_NAV_ATTR, '1');
            markExpanded(leftNav);
            leftNav.style.setProperty('width', LEFT_NAV_WIDTH + 'px', 'important');
            leftNav.style.setProperty('min-width', LEFT_NAV_WIDTH + 'px', 'important');
            leftNav.style.setProperty('max-width', LEFT_NAV_WIDTH + 'px', 'important');
            leftNav.style.setProperty('flex', `0 0 ${LEFT_NAV_WIDTH}px`, 'important');
            leftNav.style.setProperty('margin-left', '0', 'important');
            leftNav.style.setProperty('padding-left', '0', 'important');
            leftNav.style.setProperty('box-sizing', 'border-box', 'important');
            leftNav.querySelectorAll(':scope > *').forEach((child) => {
                markExpanded(child);
                child.style.setProperty('margin-left', '0', 'important');
                child.style.setProperty('padding-left', '0', 'important');
                child.style.setProperty('box-sizing', 'border-box', 'important');
            });
        }

        if (content) {
            markExpanded(content);
            content.style.setProperty('display', 'flex', 'important');
            content.style.setProperty('flex-direction', 'row', 'important');
            content.style.setProperty('width', contentWidth + 'px', 'important');
            content.style.setProperty('max-width', contentWidth + 'px', 'important');
            content.style.setProperty('margin-left', '0', 'important');
            content.style.setProperty('padding-left', '0', 'important');
            content.style.setProperty('margin-right', RIGHT_GAP + 'px', 'important');
            content.style.setProperty('justify-content', 'flex-start', 'important');
            content.style.setProperty('align-self', 'stretch', 'important');
            content.style.setProperty('box-sizing', 'border-box', 'important');
            content.style.setProperty('flex', '0 0 auto', 'important');
        }

        const mainWrap = main.parentElement;
        if (mainWrap && mainWrap !== content) {
            markExpanded(mainWrap);
            mainWrap.style.setProperty('width', 'auto', 'important');
            mainWrap.style.setProperty('max-width', 'none', 'important');
            mainWrap.style.setProperty('min-width', '0', 'important');
            mainWrap.style.setProperty('flex', '1 1 auto', 'important');
        }

        markExpanded(main);
        main.style.setProperty('width', '100%', 'important');
        main.style.setProperty('max-width', 'none', 'important');
        main.style.setProperty('min-width', '0', 'important');
        main.style.setProperty('flex', '1 1 auto', 'important');

        const feedStart = mainWrap && content && mainWrap.parentElement === content ? mainWrap : main;
        const pinGap = leftNav && LEFT_NAV_WIDTH > 0 ? MID_GAP : 0;
        feedStart.style.setProperty('margin-left', pinGap + 'px', 'important');
        if (feedStart !== main) main.style.setProperty('margin-left', '0', 'important');

        const feedCol = [...main.children].find((el) => !el.hasAttribute(RIGHT_COL_ATTR));
        if (feedCol) {
            markExpanded(feedCol);
            feedCol.style.setProperty('width', '100%', 'important');
            feedCol.style.setProperty('max-width', 'none', 'important');
            feedCol.style.setProperty('min-width', '0', 'important');
            feedCol.style.setProperty('flex', '1 1 auto', 'important');
        }
    }

    function scheduleLayout() {
        requestAnimationFrame(applyRightColumnLayout);
        clearTimeout(scheduleLayout._t);
        scheduleLayout._t = setTimeout(applyRightColumnLayout, 280);
    }

    createSettingsPanel();

    GM_registerMenuCommand('侧栏设置', () => {
        const panel = document.getElementById(PANEL_ID);
        const checkbox = document.getElementById('wbsbHideRight');
        if (checkbox) checkbox.checked = settings.hideRightColumn;
        if (panel) panel.style.display = 'block';
    });

    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    history.pushState = function () {
        const result = originalPushState.apply(this, arguments);
        scheduleLayout();
        return result;
    };
    history.replaceState = function () {
        const result = originalReplaceState.apply(this, arguments);
        scheduleLayout();
        return result;
    };
    window.addEventListener('popstate', scheduleLayout);

    const onResize = throttle(applyRightColumnLayout, 200);
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('orientationchange', () => {
        setTimeout(applyRightColumnLayout, 300);
    }, { passive: true });
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', onResize, { passive: true });
    }

    const observer = new MutationObserver(() => {
        clearTimeout(observer._timer);
        observer._timer = setTimeout(applyRightColumnLayout, 150);
    });
    const startObserver = () => observer.observe(document.body, { childList: true, subtree: true });
    if (document.body) startObserver();
    else document.addEventListener('DOMContentLoaded', startObserver, { once: true });

    applyRightColumnLayout();
    console.info('[weibo-sidebar] v' + SCRIPT_VERSION);
})();
