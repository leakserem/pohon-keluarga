/**
 * ==========================================================
 * Family Tree v2
 * detailPanel.js
 * ==========================================================
 */

const panel = document.querySelector("#detailContent");

/* ==========================================================
   PUBLIC
========================================================== */

export function initializeDetailPanel() {

    document.addEventListener(

        "member:selected",

        event => {

            renderDetail(event.detail);

        }

    );

}

/* ==========================================================
   RENDER
========================================================== */

export function renderDetail(person) {

    if (!panel || !person) return;

    const photo = person.photo
        ? `<img src="${person.photo}" alt="${person.fullName}">`
        : `<div class="detail-avatar-placeholder">👤</div>`;

    panel.innerHTML = `

        <div class="detail-card">

            <div class="detail-photo">

                ${photo}

            </div>

            <h2>

                ${person.fullName || "-"}

            </h2>

            <table class="detail-table">

                <tr>

                    <th>ID</th>

                    <td>${person.id || "-"}</td>

                </tr>

                <tr>

                    <th>Generasi</th>

                    <td>${person.generation || "-"}</td>

                </tr>

                <tr>

                    <th>Ayah</th>

                    <td>${person.fatherId || "-"}</td>

                </tr>

                <tr>

                    <th>Ibu</th>

                    <td>${person.motherId || "-"}</td>

                </tr>

                <tr>

                    <th>Pasangan</th>

                    <td>${person.spouseId || "-"}</td>

                </tr>

                <tr>

                    <th>Catatan</th>

                    <td>${person.notes || "-"}</td>

                </tr>

            </table>

        </div>

    `;

}

/* ==========================================================
   CLEAR
========================================================== */

export function clearDetailPanel() {

    if (!panel) return;

    panel.innerHTML = `

        <div class="detail-empty">

            <p>

                Pilih anggota keluarga untuk melihat detail.

            </p>

        </div>

    `;

}
