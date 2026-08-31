/**
 * ==========================================================
 * Family Tree v2 - Responsive Toolbar / Mobile UI
 * ==========================================================
 */

import {
    zoomIn,
    zoomOut,
    resetZoom,
    centerTree,
    fitTree,
    getViewport,
    setViewport
} from "./treeCanvas.js";

import { Dialog } from "./dialog.js";

import {
    getRootPeople,
    getChildren,
    getSpouse,
    subscribe
} from "../store.js";

import {
    clearCollapsed,
    setCollapsed
} from "./treeCollapse.js";

const html = document.documentElement;

let initialTreeStateApplied = false;

export function initializeToolbar() {
    bindZoom();
    bindTheme();
    bindPrint();
    bindNavigation();

    // Initial tree state applies to desktop AND mobile.
    initializeInitialTreeState();

    // API data arrives after toolbar initialization.
    subscribe(() => {
        if (!initialTreeStateApplied) {
            initializeInitialTreeState();
        }
    });

    // Mobile UI only. Desktop remains unchanged.
    if (window.matchMedia("(max-width: 800px)").matches) {
        installMobileUI();
    }
}

function initializeInitialTreeState() {
    if (initialTreeStateApplied) return;

    const roots = getRootPeople();
    if (!roots.length) return;

    clearCollapsed();

    const queue = roots.map(root => ({
        person: root,
        depth: 0
    }));

    const visited = new Set();

    while (queue.length) {
        const current = queue.shift();
        if (!current?.person?.id) continue;

        const id = String(current.person.id);
        if (visited.has(id)) continue;
        visited.add(id);

        // Keep root, children and grandchildren visible.
        // Collapse grandchildren so deeper descendants are hidden.
        if (current.depth >= 2) {
            setCollapsed(id, true);
            continue;
        }

        for (const child of getChildren(id)) {
            queue.push({
                person: child,
                depth: current.depth + 1
            });
        }

        const spouse = getSpouse(id);
        if (spouse) {
            for (const child of getChildren(spouse.id)) {
                queue.push({
                    person: child,
                    depth: current.depth + 1
                });
            }
        }
    }

    initialTreeStateApplied = true;
}

function bindZoom() {
    $("#zoomIn")?.addEventListener("click", zoomIn);
    $("#zoomOut")?.addEventListener("click", zoomOut);
    $("#zoomReset")?.addEventListener("click", resetZoom);
    $("#btnCenter")?.addEventListener("click", centerTree);
    $("#btnFit")?.addEventListener("click", fitTree);
}

function bindTheme() {
    $("#btnTheme")?.addEventListener("click", toggleTheme);
}

function toggleTheme() {
    html.classList.toggle("dark");
    const dark = html.classList.contains("dark");
    localStorage.setItem("familyTree.theme", dark ? "dark" : "light");
}

function bindPrint() {
    $("#btnPrint")?.addEventListener("click", () => window.print());
}

function bindNavigation() {
    $("#btnHome")?.addEventListener("click", () => {
        document.dispatchEvent(new CustomEvent("route:tree"));
    });

    $("#btnTimeline")?.addEventListener("click", () => {
        document.dispatchEvent(new CustomEvent("route:timeline"));
    });

    $("#btnStatistics")?.addEventListener("click", () => {
        document.dispatchEvent(new CustomEvent("route:statistics"));
    });

    $("#btnAddMember")?.addEventListener("click", () => {
        Dialog.openAddMember();
    });
}

