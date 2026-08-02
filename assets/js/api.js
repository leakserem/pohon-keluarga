/**
 * ==========================================================
 * Family Tree v2
 * api.js
 * ==========================================================
 */

import { CONFIG } from "./config.js";

/* ==========================================================
   API
========================================================== */

const API_URL =
    "https://script.google.com/macros/s/AKfycbznthSzb5gqHaRNsNzjH9qpRpEIfM-5f5Yv87smFO4AN9vkJ6F_KRl6amyfQjLLmjtQ/exec";

/* ==========================================================
   LOAD PEOPLE
========================================================== */

export async function loadPeople() {

    const response = await fetchTimeout(API_URL);

    if (!response.ok) {

        throw new Error(

            `HTTP ${response.status}`

        );

    }

    const data = await response.json();

    return data.map(person => ({

        id: person.id ?? "",

        fullName: person.fullName ?? "",

        generation: Number(person.generation) || 1,

        fatherId: person.fatherId ?? "",

        motherId: person.motherId ?? "",

        spouseId: person.spouseId ?? "",

        photo: person.photo ?? "",

        notes: person.notes ?? ""

    }));

}

/* ==========================================================
   ADD MEMBER
========================================================== */

export async function addMember(person) {

    return await sendRequest({

        action: "add",

        person

    });

}

/* ==========================================================
   UPDATE MEMBER
========================================================== */

export async function updateMember(person) {

    return await sendRequest({

        action: "update",

        person

    });

}

/* ==========================================================
   DELETE MEMBER
========================================================== */

export async function deleteMember(id) {

    return await sendRequest({

        action: "delete",

        id

    });

}

/* ==========================================================
   POST
========================================================== */

async function sendRequest(body) {

    const response = await fetchTimeout(

        API_URL,

        {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(body)

        }

    );

    if (!response.ok) {

        throw new Error(

            `HTTP ${response.status}`

        );

    }

    return await response.json();

}

/* ==========================================================
   FETCH TIMEOUT
========================================================== */

async function fetchTimeout(url, options = {}) {

    const controller = new AbortController();

    const timeout = setTimeout(

        () => controller.abort(),

        CONFIG.API.TIMEOUT || 10000

    );

    try {

        return await fetch(

            url,

            {

                ...options,

                signal: controller.signal

            }

        );

    }

    finally {

        clearTimeout(timeout);

    }

}
