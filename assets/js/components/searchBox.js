/**
 * Family Tree v2.9
 * Search box - direct navigation to selected tree node
 * Search opens only the ancestor path and keeps target descendants collapsed.
 */

import { findPeople, getPeople, getPerson } from "../store.js";
import { emit } from "../utils/dom.js";
import { setCollapsed } from "./treeCollapse.js";
import { renderTree, focusPerson } from "./treeCanvas.js";

let input = null;
let list = null;
let initialized = false;

export function initializeSearchBox() {
    if (initialized) return;

    input = document.querySelector("#searchInput");
    list = document.querySelector("#memberList");

    if (!input || !list) {
        console.warn(
            "SearchBox: #searchInput atau #memberList tidak ditemukan."
        );
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
    const results = keyword
        ? findPeople(keyword)
        : getPeople();

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
        item.title = person.fullName || "";

        const name = document.createElement("strong");
        name.textContent = person.fullName || "Tanpa nama";

        const meta = document.createElement("span");
        meta.textContent =
            `ID ${person.id} • Generasi ${person.generation}`;

        item.append(name, meta);

        item.addEventListener("click", () => {
            selectPerson(person);
        });

        fragment.appendChild(item);
    }

    list.appendChild(fragment);
}

function selectPerson(person) {
    if (!person?.id) return;

    if (input) {
        input.value = person.fullName || "";
    }

    /*
     * Highlight hasil yang dipilih pada daftar pencarian.
     */
    list?.querySelectorAll(".search-member-item.search-selected")
        .forEach(item => {
            item.classList.remove("search-selected");
        });

    const selectedItem = [...(
        list?.querySelectorAll(".search-member-item") || []
    )].find(
        item => String(item.dataset.id || "") === String(person.id)
    );

    selectedItem?.classList.add("search-selected");

    /*
     * Buka hanya jalur ancestor:
     *
     * Generasi 1
     *      |
     * Generasi 2
     *      |
     * Generasi 3
     *      |
     *    HASIL
     *
     * Keturunan dari HASIL tetap tertutup.
     */
    revealOnlyAncestorPath(person);

    renderTree();

    /*
     * Setelah tree selesai dirender,
     * pusatkan hasil pencarian dan beri highlight.
     */
    requestAnimationFrame(() => {
        const focused = focusPerson(person.id, {
            zoom: 1
        });

        if (!focused) {
            requestAnimationFrame(() => {
                focusPerson(person.id, {
                    zoom: 1
                });
            });
        }
    });

    emit("member:selected", person);

    /*
     * Tutup sidebar setelah memilih hasil.
     */
    document
        .querySelector("#sidebar")
        ?.classList.remove("open");
}

function revealOnlyAncestorPath(person) {
    const people = getPeople();

    const visited = new Set();

    const targetId = String(
        person?.id || ""
    ).trim();

    /*
     * STEP 1
     * Tutup SEMUA node.
     *
     * Ini penting supaya pencarian tidak mewarisi
     * cabang yang sebelumnya sudah dibuka manual.
     */
    for (const member of people) {
        if (member?.id) {
            setCollapsed(member.id, true);
        }
    }

    /*
     * STEP 2
     * Naik dari hasil menuju orang tua.
     */
    let current = person;

    while (current && current.id) {
        const currentId = String(current.id);

        if (visited.has(currentId)) {
            break;
        }

        visited.add(currentId);

        const parentIds = [
            current.fatherId,
            current.motherId
        ]
            .map(value =>
                String(value || "").trim()
            )
            .filter(Boolean);

        /*
         * Tidak ada parent berarti sudah mencapai
         * generasi paling atas.
         */
        if (!parentIds.length) {
            break;
        }

        /*
         * Buka parent yang diperlukan agar
         * garis menuju hasil bisa muncul.
         *
         * Tidak membuka target.
         */
        for (const parentId of parentIds) {
            setCollapsed(parentId, false);
        }

        /*
         * Naik ke parent berikutnya.
         */
        current =
            parentIds
                .map(parentId => getPerson(parentId))
                .find(Boolean) || null;
    }

    /*
     * STEP 3
     * HASIL pencarian sengaja tetap collapsed.
     *
     * Jadi:
     *
     * ancestor
     *    |
     * ancestor
     *    |
     * RESULT  <-- highlight
     *    X
     * children tidak dibuka
     */
    if (targetId) {
        setCollapsed(targetId, true);
    }
}

function onKeyDown(event) {
    if (event.key === "Escape") {
        input.value = "";

        list
            ?.querySelectorAll(".search-selected")
            .forEach(item => {
                item.classList.remove("search-selected");
            });

        renderMembers(getPeople());
        return;
    }

    if (event.key === "Enter") {
        const first =
            list?.querySelector(".search-member-item");

        if (first) {
            first.click();
        }
    }
}

export function refreshSearchResults() {
    if (!initialized) return;

    onSearch();
}
