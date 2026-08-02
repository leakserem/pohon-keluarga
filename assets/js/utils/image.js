/**
 * ==========================================================
 * Family Tree v2
 * image.js
 * Image Utility
 * ==========================================================
 */

/* ==========================================================
   DEFAULT
========================================================== */

export const DEFAULT_AVATAR =

    "assets/images/avatar.svg";

/* ==========================================================
   GET PHOTO
========================================================== */

export function getPhoto(path) {

    if (

        !path ||

        String(path).trim() === ""

    ) {

        return DEFAULT_AVATAR;

    }

    return String(path).trim();

}

/* ==========================================================
   CREATE IMAGE
========================================================== */

export function createImage(

    path,

    alt = ""

) {

    const image = new Image();

    image.loading = "lazy";

    image.decoding = "async";

    image.alt = alt;

    image.src = getPhoto(path);

    image.onerror = () => {

        image.src = DEFAULT_AVATAR;

    };

    return image;

}

/* ==========================================================
   PRELOAD
========================================================== */

export function preload(list = []) {

    list.forEach(path => {

        const image = new Image();

        image.src = getPhoto(path);

    });

}

/* ==========================================================
   EXISTS
========================================================== */

export function imageExists(path) {

    return new Promise(resolve => {

        const image = new Image();

        image.onload = () => resolve(true);

        image.onerror = () => resolve(false);

        image.src = getPhoto(path);

    });

}
