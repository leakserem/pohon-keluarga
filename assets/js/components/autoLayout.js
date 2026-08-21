/**
 * Family Tree v2 - Couple-aware automatic layout
 */

import { buildTree } from "./treeBuilder.js";
import { TREE } from "../utils/constants.js";

export function buildFamilyLayout() {
    const tree = buildTree();
    let startX = TREE.ROOT_OFFSET_X;

    for (const root of tree) {
        layout(root, startX, TREE.ROOT_OFFSET_Y);
        startX += root.width + TREE.HORIZONTAL_GAP;
    }

    return tree;
}

function coupleWidth(node) {
    return node.spouse
        ? TREE.NODE_WIDTH * 2 + TREE.SPOUSE_GAP
        : TREE.NODE_WIDTH;
}

function layout(node, x, y) {
    const ownWidth = coupleWidth(node);
    node.y = y;

    if (node.children.length === 0) {
        node.width = ownWidth;
        node.height = TREE.NODE_HEIGHT;
        node.x = x;
        node.person.x = x;
        node.person.y = y;
        if (node.spouse) {
            node.spouse.x = x + TREE.NODE_WIDTH + TREE.SPOUSE_GAP;
            node.spouse.y = y;
        }
        return;
    }

    let childX = x;
    for (const child of node.children) {
        layout(child, childX, y + TREE.NODE_HEIGHT + TREE.VERTICAL_GAP);
        childX += child.width + TREE.HORIZONTAL_GAP;
    }

    const childrenWidth = Math.max(
        TREE.NODE_WIDTH,
        childX - x - TREE.HORIZONTAL_GAP
    );

    node.width = Math.max(ownWidth, childrenWidth);
    node.height = TREE.NODE_HEIGHT + TREE.VERTICAL_GAP +
        Math.max(...node.children.map(child => child.height), TREE.NODE_HEIGHT);

    const ownStart = x + Math.max(0, (node.width - ownWidth) / 2);
    const childrenStart = x + Math.max(0, (node.width - childrenWidth) / 2);

    node.x = x;
    node.person.x = ownStart;
    node.person.y = y;

    if (node.spouse) {
        node.spouse.x = ownStart + TREE.NODE_WIDTH + TREE.SPOUSE_GAP;
        node.spouse.y = y;
    }

    // Shift child subtree as a group toward the center of this couple.
    if (childrenStart !== x) {
        const delta = childrenStart - x;
        for (const child of node.children) shiftTree(child, delta);
    }
}

function shiftTree(node, delta) {
    node.x += delta;
    node.person.x += delta;
    if (node.spouse) node.spouse.x += delta;
    for (const child of node.children) shiftTree(child, delta);
}

export function flattenLayout(tree) {
    const result = [];
    const seen = new Set();

    function pushPerson(person, metadata = {}) {
        if (!person?.id || seen.has(person.id)) return;
        seen.add(person.id);
        result.push({
            ...person,
            ...metadata
        });
    }

    function walk(node) {
        pushPerson(node.person, {
            x: node.person.x,
            y: node.person.y,
            role: "primary",
            spouseId: node.spouse?.id ?? ""
        });

        if (node.spouse) {
            pushPerson(node.spouse, {
                x: node.spouse.x,
                y: node.spouse.y,
                role: "spouse",
                spouseId: node.person.id
            });
        }

        node.children.forEach(walk);
    }

    tree.forEach(walk);
    return result;
}

export function getLayoutSize(tree) {
    let width = 0;
    let height = 0;

    function walk(node) {
        width = Math.max(width, node.x + node.width);
        height = Math.max(height, node.y + node.height);
        node.children.forEach(walk);
    }

    tree.forEach(walk);
    return { width, height };
}