function installMobileUI() {
    if (document.getElementById("mobileNav")) return;

    const sidebar = document.querySelector("#sidebar");
    const detail = document.querySelector("#detailPanel");
    const treeArea = document.querySelector("#treeArea");
    const brand = document.querySelector(".brand");

    if (!sidebar || !detail || !treeArea) return;

    injectMobileStyles();

    const backdrop = document.createElement("button");
    backdrop.type = "button";
    backdrop.id = "mobileBackdrop";
    backdrop.className = "mobile-backdrop";
    backdrop.setAttribute("aria-label", "Tutup panel");
    document.body.appendChild(backdrop);

    const mobileHeader = document.createElement("div");
    mobileHeader.className = "mobile-header-actions";
    mobileHeader.innerHTML = `
        <button type="button" class="btn mobile-action" id="mobileMembers" aria-label="Buka anggota">☰</button>
        <button type="button" class="btn mobile-action" id="mobileAdd" aria-label="Tambah anggota">＋</button>
        <button type="button" class="btn mobile-action" id="mobileMore" aria-label="Buka kontrol pohon">⋮</button>
    `;
    if (brand?.parentElement) {
        brand.parentElement.insertBefore(mobileHeader, brand.nextSibling);
    }

    const sideClose = document.createElement("button");
    sideClose.type = "button";
    sideClose.className = "mobile-panel-close";
    sideClose.id = "mobileSidebarClose";
    sideClose.textContent = "×";
    sideClose.setAttribute("aria-label", "Tutup anggota");
    sidebar.prepend(sideClose);

    const detailClose = document.createElement("button");
    detailClose.type = "button";
    detailClose.className = "mobile-panel-close";
    detailClose.id = "mobileDetailClose";
    detailClose.textContent = "×";
    detailClose.setAttribute("aria-label", "Tutup detail");
    detail.prepend(detailClose);

    const morePanel = document.createElement("div");
    morePanel.id = "mobileControls";
    morePanel.className = "mobile-controls";
    morePanel.innerHTML = `
        <button type="button" data-action="zoom-out" aria-label="Zoom out">−</button>
        <button type="button" data-action="reset" aria-label="Reset zoom">100%</button>
        <button type="button" data-action="zoom-in" aria-label="Zoom in">+</button>
        <button type="button" data-action="fit" aria-label="Fit tree">Fit</button>
        <button type="button" data-action="center" aria-label="Center tree">Center</button>
        <button type="button" data-action="theme" aria-label="Theme">🌙</button>
        <button type="button" data-action="print" aria-label="Print">🖨</button>
    `;
    treeArea.appendChild(morePanel);

    const mobileNav = document.createElement("nav");
    mobileNav.id = "mobileNav";
    mobileNav.className = "mobile-nav";
    mobileNav.setAttribute("aria-label", "Navigasi mobile");
    mobileNav.innerHTML = `
        <button type="button" data-mobile="tree"><span>🌳</span><small>Pohon</small></button>
        <button type="button" data-mobile="members"><span>👥</span><small>Anggota</small></button>
        <button type="button" data-mobile="search"><span>🔎</span><small>Cari</small></button>
        <button type="button" data-mobile="add" class="primary"><span>＋</span><small>Tambah</small></button>
        <button type="button" data-mobile="more"><span>⋮</span><small>Lainnya</small></button>
    `;
    document.body.appendChild(mobileNav);

    let activePanel = null;

    const closeMore = () => {
        morePanel.classList.remove("open");
    };

    const updatePanelState = () => {
        const leftOpen = activePanel === "left";
        const rightOpen = activePanel === "right";

        sidebar.classList.toggle("open", leftOpen);
        detail.classList.toggle("open", rightOpen);

        backdrop.classList.toggle(
            "open",
            leftOpen || rightOpen
        );

        document.body.dataset.mobilePanel =
            activePanel || "";
    };

    const openPanel = panel => {
        activePanel = panel;
        closeMore();
        updatePanelState();
    };

    const closePanel = () => {
        activePanel = null;
        updatePanelState();
    };

    const togglePanel = panel => {
        if (activePanel === panel) {
            closePanel();
        } else {
            openPanel(panel);
        }
    };

    const openSidebar = (focusSearch = false) => {
        openPanel("left");

        if (focusSearch) {
            requestAnimationFrame(() => {
                document.querySelector("#searchInput")?.focus();
            });
        }
    };

    const closeSidebar = () => {
        if (activePanel === "left") {
            closePanel();
        }
    };

    const openDetail = () => {
        openPanel("right");
    };

    const closeDetail = () => {
        if (activePanel === "right") {
            closePanel();
        }
    };

    // Initial mobile state: everything closed.
    closePanel();
    closeMore();

    document.addEventListener("member:selected", openDetail);

    $("#mobileMembers")?.addEventListener("click", () => {
        togglePanel("left");
    });

    $("#mobileAdd")?.addEventListener("click", () => {
        closePanel();
        closeMore();
        Dialog.openAddMember();
    });

    $("#mobileMore")?.addEventListener("click", () => {
        closePanel();
        morePanel.classList.toggle("open");
    });

    $("#mobileSidebarClose")?.addEventListener("click", closeSidebar);

    $("#mobileDetailClose")?.addEventListener("click", closeDetail);

    backdrop.addEventListener("click", () => {
        closePanel();
        closeMore();
    });

    mobileNav.querySelectorAll("[data-mobile]").forEach(button => {
        button.addEventListener("click", () => {
            const action = button.dataset.mobile;

            if (action === "tree") {
                closePanel();
                closeMore();
                centerTree();
            } else if (action === "members") {
                openSidebar();
            } else if (action === "search") {
                openSidebar(true);
            } else if (action === "add") {
                closePanel();
                closeMore();
                Dialog.openAddMember();
            } else if (action === "more") {
                closePanel();
                morePanel.classList.toggle("open");
            }
        });
    });

    morePanel.querySelector("[data-action='zoom-out']")?.addEventListener("click", zoomOut);
    morePanel.querySelector("[data-action='reset']")?.addEventListener("click", resetZoom);
    morePanel.querySelector("[data-action='zoom-in']")?.addEventListener("click", zoomIn);
    morePanel.querySelector("[data-action='fit']")?.addEventListener("click", fitTree);
    morePanel.querySelector("[data-action='center']")?.addEventListener("click", centerTree);
    morePanel.querySelector("[data-action='theme']")?.addEventListener("click", toggleTheme);
    morePanel.querySelector("[data-action='print']")?.addEventListener("click", () => window.print());

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closePanel();
            closeMore();
        }
    });

    bindTouchTree(treeArea);
}

