import { ElementCache } from "./element-cache.js";

export class TravelView extends HTMLElement {
  // static observedAttributes = ["color", "size"];
  // #object = null;
  // #editCb = null;
  // #deleteCb = null;
  #ec = null;

  constructor(object, editCb, deleteCb) {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = /*html*/ `
      <style>
        div.content {
          display: flex;
          flex-direction: column;
          margin: 0.5rem 0;
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
          color: var(--dark);
        }

        header {
          background-color: var(--light);
          padding: 0.5rem;
        }

        p {
          padding: 0.5rem;
          margin: 0;
        }
      </style>
      <div class="content">
        <header>
          <a id="details">
            <h2 id="title"></h2>
          </a>
        </header>
        <main>
          <p id="description"></p>
        </main>
        <footer>
          <button id="button_edit" class="action">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
          </button>
          <button id="button_delete" class="action">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
          </button>
        </footer>
      </div>
    `;

    this.#ec = new ElementCache(this.shadowRoot);
    this.#ec
      .get("#button_edit")
      .addEventListener("click", () => editCb(object));
      this.#ec
      .get("#button_delete")
      .addEventListener("click", () => deleteCb(object));

    this.update(object);
  }

  update(object) {
    Object.keys(object).forEach((key) => {
      let element = this.shadowRoot.querySelector("#" + key);

      if (element) {
        if (key === "description") {
          element.innerHTML = marked.parse(object[key]);
        } else {
          element.innerHTML = object[key];
        }
      }
    });

    this.shadowRoot.querySelector("#details").setAttribute(
      "href",
      "/travel/" + object._id
    );
  }
}

customElements.define("travel-view", TravelView);
