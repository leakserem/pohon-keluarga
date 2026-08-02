/**
 * ==========================================================
 * Family Tree v2
 * treeNode.js
 * ==========================================================
 */

const PLACEHOLDER =
    "assets/images/avatar.svg";

/* ==========================================================
   CREATE NODE
========================================================== */

export function createTreeNode(person) {

    const node = document.createElement("article");

    node.className = "tree-node";

    node.dataset.id = person.id;

    node.style.left = `${person.x}px`;

    node.style.top = `${person.y}px`;

    const photo = person.photo
        ? person.photo
        : PLACEHOLDER;

    node.innerHTML = `

        <div class="node-photo">

            <img
                src="${photo}"
                alt="${person.fullName}"
                loading="lazy"
                onerror="this.src='${PLACEHOLDER}'">

        </div>

        <div class="node-content">

            <h3 class="node-name">

                ${person.fullName || "-"}

            </h3>

            <div class="node-id">

                ${person.id}

            </div>

            <div class="node-generation">

                Generasi ${person.generation || "-"}

            </div>

        </div>

    `;

    node.addEventListener(

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

    return node;

}
