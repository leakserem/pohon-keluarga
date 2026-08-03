/**
 * ==========================================================
 * Family Tree v2
 * dialog.js
 * Member Dialog
 * ==========================================================
 */

import {

    createMemberId

} from "../utils/uuid.js";

import {

    createPerson,

    updatePerson,

    deletePerson

} from "../api.js";

import {

    addPerson,

    updatePerson as updateStore,

    removePerson

} from "../store.js";

import {

    Toast

} from "./toast.js";

/* ==========================================================
   ELEMENTS
========================================================== */

let dialog;

let title;

let body;

let footer;

let editingId = null;

/* ==========================================================
   PUBLIC
========================================================== */

export function initializeDialog() {

    dialog =

        document.querySelector("#memberDialog");

    title =

        document.querySelector("#dialogTitle");

    body =

        document.querySelector("#dialogBody");

    footer =

        document.querySelector("#dialogFooter");

}

/* ==========================================================
   ADD
========================================================== */

export function openAddMember() {

    editingId = null;

    title.textContent =

        "Tambah Anggota";

    body.innerHTML = createForm({

        id: createMemberId(),

        fullName: "",

        generation: 1,

        fatherId: "",

        motherId: "",

        spouseId: "",

        photo: "",

        notes: ""

    });

    footer.innerHTML =

        buttons(false);

    bindButtons();

    dialog.showModal();

}

/* ==========================================================
   EDIT
========================================================== */

export function openEditMember(person) {

    editingId = person.id;

    title.textContent =

        "Ubah Anggota";

    body.innerHTML =

        createForm(person);

    footer.innerHTML =

        buttons(true);

    bindButtons();

    dialog.showModal();

}

/* ==========================================================
   BUTTONS
========================================================== */

function bindButtons() {

    $("#btnCancel")

        ?.addEventListener(

            "click",

            close

        );

    $("#btnSave")

        ?.addEventListener(

            "click",

            save

        );

    $("#btnDelete")

        ?.addEventListener(

            "click",

            remove

        );

}

/* ==========================================================
   SAVE
========================================================== */

async function save() {

    const person = collect();

    try {

        if (editingId) {

            await updatePerson(person);

            updateStore(

                person.id,

                person

            );

            Toast.success(

                "Data diperbarui."

            );

        }

        else {

            await createPerson(person);

            addPerson(person);

            Toast.success(

                "Anggota ditambahkan."

            );

        }

        close();

    }

    catch {

        Toast.error(

            "Gagal menyimpan data."

        );

    }

}

/* ==========================================================
   DELETE
========================================================== */

async function remove() {

    if (!editingId)

        return;

    if (

        !confirm(

            "Hapus anggota ini?"

        )

    ) {

        return;

    }

    try {

        await deletePerson(

            editingId

        );

        removePerson(

            editingId

        );

        Toast.success(

            "Anggota dihapus."

        );

        close();

    }

    catch {

        Toast.error(

            "Gagal menghapus."

        );

    }

}

/* ==========================================================
   CLOSE
========================================================== */

export function close() {

    dialog.close();

}

/* ==========================================================
   DATA
========================================================== */

function collect() {

    return {

        id:

            $("#memberId").value,

        fullName:

            $("#memberName").value.trim(),

        generation:

            Number(

                $("#memberGeneration").value

            ),

        fatherId:

            $("#memberFather").value.trim(),

        motherId:

            $("#memberMother").value.trim(),

        spouseId:

            $("#memberSpouse").value.trim(),

        photo:

            $("#memberPhoto").value.trim(),

        notes:

            $("#memberNotes").value.trim()

    };

}

/* ==========================================================
   FORM
========================================================== */

function createForm(person) {

    return `

<input id="memberId"
value="${person.id}"
readonly>

<input id="memberName"
value="${person.fullName}">

<input id="memberGeneration"
type="number"
value="${person.generation}">

<input id="memberFather"
value="${person.fatherId}">

<input id="memberMother"
value="${person.motherId}">

<input id="memberSpouse"
value="${person.spouseId}">

<input id="memberPhoto"
value="${person.photo}">

<textarea id="memberNotes">${person.notes}</textarea>

`;

}

/* ==========================================================
   BUTTON HTML
========================================================== */

function buttons(edit) {

    return `

<button
id="btnCancel"
class="btn">

Batal

</button>

${
edit
?
`
<button
id="btnDelete"
class="btn btn-danger">

Hapus

</button>
`
:
""
}

<button
id="btnSave"
class="btn btn-primary">

Simpan

</button>

`;

}
/* ==========================================================
   COMPATIBILITY EXPORT
========================================================== */

export const Dialog = {

    initialize: initializeDialog,

    openAddMember,

    openEditMember,

    close

};
export const Dialog = {
    initialize: initializeDialog,
    openAddMember,
    openEditMember,
    close
};
/* ==========================================================
   HELPER
========================================================== */

function $(selector) {

    return document.querySelector(selector);

}
