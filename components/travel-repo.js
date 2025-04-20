import { TravelRouter } from "./travel-router.js";
import { Repo } from "../repo.js";

export class TravelRepo extends HTMLElement {
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
  }

  async connectedCallback() {
    try {
      this.#repo = await Repo.create();

      let travelRouter = new TravelRouter(this.#repo);
      this.appendChild(travelRouter);
      this.shadowRoot.querySelector("slot").assign(travelRouter);
    } catch (err) {
      console.log(err);
    }
  }
}

customElements.define("travel-repo", TravelRepo);
