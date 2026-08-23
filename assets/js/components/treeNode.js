/**
 * Family Tree v2.6 - Tree node
 *
 * Layout goals:
 * - avatar on the left
 * - name + descendant control in two real columns
 * - long names may wrap to two lines instead of being reduced to "K..."
 * - the descendant button never overlaps the name
 */

import { create, text, emit } from "../utils/dom.js";
import { formatDate } from "../utils/date.js";
import * as Format from "../utils/formatter.js";
import { getPhoto } from "../utils/image.js";
import { isCollapsed } from "./treeCollapse.js";

const STYLE_ID = "family-tree-node-controls-v26";

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
    h3.title = Format.fullName(person.fullName);

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
        /* The card is wide enough to give both columns usable space. */
        .tree-node {
            width: 320px;
            min-width: 320px;
            box-sizing: border-box;
        }

        /* Real two-column header: avatar | content */
        .tree-node .node-header {
            display: grid;
            grid-template-columns: 58px minmax(0, 1fr);
            align-items: center;
            column-gap: 12px;
            min-width: 0;
        }

        .tree-node .node-avatar {
            width: 58px;
            height: 58px;
            flex: 0 0 58px;
            overflow: hidden;
        }

        .tree-node .node-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }

            /* Content is vertical: full name first, descendant button below. */
        .tree-node .node-title {
            min-width: 0;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
            gap: 7px;
        }

        .tree-node .node-title h3 {
            margin: 0;
            width: 100%;
            min-width: 0;
            max-width: 100%;
            overflow: visible;
            line-height: 1.18;
            white-space: normal;
            overflow-wrap: anywhere;
            word-break: break-word;
            display: block;
        }

        .tree-node .node-actions {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            width: 100%;
            min-width: 0;
        }

        .tree-node .descendant-toggle {
            width: 108px;
            min-height: 30px;
            padding: 5px 8px;
            border: 1px solid rgba(255,255,255,.95);
            border-radius: 8px;
            background: rgba(0,0,0,.12);
            color: inherit;
            font-size: 11px;
            font-weight: 700;
            line-height: 1.1;
            white-space: nowrap;
            cursor: pointer;
            user-select: none;
            position: relative;
            z-index: 5;
        }

        .tree-node .descendant-toggle:hover,
        .tree-node .descendant-toggle:focus-visible {
            background: rgba(255,255,255,.18);
            outline: 2px solid rgba(255,255,255,.8);
            outline-offset: 1px;
        }

        .tree-node .descendant-toggle[data-collapsed="true"] {
            background: rgba(255,255,255,.12);
        }

        @media (max-width: 700px) {
            .tree-node {
                width: 300px;
                min-width: 300px;
            }

            .tree-node .node-actions,
            .tree-node .descendant-toggle {
                width: 90px;
                min-width: 90px;
                flex-basis: 90px;
            }
        }
    `;
    document.head.appendChild(style);
}
