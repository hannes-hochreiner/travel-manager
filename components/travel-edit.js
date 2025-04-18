import { ElementCache } from "../element-cache.js";

export class TravelEdit extends HTMLElement {
  // static observedAttributes = ["id", "show"];
  #object = null;
  #ec = null;
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
    this.#ec = new ElementCache(this.shadowRoot);
  }


  // save() {
  //   (async () => {
  //     try {
  //       const db = new PouchDB("travel");
  //       await db.put({
  //         _id: crypto.randomUUID(),
  //         type: "travel",
  //         title: this.shadowRoot.querySelector("#title").value,
  //         description: this.shadowRoot.querySelector("#description").value,
  //       });

  //       this.show = false;
  //       console.log("saved");
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   })();
  // }

  set show(show) {
    if (show) {
      this.#ec.get("#dialog").showModal();
    } else {
      this.#ec.get("#dialog").close();
    }
  }

  set object(object) {
    // console.log(object);
    this.#object = object;
    this.#object_to_elements();
  }

  edit_object(obj, cb) {
    this.#object = obj;
    this.#cb = cb;
    this.#object_to_elements();
    this.#ec.get("#dialog").showModal();
  }

  #edit_ok() {
    this.#ec.get("#dialog").close();
    this.#elements_to_object();
    this.#cb(this.#object);
  }

  #edit_cancel() {
    this.#ec.get("#dialog").close();
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
      let element = this.#ec.get("#" + key);

      if (element) {
        this.#object[key] = element.value;
      }
    });
  }

  connectedCallback() {
    console.log("TravelEdit added to page.");
    this.#ec
      .get("#button_save")
      .addEventListener("click", () => this.#edit_ok());
    this.#ec
      .get("#button_cancel")
      .addEventListener("click", () => this.#edit_cancel());
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Attribute ${name} has changed.`);
  }
}

customElements.define("travel-edit", TravelEdit);
