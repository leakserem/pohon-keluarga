/**
 * ==========================================================
 * Family Tree v2
 * treeBuilder.js
 * Build Family Tree Structure
 * ==========================================================
 */

import {

    getPeople

} from "../store.js";

import {

    getChildren,

    getRootPeople,

    getSpouse

} from "./relationship.js";

/* ==========================================================
   BUILD
========================================================== */

export function buildTree() {

    const roots = getRootPeople();

    return roots.map(buildBranch);

}

/* ==========================================================
   BRANCH
========================================================== */

function buildBranch(person) {

    const spouse = getSpouse(person.id);

    const children =

        getChildren(person.id)

            .map(buildBranch);

    return {

        person,

        spouse,

        children

    };

}

/* ==========================================================
   FLATTEN
========================================================== */

export function flattenTree(tree) {

    const result = [];

    tree.forEach(node => {

        walk(node, result);

    });

    return result;

}

function walk(node, result) {

    result.push(node);

    node.children.forEach(child => {

        walk(child, result);

    });

}

/* ==========================================================
   FIND
========================================================== */

export function findNode(tree, personId) {

    for (const node of tree) {

        const found = search(node, personId);

        if (found)

            return found;

    }

    return null;

}

function search(node, personId) {

    if (node.person.id === personId)

        return node;

    for (const child of node.children) {

        const found = search(child, personId);

        if (found)

            return found;

    }

    return null;

}

/* ==========================================================
   COUNT
========================================================== */

export function countNodes(tree) {

    return flattenTree(tree).length;

}

/* ==========================================================
   GENERATIONS
========================================================== */

export function getMaxGeneration() {

    const people = getPeople();

    if (!people.length)

        return 0;

    return Math.max(

        ...people.map(person =>

            Number(person.generation) || 1

        )

    );

}
