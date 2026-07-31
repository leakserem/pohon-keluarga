/**
 * ==========================================================
 * Family Tree v2
 * avatar.js
 * ==========================================================
 */

export function createAvatar(person = {}) {

    const avatar = document.createElement("div");

    avatar.className = "tree-avatar";

    avatar.textContent = getInitials(person.fullName);

    return avatar;

}

export function getInitials(name = "") {

    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(word => word.charAt(0).toUpperCase())
        .join("");

}
