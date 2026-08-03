/**
 * ==========================================================
 * Family Tree v2
 * detailPanel.js
 * Member Detail Panel
 * ==========================================================
 */

import {

    getPhoto

} from "../utils/image.js";

import * as Format

    from "../utils/formatter.js";

/* ==========================================================
   ELEMENTS
========================================================== */

let panel = null;

let avatar = null;

let name = null;

let id = null;

let generation = null;

let father = null;

let mother = null;

let spouse = null;

let notes = null;

/* ==========================================================
   PUBLIC
========================================================== */

export function initializeDetailPanel() {

    panel =

        document.querySelector(

            "#detailPanel"

        );

    avatar =

        document.querySelector(

            "#detailPhoto"

        );

    name =

        document.querySelector(

            "#detailName"

        );

    id =

        document.querySelector(

            "#detailId"

        );

    generation =

        document.querySelector(

            "#detailGeneration"

        );

    father =

        document.querySelector(

            "#detailFather"

        );

    mother =

        document.querySelector(

            "#detailMother"

        );

    spouse =

        document.querySelector(

            "#detailSpouse"

        );

    notes =

        document.querySelector(

            "#detailNotes"

        );

    document.addEventListener(

        "member:selected",

        event => {

            showMember(

                event.detail

            );

        }

    );

}

/* ==========================================================
   SHOW
========================================================== */

export function showMember(person) {

    if (!person)

        return;

    avatar.src =

        getPhoto(

            person.photo

        );

    avatar.alt =

        person.fullName;

    name.textContent =

        Format.fullName(

            person.fullName

        );

    id.textContent =

        Format.id(

            person.id

        );

    generation.textContent =

        Format.generation(

            person.generation

        );

    father.textContent =

        Format.id(

            person.fatherId

        );

    mother.textContent =

        Format.id(

            person.motherId

        );

    spouse.textContent =

        Format.id(

            person.spouseId

        );

    notes.textContent =

        Format.notes(

            person.notes

        );

}

/* ==========================================================
   CLEAR
========================================================== */

export function clearDetailPanel() {

    avatar.src =

        getPhoto("");

    avatar.alt = "";

    name.textContent = "-";

    id.textContent = "-";

    generation.textContent = "-";

    father.textContent = "-";

    mother.textContent = "-";

    spouse.textContent = "-";

    notes.textContent = "-";

}
