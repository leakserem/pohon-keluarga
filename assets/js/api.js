/**
 * Family Tree v3.2 - API layer
 * Keeps the existing API contract while carrying childOrder and canonical names.
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
                const message = typeof data.error === "object"
                    ? data.error.message
                    : data.error;
                throw new Error(String(message || "Operasi API gagal"));
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

function text(value) {
    return String(value ?? "").trim();
}

function normalizePerson(person = {}) {
    return {
        id: text(person.id),
        fullName: text(person.fullName ?? person.name),
        childOrder: Number.isInteger(Number(person.childOrder)) ? Number(person.childOrder) : 0,
        generation: Number.isInteger(Number(person.generation)) ? Number(person.generation) : 1,
        fatherId: text(person.fatherId ?? person.father_id),
        fatherName: text(person.fatherName ?? person.father_name),
        motherId: text(person.motherId ?? person.mother_id),
        motherName: text(person.motherName ?? person.mother_name),
        spouseId: text(person.spouseId ?? person.spouse_id),
        spouseName: text(person.spouseName ?? person.spouse_name),
        birthDate: text(person.birthDate ?? person.birth_date),
        deathDate: text(person.deathDate ?? person.death_date),
        photo: text(person.photo ?? person.photoUrl),
        Gender: text(person.Gender ?? person.gender),
        CreatedAt: person.CreatedAt ?? person.createdAt ?? "",
        UpdatedAt: person.UpdatedAt ?? person.updatedAt ?? "",
        Source: text(person.Source ?? person.source),
        notes: String(person.notes ?? "")
    };
}

export async function loadPeople() {
    const data = await request("GET");
    return normalizeResponse(data).map(normalizePerson);
}

export async function createPerson(person) {
    return request("POST", { action: "create", person });
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

export { normalizePerson };
