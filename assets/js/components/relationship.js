/**
 * Family Tree v2 - Relationship engine with cycle protection
 */

import { getPeople, getPerson } from "../store.js";

export function getParents(personId) {
    const person = getPerson(personId);
    if (!person) return [];

    const result = [];
    if (person.fatherId) {
        const father = getPerson(person.fatherId);
        if (father) result.push(father);
    }
    if (person.motherId) {
        const mother = getPerson(person.motherId);
        if (mother) result.push(mother);
    }
    return result;
}

export function getFather(personId) {
    const person = getPerson(personId);
    return person?.fatherId ? getPerson(person.fatherId) : null;
}

export function getMother(personId) {
    const person = getPerson(personId);
    return person?.motherId ? getPerson(person.motherId) : null;
}

export function getSpouse(personId) {
    const person = getPerson(personId);
    if (!person?.spouseId) return null;
    const spouse = getPerson(person.spouseId);
    if (!spouse) return null;
    return !spouse.spouseId || spouse.spouseId === person.id ? spouse : null;
}

export function getChildren(personId) {
    const key = String(personId ?? "");
    return getPeople().filter(person => person.fatherId === key || person.motherId === key);
}

export function getSiblings(personId) {
    const person = getPerson(personId);
    if (!person) return [];

    return getPeople().filter(other => {
        if (other.id === person.id) return false;
        const sameFather = person.fatherId && other.fatherId === person.fatherId;
        const sameMother = person.motherId && other.motherId === person.motherId;
        return Boolean(sameFather || sameMother);
    });
}

export function getRootPeople() {
    return getPeople().filter(person => {
        if (person.fatherId || person.motherId) return false;
        if (!person.spouseId) return true;
        const spouse = getPerson(person.spouseId);
        return !spouse || person.id.localeCompare(spouse.id) < 0;
    });
}

export function getGeneration(level) {
    return getPeople().filter(person => Number(person.generation) === Number(level));
}

export function getDescendants(personId) {
    const result = [];
    const visited = new Set();

    function walk(id) {
        const key = String(id ?? "");
        if (!key || visited.has(key)) return;
        visited.add(key);

        for (const child of getChildren(key)) {
            if (visited.has(child.id)) continue;
            result.push(child);
            walk(child.id);
        }
    }

    walk(personId);
    return result;
}

export function getAncestors(personId) {
    const result = [];
    const visited = new Set();

    function visit(person) {
        if (!person || visited.has(person.id)) return;
        visited.add(person.id);

        for (const parent of getParents(person.id)) {
            if (visited.has(parent.id)) continue;
            result.push(parent);
            visit(parent);
        }
    }

    visit(getPerson(personId));
    return result;
}
