/**
 * ==========================================================
 * Family Tree v2
 * dialog.js
 * Universal Dialog Manager
 * ==========================================================
 */

class DialogManager {

    constructor() {

        this.dialog = document.querySelector("#appDialog");

        this.title = document.querySelector("#dialogTitle");

        this.body = document.querySelector("#dialogBody");

        this.footer = document.querySelector("#dialogFooter");

        this.bind();

    }

    bind() {

        if (!this.dialog) return;

        this.dialog.addEventListener("click", e => {

            if (e.target === this.dialog) {

                this.close();

            }

        });

        this.dialog
            .querySelector("[data-close]")
            ?.addEventListener("click", () => {

                this.close();

            });

    }

    /* ==========================================
       OPEN
    ========================================== */

    open(options = {}) {

        this.title.textContent = options.title || "";

        this.body.innerHTML = "";

        this.footer.innerHTML = "";

        if (typeof options.content === "string") {

            this.body.innerHTML = options.content;

        }

        else if (options.content instanceof HTMLElement) {

            this.body.appendChild(options.content);

        }

        (options.actions || []).forEach(action => {

            const button = document.createElement("button");

            button.className =
                action.className || "btn";

            button.textContent = action.label;

            button.addEventListener("click", () => {

                if (action.onClick) {

                    action.onClick();

                }

            });

            this.footer.appendChild(button);

        });

        this.dialog.showModal();

    }

    /* ==========================================
       ALERT
    ========================================== */

    alert(title, message) {

        this.open({

            title,

            content: `<p>${message}</p>`,

            actions: [

                {

                    label: "OK",

                    className: "btn btn-primary",

                    onClick: () => this.close()

                }

            ]

        });

    }

    /* ==========================================
       CONFIRM
    ========================================== */

    confirm(title, message, callback) {

        this.open({

            title,

            content: `<p>${message}</p>`,

            actions: [

                {

                    label: "Batal",

                    className: "btn",

                    onClick: () => this.close()

                },

                {

                    label: "Ya",

                    className: "btn btn-danger",

                    onClick: () => {

                        this.close();

                        callback?.();

                    }

                }

            ]

        });

    }

    /* ==========================================
       CLOSE
    ========================================== */

    close() {

        if (this.dialog.open) {

            this.dialog.close();

        }

    }

}

export const Dialog = new DialogManager();
