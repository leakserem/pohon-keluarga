/**
 * ==========================================================
 * Family Tree v2
 * toast.js
 * Toast Notification
 * ==========================================================
 */

const CLASS = {

    success: "toast-success",

    error: "toast-error",

    warning: "toast-warning",

    info: "toast-info"

};

let container = null;

/* ==========================================================
   PUBLIC
========================================================== */

export const Toast = {

    success(message, duration = 3000) {

        show(message, CLASS.success, duration);

    },

    error(message, duration = 4000) {

        show(message, CLASS.error, duration);

    },

    warning(message, duration = 3500) {

        show(message, CLASS.warning, duration);

    },

    info(message, duration = 3000) {

        show(message, CLASS.info, duration);

    }

};

/* ==========================================================
   SHOW
========================================================== */

function show(

    message,

    type,

    duration

) {

    ensureContainer();

    const toast = createToast(

        message,

        type

    );

    container.appendChild(toast);

    requestAnimationFrame(() => {

        toast.classList.add(

            "show"

        );

    });

    const timer = setTimeout(() => {

        removeToast(toast);

    }, duration);

    toast.addEventListener(

        "click",

        () => {

            clearTimeout(timer);

            removeToast(toast);

        }

    );

}

/* ==========================================================
   CREATE
========================================================== */

function createToast(

    message,

    type

) {

    const toast =

        document.createElement("div");

    toast.className =

        `toast ${type}`;

    toast.textContent =

        message;

    return toast;

}

/* ==========================================================
   REMOVE
========================================================== */

function removeToast(toast) {

    toast.classList.remove(

        "show"

    );

    toast.classList.add(

        "hide"

    );

    toast.addEventListener(

        "transitionend",

        () => {

            toast.remove();

        },

        {

            once: true

        }

    );

}

/* ==========================================================
   CONTAINER
========================================================== */

function ensureContainer() {

    if (container)

        return;

    container =

        document.querySelector(

            "#toastContainer"

        );

    if (container)

        return;

    container =

        document.createElement("div");

    container.id =

        "toastContainer";

    document.body.appendChild(

        container

    );

}
