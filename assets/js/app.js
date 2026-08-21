/**
 * Family Tree v2 - Application bootstrap
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
import { Toast } from "./components/toast.js";

window.addEventListener("DOMContentLoaded", startApplication);

async function startApplication() {
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

        await loadApplication();
        bindEvents();
        Toast.success("Aplikasi siap.");
    } catch (error) {
        console.error("Application startup error:", error);
        Toast.error(error?.message || "Gagal menjalankan aplikasi.");
    } finally {
        showLoading(false);
    }
}

async function loadApplication() {
    const people = await loadPeople();
    if (!Array.isArray(people)) throw new Error("Data anggota bukan array");
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
        const people = await loadPeople();
        setPeople(people);
        renderTree();
        Toast.success("Data diperbarui.");
    } catch (error) {
        console.error("Reload error:", error);
        Toast.error(error?.message || "Gagal memuat ulang.");
    } finally {
        showLoading(false);
    }
}

function showLoading(show) {
    const loading = document.querySelector("#loading");
    if (loading) loading.hidden = !show;
}

window.App = {
    reload: reloadApplication,
    render: renderTree,
    config: CONFIG
};
