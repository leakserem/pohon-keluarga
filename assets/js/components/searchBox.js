/**
 * ==========================================================
 * Family Tree v2
 * searchBox.js
 * Member Search Component
 * ==========================================================
 */

import {

    findPeople

} from "../store.js";

import {

    emit

} from "../utils/dom.js";

/* ==========================================================
   ELEMENTS
========================================================== */

let input = null;

let resultBox = null;

/* ==========================================================
   PUBLIC
========================================================== */

export function initializeSearchBox() {

    input = document.querySelector(

        "#searchBox"

    );

    resultBox = document.querySelector(

        "#searchResult"

    );

    if (

        !input ||

        !resultBox

    ) {

        return;

    }

    input.addEventListener(

        "input",

        onSearch

    );

    input.addEventListener(

        "keydown",

        onKeyDown

    );

}

/* ==========================================================
   SEARCH
========================================================== */

function onSearch() {

    const keyword =

        input.value.trim();

    if (!keyword) {

        clearResults();

        return;

    }

    renderResults(

        findPeople(keyword)

    );

}

/* ==========================================================
   RESULTS
========================================================== */

function renderResults(list) {

    clearResults();

    if (!list.length)

        return;

    const fragment =

        document.createDocumentFragment();

    list.forEach(person => {

        const item =

            document.createElement(

                "button"

            );

        item.type = "button";

        item.className =

            "search-item";

        item.dataset.id =

            person.id;

        item.textContent =

            person.fullName;

        item.addEventListener(

            "click",

            () =>

                selectPerson(

                    person

                )

        );

        fragment.appendChild(

            item

        );

    });

    resultBox.appendChild(

        fragment

    );

}

/* ==========================================================
   SELECT
========================================================== */

function selectPerson(person) {

    input.value =

        person.fullName;

    clearResults();

    emit(

        "member:selected",

        person

    );

}

/* ==========================================================
   KEYBOARD
========================================================== */

function onKeyDown(event) {

    if (

        event.key === "Escape"

    ) {

        clearResults();

    }

}

/* ==========================================================
   CLEAR
========================================================== */

function clearResults() {

    resultBox.replaceChildren();

}
