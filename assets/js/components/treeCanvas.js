/**
 * ==========================================================
 * Family Tree v2
 * treeCanvas.js
 * Tree Canvas Renderer
 * ==========================================================
 */

import {

    subscribe

} from "../store.js";

import {

    buildFamilyLayout,

    flattenLayout

} from "./autoLayout.js";

import {

    drawConnections

} from "./connector.js";

import {

    createTreeNode

} from "./treeNode.js";

import {

    TREE

} from "../utils/constants.js";

/* ==========================================================
   ELEMENTS
========================================================== */

let treeArea = null;

let canvas = null;

let nodesLayer = null;

let svgLayer = null;

/* ==========================================================
   VIEWPORT
========================================================== */

let zoom = 1;

let panX = TREE.ROOT_OFFSET_X;

let panY = TREE.ROOT_OFFSET_Y;

/* ==========================================================
   DRAG
========================================================== */

let dragging = false;

let dragStartX = 0;

let dragStartY = 0;

let startPanX = 0;

let startPanY = 0;

/* ==========================================================
   ANIMATION
========================================================== */

let frameRequest = null;

/* ==========================================================
   PUBLIC
========================================================== */

export function initializeTreeCanvas() {

    treeArea =

        document.querySelector(

            "#treeArea"

        );

    canvas =

        document.querySelector(

            "#treeCanvas"

        );

    nodesLayer =

        document.querySelector(

            "#treeNodes"

        );

    svgLayer =

        document.querySelector(

            "#treeSvg"

        );

    if (

        !treeArea ||

        !canvas ||

        !nodesLayer ||

        !svgLayer

    ) {

        console.error(

            "Tree Canvas not found."

        );

        return;

    }

    subscribe(renderTree);

    bindPointerEvents();

    bindWheelEvent();

    updateTransform();

}

/* ==========================================================
   HELPERS
========================================================== */

function clearCanvas() {

    nodesLayer.replaceChildren();

    svgLayer.replaceChildren();

}
/* ==========================================================
   RENDER
========================================================== */

export function renderTree() {

    if (

        !nodesLayer ||

        !svgLayer

    ) {

        return;

    }

    clearCanvas();

    const tree =

        buildFamilyLayout();

    const layout =

        flattenLayout(tree);

    drawConnections(

        svgLayer,

        tree

    );

    drawNodes(layout);

    updateCanvasSize(layout);

    updateTransform();

}

/* ==========================================================
   DRAW NODES
========================================================== */

function drawNodes(layout) {

    const fragment =

        document.createDocumentFragment();

    layout.forEach(person => {

        fragment.appendChild(

            createTreeNode(person)

        );

    });

    nodesLayer.appendChild(

        fragment

    );

}

/* ==========================================================
   CANVAS SIZE
========================================================== */

function updateCanvasSize(layout) {

    if (!layout.length)

        return;

    let maxX = 0;

    let maxY = 0;

    layout.forEach(person => {

        maxX = Math.max(

            maxX,

            person.x +

            TREE.NODE_WIDTH

        );

        maxY = Math.max(

            maxY,

            person.y +

            TREE.NODE_HEIGHT

        );

    });

    canvas.style.width =

        `${

            maxX +

            TREE.HORIZONTAL_GAP

        }px`;

    canvas.style.height =

        `${

            maxY +

            TREE.VERTICAL_GAP

        }px`;

    svgLayer.setAttribute(

        "width",

        maxX +

        TREE.HORIZONTAL_GAP

    );

    svgLayer.setAttribute(

        "height",

        maxY +

        TREE.VERTICAL_GAP

    );

}
/* ==========================================================
   ZOOM
========================================================== */

export function zoomIn() {

    setZoom(

        zoom +

        TREE.ZOOM_STEP

    );

}

export function zoomOut() {

    setZoom(

        zoom -

        TREE.ZOOM_STEP

    );

}

export function resetZoom() {

    zoom = 1;

    panX = TREE.ROOT_OFFSET_X;

    panY = TREE.ROOT_OFFSET_Y;

    updateTransform();

}

function setZoom(value) {

    zoom = Math.min(

        TREE.MAX_ZOOM,

        Math.max(

            TREE.MIN_ZOOM,

            value

        )

    );

    updateTransform();

}

/* ==========================================================
   CENTER
========================================================== */

