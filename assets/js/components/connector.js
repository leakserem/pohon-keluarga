/**
 * Family Tree v2.5 - Relationship connectors
 */

import { TREE, SVG } from "../utils/constants.js";

const STROKE_WIDTH = Math.max(5, Number(SVG.LINE_WIDTH) || 5);
const STROKE_OPACITY = "0.95";

export function drawConnections(svg, tree) {
    if (!svg) return;
    svg.replaceChildren();
    svg.setAttribute("fill", "none");
    for (const root of tree) walk(root, svg);
}

function walk(node, svg) {
    drawSpouse(node, svg);
    drawChildren(node, svg);
    for (const child of node.children || []) walk(child, svg);
}

function drawSpouse(node, svg) {
    if (!node?.spouse) return;
    const x1 = node.person.x + TREE.NODE_WIDTH;
    const x2 = node.spouse.x;
    const y = node.person.y + TREE.NODE_HEIGHT / 2;
    appendLine(svg, x1, y, x2, y);
}

function drawChildren(node, svg) {
    if (!node?.children?.length) return;

    const left = node.person.x;
    const right = node.spouse
        ? node.spouse.x + TREE.NODE_WIDTH
        : node.person.x + TREE.NODE_WIDTH;

    const parentX = (left + right) / 2;
    const parentY = node.person.y + TREE.NODE_HEIGHT;

    for (const child of node.children) {
        const childCenter = child.person.x + TREE.NODE_WIDTH / 2;
        appendCurve(svg, parentX, parentY, childCenter, child.person.y);
    }
}

function styleShape(shape) {
    shape.setAttribute("stroke", SVG.LINE_COLOR);
    shape.setAttribute("stroke-width", String(STROKE_WIDTH));
    shape.setAttribute("stroke-linecap", "round");
    shape.setAttribute("stroke-linejoin", "round");
    shape.setAttribute("opacity", STROKE_OPACITY);
    shape.setAttribute("fill", "none");
    shape.setAttribute("vector-effect", "non-scaling-stroke");
    shape.classList.add("tree-line");
}

function appendLine(svg, x1, y1, x2, y2) {
    const line = document.createElementNS(SVG.NAMESPACE, "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    styleShape(line);
    svg.appendChild(line);
}

function appendCurve(svg, x1, y1, x2, y2) {
    const path = document.createElementNS(SVG.NAMESPACE, "path");
    const middle = (y1 + y2) / 2;
    path.setAttribute("d", `M ${x1} ${y1} C ${x1} ${middle} ${x2} ${middle} ${x2} ${y2}`);
    styleShape(path);
    svg.appendChild(path);
}
