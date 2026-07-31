/**
 * ==========================================================
 * Family Tree v2
 * searchBox.js
 * ==========================================================
 */

import {

    setSearch

} from "../store.js";

export function initializeSearchBox() {

    const input = document.querySelector("#searchInput");

    if (!input) return;

    input.addEventListener("input", event => {

        setSearch(event.target.value);

    });

}

export function clearSearch() {

    const input = document.querySelector("#searchInput");

    if (!input) return;

    input.value = "";

    setSearch("");

}
