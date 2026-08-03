/**
 * ==========================================================
 * Family Tree v2
 * header.js
 * ==========================================================
 */

import {

    CONFIG

} from "../config.js";

import {

    Toast

} from "./toast.js";

import {

    navigate

} from "../router.js";

/* ==========================================================
   ELEMENTS
========================================================== */

let appName;

let appVersion;

let btnHome;

let btnRefresh;

let btnAbout;

/* ==========================================================
   PUBLIC
========================================================== */

export function initializeHeader() {

    appName =

        $("#appName");

    appVersion =

        $("#appVersion");

    btnHome =

        $("#btnHome");

    btnRefresh =

        $("#btnRefresh");

    btnAbout =

        $("#btnAbout");

    render();

    bindEvents();

}

/* ==========================================================
   RENDER
========================================================== */

function render() {

    if (appName) {

        appName.textContent =

            CONFIG.APP_NAME;

    }

    if (appVersion) {

        appVersion.textContent =

            "v" +

            CONFIG.VERSION;

    }

}

/* ==========================================================
   EVENTS
========================================================== */

function bindEvents() {

    btnHome?.addEventListener(

        "click",

        () => {

            navigate("tree");

        }

    );

    btnRefresh?.addEventListener(

        "click",

        refresh

    );

    btnAbout?.addEventListener(

        "click",

        about

    );

}

/* ==========================================================
   REFRESH
========================================================== */

function refresh() {

    document.dispatchEvent(

        new CustomEvent(

            CONFIG.EVENTS.DATA_UPDATED

        )

    );

    Toast.info(

        "Memuat ulang data..."

    );

}

/* ==========================================================
   ABOUT
========================================================== */

function about() {

    Toast.info(

        `${

            CONFIG.APP_NAME

        } v${

            CONFIG.VERSION

        }`

    );

}

/* ==========================================================
   HELPERS
========================================================== */

function $(selector) {

    return document.querySelector(

        selector

    );

}
