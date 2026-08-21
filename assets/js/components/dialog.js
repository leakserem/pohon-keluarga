/**
 * Family Tree v2 - Safe member dialog
 */

import { createMemberId } from "../utils/uuid.js";
import { createPerson, updatePerson, deletePerson } from "../api.js";
import { addPerson, updatePerson as updateStore, removePerson } from "../store.js";
import { Toast } from "./toast.js";

let dialog = null;
let title = null;
let body = null;
let footer = null;
let editingId = null;

export function initializeDialog() {
    dialog = document.querySelector("#memberDialog");
    title = document.querySelector("#dialogTitle");
    body = document.querySelector("#dialogBody");
    footer = document.querySelector("#dialogFooter");
    document.querySelector("#btnDialogClose")?.addEventListener("click", close);
}

export function openAddMember() {
    editingId = null;
    openWithPerson({
        id: createMemberId(),
        fullName: "",
        generation: 1,
        fatherId: "",
        motherId: "",
        spouseId: "",
        photo: "",
        notes: "",
        birthDate: ""
    }, "Tambah Anggota", false);
}

export function openEditMember(person) {
    editingId = person.id;
    openWithPerson(person, "Ubah Anggota", true);
}

function openWithPerson(person, heading, edit) {
    if (!dialog || !body || !footer) return;

    title.textContent = heading;
    body.replaceChildren(createForm(person));
    footer.replaceChildren(...createButtons(edit));
    dialog.showModal();
}

function createForm(person) {
    const form = document.createElement("div");
    form.className = "member-form";

    const fields = [
        ["memberId", "ID", person.id, "text", true],
        ["memberName", "Nama", person.fullName, "text", false],
        ["memberGeneration", "Generasi", person.generation, "number", false],
        ["memberFather", "Ayah", person.fatherId, "text", false],
        ["memberMother", "Ibu", person.motherId, "text", false],
        ["memberSpouse", "Pasangan", person.spouseId, "text", false],
        ["memberPhoto", "Foto", person.photo, "url", false],
        ["memberBirthDate", "Tanggal Lahir", person.birthDate, "date", false]
    ];

    for (const [id, labelText, value, type, readOnly] of fields) {
        const label = document.createElement("label");
        label.htmlFor = id;
        label.textContent = labelText;
        const input = document.createElement("input");
        input.id = id;
        input.type = type;
        input.value = value ?? "";
        input.readOnly = readOnly;
        label.appendChild(input);
        form.appendChild(label);
    }

    const notesLabel = document.createElement("label");
    notesLabel.htmlFor = "memberNotes";
    notesLabel.textContent = "Catatan";
    const notes = document.createElement("textarea");
    notes.id = "memberNotes";
    notes.value = person.notes ?? "";
    notesLabel.appendChild(notes);
    form.appendChild(notesLabel);

    return form;
}

function createButtons(edit) {
    const buttons = [];

    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.id = "btnCancel";
    cancel.className = "btn";
    cancel.textContent = "Batal";
    cancel.addEventListener("click", close);
    buttons.push(cancel);

    if (edit) {
        const del = document.createElement("button");
        del.type = "button";
        del.id = "btnDelete";
        del.className = "btn btn-danger";
        del.textContent = "Hapus";
        del.addEventListener("click", remove);
        buttons.push(del);
    }

    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.id = "btnSave";
    saveButton.className = "btn btn-primary";
    saveButton.textContent = "Simpan";
    saveButton.addEventListener("click", save);
    buttons.push(saveButton);

    return buttons;
}

function collect() {
    return {
        id: value("#memberId"),
        fullName: value("#memberName").trim(),
        generation: Number(value("#memberGeneration")),
        fatherId: value("#memberFather").trim(),
        motherId: value("#memberMother").trim(),
        spouseId: value("#memberSpouse").trim(),
        photo: value("#memberPhoto").trim(),
        birthDate: value("#memberBirthDate").trim(),
        notes: value("#memberNotes").trim()
    };
}

async function save() {
    const person = collect();

    try {
        if (editingId) {
            await updatePerson(person);
            if (!updateStore(person.id, person)) throw new Error("Store update gagal");
            Toast.success("Data diperbarui.");
        } else {
            await createPerson(person);
            if (!addPerson(person)) throw new Error("Data anggota tidak valid");
            Toast.success("Anggota ditambahkan.");
        }
        close();
    } catch (error) {
        console.error(error);
        Toast.error(error?.message || "Gagal menyimpan data.");
    }
}

async function remove() {
    if (!editingId || !confirm("Hapus anggota ini?")) return;

    try {
        await deletePerson(editingId);
        removePerson(editingId);
        Toast.success("Anggota dihapus.");
        close();
    } catch (error) {
        console.error(error);
        Toast.error(error?.message || "Gagal menghapus.");
    }
}

export function close() {
    dialog?.close();
}

function value(selector) {
    return document.querySelector(selector)?.value ?? "";
}

export const Dialog = {
    initialize: initializeDialog,
    openAddMember,
    openEditMember,
    close
};
