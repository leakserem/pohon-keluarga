/**
 * Family Tree v2 - Relationship connectors
 */

import { TREE, SVG } from "../utils/constants.js";

export function drawConnections(svg, tree) {
    if (!svg) return;
    svg.replaceChildren();

    tree.forEach(root => walk(root, svg));
}

function walk(node, svg) {
    drawSpouse(node, svg);
    drawChildren(node, svg);
    node.children.forEach(child => walk(child, svg));
}

function drawSpouse(node, svg) {
    if (!node?.spouse) return;

    const x1 = node.person.x + TREE.NODE_WIDTH;
    const x2 = node.spouse.x;
    const y = node.person.y + TREE.NODE_HEIGHT / 2;

    appendLine(svg, x1, y, x2, y);
}

function drawChildren(node, svg) {
    if (!node.children.length) return;

    const parentStart = node.person.x;
    const parentEnd = node.spouse
        ? node.spouse.x + TREE.NODE_WIDTH
        : node.person.x + TREE.NODE_WIDTH;
    const parentX = (parentStart + parentEnd) / 2;
    const parentY = node.person.y + TREE.NODE_HEIGHT;

    for (const child of node.children) {
        const childCenter = child.person.x + TREE.NODE_WIDTH / 2;
        const childY = child.person.y;
        appendCurve(svg, parentX, parentY, childCenter, childY);
    }
}

function appendLine(svg, x1, y1, x2, y2) {
    const line = document.createElementNS(SVG.NAMESPACE, "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", SVG.LINE_COLOR);
    line.setAttribute("stroke-width", SVG.LINE_WIDTH);
    line.setAttribute("fill", "none");
    svg.appendChild(line);
}

function appendCurve(svg, x1, y1, x2, y2) {
    const path = document.createElementNS(SVG.NAMESPACE, "path");
    const middle = (y1 + y2) / 2;
    path.setAttribute("d", `M ${x1} ${y1} C ${x1} ${middle} ${x2} ${middle} ${x2} ${y2}`);
    path.setAttribute("stroke", SVG.LINE_COLOR);
    path.setAttribute("stroke-width", SVG.LINE_WIDTH);
    path.setAttribute("fill", "none");
    path.classList.add("tree-line");
    svg.appendChild(path);
}
