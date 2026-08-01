/**
 * ==========================================================
 * Family Tree v2
 * dialog.js
 * ==========================================================
 */

const dialog = document.querySelector("#memberDialog");
const title = document.querySelector("#dialogTitle");
const body = document.querySelector("#dialogBody");
const footer = document.querySelector("#dialogFooter");

/* ==========================================================
   DIALOG
========================================================== */

export const Dialog = {

    openAddMember,

    close,

    initialize

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

    footer.querySelector("#btnCancelMember")
        .addEventListener("click", close);

    footer.querySelector("#btnSaveMember")
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

function saveMember() {

    const data = {

        id: crypto.randomUUID(),

        fullName:

            document.querySelector("#memberName").value,

        gender:

            document.querySelector("#memberGender").value,

        birthDate:

            document.querySelector("#memberBirth").value,

        generation:

            Number(

                document.querySelector("#memberGeneration").value

            ),

        fatherId:

            document.querySelector("#memberFather").value,

        motherId:

            document.querySelector("#memberMother").value,

        spouseId:

            document.querySelector("#memberSpouse").value,

        photo:

            document.querySelector("#memberPhoto").value

    };

    console.log(

        "New Member",

        data

    );

    close();

}

/* ==========================================================
   FORM
========================================================== */

function createMemberForm() {

    return `

<div class="form-grid">

<label>

Nama Lengkap

<input
id="memberName"
type="text">

</label>

<label>

Jenis Kelamin

<select id="memberGender">

<option value="male">

Laki-laki

</option>

<option value="female">

Perempuan

</option>

</select>

</label>

<label>

Tanggal Lahir

<input
id="memberBirth"
type="date">

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

Ayah

<input
id="memberFather"
type="text">

</label>

<label>

Ibu

<input
id="memberMother"
type="text">

</label>

<label>

Pasangan

<input
id="memberSpouse"
type="text">

</label>

<label>

Foto

<input
id="memberPhoto"
type="text"
placeholder="uploads/photos/...">

</label>

</div>

`;

}
