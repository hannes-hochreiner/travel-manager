import { TravelMain } from "../pages/travel-main.js";
import { TravelTrip } from "../pages/travel-trip.js";
import { TravelStay } from "../pages/travel-stay.js";
import { TravelConfig } from "../pages/travel-config.js";

export class TravelRouter extends HTMLElement {
  #repo = null;
  #slotContent = null;
  #routes = [
    {
      route:
        /^\/config$/,
      class: TravelConfig,
    },
    {
      route:
        /^\/trip\/(?<tripId>[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/stay\/(?<stayId>[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/,
      class: TravelStay,
    },
    {
      route:
        /^\/trip\/(?<tripId>[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/,
      class: TravelTrip,
    },
    {
      route: /[\s\S]*/,
      class: TravelMain,
    },
  ];

  constructor(repo) {
    super();

    const shadowRoot = this.attachShadow({
      mode: "open",
      slotAssignment: "manual",
    });
    shadowRoot.innerHTML = /*html*/ `
      <style>
      </style>
      <slot><div id="default">Loading TravelRouter...</div></slot>
    `;
    this.#repo = repo;
  }

  #navigate(event) {
    // Exit early if this navigation shouldn't be intercepted,
    // e.g. if the navigation is cross-origin, or a download request
    if (!event.canIntercept) {
      return;
    }

    const url = new URL(event.destination.url);

    try {
      for (const item of this.#routes) {
        let result = item.route.exec(url.pathname);

        if (result) {
          event.intercept({
            handler: async () => {
              try {
                this.#updateView(item.class, result.groups);
              } catch (error) {
                console.error(error);
              }
            },
          });
          break;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  #updateView(type, groups) {
    if (this.#slotContent) {
      this.#slotContent.remove();
      this.#slotContent = null;
    }

    this.#slotContent = new type(this.#repo, groups);
    this.appendChild(this.#slotContent);
    this.shadowRoot.querySelector("slot").assign(this.#slotContent);
  }

  connectedCallback() {
    navigation.addEventListener("navigate", this.#navigate.bind(this));
    for (const item of this.#routes) {
      let result = item.route.exec(window.location.pathname);

      if (result) {
        this.#updateView(item.class, result.groups);
        break;
      }
    }
  }
}

customElements.define("travel-router", TravelRouter);
