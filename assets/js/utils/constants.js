/**
 * Family Tree v2 - Shared constants
 * Keep one source of truth: values mirror config.js.
 */

export const APP = Object.freeze({
    NAME: "Pohon Keluarga Kami",
    VERSION: "2.1"
});

export const TREE = Object.freeze({
    NODE_WIDTH: 220,
    NODE_HEIGHT: 110,
    HORIZONTAL_GAP: 60,
    VERTICAL_GAP: 180,
    SPOUSE_GAP: 40,
    ROOT_OFFSET_X: 40,
    ROOT_OFFSET_Y: 40,
    MIN_ZOOM: 0.30,
    MAX_ZOOM: 2.50,
    DEFAULT_ZOOM: 1,
    ZOOM_STEP: 0.10
});

export const SIDEBAR = Object.freeze({
    SEARCH_DELAY: 300,
    DEFAULT_GENERATION: "all"
});

export const MEMBER = Object.freeze({
    DEFAULT_PHOTO: "assets/images/avatar.svg",
    UNKNOWN_TEXT: "-"
});

export const STORAGE = Object.freeze({
    THEME: "familyTree.theme",
    ZOOM: "familyTree.zoom",
    PAN_X: "familyTree.panX",
    PAN_Y: "familyTree.panY"
});

export const EVENTS = Object.freeze({
    MEMBER_SELECTED: "member:selected",
    TREE_REFRESH: "tree:refresh",
    DATA_UPDATED: "data:updated"
});

export const SVG = Object.freeze({
    NAMESPACE: "http://www.w3.org/2000/svg",
    LINE_COLOR: "#9db4a3",
    LINE_WIDTH: 2
});

export const API = Object.freeze({
    TIMEOUT: 10000,
    RETRY: 2
});
