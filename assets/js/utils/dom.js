/**
 * ==========================================================
 * Family Tree v2
 * DOM Utilities
 * ==========================================================
 */

/**
 * Ambil satu elemen
 */
export function $(selector, parent = document) {

    return parent.querySelector(selector);

}

/**
 * Ambil banyak elemen
 */
export function $$(selector, parent = document) {

    return [...parent.querySelectorAll(selector)];

}

/**
 * Membuat elemen baru
 */
export function create(tag, className = "", html = "") {

    const element = document.createElement(tag);

    if (className) {

        element.className = className;

    }

    if (html) {

        element.innerHTML = html;

    }

    return element;

}

/**
 * Menambahkan child
 */
export function append(parent, child) {

    if (!parent || !child) return;

    parent.appendChild(child);

}

/**
 * Menghapus semua child
 */
export function empty(element) {

    if (!element) return;

    while (element.firstChild) {

        element.removeChild(element.firstChild);

    }

}

/**
 * Menampilkan elemen
 */
export function show(element) {

    if (!element) return;

    element.hidden = false;

}

/**
 * Menyembunyikan elemen
 */
export function hide(element) {

    if (!element) return;

    element.hidden = true;

}

/**
 * Toggle hidden
 */
export function toggle(element) {

    if (!element) return;

    element.hidden = !element.hidden;

}

/**
 * Tambah class
 */
export function addClass(element, className) {

    if (!element) return;

    element.classList.add(className);

}

/**
 * Hapus class
 */
export function removeClass(element, className) {

    if (!element) return;

    element.classList.remove(className);

}

/**
 * Toggle class
 */
export function toggleClass(element, className) {

    if (!element) return;

    element.classList.toggle(className);

}

/**
 * Cek class
 */
export function hasClass(element, className) {

    if (!element) return false;

    return element.classList.contains(className);

}

/**
 * Set text
 */
export function setText(element, text) {

    if (!element) return;

    element.textContent = text;

}

/**
 * Set HTML
 */
export function setHTML(element, html) {

    if (!element) return;

    element.innerHTML = html;

}

/**
 * Set attribute
 */
export function setAttr(element, name, value) {

    if (!element) return;

    element.setAttribute(name, value);

}

/**
 * Ambil attribute
 */
export function getAttr(element, name) {

    if (!element) return null;

    return element.getAttribute(name);

}

/**
 * Hapus attribute
 */
export function removeAttr(element, name) {

    if (!element) return;

    element.removeAttribute(name);

}

/**
 * Event listener
 */
export function on(element, event, callback) {

    if (!element) return;

    element.addEventListener(event, callback);

}

/**
 * Hapus event listener
 */
export function off(element, event, callback) {

    if (!element) return;

    element.removeEventListener(event, callback);

}

/**
 * Delegasi event
 */
export function delegate(parent, selector, event, callback) {

    if (!parent) return;

    parent.addEventListener(event, e => {

        const target = e.target.closest(selector);

        if (!target) return;

        callback(e, target);

    });

}

/**
 * Escape HTML
 */
export function escapeHTML(text = "") {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}
