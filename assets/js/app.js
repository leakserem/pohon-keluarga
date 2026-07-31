/**
 * ==========================================================
 * Family Tree v2
 * app.js
 * Application Bootstrap
 * ==========================================================
 */

import { CONFIG } from "./config.js";

import {
    initializeStore,
    setPeople
} from "./store.js";

import {
    loadPeople
} from "./api.js";

import {
    initializeRouter
} from "./router.js";

import {
    initializeHeader
} from "./components/header.js";

import {
    initializeSearchBox
} from "./components/searchBox.js";

import {
    initializeToolbar
} from "./components/toolbar.js";

import {
    initializeSidebar
} from "./components/sidebar.js";

import {
    initializeDetailPanel
} from "./components/detailPanel.js";

import {
    initializeTreeCanvas,
    renderTree
} from "./components/treeCanvas.js";

import {
    Toast
} from "./components/toast.js";

import {
    Dialog
} from "./components/dialog.js";

/* ==========================================================
   START
========================================================== */

window.addEventListener(

    "DOMContentLoaded",

    startApplication

);

/* ==========================================================
   APPLICATION
========================================================== */

async function startApplication() {

    try {

        showLoading(true);

        console.log(

            CONFIG.APP_NAME,

            CONFIG.VERSION

        );

        /* ---------------------------
           STORE
        --------------------------- */

        initializeStore();

        /* ---------------------------
           UI
        --------------------------- */

        initializeHeader();

        initializeRouter();

        initializeToolbar();

        initializeSidebar();

        initializeSearchBox();

        initializeDetailPanel();

        initializeTreeCanvas();

        /* ---------------------------
           DATA
        --------------------------- */

        const people = await loadPeople();

        setPeople(people);

        renderTree();

        /* ---------------------------
           EVENTS
        --------------------------- */

        bindEvents();

        Toast.success(

            "Data keluarga berhasil dimuat."

        );

    }

    catch (error) {

        console.error(error);

        Toast.error(

            "Aplikasi gagal dijalankan."

        );

    }

    finally {

        showLoading(false);

    }

}

/* ==========================================================
   EVENTS
========================================================== */

function bindEvents() {

    window.addEventListener(

        "resize",

        debounce(() => {

            renderTree();

        }, 250)

    );

    document.addEventListener(

        CONFIG.EVENTS.TREE_REFRESH,

        () => {

            renderTree();

        }

    );

    document.addEventListener(

        CONFIG.EVENTS.DATA_UPDATED,

        async () => {

            await reloadData();

        }

    );

}

/* ==========================================================
   RELOAD
========================================================== */

export async function reloadData() {

    try {

        showLoading(true);

        const people = await loadPeople();

        setPeople(people);

        renderTree();

        Toast.success(

            "Data berhasil diperbarui."

        );

    }

    catch (error) {

        console.error(error);

        Toast.error(

            "Tidak dapat memuat data."

        );

    }

    finally {

        showLoading(false);

    }

}

/* ==========================================================
   LOADING
========================================================== */

function showLoading(show = true) {

    const loading =

        document.querySelector("#loading");

    if (!loading) return;

    loading.classList.toggle(

        "hidden",

        !show

    );

}

/* ==========================================================
   UTIL
========================================================== */

function debounce(callback, delay = 250) {

    let timer;

    return (...args) => {

        clearTimeout(timer);

        timer = setTimeout(() => {

            callback(...args);

        }, delay);

    };

}

/* ==========================================================
   GLOBAL DEBUG
========================================================== */

window.App = {

    reload: reloadData,

    render: renderTree,

    toast: Toast,

    dialog: Dialog,

    config: CONFIG

};
