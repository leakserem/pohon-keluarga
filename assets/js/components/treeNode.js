/**
 * Family Tree v2.4 - Tree node
 */

import { create, text, emit } from "../utils/dom.js";
import { formatDate } from "../utils/date.js";
import * as Format from "../utils/formatter.js";
import { getPhoto } from "../utils/image.js";
import { isCollapsed } from "./treeCollapse.js";

const STYLE_ID = "family-tree-node-controls-v24";

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
    const h3 = create("h3");
    text(h3, Format.fullName(person.fullName));

    const actions = create("div", "node-actions");
    const descendantButton = create("button", "descendant-toggle");
    descendantButton.type = "button";
    descendantButton.dataset.descendantId = person.id;

    const collapsed = isCollapsed(person.id) || isCollapsed(person.spouseId);
    descendantButton.dataset.collapsed = String(collapsed);
    descendantButton.setAttribute("aria-expanded", String(!collapsed));
    descendantButton.textContent = collapsed ? "Keturunan ▶" : "Keturunan ▼";
    descendantButton.title = collapsed ? "Buka keturunan" : "Tutup keturunan";
    descendantButton.setAttribute(
        "aria-label",
        `${collapsed ? "Buka" : "Tutup"} keturunan ${Format.fullName(person.fullName)}`
    );
    descendantButton.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        emit("tree:toggle-descendants", { personId: person.id });
    });

    actions.appendChild(descendantButton);
    title.append(h3, actions);
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
        .tree-node .node-title {
            min-width: 0;
        }

        .tree-node .node-title h3 {
            margin: 0;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .tree-node .node-actions {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-top: 6px;
        }

        .tree-node .descendant-toggle {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 24px;
            padding: 3px 8px;
            border: 1px solid currentColor;
            border-radius: 7px;
            background: rgba(0,0,0,.12);
            color: inherit;
            font-size: 11px;
            font-weight: 700;
            line-height: 1;
            white-space: nowrap;
            cursor: pointer;
            user-select: none;
            opacity: .95;
            position: relative;
            z-index: 5;
        }

        .tree-node .descendant-toggle:hover,
        .tree-node .descendant-toggle:focus-visible {
            opacity: 1;
            transform: translateY(-1px);
            outline: 2px solid currentColor;
            outline-offset: 1px;
        }

        .tree-node .descendant-toggle[data-collapsed="true"] {
            background: rgba(255,255,255,.14);
        }
    `;
    document.head.appendChild(style);
}
