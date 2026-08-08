// ==UserScript==
// @name         X/Twitter Sidebar Pin
// @name:zh-CN   X/Twitter 侧栏固定增强
// @name:zh-TW   X/Twitter 側欄固定增強
// @name:ja      X/Twitter サイドバー固定
// @version      1.0
// @description  Hide Home / Follow / Post / Right column; pin Bookmarks below X
// @description:zh-CN 隐藏主页、推荐关注、发帖按钮、右侧栏；钉选书签到 X 标下
// @description:zh-TW 隱藏主頁、推薦關注、發帖按鈕、右側欄；釘選書籤到 X 標下
// @description:ja    ホーム・おすすめフォロー・投稿・右カラムを非表示；ブックマークを X 下に固定
// @license      MIT
// @author       hanzhsun
// @match        https://x.com/*
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @namespace    https://github.com/siderbar-cleaner/x-twitter-sidebar-pin
// @downloadURL  file:///D:/GitHub/siderbar-cleaner/X-Twitter%20Sidebar%20Pin-1.0.user.js
// @updateURL    file:///D:/GitHub/siderbar-cleaner/X-Twitter%20Sidebar%20Pin-1.0.user.js
// ==/UserScript==

(function () {
    'use strict';

    const SCRIPT_VERSION = '1.0';
    const PANEL_ID = 'xSidebarPinSettingsPanel';
    const BOOKMARKS_LINK_ID = 'x-clean-bookmarks-link';

    const defaultSettings = {
        hideHome: true,
        hideFollow: true,
        hidePostButton: true,
        pinBookmarksBelowX: true,
        hideRightColumn: true,
        cssWidth: 680,
    };

    const settings = {
        hideHome: GM_getValue('hideHome', defaultSettings.hideHome),
        hideFollow: GM_getValue('hideFollow', defaultSettings.hideFollow),
        hidePostButton: GM_getValue('hidePostButton', defaultSettings.hidePostButton),
        pinBookmarksBelowX: GM_getValue(
            'pinBookmarksBelowX',
            GM_getValue('bookmarksUnderMore', defaultSettings.pinBookmarksBelowX)
        ),
        hideRightColumn: GM_getValue(
            'hideRightColumn',
            GM_getValue('fixZoomLayout', defaultSettings.hideRightColumn)
        ),
        cssWidth: GM_getValue('cssWidth', defaultSettings.cssWidth),
    };

    const BOOKMARK_ICON_OUTLINE =
        'M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z';
    const BOOKMARK_ICON_FILLED =
        'M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5z';

    const languages = {
        en: {
            title: 'Sidebar Pin',
            hideHome: 'Hide Home',
            hideFollow: 'Hide Follow',
            hidePostButton: 'Hide Post',
            hideRightColumn: 'Hide Right Column',
            pinBookmarksBelowX: 'Pin Bookmarks',
            cssWidth: 'Primary column width',
            bookmarks: 'Bookmarks',
            settings: 'Sidebar Pin Settings',
            saveRefresh: 'Save & refresh',
            close: 'Close',
        },
        'zh-TW': {
            title: '側欄固定',
            hideHome: '隱藏主頁',
            hideFollow: '隱藏關注',
            hidePostButton: '隱藏發帖',
            hideRightColumn: '隱藏右側欄',
            pinBookmarksBelowX: '釘選書籤',
            cssWidth: '主欄寬度',
            bookmarks: '書籤',
            settings: '側欄固定設定',
            saveRefresh: '保存並刷新',
            close: '關閉',
        },
        'zh-CN': {
            title: '侧栏固定',
            hideHome: '隐藏主页',
            hideFollow: '隐藏关注',
            hidePostButton: '隐藏发帖',
            hideRightColumn: '隐藏右侧栏',
            pinBookmarksBelowX: '钉选书签',
            cssWidth: '主栏宽度',
            bookmarks: '书签',
            settings: '侧栏固定设置',
            saveRefresh: '保存并刷新',
            close: '关闭',
        },
        ja: {
            title: 'サイドバー固定',
            hideHome: 'ホームを非表示',
            hideFollow: 'フォローを非表示',
            hidePostButton: '投稿を非表示',
            hideRightColumn: '右カラムを非表示',
            pinBookmarksBelowX: 'ブックマークを固定',
            cssWidth: 'メイン欄の幅',
            bookmarks: 'ブックマーク',
            settings: 'サイドバー固定設定',
            saveRefresh: '保存して更新',
            close: '閉じる',
        },
    };
    const currentLanguage = languages[navigator.language || navigator.userLanguage] || languages.en;

    function createSettingsPanel() {
        if (document.getElementById(PANEL_ID)) return;

        const panel = document.createElement('div');
        panel.id = PANEL_ID;
        panel.innerHTML = `
            <div class="xpin-panel-content">
                <div class="xpin-header">
                    <div class="xpin-header-title">
                        <h2>${currentLanguage.title}</h2>
                        <span class="xpin-version">v${SCRIPT_VERSION}</span>
                    </div>
                </div>
                <div class="xpin-scroll">
                    <div class="xpin-section">
                        <label class="xpin-toggle">
                            <input type="checkbox" id="xpinHideHome" ${settings.hideHome ? 'checked' : ''}>
                            <span class="xpin-slider"></span>
                            <span class="xpin-label">${currentLanguage.hideHome}</span>
                        </label>
                        <label class="xpin-toggle">
                            <input type="checkbox" id="xpinHideFollow" ${settings.hideFollow ? 'checked' : ''}>
                            <span class="xpin-slider"></span>
                            <span class="xpin-label">${currentLanguage.hideFollow}</span>
                        </label>
                        <label class="xpin-toggle">
                            <input type="checkbox" id="xpinHidePost" ${settings.hidePostButton ? 'checked' : ''}>
                            <span class="xpin-slider"></span>
                            <span class="xpin-label">${currentLanguage.hidePostButton}</span>
                        </label>
                        <label class="xpin-toggle">
                            <input type="checkbox" id="xpinHideRight" ${settings.hideRightColumn ? 'checked' : ''}>
                            <span class="xpin-slider"></span>
                            <span class="xpin-label">${currentLanguage.hideRightColumn}</span>
                        </label>
                        <div class="xpin-width-row">
                            <span class="xpin-label">${currentLanguage.cssWidth}</span>
                            <div class="xpin-width-wrap">
                                <input type="number" id="xpinCssWidth" class="xpin-width-input" value="${settings.cssWidth}" min="400" max="1200">
                                <span class="xpin-width-unit">px</span>
                            </div>
                        </div>
                        <label class="xpin-toggle">
                            <input type="checkbox" id="xpinPinBookmarks" ${settings.pinBookmarksBelowX ? 'checked' : ''}>
                            <span class="xpin-slider"></span>
                            <span class="xpin-label">${currentLanguage.pinBookmarksBelowX}</span>
                        </label>
                    </div>
                </div>
                <div class="xpin-buttons">
                    <button id="xpinSave" class="xpin-btn xpin-btn-primary">${currentLanguage.saveRefresh}</button>
                    <button id="xpinClose" class="xpin-btn xpin-btn-secondary">${currentLanguage.close}</button>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        const hideRightCheckbox = document.getElementById('xpinHideRight');
        const cssWidthInput = document.getElementById('xpinCssWidth');
        const syncWidthState = () => {
            const on = hideRightCheckbox.checked;
            cssWidthInput.disabled = !on;
            cssWidthInput.closest('.xpin-width-row').classList.toggle('xpin-disabled', !on);
        };
        hideRightCheckbox.addEventListener('change', syncWidthState);
        syncWidthState();

        document.getElementById('xpinSave').addEventListener('click', () => {
            settings.hideHome = document.getElementById('xpinHideHome').checked;
            settings.hideFollow = document.getElementById('xpinHideFollow').checked;
            settings.hidePostButton = document.getElementById('xpinHidePost').checked;
            settings.pinBookmarksBelowX = document.getElementById('xpinPinBookmarks').checked;
            settings.hideRightColumn = document.getElementById('xpinHideRight').checked;
            settings.cssWidth = parseInt(document.getElementById('xpinCssWidth').value, 10) || 680;

            GM_setValue('hideHome', settings.hideHome);
            GM_setValue('hideFollow', settings.hideFollow);
            GM_setValue('hidePostButton', settings.hidePostButton);
            GM_setValue('pinBookmarksBelowX', settings.pinBookmarksBelowX);
            GM_setValue('hideRightColumn', settings.hideRightColumn);
            GM_setValue('cssWidth', settings.cssWidth);
            location.reload();
        });
        document.getElementById('xpinClose').addEventListener('click', () => {
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
        #${PANEL_ID} .xpin-panel-content {
            display: flex;
            flex-direction: column;
            max-height: min(90vh, 100dvh - 24px);
        }
        #${PANEL_ID} .xpin-header {
            display: flex;
            justify-content: center;
            padding: 16px 20px;
            border-bottom: 1px solid rgba(0,0,0,0.08);
            flex-shrink: 0;
        }
        #${PANEL_ID} .xpin-header-title {
            display: flex;
            align-items: baseline;
            gap: 8px;
        }
        #${PANEL_ID} h2 {
            margin: 0;
            font-size: 18px;
            font-weight: 700;
            color: #0f1419;
        }
        #${PANEL_ID} .xpin-version {
            font-size: 13px;
            color: #536471;
        }
        #${PANEL_ID} .xpin-scroll {
            flex: 1 1 auto;
            min-height: 0;
            overflow-y: auto;
            padding: 8px 20px 4px;
            -webkit-overflow-scrolling: touch;
        }
        #${PANEL_ID} .xpin-toggle {
            display: flex;
            align-items: center;
            margin: 12px 0;
            cursor: pointer;
        }
        #${PANEL_ID} .xpin-toggle input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        #${PANEL_ID} .xpin-slider {
            position: relative;
            width: 42px;
            height: 24px;
            background: #cfd9de;
            border-radius: 24px;
            margin-right: 12px;
            flex-shrink: 0;
            transition: .3s;
        }
        #${PANEL_ID} .xpin-slider:before {
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
        #${PANEL_ID} input:checked + .xpin-slider { background: #1d9bf0; }
        #${PANEL_ID} input:checked + .xpin-slider:before { transform: translateX(18px); }
        #${PANEL_ID} .xpin-label {
            font-size: 16px;
            color: #0f1419;
        }
        #${PANEL_ID} .xpin-width-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            margin: 16px 0 8px;
        }
        #${PANEL_ID} .xpin-width-row.xpin-disabled {
            opacity: 0.45;
            pointer-events: none;
        }
        #${PANEL_ID} .xpin-width-wrap {
            position: relative;
            display: flex;
            align-items: center;
        }
        #${PANEL_ID} .xpin-width-input {
            width: 90px;
            padding: 8px 30px 8px 12px;
            border: 1px solid #cfd9de;
            border-radius: 9999px;
            font-size: 14px;
            text-align: center;
        }
        #${PANEL_ID} .xpin-width-unit {
            position: absolute;
            right: 12px;
            font-size: 14px;
            color: #536471;
            pointer-events: none;
        }
        #${PANEL_ID} .xpin-buttons {
            display: flex;
            justify-content: center;
            gap: 12px;
            padding: 16px 20px;
            border-top: 1px solid rgba(0,0,0,0.08);
            flex-shrink: 0;
            background: #fff;
        }
        #${PANEL_ID} .xpin-btn {
            min-width: 112px;
            padding: 12px 28px;
            font-size: 15px;
            font-weight: 600;
            border: none;
            border-radius: 9999px;
            cursor: pointer;
        }
        #${PANEL_ID} .xpin-btn-primary { color: #fff; background: #1d9bf0; }
        #${PANEL_ID} .xpin-btn-secondary { color: #0f1419; background: #e6e7e7; }
    `);

    createSettingsPanel();
    console.info('[x-sidebar-pin] v' + SCRIPT_VERSION);

    GM_registerMenuCommand(currentLanguage.settings, () => {
        const panel = document.getElementById(PANEL_ID);
        if (panel) panel.style.display = 'block';
    });

    function findBrandXLink(header) {
        const byLabel = header.querySelector('a[aria-label="X"]');
        if (byLabel && byLabel.id !== BOOKMARKS_LINK_ID) return byLabel;

        return (
            [...header.querySelectorAll('a[href="/home"], a[href^="https://x.com/home"], a[href^="https://twitter.com/home"]')].find(
                (a) => {
                    if (a.id === BOOKMARKS_LINK_ID) return false;
                    if (a.getAttribute('data-testid') === 'AppTabBar_Home_Link') return false;
                    return !/AppTabBar_/.test(a.getAttribute('data-testid') || '');
                }
            ) || null
        );
    }

    function setBookmarkIcon(link, filled) {
        const path = link.querySelector('svg path');
        if (!path) return;
        const d = filled ? BOOKMARK_ICON_FILLED : BOOKMARK_ICON_OUTLINE;
        if (path.getAttribute('d') !== d) path.setAttribute('d', d);
    }

    function updateBookmarksActiveState(link) {
        const isActive = location.pathname.startsWith('/i/bookmarks');
        setBookmarkIcon(link, isActive);
        if (isActive) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
    }

    function bindBookmarksNavigation(link) {
        if (link.getAttribute('data-x-pin-bookmarks-nav') === '1') return;
        link.setAttribute('data-x-pin-bookmarks-nav', '1');

        const go = (newTab) => {
            if (newTab) {
                window.open('/i/bookmarks', '_blank', 'noopener,noreferrer');
                return;
            }
            if (!location.pathname.startsWith('/i/bookmarks')) location.assign('/i/bookmarks');
        };

        link.addEventListener(
            'click',
            (e) => {
                if (e.button !== 0) return;
                e.preventDefault();
                e.stopPropagation();
                go(!!(e.metaKey || e.ctrlKey || e.shiftKey));
            },
            true
        );
        link.addEventListener(
            'auxclick',
            (e) => {
                if (e.button !== 1) return;
                e.preventDefault();
                e.stopPropagation();
                go(true);
            },
            true
        );
    }

    function applyBookmarksBrandContent(link, styleHref) {
        link.id = BOOKMARKS_LINK_ID;
        link.setAttribute('href', styleHref || '/home');
        link.setAttribute('aria-label', currentLanguage.bookmarks);
        link.setAttribute('role', 'link');
        link.setAttribute('data-x-pin-bookmarks', '1');
        link.removeAttribute('data-testid');
        bindBookmarksNavigation(link);
        updateBookmarksActiveState(link);
    }

    function hideNativeBookmarksInHeader(header) {
        header.querySelectorAll('a[href*="bookmarks"], a[data-testid="AppTabBar_Bookmarks_Link"]').forEach((el) => {
            if (el.id === BOOKMARKS_LINK_ID) return;
            el.style.setProperty('display', 'none', 'important');
            el.setAttribute('aria-hidden', 'true');
        });
    }

    function removeInjectedBookmarks(root) {
        const scope = root || document;
        scope.querySelectorAll('#' + BOOKMARKS_LINK_ID + ', [data-x-pin-bookmarks="1"], [data-x-clean-bookmarks-row="1"]').forEach(
            (el) => el.remove()
        );
    }

    let bookmarksInserting = false;

    function ensurePinnedBookmarks() {
        if (bookmarksInserting) return;

        if (!settings.pinBookmarksBelowX) {
            removeInjectedBookmarks();
            return;
        }

        const header = document.querySelector('header[role="banner"]');
        if (!header) return;

        hideNativeBookmarksInHeader(header);

        const brand = findBrandXLink(header);
        if (!brand || !brand.parentElement) return;

        const styleHref = brand.getAttribute('href') || '/home';
        let existing = header.querySelector('#' + BOOKMARKS_LINK_ID);

        if (existing && brand.nextElementSibling === existing) {
            applyBookmarksBrandContent(existing, styleHref);
            return;
        }

        bookmarksInserting = true;
        try {
            removeInjectedBookmarks(header);
            const link = brand.cloneNode(true);
            applyBookmarksBrandContent(link, styleHref);
            brand.after(link);
        } finally {
            bookmarksInserting = false;
        }
    }

    function hideSidebarFollow() {
        if (!settings.hideFollow) return;
        const header = document.querySelector('header[role="banner"]');
        if (!header) return;

        const isFollowLabel = (text) => /^(Follow|关注|關注|フォロー)$/i.test(String(text || '').trim());

        header.querySelectorAll('a, button, div[role="link"], div[role="button"]').forEach((el) => {
            if (el.id === BOOKMARKS_LINK_ID || el.closest('#' + BOOKMARKS_LINK_ID)) return;
            const testid = el.getAttribute('data-testid') || '';
            if (testid === 'AppTabBar_Profile_Link' || testid === 'AppTabBar_Home_Link') return;

            const labels = [];
            const aria = (el.getAttribute('aria-label') || '').trim();
            if (aria) labels.push(aria);
            el.querySelectorAll('span').forEach((span) => {
                if (span.childElementCount === 0) {
                    const t = (span.textContent || '').trim();
                    if (t) labels.push(t);
                }
            });
            if (!labels.some(isFollowLabel)) return;

            const row = el.closest('a') || el;
            row.style.setProperty('display', 'none', 'important');
            row.setAttribute('data-x-pin-hide-follow', '1');
        });
    }

    function getViewportMetrics() {
        const layoutW = Math.floor(document.documentElement.clientWidth || window.innerWidth || 0);
        const vv = window.visualViewport;
        if (!vv || !(vv.width > 0)) return { width: layoutW, left: 0 };
        const visualW = Math.floor(vv.width);
        return {
            width: layoutW > 0 ? Math.min(layoutW, visualW) : visualW,
            left: Math.round(vv.offsetLeft || 0),
        };
    }

    function getLeftNavRight() {
        const header = document.querySelector('header[role="banner"]');
        if (!header) return 88;
        const nav = header.querySelector('nav') || header;
        const right = Math.round(nav.getBoundingClientRect().right);
        if (right >= 40 && right <= 420) return right;
        const width = Math.round(header.getBoundingClientRect().width);
        return width >= 40 && width <= 420 ? width : 88;
    }

    function clearPrimaryLayoutInline() {
        document.querySelectorAll('[data-x-pin-layout="1"]').forEach((el) => {
            ['width', 'max-width', 'min-width', 'flex', 'flex-basis', 'margin-left', 'margin-right'].forEach((p) => {
                el.style.removeProperty(p);
            });
            el.removeAttribute('data-x-pin-layout');
        });
    }

    function isChatPage() {
        const path = location.pathname;
        return (
            path === '/i/chat' ||
            path.startsWith('/i/chat/') ||
            path === '/messages' ||
            path.startsWith('/messages/')
        );
    }

    function applyResponsivePrimaryLayout() {
        if (!settings.hideRightColumn || isChatPage()) {
            clearPrimaryLayoutInline();
            document.documentElement.classList.toggle('x-pin-chat-page', isChatPage());
            return;
        }
        document.documentElement.classList.remove('x-pin-chat-page');

        const primary = document.querySelector('div[data-testid="primaryColumn"]');
        if (!primary) return;

        // 侧栏不动；主栏视口居中，左边界不压过侧栏（含 iPad 缩放）
        const { width: viewport, left: visLeft } = getViewportMetrics();
        const sideGap = 12;
        const minLeft = Math.max(getLeftNavRight() + sideGap, visLeft + sideGap);
        const visibleRight = visLeft + viewport;
        const maxWidth = Math.max(280, visibleRight - minLeft - sideGap);
        let target = Math.min(settings.cssWidth || 680, maxWidth);
        let left = Math.round(visLeft + (viewport - target) / 2);
        if (left < minLeft) left = minLeft;
        if (left + target > visibleRight - sideGap) {
            target = Math.max(280, visibleRight - sideGap - left);
        }

        primary.style.setProperty('width', target + 'px', 'important');
        primary.style.setProperty('max-width', target + 'px', 'important');
        primary.style.setProperty('min-width', '0', 'important');
        primary.style.setProperty('flex', '0 0 ' + target + 'px', 'important');
        primary.style.setProperty('flex-basis', target + 'px', 'important');
        primary.style.setProperty('margin-left', '0px', 'important');
        primary.style.setProperty('margin-right', '0px', 'important');
        void primary.offsetWidth;
        const primaryLeft = Math.round(primary.getBoundingClientRect().left);
        primary.style.setProperty('margin-left', left - primaryLeft + 'px', 'important');
        primary.setAttribute('data-x-pin-layout', '1');
    }

    const cssParts = [];
    if (settings.pinBookmarksBelowX) {
        cssParts.push(`
            header[role="banner"] a[href*="/i/bookmarks"]:not(#${BOOKMARKS_LINK_ID}),
            header[role="banner"] a[data-testid="AppTabBar_Bookmarks_Link"]:not(#${BOOKMARKS_LINK_ID}) {
                display: none !important;
            }
        `);
    }
    if (settings.hideHome) {
        cssParts.push(`
            header[role="banner"] a[data-testid="AppTabBar_Home_Link"],
            header[role="banner"] a[aria-label="Home"],
            header[role="banner"] a[aria-label="主页"],
            header[role="banner"] a[aria-label="首頁"],
            header[role="banner"] a[aria-label="ホーム"] {
                display: none !important;
            }
        `);
    }
    if (settings.hidePostButton) {
        cssParts.push(`
            a[data-testid="SideNav_NewTweet_Button"],
            header[role="banner"] a[href="/compose/post"],
            header[role="banner"] a[href*="/compose/tweet"] {
                display: none !important;
            }
        `);
    }
    if (settings.hideFollow) {
        cssParts.push(`
            header[role="banner"] a[aria-label="Follow"],
            header[role="banner"] a[aria-label="关注"],
            header[role="banner"] a[aria-label="關注"],
            header[role="banner"] a[aria-label="フォロー"],
            header[role="banner"] [data-x-pin-hide-follow="1"] {
                display: none !important;
            }
        `);
    }
    if (settings.hideRightColumn) {
        cssParts.push(`
            header[role="banner"] { z-index: 3 !important; }

            html:not(.x-pin-chat-page) div[data-testid="sidebarColumn"] {
                display: none !important;
                width: 0 !important;
                min-width: 0 !important;
                max-width: 0 !important;
                flex: 0 0 0 !important;
                padding: 0 !important;
                margin: 0 !important;
                border: none !important;
                overflow: hidden !important;
            }

            html:not(.x-pin-chat-page) main[role="main"] > div {
                justify-content: flex-start !important;
            }

            html:not(.x-pin-chat-page) div[data-testid="primaryColumn"] {
                min-width: 0 !important;
            }

            html:not(.x-pin-chat-page) div[data-testid="primaryColumn"] > div,
            html:not(.x-pin-chat-page) div[data-testid="primaryColumn"] article {
                max-width: 100% !important;
                min-width: 0 !important;
            }
        `);
    }
    if (cssParts.length) GM_addStyle(cssParts.join('\n'));

    function tick() {
        ensurePinnedBookmarks();
        hideSidebarFollow();
        applyResponsivePrimaryLayout();
    }

    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    history.pushState = function () {
        const result = originalPushState.apply(this, arguments);
        setTimeout(tick, 50);
        return result;
    };
    history.replaceState = function () {
        const result = originalReplaceState.apply(this, arguments);
        setTimeout(tick, 50);
        return result;
    };
    window.addEventListener('popstate', () => setTimeout(tick, 50));

    let resizeTimer = null;
    const onResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(tick, 100);
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', () => setTimeout(tick, 300));
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', onResize);
        window.visualViewport.addEventListener('scroll', () => {
            clearTimeout(onResize._layoutOnly);
            onResize._layoutOnly = setTimeout(applyResponsivePrimaryLayout, 100);
        });
    }

    const navObserver = new MutationObserver(() => {
        if (bookmarksInserting) return;
        clearTimeout(navObserver._timer);
        navObserver._timer = setTimeout(() => {
            if (!bookmarksInserting) tick();
        }, 150);
    });
    const startObserver = () => navObserver.observe(document.body, { childList: true, subtree: true });
    if (document.body) startObserver();
    else document.addEventListener('DOMContentLoaded', startObserver, { once: true });

    tick();
})();
