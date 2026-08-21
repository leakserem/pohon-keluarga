/**
 * Family Tree v2 - Sidebar
 */

import { subscribe, getPeople } from "../store.js";
import { emit } from "../utils/dom.js";
import { getPhoto } from "../utils/image.js";
import * as Format from "../utils/formatter.js";

let sidebar = null;
let list = null;
let count = null;
let generationFilter = null;

export function initializeSidebar() {
    sidebar = document.querySelector("#sidebar");
    list = document.querySelector("#memberList");
    count = document.querySelector("#memberCount");
    generationFilter = document.querySelector("#generationFilter");

    if (!sidebar || !list) return;
    subscribe(renderSidebar);
    generationFilter?.addEventListener("change", renderSidebar);
    renderSidebar();
}

export function renderSidebar() {
    if (!list) return;

    const people = getPeople().sort(compareName);
    const selectedGeneration = generationFilter?.value || "";
    const filtered = selectedGeneration
        ? people.filter(person => String(person.generation) === selectedGeneration)
        : people;

    if (count) count.textContent = `${people.length} Anggota`;
    updateGenerationOptions(people);

    list.replaceChildren();
    const fragment = document.createDocumentFragment();
    filtered.forEach(person => fragment.appendChild(createItem(person)));
    list.appendChild(fragment);
}

function updateGenerationOptions(people) {
    if (!generationFilter) return;

    const current = generationFilter.value;
    const generations = [...new Set(people.map(person => Number(person.generation)).filter(Number.isFinite))]
        .sort((a, b) => a - b);

    generationFilter.replaceChildren();
    const all = new Option("Semua Generasi", "");
    generationFilter.appendChild(all);

    for (const generation of generations) {
        generationFilter.appendChild(new Option(`Generasi ${generation}`, String(generation)));
    }

    if (generations.includes(Number(current))) generationFilter.value = current;
}

function createItem(person) {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "sidebar-item";
    item.dataset.id = person.id;

    const avatar = document.createElement("img");
    avatar.className = "sidebar-avatar";
    avatar.src = getPhoto(person.photo);
    avatar.alt = Format.fullName(person.fullName);

    const content = document.createElement("div");
    content.className = "sidebar-content";

    const name = document.createElement("div");
    name.className = "sidebar-name";
    name.textContent = Format.fullName(person.fullName);

    const info = document.createElement("div");
    info.className = "sidebar-info";
    info.textContent = `${Format.id(person.id)} • ${Format.generation(person.generation)}`;

    content.append(name, info);
    item.append(avatar, content);

    item.addEventListener("click", () => {
        emit("member:selected", person);
        highlight(person.id);
    });

    return item;
}

export function highlight(id) {
    list?.querySelectorAll(".sidebar-item").forEach(item => {
        item.classList.toggle("active", item.dataset.id === String(id));
    });
}

function compareName(a, b) {
    return (a.fullName || "").localeCompare(b.fullName || "", "id");
}
