/**
 * ==========================================================
 * Family Tree v2
 * router.js
 * SPA Hash Router
 * ==========================================================
 */

import { CONFIG } from "./config.js";

const routes = new Map();

/* ==========================================================
   REGISTER ROUTE
========================================================== */

export function registerRoute(path, callback) {

    routes.set(path, callback);

}

/* ==========================================================
   NAVIGATE
========================================================== */

export function navigate(path) {

    if (location.hash !== path) {

        location.hash = path;

    } else {

        handleRoute();

    }

}

/* ==========================================================
   CURRENT
========================================================== */

export function currentRoute() {

    return location.hash || CONFIG.ROUTES.HOME;

}

/* ==========================================================
   ROUTER
========================================================== */

export function initializeRouter() {

    /* ---------- Default Routes ---------- */

    registerRoute(CONFIG.ROUTES.HOME, () => {

        showPage("tree");

    });

    registerRoute(CONFIG.ROUTES.TREE, () => {

        showPage("tree");

    });

    registerRoute(CONFIG.ROUTES.MEMBER, () => {

        showPage("member");

    });

    registerRoute(CONFIG.ROUTES.TIMELINE, () => {

        showPage("timeline");

    });

    registerRoute(CONFIG.ROUTES.STATISTICS, () => {

        showPage("statistics");

    });

    registerRoute(CONFIG.ROUTES.SETTINGS, () => {

        showPage("settings");

    });

    window.addEventListener(

        "hashchange",

        handleRoute

    );

    handleRoute();

}

/* ==========================================================
   HANDLE ROUTE
========================================================== */

function handleRoute() {

    const hash = currentRoute();

    const callback = routes.get(hash);

    if (callback) {

        callback();

    } else {

        navigate(CONFIG.ROUTES.HOME);

    }

}

/* ==========================================================
   PAGE VISIBILITY
========================================================== */

function showPage(page) {

    hideAllPages();

    switch (page) {

        case "tree":

            show("#treeCanvas");

            show("#sidebar");

            show("#detailPanel");

            break;

        case "member":

            show("#memberForm");

            break;

        case "timeline":

            show("#timelinePage");

            break;

        case "statistics":

            show("#statisticsPage");

            break;

        case "settings":

            show("#settingsPage");

            break;

    }

}

/* ==========================================================
   HELPERS
========================================================== */

function hideAllPages() {

    [

        "#treeCanvas",

        "#sidebar",

        "#detailPanel",

        "#memberForm",

        "#timelinePage",

        "#statisticsPage",

        "#settingsPage"

    ].forEach(selector => {

        const element = document.querySelector(selector);

        if (element) {

            element.hidden = true;

        }

    });

}

function show(selector) {

    const element = document.querySelector(selector);

    if (!element) return;

    element.hidden = false;

}

/* ==========================================================
   SHORTCUTS
========================================================== */

export function goHome() {

    navigate(CONFIG.ROUTES.HOME);

}

export function goTree() {

    navigate(CONFIG.ROUTES.TREE);

}

export function goTimeline() {

    navigate(CONFIG.ROUTES.TIMELINE);

}

export function goStatistics() {

    navigate(CONFIG.ROUTES.STATISTICS);

}

export function goSettings() {

    navigate(CONFIG.ROUTES.SETTINGS);

}

export function goMember() {

    navigate(CONFIG.ROUTES.MEMBER);

}
