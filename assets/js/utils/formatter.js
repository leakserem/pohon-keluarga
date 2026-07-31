/**
 * ==========================================================
 * Family Tree v2
 * formatter.js
 * Data Formatter Utilities
 * ==========================================================
 */

/* ==========================================================
   TEXT
========================================================== */

/**
 * Mengubah menjadi Title Case
 */
export function titleCase(text = "") {

    return String(text)
        .toLowerCase()
        .replace(/\b\w/g, letter => letter.toUpperCase());

}

/**
 * Mengubah menjadi UPPERCASE
 */
export function upperCase(text = "") {

    return String(text).toUpperCase();

}

/**
 * Mengubah menjadi lowercase
 */
export function lowerCase(text = "") {

    return String(text).toLowerCase();

}

/**
 * Membersihkan spasi berlebih
 */
export function cleanText(text = "") {

    return String(text)
        .replace(/\s+/g, " ")
        .trim();

}

/* ==========================================================
   NAME
========================================================== */

/**
 * Inisial nama
 *
 * Contoh:
 * Siti Aminah → SA
 */
export function initials(name = "") {

    return cleanText(name)
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(word => word[0].toUpperCase())
        .join("");

}

/* ==========================================================
   GENERATION
========================================================== */

/**
 * Format generasi
 *
 * 3 → Generasi 3
 */
export function generation(value) {

    if (value === null || value === undefined || value === "") {

        return "-";

    }

    return `Generasi ${value}`;

}

/* ==========================================================
   DATE
========================================================== */

/**
 * Format tanggal Indonesia
 */
export function formatDate(date) {

    if (!date) return "-";

    return new Intl.DateTimeFormat("id-ID", {

        day: "2-digit",

        month: "long",

        year: "numeric"

    }).format(new Date(date));

}

/**
 * Format tanggal & jam
 */
export function formatDateTime(date) {

    if (!date) return "-";

    return new Intl.DateTimeFormat("id-ID", {

        day: "2-digit",

        month: "long",

        year: "numeric",

        hour: "2-digit",

        minute: "2-digit"

    }).format(new Date(date));

}

/* ==========================================================
   AGE
========================================================== */

/**
 * Menghitung umur
 */
export function age(birthDate) {

    if (!birthDate) return "-";

    const today = new Date();

    const born = new Date(birthDate);

    let years = today.getFullYear() - born.getFullYear();

    const month = today.getMonth() - born.getMonth();

    if (

        month < 0 ||

        (month === 0 && today.getDate() < born.getDate())

    ) {

        years--;

    }

    return years;

}

/* ==========================================================
   ID
========================================================== */

/**
 * Format ID anggota
 *
 * 15 → K-0015
 */
export function memberId(number) {

    return "K-" +

        String(number)

        .padStart(4, "0");

}

/* ==========================================================
   NUMBER
========================================================== */

/**
 * Format angka ribuan
 */
export function number(value = 0) {

    return Number(value)

        .toLocaleString("id-ID");

}

/* ==========================================================
   EMPTY
========================================================== */

/**
 * Menampilkan "-"
 * jika data kosong
 */
export function empty(value) {

    if (

        value === null ||

        value === undefined ||

        value === ""

    ) {

        return "-";

    }

    return value;

}

/* ==========================================================
   BOOLEAN
========================================================== */

/**
 * Ya / Tidak
 */
export function yesNo(value) {

    return value ? "Ya" : "Tidak";

}
