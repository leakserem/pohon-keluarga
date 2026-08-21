/**
 * Family Tree v2.4 - Relationship connectors
 */

import { TREE, SVG } from "../utils/constants.js";

const STROKE_WIDTH = Math.max(4, Number(SVG.LINE_WIDTH) || 4);
const STROKE_OPACITY = "0.95";

export function drawConnections(svg, tree) {
    if (!svg) return;
    svg.replaceChildren();
    svg.setAttribute("fill", "none");

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
    if (!node?.children?.length) return;

    const left = node.person.x;
    const right = node.spouse
        ? node.spouse.x + TREE.NODE_WIDTH
        : node.person.x + TREE.NODE_WIDTH;

    const parentX = (left + right) / 2;
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
    line.setAttribute("stroke-width", STROKE_WIDTH);
    line.setAttribute("stroke-linecap", "round");
    line.setAttribute("opacity", STROKE_OPACITY);
    line.setAttribute("fill", "none");
    svg.appendChild(line);
}

function appendCurve(svg, x1, y1, x2, y2) {
    const path = document.createElementNS(SVG.NAMESPACE, "path");
    const middle = (y1 + y2) / 2;
    path.setAttribute("d", `M ${x1} ${y1} C ${x1} ${middle} ${x2} ${middle} ${x2} ${y2}`);
    path.setAttribute("stroke", SVG.LINE_COLOR);
    path.setAttribute("stroke-width", STROKE_WIDTH);
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    path.setAttribute("opacity", STROKE_OPACITY);
    path.setAttribute("fill", "none");
    path.classList.add("tree-line");
    svg.appendChild(path);
}
