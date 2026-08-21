/**
 * Family Tree v2 - Data validator
 */

export function isValidId(value) {
    return typeof value === "string" && value.trim().length > 0;
}

export function isValidName(value) {
    return typeof value === "string" && value.trim().length > 0;
}

export function isValidGeneration(value) {
    const number = Number(value);
    return Number.isInteger(number) && number >= 1;
}

export function isValidPhoto(value) {
    if (value === "" || value === null || value === undefined) return true;
    return typeof value === "string";
}

export function validateMember(member = {}) {
    const errors = [];
    if (!isValidId(member.id)) errors.push("ID tidak valid");
    if (!isValidName(member.fullName)) errors.push("Nama lengkap wajib diisi");
    if (!isValidGeneration(member.generation)) errors.push("Generasi tidak valid");
    if (!isValidPhoto(member.photo)) errors.push("Foto tidak valid");

    if (member.fatherId && member.fatherId === member.id) errors.push("Ayah tidak boleh dirinya sendiri");
    if (member.motherId && member.motherId === member.id) errors.push("Ibu tidak boleh dirinya sendiri");
    if (member.spouseId && member.spouseId === member.id) errors.push("Pasangan tidak boleh dirinya sendiri");

    return { valid: errors.length === 0, errors };
}
