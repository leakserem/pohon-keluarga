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
    DIALOG
} from "./dialog.js";

const HTML = document.documentElement;

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

    SELECT("#zoomIn")?.addEventListener(
        "click",
        zoomIn
    );

    SELECT("#zoomOut")?.addEventListener(
        "click",
        zoomOut
    );

    SELECT("#zoomReset")?.addEventListener(
        "click",
        resetZoom
    );

    SELECT("#btnCenter")?.addEventListener(
        "click",
        centerTree
    );

    SELECT("#btnFit")?.addEventListener(
        "click",
        fitTree
    );

}

/* ==========================================================
   THEME
========================================================== */

function bindTheme() {

    SELECT("#btnTheme")?.addEventListener(
        "click",
        toggleTheme
    );

}

function toggleTheme() {

    HTML.classList.toggle("dark");

    const IS_DARK = HTML.classList.contains("dark");

    localStorage.setItem(
        "familyTree.theme",
        IS_DARK ? "dark" : "light"
    );

}

/* ==========================================================
   PRINT
========================================================== */

function bindPrint() {

    SELECT("#btnPrint")?.addEventListener(
        "click",
        () => window.print()
    );

}

/* ==========================================================
   NAVIGATION
========================================================== */

function bindNavigation() {

    SELECT("#btnHome")?.addEventListener(
        "click",
        () => {

            document.dispatchEvent(

                new CustomEvent("route:tree")

            );

        }
    );

    SELECT("#btnTimeline")?.addEventListener(
        "click",
        () => {

            document.dispatchEvent(

                new CustomEvent("route:timeline")

            );

        }
    );

    SELECT("#btnStatistics")?.addEventListener(
        "click",
        () => {

            document.dispatchEvent(

                new CustomEvent("route:statistics")

            );

        }
    );

    SELECT("#btnAddMember")?.addEventListener(
        "click",
        () => {

            DIALOG.openAddMember();

        }
    );

}

/* ==========================================================
   HELPERS
========================================================== */

function SELECT(SELECTOR) {

    return document.querySelector(SELECTOR);

}
