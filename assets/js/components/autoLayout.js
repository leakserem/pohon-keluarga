/**
 * ==========================================================
 * Family Tree v2
 * autoLayout.js
 * FamilyEcho Layout Engine
 * ==========================================================
 */

const NODE_WIDTH = 220;
const NODE_HEIGHT = 110;

const HORIZONTAL_SPACE = 60;
const VERTICAL_SPACE = 180;

export function buildFamilyLayout(people) {

    const map = new Map();

    people.forEach(person => {

        map.set(person.id, {

            ...person,

            x: 0,

            y: 0,

            children: [],

            spouse: null

        });

    });

    /* ==========================================
       BUILD RELATIONSHIP
    ========================================== */

    map.forEach(person => {

        if (
            person.fatherId &&
            map.has(person.fatherId)
        ) {

            map
                .get(person.fatherId)
                .children
                .push(person);

        }

        if (
            person.motherId &&
            map.has(person.motherId)
        ) {

            map
                .get(person.motherId)
                .children
                .push(person);

        }

        if (
            person.spouseId &&
            map.has(person.spouseId)
        ) {

            person.spouse =
                map.get(person.spouseId);

        }

    });

    /* ==========================================
       ROOT
    ========================================== */

    const roots = [];

    map.forEach(person => {

        if (
            !person.fatherId &&
            !person.motherId
        ) {

            roots.push(person);

        }

    });

    let cursorX = 0;

    roots.forEach(root => {

        layoutTree(

            root,

            0,

            () => cursorX,

            value => cursorX = value

        );

        cursorX += NODE_WIDTH * 2;

    });

    return [...map.values()];

}

/* ==========================================================
   RECURSIVE
========================================================== */

function layoutTree(

    person,

    level,

    getCursor,

    setCursor

) {

    person.y =

        level *

        (NODE_HEIGHT + VERTICAL_SPACE);

    /* ======================================
       LEAF
    ====================================== */

    if (
        person.children.length === 0
    ) {

        person.x = getCursor();

        setCursor(

            person.x +

            NODE_WIDTH +

            HORIZONTAL_SPACE

        );

    }

    /* ======================================
       CHILDREN
    ====================================== */

    else {

        person.children.forEach(child => {

            layoutTree(

                child,

                level + 1,

                getCursor,

                setCursor

            );

        });

        const first =
            person.children[0];

        const last =
            person.children[
                person.children.length - 1
            ];

        person.x =

            (first.x + last.x) / 2;

    }

    /* ======================================
       SPOUSE
    ====================================== */

    if (person.spouse) {

        person.spouse.y = person.y;

        person.spouse.x =

            person.x +

            NODE_WIDTH +

            30;

    }

}
