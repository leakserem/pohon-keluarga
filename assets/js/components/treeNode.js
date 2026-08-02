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

    const photo = person.photo
        ? `<img src="${person.photo}" alt="${person.fullName}">`
        : "👤";

    node.innerHTML = `

        <div class="node-header">

            <div class="node-avatar">

                ${photo}

            </div>

            <div class="node-title">

                <h3>${person.fullName || "-"}</h3>

                <small>ID : ${person.id}</small>

            </div>

        </div>

        <div class="node-body">

            <div>

                <strong>Generasi</strong><br>

                ${person.generation || "-"}

            </div>

            <div>

                <strong>Catatan</strong><br>

                ${person.notes || "-"}

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
