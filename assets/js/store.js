/**
 * ==========================================================
 * Family Tree v2
 * store.js
 * Reactive State Manager
 * ==========================================================
 */

const state = {

    /* ===========================
       DATA
    =========================== */

    people: [],

    selectedPerson: null,

    search: "",

    generationFilter: "",

    loading: false,

    error: null

};

/* ==========================================================
   OBSERVER
========================================================== */

const listeners = new Set();

function notify() {

    listeners.forEach(callback => {

        callback(getState());

    });

}

/* ==========================================================
   PUBLIC
========================================================== */

export function initializeStore() {

    state.people = [];

    state.selectedPerson = null;

    state.search = "";

    state.generationFilter = "";

    state.loading = false;

    state.error = null;

}

/* ==========================================================
   SUBSCRIBE
========================================================== */

export const Store = {

    subscribe(callback) {

        listeners.add(callback);

        callback(getState());

        return () => listeners.delete(callback);

    },

    get(key) {

        return state[key];

    }

};

/* ==========================================================
   STATE
========================================================== */

export function getState() {

    return structuredClone(state);

}

/* ==========================================================
   PEOPLE
========================================================== */

export function setPeople(people = []) {

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
   FILTER
========================================================== */

export function setSearch(value = "") {

    state.search = value.trim();

    notify();

}

export function setGenerationFilter(value = "") {

    state.generationFilter = value;

    notify();

}

export function getFilteredPeople() {

    let people = [...state.people];

    if (state.search) {

        const keyword = state.search.toUpperCase();

        people = people.filter(person => {

            return (

                person.fullName

                    .toUpperCase()

                    .includes(keyword)

                ||

                String(person.generation)

                    .includes(keyword)

            );

        });

    }

    if (state.generationFilter) {

        people = people.filter(person =>

            String(person.generation)

            === String(state.generationFilter)

        );

    }

    return people;

}

/* ==========================================================
   SELECT
========================================================== */

export function selectPerson(id) {

    state.selectedPerson =

        getPerson(id) || null;

    notify();

}

export function clearSelection() {

    state.selectedPerson = null;

    notify();

}

/* ==========================================================
   CRUD
========================================================== */

export function addPerson(person) {

    state.people.push(person);

    notify();

}

export function updatePerson(id, data) {

    const person = getPerson(id);

    if (!person) return;

    Object.assign(person, data);

    notify();

}

export function removePerson(id) {

    state.people = state.people.filter(

        person => person.id !== id

    );

    if (

        state.selectedPerson &&

        state.selectedPerson.id === id

    ) {

        state.selectedPerson = null;

    }

    notify();

}

/* ==========================================================
   LOADING
========================================================== */

export function setLoading(value) {

    state.loading = !!value;

    notify();

}

export function isLoading() {

    return state.loading;

}

/* ==========================================================
   ERROR
========================================================== */

export function setError(message = null) {

    state.error = message;

    notify();

}

export function getError() {

    return state.error;

}

/* ==========================================================
   RESET
========================================================== */

export function resetStore() {

    initializeStore();

    notify();

}
