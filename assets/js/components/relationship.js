/**
 * ==========================================================
 * Family Tree v2
 * relationship.js
 * Family Relationship Engine
 * ==========================================================
 */

import {

    getPeople,

    getPerson

} from "../store.js";

/* ==========================================================
   PARENTS
========================================================== */

export function getParents(personId) {

    const person = getPerson(personId);

    if (!person)

        return [];

    const parents = [];

    if (person.fatherId) {

        const father = getPerson(person.fatherId);

        if (father)

            parents.push(father);

    }

    if (person.motherId) {

        const mother = getPerson(person.motherId);

        if (mother)

            parents.push(mother);

    }

    return parents;

}

/* ==========================================================
   FATHER
========================================================== */

export function getFather(personId) {

    const person = getPerson(personId);

    if (!person?.fatherId)

        return null;

    return getPerson(person.fatherId);

}

/* ==========================================================
   MOTHER
========================================================== */

export function getMother(personId) {

    const person = getPerson(personId);

    if (!person?.motherId)

        return null;

    return getPerson(person.motherId);

}

/* ==========================================================
   SPOUSE
========================================================== */

export function getSpouse(personId) {

    const person = getPerson(personId);

    if (!person?.spouseId)

        return null;

    return getPerson(person.spouseId);

}

/* ==========================================================
   CHILDREN
========================================================== */

export function getChildren(personId) {

    return getPeople().filter(person =>

        person.fatherId === personId ||

        person.motherId === personId

    );

}

/* ==========================================================
   SIBLINGS
========================================================== */

export function getSiblings(personId) {

    const person = getPerson(personId);

    if (!person)

        return [];

    return getPeople()

        .filter(other => {

            if (other.id === person.id)

                return false;

            return (

                other.fatherId === person.fatherId &&

                other.motherId === person.motherId &&

                person.fatherId !== "" &&

                person.motherId !== ""

            );

        });

}

/* ==========================================================
   ROOT PEOPLE
========================================================== */

export function getRootPeople() {

    return getPeople().filter(person =>

        !person.fatherId &&

        !person.motherId

    );

}

/* ==========================================================
   GENERATION
========================================================== */

export function getGeneration(level) {

    return getPeople().filter(person =>

        Number(person.generation) ===

        Number(level)

    );

}

/* ==========================================================
   DESCENDANTS
========================================================== */

export function getDescendants(personId) {

    const result = [];

    function walk(id) {

        const children = getChildren(id);

        children.forEach(child => {

            result.push(child);

            walk(child.id);

        });

    }

    walk(personId);

    return result;

}

/* ==========================================================
   ANCESTORS
========================================================== */

export function getAncestors(personId) {

    const result = [];

    function walk(id) {

        const person = getPerson(id);

        if (!person)

            return;

        if (person.fatherId) {

            const father = getPerson(person.fatherId);

            if (father) {

                result.push(father);

                walk(father.id);

            }

        }

        if (person.motherId) {

            const mother = getPerson(person.motherId);

            if (mother) {

                result.push(mother);

                walk(mother.id);

            }

        }

    }

    walk(personId);

    return result;

}
