import { TravelPositionEdit } from "./travel-position-edit.js";
import { Transport } from "../objects/transport.js";

export class TransportEdit extends HTMLElement {
  #object = null;
  #id = null;
  #resolve = null;
  #reject = null;

  constructor() {
    super();

    this.#id = crypto.randomUUID();
    
    const shadowRoot = this.attachShadow({ mode: "open" });
  }

  #render () {
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
          color: var(--primary-dark);
          width: calc(100% - 0.5rem);
          background-color: var(--primary-light);
        }

        header {
          background-color: var(--primary-light);
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
            <input id="title" value="${this.#object.title}"/>
          </header>
          <main>
            <fieldset>
              <label for="type">Type</label>
              <select id="type">${this.renderTypeOptions()}</select>
            </fieldset>
            <fieldset>
              <legend>Start</legend>
              <label for="startDatetime">Start Date and Time</label>
              <input id="startDatetime" type="datetime-local" value="${this.#object.startDateTime}"/>
              <travel-position-edit id="startPosition" value="${this.#object.startPosition}"></travel-position-edit>
            </fieldset>
            <textarea id="description">${this.#object.description}</textarea>
            <fieldset>
              <legend>End</legend>
              <label for="endDatetime">End Date and Time</label>
              <input id="endDatetime" type="datetime-local" value="${this.#object.endDateTime}"/>
              <travel-position-edit id="endPosition" value="${this.#object.endPosition}"></travel-position-edit>
            </fieldset>
          </main>
          <footer>
            <button id="button_save" class="action" onclick="this.getRootNode().host.edit_ok()">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
            </button>
            <button id="button_cancel" class="action" onclick="this.getRootNode().host.edit_cancel()">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
            </button>
          </footer>
        </div>
      </dialog>
    `;
  }

  renderTypeOptions() {
    return Object.entries(Transport.meta.properties.subtype.options).map((option) => {
      return /*html*/ `
        <option value="${option[0]}" ${this.#object.subtype === option[0] ? "selected" : ""}>${option[1].name}</option>
      `
    }).join("");
  }

  async edit_object(obj) {
    this.#object = obj;
    this.shadowRoot.innerHTML = this.#render();

    return new Promise((resolve, reject) => {
      this.#resolve = resolve;
      this.#reject = reject;
      this.shadowRoot.querySelector("#dialog").showModal();
    });
  }

  edit_ok() {
    this.shadowRoot.querySelector("#dialog").close();
    this.#object.title = this.shadowRoot.querySelector("#title").value;
    this.#object.startDateTime = this.shadowRoot.querySelector("#startDatetime").value;
    this.#object.startPosition = this.shadowRoot.querySelector("#startPosition").value;
    this.#object.description = this.shadowRoot.querySelector("#description").value;
    this.#object.endDateTime = this.shadowRoot.querySelector("#endDatetime").value;
    this.#object.endPosition = this.shadowRoot.querySelector("#endPosition").value;
    this.#resolve(this.#object);
  }

  edit_cancel() {
    this.shadowRoot.querySelector("#dialog").close();
    this.#resolve();
  }
}
