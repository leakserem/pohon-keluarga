/**
 * ==========================================================
 * Family Tree v2
 * sidebar.js
 * ==========================================================
 */

import {
    Store,
    getFilteredPeople
} from "../store.js";

/* ==========================================================
   ELEMENTS
========================================================== */

const memberList =
    document.querySelector("#memberList");

const memberCount =
    document.querySelector("#memberCount");

/* ==========================================================
   PUBLIC
========================================================== */

export function initializeSidebar() {

    renderSidebar();

    Store.subscribe(renderSidebar);

}

/* ==========================================================
   RENDER
========================================================== */

export function renderSidebar() {

    if (!memberList) return;

    const people = getFilteredPeople();

    memberList.innerHTML = "";

    people.forEach(person => {

        memberList.appendChild(

            createMemberItem(person)

        );

    });

    if (memberCount) {

        memberCount.textContent =
            `${people.length} Anggota`;

    }

}

/* ==========================================================
   MEMBER ITEM
========================================================== */

function createMemberItem(person) {

    const item = document.createElement("div");

    item.className = "sidebar-item";

    const avatar = person.photo
        ? `<img src="${person.photo}" alt="${person.fullName}">`
        : "👤";

    item.innerHTML = `

        <div class="sidebar-avatar">

            ${avatar}

        </div>

        <div class="sidebar-info">

            <strong>

                ${person.fullName || "-"}

            </strong>

            <small>

                ID : ${person.id}

            </small>

            <small>

                Generasi ${person.generation}

            </small>

        </div>

    `;

    item.addEventListener("click", () => {

        document.dispatchEvent(

            new CustomEvent(

                "member:selected",

                {

                    detail: person

                }

            )

        );

    });

    return item;

}
