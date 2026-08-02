/**
 * ==========================================================
 * Family Tree v2
 * storage.js
 * Local Storage Utility
 * ==========================================================
 */

/* ==========================================================
   LOAD
========================================================== */

export function load(key, defaultValue = null) {

    try {

        const value = localStorage.getItem(key);

        if (value === null)

            return defaultValue;

        return JSON.parse(value);

    }

    catch (error) {

        console.warn(

            "Storage load error:",

            key,

            error

        );

        return defaultValue;

    }

}

/* ==========================================================
   SAVE
========================================================== */

export function save(key, value) {

    try {

        localStorage.setItem(

            key,

            JSON.stringify(value)

        );

        return true;

    }

    catch (error) {

        console.warn(

            "Storage save error:",

            key,

            error

        );

        return false;

    }

}

/* ==========================================================
   REMOVE
========================================================== */

export function remove(key) {

    try {

        localStorage.removeItem(key);

        return true;

    }

    catch (error) {

        console.warn(

            "Storage remove error:",

            key,

            error

        );

        return false;

    }

}

/* ==========================================================
   CLEAR
========================================================== */

export function clear() {

    try {

        localStorage.clear();

        return true;

    }

    catch (error) {

        console.warn(

            "Storage clear error:",

            error

        );

        return false;

    }

}

/* ==========================================================
   EXISTS
========================================================== */

export function exists(key) {

    return localStorage.getItem(key) !== null;

}

/* ==========================================================
   TOGGLE
========================================================== */

export function toggle(key) {

    const value = load(key, false);

    save(key, !value);

    return !value;

}
