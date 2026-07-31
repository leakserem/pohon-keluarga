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

    bindCanvasEvents();

    renderTree();

}

export function renderTree() {

    if (!canvas) return;

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

    svg.innerHTML = "";

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
   CONNECTIONS
========================================================== */

function drawConnections(layout) {

    layout.forEach(child => {

        if (!child.parentIds) return;

        child.parentIds
            .split(",")
            .map(id => id.trim())
            .forEach(parentId => {

                const parent = layout.find(
                    person => person.id === parentId
                );

                if (!parent) return;

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

    const curve = document.createElementNS(
        SVG_NS,
        "path"
    );

    const middle = (y1 + y2) / 2;

    curve.setAttribute(
        "d",
        `
M ${x1} ${y1}
C
${x1} ${middle}
${x2} ${middle}
${x2} ${y2}
`
    );

    curve.setAttribute("fill", "none");

    curve.setAttribute("stroke", "#9db4a3");

    curve.setAttribute("stroke-width", "2");

    curve.classList.add("tree-line");

    svg.appendChild(curve);

}

/* ==========================================================
   TRANSFORM
========================================================== */

function updateTransform() {

    const value =
        `translate(${panX}px,${panY}px) scale(${zoom})`;

    nodesLayer.style.transform = value;

    svg.style.transform = value;

}

/* ==========================================================
   ZOOM
========================================================== */

export function zoomIn() {

    zoom += 0.1;

    if (zoom > 2.5)
        zoom = 2.5;

    updateTransform();

}

export function zoomOut() {

    zoom -= 0.1;

    if (zoom < 0.3)
        zoom = 0.3;

    updateTransform();

}

export function resetZoom() {

    zoom = 1;

    panX = 40;

    panY = 40;

    updateTransform();

}

/* ==========================================================
   PAN
========================================================== */

function bindCanvasEvents() {

    canvas.addEventListener("mousedown", e => {

        dragging = true;

        dragStartX = e.clientX - panX;

        dragStartY = e.clientY - panY;

        canvas.style.cursor = "grabbing";

    });

    window.addEventListener("mouseup", () => {

        dragging = false;

        canvas.style.cursor = "grab";

    });

    window.addEventListener("mousemove", e => {

        if (!dragging) return;

        panX = e.clientX - dragStartX;

        panY = e.clientY - dragStartY;

        updateTransform();

    });

    canvas.addEventListener("wheel", e => {

        e.preventDefault();

        if (e.deltaY < 0)
            zoomIn();
        else
            zoomOut();

    }, { passive: false });

}

/* ==========================================================
   STORE
========================================================== */

Store.subscribe(() => {

    renderTree();

});
