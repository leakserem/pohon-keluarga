/**
 * Family Tree v2.3 - Tree node
 */

import { create, text, emit } from "../utils/dom.js";
import { formatDate } from "../utils/date.js";
import * as Format from "../utils/formatter.js";
import { getPhoto } from "../utils/image.js";

const STYLE_ID = "family-tree-descendant-button-style";

export function createTreeNode(person) {
    injectStyles();

    const node = create("article", "tree-node");
    node.dataset.id = person.id;
    node.dataset.role = person.role || "primary";
    node.style.left = `${person.x}px`;
    node.style.top = `${person.y}px`;

    const header = create("div", "node-header");
    const avatar = create("div", "node-avatar");
    const image = create("img");
    image.loading = "lazy";
    image.decoding = "async";
    image.alt = Format.fullName(person.fullName);
    image.src = getPhoto(person.photo);
    image.addEventListener("error", () => {
        image.src = getPhoto("");
    }, { once: true });
    avatar.appendChild(image);

    const title = create("div", "node-title");
    const nameRow = create("div", "node-name-row");
    const h3 = create("h3");
    text(h3, Format.fullName(person.fullName));
    nameRow.appendChild(h3);

    const descendantButton = create("button", "descendant-toggle");
    descendantButton.type = "button";
    descendantButton.dataset.descendantId = person.id;
    descendantButton.textContent = "Keturunan";
    descendantButton.title = "Buka/tutup keturunan";
    descendantButton.setAttribute("aria-label", `Buka atau tutup keturunan ${Format.fullName(person.fullName)}`);
    descendantButton.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        emit("tree:toggle-descendants", { personId: person.id });
    });

    nameRow.appendChild(descendantButton);

    const generation = create("small");
    text(generation, Format.generation(person.generation));
    title.append(nameRow, generation);
    header.append(avatar, title);

    const body = create("div", "node-body");
    body.append(
        row("ID", Format.id(person.id)),
        row("Lahir", formatDate(person.birthDate)),
        row("Catatan", Format.notes(person.notes))
    );

    node.append(header, body);
    node.addEventListener("click", event => {
        event.stopPropagation();
        emit("member:selected", person);
    });

    return node;
}

function row(label, value) {
    const container = create("div", "node-row");
    const strong = create("strong");
    const span = create("span");
    text(strong, label);
    text(span, value);
    container.append(strong, span);
    return container;
}

function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
        .node-name-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 6px;
            min-width: 0;
        }

        .node-name-row h3 {
            min-width: 0;
            margin: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .descendant-toggle {
            flex: 0 0 auto;
            border: 1px solid currentColor;
            background: transparent;
            color: inherit;
            border-radius: 999px;
            padding: 2px 7px;
            font: inherit;
            font-size: 0.68rem;
            line-height: 1.2;
            cursor: pointer;
            opacity: 0.82;
        }

        .descendant-toggle:hover,
        .descendant-toggle:focus-visible {
            opacity: 1;
            outline: none;
            background: rgba(127,127,127,.12);
        }
    `;
    document.head.appendChild(style);
}
