/**
 * ==========================================================
 * Family Tree v2
 * sidebar.js
 * Member Sidebar
 * ==========================================================
 */

import {

    subscribe,

    getPeople

} from "../store.js";

import {

    emit

} from "../utils/dom.js";

import {

    getPhoto

} from "../utils/image.js";

import * as Format

    from "../utils/formatter.js";

/* ==========================================================
   ELEMENTS
========================================================== */

let sidebar = null;

let list = null;

/* ==========================================================
   PUBLIC
========================================================== */

export function initializeSidebar() {

    sidebar =

        document.querySelector(

            "#sidebar"

        );

    list =

        document.querySelector(

            "#memberList"

        );

    if (

        !sidebar ||

        !list

    ) {

        return;

    }

    subscribe(renderSidebar);

    renderSidebar();

}

/* ==========================================================
   RENDER
========================================================== */

export function renderSidebar() {

    if (!list)

        return;

    list.replaceChildren();

    const people =

        [...getPeople()]

        .sort(compareName);

    const fragment =

        document.createDocumentFragment();

    people.forEach(person => {

        fragment.appendChild(

            createItem(person)

        );

    });

    list.appendChild(fragment);

}

/* ==========================================================
   ITEM
========================================================== */

function createItem(person) {

    const item =

        document.createElement("button");

    item.type = "button";

    item.className =

        "sidebar-item";

    item.dataset.id =

        person.id;

    const avatar =

        document.createElement("img");

    avatar.className =

        "sidebar-avatar";

    avatar.src =

        getPhoto(person.photo);

    avatar.alt =

        person.fullName;

    const content =

        document.createElement("div");

    content.className =

        "sidebar-content";

    const name =

        document.createElement("div");

    name.className =

        "sidebar-name";

    name.textContent =

        Format.fullName(

            person.fullName

        );

    const info =

        document.createElement("div");

    info.className =

        "sidebar-info";

    info.textContent =

        `${

            Format.id(person.id)

        } • ${

            Format.generation(

                person.generation

            )

        }`;

    content.append(

        name,

        info

    );

    item.append(

        avatar,

        content

    );

    item.addEventListener(

        "click",

        () => {

            emit(

                "member:selected",

                person

            );

            highlight(person.id);

        }

    );

    return item;

}

/* ==========================================================
   HIGHLIGHT
========================================================== */

export function highlight(id) {

    list

        ?.querySelectorAll(

            ".sidebar-item"

        )

        .forEach(item => {

            item.classList.toggle(

                "active",

                item.dataset.id === id

            );

        });

}

/* ==========================================================
   SORT
========================================================== */

function compareName(a, b) {

    return (

        a.fullName || ""

    ).localeCompare(

        b.fullName || "",

        "id"

    );

}
