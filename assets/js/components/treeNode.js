/**
 * ==========================================================
 * Family Tree v2
 * treeNode.js
 * Tree Node Component
 * ==========================================================
 */

import { selectPerson } from "../store.js";

/* ==========================================================
   PUBLIC
========================================================== */

export function createTreeNode(person) {

    const node = document.createElement("article");

    node.className = "tree-node";

    node.dataset.id = person.id;

    node.style.left = `${person.x}px`;

    node.style.top = `${person.y}px`;

    node.append(

        createHeader(person),

        createBody(person),

        createFooter(person)

    );

    node.addEventListener("click", () => {

        selectPerson(person.id);

    });

    return node;

}

/* ==========================================================
   HEADER
========================================================== */

function createHeader(person) {

    const header = document.createElement("header");

    header.className = "tree-node-header";

    const avatar = document.createElement("div");

    avatar.className = "tree-avatar";

    avatar.textContent = getInitials(person.fullName);

    const title = document.createElement("div");

    title.className = "tree-title";

    const name = document.createElement("h3");

    name.textContent = person.fullName;

    const generation = document.createElement("small");

    generation.textContent =
        `Generasi ${person.generation}`;

    title.append(name, generation);

    header.append(avatar, title);

    return header;

}

/* ==========================================================
   BODY
========================================================== */

function createBody(person) {

    const body = document.createElement("section");

    body.className = "tree-node-body";

    if (person.notes) {

        const notes = document.createElement("p");

        notes.className = "tree-notes";

        notes.textContent = person.notes;

        body.appendChild(notes);

    } else {

        const empty = document.createElement("p");

        empty.className = "tree-empty";

        empty.textContent = "Tidak ada catatan.";

        body.appendChild(empty);

    }

    return body;

}

/* ==========================================================
   FOOTER
========================================================== */

function createFooter(person) {

    const footer = document.createElement("footer");

    footer.className = "tree-node-footer";

    footer.append(

        badge("ID", person.id),

        badge("👨‍👩‍👧", countParents(person))

    );

    return footer;

}

/* ==========================================================
   BADGE
========================================================== */

function badge(label, value) {

    const span = document.createElement("span");

    span.className = "tree-badge";

    span.innerHTML = `
        <strong>${label}</strong>
        ${value}
    `;

    return span;

}

/* ==========================================================
   HELPERS
========================================================== */

function getInitials(name = "") {

    return name

        .trim()

        .split(/\s+/)

        .slice(0, 2)

        .map(word => word[0])

        .join("")

        .toUpperCase();

}

function countParents(person) {

    if (!person.parentIds) return 0;

    return person.parentIds
        .split(",")
        .filter(Boolean)
        .length;

}

/* ==========================================================
   SELECTION
========================================================== */

export function setSelected(node) {

    document
        .querySelectorAll(".tree-node.selected")
        .forEach(card => {

            card.classList.remove("selected");

        });

    if (node) {

        node.classList.add("selected");

    }

}
