import { TravelList } from "../components/travel-list.js";
import { TripView } from "../components/trip-view.js";
import { LocationEdit } from "../components/location-edit.js";
import { LocationView } from "../components/location-view.js";
import { TravelHeader } from "../components/travel-header.js";
import { TravelMapOverview } from "../components/travel-map-overview.js";
import { TravelConfirmation } from "../components/travel-confirmation.js";
import { TravelDirectionLinks } from "../components/travel-direction-links.js";
import { Repo } from "../repo.js";
// import { escapeHtml } from "../objects/utils.js";

export class TravelStay extends HTMLElement {
  #tripId = null;
  #trip = null;
  #stayId = null;
  #stay = null;
  #locationEdit = null;
  #locationList = null;
  #locations = [];

  constructor(params) {
    super();
    this.#tripId = params["tripId"];
    this.#stayId = params["stayId"];
  }
  
  async connectedCallback() {
    this.attachShadow({ mode: "open", slotAssignment: "manual" });
    const repo = await new Repo();
    this.#trip = await repo.getDoc(this.#tripId);
    this.#stay = await repo.getDoc(this.#stayId);

    this.shadowRoot.innerHTML = /*html*/ `
      <style>
        div.content {
          display: flex;
          flex-direction: column;
        }

        main {
          margin: 1rem;
        }

        a {
          text-decoration: none;
          color: var(--secondary-dark);
        }

        .breadcrumb {
          background: linear-gradient(45deg, var(--secondary), var(--secondary-light));
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: baseline;
          padding: 0 1rem; 
          color: var(--secondary-dark);
        }
        .breadcrumb h2 {
          margin: 0.5rem 0;
        }
        a .breadcrumb {
          background: linear-gradient(45deg, var(--secondary-light), var(--secondary));
        }
        a:hover .breadcrumb {
          background: linear-gradient(45deg, var(--secondary), var(--secondary-light));
        }
      </style>
      <div class="content">
        <travel-header>
          <div slot="actions">
            <button id="add_location">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/></svg>
            </button>
          </div>
        </travel-header>
        <a href="/trip/${this.#tripId}"><div class="breadcrumb">
          <h2>${this.#trip.title}</h2>
        </div></a>
        <div class="breadcrumb">
          <h2>${this.#stay.title}</h2>
          <div class="actions">
            <button id="om_link">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m600-120-240-84-186 72q-20 8-37-4.5T120-170v-560q0-13 7.5-23t20.5-15l212-72 240 84 186-72q20-8 37 4.5t17 33.5v560q0 13-7.5 23T812-192l-212 72Zm-40-98v-468l-160-56v468l160 56Zm80 0 120-40v-474l-120 46v468Zm-440-10 120-46v-468l-120 40v474Zm440-458v468-468Zm-320-56v468-468Z"/></svg>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z"/></svg>
            </button>
            <button onclick="this.getRootNode().host.generateLinks()">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#143f52"><path d="M480-40q-91 0-171.5-34.5t-140-94q-59.5-59.5-94-140T40-480q0-92 34.5-172t94-139.5q59.5-59.5 140-94T480-920q92 0 172 34.5t139.5 94Q851-732 885.5-652T920-480q0 91-34.5 171.5t-94 140Q732-109 652-74.5T480-40Zm-25-129q10 10 23 10t23-10l288-288q10-10 10-24t-10-24L501-793q-10-10-23-10t-23 10L167-505q-10 10-10 24t10 24l288 288ZM319-361v-160q0-18 11-29t29-11h166l-42-44 56-56 140 140-140 140-56-56 42-44H399v120h-80Z"/></svg>
            </button>
          </div>
        </div>
        <main>
          <travel-direction-links></travel-direction-links>
          <travel-confirmation></travel-confirmation>
          <slot name="location-edit"></slot>
          <travel-map-overview></travel-map-overview>
          <slot name="list"></slot>
        </main>
      </div>
    `;
    this.shadowRoot.querySelector("#add_location").addEventListener("click", () => this.#addLocation());
    this.#locationEdit = new LocationEdit();
    this.appendChild(this.#locationEdit);
    this.shadowRoot.querySelector("slot[name=location-edit]").assign(this.#locationEdit);
    this.#locationList = new TravelList({
      "location": {
        "view": LocationView,
        "editCb":(obj) => this.#locationEdit.edit_object(obj,this.#editLocationComplete.bind(this)),
        "deleteCb":(obj) => this.#deleteLocation(obj)
      }
    });
    this.appendChild(this.#locationList);
    this.shadowRoot.querySelector("slot[name=list]").assign(this.#locationList);
    this.shadowRoot.querySelector("#om_link").addEventListener("click", () => {
      window.open(`om://map?v=1&${this.#locations.map((location) => `ll=${location.position[1]},${location.position[0]}&n=${encodeURIComponent(location.title)}`).join("&")}`)
    });

    await this.#update();
  }

  #deleteLocation(location) {
    let tc = this.shadowRoot.querySelector("travel-confirmation");

    tc.innerHTML = /*html*/ `
      <div slot="title">Delete ${location.title}</div>
      <div slot="message">Are you sure you want to delete ${location.title}?</div>
    `;
    tc.confirm = async () => {
      const repo = await new Repo();
      await repo.deleteDoc(location);
      await this.#update();
    };
  }

  async #update() {
    await this.#updateList();
  }

  async #updateList() {
    const repo = await new Repo();
    this.#locations = await repo.getAllDocs("location", this.#stayId);
    this.#locations.sort((a, b) => a.title.localeCompare(b.title));
    this.#locationList.objects = this.#locations;
    this.shadowRoot.querySelector("travel-map-overview").objects = this.#locations;
  }

  #addLocation() {
    this.#locationEdit.edit_object({
      _id: crypto.randomUUID(),
      type: "location",
      title: "",
      description: "",
      parent: this.#stayId,
      position: [0,0]
    },this.#editLocationComplete.bind(this));
  }

  async #editLocationComplete(obj) {
    const repo = await new Repo();

    await repo.addDoc(obj);
    await this.#updateList();
  }

  generateLinks() {
    this.shadowRoot.querySelector("travel-direction-links").locations = this.#locations;
  }
}

customElements.define("travel-stay", TravelStay);
