/**
 * ==========================================================
 * Family Tree v2
 * dialog.js
 * ==========================================================
 */

import {
    addMember
} from "../api.js";

import {
    Toast
} from "./toast.js";

const dialog = document.querySelector("#memberDialog");
const title = document.querySelector("#dialogTitle");
const body = document.querySelector("#dialogBody");
const footer = document.querySelector("#dialogFooter");

/* ==========================================================
   PUBLIC
========================================================== */

export const Dialog = {

    initialize,

    openAddMember,

    close

};

/* ==========================================================
   INIT
========================================================== */

export function initialize() {

    dialog?.addEventListener("click", event => {

        if (event.target.hasAttribute("data-close")) {

            close();

        }

    });

}

/* ==========================================================
   OPEN
========================================================== */

export function openAddMember() {

    if (!dialog) return;

    title.textContent = "Tambah Anggota";

    body.innerHTML = createMemberForm();

    footer.innerHTML = `

        <button
            id="btnCancelMember"
            class="btn">

            Batal

        </button>

        <button
            id="btnSaveMember"
            class="btn btn-primary">

            Simpan

        </button>

    `;

    document
        .querySelector("#btnCancelMember")
        .addEventListener("click", close);

    document
        .querySelector("#btnSaveMember")
        .addEventListener("click", saveMember);

    dialog.showModal();

}

/* ==========================================================
   CLOSE
========================================================== */

export function close() {

    dialog.close();

}

/* ==========================================================
   SAVE
========================================================== */

async function saveMember() {

    const data = {

        id:
            document.querySelector("#memberId").value.trim(),

        fullName:
            document.querySelector("#memberName").value.trim(),

        generation:
            Number(
                document.querySelector("#memberGeneration").value
            ) || 1,

        fatherId:
            document.querySelector("#memberFather").value.trim(),

        motherId:
            document.querySelector("#memberMother").value.trim(),

        spouseId:
            document.querySelector("#memberSpouse").value.trim(),

        photo:
            document.querySelector("#memberPhoto").value.trim(),

        notes:
            document.querySelector("#memberNotes").value.trim()

    };

    if (!data.id) {

        Toast.error("ID wajib diisi.");

        return;

    }

    if (!data.fullName) {

        Toast.error("Nama wajib diisi.");

        return;

    }

    try {

        await addMember(data);

        Toast.success("Anggota berhasil ditambahkan.");

        close();

        document.dispatchEvent(

            new CustomEvent("data:updated")

        );

    }

    catch (error) {

        console.error(error);

        Toast.error("Gagal menyimpan data.");

    }

}

/* ==========================================================
   FORM
========================================================== */

function createMemberForm() {

    return `

<div class="form-grid">

<label>

ID

<input
id="memberId"
type="text"
placeholder="K-0001">

</label>

<label>

Nama Lengkap

<input
id="memberName"
type="text">

</label>

<label>

Generasi

<input
id="memberGeneration"
type="number"
min="1"
value="1">

</label>

<label>

ID Ayah

<input
id="memberFather"
type="text">

</label>

<label>

ID Ibu

<input
id="memberMother"
type="text">

</label>

<label>

ID Pasangan

<input
id="memberSpouse"
type="text">

</label>

<label>

Foto

<input
id="memberPhoto"
type="text"
placeholder="uploads/photos/K-0001.jpg">

</label>

<label>

Catatan

<textarea
id="memberNotes"
rows="4"></textarea>

</label>

</div>

`;

}
