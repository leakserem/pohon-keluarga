/**
 * Family Tree v3.2 - Member dialog
 * Only the member data form is changed. Existing toolbar/dialog lifecycle is preserved.
 *
 * Canonical form order:
 * ID
 * NAMA LENGKAP
 * GENDER
 * URUTAN ANAK
 * GENERASI
 * fatherId
 * AYAH
 * motherId
 * IBU
 * spouseId
 * PASANGAN
 * TANGGAL LAHIR
 * TANGGAL WAFAT
 * FOTO
 * CATATAN
 */

import { createMemberId } from "../utils/uuid.js";
import { createPerson, updatePerson, deletePerson } from "../api.js";
import {
    addPerson,
    getPeople,
    updatePerson as updateStore,
    removePerson
} from "../store.js";
import { Toast } from "./toast.js";
import {
    compressPhoto,
    applyPhotoPreview,
    MAX_PHOTO_BYTES
} from "./photoUpload.js";

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
        Gender: "",
        childOrder: 0,
        generation: 1,
        fatherId: "",
        fatherName: "",
        motherId: "",
        motherName: "",
        spouseId: "",
        spouseName: "",
        birthDate: "",
        deathDate: "",
        photo: "",
        notes: ""
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
    form.className = "member-form member-form-v32";

    form.append(
        fieldInput("memberId", "ID", person.id, "text", true),
        fieldInput("memberName", "NAMA LENGKAP", String(person.fullName || "").toUpperCase(), "text", false, true),
        fieldInput("memberGender", "GENDER", String(person.Gender ?? person.gender ?? "").toUpperCase(), "text", false, true),
        fieldInput("memberChildOrder", "URUTAN ANAK", Number.isFinite(Number(person.childOrder)) ? Number(person.childOrder) : 0, "number", false, false, "0"),
        fieldInput("memberGeneration", "GENERASI", Number.isFinite(Number(person.generation)) ? Number(person.generation) : 1, "number", false, false, "1"),
        fieldInput("memberFatherId", "fatherId", person.fatherId, "text", true),
        createRelationSelect("memberFather", "AYAH", person.fatherId, person.id, "male"),
        fieldInput("memberFatherName", "NAMA AYAH", String(person.fatherName || "").toUpperCase(), "text", true),
        fieldInput("memberMotherId", "motherId", person.motherId, "text", false),
        fieldInput("memberMother", "IBU", String(person.motherName || "").toUpperCase(), "text", false, true),
        fieldInput("memberSpouseId", "spouseId", person.spouseId, "text", false),
        fieldInput("memberSpouse", "PASANGAN", String(person.spouseName || "").toUpperCase(), "text", false, true),
        fieldInput("memberBirthDate", "TANGGAL LAHIR", person.birthDate, "date", false),
        fieldInput("memberDeathDate", "TANGGAL WAFAT", person.deathDate, "date", false),
        createPhotoField(person.photo),
        createNotesField(person.notes)
    );

    syncRelation(form, "#memberFather", "#memberFatherId");

    return form;
}

function fieldInput(id, labelText, inputValue, type = "text", readOnly = false, uppercase = false, placeholder = "") {
    const label = document.createElement("label");
    label.htmlFor = id;
    label.textContent = labelText;

    const input = document.createElement("input");
    input.id = id;
    input.type = type;
    input.value = inputValue ?? "";
    input.readOnly = readOnly;

    if (placeholder) input.placeholder = placeholder;

    if (uppercase) {
        input.style.textTransform = "uppercase";
        input.addEventListener("input", () => {
            input.value = input.value.toUpperCase();
        });
    }

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
    empty.textContent = `— PILIH ${labelText} —`;
    select.appendChild(empty);

    const people = [...getPeople()]
        .filter(person => person.id !== currentId)
        .filter(person => {
            const gender = String(person.Gender ?? person.gender ?? "").trim().toLowerCase();
            return genderFilter === "any" || !gender || gender === genderFilter;
        })
        .sort((a, b) => String(a.fullName || "").localeCompare(String(b.fullName || ""), "id"));

    people.forEach(person => {
        const option = document.createElement("option");
        option.value = person.id;
        option.textContent = String(person.fullName || person.id).toUpperCase();
        option.selected = person.id === selectedId;
        select.appendChild(option);
    });

    label.appendChild(select);
    return label;
}

function syncRelation(form, selectSelector, idSelector) {
    const select = form.querySelector(selectSelector);
    const idInput = form.querySelector(idSelector);
    const nameInput = form.querySelector("#memberFatherName");
    if (!select || !idInput) return;

    const sync = () => {
        idInput.value = select.value || "";
        if (nameInput) {
            const selected = select.options[select.selectedIndex];
            nameInput.value = selected && selected.value
                ? String(selected.textContent || "").toUpperCase()
                : "";
        }
    };

    select.addEventListener("change", sync);
    sync();
}

