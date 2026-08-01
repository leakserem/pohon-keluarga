/**
 * ==========================================================
 * Family Tree v2
 * toolbar.js
 * ==========================================================
 */

import {
    zoomIn,
    zoomOut,
    resetZoom,
    centerTree,
    fitTree
} from "./treeCanvas.js";

import {
    Dialog
} from "./dialog.js";

const html = document.documentElement;

/* ==========================================================
   PUBLIC
========================================================== */

export function initializeToolbar() {

    bindZoom();

    bindTheme();

    bindPrint();

    bindNavigation();

}

/* ==========================================================
   ZOOM
========================================================== */

function bindZoom() {

    $("#zoomIn")?.addEventListener(
        "click",
        zoomIn
    );

    $("#zoomOut")?.addEventListener(
        "click",
        zoomOut
    );

    $("#zoomReset")?.addEventListener(
        "click",
        resetZoom
    );

    $("#btnCenter")?.addEventListener(
        "click",
        centerTree
    );

    $("#btnFit")?.addEventListener(
        "click",
        fitTree
    );

}

/* ==========================================================
   THEME
========================================================== */

function bindTheme() {

    $("#btnTheme")?.addEventListener(
        "click",
        toggleTheme
    );

}

function toggleTheme() {

    html.classList.toggle("dark");

    const dark = html.classList.contains("dark");

    localStorage.setItem(
        "familyTree.theme",
        dark ? "dark" : "light"
    );

}

/* ==========================================================
   PRINT
========================================================== */

function bindPrint() {

    $("#btnPrint")?.addEventListener(
        "click",
        () => window.print()
    );

}

/* ==========================================================
   NAVIGATION
========================================================== */

function bindNavigation() {

    $("#btnHome")?.addEventListener(
        "click",
        () => {

            document.dispatchEvent(
                new CustomEvent("route:tree")
            );

        }
    );

    $("#btnTimeline")?.addEventListener(
        "click",
        () => {

            document.dispatchEvent(
                new CustomEvent("route:timeline")
            );

        }
    );

    $("#btnStatistics")?.addEventListener(
        "click",
        () => {

            document.dispatchEvent(
                new CustomEvent("route:statistics")
            );

        }
    );

    $("#btnAddMember")?.addEventListener(
        "click",
        () => {

            Dialog.openAddMember();

        }
    );

}

/* ==========================================================
   HELPERS
========================================================== */

function $(selector) {

    return document.querySelector(selector);

}
