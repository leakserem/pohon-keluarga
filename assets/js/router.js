/**
 * ==========================================================
 * Family Tree v2
 * router.js
 * ==========================================================
 */

const routes = new Map();

let currentRoute = "";

/* ==========================================================
   PUBLIC
========================================================== */

export function initializeRouter() {

    registerRoutes();

    window.addEventListener(

        "hashchange",

        handleHashChange

    );

    document.addEventListener(

        "route:tree",

        () => navigate("tree")

    );

    document.addEventListener(

        "route:timeline",

        () => navigate("timeline")

    );

    document.addEventListener(

        "route:statistics",

        () => navigate("statistics")

    );

    document.addEventListener(

        "route:settings",

        () => navigate("settings")

    );

    handleHashChange();

}

/* ==========================================================
   ROUTES
========================================================== */

function registerRoutes() {

    routes.set(

        "tree",

        () => showView("treeView")

    );

    routes.set(

        "timeline",

        () => showView("timelineView")

    );

    routes.set(

        "statistics",

        () => showView("statisticsView")

    );

    routes.set(

        "settings",

        () => showView("settingsView")

    );

}

/* ==========================================================
   NAVIGATE
========================================================== */

export function navigate(route) {

    if (!routes.has(route))

        route = "tree";

    if (currentRoute === route)

        return;

    window.location.hash =

        route;

}

/* ==========================================================
   HASH
========================================================== */

function handleHashChange() {

    const hash =

        window.location.hash

            .replace("#", "")

            .trim() ||

        "tree";

    currentRoute = hash;

    const handler =

        routes.get(hash) ||

        routes.get("tree");

    handler();

}

/* ==========================================================
   VIEW
========================================================== */

function showView(id) {

    document

        .querySelectorAll(

            ".app-view"

        )

        .forEach(view => {

            view.hidden =

                view.id !== id;

        });

}

/* ==========================================================
   INFO
========================================================== */

export function getCurrentRoute() {

    return currentRoute;

}
