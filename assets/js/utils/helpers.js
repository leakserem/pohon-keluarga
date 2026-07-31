/**
 * ==========================================================
 * Family Tree v2
 * helpers.js
 * General Helper Functions
 * ==========================================================
 */

/* ==========================================================
   TYPE
========================================================== */

/**
 * Cek object
 */
export function isObject(value) {

    return value !== null &&
        typeof value === "object" &&
        !Array.isArray(value);

}

/**
 * Cek array
 */
export function isArray(value) {

    return Array.isArray(value);

}

/**
 * Cek string
 */
export function isString(value) {

    return typeof value === "string";

}

/**
 * Cek number
 */
export function isNumber(value) {

    return typeof value === "number" &&
        !Number.isNaN(value);

}

/**
 * Cek function
 */
export function isFunction(value) {

    return typeof value === "function";

}

/* ==========================================================
   ID
========================================================== */

/**
 * Membuat ID unik
 */
export function uuid(prefix = "") {

    const id =

        Date.now().toString(36) +

        Math.random().toString(36).substring(2, 8);

    return prefix + id;

}

/* ==========================================================
   CLONE
========================================================== */

/**
 * Deep Clone Object
 */
export function clone(value) {

    return structuredClone
        ? structuredClone(value)
        : JSON.parse(JSON.stringify(value));

}

/* ==========================================================
   MERGE
========================================================== */

/**
 * Merge object sederhana
 */
export function merge(target = {}, source = {}) {

    return {

        ...target,

        ...source

    };

}

/* ==========================================================
   ARRAY
========================================================== */

/**
 * Hapus duplikat array
 */
export function unique(array = []) {

    return [...new Set(array)];

}

/**
 * Kelompokkan array
 */
export function groupBy(array, key) {

    return array.reduce((result, item) => {

        const value = item[key];

        if (!result[value]) {

            result[value] = [];

        }

        result[value].push(item);

        return result;

    }, {});

}

/**
 * Urutkan berdasarkan field
 */
export function sortBy(array, field) {

    return [...array].sort((a, b) => {

        if (a[field] < b[field]) return -1;

        if (a[field] > b[field]) return 1;

        return 0;

    });

}

/* ==========================================================
   STRING
========================================================== */

/**
 * Potong string
 */
export function truncate(text = "", length = 50) {

    if (text.length <= length) {

        return text;

    }

    return text.substring(0, length) + "...";

}

/**
 * Slug
 */
export function slug(text = "") {

    return text

        .toLowerCase()

        .trim()

        .replace(/\s+/g, "-")

        .replace(/[^\w-]/g, "");

}

/* ==========================================================
   TIME
========================================================== */

/**
 * Delay
 */
export function sleep(ms = 500) {

    return new Promise(resolve => {

        setTimeout(resolve, ms);

    });

}

/**
 * Debounce
 */
export function debounce(callback, delay = 300) {

    let timer;

    return (...args) => {

        clearTimeout(timer);

        timer = setTimeout(() => {

            callback(...args);

        }, delay);

    };

}

/**
 * Throttle
 */
export function throttle(callback, limit = 100) {

    let waiting = false;

    return (...args) => {

        if (waiting) return;

        callback(...args);

        waiting = true;

        setTimeout(() => {

            waiting = false;

        }, limit);

    };

}

/* ==========================================================
   RANDOM
========================================================== */

/**
 * Random Integer
 */
export function random(min = 0, max = 100) {

    return Math.floor(

        Math.random() * (max - min + 1)

    ) + min;

}

/**
 * Random Element
 */
export function sample(array = []) {

    if (!array.length) {

        return null;

    }

    return array[random(0, array.length - 1)];

}
