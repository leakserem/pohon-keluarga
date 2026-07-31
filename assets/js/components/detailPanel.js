/**
 * ==========================================================
 * Family Tree v2
 * detailPanel.js
 * ==========================================================
 */

import {
    Store,
    getPerson,
    getPeople,
    selectPerson
} from "../store.js";

const panel = document.querySelector("#detailPanel");
const content = document.querySelector("#detailContent");

/* ==========================================================
   PUBLIC
========================================================== */

export function initializeDetailPanel() {

    renderEmpty();

    Store.subscribe(state => {

        render(state.selectedPerson);

    });

}

/* ==========================================================
   RENDER
========================================================== */

function render(person) {

    if (!content) return;

    if (!person) {

        renderEmpty();

        return;

    }

    const parents = findParents(person);

    const partners = findPartners(person);

    const children = findChildren(person);

    content.innerHTML = "";

    content.append(

        createProfile(person),

        createSection("Orang Tua", parents),

        createSection("Pasangan", partners),

        createSection("Anak", children),

        createNotes(person),

        createActions(person)

    );

}

/* ==========================================================
   EMPTY
========================================================== */

function renderEmpty() {

    if (!content) return;

    content.innerHTML = `

        <div class="empty-state">

            <h3>Pilih Anggota</h3>

            <p>

                Klik salah satu anggota keluarga
                pada pohon untuk melihat detail.

            </p>

        </div>

    `;

}

/* ==========================================================
   PROFILE
========================================================== */

function createProfile(person) {

    const card = document.createElement("section");

    card.className = "detail-card";

    card.innerHTML = `

        <div class="detail-header">

            <div class="tree-avatar">

                ${initial(person.fullName)}

            </div>

            <div>

                <h2>${escapeHtml(person.fullName)}</h2>

                <p>Generasi ${person.generation}</p>

                <small>ID : ${person.id}</small>

            </div>

        </div>

    `;

    return card;

}

/* ==========================================================
   SECTION
========================================================== */

function createSection(title, list) {

    const section = document.createElement("section");

    section.className = "detail-section";

    const h3 = document.createElement("h3");

    h3.textContent = title;

    section.appendChild(h3);

    if (!list.length) {

        const empty = document.createElement("p");

        empty.className = "detail-empty";

        empty.textContent = "Belum ada data.";

        section.appendChild(empty);

        return section;

    }

    list.forEach(person => {

        const button = document.createElement("button");

        button.className = "person-tag";

        button.textContent = person.fullName;

        button.onclick = () => {

            selectPerson(person.id);

        };

        section.appendChild(button);

    });

    return section;

}

/* ==========================================================
   NOTES
========================================================== */

function createNotes(person) {

    const section = document.createElement("section");

    section.className = "detail-section";

    section.innerHTML = `

        <h3>Catatan</h3>

        <p>

            ${escapeHtml(
                person.notes || "Tidak ada catatan."
            )}

        </p>

    `;

    return section;

}

/* ==========================================================
   ACTIONS
========================================================== */

function createActions(person) {

    const div = document.createElement("div");

    div.className = "detail-actions";

    const edit = document.createElement("button");

    edit.className = "btn btn-primary";

    edit.textContent = "Edit";

    edit.onclick = () => {

        console.log("Edit", person.id);

    };

    const center = document.createElement("button");

    center.className = "btn";

    center.textContent = "Pusatkan Pohon";

    center.onclick = () => {

        document.dispatchEvent(

            new CustomEvent("tree:center",{

                detail:person.id

            })

        );

    };

    div.append(edit, center);

    return div;

}

/* ==========================================================
   HELPERS
========================================================== */

function findParents(person) {

    if (!person.parentIds) return [];

    return person.parentIds

        .split(",")

        .map(id => getPerson(id.trim()))

        .filter(Boolean);

}

function findPartners(person) {

    if (!person.partnerIds) return [];

    return person.partnerIds

        .split(",")

        .map(id => getPerson(id.trim()))

        .filter(Boolean);

}

function findChildren(person) {

    return getPeople().filter(child => {

        if (!child.parentIds) return false;

        return child.parentIds

            .split(",")

            .includes(person.id);

    });

}

function initial(name) {

    return name

        .split(" ")

        .slice(0,2)

        .map(word => word[0])

        .join("")

        .toUpperCase();

}

function escapeHtml(text="") {

    const div=document.createElement("div");

    div.textContent=text;

    return div.innerHTML;

}
