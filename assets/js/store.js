/**
 * Family Tree v2 - Application store
 */

import { validateMember } from "./utils/validator.js";

const state = {
    people: [],
    listeners: new Set()
};

export function initializeStore() {
    state.people = [];
    state.listeners.clear();
}

export function subscribe(listener) {
    if (typeof listener !== "function") return () => {};
    state.listeners.add(listener);
    return () => unsubscribe(listener);
}

export function unsubscribe(listener) {
    state.listeners.delete(listener);
}

function notify() {
    const snapshot = getPeople();
    for (const listener of [...state.listeners]) {
        try {
            listener(snapshot);
        } catch (error) {
            console.error("Store listener error:", error);
        }
    }
}

export function getPeople() {
    return [...state.people];
}

export function getPerson(id) {
    const key = String(id ?? "").trim();
    return state.people.find(person => person.id === key) ?? null;
}

export function getGeneration(level) {
    return state.people.filter(person => Number(person.generation) === Number(level));
}

export function findPeople(keyword = "") {
    const query = String(keyword).trim().toLowerCase();
    if (!query) return getPeople();
    return state.people.filter(person => person.fullName.toLowerCase().includes(query));
}

export function setPeople(list = []) {
    state.people = Array.isArray(list) ? [...list] : [];
    notify();
}

export function addPerson(person) {
    const result = validateMember(person);
    if (!result.valid) {
        console.error("Invalid member:", result.errors);
        return false;
    }

    if (getPerson(person.id)) {
        console.warn("Duplicate ID:", person.id);
        return false;
    }

    state.people.push({ ...person });
    notify();
    return true;
}

export function updatePerson(id, changes = {}) {
    const index = state.people.findIndex(person => person.id === String(id));
    if (index < 0) return false;

    const next = { ...state.people[index], ...changes };
    const validation = validateMember(next);
    if (!validation.valid) {
        console.error("Invalid update:", validation.errors);
        return false;
    }

    state.people[index] = next;
    notify();
    return true;
}

export function removePerson(id) {
    const key = String(id ?? "");
    const next = state.people.filter(person => person.id !== key);
    if (next.length === state.people.length) return false;
    state.people = next;
    notify();
    return true;
}

export function clearStore() {
    state.people = [];
    notify();
}

export function getRootPeople() {
    return state.people.filter(person => {
        if (person.fatherId || person.motherId) return false;
        if (!person.spouseId) return true;
        const spouse = getPerson(person.spouseId);
        return !spouse || person.id.localeCompare(spouse.id) < 0;
    });
}

export function getChildren(parentId) {
    const key = String(parentId ?? "");
    return state.people.filter(person => person.fatherId === key || person.motherId === key);
}

export function getSpouse(personId) {
    const person = getPerson(personId);
    if (!person?.spouseId) return null;
    const spouse = getPerson(person.spouseId);
    if (!spouse) return null;
    if (spouse.spouseId && spouse.spouseId !== person.id) return null;
    return spouse;
}

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