function bindTouchTree(treeArea) {
    if (!("PointerEvent" in window)) return;
    if (typeof getViewport !== "function" || typeof setViewport !== "function") return;

    const pointers = new Map();
    let panStart = null;
    let pinchStart = null;

    const distance = () => {
        const values = [...pointers.values()];
        if (values.length < 2) return 0;
        return Math.hypot(
            values[0].x - values[1].x,
            values[0].y - values[1].y
        );
    };

    treeArea.addEventListener("pointerdown", event => {
        if (event.pointerType === "mouse") return;
        if (event.target.closest?.(".tree-node")) return;

        pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

        if (pointers.size === 1) {
            const viewport = getViewport();
            panStart = {
                x: event.clientX,
                y: event.clientY,
                panX: viewport.panX,
                panY: viewport.panY
            };
        } else if (pointers.size === 2) {
            const viewport = getViewport();
            pinchStart = {
                distance: distance(),
                zoom: viewport.zoom
            };
            panStart = null;
        }

        treeArea.setPointerCapture?.(event.pointerId);
    });

    treeArea.addEventListener("pointermove", event => {
        if (event.pointerType === "mouse") return;
        if (!pointers.has(event.pointerId)) return;

        pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
        const viewport = getViewport();

        if (pointers.size >= 2 && pinchStart?.distance) {
            const currentDistance = distance();
            if (currentDistance > 0) {
                const scale = currentDistance / pinchStart.distance;
                const nextZoom = Math.min(
                    2.5,
                    Math.max(0.3, pinchStart.zoom * scale)
                );
                setViewport({ zoom: nextZoom });
            }
            return;
        }

        if (pointers.size === 1 && panStart) {
            setViewport({
                panX: panStart.panX + event.clientX - panStart.x,
                panY: panStart.panY + event.clientY - panStart.y
            });
        }
    });

    const releasePointer = event => {
        pointers.delete(event.pointerId);
        try {
            treeArea.releasePointerCapture?.(event.pointerId);
        } catch {
            // Pointer may already have been released by the browser.
        }

        if (pointers.size === 1) {
            const remaining = [...pointers.values()][0];
            const viewport = getViewport();
            panStart = {
                x: remaining.x,
                y: remaining.y,
                panX: viewport.panX,
                panY: viewport.panY
            };
            pinchStart = null;
        } else if (pointers.size === 0) {
            panStart = null;
            pinchStart = null;
        }
    };

    treeArea.addEventListener("pointerup", releasePointer);
    treeArea.addEventListener("pointercancel", releasePointer);
    treeArea.addEventListener("pointerleave", releasePointer);
}

