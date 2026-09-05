// ==UserScript==
// @name         微博藏藏藏
// @name:zh-CN   微博藏藏藏
// @version      1.0
// @description  隐藏右侧栏、翻译与赞赏；主栏铺满并对齐左右留白
// @description:zh-CN 隐藏右侧栏、翻译与赞赏；主栏铺满并对齐左右留白
// @license      MIT
// @author       hanzhsun
// @match        https://weibo.com/*
// @match        https://*.weibo.com/*
// @icon         https://weibo.com/favicon.ico
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @grant        GM_addStyle
// @namespace    https://github.com/siderbar-cleaner/weibo-sidebar
// @downloadURL  file:///D:/GitHub/siderbar-cleaner/微博藏藏藏-1.0.user.js
// @updateURL    file:///D:/GitHub/siderbar-cleaner/微博藏藏藏-1.0.user.js
// ==/UserScript==

(function () {
    'use strict';

    const SCRIPT_VERSION = '1.0';
    const PANEL_ID = 'wbSidebarSettingsPanel';
    const HIDE_CLASS = 'wb-sidebar-hide-right';
    const HIDE_TRANSLATE_CLASS = 'wb-sidebar-hide-translate';
    const HIDE_REWARD_CLASS = 'wb-sidebar-hide-reward';
    const RIGHT_COL_ATTR = 'data-wb-sidebar-right-col';
    const LEFT_NAV_ATTR = 'data-wb-sidebar-left-nav';
    const EXPANDED_ATTR = 'data-wb-sidebar-expanded';
    const PAGE_ATTR = 'data-wb-sidebar-page';
    const CONTENT_ATTR = 'data-wb-sidebar-content';
    const FEED_ATTR = 'data-wb-sidebar-feed';
    const MAIN_ATTR = 'data-wb-sidebar-main';
    const HIDE_TRANSLATE_ATTR = 'data-wb-sidebar-hide-translate';
    const HIDE_REWARD_ATTR = 'data-wb-sidebar-hide-reward';
    const LAYOUT_ATTRS = [RIGHT_COL_ATTR, LEFT_NAV_ATTR, EXPANDED_ATTR, PAGE_ATTR, CONTENT_ATTR, FEED_ATTR, MAIN_ATTR];
    const LAYOUT_VARS = ['--wbsb-content-w', '--wbsb-right-gap', '--wbsb-left-nav', '--wbsb-mid-gap'];

    const TRANSLATE_LABELS = new Set([
        'translate content',
        'translate',
        '翻译博文',
        '翻译全文',
        '翻译内容',
        '翻译这篇微博',
        '翻译',
        '显示原文',
        'show original',
        'hide translation',
        '收起翻译',
    ]);
    const REWARD_TEXT_RE = /为\s*TA\s*助威|点赞是美意\s*[，,]\s*赞赏是鼓励/;

    const defaultSettings = {
        hideRightColumn: true,
        hideTranslate: true,
        hideReward: true,
    };

    const settings = {
        hideRightColumn: GM_getValue('hideRightColumn', defaultSettings.hideRightColumn),
        hideTranslate: GM_getValue('hideTranslate', defaultSettings.hideTranslate),
        hideReward: GM_getValue('hideReward', defaultSettings.hideReward),
    };

    if (settings.hideRightColumn) document.documentElement.classList.add(HIDE_CLASS);
    if (settings.hideTranslate) document.documentElement.classList.add(HIDE_TRANSLATE_CLASS);
    if (settings.hideReward) document.documentElement.classList.add(HIDE_REWARD_CLASS);

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
                        <h2>设置</h2>
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
                        <label class="wbsb-toggle">
                            <input type="checkbox" id="wbsbHideTranslate" ${settings.hideTranslate ? 'checked' : ''}>
                            <span class="wbsb-slider"></span>
                            <span class="wbsb-label">隐藏翻译</span>
                        </label>
                        <label class="wbsb-toggle">
                            <input type="checkbox" id="wbsbHideReward" ${settings.hideReward ? 'checked' : ''}>
                            <span class="wbsb-slider"></span>
                            <span class="wbsb-label">隐藏赞赏</span>
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
            settings.hideTranslate = document.getElementById('wbsbHideTranslate').checked;
            settings.hideReward = document.getElementById('wbsbHideReward').checked;
            GM_setValue('hideRightColumn', settings.hideRightColumn);
            GM_setValue('hideTranslate', settings.hideTranslate);
            GM_setValue('hideReward', settings.hideReward);
            tick();
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
        html.${HIDE_CLASS} [${PAGE_ATTR}],
        html.${HIDE_CLASS} [${CONTENT_ATTR}],
        html.${HIDE_CLASS} [${FEED_ATTR}],
        html.${HIDE_CLASS} [${MAIN_ATTR}] {
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

        html.${HIDE_CLASS} [${PAGE_ATTR}] {
            width: 100% !important;
            max-width: 100% !important;
            margin-left: 0 !important;
            padding-left: 0 !important;
            align-items: flex-start !important;
            justify-content: flex-start !important;
        }

        html.${HIDE_CLASS} [${CONTENT_ATTR}] {
            display: flex !important;
            flex-direction: row !important;
            width: var(--wbsb-content-w, calc(100vw - var(--wbsb-right-gap, 80px))) !important;
            max-width: var(--wbsb-content-w, calc(100vw - var(--wbsb-right-gap, 80px))) !important;
            margin-left: 0 !important;
            padding-left: 0 !important;
            margin-right: var(--wbsb-right-gap, 80px) !important;
            justify-content: flex-start !important;
            align-self: stretch !important;
            flex: 0 0 auto !important;
        }

        html.${HIDE_CLASS} [${LEFT_NAV_ATTR}] {
            width: var(--wbsb-left-nav, 150px) !important;
            min-width: var(--wbsb-left-nav, 150px) !important;
            max-width: var(--wbsb-left-nav, 150px) !important;
            flex: 0 0 var(--wbsb-left-nav, 150px) !important;
            margin-left: 0 !important;
            padding-left: 0 !important;
        }

        html.${HIDE_CLASS} [${LEFT_NAV_ATTR}] > * {
            margin-left: 0 !important;
            padding-left: 0 !important;
            box-sizing: border-box !important;
        }

        html.${HIDE_CLASS} [${MAIN_ATTR}] {
            width: 100% !important;
            max-width: none !important;
            min-width: 0 !important;
            flex: 1 1 auto !important;
            margin-left: 0 !important;
        }

        html.${HIDE_CLASS} [${FEED_ATTR}] {
            width: auto !important;
            max-width: none !important;
            min-width: 0 !important;
            flex: 1 1 auto !important;
            margin-left: var(--wbsb-mid-gap, 12px) !important;
        }

        html.${HIDE_TRANSLATE_CLASS} [${HIDE_TRANSLATE_ATTR}],
        html.${HIDE_REWARD_CLASS} [${HIDE_REWARD_ATTR}] {
            display: none !important;
        }
    `);

    function markAttr(el, attr) {
        if (!el || el.getAttribute(attr) === '1') return;
        el.setAttribute(attr, '1');
    }

    function clearLayoutMarks() {
        LAYOUT_ATTRS.forEach((attr) => {
            document.querySelectorAll('[' + attr + ']').forEach((el) => {
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
                el.removeAttribute(attr);
            });
        });
        LAYOUT_VARS.forEach((name) => document.documentElement.style.removeProperty(name));
    }

    function getLayoutMetrics(viewport, hasLeftNav) {
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

    function getLayoutNodes() {
        const main = document.querySelector('main');
        if (!main) return { main: null, content: null, leftNav: null, pageWrap: null, mainWrap: null };
        const content = main.closest('[class*="_content_"]');
        const leftNav = content
            ? [...content.children].find((el) => String(el.className || '').includes('_side_') && !main.contains(el))
            : null;
        return {
            main,
            content,
            leftNav,
            pageWrap: content ? content.parentElement : null,
            mainWrap: main.parentElement,
        };
    }

    let lastLayoutKey = '';
    let lastLayoutNodes = { main: null, content: null, leftNav: null, pageWrap: null };

    function setLayoutVars(vars) {
        const root = document.documentElement;
        Object.keys(vars).forEach((name) => {
            if (root.style.getPropertyValue(name) !== vars[name]) {
                root.style.setProperty(name, vars[name]);
            }
        });
    }

    function applyRightColumnLayout(force) {
        document.documentElement.classList.toggle(HIDE_CLASS, !!settings.hideRightColumn);

        if (!settings.hideRightColumn) {
            clearLayoutMarks();
            lastLayoutKey = '';
            lastLayoutNodes = { main: null, content: null, leftNav: null, pageWrap: null };
            return;
        }

        const nodes = getLayoutNodes();
        const { main, content, leftNav, pageWrap, mainWrap } = nodes;
        if (!main) return;

        [...main.children].forEach((el) => {
            const cls = String(el.className || '');
            if (cls.includes('_side_') || el.querySelector('.wbpro-side, .wbpro-side-copy, [class*="_sideMain_"]')) {
                markAttr(el, RIGHT_COL_ATTR);
            }
        });

        const viewport = document.documentElement.clientWidth || window.innerWidth;
        const {
            midGap: MID_GAP,
            rightEdgeGap: RIGHT_GAP,
            leftNavWidth: LEFT_NAV_WIDTH,
        } = getLayoutMetrics(viewport, !!leftNav);
        const contentWidth = Math.max(280, Math.floor(viewport - RIGHT_GAP));
        const layoutKey = [viewport, contentWidth, LEFT_NAV_WIDTH, MID_GAP, RIGHT_GAP].join('|');
        const sameNodes =
            lastLayoutNodes.main === main &&
            lastLayoutNodes.content === content &&
            lastLayoutNodes.leftNav === leftNav &&
            lastLayoutNodes.pageWrap === pageWrap;

        [pageWrap, pageWrap && pageWrap.parentElement].forEach((el) => {
            if (!el || el === document.body || el === document.documentElement) return;
            markAttr(el, PAGE_ATTR);
        });
        if (content) markAttr(content, CONTENT_ATTR);
        if (leftNav && LEFT_NAV_WIDTH > 0) markAttr(leftNav, LEFT_NAV_ATTR);
        markAttr(main, MAIN_ATTR);
        const feedStart = mainWrap && content && mainWrap.parentElement === content ? mainWrap : main;
        markAttr(feedStart, FEED_ATTR);
        const feedCol = [...main.children].find((el) => !el.hasAttribute(RIGHT_COL_ATTR));
        if (feedCol) markAttr(feedCol, MAIN_ATTR);

        if (!force && sameNodes && layoutKey === lastLayoutKey) return;

        lastLayoutKey = layoutKey;
        lastLayoutNodes = { main, content, leftNav, pageWrap };
        setLayoutVars({
            '--wbsb-content-w': contentWidth + 'px',
            '--wbsb-right-gap': RIGHT_GAP + 'px',
            '--wbsb-left-nav': LEFT_NAV_WIDTH + 'px',
            '--wbsb-mid-gap': (leftNav && LEFT_NAV_WIDTH > 0 ? MID_GAP : 0) + 'px',
        });
    }

    function normalizeLabel(text) {
        return String(text || '').replace(/\s+/g, ' ').trim();
    }

    function isSettingsPanel(el) {
        return !!(el && el.closest && el.closest('#' + PANEL_ID));
    }

    function isFeedRoot(el) {
        if (!el || el === document.body || el === document.documentElement) return true;
        if (el.tagName === 'ARTICLE' || el.tagName === 'MAIN' || el.tagName === 'FOOTER') return true;
        const cls = String(el.className || '');
        return cls.includes('Feed_wrap') || cls.includes('wbpro-feed-content');
    }

    function hasPostBody(el) {
        return !!el.querySelector(
            'img, video, picture, canvas, article, [class*="_wbtext_"], [class*="_ogText_"], [class*="_placebox_"], .wbpro-feed-content'
        );
    }

    function hasFeedContent(el) {
        return !!el.querySelector(
            'article, [class*="_wbtext_"], [class*="_ogText_"], [class*="_placebox_"], .wbpro-feed-content'
        );
    }

    function isTranslateLabel(text) {
        const compact = normalizeLabel(text).toLowerCase();
        return TRANSLATE_LABELS.has(compact) || TRANSLATE_LABELS.has(normalizeLabel(text));
    }

    function isRewardExclusive(text) {
        const t = normalizeLabel(text);
        if (!t) return false;
        const stripped = t
            .replace(/为\s*TA\s*助威/gi, '')
            .replace(/点赞是美意\s*[，,]\s*赞赏是鼓励/g, '')
            .replace(/^赞赏$/g, '')
            .replace(/\s+/g, '');
        return stripped.length === 0;
    }

    function climbExclusive(el, isExclusive) {
        let cur = el;
        if (!isExclusive(normalizeLabel(cur.textContent))) return el;
        for (let i = 0; i < 6 && cur.parentElement; i++) {
            const parent = cur.parentElement;
            if (isFeedRoot(parent) || isSettingsPanel(parent)) break;
            if (!isExclusive(normalizeLabel(parent.textContent))) break;
            if (hasPostBody(parent) && !hasPostBody(cur)) break;
            cur = parent;
        }
        return cur;
    }

    function pickHideTarget(el, isExclusive) {
        const target = climbExclusive(el, isExclusive);
        if (hasPostBody(target)) return isExclusive(normalizeLabel(el.textContent)) && !hasPostBody(el) ? el : null;
        if (!isExclusive(normalizeLabel(target.textContent))) return null;
        return target;
    }

    function climbRewardBlock(el) {
        let cur = el;
        for (let i = 0; i < 10 && cur.parentElement; i++) {
            const parent = cur.parentElement;
            if (isFeedRoot(parent) || isSettingsPanel(parent) || hasFeedContent(parent)) break;
            if (!isRewardExclusive(normalizeLabel(parent.textContent))) break;
            cur = parent;
        }
        return cur;
    }

    function collectRewardSeeds(scope) {
        const seeds = [];
        const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
            const text = normalizeLabel(node.textContent);
            if (!text || (!REWARD_TEXT_RE.test(text) && text !== '赞赏')) continue;
            const el = node.parentElement;
            if (!el || isSettingsPanel(el) || hasFeedContent(el)) continue;
            seeds.push(el);
        }
        return seeds;
    }

    function clearHideMarks(attr) {
        document.querySelectorAll('[' + attr + ']').forEach((el) => el.removeAttribute(attr));
    }

    function applyHideTranslate(scope) {
        scope.querySelectorAll('a, button, span, [role="button"]').forEach((el) => {
            if (isSettingsPanel(el) || hasPostBody(el)) return;
            const text = normalizeLabel(el.textContent);
            if (!text || text.length > 40 || !isTranslateLabel(text)) return;
            if (el.closest('[' + HIDE_TRANSLATE_ATTR + ']')) return;
            const target = pickHideTarget(el, isTranslateLabel);
            if (target) target.setAttribute(HIDE_TRANSLATE_ATTR, '1');
        });
    }

    function applyHideReward(scope) {
        collectRewardSeeds(scope).forEach((el) => {
            if (el.closest('[' + HIDE_REWARD_ATTR + ']')) return;
            const target = climbRewardBlock(el);
            if (!target || hasFeedContent(target)) return;
            if (!isRewardExclusive(normalizeLabel(target.textContent))) return;
            target.setAttribute(HIDE_REWARD_ATTR, '1');
        });
    }

    function applyHideExtras() {
        document.documentElement.classList.toggle(HIDE_TRANSLATE_CLASS, !!settings.hideTranslate);
        document.documentElement.classList.toggle(HIDE_REWARD_CLASS, !!settings.hideReward);

        if (!settings.hideTranslate) clearHideMarks(HIDE_TRANSLATE_ATTR);
        if (!settings.hideReward) clearHideMarks(HIDE_REWARD_ATTR);
        if (!settings.hideTranslate && !settings.hideReward) return;

        const scope = document.querySelector('main') || document.body;
        if (!scope) return;

        if (settings.hideTranslate) applyHideTranslate(scope);
        if (settings.hideReward) applyHideReward(scope);
    }

    function tick(forceLayout) {
        applyRightColumnLayout(!!forceLayout);
        applyHideExtras();
    }

    let extrasTimer = 0;
    let layoutTimer = 0;

    function scheduleExtras() {
        if (extrasTimer) return;
        extrasTimer = setTimeout(() => {
            extrasTimer = 0;
            applyHideExtras();
        }, 160);
    }

    function scheduleLayout(force) {
        clearTimeout(layoutTimer);
        layoutTimer = setTimeout(() => {
            layoutTimer = 0;
            tick(force);
        }, 80);
    }

    function layoutStructureChanged() {
        const nodes = getLayoutNodes();
        return (
            nodes.main !== lastLayoutNodes.main ||
            nodes.content !== lastLayoutNodes.content ||
            nodes.leftNav !== lastLayoutNodes.leftNav ||
            nodes.pageWrap !== lastLayoutNodes.pageWrap
        );
    }

    function whenReady(fn) {
        if (document.body) fn();
        else document.addEventListener('DOMContentLoaded', fn, { once: true });
    }

    whenReady(createSettingsPanel);

    GM_registerMenuCommand('设置', () => {
        const panel = document.getElementById(PANEL_ID);
        const hideRight = document.getElementById('wbsbHideRight');
        const hideTranslate = document.getElementById('wbsbHideTranslate');
        const hideReward = document.getElementById('wbsbHideReward');
        if (hideRight) hideRight.checked = settings.hideRightColumn;
        if (hideTranslate) hideTranslate.checked = settings.hideTranslate;
        if (hideReward) hideReward.checked = settings.hideReward;
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

    const onResize = throttle(() => applyRightColumnLayout(true), 200);
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('orientationchange', () => {
        setTimeout(() => applyRightColumnLayout(true), 300);
    }, { passive: true });
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', onResize, { passive: true });
    }

    const observer = new MutationObserver(() => {
        if (layoutStructureChanged()) scheduleLayout();
        else scheduleExtras();
    });
    const startObserver = () => {
        if (!document.body || observer._started) return;
        observer._started = true;
        observer.observe(document.body, { childList: true, subtree: true });
        tick();
    };
    if (document.body) startObserver();
    else document.addEventListener('DOMContentLoaded', startObserver, { once: true });

    console.info('[weibo-sidebar] v' + SCRIPT_VERSION);
})();
