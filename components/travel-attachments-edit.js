import { escapeHtml } from "../objects/utils.js";

export class TravelAttachmentsEdit extends HTMLElement {
  #attachments = {};
  #deletion = [];

  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
  }

  #render () {
    return /*html*/ `
      <style>
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

        button.deleted svg {
          fill: var(--tertiary-dark);
        }

        button.deleted {
          background-color: var(--tertiary-light);
        }
      </style>
      <fieldset>
        <legend>Attachments</legend>
        <input id="input_files" type="file" multiple>
        <div class="attachments">
          ${this.renderAttachments()}
        </div>
      </fieldset>
    `;
  }

  renderAttachments() {
    return this.#attachments ? Object.entries(this.#attachments).map((attachment) => {
      return /*html*/ `
        <div class="attachment">
          <p>${escapeHtml(attachment[0])}</p>
          <button onclick="this.getRootNode().host.toggleDeletion(this, '${attachment[0]}')">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
          </button>
        </div>
      `
    }).join("") : "";
  }

  toggleDeletion(button, attachment) {
    if (this.#deletion.includes(attachment)) {
      this.#deletion.splice(this.#deletion.indexOf(attachment), 1);
      button.classList.remove("deleted");
    } else {
      this.#deletion.push(attachment);
      button.classList.add("deleted");
    }
  }

  set attachments(attachments) {
    this.#attachments = attachments ? attachments : {};
    this.#deletion = [];
    this.shadowRoot.innerHTML = this.#render();
  }

  get attachments() {
    let attachments = Object.entries(this.#attachments).filter((attachment) => {
      return !this.#deletion.includes(attachment[0]);
    }).reduce((acc, curr) => {
      acc[curr[0]] = curr[1];
      return acc;
    }, {});

    let fileList = this.shadowRoot.querySelector("#input_files").files;

    for (let i = 0; i < fileList.length; i++) {
      attachments[fileList[i].name] = {
        content_type: fileList[i].type,
        data: fileList[i]
      };
    }

    return attachments;
  }
}
