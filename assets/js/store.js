/**
 * ==========================================================
 * Family Tree v2
 * store.js
 * Application Store
 * ==========================================================
 */

import {

    validateMember

} from "./utils/validator.js";

/* ==========================================================
   STATE
========================================================== */

const state = {

    people: [],

    listeners: []

};

/* ==========================================================
   INITIALIZE
========================================================== */

export function initializeStore() {

    state.people = [];

    state.listeners = [];

}

/* ==========================================================
   SUBSCRIBE
========================================================== */

export function subscribe(listener) {

    if (typeof listener !== "function")

        return;

    if (!state.listeners.includes(listener))

        state.listeners.push(listener);

}

export function unsubscribe(listener) {

    state.listeners =

        state.listeners.filter(

            item => item !== listener

        );

}

function notify() {

    state.listeners.forEach(listener => {

        listener(getPeople());

    });

}

/* ==========================================================
   GET
========================================================== */

export function getPeople() {

    return [...state.people];

}

export function getPerson(id) {

    return state.people.find(

        person => person.id === id

    ) ?? null;

}

export function getGeneration(level) {

    return state.people.filter(

        person =>

            Number(person.generation) ===

            Number(level)

    );

}

/* ==========================================================
   SEARCH
========================================================== */

export function findPeople(keyword = "") {

    keyword =

        String(keyword)

            .trim()

            .toLowerCase();

    if (!keyword)

        return getPeople();

    return state.people.filter(person =>

        person.fullName

            ?.toLowerCase()

            .includes(keyword)

    );

}

/* ==========================================================
   SET
========================================================== */

export function setPeople(list = []) {

    state.people =

        Array.isArray(list)

            ? [...list]

            : [];

    notify();

}

/* ==========================================================
   ADD
========================================================== */

export function addPerson(person) {

    const result =

        validateMember(person);

    if (!result.valid) {

        console.error(result.errors);

        return false;

    }

    if (getPerson(person.id)) {

        console.warn(

            "Duplicate ID:",

            person.id

        );

        return false;

    }

    state.people.push(person);

    notify();

    return true;

}

/* ==========================================================
   UPDATE
========================================================== */

export function updatePerson(

    id,

    changes = {}

) {

    const index =

        state.people.findIndex(

            person => person.id === id

        );

    if (index < 0)

        return false;

    state.people[index] = {

        ...state.people[index],

        ...changes

    };

    notify();

    return true;

}

/* ==========================================================
   REMOVE
========================================================== */

export function removePerson(id) {

    const length =

        state.people.length;

    state.people =

        state.people.filter(

            person => person.id !== id

        );

    if (

        state.people.length === length

    ) {

        return false;

    }

    notify();

    return true;

}

/* ==========================================================
   CLEAR
========================================================== */

export function clearStore() {

    state.people = [];

    notify();

}

/* ==========================================================
   FILTER
========================================================== */

export function getRootPeople() {

    return state.people.filter(person =>

        !person.fatherId &&

        !person.motherId

    );

}

export function getChildren(parentId) {

    return state.people.filter(person =>

        person.fatherId === parentId ||

        person.motherId === parentId

    );

}

export function getSpouse(personId) {

    return state.people.find(person =>

        person.id ===

        getPerson(personId)?.spouseId

    ) ?? null;

}

/* ==========================================================
   EXPORT
========================================================== */

export const Store = {

    subscribe,

    unsubscribe,

    getPeople,

    getPerson,

    setPeople,

    addPerson,

    updatePerson,

    removePerson,

    findPeople,

    getGeneration,

    getRootPeople,

    getChildren,

    getSpouse,

    clearStore

};
