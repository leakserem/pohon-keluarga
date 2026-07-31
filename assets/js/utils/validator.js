/**
 * ==========================================================
 * Family Tree v2
 * validator.js
 * Validation Utilities
 * ==========================================================
 */

/* ==========================================================
   EMPTY
========================================================== */

/**
 * Cek nilai kosong
 */
export function required(value) {

    if (value === null || value === undefined) {

        return false;

    }

    return String(value).trim().length > 0;

}

/* ==========================================================
   STRING
========================================================== */

/**
 * Panjang minimum
 */
export function minLength(value = "", length = 1) {

    return String(value).trim().length >= length;

}

/**
 * Panjang maksimum
 */
export function maxLength(value = "", length = 255) {

    return String(value).trim().length <= length;

}

/* ==========================================================
   NUMBER
========================================================== */

/**
 * Apakah angka
 */
export function isNumber(value) {

    return !Number.isNaN(Number(value));

}

/**
 * Rentang angka
 */
export function between(value, min, max) {

    const number = Number(value);

    return number >= min && number <= max;

}

/* ==========================================================
   DATE
========================================================== */

/**
 * Validasi tanggal
 */
export function isDate(value) {

    return !Number.isNaN(Date.parse(value));

}

/* ==========================================================
   EMAIL
========================================================== */

/**
 * Validasi email
 */
export function isEmail(value = "") {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

}

/* ==========================================================
   PHONE
========================================================== */

/**
 * Validasi nomor telepon sederhana
 */
export function isPhone(value = "") {

    return /^[0-9+\-\s()]{6,20}$/.test(value);

}

/* ==========================================================
   URL
========================================================== */

/**
 * Validasi URL
 */
export function isURL(value = "") {

    try {

        new URL(value);

        return true;

    }

    catch {

        return false;

    }

}

/* ==========================================================
   PERSON
========================================================== */

/**
 * Validasi nama anggota
 */
export function validName(name) {

    return required(name) &&
           minLength(name, 2) &&
           maxLength(name, 100);

}

/**
 * Validasi jenis kelamin
 */
export function validGender(gender) {

    return [

        "male",

        "female"

    ].includes(String(gender).toLowerCase());

}

/**
 * Validasi generasi
 */
export function validGeneration(value) {

    return isNumber(value) &&
           between(value, 1, 99);

}

/**
 * Validasi ID anggota
 */
export function validId(id) {

    return required(id);

}

/* ==========================================================
   OBJECT
========================================================== */

/**
 * Validasi object anggota keluarga
 */
export function validatePerson(person = {}) {

    const errors = {};

    if (!validId(person.id)) {

        errors.id = "ID tidak valid";

    }

    if (!validName(person.name)) {

        errors.name = "Nama wajib diisi";

    }

    if (!validGender(person.gender)) {

        errors.gender = "Jenis kelamin tidak valid";

    }

    if (

        person.generation !== undefined &&

        !validGeneration(person.generation)

    ) {

        errors.generation = "Generasi tidak valid";

    }

    return {

        valid: Object.keys(errors).length === 0,

        errors

    };

}

/* ==========================================================
   ARRAY
========================================================== */

/**
 * Validasi array anggota
 */
export function validatePeople(list = []) {

    return list.map(person => validatePerson(person));

}
