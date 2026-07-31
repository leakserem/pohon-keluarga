/**
 * ==========================================================
 * Family Tree v2
 * api.js
 * API Service
 * ==========================================================
 */

import { CONFIG, apiUrl } from "./config.js";

const cache = new Map();

/* ==========================================================
   FETCH WITH TIMEOUT
========================================================== */

async function fetchTimeout(url, options = {}) {

    const controller = new AbortController();

    const timer = setTimeout(() => {

        controller.abort();

    }, CONFIG.API.TIMEOUT);

    try {

        const response = await fetch(url, {

            ...options,

            signal: controller.signal

        });

        clearTimeout(timer);

        if (!response.ok) {

            throw new Error(

                `HTTP ${response.status}`

            );

        }

        return response;

    }

    finally {

        clearTimeout(timer);

    }

}

/* ==========================================================
   REQUEST
========================================================== */

async function request(action, options = {}) {

    const url = apiUrl(action);

    let retry = CONFIG.API.RETRY;

    while (retry >= 0) {

        try {

            const response = await fetchTimeout(

                url,

                options

            );

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
   LOAD PEOPLE
========================================================== */

export async function loadPeople() {

    if (

        CONFIG.API.CACHE &&

        cache.has("people")

    ) {

        return cache.get("people");

    }

    try {

        const data = await request("people");

        if (!Array.isArray(data)) {

            throw new Error(

                "Invalid API response"

            );

        }

        cache.set("people", data);

        return data;

    }

    catch (error) {

        console.warn(

            "Google Apps Script tidak tersedia."

        );

        console.warn(

            "Menggunakan demo.json"

        );

        const response = await fetch(

            "./data/demo.json"

        );

        const demo = await response.json();

        cache.set("people", demo);

        return demo;

    }

}

/* ==========================================================
   ADD MEMBER
========================================================== */

export async function addMember(member) {

    return request(

        "add",

        {

            method: "POST",

            headers: {

                "Content-Type":

                "application/json"

            },

            body: JSON.stringify(member)

        }

    );

}

/* ==========================================================
   UPDATE MEMBER
========================================================== */

export async function updateMember(id, data) {

    return request(

        "update",

        {

            method: "POST",

            headers: {

                "Content-Type":

                "application/json"

            },

            body: JSON.stringify({

                id,

                ...data

            })

        }

    );

}

/* ==========================================================
   DELETE MEMBER
========================================================== */

export async function deleteMember(id) {

    return request(

        "delete",

        {

            method: "POST",

            headers: {

                "Content-Type":

                "application/json"

            },

            body: JSON.stringify({

                id

            })

        }

    );

}

/* ==========================================================
   SEARCH
========================================================== */

export async function searchPeople(keyword) {

    const people = await loadPeople();

    keyword = String(keyword)

        .trim()

        .toUpperCase();

    return people.filter(person => {

        return (

            person.fullName

                .toUpperCase()

                .includes(keyword)

            ||

            String(person.generation)

                .includes(keyword)

        );

    });

}

/* ==========================================================
   GET PERSON
========================================================== */

export async function getPerson(id) {

    const people = await loadPeople();

    return people.find(

        person => person.id === id

    );

}

/* ==========================================================
   CLEAR CACHE
========================================================== */

export function clearCache() {

    cache.clear();

}
