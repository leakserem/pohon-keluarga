/**
 * ==========================================================
 * Family Tree v2
 * config.js
 * Central Configuration
 * ==========================================================
 */

export const CONFIG = Object.freeze({

    /* ======================================================
       APP
    ====================================================== */

    APP_NAME: "Pohon Keluarga Kami",

    VERSION: "2.0.0",

    AUTHOR: "Puri Cakra Murti",

    LANGUAGE: "id-ID",

    DEBUG: true,

    /* ======================================================
       API
    ====================================================== */

    API: {

    BASE_URL:
        "https://script.google.com/macros/s/AKfycbwfb_aygcxJ9aigYdXcyh1Iq2ZP8KrHFZAL8__Xn1HoX99RTV-eKHY-ppTofJf3waaR/exec",

    TIMEOUT: 10000,

    RETRY: 2

},
    /* ======================================================
       TREE
    ====================================================== */

    TREE: {

        NODE_WIDTH: 220,

        NODE_HEIGHT: 110,

        HORIZONTAL_GAP: 60,

        VERTICAL_GAP: 170,

        PARTNER_GAP: 40,

        PADDING: 80

    },

    /* ======================================================
       CANVAS
    ====================================================== */

    CANVAS: {

        DEFAULT_ZOOM: 1,

        MIN_ZOOM: 0.25,

        MAX_ZOOM: 3,

        ZOOM_STEP: 0.10,

        PAN_STEP: 50

    },

    /* ======================================================
       SEARCH
    ====================================================== */

    SEARCH: {

        MIN_CHAR: 1,

        DEBOUNCE: 300

    },

    /* ======================================================
       PHOTO
    ====================================================== */

    PHOTO: {

        DEFAULT: "assets/images/avatar.png",

        MAX_SIZE: 5 * 1024 * 1024,

        TYPES: [

            "image/jpeg",

            "image/png",

            "image/webp"

        ]

    },

    /* ======================================================
       THEME
    ====================================================== */

    THEME: {

        DEFAULT: "light",

        STORAGE_KEY: "familyTree.theme"

    },

    /* ======================================================
       STORAGE
    ====================================================== */

    STORAGE: {

        SETTINGS: "familyTree.settings",

        CACHE: "familyTree.cache"

    },

    /* ======================================================
       ROUTER
    ====================================================== */

    ROUTES: {

        HOME: "#/",

        TREE: "#/tree",

        TIMELINE: "#/timeline",

        STATISTICS: "#/statistics",

        MEMBER: "#/member",

        SETTINGS: "#/settings"

    },

    /* ======================================================
       EVENTS
    ====================================================== */

    EVENTS: {

        DATA_LOADED: "data:loaded",

        DATA_UPDATED: "data:updated",

        TREE_REFRESH: "tree:refresh",

        PERSON_SELECTED: "person:selected",

        PERSON_UPDATED: "person:updated",

        ROUTE_CHANGED: "route:changed"

    }

});

/* ==========================================================
   HELPERS
========================================================== */

export function apiUrl(action = "") {

    if (!action) {

        return CONFIG.API.URL;

    }

    return `${CONFIG.API.URL}?action=${encodeURIComponent(action)}`;

}

export function isDebug() {

    return CONFIG.DEBUG;

}

export function treeConfig() {

    return CONFIG.TREE;

}

export function canvasConfig() {

    return CONFIG.CANVAS;

}

export function routes() {

    return CONFIG.ROUTES;

}
