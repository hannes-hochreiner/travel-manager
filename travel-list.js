import { TravelView } from "./travel-view.js";

export class TravelList extends HTMLElement {
  #editCb = null;
  #deleteCb = null;

  constructor(editCb, deleteCb) {
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
      <p>My paragraph</p>
      <a href="/travel/f81d4fae-7dec-11d0-a765-00a0c91e6bf6">link</a>
    `;

    this.#editCb = editCb;
    this.#deleteCb = deleteCb;
  }

  set travels(travels) {
    this.shadowRoot.innerHTML = "";

    travels.forEach((travel) => {
      let travelViewElement = new TravelView(travel, this.#editCb, this.#deleteCb);
      // travelViewElement.object = travel;
      this.shadowRoot.appendChild(travelViewElement);
    });
  }

  connectedCallback() {
    console.log("TravelList added to page.");
  }

  disconnectedCallback() {
    console.log("Custom element removed from page.");
  }

  adoptedCallback() {
    console.log("Custom element moved to new page.");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Attribute ${name} has changed.`);
  }
}

customElements.define("travel-list", TravelList);
