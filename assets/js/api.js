/**
 * ==========================================================
 * Family Tree v2
 * api.js
 * ==========================================================
 */

import { CONFIG } from "./config.js";

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

    return await response.json();

}

/* ==========================================================
   FETCH TIMEOUT
========================================================== */

async function fetchTimeout(url) {

    const controller = new AbortController();

    const timer = setTimeout(

        () => controller.abort(),

        CONFIG.API.TIMEOUT

    );

    try {

        return await fetch(

            url,

            {

                method: "GET",

                signal: controller.signal

            }

        );

    }

    finally {

        clearTimeout(timer);

    }

}
