/**
 * ==========================================================
 * Family Tree v2
 * dom.js
 * DOM Utility
 * ==========================================================
 */

/* ==========================================================
   SELECTOR
========================================================== */

export function $(selector, parent = document) {

    return parent.querySelector(selector);

}

export function $$(selector, parent = document) {

    return [...parent.querySelectorAll(selector)];

}

/* ==========================================================
   CREATE
========================================================== */

export function create(tag, className = "") {

    const element = document.createElement(tag);

    if (className) {

        element.className = className;

    }

    return element;

}

/* ==========================================================
   CONTENT
========================================================== */

export function text(element, value = "") {

    if (!element) return;

    element.textContent = value;

}

export function html(element, value = "") {

    if (!element) return;

    element.innerHTML = value;

}

/* ==========================================================
   ATTRIBUTE
========================================================== */

export function attr(element, name, value) {

    if (!element) return;

    if (value === undefined) {

        return element.getAttribute(name);

    }

    element.setAttribute(name, value);

}

/* ==========================================================
   CLASS
========================================================== */

export function addClass(element, className) {

    element?.classList.add(className);

}

export function removeClass(element, className) {

    element?.classList.remove(className);

}

export function toggleClass(element, className) {

    element?.classList.toggle(className);

}

export function hasClass(element, className) {

    return element?.classList.contains(className);

}

/* ==========================================================
   DISPLAY
========================================================== */

export function show(element) {

    element?.classList.remove("hidden");

}

export function hide(element) {

    element?.classList.add("hidden");

}

/* ==========================================================
   REMOVE
========================================================== */

export function remove(element) {

    element?.remove();

}

export function clear(element) {

    if (!element) return;

    element.replaceChildren();

}

/* ==========================================================
   EVENTS
========================================================== */

export function on(element, event, callback, options) {

    element?.addEventListener(

        event,

        callback,

        options

    );

}

export function off(element, event, callback, options) {

    element?.removeEventListener(

        event,

        callback,

        options

    );

}

export function once(element, event, callback) {

    element?.addEventListener(

        event,

        callback,

        {

            once: true

        }

    );

}

/* ==========================================================
   CUSTOM EVENT
========================================================== */

export function emit(name, detail = {}) {

    document.dispatchEvent(

        new CustomEvent(

            name,

            {

                detail

            }

        )

    );

}
