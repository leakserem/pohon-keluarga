/**
 * ==========================================================
 * Family Tree v2
 * store.js
 * ==========================================================
 */

const state = {

    people: [],

    search: "",

    generation: ""

};

const listeners = new Set();

/* ==========================================================
   STORE
========================================================== */

export const Store = {

    subscribe,

    notify,

    getState

};

/* ==========================================================
   INITIALIZE
========================================================== */

export function initializeStore() {

    state.people = [];

    state.search = "";

    state.generation = "";

}

/* ==========================================================
   PEOPLE
========================================================== */

export function setPeople(people) {

    state.people = Array.isArray(people)
        ? people
        : [];

    notify();

}

export function getPeople() {

    return state.people;

}

export function getPerson(id) {

    return state.people.find(

        person => person.id === id

    );

}

/* ==========================================================
   SEARCH
========================================================== */

export function setSearch(value) {

    state.search = value.trim();

    notify();

}

/* ==========================================================
   GENERATION
========================================================== */

export function setGeneration(value) {

    state.generation = value;

    notify();

}

/* ==========================================================
   FILTER
========================================================== */

export function getFilteredPeople() {

    return state.people.filter(person => {

        const matchSearch =

            state.search === "" ||

            person.fullName

                .toLowerCase()

                .includes(

                    state.search.toLowerCase()

                );

        const matchGeneration =

            state.generation === "" ||

            Number(person.generation) ===

            Number(state.generation);

        return (

            matchSearch &&

            matchGeneration

        );

    });

}

/* ==========================================================
   STATE
========================================================== */

function getState() {

    return state;

}

/* ==========================================================
   SUBSCRIBE
========================================================== */

function subscribe(callback) {

    listeners.add(callback);

}

/* ==========================================================
   NOTIFY
========================================================== */

function notify() {

    listeners.forEach(callback => {

        callback(state);

    });

}

/* ==========================================================
   EXPORT
========================================================== */

export default Store;
