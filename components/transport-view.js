import { TravelAttachmentsView } from "./travel-attachments-view.js";
import { Repo } from "../repo.js";
import { TravelMenu } from "./travel-menu.js";
import { registerCustomElements, updateElementsFromObject } from "../objects/utils.js";
import { TravelMarkdownView } from "./travel-markdown-view.js";
import { Transport } from "../objects/transport.js";

registerCustomElements([
  ["travel-menu", TravelMenu],
  ["travel-attachments-view", TravelAttachmentsView],
  ["travel-markdown-view", TravelMarkdownView],
]);

export class TransportView extends HTMLElement {
  #object = null;
  #editCb = null;
  #deleteCb = null;
  #icons = {};

  constructor(object, editCb, deleteCb) {
    super();

    const shadowRoot = this.attachShadow({ mode: "open", slotAssignment: "manual" });

    this.#object = object;
    this.#editCb = editCb;
    this.#deleteCb = deleteCb;
  }

  #render() {
    return /*html*/ `
      <style>
        div.content {
          display: flex;
          flex-direction: column;
          border: 1px solid;
        }

        footer {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }

        a {
          text-decoration: none;
        }

        h2 {
          margin: 0;
          font-weight: 700;
          color: var(--primary-dark);
        }

        h2#title::before {
          content: url(${this.#icons.transport});
        }

        ${Object.entries(Transport.meta.properties.subtype.options).map(entry => {
          return /*html*/ `
            h2#title.subtype_${entry[0]}::before {
              content: url(${this.#icons[`subtype_${entry[0]}`]});
            }
          `
        }).join("\n")}

        header {
          background: linear-gradient(45deg, var(--primary-light), var(--primary));
          padding: 0.5rem;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: baseline;
          color: var(--primary-dark);
        }

        .duration {
          display: flex;
          flex-direction: row;
          justify-content: space-around;
          align-items: center;
          margin: 0.5rem;
        }

        div.date::before {
          content: url(${this.#icons.calendar});
        }

        ::before {
          padding-right: 0.5rem;
          display: inline-block;
          vertical-align: middle;
        }
      </style>
      <div class="content">
        <header>
          <h2 id="title" class="subtype_${this.#object.subtype}"></h2>
          <travel-menu>
            <li id="button_edit">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
              edit
            </li>
            <li id="button_delete">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
              delete
            </li>
          </travel-menu>
        </header>
        <div class="duration">
          <div id="startDateTime" class="date"></div>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"/></svg>
          <div id="endDateTime" class="date"></div>
        </div>
        <travel-markdown-view data-style="primary" id="description"></travel-markdown-view>
        <travel-attachments-view data-style="primary" id="attachments"></travel-attachments-view>
      </div>
    `;
  }

  connectedCallback() {
    this.#icons = {
      "calendar": URL.createObjectURL(new Blob([`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/></svg>`], {type: 'image/svg+xml'})),
      "transport": URL.createObjectURL(new Blob([`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m770-120-56-56 63-64H610v-80h167l-63-64 56-56 160 160-160 160ZM400-360q56 0 101-27.5t71-72.5q-35-29-79-44.5T400-520q-49 0-93 15.5T228-460q26 45 71 72.5T400-360Zm0-200q33 0 56.5-23.5T480-640q0-33-23.5-56.5T400-720q-33 0-56.5 23.5T320-640q0 33 23.5 56.5T400-560Zm0 67Zm0 413Q239-217 159.5-334.5T80-552q0-150 96.5-239T400-880q127 0 223.5 89T720-552q0 9-.5 18.5T717-514h-81q2-10 3-19.5t1-18.5q0-109-69.5-178.5T400-800q-101 0-170.5 69.5T160-552q0 71 59 162.5T400-186q23-20 42.5-40t37.5-39l9 9 19.5 19.5q10.5 10.5 19 19.5l8.5 9q-29 31-63 63t-73 65Z"/></svg>`], {type: 'image/svg+xml'})),
    }
    
    Object.entries(Transport.meta.properties.subtype.options).forEach(entry => {
      this.#icons[`subtype_${entry[0]}`] = URL.createObjectURL(new Blob([entry[1].icon], {type: 'image/svg+xml'}));
    });

    this.shadowRoot.innerHTML = this.#render();
    updateElementsFromObject(this.#object, Transport, this.shadowRoot);

    this.shadowRoot.querySelector("travel-attachments-view").addEventListener("open-attachment", (event) => {
      this.openAttachment(this.#object._id, event.detail.attachment);
    });
    this.shadowRoot.querySelector("#button_edit")
      .addEventListener("click", () => this.#editCb(this.#object));
    this.shadowRoot.querySelector("#button_delete")
      .addEventListener("click", () => this.#deleteCb(this.#object));

  }

  disconnectedCallback() {
    Object.keys(this.#icons).forEach(key => URL.revokeObjectURL(this.#icons[key]));
    this.#icons = {};
  }

  async openAttachment(objectId, attachment) {
    let repo = await new Repo();
    let attachmentObj = await repo.getAttachment(objectId, attachment);

    const url = URL.createObjectURL(attachmentObj);
    window.open(url, "_blank");
    URL.revokeObjectURL(url);
  }
}
