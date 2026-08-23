/**
 * Family Tree v2.8
 * Search box - fixed to the actual page IDs
 */

import { findPeople, getPeople } from "../store.js";
import { emit } from "../utils/dom.js";

let input = null;
let list = null;
let emptyState = null;
let initialized = false;

export function initializeSearchBox() {
    if (initialized) return;

    input = document.querySelector("#searchInput");
    list = document.querySelector("#memberList");

    if (!input || !list) {
        console.warn("SearchBox: #searchInput atau #memberList tidak ditemukan.");
        return;
    }

    initialized = true;
    input.addEventListener("input", onSearch);
    input.addEventListener("search", onSearch);
    input.addEventListener("keydown", onKeyDown);

    renderMembers(getPeople());
}

function onSearch() {
    const keyword = input.value.trim();
    const results = keyword ? findPeople(keyword) : getPeople();
    renderMembers(results, keyword);
}

function renderMembers(results, keyword = "") {
    if (!list) return;
    list.replaceChildren();

    if (!results.length) {
        const empty = document.createElement("div");
        empty.className = "search-empty";
        empty.textContent = keyword
            ? `Tidak ada anggota untuk “${keyword}”.`
            : "Belum ada data anggota.";
        list.appendChild(empty);
        return;
    }

    const fragment = document.createDocumentFragment();
    for (const person of results) {
        const item = document.createElement("button");
        item.type = "button";
        item.className = "search-member-item";
        item.dataset.id = person.id;
        item.title = person.fullName;

        const name = document.createElement("strong");
        name.textContent = person.fullName || "Tanpa nama";

        const meta = document.createElement("span");
        meta.textContent = `ID ${person.id} • Generasi ${person.generation}`;

        item.append(name, meta);
        item.addEventListener("click", () => selectPerson(person));
        fragment.appendChild(item);
    }

    list.appendChild(fragment);
}

function selectPerson(person) {
    if (input) input.value = person.fullName || "";
    emit("member:selected", person);

    document.querySelector("#sidebar")?.classList.remove("open");
}

function onKeyDown(event) {
    if (event.key === "Escape") {
        input.value = "";
        renderMembers(getPeople());
        return;
    }

    if (event.key === "Enter") {
        const first = list?.querySelector(".search-member-item");
        if (first) first.click();
    }
}

export function refreshSearchResults() {
    if (!initialized) return;
    onSearch();
}
