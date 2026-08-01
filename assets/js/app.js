/**
 * ==========================================================
 * Family Tree v2
 * app.js
 * ==========================================================
 */

import { CONFIG } from "./config.js";

import { setPeople } from "./store.js";

import { loadPeople } from "./api.js";

import { initializeRouter } from "./router.js";

import { initializeHeader } from "./components/header.js";

import { initializeToolbar } from "./components/toolbar.js";

import { initializeSidebar } from "./components/sidebar.js";

import { initializeSearchBox } from "./components/searchBox.js";

import { initializeDetailPanel } from "./components/detailPanel.js";

import {

    initializeTree,
    renderTree

} from "./components/treeCanvas.js";

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

        /* -------------------------
           UI
        -------------------------- */

        initializeHeader();

        initializeRouter();

        initializeToolbar();

        initializeSidebar();

        initializeSearchBox();

        initializeDetailPanel();

        initializeTree();

        /* -------------------------
           DATA
        -------------------------- */

        const people = await loadPeople();

        setPeople(people);

        renderTree();

        bindEvents();

        console.log(

            "Family Tree berhasil dimuat."

        );

    }

    catch (error) {

        console.error(

            "Application Error",

            error

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

        })

    );

}

/* ==========================================================
   LOADING
========================================================== */

function showLoading(show = true) {

    const loading =

        document.querySelector("#loading");

    if (!loading)
        return;

    loading.classList.toggle(

        "hidden",

        !show

    );

}

/* ==========================================================
   DEBOUNCE
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
   GLOBAL
========================================================== */

window.App = {

    renderTree,

    reload: async () => {

        const people = await loadPeople();

        setPeople(people);

        renderTree();

    },

    config: CONFIG

};
