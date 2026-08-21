/**
 * Family Tree v2.2
 * Sliding left/right panels + centered header.
 */

const STYLE_ID = "family-tree-panel-slider-style";
const LEFT_ID = "panelLeftToggle";
const RIGHT_ID = "panelRightToggle";

export function initializePanelSlider() {
    injectStyles();
    ensureButtons();

    const appLayout = document.querySelector("#appLayout");
    const sidebar = document.querySelector("#sidebar");
    const detailPanel = document.querySelector("#detailPanel");

    if (!appLayout || !sidebar || !detailPanel) return;

    const setOpen = (side, open) => {
        appLayout.classList.toggle(side === "left" ? "left-panel-open" : "right-panel-open", open);
        localStorage.setItem(`familyTree.${side}Panel`, open ? "open" : "closed");
        updateButtonState();
    };

    const savedLeft = localStorage.getItem("familyTree.leftPanel");
    const savedRight = localStorage.getItem("familyTree.rightPanel");

    setOpen("left", savedLeft !== "closed");
    setOpen("right", savedRight === "open");

    document.getElementById(LEFT_ID)?.addEventListener("click", () => {
        setOpen("left", !appLayout.classList.contains("left-panel-open"));
    });

    document.getElementById(RIGHT_ID)?.addEventListener("click", () => {
        setOpen("right", !appLayout.classList.contains("right-panel-open"));
    });

    function updateButtonState() {
        const leftOpen = appLayout.classList.contains("left-panel-open");
        const rightOpen = appLayout.classList.contains("right-panel-open");
        const leftButton = document.getElementById(LEFT_ID);
        const rightButton = document.getElementById(RIGHT_ID);

        if (leftButton) {
            leftButton.textContent = leftOpen ? "‹" : "›";
            leftButton.setAttribute("aria-label", leftOpen ? "Tutup panel kiri" : "Buka panel kiri");
            leftButton.title = leftOpen ? "Tutup panel kiri" : "Buka panel kiri";
        }

        if (rightButton) {
            rightButton.textContent = rightOpen ? "›" : "‹";
            rightButton.setAttribute("aria-label", rightOpen ? "Tutup panel kanan" : "Buka panel kanan");
            rightButton.title = rightOpen ? "Tutup panel kanan" : "Buka panel kanan";
        }
    }

    updateButtonState();
}

function ensureButtons() {
    const toolbar = document.querySelector("#toolbar");
    if (!toolbar) return;

    if (!document.getElementById(LEFT_ID)) {
        const button = document.createElement("button");
        button.id = LEFT_ID;
        button.className = "btn panel-toggle panel-toggle-left";
        button.type = "button";
        toolbar.prepend(button);
    }

    if (!document.getElementById(RIGHT_ID)) {
        const button = document.createElement("button");
        button.id = RIGHT_ID;
        button.className = "btn panel-toggle panel-toggle-right";
        button.type = "button";
        toolbar.append(button);
    }
}

function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
        :root {
            --panel-left-width: 320px;
            --panel-right-width: 340px;
            --panel-slide-duration: 280ms;
        }

        body {
            overflow: hidden;
        }

        .topbar {
            position: relative;
            display: grid !important;
            grid-template-columns: 1fr auto 1fr;
            align-items: center;
            min-height: 64px;
        }

        .topbar .brand {
            justify-self: start;
        }

        .topbar .toolbar {
            grid-column: 2;
            justify-self: center;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            flex-wrap: nowrap;
        }

        .app-layout {
            position: relative;
            display: block !important;
            height: calc(100vh - 64px);
            overflow: hidden;
        }

        .app-layout > #treeArea {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            transition: padding-left var(--panel-slide-duration) ease,
                        padding-right var(--panel-slide-duration) ease;
            box-sizing: border-box;
        }

        .app-layout.left-panel-open > #treeArea {
            padding-left: var(--panel-left-width);
        }

        .app-layout.right-panel-open > #treeArea {
            padding-right: var(--panel-right-width);
        }

        .app-layout.left-panel-open.right-panel-open > #treeArea {
            padding-left: var(--panel-left-width);
            padding-right: var(--panel-right-width);
        }

        .app-layout > #sidebar,
        .app-layout > #detailPanel {
            position: absolute !important;
            top: 0;
            bottom: 0;
            height: auto !important;
            z-index: 30;
            box-sizing: border-box;
            transition: transform var(--panel-slide-duration) ease,
                        box-shadow var(--panel-slide-duration) ease;
            will-change: transform;
        }

        .app-layout > #sidebar {
            left: 0;
            width: var(--panel-left-width);
            transform: translateX(-100%);
            border-right: 1px solid var(--color-divider, #ddd);
            box-shadow: 8px 0 24px rgba(0,0,0,.12);
        }

        .app-layout.left-panel-open > #sidebar {
            transform: translateX(0);
        }

        .app-layout > #detailPanel {
            right: 0;
            width: var(--panel-right-width);
            transform: translateX(100%);
            border-left: 1px solid var(--color-divider, #ddd);
            box-shadow: -8px 0 24px rgba(0,0,0,.12);
        }

        .app-layout.right-panel-open > #detailPanel {
            transform: translateX(0);
        }

        .panel-toggle {
            min-width: 38px;
            font-size: 1.35rem;
            line-height: 1;
            position: relative;
            z-index: 100;
        }

        .panel-toggle-left { margin-right: 2px; }
        .panel-toggle-right { margin-left: 2px; }

        @media (max-width: 900px) {
            :root {
                --panel-left-width: min(320px, 86vw);
                --panel-right-width: min(340px, 86vw);
            }

            .topbar {
                grid-template-columns: 1fr;
                padding-block: 8px;
                gap: 8px;
            }

            .topbar .brand,
            .topbar .toolbar {
                grid-column: 1;
                justify-self: center;
            }

            .topbar .brand {
                justify-self: center;
                text-align: center;
            }

            .app-layout {
                height: calc(100vh - 104px);
            }
        }
    `;

    document.head.appendChild(style);
}
