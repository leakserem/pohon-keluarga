/**
 * ==========================================================
 * Family Tree v2
 * autoLayout.js
 * Automatic Tree Layout
 * ==========================================================
 */

import { buildTree } from "./treeBuilder.js";

import {

    TREE

} from "../utils/constants.js";

/* ==========================================================
   PUBLIC
========================================================== */

export function buildFamilyLayout() {

    const tree = buildTree();

    let startX = TREE.ROOT_OFFSET_X;

    tree.forEach(root => {

        layout(root, startX, TREE.ROOT_OFFSET_Y);

        startX += root.width + TREE.HORIZONTAL_GAP;

    });

    return tree;

}

/* ==========================================================
   LAYOUT
========================================================== */

function layout(node, x, y) {

    node.y = y;

    if (node.children.length === 0) {

        node.width = TREE.NODE_WIDTH;

        node.height = TREE.NODE_HEIGHT;

        node.x = x;

        return;

    }

    let childX = x;

    node.children.forEach(child => {

        layout(

            child,

            childX,

            y +

            TREE.VERTICAL_GAP

        );

        childX +=

            child.width +

            TREE.HORIZONTAL_GAP;

    });

    node.width = Math.max(

        TREE.NODE_WIDTH,

        childX -

        x -

        TREE.HORIZONTAL_GAP

    );

    node.height =

        TREE.NODE_HEIGHT +

        TREE.VERTICAL_GAP;

    node.x =

        x +

        (

            node.width -

            TREE.NODE_WIDTH

        ) / 2;

}

/* ==========================================================
   FLATTEN
========================================================== */

export function flattenLayout(tree) {

    const result = [];

    tree.forEach(root =>

        walk(root)

    );

    return result;

    function walk(node) {

        result.push({

            ...node.person,

            spouse: node.spouse,

            x: node.x,

            y: node.y

        });

        node.children.forEach(walk);

    }

}

/* ==========================================================
   SIZE
========================================================== */

export function getLayoutSize(tree) {

    let width = 0;

    let height = 0;

    tree.forEach(root => {

        walk(root);

    });

    return {

        width,

        height

    };

    function walk(node) {

        width = Math.max(

            width,

            node.x +

            TREE.NODE_WIDTH

        );

        height = Math.max(

            height,

            node.y +

            TREE.NODE_HEIGHT

        );

        node.children.forEach(walk);

    }

}