function createPhotoField(existingUrl) {
    const wrapper = document.createElement("div");
    wrapper.className = "photo-field";

    const label = document.createElement("label");
    label.textContent = "FOTO";

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

function createNotesField(notesValue) {
    const label = document.createElement("label");
    label.className = "member-notes-field";
    label.htmlFor = "memberNotes";
    label.textContent = "CATATAN";

    const notes = document.createElement("textarea");
    notes.id = "memberNotes";
    notes.value = notesValue ?? "";
    label.appendChild(notes);
    return label;
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
    const fatherId = value("#memberFather").trim();
    const fatherName = value("#memberFatherName").trim().toUpperCase();

    return {
        id: value("#memberId").trim(),
        fullName: value("#memberName").trim().toUpperCase(),
        Gender: value("#memberGender").trim().toUpperCase(),
        childOrder: Number(value("#memberChildOrder")),
        generation: Number(value("#memberGeneration")),
        fatherId,
        fatherName,
        motherId: value("#memberMotherId").trim(),
        motherName: value("#memberMother").trim().toUpperCase(),
        spouseId: value("#memberSpouseId").trim(),
        spouseName: value("#memberSpouse").trim().toUpperCase(),
        birthDate: value("#memberBirthDate").trim(),
        deathDate: value("#memberDeathDate").trim(),
        photo: "",
        photoDataUrl: pendingPhotoDataUrl,
        photoBytes: pendingPhotoBytes,
        notes: value("#memberNotes")
    };
}

async function save() {
    const person = collect();
    const saveButton = document.querySelector("#btnSave");

    try {
        if (!person.fullName) throw new Error("NAMA LENGKAP wajib diisi.");
        if (!Number.isInteger(person.childOrder) || person.childOrder < 0) {
            throw new Error("URUTAN ANAK harus berupa angka 0 atau lebih.");
        }
        if (!Number.isInteger(person.generation) || person.generation < 1) {
            throw new Error("GENERASI harus berupa angka minimal 1.");
        }
        if (person.photoDataUrl && person.photoBytes > MAX_PHOTO_BYTES) {
            throw new Error("Ukuran foto harus maksimal 20 KB.");
        }

        if (saveButton) {
            saveButton.disabled = true;
            saveButton.textContent = "Menyimpan…";
        }

        if (editingId) {
            const response = await updatePerson(person);
            const returned = response?.data?.person || response?.person;
            updateStore(person.id, returned ? { ...person, ...returned } : person);
            Toast.success("Data diperbarui ke Members dan Submissions.");
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
        console.error("Save member error:", error);
        Toast.error(error?.message || "Gagal menyimpan data.");
        if (saveButton) {
            saveButton.disabled = false;
            saveButton.textContent = "Simpan";
        }
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
        console.error("Delete member error:", error);
        Toast.error(error?.message || "Gagal menghapus.");
    }
}

export function close() {
    pendingPhotoDataUrl = "";
    pendingPhotoBytes = 0;
    editingId = null;
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

(function injectDialogV32Styles() {
    const STYLE_ID = "member-dialog-v32-styles";
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
        #memberDialog .member-form-v32 {
            display:grid;
            grid-template-columns:repeat(2,minmax(0,1fr));
            gap:16px;
        }
        #memberDialog .member-form-v32 > label,
        #memberDialog .member-form-v32 > .photo-field {
            display:flex;
            flex-direction:column;
            gap:7px;
            min-width:0;
            text-align:center;
        }
        #memberDialog .member-form-v32 .member-notes-field,
        #memberDialog .member-form-v32 .photo-field {
            grid-column:1 / -1;
        }
        #memberDialog .member-form-v32 input,
        #memberDialog .member-form-v32 select,
        #memberDialog .member-form-v32 textarea {
            box-sizing:border-box;
            width:100%;
        }
        #memberDialog #memberName,
        #memberDialog #memberGender {
            text-transform:uppercase;
        }
        #memberDialog .member-form-v32 input[readonly] {
            opacity:.78;
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
            width:120px;
            height:120px;
            object-fit:cover;
            border-radius:50%;
            background:#fff;
        }
        #memberDialog #memberPhotoStatus {
            font-size:12px;
            opacity:.78;
        }
        @media(max-width:720px){
            #memberDialog .member-form-v32{grid-template-columns:1fr;}
            #memberDialog .member-form-v32 .member-notes-field,
            #memberDialog .member-form-v32 .photo-field{grid-column:auto;}
        }
    `;
    document.head.appendChild(style);
})();