function injectMobileStyles() {
    const styleId = "family-tree-mobile-v1";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
        .mobile-header-actions,
        .mobile-nav,
        .mobile-backdrop,
        .mobile-panel-close,
        .mobile-controls {
            display: none;
        }

        @media (max-width: 800px) {
            :root {
                --mobile-nav-height: 68px;
            }

            html,
            body {
                width: 100%;
                min-width: 0;
                height: 100%;
                overflow: hidden;
            }

            body {
                padding-bottom: var(--mobile-nav-height);
                overscroll-behavior: none;
            }

            .topbar {
                height: 58px !important;
                min-height: 58px !important;
                padding: 6px 10px !important;
                gap: 8px !important;
                justify-content: space-between !important;
            }

            .brand {
                min-width: 0;
                flex: 1;
                align-items: flex-start !important;
                justify-content: center !important;
                overflow: hidden;
            }

            .brand h1,
            #appTitle {
                max-width: 100%;
                margin: 0;
                font-size: 17px !important;
                line-height: 1.15;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            #appVersion {
                font-size: 11px;
            }

            .topbar > .toolbar {
                display: none !important;
            }

            .mobile-header-actions {
                display: flex;
                align-items: center;
                gap: 4px;
                flex-shrink: 0;
            }

            .mobile-action {
                width: 42px;
                height: 42px;
                min-width: 42px;
                padding: 0 !important;
                border-radius: 12px;
                font-size: 20px !important;
            }

            #appLayout {
                display: block !important;
                height: calc(100dvh - 58px - var(--mobile-nav-height)) !important;
                min-height: 0;
                position: relative;
                overflow: hidden;
            }

            #treeArea {
                width: 100%;
                height: 100%;
                min-height: 0;
                overflow: hidden;
                touch-action: none;
            }

            #treeViewport {
                width: 100%;
                height: 100%;
                overflow: hidden;
            }

            #treeCanvas {
                transform-origin: 0 0;
            }

            #sidebar {
                position: fixed !important;
                z-index: 1200 !important;
                top: 0;
                left: 0;
                bottom: var(--mobile-nav-height);
                width: min(88vw, 360px) !important;
                max-width: 360px;
                padding: 18px 14px calc(20px + env(safe-area-inset-bottom)) !important;
                margin: 0 !important;
                border: 0 !important;
                border-right: 1px solid var(--color-border);
                border-radius: 0 18px 18px 0;
                box-shadow: 16px 0 40px rgba(0,0,0,.16);
                transform: translateX(-105%);
                transition: transform .22s ease;
                overflow-y: auto;
                overscroll-behavior: contain;
            }

            #sidebar.open {
                transform: translateX(0);
            }

            #sidebar .sidebar-search input,
            #sidebar .sidebar-filter select {
                min-height: 46px;
            }

            #memberList {
                padding: 6px 0 20px;
            }

            .sidebar-item,
            .search-member-item {
                min-height: 56px;
            }

            #detailPanel {
                position: fixed !important;
                z-index: 1200 !important;
                top: 0;
                right: 0;
                bottom: var(--mobile-nav-height);
                left: auto;
                width: min(88vw, 360px) !important;
                max-width: 360px;
                max-height: none;
                margin: 0 !important;
                padding: 18px 14px calc(20px + env(safe-area-inset-bottom)) !important;
                border: 0 !important;
                border-left: 1px solid var(--color-border);
                border-radius: 18px 0 0 18px;
                box-shadow: -16px 0 40px rgba(0,0,0,.16);
                transform: translateX(105%);
                transition: transform .24s cubic-bezier(.22,.61,.36,1);
                overflow-y: auto;
                overscroll-behavior: contain;
            }

            #detailPanel.open {
                transform: translateX(0);
            }

            #detailPhoto {
                width: 96px !important;
                height: 96px !important;
            }

            .detail-header {
                position: relative;
                padding-top: 8px;
            }

            .mobile-panel-close {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                position: absolute;
                top: 10px;
                right: 10px;
                z-index: 5;
                width: 42px;
                height: 42px;
                border: 0;
                border-radius: 999px;
                background: var(--color-background);
                color: var(--color-text);
                font-size: 28px;
                line-height: 1;
                cursor: pointer;
            }

            #sidebar > .mobile-panel-close {
                position: sticky;
                display: flex;
                margin-left: auto;
                margin-bottom: 4px;
            }

            .mobile-backdrop {
                position: fixed;
                z-index: 1100;
                inset: 0 0 var(--mobile-nav-height) 0;
                display: none;
                width: 100%;
                height: auto;
                padding: 0;
                border: 0;
                border-radius: 0;
                background: rgba(0,0,0,.28);
                backdrop-filter: blur(1px);
            }

            .mobile-backdrop.open {
                display: block;
            }

            .mobile-controls {
                position: absolute;
                right: 12px;
                top: 12px;
                z-index: 40;
                display: none;
                grid-template-columns: repeat(4, minmax(48px, 1fr));
                gap: 7px;
                max-width: calc(100vw - 24px);
                padding: 10px;
                border: 1px solid var(--color-border);
                border-radius: 16px;
                background: var(--color-surface);
                box-shadow: 0 12px 30px rgba(0,0,0,.15);
            }

            .mobile-controls.open {
                display: grid;
            }

            .mobile-controls button {
                min-width: 48px;
                min-height: 44px;
                padding: 8px 10px;
                border: 1px solid var(--color-border);
                border-radius: 10px;
                background: var(--color-surface);
                color: var(--color-text);
                font: inherit;
            }

            .mobile-nav {
                position: fixed;
                z-index: 1300;
                left: 0;
                right: 0;
                bottom: 0;
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                min-height: var(--mobile-nav-height);
                padding: 6px 6px calc(6px + env(safe-area-inset-bottom));
                gap: 2px;
                background: var(--color-surface);
                border-top: 1px solid var(--color-border);
                box-shadow: 0 -8px 24px rgba(0,0,0,.08);
            }

            .mobile-nav button {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 2px;
                min-width: 0;
                min-height: 52px;
                padding: 4px 2px;
                border: 0;
                border-radius: 12px;
                background: transparent;
                color: var(--color-text);
                font: inherit;
                cursor: pointer;
            }

            .mobile-nav button span {
                font-size: 20px;
                line-height: 1;
            }

            .mobile-nav button small {
                font-size: 10px;
                line-height: 1.1;
            }

            .mobile-nav button.primary {
                color: #fff;
                background: var(--color-primary);
            }

            .tree-area.dragging {
                cursor: grabbing;
            }

            .member-dialog {
                width: calc(100vw - 20px) !important;
                max-width: 560px;
                max-height: calc(100dvh - 24px);
                margin: auto;
            }

            input,
            textarea,
            select,
            button {
                font-size: 16px;
            }
        }

        @media (min-width: 801px) {
            #mobileControls {
                display: none !important;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            #sidebar,
            #detailPanel {
                transition: none !important;
            }
        }

        @media print {
            .mobile-nav,
            .mobile-header-actions,
            .mobile-backdrop,
            .mobile-controls,
            .mobile-panel-close {
                display: none !important;
            }

            #sidebar,
            #detailPanel {
                position: static !important;
                transform: none !important;
                box-shadow: none !important;
            }
        }
    `;
    document.head.appendChild(style);
}


function $(selector) {
    return document.querySelector(selector);
}
