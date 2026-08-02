/**
 * ==========================================================
 * Family Tree v2
 * validator.js
 * Data Validator
 * ==========================================================
 */

/* ==========================================================
   ID
========================================================== */

export function isValidId(value) {

    return typeof value === "string" &&

        value.trim().length > 0;

}

/* ==========================================================
   NAME
========================================================== */

export function isValidName(value) {

    return typeof value === "string" &&

        value.trim().length > 0;

}

/* ==========================================================
   GENERATION
========================================================== */

export function isValidGeneration(value) {

    const number = Number(value);

    return Number.isInteger(number) &&

        number >= 1;

}

/* ==========================================================
   PHOTO
========================================================== */

export function isValidPhoto(value) {

    if (

        value === "" ||

        value === null ||

        value === undefined

    ) {

        return true;

    }

    return typeof value === "string";

}

/* ==========================================================
   MEMBER
========================================================== */

export function validateMember(member) {

    const errors = [];

    if (!isValidId(member.id)) {

        errors.push("ID tidak valid");

    }

    if (!isValidName(member.fullName)) {

        errors.push("Nama lengkap wajib diisi");

    }

    if (!isValidGeneration(member.generation)) {

        errors.push("Generasi tidak valid");

    }

    if (!isValidPhoto(member.photo)) {

        errors.push("Foto tidak valid");

    }

    return {

        valid: errors.length === 0,

        errors

    };

}
