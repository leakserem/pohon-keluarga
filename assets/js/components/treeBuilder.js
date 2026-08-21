/**
 * Family Tree v2 - Tree model with cycle protection
 */

import { getPeople } from "../store.js";
import { getChildren, getRootPeople, getSpouse } from "./relationship.js";

export function buildTree() {
    return getRootPeople().map(root => buildBranch(root, new Set()));
}

function buildBranch(person, ancestors) {
    const path = new Set(ancestors);
    path.add(person.id);

    const spouse = getSpouse(person.id);
    const children = [];

    for (const child of getChildren(person.id)) {
        if (path.has(child.id)) {
            console.warn("Family relationship cycle prevented:", person.id, "->", child.id);
            continue;
        }
        children.push(buildBranch(child, path));
    }

    // If both parents exist, only the parent branch selected by root traversal owns the child.
    // De-duplication is handled later by layout/visited IDs.
    return { person, spouse, children };
}

export function flattenTree(tree) {
    const result = [];
    const visited = new Set();

    function walk(node) {
        if (!node?.person?.id || visited.has(node.person.id)) return;
        visited.add(node.person.id);
        result.push(node);

        if (node.spouse?.id && !visited.has(node.spouse.id)) {
            visited.add(node.spouse.id);
        }

        node.children.forEach(walk);
    }

    tree.forEach(walk);
    return result;
}

export function findNode(tree, personId) {
    const target = String(personId ?? "");

    function search(node) {
        if (!node) return null;
        if (node.person.id === target || node.spouse?.id === target) return node;
        for (const child of node.children) {
            const found = search(child);
            if (found) return found;
        }
        return null;
    }

    for (const node of tree) {
        const found = search(node);
        if (found) return found;
    }
    return null;
}

export function countNodes(tree) {
    const ids = new Set();
    for (const node of flattenTree(tree)) {
        ids.add(node.person.id);
        if (node.spouse?.id) ids.add(node.spouse.id);
    }
    return ids.size;
}

export function getMaxGeneration() {
    const people = getPeople();
    if (!people.length) return 0;
    return Math.max(...people.map(person => Number(person.generation) || 1));
}
