import { TravelPositionEdit } from "./travel-position-edit.js";
import { Location } from "../objects/location.js";

export class LocationEdit extends HTMLElement {
  #object = null;
  #cb = null;
  #id = null;

  constructor() {
    super();

    this.#id = crypto.randomUUID();
    
    const shadowRoot = this.attachShadow({ mode: "open" });
  }

  #render() {
    const subtypes = Location.meta.properties.subtype.options;

    return /*html*/ `
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

        header input {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--secondary-dark);
          width: calc(100% - 0.5rem);
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

        main {
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        main textarea {
          height: 400px;
          width: calc(100% - 0.5rem);
        }

        p {
          background-color: #aaa;
          padding: 5px;
        }

        button svg {
          width: 24px;
          height: 24px;
        }

        #map_${this.#id} {
          height: 350px;
        }
      </style>
      <dialog id="dialog">
        <div class="content">
          <header>
            <input id="title"/>
          </header>
          <main>
            <label for="subtype">Type</label>
            <select id="subtype">
              <option value="">&lt;none&gt;</option>
              ${Object.keys(subtypes).map((key) => `<option value="${key}" ${this.#object.subtype === key ? "selected" : ""}>${subtypes[key].name}</option>`).join("")}
            </select>
            <label for="description">Description</label>
            <textarea id="description"></textarea>
            <travel-position-edit id="position" value="${JSON.stringify(this.#object.position)}"></travel-position-edit>
          </main>
          <footer>
            <button id="button_save" class="action" onclick="this.getRootNode().host.editOk(event)">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
            </button>
            <button id="button_cancel" class="action" onclick="this.getRootNode().host.editCancel(event)">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
            </button>
          </footer>
        </div>
      </dialog>
    `;
  }

  edit_object(obj, cb) {
    this.#object = obj;
    this.#cb = cb;
    this.shadowRoot.innerHTML = this.#render();
    this.#object_to_elements();
    this.shadowRoot.querySelector("#dialog").showModal();
  }

  editOk() {
    this.shadowRoot.querySelector("#dialog").close();
    this.#elements_to_object();
    this.#cb(this.#object);
  }

  editCancel() {
    this.shadowRoot.querySelector("#dialog").close();
  }

  #object_to_elements() {
    Object.keys(Location.meta.properties).forEach((key) => {
      if (["string", "markdown", "position"].includes(Location.meta.properties[key].type)) {
        let element = this.shadowRoot.querySelector("#" + key);

        if (element && this.#object.hasOwnProperty(key)) {
          element.value = this.#object[key];
        }
      }
    });
  }

  #elements_to_object() {
    Object.keys(Location.meta.properties).forEach((key) => {
      if (["string", "markdown", "position"].includes(Location.meta.properties[key].type)) {
        let element = this.shadowRoot.querySelector("#" + key);
  
        if (element) {
          this.#object[key] = element.value;
        }
      }
    });

    this.#object.subtype = this.shadowRoot.querySelector("#subtype").value;
  }
}

customElements.define("location-edit", LocationEdit);
