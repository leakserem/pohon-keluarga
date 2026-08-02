/**
 * ==========================================================
 * Family Tree v2
 * connector.js
 * ==========================================================
 */

const SVG_NS = "http://www.w3.org/2000/svg";

const NODE_WIDTH = 220;
const NODE_HEIGHT = 110;

/* ==========================================================
   PUBLIC
========================================================== */

export function drawConnections(svg, people) {

    svg.innerHTML = "";

    const map = new Map();

    people.forEach(person => {

        map.set(person.id, person);

    });

    const drawnSpouses = new Set();

    people.forEach(person => {

        /* -------------------------
           SPOUSE
        ------------------------- */

        if (
            person.spouseId &&
            map.has(person.spouseId)
        ) {

            const spouse = map.get(person.spouseId);

            const key =
                [person.id, spouse.id]
                    .sort()
                    .join("-");

            if (!drawnSpouses.has(key)) {

                drawMarriageLine(

                    svg,

                    person,

                    spouse

                );

                drawnSpouses.add(key);

            }

        }

        /* -------------------------
           FATHER
        ------------------------- */

        if (
            person.fatherId &&
            map.has(person.fatherId)
        ) {

            drawParentLine(

                svg,

                map.get(person.fatherId),

                person

            );

        }

        /* -------------------------
           MOTHER
        ------------------------- */

        if (
            person.motherId &&
            map.has(person.motherId)
        ) {

            drawParentLine(

                svg,

                map.get(person.motherId),

                person

            );

        }

    });

}

/* ==========================================================
   MARRIAGE
========================================================== */

function drawMarriageLine(
    svg,
    a,
    b
) {

    const line = createLine(

        a.x + NODE_WIDTH,

        a.y + NODE_HEIGHT / 2,

        b.x,

        b.y + NODE_HEIGHT / 2

    );

    line.classList.add(

        "tree-marriage"

    );

    svg.appendChild(line);

}

/* ==========================================================
   PARENT
========================================================== */

function drawParentLine(
    svg,
    parent,
    child
) {

    const x1 =
        parent.x + NODE_WIDTH / 2;

    const y1 =
        parent.y + NODE_HEIGHT;

    const x2 =
        child.x + NODE_WIDTH / 2;

    const y2 =
        child.y;

    const middle =
        (y1 + y2) / 2;

    const path =
        document.createElementNS(
            SVG_NS,
            "path"
        );

    path.setAttribute(

        "d",

        `M ${x1} ${y1}
         L ${x1} ${middle}
         L ${x2} ${middle}
         L ${x2} ${y2}`

    );

    path.classList.add(

        "tree-parent"

    );

    svg.appendChild(path);

}

/* ==========================================================
   LINE
========================================================== */

function createLine(
    x1,
    y1,
    x2,
    y2
) {

    const line =
        document.createElementNS(
            SVG_NS,
            "line"
        );

    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);

    return line;

}
