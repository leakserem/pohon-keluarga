/**
 * ==========================================================
 * Family Tree v2
 * treeNode.js
 * ==========================================================
 */

export function createTreeNode(person) {

    const node = document.createElement("article");

    node.className = "tree-node";

    node.dataset.id = person.id;

    node.style.left = person.x + "px";

    node.style.top = person.y + "px";

    node.innerHTML = `

        <div class="node-header">

            <div class="node-avatar">

                ${
                    person.photo
                        ? `<img src="${person.photo}" alt="${person.name}">`
                        : "👤"
                }

            </div>

            <div class="node-title">

                <h3>${person.name}</h3>

                <small>${person.gender || ""}</small>

            </div>

        </div>

        <div class="node-body">

            <div>

                <strong>Lahir</strong><br>

                ${person.birth || "-"}

            </div>

            <div>

                <strong>Generasi</strong><br>

                ${person.generation || "-"}

            </div>

        </div>

    `;

    node.addEventListener("click", () => {

        document.dispatchEvent(

            new CustomEvent("member:selected", {

                detail: person

            })

        );

    });

    return node;

}
