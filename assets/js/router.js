/**
 * Family Tree v2 - Safe router
 */

import { CONFIG } from "./config.js";

const routes = new Map();
let currentRoute = "tree";

export function initializeRouter() {
    registerRoutes();
    window.addEventListener("hashchange", handleHashChange);
    document.addEventListener("route:tree", () => navigate("tree"));
    document.addEventListener("route:timeline", () => navigate("timeline"));
    document.addEventListener("route:statistics", () => navigate("statistics"));
    document.addEventListener("route:settings", () => navigate("settings"));
    handleHashChange();
}

function registerRoutes() {
    routes.clear();
    routes.set("tree", () => showView("treeView"));
    routes.set("timeline", () => showView("timelineView"));
    routes.set("statistics", () => showView("statisticsView"));
    routes.set("settings", () => showView("settingsView"));
}

export function navigate(route) {
    const target = routes.has(route) ? route : "tree";
    if (currentRoute === target) {
        handleHashChange();
        return;
    }
    window.location.hash = target;
}

function handleHashChange() {
    const hash = window.location.hash.replace(/^#\/?/, "").trim();
    const route = routes.has(hash) ? hash : "tree";
    currentRoute = route;
    routes.get(route)?.();
    document.dispatchEvent(new CustomEvent(CONFIG.EVENTS.ROUTE_CHANGED, { detail: route }));
}

function showView(id) {
    const views = [...document.querySelectorAll(".app-view")];
    if (!views.length) return;
    views.forEach(view => {
        view.hidden = view.id !== id;
    });
}

export function getCurrentRoute() {
    return currentRoute;
}
