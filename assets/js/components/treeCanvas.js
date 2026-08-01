/**
 * ==========================================================
 * Family Tree v2
 * treeCanvas.js
 * Version 2.0
 * ==========================================================
 */

import { Store, getFilteredPeople } from "../store.js";
import { createTreeNode } from "./treeNode.js";

const SVG_NS = "http://www.w3.org/2000/svg";

const canvas = document.querySelector("#treeCanvas");
const svg = document.querySelector("#treeSvg");
const nodesLayer = document.querySelector("#treeNodes");

const NODE_WIDTH = 220;
const NODE_HEIGHT = 110;

const HORIZONTAL = 70;
const VERTICAL = 160;

let zoom = 1;
let panX = 40;
let panY = 40;

let dragging = false;
let dragStartX = 0;
let dragStartY = 0;

/* ==========================================================
   PUBLIC
========================================================== */

export function initializeTree() {

    if (!canvas || !svg || !nodesLayer)
        return;

    bindCanvasEvents();

    renderTree();

}

export function renderTree() {

    if (!canvas)
        return;

    clearCanvas();

    const people = getFilteredPeople();

    const layout = buildLayout(people);

    drawConnections(layout);

    drawNodes(layout);

    updateTransform();

}

/* ==========================================================
   CLEAR
========================================================== */

function clearCanvas() {

    if (svg)
        svg.innerHTML = "";

    if (nodesLayer)
        nodesLayer.innerHTML = "";

}

/* ==========================================================
   LAYOUT
========================================================== */

function buildLayout(people) {

    const generations = {};

    people.forEach(person => {

        const g = Number(person.generation) || 0;

        if (!generations[g])
            generations[g] = [];

        generations[g].push(person);

    });

    const layout = [];

    Object.keys(generations)
        .sort((a, b) => a - b)
        .forEach((generation, row) => {

            generations[generation].forEach((person, column) => {

                layout.push({

                    ...person,

                    x: column * (NODE_WIDTH + HORIZONTAL),

                    y: row * VERTICAL

                });

            });

        });

    return layout;

}

/* ==========================================================
   DRAW NODES
========================================================== */

function drawNodes(layout) {

    layout.forEach(person => {

        const node = createTreeNode(person);

        nodesLayer.appendChild(node);

    });

}

/* ==========================================================
   DRAW CONNECTIONS
========================================================== */

function drawConnections(layout) {

    layout.forEach(child => {

        if (!child.parentIds)
            return;

        child.parentIds
            .split(",")
            .map(id => id.trim())
            .forEach(parentId => {

                const parent = layout.find(

                    person => person.id === parentId

                );

                if (!parent)
                    return;

                createCurve(

                    parent.x + NODE_WIDTH / 2,

                    parent.y + NODE_HEIGHT,

                    child.x + NODE_WIDTH / 2,

                    child.y

                );

            });

    });

}

/* ==========================================================
   SVG CURVE
========================================================== */

function createCurve(x1, y1, x2, y2) {

    if (!svg)
        return;

    const path = document.createElementNS(

        SVG_NS,

        "path"

    );

    const middle = (y1 + y2) / 2;

    path.setAttribute(

        "d",

        `M ${x1} ${y1}
         C ${x1} ${middle}
           ${x2} ${middle}
           ${x2} ${y2}`

    );

    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#8ca69c");
    path.setAttribute("stroke-width", "2");

    path.classList.add("tree-line");

    svg.appendChild(path);

}

/* ==========================================================
   TRANSFORM
========================================================== */

function updateTransform() {

    const transform =

        `translate(${panX}px,${panY}px) scale(${zoom})`;

    if (svg)
        svg.style.transform = transform;

    if (nodesLayer)
        nodesLayer.style.transform = transform;

}

/* ==========================================================
   ZOOM
========================================================== */

export function zoomIn() {

    zoom = Math.min(2.5, zoom + 0.1);

    updateTransform();

}

export function zoomOut() {

    zoom = Math.max(0.3, zoom - 0.1);

    updateTransform();

}

export function resetZoom() {

    zoom = 1;

    panX = 40;

    panY = 40;

    updateTransform();

}

/* ==========================================================
   CENTER
========================================================== */

export function centerTree() {

    panX = 40;

    panY = 40;

    updateTransform();

}

/* ==========================================================
   FIT
========================================================== */

export function fitTree() {

    zoom = 1;

    panX = 40;

    panY = 40;

    updateTransform();

}

/* ==========================================================
   PAN
========================================================== */

function bindCanvasEvents() {

    canvas.addEventListener("mousedown", event => {

        dragging = true;

        dragStartX = event.clientX - panX;

        dragStartY = event.clientY - panY;

        canvas.style.cursor = "grabbing";

    });

    window.addEventListener("mouseup", () => {

        dragging = false;

        canvas.style.cursor = "grab";

    });

    window.addEventListener("mousemove", event => {

        if (!dragging)
            return;

        panX = event.clientX - dragStartX;

        panY = event.clientY - dragStartY;

        updateTransform();

    });

    canvas.addEventListener(

        "wheel",

        event => {

            event.preventDefault();

            if (event.deltaY < 0)

                zoomIn();

            else

                zoomOut();

        },

        { passive: false }

    );

}

/* ==========================================================
   STORE
========================================================== */

Store.subscribe(() => {

    renderTree();

});
