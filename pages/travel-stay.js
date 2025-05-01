import { TravelList } from "../components/travel-list.js";
import { TripView } from "../components/trip-view.js";
import { LocationEdit } from "../components/location-edit.js";
import { LocationView } from "../components/location-view.js";
import { TravelHeader } from "../components/travel-header.js";
import { TravelMapOverview } from "../components/travel-map-overview.js";
import { TravelConfirmation } from "../components/travel-confirmation.js";

export class TravelStay extends HTMLElement {
  #repo = null;
  #tripId = null;
  #trip = null;
  #stayId = null;
  #stay = null;
  #locationEdit = null;
  #locationList = null;

  constructor(repo, params) {
    super();
    this.#repo = repo;
    this.#tripId = params["tripId"];
    this.#stayId = params["stayId"];
  }
  
  async connectedCallback() {
    this.attachShadow({ mode: "open", slotAssignment: "manual" });
    this.#trip = await this.#repo.getDoc(this.#tripId);
    this.#stay = await this.#repo.getDoc(this.#stayId);

    this.shadowRoot.innerHTML = /*html*/ `
      <style>
        div.content {
          display: flex;
          flex-direction: column;
        }

        main {
          margin: 0 1rem;
        }

        .breadcrumbs {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 1rem 0;
        }

        .breadcrumbs a {
          color: var(--primary-dark);
          text-decoration: none;
        }

        .breadcrumbs a:hover {
          background-color: var(--primary-light);
        }

        .breadcrumbs span, a {
          color: var(--primary-dark);
          border: solid 1px;
          border-color: var(--primary);
          border-radius: 1rem;
          padding: 0.25rem .5rem;
        }

        .breadcrumbs span {
          background-color: var(--primary-light);
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
        <main>
          <travel-confirmation></travel-confirmation>
          <div class="breadcrumbs">
            <a href="/"><svg xmlns="http://www.w3.org/2000/svg" height=".8rem" viewBox="0 -960 960 960" width=".8rem" fill="#1f1f1f"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/></svg> Overview</a>
            <a href="/trip/${this.#tripId}"><svg xmlns="http://www.w3.org/2000/svg" height=".8rem" viewBox="0 -960 960 960" width=".8rem" fill="#1f1f1f"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q146 0 255.5 91.5T872-559h-82q-19-73-68.5-130.5T600-776v16q0 33-23.5 56.5T520-680h-80v80q0 17-11.5 28.5T400-560h-80v80h80v120h-40L168-552q-3 18-5.5 36t-2.5 36q0 131 92 225t228 95v80Zm364-20L716-228q-21 12-45 20t-51 8q-75 0-127.5-52.5T440-380q0-75 52.5-127.5T620-560q75 0 127.5 52.5T800-380q0 27-8 51t-20 45l128 128-56 56ZM620-280q42 0 71-29t29-71q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 42 29 71t71 29Z"/></svg> ${this.#trip.title}</a>
            <span><svg xmlns="http://www.w3.org/2000/svg" height=".8rem" viewBox="0 -960 960 960" width=".8rem" fill="#1f1f1f"><path d="M120-120v-560h240v-80l120-120 120 120v240h240v400H120Zm80-80h80v-80h-80v80Zm0-160h80v-80h-80v80Zm0-160h80v-80h-80v80Zm240 320h80v-80h-80v80Zm0-160h80v-80h-80v80Zm0-160h80v-80h-80v80Zm0-160h80v-80h-80v80Zm240 480h80v-80h-80v80Zm0-160h80v-80h-80v80Z"/></svg> ${this.#stay.title}</span>
          </div>
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

    let locations = await this.#repo.getAllDocs("location", this.#stayId);
    this.#locationList.objects = locations;
    this.shadowRoot.querySelector("travel-map-overview").objects = locations;

    await this.#update();
  }

  #deleteLocation(location) {
    let tc = this.shadowRoot.querySelector("travel-confirmation");

    tc.innerHTML = /*html*/ `
      <div slot="title">Delete ${location.title}</div>
      <div slot="message">Are you sure you want to delete ${location.title}?</div>
    `;
    tc.confirm = async () => {
      await this.#repo.deleteDoc(location);
      await this.#update();
    };
  }

  async #update() {
    await this.#updateList();
  }

  async #updateList() {
    let locations = await this.#repo.getAllDocs("location", this.#stayId);
    this.#locationList.objects = locations;
    this.shadowRoot.querySelector("travel-map-overview").objects = locations;
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

  #editLocationComplete(obj) {
    this.#repo.addDoc(obj).then(async () => {
      await this.#updateList();
    });
  }
}

customElements.define("travel-stay", TravelStay);
