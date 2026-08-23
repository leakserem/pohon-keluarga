/**
 * Family Tree v2.9 - API layer
 *
 * Backend contract:
 * GET  -> { ok:true, data:[...] }
 * POST { action:"create"|"update"|"delete", person|id }
 * POST may include person.photoDataUrl for Drive upload.
 */
import { CONFIG } from "./config.js";

const API_URL = CONFIG.API.BASE_URL;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function request(method = "GET", payload = null) {
    let lastError = null;

    for (let attempt = 0; attempt <= CONFIG.API.RETRY; attempt += 1) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), CONFIG.API.TIMEOUT);

        try {
            const options = {
                method,
                signal: controller.signal,
                headers: { Accept: "application/json" }
            };

            if (payload !== null) {
                options.headers["Content-Type"] = "text/plain;charset=utf-8";
                options.body = JSON.stringify(payload);
            }

            const response = await fetch(API_URL, options);
            const raw = await response.text();

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${raw.slice(0, 500)}`);
            }

            let data;
            try {
                data = raw ? JSON.parse(raw) : null;
            } catch {
                throw new Error(`API JSON tidak valid: ${raw.slice(0, 500)}`);
            }

            if (data && typeof data === "object" && data.ok === false) {
                throw new Error(String(data.error || "Operasi API gagal"));
            }
            if (data && typeof data === "object" && data.error) {
                throw new Error(String(data.error));
            }

            return data;
        } catch (error) {
            lastError = error?.name === "AbortError"
                ? new Error("Request API timeout")
                : error;

            if (attempt < CONFIG.API.RETRY) {
                await sleep(400 * (attempt + 1));
            }
        } finally {
            clearTimeout(timeout);
        }
    }

    throw lastError ?? new Error("API request gagal");
}

function normalizeResponse(data) {
    if (Array.isArray(data)) return data;

    if (data && typeof data === "object") {
        for (const candidate of [
            data.data,
            data.people,
            data.members,
            data.results,
            data.rows
        ]) {
            if (Array.isArray(candidate)) return candidate;
        }
    }

    throw new Error(
        `Format response API tidak dikenali: ${JSON.stringify(data).slice(0, 500)}`
    );
}

function normalizePerson(person = {}) {
    return {
        id: String(person.id ?? "").trim(),
        fullName: String(person.fullName ?? person.name ?? "").trim(),
        generation: Number.isInteger(Number(person.generation)) ? Number(person.generation) : 1,
        fatherId: String(person.fatherId ?? person.father_id ?? "").trim(),
        motherId: String(person.motherId ?? person.mother_id ?? "").trim(),
        spouseId: String(person.spouseId ?? person.spouse_id ?? "").trim(),
        motherName: String(person.motherName ?? person.mother_name ?? "").trim(),
        spouseName: String(person.spouseName ?? person.spouse_name ?? "").trim(),
        photo: String(person.photo ?? person.photoUrl ?? "").trim(),
        notes: String(person.notes ?? "").trim(),
        birthDate: String(person.birthDate ?? person.birth_date ?? "").trim(),
        deathDate: String(person.deathDate ?? person.death_date ?? "").trim(),
        gender: String(person.gender ?? "").trim()
    };
}

export async function loadPeople() {
    const data = await request("GET");
    return normalizeResponse(data).map(normalizePerson);
}

export async function createPerson(person) {
    const data = await request("POST", { action: "create", person });
    return data;
}

export async function updatePerson(person) {
    return request("POST", { action: "update", person });
}

export async function deletePerson(id) {
    return request("POST", { action: "delete", id });
}

export async function ping() {
    try {
        await request("GET");
        return true;
    } catch {
        return false;
    }
}
