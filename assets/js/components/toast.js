/**
 * ==========================================================
 * Family Tree v2
 * toast.js
 * Global Toast Notification
 * ==========================================================
 */

class ToastManager {

    constructor() {

        this.container = document.querySelector("#toastContainer");

        if (!this.container) {

            this.container = document.createElement("div");

            this.container.id = "toastContainer";

            this.container.className = "toast-container";

            document.body.appendChild(this.container);

        }

    }

    /* ==========================================
       PUBLIC
    ========================================== */

    success(message, duration = 3000) {

        this.show("success", message, duration);

    }

    error(message, duration = 5000) {

        this.show("error", message, duration);

    }

    warning(message, duration = 4000) {

        this.show("warning", message, duration);

    }

    info(message, duration = 3000) {

        this.show("info", message, duration);

    }

    /* ==========================================
       CREATE
    ========================================== */

    show(type, message, duration) {

        const toast = document.createElement("div");

        toast.className = `toast toast-${type}`;

        toast.innerHTML = `

            <div class="toast-icon">

                ${this.icon(type)}

            </div>

            <div class="toast-content">

                <div class="toast-message">

                    ${this.escape(message)}

                </div>

                <div class="toast-progress"></div>

            </div>

            <button class="toast-close">

                ×

            </button>

        `;

        this.container.appendChild(toast);

        const progress = toast.querySelector(".toast-progress");

        progress.style.animationDuration = duration + "ms";

        toast.querySelector(".toast-close")

            .addEventListener("click", () => {

                this.remove(toast);

            });

        setTimeout(() => {

            this.remove(toast);

        }, duration);

    }

    /* ==========================================
       REMOVE
    ========================================== */

    remove(toast) {

        if (!toast) return;

        toast.classList.add("toast-hide");

        setTimeout(() => {

            toast.remove();

        }, 250);

    }

    /* ==========================================
       ICON
    ========================================== */

    icon(type) {

        switch (type) {

            case "success":

                return "✅";

            case "error":

                return "❌";

            case "warning":

                return "⚠️";

            default:

                return "ℹ️";

        }

    }

    /* ==========================================
       ESCAPE
    ========================================== */

    escape(text = "") {

        const div = document.createElement("div");

        div.textContent = text;

        return div.innerHTML;

    }

}

export const Toast = new ToastManager();
