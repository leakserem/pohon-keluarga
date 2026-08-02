/**
 * ==========================================================
 * Family Tree v2
 * connector.js
 * SVG Relationship Connector
 * ==========================================================
 */

import {

    TREE,
    SVG

} from "../utils/constants.js";

/* ==========================================================
   PUBLIC
========================================================== */

export function drawConnections(svg, tree) {

    if (!svg)

        return;

    svg.replaceChildren();

    tree.forEach(root => {

        walk(root, svg);

    });

}

/* ==========================================================
   WALK
========================================================== */

function walk(node, svg) {

    drawSpouse(node, svg);

    drawChildren(node, svg);

    node.children.forEach(child => {

        walk(child, svg);

    });

}

/* ==========================================================
   SPOUSE
========================================================== */

function drawSpouse(node, svg) {

    if (!node.spouse)

        return;

    const x1 =

        node.x +

        TREE.NODE_WIDTH;

    const y =

        node.y +

        TREE.NODE_HEIGHT / 2;

    const x2 =

        x1 +

        TREE.SPOUSE_GAP;

    appendLine(

        svg,

        x1,

        y,

        x2,

        y

    );

}

/* ==========================================================
   CHILDREN
========================================================== */

function drawChildren(node, svg) {

    if (!node.children.length)

        return;

    const parentX =

        node.x +

        TREE.NODE_WIDTH / 2;

    const parentY =

        node.y +

        TREE.NODE_HEIGHT;

    node.children.forEach(child => {

        const childX =

            child.x +

            TREE.NODE_WIDTH / 2;

        const childY =

            child.y;

        appendCurve(

            svg,

            parentX,

            parentY,

            childX,

            childY

        );

    });

}

/* ==========================================================
   LINE
========================================================== */

function appendLine(

    svg,

    x1,

    y1,

    x2,

    y2

) {

    const line =

        document.createElementNS(

            SVG.NAMESPACE,

            "line"

        );

    line.setAttribute(

        "x1",

        x1

    );

    line.setAttribute(

        "y1",

        y1

    );

    line.setAttribute(

        "x2",

        x2

    );

    line.setAttribute(

        "y2",

        y2

    );

    line.setAttribute(

        "stroke",

        SVG.LINE_COLOR

    );

    line.setAttribute(

        "stroke-width",

        SVG.LINE_WIDTH

    );

    line.setAttribute(

        "fill",

        "none"

    );

    svg.appendChild(line);

}

/* ==========================================================
   CURVE
========================================================== */

function appendCurve(

    svg,

    x1,

    y1,

    x2,

    y2

) {

    const path =

        document.createElementNS(

            SVG.NAMESPACE,

            "path"

        );

    const middle =

        (y1 + y2) / 2;

    path.setAttribute(

        "d",

        `M ${x1} ${y1}
         C ${x1} ${middle}
           ${x2} ${middle}
           ${x2} ${y2}`

    );

    path.setAttribute(

        "stroke",

        SVG.LINE_COLOR

    );

    path.setAttribute(

        "stroke-width",

        SVG.LINE_WIDTH

    );

    path.setAttribute(

        "fill",

        "none"

    );

    path.classList.add(

        "tree-line"

    );

    svg.appendChild(path);

}
