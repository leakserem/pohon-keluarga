/**
 * ==========================================================
 * Family Tree v2
 * sidebar.js
 * Version 2.0
 * ==========================================================
 */

import {

    Store,
    getFilteredPeople

} from "../store.js";

const memberList =
    document.querySelector("#memberList");

const memberCount =
    document.querySelector("#memberCount");

const generationFilter =
    document.querySelector("#generationFilter");

/* ==========================================================
   PUBLIC
========================================================== */

export function initializeSidebar() {

    bindEvents();

    populateGenerationFilter();

    renderSidebar();

}

/* ==========================================================
   EVENTS
========================================================== */

function bindEvents() {

    generationFilter?.addEventListener(

        "change",

        () => {

            Store.setGenerationFilter(

                generationFilter.value

            );

        }

    );

}

/* ==========================================================
   RENDER
========================================================== */

export function renderSidebar() {

    if (!memberList)
        return;

    const people =
        getFilteredPeople();

    memberList.innerHTML = "";

    memberCount.textContent =
        `${people.length} Anggota`;

    people.forEach(person => {

        memberList.appendChild(

            createItem(person)

        );

    });

}

/* ==========================================================
   ITEM
========================================================== */

function createItem(person) {

    const item =
        document.createElement("div");

    item.className =
        "member-item";

    item.dataset.id =
        person.id;

    item.innerHTML = `

        <div class="member-avatar">

            ${
                person.photo

                ?

                `<img
                    src="${person.photo}"
                    alt="${person.name}">`

                :

                "👤"

            }

        </div>

        <div class="member-info">

            <strong>

                ${person.name}

            </strong>

            <small>

                Generasi
                ${person.generation ?? "-"}

            </small>

        </div>

    `;

    item.addEventListener(

        "click",

        () => {

            document.dispatchEvent(

                new CustomEvent(

                    "member:selected",

                    {

                        detail: person

                    }

                )

            );

        }

    );

    return item;

}

/* ==========================================================
   GENERATION
========================================================== */

function populateGenerationFilter() {

    if (!generationFilter)
        return;

    const generations = [

        ...new Set(

            Store.people.map(

                person => person.generation

            )

        )

    ]

    .filter(Boolean)

    .sort((a, b) => a - b);

    generationFilter.innerHTML =

        `<option value="">
            Semua Generasi
        </option>`;

    generations.forEach(gen => {

        const option =
            document.createElement("option");

        option.value = gen;

        option.textContent =
            `Generasi ${gen}`;

        generationFilter.appendChild(

            option

        );

    });

}

/* ==========================================================
   STORE
========================================================== */

Store.subscribe(() => {

    renderSidebar();

});
