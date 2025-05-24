import { TravelAttachmentsView } from "./travel-attachments-view.js";
import { Repo } from "../repo.js";
import { Location } from "../objects/location.js";
import { TravelMarkdownView } from "./travel-markdown-view.js";
import { registerCustomElements, updateElementsFromObject } from "../objects/utils.js";
import { TravelMenu } from "./travel-menu.js";

registerCustomElements([
  ["travel-markdown-view", TravelMarkdownView],
  ["travel-attachments-view", TravelAttachmentsView],
  ["travel-menu", TravelMenu],
]);

export class LocationView extends HTMLElement {
  constructor(object, editCb, deleteCb) {
    super();

    const shadowRoot = this.attachShadow({ mode: "open", slotAssignment: "manual" });
    shadowRoot.innerHTML = /*html*/ `
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

        div.title {
          display: flex;
          flex-direction: row;
          align-items: start;
        }

        .action {
          flex-grow: 1;
        }

        a {
          text-decoration: none;
        }

        h2 {
          margin: 0;
          font-weight: 700;
          color: var(--secondary-dark);
        }

        header {
          background: linear-gradient(45deg, var(--secondary-light), var(--secondary));
          padding: 0.5rem;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: baseline;
          color: var(--secondary-dark);
        }

        div#icon svg {
          margin-right: 0.5rem;
          fill: var(--secondary-dark);
          stroke: var(--secondary-dark);
          height: 1.5rem;
          width: 1.5rem;
        }
      </style>
      <div class="content">
        <header>
          <div class="title">
            <div id="icon">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#143f52"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 400Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Z"/></svg>
            </div>
            <h2 id="title"></h2>
          </div>
          <travel-menu style="secondary">
            <li id="button_edit">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
              edit
            </li>
            <li id="button_om_link">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m600-120-240-84-186 72q-20 8-37-4.5T120-170v-560q0-13 7.5-23t20.5-15l212-72 240 84 186-72q20-8 37 4.5t17 33.5v560q0 13-7.5 23T812-192l-212 72Zm-40-98v-468l-160-56v468l160 56Zm80 0 120-40v-474l-120 46v468Zm-440-10 120-46v-468l-120 40v474Zm440-458v468-468Zm-320-56v468-468Z"/></svg>
              open in organic maps
            </li>
            <li id="button_delete">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
              delete
            </li>
          </travel-menu>
        </header>
        <main>
          <travel-markdown-view id="description" data-style="secondary"></travel-markdown-view>
        </main>
        <travel-attachments-view id="attachments" data-style="secondary"></travel-attachments-view>
      </div>
    `;

    this.shadowRoot.querySelector("#button_edit")
      .addEventListener("click", () => editCb(object));
    this.shadowRoot.querySelector("#button_delete")
      .addEventListener("click", () => deleteCb(object));
    this.shadowRoot.querySelector("#button_om_link")
      .addEventListener("click", () => {
        window.open(`om://map?v=1&ll=${object.position[1]},${object.position[0]}&n=${encodeURIComponent(object.title)}`)
    });
    this.shadowRoot.querySelector("travel-attachments-view").addEventListener("open-attachment", (event) => {
      this.openAttachment(object._id, event.detail.attachment);
    });

    this.update(object);
  }

  update(object) {
    updateElementsFromObject(object, Location, this.shadowRoot);

    if (object.subtype) {
      let option = Location.meta.properties.subtype.options[object.subtype];

      if (option) {
        this.shadowRoot.querySelector("#icon").innerHTML = option.icon;
      }
    }
  }

  async openAttachment(objectId, attachment) {
    let repo = await new Repo();
    let attachmentObj = await repo.getAttachment(objectId, attachment);

    const url = URL.createObjectURL(attachmentObj);
    window.open(url, "_blank");
    URL.revokeObjectURL(url);
  }
  
}

customElements.define("location-view", LocationView);
