import { TravelMenu } from "./travel-menu.js";
import { TravelMarkdownView } from "./travel-markdown-view.js";
import { Trip } from "../objects/trip.js";
import { updateElementsFromObject, registerCustomElements } from "../objects/utils.js";

registerCustomElements([
  ["travel-markdown-view", TravelMarkdownView],
  ["travel-menu", TravelMenu],
]);

export class TripView extends HTMLElement {
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

        main h1 {
          margin: .5rem 0;
          font-size: 1.5rem;
          font-weight: 900;
          color: var(--secondary-dark);
        }

        main h2 {
          margin: .5rem 0;
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--secondary-dark);
        }

        main h3 {
          margin: .5rem 0;
          font-size: 1.1rem;
          font-weight: 500;
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
      </style>
      <div class="content">
        <header>
          <a id="details" href="/trip/${object._id}">
            <h2 id="title"></h2>
          </a>
          <travel-menu style="secondary">
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
        <main>
          <travel-markdown-view id="description" data-style="secondary"></travel-markdown-view>
        </main>
      </div>
    `;

    this.shadowRoot.querySelector("#button_edit").addEventListener("click", () => editCb(object));
    this.shadowRoot.querySelector("#button_delete").addEventListener("click", () => deleteCb(object));

    updateElementsFromObject(object, Trip, this.shadowRoot);
  }
}

customElements.define("trip-view", TripView);
