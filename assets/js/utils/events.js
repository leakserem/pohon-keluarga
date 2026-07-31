/**
 * ==========================================================
 * Family Tree v2
 * Event Bus
 * ==========================================================
 */

const listeners = new Map();

/* ==========================================================
   ON
========================================================== */

/**
 * Mendaftarkan event listener
 *
 * @param {string} event
 * @param {Function} callback
 */
export function on(event, callback) {

    if (!listeners.has(event)) {

        listeners.set(event, []);

    }

    listeners.get(event).push(callback);

}

/* ==========================================================
   OFF
========================================================== */

/**
 * Menghapus event listener
 *
 * @param {string} event
 * @param {Function} callback
 */
export function off(event, callback) {

    if (!listeners.has(event)) return;

    const callbacks = listeners.get(event);

    const index = callbacks.indexOf(callback);

    if (index !== -1) {

        callbacks.splice(index, 1);

    }

}

/* ==========================================================
   EMIT
========================================================== */

/**
 * Menjalankan semua callback pada event tertentu
 *
 * @param {string} event
 * @param {*} payload
 */
export function emit(event, payload = null) {

    if (!listeners.has(event)) return;

    listeners.get(event).forEach(callback => {

        callback(payload);

    });

}

/* ==========================================================
   ONCE
========================================================== */

/**
 * Listener hanya berjalan satu kali
 *
 * @param {string} event
 * @param {Function} callback
 */
export function once(event, callback) {

    function wrapper(payload) {

        callback(payload);

        off(event, wrapper);

    }

    on(event, wrapper);

}

/* ==========================================================
   CLEAR
========================================================== */

/**
 * Menghapus semua listener pada event
 *
 * @param {string} event
 */
export function clear(event) {

    if (!listeners.has(event)) return;

    listeners.delete(event);

}

/* ==========================================================
   CLEAR ALL
========================================================== */

/**
 * Menghapus seluruh event
 */
export function clearAll() {

    listeners.clear();

}

/* ==========================================================
   HAS
========================================================== */

/**
 * Mengecek apakah event sudah terdaftar
 *
 * @param {string} event
 * @returns {boolean}
 */
export function has(event) {

    return listeners.has(event);

}

/* ==========================================================
   COUNT
========================================================== */

/**
 * Jumlah listener pada suatu event
 *
 * @param {string} event
 * @returns {number}
 */
export function count(event) {

    if (!listeners.has(event)) {

        return 0;

    }

    return listeners.get(event).length;

}

/* ==========================================================
   DEBUG
========================================================== */

/**
 * Menampilkan seluruh event yang terdaftar
 */
export function debug() {

    console.table(

        [...listeners.entries()].map(

            ([event, callbacks]) => ({

                event,

                listeners: callbacks.length

            })

        )

    );

}
