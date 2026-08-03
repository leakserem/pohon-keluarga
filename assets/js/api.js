/**
 * ==========================================================
 * Family Tree v2
 * api.js
 * Google Apps Script API
 * ==========================================================
 */

import { CONFIG } from "./config.js";

/* ==========================================================
   CONFIG
========================================================== */

const API_URL = CONFIG.API.BASE_URL;

/* ==========================================================
   REQUEST
========================================================== */

async function request(method = "GET", payload = null) {

    const options = {

        method

    };

    if (payload) {

        options.body = JSON.stringify(payload);

    }

    const response = await fetch(API_URL, options);

    if (!response.ok) {

        throw new Error(`HTTP ${response.status}`);

    }

    return await response.json();

}

/* ==========================================================
   LOAD PEOPLE
========================================================== */

export async function loadPeople() {

    const data = await request("GET");

    if (!Array.isArray(data)) {

        return [];

    }

    return data.map(person => ({

        id: person.id || "",

        fullName: person.fullName || "",

        generation: Number(person.generation) || 1,

        fatherId: person.fatherId || "",

        motherId: person.motherId || "",

        spouseId: person.spouseId || "",

        photo: person.photo || "",

        notes: person.notes || ""

    }));

}

/* ==========================================================
   CREATE
========================================================== */

export async function createPerson(person) {

    return await request("POST", {

        action: "create",

        person

    });

}

/* ==========================================================
   UPDATE
========================================================== */

export async function updatePerson(person) {

    return await request("POST", {

        action: "update",

        person

    });

}

/* ==========================================================
   DELETE
========================================================== */

export async function deletePerson(id) {

    return await request("POST", {

        action: "delete",

        id

    });

}

/* ==========================================================
   PING
========================================================== */

export async function ping() {

    try {

        await request("GET");

        return true;

    }

    catch {

        return false;

    }

}
