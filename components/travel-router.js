import { ElementCache } from "../element-cache.js";
import { TravelMain } from "../views/travel-main.js";
import { TravelTravel } from "../views/travel-travel.js";

export class TravelRouter extends HTMLElement {
  #ec = null;
  #repo = null;
  #slotContent = null;
  #routes = [
    {
      route:
        /^\/travel\/(?<travelId>[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/,
      class: TravelTravel,
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
    this.#ec = new ElementCache(this.shadowRoot);
    this.#repo = repo;
  }

  // set repo(repo) {
  //   this.#repo = repo;

  //   if (this.#slotContent) {
  //     this.#slotContent.repo = this.#repo;
  //   }
  // }

  #navigate(event) {
    // console.log("...navigating...");
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
    // this.#slotContent.repo = this.#repo;
    
    // if (groups) {
    //   for (const [key, value] of Object.entries(groups)) {
    //     this.#slotContent[key] = value;
    //   }
    // }

    this.#ec.get("slot").assign(this.#slotContent);
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

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Attribute ${name} has changed.`);
  }
}

customElements.define("travel-router", TravelRouter);
