/**
 * ==========================================================
 * Family Tree v2
 * debounce.js
 * Debounce & Throttle Utility
 * ==========================================================
 */

/* ==========================================================
   DEBOUNCE
========================================================== */

export function debounce(

    callback,

    delay = 300

) {

    let timer = null;

    return (...args) => {

        clearTimeout(timer);

        timer = setTimeout(() => {

            callback(...args);

        }, delay);

    };

}

/* ==========================================================
   THROTTLE
========================================================== */

export function throttle(

    callback,

    delay = 100

) {

    let waiting = false;

    return (...args) => {

        if (waiting)

            return;

        waiting = true;

        callback(...args);

        setTimeout(() => {

            waiting = false;

        }, delay);

    };

}

/* ==========================================================
   RAF THROTTLE
========================================================== */

export function animationFrame(callback) {

    let frame = null;

    return (...args) => {

        if (frame)

            cancelAnimationFrame(frame);

        frame = requestAnimationFrame(() => {

            callback(...args);

        });

    };

}
