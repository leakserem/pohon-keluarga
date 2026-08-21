/**
 * Family Tree v2.3 - Descendant collapse state
 */

const collapsedIds = new Set();

export function isCollapsed(personId) {
    return collapsedIds.has(String(personId ?? ""));
}

export function toggleCollapsed(personId) {
    const id = String(personId ?? "");
    if (!id) return false;

    if (collapsedIds.has(id)) {
        collapsedIds.delete(id);
        return false;
    }

    collapsedIds.add(id);
    return true;
}

export function setCollapsed(personId, collapsed = true) {
    const id = String(personId ?? "");
    if (!id) return;
    if (collapsed) collapsedIds.add(id);
    else collapsedIds.delete(id);
}

export function clearCollapsed() {
    collapsedIds.clear();
}

export function getCollapsedIds() {
    return [...collapsedIds];
}