export function centerTree() {

    if (

        !treeArea ||

        !canvas

    ) {

        return;

    }

    const viewWidth =

        treeArea.clientWidth;

    const viewHeight =

        treeArea.clientHeight;

    const treeWidth =

        canvas.offsetWidth * zoom;

    const treeHeight =

        canvas.offsetHeight * zoom;

    panX =

        Math.max(

            20,

            (viewWidth - treeWidth) / 2

        );

    panY =

        Math.max(

            20,

            (viewHeight - treeHeight) / 2

        );

    updateTransform();

}

/* ==========================================================
   FIT
========================================================== */

export function fitTree() {

    if (

        !treeArea ||

        !canvas

    ) {

        return;

    }

    const scaleX =

        treeArea.clientWidth /

        canvas.offsetWidth;

    const scaleY =

        treeArea.clientHeight /

        canvas.offsetHeight;

    zoom = Math.min(

        TREE.MAX_ZOOM,

        Math.max(

            TREE.MIN_ZOOM,

            Math.min(

                scaleX,

                scaleY

            ) * 0.9

        )

    );

    centerTree();

}

/* ==========================================================
   TRANSFORM
========================================================== */

function updateTransform() {

    if (

        frameRequest !== null

    ) {

        cancelAnimationFrame(

            frameRequest

        );

    }

    frameRequest =

        requestAnimationFrame(() => {

            canvas.style.transform =

                `translate(${panX}px, ${panY}px) scale(${zoom})`;

            frameRequest = null;

        });

}
/* ==========================================================
   POINTER EVENTS
========================================================== */

function bindPointerEvents() {

    treeArea.addEventListener(

        "mousedown",

        onPointerDown

    );

    window.addEventListener(

        "mousemove",

        onPointerMove

    );

    window.addEventListener(

        "mouseup",

        onPointerUp

    );

    treeArea.addEventListener(

        "mouseleave",

        onPointerUp

    );

}

/* ==========================================================
   WHEEL
========================================================== */

function bindWheelEvent() {

    treeArea.addEventListener(

        "wheel",

        onWheel,

        {

            passive: false

        }

    );

}

/* ==========================================================
   POINTER DOWN
========================================================== */

function onPointerDown(event) {

    if (

        event.button !== 0

    ) {

        return;

    }

    dragging = true;

    dragStartX = event.clientX;

    dragStartY = event.clientY;

    startPanX = panX;

    startPanY = panY;

    treeArea.classList.add(

        "dragging"

    );

}

/* ==========================================================
   POINTER MOVE
========================================================== */

function onPointerMove(event) {

    if (!dragging)

        return;

    panX =

        startPanX +

        (

            event.clientX -

            dragStartX

        );

    panY =

        startPanY +

        (

            event.clientY -

            dragStartY

        );

    updateTransform();

}

/* ==========================================================
   POINTER UP
========================================================== */

function onPointerUp() {

    dragging = false;

    treeArea.classList.remove(

        "dragging"

    );

}

/* ==========================================================
   WHEEL ZOOM
========================================================== */

function onWheel(event) {

    event.preventDefault();

    const direction =

        event.deltaY > 0

            ? -1

            : 1;

    setZoom(

        zoom +

        direction *

        TREE.ZOOM_STEP

    );

}
/* ==========================================================
   RESIZE
========================================================== */

function onResize() {

    renderTree();

}

/* ==========================================================
   DESTROY
========================================================== */

export function destroyTree() {

    if (!treeArea)

        return;

    treeArea.removeEventListener(

        "mousedown",

        onPointerDown

    );

    treeArea.removeEventListener(

        "mouseleave",

        onPointerUp

    );

    treeArea.removeEventListener(

        "wheel",

        onWheel

    );

    window.removeEventListener(

        "mousemove",

        onPointerMove

    );

    window.removeEventListener(

        "mouseup",

        onPointerUp

    );

    window.removeEventListener(

        "resize",

        onResize

    );

    clearCanvas();

    treeArea = null;

    canvas = null;

    nodesLayer = null;

    svgLayer = null;

}

/* ==========================================================
   INIT EVENTS
========================================================== */

window.addEventListener(

    "resize",

    onResize

);

/* ==========================================================
   PUBLIC STATE
========================================================== */

export function getViewport() {

    return {

        zoom,

        panX,

        panY

    };

}

export function setViewport(viewport = {}) {

    zoom =

        Number(viewport.zoom) ||

        zoom;

    panX =

        Number(viewport.panX) ||

        panX;

    panY =

        Number(viewport.panY) ||

        panY;

    updateTransform();

}

/* ==========================================================
   DEBUG
========================================================== */

window.TreeCanvas = {

    render: renderTree,

    center: centerTree,

    fit: fitTree,

    zoomIn,

    zoomOut,

    resetZoom,

    viewport: getViewport

};
