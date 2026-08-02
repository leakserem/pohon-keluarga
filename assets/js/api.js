/**
 * ==========================================================
 * Family Tree v2
 * api.js
 * ==========================================================
 */

import { CONFIG } from "./config.js";

/* ==========================================================
   API URL
========================================================== */

const API_URL =
    "https://script.google.com/macros/s/AKfycbznthSzb5gqHaRNsNzjH9qpRpEIfM-5f5Yv87smFO4AN9vkJ6F_KRl6amyfQjLLmjtQ/exec";

/* ==========================================================
   LOAD PEOPLE
========================================================== */

export async function loadPeople() {

    return await request("get");

}

/* ==========================================================
   ADD MEMBER
========================================================== */

export async function addMember(person) {

    return await request("add", {

        method: "POST",

        body: person

    });

}

/* ==========================================================
   UPDATE MEMBER
========================================================== */

export async function updateMember(person) {

    return await request("update", {

        method: "POST",

        body: person

    });

}

/* ==========================================================
   DELETE MEMBER
========================================================== */

export async function deleteMember(id) {

    return await request("delete", {

        method: "POST",

        body: {

            id

        }

    );

}

/* ==========================================================
   REQUEST
========================================================== */

async function request(action, options = {}) {

    let retry = CONFIG.API.RETRY;

    while (retry >= 0) {

        try {

            const response = await fetchTimeout(

                API_URL,

                {

                    method: options.method || "GET",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: options.body
                        ? JSON.stringify({

                              action,

                              ...options.body

                          })
                        : undefined

                }

            );

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
   FETCH TIMEOUT
========================================================== */

async function fetchTimeout(url, options = {}) {

    const controller = new AbortController();

    const timer = setTimeout(

        () => controller.abort(),

        CONFIG.API.TIMEOUT

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

        clearTimeout(timer);

    }

}
