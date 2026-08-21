/**
 * Family Tree v2 - Canvas renderer
 */

import { subscribe, unsubscribe } from "../store.js";
import { buildFamilyLayout, flattenLayout } from "./autoLayout.js";
import { drawConnections } from "./connector.js";
import { createTreeNode } from "./treeNode.js";
import { TREE } from "../utils/constants.js";
import { toggleCollapsed } from "./treeCollapse.js";

let treeArea = null;
let canvas = null;
let nodesLayer = null;
let svgLayer = null;
let zoom = TREE.DEFAULT_ZOOM;
let panX = TREE.ROOT_OFFSET_X;
let panY = TREE.ROOT_OFFSET_Y;
let dragging = false;
let dragStartX = 0;
let dragStartY = 0;
let startPanX = 0;
let startPanY = 0;
let frameRequest = null;
let initialized = false;

export function initializeTreeCanvas() {
    if (initialized) return;

    treeArea = document.querySelector("#treeArea");
    canvas = document.querySelector("#treeCanvas");
    nodesLayer = document.querySelector("#treeNodes");
    svgLayer = document.querySelector("#treeSvg");

    if (!treeArea || !canvas || !nodesLayer || !svgLayer) {
        console.error("Tree Canvas elements not found.");
        return;
    }

    initialized = true;
    subscribe(renderTree);
    document.addEventListener("tree:toggle-descendants", onToggleDescendants);
    bindPointerEvents();
    bindWheelEvent();
    window.addEventListener("resize", onResize);
    updateTransform();
}

function clearCanvas() {
    nodesLayer?.replaceChildren();
    svgLayer?.replaceChildren();
}

export function renderTree() {
    if (!initialized || !nodesLayer || !svgLayer) return;

    clearCanvas();
    const tree = buildFamilyLayout();
    const layout = flattenLayout(tree);

    drawConnections(svgLayer, tree);
    drawNodes(layout);
    updateCanvasSize(layout);

    if (!layout.length) {
        canvas.style.width = "0px";
        canvas.style.height = "0px";
        svgLayer.setAttribute("width", "0");
        svgLayer.setAttribute("height", "0");
    }

    updateTransform();
}

function drawNodes(layout) {
    const fragment = document.createDocumentFragment();
    layout.forEach(person => fragment.appendChild(createTreeNode(person)));
    nodesLayer.appendChild(fragment);
}

function updateCanvasSize(layout) {
    if (!layout.length) return;

    let maxX = 0;
    let maxY = 0;

    for (const person of layout) {
        maxX = Math.max(maxX, person.x + TREE.NODE_WIDTH);
        maxY = Math.max(maxY, person.y + TREE.NODE_HEIGHT);
    }

    const width = maxX + TREE.HORIZONTAL_GAP;
    const height = maxY + TREE.VERTICAL_GAP;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    svgLayer.setAttribute("width", width);
    svgLayer.setAttribute("height", height);
}

export function zoomIn() {
    setZoom(zoom + TREE.ZOOM_STEP);
}

export function zoomOut() {
    setZoom(zoom - TREE.ZOOM_STEP);
}

export function resetZoom() {
    zoom = TREE.DEFAULT_ZOOM;
    panX = TREE.ROOT_OFFSET_X;
    panY = TREE.ROOT_OFFSET_Y;
    updateTransform();
}

function setZoom(value) {
    zoom = Math.min(TREE.MAX_ZOOM, Math.max(TREE.MIN_ZOOM, value));
    updateTransform();
}

export function centerTree() {
    if (!treeArea || !canvas || !canvas.offsetWidth || !canvas.offsetHeight) return;

    const viewWidth = treeArea.clientWidth;
    const viewHeight = treeArea.clientHeight;
    const treeWidth = canvas.offsetWidth * zoom;
    const treeHeight = canvas.offsetHeight * zoom;

    panX = Math.max(20, (viewWidth - treeWidth) / 2);
    panY = Math.max(20, (viewHeight - treeHeight) / 2);
    updateTransform();
}

export function fitTree() {
    if (!treeArea || !canvas || !canvas.offsetWidth || !canvas.offsetHeight) return;

    const scaleX = treeArea.clientWidth / canvas.offsetWidth;
    const scaleY = treeArea.clientHeight / canvas.offsetHeight;
    const scale = Math.min(scaleX, scaleY) * 0.9;

    if (!Number.isFinite(scale) || scale <= 0) return;

    zoom = Math.min(TREE.MAX_ZOOM, Math.max(TREE.MIN_ZOOM, scale));
    centerTree();
}

function updateTransform() {
    if (!canvas) return;
    if (frameRequest !== null) cancelAnimationFrame(frameRequest);

    frameRequest = requestAnimationFrame(() => {
        const transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
        canvas.style.transformOrigin = "0 0";
        canvas.style.transform = transform;
        svgLayer.style.transformOrigin = "0 0";
        svgLayer.style.transform = transform;
        frameRequest = null;
    });
}

function bindPointerEvents() {
    treeArea.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
    treeArea.addEventListener("mouseleave", onPointerUp);
}

function bindWheelEvent() {
    treeArea.addEventListener("wheel", onWheel, { passive: false });
}

function onPointerDown(event) {
    if (event.button !== 0) return;
    if (event.target.closest?.(".tree-node")) return;

    dragging = true;
    dragStartX = event.clientX;
    dragStartY = event.clientY;
    startPanX = panX;
    startPanY = panY;
    treeArea.classList.add("dragging");
}

function onPointerMove(event) {
    if (!dragging) return;
    panX = startPanX + event.clientX - dragStartX;
    panY = startPanY + event.clientY - dragStartY;
    updateTransform();
}

function onPointerUp() {
    dragging = false;
    treeArea?.classList.remove("dragging");
}

function onWheel(event) {
    event.preventDefault();
    setZoom(zoom + (event.deltaY > 0 ? -1 : 1) * TREE.ZOOM_STEP);
}

function onResize() {
    renderTree();
}

function onToggleDescendants(event) {
    const personId = event?.detail?.personId;
    if (!personId) return;

    // Toggle the collapse state and rebuild the geometry so the tree can shrink.
    toggleCollapsed(personId);
    renderTree();
}

export function destroyTree() {
    if (!initialized) return;

    unsubscribe(renderTree);
    treeArea.removeEventListener("mousedown", onPointerDown);
    treeArea.removeEventListener("mouseleave", onPointerUp);
    treeArea.removeEventListener("wheel", onWheel);
    window.removeEventListener("mousemove", onPointerMove);
    window.removeEventListener("mouseup", onPointerUp);
    window.removeEventListener("resize", onResize);
    document.removeEventListener("tree:toggle-descendants", onToggleDescendants);

    if (frameRequest !== null) cancelAnimationFrame(frameRequest);
    clearCanvas();

    treeArea = null;
    canvas = null;
    nodesLayer = null;
    svgLayer = null;
    initialized = false;
}

export function getViewport() {
    return { zoom, panX, panY };
}

export function setViewport(viewport = {}) {
    if (Number.isFinite(Number(viewport.zoom))) {
        zoom = Math.min(TREE.MAX_ZOOM, Math.max(TREE.MIN_ZOOM, Number(viewport.zoom)));
    }
    if (Number.isFinite(Number(viewport.panX))) panX = Number(viewport.panX);
    if (Number.isFinite(Number(viewport.panY))) panY = Number(viewport.panY);
    updateTransform();
}

window.TreeCanvas = {
    render: renderTree,
    center: centerTree,
    fit: fitTree,
    zoomIn,
    zoomOut,
    resetZoom,
    viewport: getViewport
};
