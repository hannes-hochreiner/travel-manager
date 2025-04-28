export class TravelConfirmation extends HTMLElement {
  #cb = null;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = /*html*/ `
      <style>
        dialog {
          padding: 0;
          width: calc(100% - 1rem);
        }

        div.content {
          display: flex;
          flex-direction: column;
          border: 1px solid;
        }

        header {
          background: linear-gradient(45deg, var(--tertiary-light), var(--tertiary));
          padding: 0.5rem;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--tertiary-dark);
        }

        footer {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }

        .action {
          flex-grow: 1;
        }

        main {
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        p {
          background-color: #aaa;
          padding: 5px;
        }
      </style>
      <dialog id="dialog">
        <div class="content">
          <header>
            <slot name="title"></slot>
          </header>
          <main>
            <slot name="message"></slot>
          </main>
          <footer>
            <button id="button_save" class="action">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
            </button>
            <button id="button_cancel" class="action">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
            </button>
          </footer>
        </div>
      </dialog>
    `;
    this.shadowRoot.querySelector("#button_save")
      .addEventListener("click", () => {
        this.shadowRoot.querySelector("#dialog").close();
        this.#cb();
        this.#cb = null;
      });
    this.shadowRoot.querySelector("#button_cancel")
      .addEventListener("click", () => {
        this.shadowRoot.querySelector("#dialog").close()
        this.#cb = null;
      });
  }

  set confirm(cb) {
    this.#cb = cb;
    this.shadowRoot.querySelector("#dialog").showModal();
  }
}

customElements.define("travel-confirmation", TravelConfirmation);
