import { TripView } from "./trip-view.js";

export class TravelList extends HTMLElement {
  #types = null;

  constructor(types) {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });

    shadowRoot.innerHTML = /*html*/ `
      <style>
        p {
          color: white;
          background-color: #666;
          padding: 5px;
        }
      </style>
    `;

    this.#types = types;
  }

  set objects(objects) {
    this.shadowRoot.innerHTML = "";

    objects.forEach((object) => {
      let config = this.#types[object.type];

      if (config) {
        this.shadowRoot.appendChild(new config.view(object, config.editCb, config.deleteCb));
      }
    });
  }
}

customElements.define("travel-list", TravelList);
