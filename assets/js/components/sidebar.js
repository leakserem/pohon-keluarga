/**
 * ==========================================================
 * Family Tree v2
 * sidebar.js
 * ==========================================================
 */

import {
    Store,
    getFilteredPeople,
    setSearch,
    setGenerationFilter,
    selectPerson
} from "../store.js";

const sidebar = document.querySelector("#sidebar");
const searchInput = document.querySelector("#searchInput");
const generationSelect = document.querySelector("#generationFilter");
const memberList = document.querySelector("#memberList");
const memberCount = document.querySelector("#memberCount");

/* ==========================================================
   PUBLIC
========================================================== */

export function initializeSidebar() {

    bindEvents();

    render();

    Store.subscribe(() => {

        render();

    });

}

/* ==========================================================
   RENDER
========================================================== */

function render() {

    renderStatistics();

    renderGeneration();

    renderMemberList();

}

/* ==========================================================
   STATISTICS
========================================================== */

function renderStatistics() {

    const people = getFilteredPeople();

    if (memberCount) {

        memberCount.textContent =
            `${people.length} Anggota`;

    }

}

/* ==========================================================
   GENERATION
========================================================== */

function renderGeneration() {

    if (!generationSelect) return;

    const people = Store.get("people");

    const generations = [...new Set(

        people.map(person => person.generation)

    )]

    .sort((a, b) => Number(a) - Number(b));

    generationSelect.innerHTML = "";

    generationSelect.appendChild(

        new Option(
            "Semua Generasi",
            ""
        )

    );

    generations.forEach(g => {

        generationSelect.appendChild(

            new Option(

                "Generasi " + g,

                g

            )

        );

    });

}

/* ==========================================================
   MEMBER LIST
========================================================== */

function renderMemberList() {

    if (!memberList) return;

    memberList.innerHTML = "";

    const people = getFilteredPeople()

        .sort((a, b) =>

            a.fullName.localeCompare(

                b.fullName,

                "id"

            )

        );

    people.forEach(person => {

        const item = createItem(person);

        memberList.appendChild(item);

    });

}

/* ==========================================================
   MEMBER ITEM
========================================================== */

function createItem(person) {

    const button = document.createElement("button");

    button.className = "sidebar-person";

    if (

        Store.get("selectedPerson")?.id === person.id

    ) {

        button.classList.add("active");

    }

    button.innerHTML = `

        <div class="sidebar-avatar">

            ${initials(person.fullName)}

        </div>

        <div class="sidebar-info">

            <strong>${escape(person.fullName)}</strong>

            <small>

                Generasi ${person.generation}

            </small>

        </div>

    `;

    button.onclick = () => {

        selectPerson(person.id);

    };

    return button;

}

/* ==========================================================
   EVENTS
========================================================== */

function bindEvents() {

    searchInput?.addEventListener(

        "input",

        e => {

            setSearch(

                e.target.value

            );

        }

    );

    generationSelect?.addEventListener(

        "change",

        e => {

            setGenerationFilter(

                e.target.value

            );

        }

    );

}

/* ==========================================================
   HELPERS
========================================================== */

function initials(name = "") {

    return name

        .split(" ")

        .slice(0,2)

        .map(word => word[0])

        .join("")

        .toUpperCase();

}

function escape(text = "") {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}
