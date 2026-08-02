/**
 * ==========================================================
 * Family Tree v2
 * helpers.js
 * Global Helper Functions
 * ==========================================================
 */

/* ==========================================================
   TYPE
========================================================== */

export function isString(value) {

    return typeof value === "string";

}

export function isNumber(value) {

    return typeof value === "number" &&
        !Number.isNaN(value);

}

export function isObject(value) {

    return value !== null &&
        typeof value === "object" &&
        !Array.isArray(value);

}

export function isArray(value) {

    return Array.isArray(value);

}

export function isEmpty(value) {

    return value === undefined ||
        value === null ||
        value === "";

}

/* ==========================================================
   NUMBER
========================================================== */

export function clamp(value, min, max) {

    return Math.min(

        Math.max(value, min),

        max

    );

}

export function toNumber(value, fallback = 0) {

    const number = Number(value);

    return Number.isNaN(number)

        ? fallback

        : number;

}

/* ==========================================================
   STRING
========================================================== */

export function trim(value) {

    return String(value ?? "").trim();

}

export function capitalize(text) {

    text = trim(text);

    if (!text) return "";

    return text.charAt(0).toUpperCase() +

        text.slice(1);

}

export function upper(text) {

    return trim(text).toUpperCase();

}

export function lower(text) {

    return trim(text).toLowerCase();

}

/* ==========================================================
   ARRAY
========================================================== */

export function unique(array = []) {

    return [...new Set(array)];

}

export function sortBy(array, field) {

    return [...array].sort(

        (a, b) => {

            const left = a[field] ?? "";

            const right = b[field] ?? "";

            return String(left)

                .localeCompare(String(right));

        }

    );

}

/* ==========================================================
   OBJECT
========================================================== */

export function clone(value) {

    return structuredClone(value);

}

export function merge(target, source) {

    return {

        ...target,

        ...source

    };

}

/* ==========================================================
   ID
========================================================== */

export function uuid() {

    if (crypto.randomUUID) {

        return crypto.randomUUID();

    }

    return Date.now().toString(36) +

        Math.random()

            .toString(36)

            .substring(2);

}

/* ==========================================================
   TIME
========================================================== */

export function sleep(ms = 0) {

    return new Promise(resolve => {

        setTimeout(resolve, ms);

    });

}
