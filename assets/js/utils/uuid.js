/**
 * ==========================================================
 * Family Tree v2
 * uuid.js
 * UUID Utility
 * ==========================================================
 */

/* ==========================================================
   UUID
========================================================== */

export function uuid() {

    if (

        typeof crypto !== "undefined" &&

        typeof crypto.randomUUID === "function"

    ) {

        return crypto.randomUUID();

    }

    return (

        Date.now().toString(36) +

        Math.random()

            .toString(36)

            .substring(2, 11)

    ).toUpperCase();

}

/* ==========================================================
   MEMBER ID
========================================================== */

export function createMemberId(prefix = "M") {

    return (

        prefix +

        "-" +

        uuid()

            .substring(0, 8)

    ).toUpperCase();

}
