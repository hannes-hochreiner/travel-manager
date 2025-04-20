export class TripEdit extends HTMLElement {
  #object = null;
  #cb = null;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = /*html*/ `
      <style>
        dialog {
          padding: 0;
        }

        div.content {
          display: flex;
          flex-direction: column;
          border: 1px solid;
        }

        header input {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--secondary-dark);
          width: calc(100% - 1rem);
          background-color: var(--secondary-light);
        }

        header {
          background-color: var(--secondary-light);
          padding: 0.5rem;
        }

        footer {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }

        .action {
          flex-grow: 1;
        }

        main textarea {
          height: 400px;
          width: 350px;
        }

        p {
          background-color: #aaa;
          padding: 5px;
        }

        button svg {
          width: 24px;
          height: 24px;
        }
      </style>
      <dialog id="dialog">
        <div class="content">
          <header>
            <input id="title" />
          </header>
          <main>
            <textarea id="description"></textarea>
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
  }

  set show(show) {
    if (show) {
      this.shadowRoot.querySelector("#dialog").showModal();
    } else {
      this.shadowRoot.querySelector("#dialog").close();
    }
  }

  set object(object) {
    this.#object = object;
    this.#object_to_elements();
  }

  edit_object(obj, cb) {
    this.#object = obj;
    this.#cb = cb;
    this.#object_to_elements();
    this.shadowRoot.querySelector("#dialog").showModal();
  }

  #edit_ok() {
    this.shadowRoot.querySelector("#dialog").close();
    this.#elements_to_object();
    this.#cb(this.#object);
  }

  #edit_cancel() {
    this.shadowRoot.querySelector("#dialog").close();
  }

  #object_to_elements() {
    Object.keys(this.#object).forEach((key) => {
      let element = this.shadowRoot.querySelector("#" + key);

      if (element) {
        element.value = this.#object[key];
      }
    });
  }

  #elements_to_object() {
    Object.keys(this.#object).forEach((key) => {
      let element = this.shadowRoot.querySelector("#" + key);

      if (element) {
        this.#object[key] = element.value;
      }
    });
  }

  connectedCallback() {
    this.shadowRoot.querySelector("#button_save")
      .addEventListener("click", () => this.#edit_ok());
    this.shadowRoot.querySelector("#button_cancel")
      .addEventListener("click", () => this.#edit_cancel());
  }
}

customElements.define("trip-edit", TripEdit);
