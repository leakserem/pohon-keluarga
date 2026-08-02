/**
 * ==========================================================
 * Family Tree v2
 * api.js
 * Google Apps Script API
 * ==========================================================
 */

import { CONFIG } from "./config.js";

/* ==========================================================
   URL
========================================================== */

const API_URL = CONFIG.API.URL;

/* ==========================================================
   REQUEST
========================================================== */

async function request(action = "", options = {}) {

    const url = action

        ? `${API_URL}?action=${encodeURIComponent(action)}`

        : API_URL;

    let retry = CONFIG.API.RETRY;

    while (retry >= 0) {

        try {

            const response = await fetch(url, {

                method: options.method || "GET",

                headers: {

                    "Content-Type": "application/json"

                },

                body: options.body

                    ? JSON.stringify(options.body)

                    : undefined

            });

            if (!response.ok) {

                throw new Error(

                    `HTTP ${response.status}`

                );

            }

            return await response.json();

        }

        catch (error) {

            if (retry === 0) {

                throw error;

            }

            retry--;

        }

    }

}

/* ==========================================================
   LOAD
========================================================== */

export async function loadPeople() {

    const data = await request();

    if (!Array.isArray(data))

        return [];

    return data.map(person => ({

        id:

            person.id ?? "",

        fullName:

            person.fullName ?? "",

        generation:

            Number(person.generation) || 1,

        fatherId:

            person.fatherId ?? "",

        motherId:

            person.motherId ?? "",

        spouseId:

            person.spouseId ?? "",

        photo:

            person.photo ?? "",

        notes:

            person.notes ?? ""

    }));

}

/* ==========================================================
   CREATE
========================================================== */

export async function createPerson(person) {

    return await request("create", {

        method: "POST",

        body: person

    });

}

/* ==========================================================
   UPDATE
========================================================== */

export async function updatePerson(person) {

    return await request("update", {

        method: "POST",

        body: person

    });

}

/* ==========================================================
   DELETE
========================================================== */

export async function deletePerson(id) {

    return await request("delete", {

        method: "POST",

        body: {

            id

        }

    });

}

/* ==========================================================
   HEALTH
========================================================== */

export async function ping() {

    try {

        await request();

        return true;

    }

    catch {

        return false;

    }

}
