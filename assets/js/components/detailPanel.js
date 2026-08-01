/**
 * ==========================================================
 * Family Tree v2
 * detailPanel.js
 * Version 2.0
 * ==========================================================
 */

const panel = document.querySelector("#detailContent");

/* ==========================================================
   PUBLIC
========================================================== */

export function initializeDetailPanel() {

    bindEvents();

    showEmpty();

}

/* ==========================================================
   EVENTS
========================================================== */

function bindEvents() {

    document.addEventListener(

        "member:selected",

        event => {

            renderMember(event.detail);

        }

    );

}

/* ==========================================================
   EMPTY
========================================================== */

function showEmpty() {

    if (!panel) return;

    panel.innerHTML = `

        <div class="detail-empty">

            <h3>Belum Ada Anggota Dipilih</h3>

            <p>

                Klik salah satu anggota keluarga
                pada pohon untuk melihat detail.

            </p>

        </div>

    `;

}

/* ==========================================================
   MEMBER
========================================================== */

function renderMember(person) {

    if (!panel) return;

    panel.innerHTML = `

        <div class="detail-card">

            <div class="detail-photo">

                ${
                    person.photo
                        ? `<img src="${person.photo}" alt="${person.name}">`
                        : `<div class="detail-avatar">👤</div>`
                }

            </div>

            <h2>

                ${person.name || "-"}

            </h2>

            <table class="detail-table">

                <tr>

                    <th>ID</th>

                    <td>${person.id || "-"}</td>

                </tr>

                <tr>

                    <th>Jenis Kelamin</th>

                    <td>${person.gender || "-"}</td>

                </tr>

                <tr>

                    <th>Lahir</th>

                    <td>${person.birth || "-"}</td>

                </tr>

                <tr>

                    <th>Wafat</th>

                    <td>${person.death || "-"}</td>

                </tr>

                <tr>

                    <th>Generasi</th>

                    <td>${person.generation || "-"}</td>

                </tr>

                <tr>

                    <th>Ayah / Ibu</th>

                    <td>${person.parentIds || "-"}</td>

                </tr>

                <tr>

                    <th>Pasangan</th>

                    <td>${person.spouseIds || "-"}</td>

                </tr>

                <tr>

                    <th>Alamat</th>

                    <td>${person.address || "-"}</td>

                </tr>

                <tr>

                    <th>Pekerjaan</th>

                    <td>${person.job || "-"}</td>

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
   PUBLIC API
========================================================== */

export function clearDetailPanel() {

    showEmpty();

}

export function showMemberDetail(person) {

    renderMember(person);

}
