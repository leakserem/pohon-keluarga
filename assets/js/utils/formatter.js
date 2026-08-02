/**
 * ==========================================================
 * Family Tree v2
 * formatter.js
 * Data Formatter Utility
 * ==========================================================
 */

/* ==========================================================
   TEXT
========================================================== */

export function text(value) {

    if (

        value === undefined ||

        value === null ||

        value === ""

    ) {

        return "-";

    }

    return String(value).trim();

}

/* ==========================================================
   NAME
========================================================== */

export function fullName(value) {

    return text(value);

}

/* ==========================================================
   GENERATION
========================================================== */

export function generation(value) {

    const number = Number(value);

    if (Number.isNaN(number))

        return "-";

    return `Generasi ${number}`;

}

/* ==========================================================
   GENDER
========================================================== */

export function gender(value) {

    switch (

        String(value)

            .trim()

            .toLowerCase()

    ) {

        case "male":

            return "Laki-laki";

        case "female":

            return "Perempuan";

        default:

            return "-";

    }

}

/* ==========================================================
   PHOTO
========================================================== */

export function photo(path) {

    if (

        !path ||

        String(path).trim() === ""

    ) {

        return "";

    }

    return String(path).trim();

}

/* ==========================================================
   NOTES
========================================================== */

export function notes(value) {

    return text(value);

}

/* ==========================================================
   ID
========================================================== */

export function id(value) {

    return text(value);

}
