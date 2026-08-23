/**
 * Family Tree v2 - Central configuration
 */

export const CONFIG = Object.freeze({
    APP_NAME: "Pohon Keluarga Kami",
    VERSION: "2.1.0",
    AUTHOR: "Puri Cakra Murti",
    LANGUAGE: "id-ID",
    DEBUG: true,

    API: Object.freeze({
        BASE_URL: "https://script.google.com/macros/s/AKfycbxLbpfHBOrcmWL5jxMAruHZKqXt3chmdsu8CW1JeBdKFirylw-H8EXIjEVPJpiGBP1x/exec",
        TIMEOUT: 10000,
        RETRY: 2
    }),

    TREE: Object.freeze({
        NODE_WIDTH: 320,
        NODE_HEIGHT: 110,
        HORIZONTAL_GAP: 28,
        VERTICAL_GAP: 180,
        SPOUSE_GAP: 24,
        ROOT_OFFSET_X: 40,
        ROOT_OFFSET_Y: 40,
        MIN_ZOOM: 0.30,
        MAX_ZOOM: 2.50,
        DEFAULT_ZOOM: 1,
        ZOOM_STEP: 0.10
    }),

    SEARCH: Object.freeze({
        MIN_CHAR: 1,
        DEBOUNCE: 300
    }),

    PHOTO: Object.freeze({
        DEFAULT: "assets/images/avatar.svg",
        MAX_SIZE: 5 * 1024 * 1024,
        TYPES: ["image/jpeg", "image/png", "image/webp"]
    }),

    THEME: Object.freeze({
        DEFAULT: "light",
        STORAGE_KEY: "familyTree.theme"
    }),

    STORAGE: Object.freeze({
        SETTINGS: "familyTree.settings",
        CACHE: "familyTree.cache"
    }),

    ROUTES: Object.freeze({
        HOME: "#/",
        TREE: "#/tree",
        TIMELINE: "#/timeline",
        STATISTICS: "#/statistics",
        MEMBER: "#/member",
        SETTINGS: "#/settings"
    }),

    EVENTS: Object.freeze({
        DATA_LOADED: "data:loaded",
        DATA_UPDATED: "data:updated",
        TREE_REFRESH: "tree:refresh",
        PERSON_SELECTED: "person:selected",
        PERSON_UPDATED: "person:updated",
        ROUTE_CHANGED: "route:changed"
    })
});

export function apiUrl(action = "") {
    const base = CONFIG.API.BASE_URL;
    if (!action) return base;
    return `${base}?action=${encodeURIComponent(action)}`;
}

export function isDebug() {
    return CONFIG.DEBUG;
}

export function treeConfig() {
    return CONFIG.TREE;
}

export function canvasConfig() {
    return CONFIG.TREE;
}

export function routes() {
    return CONFIG.ROUTES;
}
