/**
 * Family Tree v2.9 - Member dialog
 * Adds: mother/spouse name selectors + 20 KiB Drive-upload photo flow.
 */

import { createMemberId } from "../utils/uuid.js";
import { createPerson, updatePerson, deletePerson } from "../api.js";
import { addPerson, getPeople, updatePerson as updateStore, removePerson } from "../store.js";
import { Toast } from "./toast.js";
import { compressPhoto, applyPhotoPreview, MAX_PHOTO_BYTES } from "./photoUpload.js";

let dialog = null;
let title = null;
let body = null;
let footer = null;
let editingId = null;
let pendingPhotoDataUrl = "";
let pendingPhotoBytes = 0;

export function initializeDialog() {
    dialog = document.querySelector("#memberDialog");
    title = document.querySelector("#dialogTitle");
    body = document.querySelector("#dialogBody");
    footer = document.querySelector("#dialogFooter");
    document.querySelector("#btnDialogClose")?.addEventListener("click", close);
}

export function openAddMember() {
    editingId = null;
    pendingPhotoDataUrl = "";
    pendingPhotoBytes = 0;
    openWithPerson({
        id: createMemberId(),
        fullName: "",
        generation: 1,
        fatherId: "",
        motherId: "",
        spouseId: "",
        motherName: "",
        spouseName: "",
        photo: "",
        notes: "",
        birthDate: "",
        deathDate: "",
        gender: ""
    }, "Tambah Anggota", false);
}

export function openEditMember(person) {
    editingId = person.id;
    pendingPhotoDataUrl = "";
    pendingPhotoBytes = 0;
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
    form.className = "member-form member-form-v29";

    form.append(
        fieldInput("memberId", "ID", person.id, "text", true),
        fieldInput("memberName", "Nama Lengkap", person.fullName, "text", false),
        fieldInput("memberGeneration", "Generasi", person.generation, "number", false),
        createRelationSelect("memberFather", "Nama Ayah", person.fatherId, person.id, "male"),
        createRelationSelect("memberMother", "Nama Ibu", person.motherId, person.id, "female"),
        createRelationSelect("memberSpouse", "Nama Pasangan", person.spouseId, person.id, "any"),
        fieldInput("memberBirthDate", "Tanggal Lahir", person.birthDate, "date", false),
        fieldInput("memberDeathDate", "Tanggal Wafat", person.deathDate, "date", false),
        fieldInput("memberGender", "Jenis Kelamin", person.gender, "text", false)
    );

    form.appendChild(createPhotoField(person.photo));

    const notesLabel = document.createElement("label");
    notesLabel.htmlFor = "memberNotes";
    notesLabel.textContent = "Catatan";
    const notes = document.createElement("textarea");
    notes.id = "memberNotes";
    notes.value = person.notes ?? "";
    notesLabel.appendChild(notes);
    notesLabel.classList.add("member-notes-field");
    form.appendChild(notesLabel);

    return form;
}

function fieldInput(id, labelText, value, type, readOnly) {
    const label = document.createElement("label");
    label.htmlFor = id;
    label.textContent = labelText;
    const input = document.createElement("input");
    input.id = id;
    input.type = type;
    input.value = value ?? "";
    input.readOnly = readOnly;
    label.appendChild(input);
    return label;
}

function createRelationSelect(id, labelText, selectedId, currentId, genderFilter) {
    const label = document.createElement("label");
    label.htmlFor = id;
    label.textContent = labelText;

    const select = document.createElement("select");
    select.id = id;

    const empty = document.createElement("option");
    empty.value = "";
    empty.textContent = `— pilih ${labelText.toLowerCase()} —`;
    select.appendChild(empty);

    const people = [...getPeople()]
        .filter(person => person.id !== currentId)
        .filter(person => genderFilter === "any" || !person.gender || person.gender.toLowerCase() === genderFilter)
        .sort((a, b) => (a.fullName || "").localeCompare(b.fullName || "", "id"));

    people.forEach(person => {
        const option = document.createElement("option");
        option.value = person.id;
        option.textContent = person.fullName || person.id;
        option.selected = person.id === selectedId;
        select.appendChild(option);
    });

    label.appendChild(select);
    return label;
}

