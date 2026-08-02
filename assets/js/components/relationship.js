/**
 * ==========================================================
 * Family Tree v2
 * relationship.js
 * ==========================================================
 */

import { getPeople } from "../../store.js";

let people = [];
let map = new Map();

/* ==========================================================
   INITIALIZE
========================================================== */

export function initializeRelationship() {

    refreshRelationship();

}

export function refreshRelationship() {

    people = getPeople();

    map = new Map();

    people.forEach(person => {

        map.set(person.id, person);

    });

}

/* ==========================================================
   BASIC
========================================================== */

export function getPerson(id) {

    return map.get(id) || null;

}

export function exists(id) {

    return map.has(id);

}

/* ==========================================================
   PARENTS
========================================================== */

export function getFather(person) {

    if (!person?.fatherId) return null;

    return getPerson(person.fatherId);

}

export function getMother(person) {

    if (!person?.motherId) return null;

    return getPerson(person.motherId);

}

export function getParents(person) {

    return [

        getFather(person),

        getMother(person)

    ].filter(Boolean);

}

/* ==========================================================
   SPOUSE
========================================================== */

export function getSpouse(person) {

    if (!person?.spouseId) return null;

    return getPerson(person.spouseId);

}

/* ==========================================================
   CHILDREN
========================================================== */

export function getChildren(person) {

    return people.filter(child =>

        child.fatherId === person.id ||

        child.motherId === person.id

    );

}

/* ==========================================================
   SIBLINGS
========================================================== */

export function getSiblings(person) {

    return people.filter(other => {

        if (other.id === person.id)

            return false;

        return (

            (person.fatherId &&
             other.fatherId === person.fatherId)

            ||

            (person.motherId &&
             other.motherId === person.motherId)

        );

    });

}

/* ==========================================================
   ANCESTORS
========================================================== */

export function getAncestors(person) {

    const result = [];

    function walk(member) {

        const father = getFather(member);

        const mother = getMother(member);

        if (father) {

            result.push(father);

            walk(father);

        }

        if (mother) {

            result.push(mother);

            walk(mother);

        }

    }

    walk(person);

    return result;

}

/* ==========================================================
   DESCENDANTS
========================================================== */

export function getDescendants(person) {

    const result = [];

    function walk(member) {

        const children = getChildren(member);

        children.forEach(child => {

            result.push(child);

            walk(child);

        });

    }

    walk(person);

    return result;

}

/* ==========================================================
   ROOTS
========================================================== */

export function getRoots() {

    return people.filter(person =>

        !person.fatherId &&

        !person.motherId

    );

}

/* ==========================================================
   GENERATION
========================================================== */

export function getGeneration(level) {

    return people.filter(person =>

        Number(person.generation) ===

        Number(level)

    );

}

/* ==========================================================
   COUNTS
========================================================== */

export function countChildren(person) {

    return getChildren(person).length;

}

export function countSiblings(person) {

    return getSiblings(person).length;

}

export function countDescendants(person) {

    return getDescendants(person).length;

}
