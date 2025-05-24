import { TravelPositionEdit } from "./travel-position-edit.js";
import { Transport } from "../objects/transport.js";
import { Repo } from "../repo.js";
import { escapeHtml } from "../objects/utils.js";
import { TravelAttachmentsEdit } from "./travel-attachments-edit.js";

if (!customElements.get("travel-attachments-edit")) {
  customElements.define("travel-attachments-edit", TravelAttachmentsEdit);
}

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

        div.attachments {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        div.attachments div.attachment {
          display: flex;
          flex-direction: row;
          gap: 0.5rem;
        }

        button svg {
          width: 24px;
          height: 24px;
        }

        button.deleted svg {
          fill: var(--tertiary-dark);
        }

        button.deleted {
          background-color: var(--tertiary-light);
        }

        #map_${this.#id} {
          height: 350px;
        }
      </style>
      <dialog id="dialog">
        <div class="content">
          <header>
            <input id="title" value="${escapeHtml(this.#object.title)}"/>
          </header>
          <main>
            <fieldset>
              <label for="type">Type</label>
              <select id="subtype">${this.renderTypeOptions()}</select>
            </fieldset>
            <fieldset>
              <legend>Start</legend>
              <label for="startDatetime">Start Date and Time</label>
              <input id="startDatetime" type="datetime-local" value="${escapeHtml(this.#object.startDateTime)}"/>
              <travel-position-edit id="startPosition" value="${this.#object.startPosition}"></travel-position-edit>
            </fieldset>
            <textarea id="description">${escapeHtml(this.#object.description)}</textarea>
            <travel-attachments-edit></travel-attachments-edit>
            <fieldset>
              <legend>End</legend>
              <label for="endDatetime">End Date and Time</label>
              <input id="endDatetime" type="datetime-local" value="${escapeHtml(this.#object.endDateTime)}"/>
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
    this.shadowRoot.querySelector("travel-attachments-edit").attachments = this.#object._attachments;

    return new Promise((resolve, reject) => {
      this.#resolve = resolve;
      this.#reject = reject;
      this.shadowRoot.querySelector("#dialog").showModal();
    });
  }

  async edit_ok() {
    this.shadowRoot.querySelector("#dialog").close();

    let repo = await new Repo();

    this.#object.title = this.shadowRoot.querySelector("#title").value;
    this.#object.startDateTime = this.shadowRoot.querySelector("#startDatetime").value;
    this.#object.startPosition = this.shadowRoot.querySelector("#startPosition").value;
    this.#object.description = this.shadowRoot.querySelector("#description").value;
    this.#object.endDateTime = this.shadowRoot.querySelector("#endDatetime").value;
    this.#object.endPosition = this.shadowRoot.querySelector("#endPosition").value;
    this.#object.subtype = this.shadowRoot.querySelector("#subtype").value;

    let attachmentsEdit = this.shadowRoot.querySelector("travel-attachments-edit");

    this.#object._attachments = attachmentsEdit.attachments;

    await repo.addDoc(this.#object);

    this.#resolve({action: "update"});
  }

  edit_cancel() {
    this.shadowRoot.querySelector("#dialog").close();
    this.#resolve({action: "cancel"});
  }
}
