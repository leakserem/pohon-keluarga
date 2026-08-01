/**
 * ==========================================================
 * Family Tree v2
 * store.js
 * Version 2.0
 * ==========================================================
 */

const listeners = [];

export const Store = {

    people: [],

    search: "",

    generationFilter: "",

    selectedMember: null,

    subscribe(callback) {

        if (typeof callback === "function") {

            listeners.push(callback);

        }

    },

    notify() {

        listeners.forEach(callback => callback());

    },

    setPeople(people) {

        this.people = Array.isArray(people)
            ? people
            : [];

        this.notify();

    },

    setSearch(text) {

        this.search = text.trim().toLowerCase();

        this.notify();

    },

    setGenerationFilter(generation) {

        this.generationFilter = generation;

        this.notify();

    },

    setSelectedMember(member) {

        this.selectedMember = member;

        this.notify();

    }

};

/* ==========================================================
   SEARCH
========================================================== */

export function setSearch(value) {

    Store.setSearch(value);

}

/* ==========================================================
   PEOPLE
========================================================== */

export function setPeople(people) {

    Store.setPeople(people);

}

export function getPeople() {

    return Store.people;

}

/* ==========================================================
   FILTER
========================================================== */

export function getFilteredPeople() {

    return Store.people.filter(person => {

        const matchSearch =

            !Store.search ||

            (person.name || "")
                .toLowerCase()
                .includes(Store.search);

        const matchGeneration =

            !Store.generationFilter ||

            String(person.generation) ===
            String(Store.generationFilter);

        return matchSearch && matchGeneration;

    });

}

/* ==========================================================
   MEMBER
========================================================== */

export function selectMember(member) {

    Store.setSelectedMember(member);

}

export function getSelectedMember() {

    return Store.selectedMember;

}

/* ==========================================================
   RESET
========================================================== */

export function resetStore() {

    Store.people = [];

    Store.search = "";

    Store.generationFilter = "";

    Store.selectedMember = null;

    Store.notify();

}