function createPhotoField(existingUrl) {
    const wrapper = document.createElement("div");
    wrapper.className = "photo-field";

    const label = document.createElement("label");
    label.textContent = "Foto Anggota (maks. 20 KB)";

    const controls = document.createElement("div");
    controls.className = "photo-controls";

    const preview = document.createElement("img");
    preview.id = "memberPhotoPreview";
    preview.alt = "Pratinjau foto";
    preview.style.width = "120px";
    preview.style.height = "120px";
    preview.style.objectFit = "cover";
    preview.style.borderRadius = "50%";
    preview.style.display = existingUrl ? "block" : "none";
    if (existingUrl) preview.src = existingUrl;

    const choose = document.createElement("button");
    choose.type = "button";
    choose.className = "btn";
    choose.textContent = "Upload Foto";

    const input = document.createElement("input");
    input.type = "file";
    input.id = "memberPhotoFile";
    input.accept = "image/*";
    input.hidden = true;

    const status = document.createElement("span");
    status.id = "memberPhotoStatus";
    status.textContent = existingUrl ? "Foto tersimpan di Google Drive" : "Belum ada foto";

    choose.addEventListener("click", () => input.click());
    input.addEventListener("change", async () => {
        const file = input.files?.[0];
        if (!file) return;

        status.textContent = "Mengompres foto…";
        try {
            const result = await compressPhoto(file);
            pendingPhotoDataUrl = result.dataUrl;
            pendingPhotoBytes = result.bytes;
            applyPhotoPreview(preview, result.dataUrl);
            status.textContent = `Siap upload • ${(result.bytes / 1024).toFixed(1)} KB`;
        } catch (error) {
            pendingPhotoDataUrl = "";
            pendingPhotoBytes = 0;
            input.value = "";
            status.textContent = error?.message || "Foto tidak dapat diproses.";
            Toast.error(status.textContent);
        }
    });

    controls.append(preview, choose, input, status);
    label.appendChild(controls);
    wrapper.appendChild(label);
    return wrapper;
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
    const motherId = value("#memberMother");
    const spouseId = value("#memberSpouse");
    const people = getPeople();

    return {
        id: value("#memberId"),
        fullName: value("#memberName").trim(),
        generation: Number(value("#memberGeneration")),
        fatherId: value("#memberFather").trim(),
        motherId,
        spouseId,
        motherName: people.find(p => p.id === motherId)?.fullName || "",
        spouseName: people.find(p => p.id === spouseId)?.fullName || "",
        photo: value("#memberPhoto").trim(),
        photoDataUrl: pendingPhotoDataUrl,
        photoBytes: pendingPhotoBytes,
        photoMaxBytes: MAX_PHOTO_BYTES,
        birthDate: value("#memberBirthDate").trim(),
        deathDate: value("#memberDeathDate").trim(),
        gender: value("#memberGender").trim(),
        notes: value("#memberNotes").trim()
    };
}

async function save() {
    const person = collect();

    try {
        if (!person.fullName) throw new Error("Nama lengkap wajib diisi.");
        if (!Number.isInteger(person.generation) || person.generation < 1) {
            throw new Error("Generasi harus berupa angka minimal 1.");
        }
        if (person.photoDataUrl && person.photoBytes > MAX_PHOTO_BYTES) {
            throw new Error("Ukuran foto harus maksimal 20 KB.");
        }

        if (editingId) {
            const response = await updatePerson(person);
            const returned = response?.data?.person || response?.person;
            updateStore(person.id, returned ? { ...person, ...returned } : person);
            Toast.success("Data diperbarui ke Google Sheets.");
        } else {
            const response = await createPerson(person);
            const returned = response?.data?.person || response?.person || person;
            if (!addPerson({ ...person, ...returned })) {
                throw new Error("Data anggota tidak valid.");
            }
            Toast.success("Anggota masuk ke Members dan Submissions.");
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
    pendingPhotoDataUrl = "";
    pendingPhotoBytes = 0;
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

// UI styling for photo + relationship selectors.
(function injectDialogV29Styles() {
    const STYLE_ID = "member-dialog-v29-styles";
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
        #memberDialog .member-form-v29 {
            display:grid;
            grid-template-columns:repeat(2,minmax(0,1fr));
            gap:16px;
        }
        #memberDialog .member-form-v29 > label,
        #memberDialog .member-form-v29 > .photo-field {
            display:flex;
            flex-direction:column;
            gap:7px;
            min-width:0;
            text-align:center;
        }
        #memberDialog .member-form-v29 .member-notes-field,
        #memberDialog .member-form-v29 .photo-field {
            grid-column:1 / -1;
        }
        #memberDialog .photo-controls {
            display:flex;
            flex-wrap:wrap;
            align-items:center;
            justify-content:center;
            gap:12px;
            padding:14px;
            border:1px dashed var(--color-border,#53627a);
            border-radius:14px;
        }
        #memberDialog .photo-controls img {
            flex:0 0 120px;
            background:#fff;
        }
        #memberDialog #memberPhotoStatus {
            font-size:12px;
            opacity:.78;
        }
        @media(max-width:720px){
            #memberDialog .member-form-v29{grid-template-columns:1fr;}
            #memberDialog .member-form-v29 .member-notes-field,
            #memberDialog .member-form-v29 .photo-field{grid-column:auto;}
        }
    `;
    document.head.appendChild(style);
})();
