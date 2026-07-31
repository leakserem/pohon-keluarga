/**
 * ==========================================================
 * Family Tree v2
 * Header Component
 * ==========================================================
 */

import { CONFIG } from "../config.js";

export function initializeHeader() {

    const brand = document.querySelector(".brand");
    const homeButton = document.querySelector("#homeButton");
    const addButton = document.querySelector("#addButton");
    const printButton = document.querySelector(".print-button");

    if (brand) {
        brand.textContent = CONFIG.APP_NAME;
    }

    if (homeButton) {

        homeButton.addEventListener("click", () => {

            window.location.hash = "#/tree";

        });

    }

    if (addButton) {

        addButton.addEventListener("click", () => {

            window.location.hash = "#/member";

        });

    }

    if (printButton) {

        printButton.addEventListener("click", () => {

            window.print();

        });

    }

}

/**
 * Mengubah judul aplikasi
 */
export function setTitle(title) {

    document.title = title;

}

/**
 * Mengubah nama brand di header
 */
export function setBrand(name) {

    const brand = document.querySelector(".brand");

    if (!brand) return;

    brand.textContent = name;

}

/**
 * Menampilkan atau menyembunyikan tombol tambah anggota
 */
export function showAddButton(show = true) {

    const button = document.querySelector("#addButton");

    if (!button) return;

    button.hidden = !show;

}

/**
 * Menampilkan atau menyembunyikan tombol Home
 */
export function showHomeButton(show = true) {

    const button = document.querySelector("#homeButton");

    if (!button) return;

    button.hidden = !show;

}

/**
 * Menampilkan atau menyembunyikan tombol Print
 */
export function showPrintButton(show = true) {

    const button = document.querySelector(".print-button");

    if (!button) return;

    button.hidden = !show;

}

/**
 * Mengaktifkan / menonaktifkan seluruh header
 */
export function enableHeader(enable = true) {

    document
        .querySelectorAll("header button")
        .forEach(button => {

            button.disabled = !enable;

        });

}
