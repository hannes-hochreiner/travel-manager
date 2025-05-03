import { TripView } from "./trip-view.js";

export class TravelList extends HTMLElement {
  #types = null;

  constructor(types) {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });

    shadowRoot.innerHTML = this.#style();

    this.#types = types;
  }

  #style() {
    return /*html*/ `
      <style>
        p {
          color: white;
          background-color: #666;
          padding: 5px;
        }

        :host {
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(auto-fit, minmax(25rem, 1fr));
          margin-top: 1rem;
        }
      </style>
    `;
  }

  set objects(objects) {
    this.shadowRoot.innerHTML = this.#style();

    objects.forEach((object) => {
      let config = this.#types[object.type];

      if (config) {
        this.shadowRoot.appendChild(new config.view(object, config.editCb, config.deleteCb));
      }
    });
  }
}

customElements.define("travel-list", TravelList);
