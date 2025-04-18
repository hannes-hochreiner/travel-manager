import { ElementCache } from "../element-cache.js";
import { TravelRouter } from "./travel-router.js";
import { Repo } from "../repo.js";

export class TravelRepo extends HTMLElement {
  #ec = null;
  #repo = null;

  constructor() {
    super();
    const shadowRoot = this.attachShadow({
      mode: "open",
      slotAssignment: "manual",
    });
    shadowRoot.innerHTML = /*html*/ `
      <slot>Loading...</slot>
    `;

    this.#ec = new ElementCache(this.shadowRoot);

    (async () => {
      try {
        this.#repo = await Repo.create();

        let travelRouter = new TravelRouter(this.#repo);
        this.appendChild(travelRouter);
        this.#ec.get("slot").assign(travelRouter);
      } catch (err) {
        console.log(err);
      }
    })();
  }

  connectedCallback() {
    console.log("TravelRepo added to page.");
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

customElements.define("travel-repo", TravelRepo);
