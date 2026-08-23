/**
 * Family Tree v2.8 - Application bootstrap
 */

import { CONFIG } from "./config.js";
import { initializeStore, setPeople } from "./store.js";
import { loadPeople } from "./api.js";
import { initializeRouter } from "./router.js";
import { initializeHeader } from "./components/header.js";
import { initializeToolbar } from "./components/toolbar.js";
import { initializeSidebar } from "./components/sidebar.js";
import { initializeSearchBox } from "./components/searchBox.js";
import { initializeDetailPanel } from "./components/detailPanel.js";
import { initializeDialog } from "./components/dialog.js";
import { initializeTreeCanvas, renderTree } from "./components/treeCanvas.js";
import { initializePanelSlider } from "./components/panelSlider.js";

window.addEventListener("DOMContentLoaded", startApplication);

async function startApplication() {
    installUiFixes();

    try {
        showLoading(true);
        console.log(`${CONFIG.APP_NAME} ${CONFIG.VERSION}`);

        initializeStore();
        initializeRouter();
        initializeHeader();
        initializeToolbar();
        initializeSidebar();
        initializeSearchBox();
        initializeDetailPanel();
        initializeDialog();
        initializeTreeCanvas();
        initializePanelSlider();

        await loadApplication();
        bindEvents();
        setAppStatus("Siap");
    } catch (error) {
        console.error("Application startup error:", error);
        setAppStatus("Error");
        showInlineError(error?.message || "Gagal menjalankan aplikasi.");
    } finally {
        showLoading(false);
    }
}

async function loadApplication() {
    setAppStatus("Memuat…");
    const people = await loadPeople();
    if (!Array.isArray(people)) {
        throw new Error("Data anggota bukan array");
    }
    setPeople(people);
    renderTree();
}

function bindEvents() {
    document.addEventListener(CONFIG.EVENTS.DATA_UPDATED, reloadApplication);
    document.addEventListener(CONFIG.EVENTS.TREE_REFRESH, renderTree);
}

export async function reloadApplication() {
    try {
        showLoading(true);
        setAppStatus("Memuat…");
        const people = await loadPeople();
        setPeople(people);
        renderTree();
        setAppStatus("Siap");
    } catch (error) {
        console.error("Reload error:", error);
        setAppStatus("Error");
        showInlineError(error?.message || "Gagal memuat ulang.");
    } finally {
        showLoading(false);
    }
}

function showLoading(show) {
    const loading = document.querySelector("#loading");
    if (loading) loading.hidden = !show;
}

function installUiFixes() {
    if (document.querySelector("#appUiFixes")) return;

    const style = document.createElement("style");
    style.id = "appUiFixes";
    style.textContent = `
        /* Center all visible titles */
        .topbar, .brand, .sidebar-header, .detail-header, .detail-title,
        .dialog-header, .dialog-footer, .panel h2, .panel h3, .card h2, .card h3,
        .empty-state, .search-empty { text-align: center; }

        .brand { align-items: center; }
        .topbar { justify-content: center !important; position: relative; }
        .toolbar { justify-content: center !important; }

        /* Put application state inside the menu, not as a bottom toast */
        #appStatusMenu {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 7px;
            min-width: 84px;
            height: 42px;
            padding: 0 13px;
            border-radius: 12px;
            background: rgba(72, 225, 135, .12);
            border: 1px solid rgba(72, 225, 135, .36);
            color: #61e89a;
            font: inherit;
            font-size: 13px;
            font-weight: 700;
            white-space: nowrap;
        }

        #appStatusDot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: currentColor;
            box-shadow: 0 0 10px currentColor;
        }

        #appStatusMenu[data-state="error"] {
            color: #ff7b7b;
            background: rgba(255, 90, 90, .10);
            border-color: rgba(255, 90, 90, .35);
        }

        #appInlineError {
            position: fixed;
            left: 50%;
            top: 88px;
            transform: translateX(-50%);
            z-index: 9000;
            max-width: min(760px, 90vw);
            padding: 12px 16px;
            border-radius: 12px;
            background: rgba(130, 32, 32, .95);
            color: #fff;
            text-align: center;
            box-shadow: 0 12px 36px rgba(0,0,0,.28);
        }

        /* Search panel */
        .search-member-item {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
            padding: 11px 12px;
            border: 1px solid var(--color-border, #31415a);
            border-radius: 10px;
            background: transparent;
            color: inherit;
            text-align: left;
            cursor: pointer;
        }

        .search-member-item:hover {
            background: rgba(72, 225, 135, .12);
        }

        .search-member-item strong {
            width: 100%;
            overflow-wrap: anywhere;
        }

        .search-member-item span {
            font-size: 12px;
            opacity: .72;
        }

        /* Add/edit dialog: never cut the bottom of the form */
        #memberDialog {
            width: min(720px, 94vw);
            max-height: 92vh;
            padding: 0;
            overflow: hidden;
        }

        #memberDialog .dialog-window {
            display: grid;
            grid-template-rows: auto minmax(0, 1fr) auto;
            max-height: 92vh;
            overflow: hidden;
        }

        #memberDialog .dialog-header {
            position: sticky;
            top: 0;
            z-index: 2;
            padding: 16px 20px;
            background: inherit;
        }

        #memberDialog #dialogBody {
            min-height: 0;
            overflow-y: auto;
            overscroll-behavior: contain;
            padding: 18px 22px 22px;
        }

        #memberDialog #dialogFooter {
            position: sticky;
            bottom: 0;
            z-index: 2;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 10px;
            padding: 14px 20px;
            background: inherit;
            border-top: 1px solid var(--color-border, #31415a);
        }

        #memberDialog .member-form {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px 16px;
        }

        #memberDialog .member-form label:last-child {
            grid-column: 1 / -1;
        }

        #memberDialog .member-form label {
            display: flex;
            flex-direction: column;
            gap: 7px;
            font-weight: 700;
            text-align: center;
        }

        #memberDialog .member-form input,
        #memberDialog .member-form textarea {
            text-align: left;
        }

        #memberDialog .member-form textarea {
            min-height: 120px;
        }

        @media (max-width: 720px) {
            #memberDialog .member-form { grid-template-columns: 1fr; }
            #memberDialog .member-form label:last-child { grid-column: auto; }
        }
    `;
    document.head.appendChild(style);

    const toolbar = document.querySelector("#toolbar");
    if (toolbar && !document.querySelector("#appStatusMenu")) {
        const status = document.createElement("div");
        status.id = "appStatusMenu";
        status.dataset.state = "loading";
        status.innerHTML = '<span id="appStatusDot"></span><span id="appStatusText">Memuat…</span>';
        toolbar.appendChild(status);
    }
}

function setAppStatus(text) {
    const menu = document.querySelector("#appStatusMenu");
    const label = document.querySelector("#appStatusText");
    if (!menu || !label) return;

    label.textContent = text;
    menu.dataset.state = text === "Error" ? "error" : "ok";
}

function showInlineError(message) {
    const old = document.querySelector("#appInlineError");
    old?.remove();

    const box = document.createElement("div");
    box.id = "appInlineError";
    box.textContent = message;
    document.body.appendChild(box);

    setTimeout(() => box.remove(), 7000);
}

window.App = {
    reload: reloadApplication,
    render: renderTree,
    config: CONFIG,
    status: setAppStatus
};
