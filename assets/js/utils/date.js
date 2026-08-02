/**
 * ==========================================================
 * Family Tree v2
 * date.js
 * Date Utility
 * ==========================================================
 */

/* ==========================================================
   TODAY
========================================================== */

export function today() {

    return new Date();

}

/* ==========================================================
   FORMAT
========================================================== */

export function formatDate(value) {

    if (!value)

        return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime()))

        return "-";

    return new Intl.DateTimeFormat(

        "id-ID",

        {

            day: "2-digit",

            month: "long",

            year: "numeric"

        }

    ).format(date);

}

/* ==========================================================
   YEAR
========================================================== */

export function getYear(value) {

    if (!value)

        return null;

    const date = new Date(value);

    if (Number.isNaN(date.getTime()))

        return null;

    return date.getFullYear();

}

/* ==========================================================
   AGE
========================================================== */

export function getAge(value) {

    if (!value)

        return null;

    const birth = new Date(value);

    if (Number.isNaN(birth.getTime()))

        return null;

    const now = new Date();

    let age =

        now.getFullYear() -

        birth.getFullYear();

    const month =

        now.getMonth() -

        birth.getMonth();

    if (

        month < 0 ||

        (

            month === 0 &&

            now.getDate() < birth.getDate()

        )

    ) {

        age--;

    }

    return age;

}

/* ==========================================================
   ISO
========================================================== */

export function toISO(value = new Date()) {

    const date =

        value instanceof Date

            ? value

            : new Date(value);

    return date

        .toISOString()

        .split("T")[0];

}

/* ==========================================================
   VALIDATE
========================================================== */

export function isValidDate(value) {

    if (!value)

        return false;

    return !Number.isNaN(

        new Date(value).getTime()

    );

}
