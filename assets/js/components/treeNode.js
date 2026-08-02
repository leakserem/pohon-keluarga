/**
 * ==========================================================
 * Family Tree v2
 * treeNode.js
 * Tree Node Component
 * ==========================================================
 */

import {

    create,

    text

} from "../utils/dom.js";

import {

    formatDate

} from "../utils/date.js";

import * as Format

    from "../utils/formatter.js";

import {

    getPhoto

} from "../utils/image.js";

import {

    emit

} from "../utils/dom.js";

/* ==========================================================
   PUBLIC
========================================================== */

export function createTreeNode(person) {

    const node = create(

        "article",

        "tree-node"

    );

    node.dataset.id = person.id;

    node.style.left = person.x + "px";

    node.style.top = person.y + "px";

    node.append(

        createHeader(person),

        createBody(person)

    );

    node.addEventListener(

        "click",

        () => {

            emit(

                "member:selected",

                person

            );

        }

    );

    return node;

}

/* ==========================================================
   HEADER
========================================================== */

function createHeader(person) {

    const header = create(

        "div",

        "node-header"

    );

    const avatar = create(

        "div",

        "node-avatar"

    );

    const image = create("img");

    image.loading = "lazy";

    image.decoding = "async";

    image.alt =

        Format.fullName(

            person.fullName

        );

    image.src =

        getPhoto(

            person.photo

        );

    avatar.appendChild(image);

    const title = create(

        "div",

        "node-title"

    );

    const h3 = create("h3");

    text(

        h3,

        Format.fullName(

            person.fullName

        )

    );

    const generation = create("small");

    text(

        generation,

        Format.generation(

            person.generation

        )

    );

    title.append(

        h3,

        generation

    );

    header.append(

        avatar,

        title

    );

    return header;

}

/* ==========================================================
   BODY
========================================================== */

function createBody(person) {

    const body = create(

        "div",

        "node-body"

    );

    body.append(

        row(

            "ID",

            Format.id(person.id)

        ),

        row(

            "Lahir",

            formatDate(

                person.birthDate

            )

        ),

        row(

            "Catatan",

            Format.notes(

                person.notes

            )

        )

    );

    return body;

}

/* ==========================================================
   ROW
========================================================== */

function row(

    label,

    value

) {

    const container = create(

        "div",

        "node-row"

    );

    const strong = create("strong");

    text(

        strong,

        label

    );

    const span = create("span");

    text(

        span,

        value

    );

    container.append(

        strong,

        span

    );

    return container;

}
