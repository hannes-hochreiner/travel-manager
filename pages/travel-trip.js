import { TravelList } from "../components/travel-list.js";
import { TripView } from "../components/trip-view.js";
import { StayView } from "../components/stay-view.js";
import { StayEdit } from "../components/stay-edit.js";
import { TravelHeader } from "../components/travel-header.js";
import { TravelConfirmation } from "../components/travel-confirmation.js";
import { TransportEdit } from "../components/transport-edit.js";
import { TransportView } from "../components/transport-view.js";
import { Transport } from "../objects/transport.js";
import { Repo } from "../repo.js";
// import { escapeHtml } from "../objects/utils.js";

customElements.define("transport-edit", TransportEdit);
customElements.define("transport-view", TransportView);

export class TravelTrip extends HTMLElement {
  #tripId = null;
  #trip = null;
  #stayEdit = null;
  #tripList = null;
  #stays = null;
  #transports = null;
  #filter = null;

  constructor(params) {
    super();
    this.#tripId = params["tripId"];
  }

  async connectedCallback() {
    this.attachShadow({ mode: "open", slotAssignment: "manual" });
    const repo = await new Repo();
    this.#trip = await repo.getDoc(this.#tripId);
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

        .actions button.selected {
          background: var(--secondary-light);
        }

        .actions button.selected svg {
          fill: var(--secondary-dark);
        }
      </style>
      <div class="content">
        <travel-header>
          <div slot="actions">
            <button id="add_stay">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M120-120v-560h240v-80l120-120 120 120v240h240v400H120Zm80-80h80v-80h-80v80Zm0-160h80v-80h-80v80Zm0-160h80v-80h-80v80Zm240 320h80v-80h-80v80Zm0-160h80v-80h-80v80Zm0-160h80v-80h-80v80Zm0-160h80v-80h-80v80Zm240 480h80v-80h-80v80Zm0-160h80v-80h-80v80Z"/></svg>
            </button>
            <button id="add_transport" onclick="this.getRootNode().host.addTransport()">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m770-120-56-56 63-64H610v-80h167l-63-64 56-56 160 160-160 160ZM400-360q56 0 101-27.5t71-72.5q-35-29-79-44.5T400-520q-49 0-93 15.5T228-460q26 45 71 72.5T400-360Zm0-200q33 0 56.5-23.5T480-640q0-33-23.5-56.5T400-720q-33 0-56.5 23.5T320-640q0 33 23.5 56.5T400-560Zm0 67Zm0 413Q239-217 159.5-334.5T80-552q0-150 96.5-239T400-880q127 0 223.5 89T720-552q0 9-.5 18.5T717-514h-81q2-10 3-19.5t1-18.5q0-109-69.5-178.5T400-800q-101 0-170.5 69.5T160-552q0 71 59 162.5T400-186q23-20 42.5-40t37.5-39l9 9 19.5 19.5q10.5 10.5 19 19.5l8.5 9q-29 31-63 63t-73 65Z"/></svg>
            </button>
          </div>
        </travel-header>
        <div class="breadcrumb">
          <h2>${this.#trip.title}</h2>
          <div class="actions">
            <button id="filterFuture" onclick="this.getRootNode().host.toggleFilterFuture(this)">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M360-300q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z"/></svg>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M80-240v-480h80v480H80Zm560 0-57-56 144-144H240v-80h487L584-664l56-56 240 240-240 240Z"/></svg>
            </button>
            <button id="om_link">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m600-120-240-84-186 72q-20 8-37-4.5T120-170v-560q0-13 7.5-23t20.5-15l212-72 240 84 186-72q20-8 37 4.5t17 33.5v560q0 13-7.5 23T812-192l-212 72Zm-40-98v-468l-160-56v468l160 56Zm80 0 120-40v-474l-120 46v468Zm-440-10 120-46v-468l-120 40v474Zm440-458v468-468Zm-320-56v468-468Z"/></svg>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z"/></svg>
            </button>
          </div>
        </div>
        <main>
          <travel-confirmation></travel-confirmation>
          <travel-map-overview></travel-map-overview>
          <transport-edit></transport-edit>
          <slot name="stay-edit"></slot>
          <slot name="list"></slot>
        </main>
      </div>
    `;
    this.shadowRoot.querySelector("#add_stay").addEventListener("click", () => this.#addStay());
    this.#stayEdit = new StayEdit();
    this.appendChild(this.#stayEdit);
    this.shadowRoot.querySelector("slot[name=stay-edit]").assign(this.#stayEdit);
    this.#tripList = new TravelList({
      "stay": {
        "view": StayView,
        "editCb":(obj) => this.#stayEdit.edit_object(obj,this.#editStayComplete.bind(this)),
        "deleteCb":(obj) => this.#deleteObject(obj)
      },
      "transport": {
        "view": TransportView,
        "editCb":(obj) => this.#editTransport(obj),
        "deleteCb":(obj) => this.#deleteObject(obj)
      }
    });
    this.appendChild(this.#tripList);
    this.shadowRoot.querySelector("slot[name=list]").assign(this.#tripList);
    this.shadowRoot.querySelector("#om_link").addEventListener("click", () => {
      window.open(`om://map?v=1&${this.#stays.map((stay) => `ll=${stay.position[1]},${stay.position[0]}&n=${encodeURIComponent(stay.title)}`).join("&")}`)
    });

    await this.#update();
  }

  toggleFilterFuture(button) {
    console.log(button);
    if (this.#filter === "future") {
      this.#filter = null;
      button.classList.remove("selected");
    } else {
      this.#filter = "future";
      button.classList.add("selected");
    }

    this.#update();
  }

  #deleteObject(object) {
    let tc = this.shadowRoot.querySelector("travel-confirmation");

    tc.innerHTML = /*html*/ `
      <div slot="title">Delete ${object.title}</div>
      <div slot="message">Are you sure you want to delete ${object.title}?</div>
    `;
    tc.confirm = async () => {
      const repo = await new Repo();

      await repo.deleteDoc(object);
      await this.#update();
    };
  }

  async #update() {
    await this.#updateList();
  }

  async #updateList() {
    const repo = await new Repo();

    this.#stays = await repo.getAllDocs("stay", this.#tripId);
    this.#transports = await repo.getAllDocs("transport", this.#tripId);

    let list = [...this.#transports, ...this.#stays].filter((obj) => {
      if (this.#filter === "future") {
        let date = "";

        if (obj.endDate) {
          date = obj.endDate;
        } else if (obj.endDateTime) {
          date = obj.endDateTime.substring(0, 10);
        }
        return date >= (new Date()).toISOString().substring(0, 10);
      }

      return true;
    });
    
    list.sort((a, b) => {
      let aDate = new Date();

      if (a.startDate) {
        aDate = new Date(a.startDate + "T23:59:59");
      } else if (a.startDateTime) {
        aDate = new Date(a.startDateTime);
      }

      let bDate = new Date();

      if (b.startDate) {
        bDate = new Date(b.startDate + "T23:59:59");
      } else if (b.startDateTime) {
        bDate = new Date(b.startDateTime);
      }

      return aDate - bDate;
    });
    this.#tripList.objects = list;
    this.shadowRoot.querySelector("travel-map-overview").objects = list;
    // let blob = await this.shadowRoot.querySelector("travel-map-overview").getBlob();
    // console.log(blob);
  }

  #addStay() {
    this.#stayEdit.edit_object({
      _id: crypto.randomUUID(),
      type: "stay",
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      parent: this.#tripId,
      position: [0,0]
    },this.#editStayComplete.bind(this));
  }

  async #editStayComplete(obj) {
    const repo = await new Repo();

    await repo.addDoc(obj)
    await this.#updateList();
  }

  async #editTransport(obj) {
    const result = await this.shadowRoot.querySelector("transport-edit").edit_object(obj);

    if (result.action !== "cancel") {
      await this.#updateList();
    }
  }

  async addTransport() {
    let transport = Transport.default();
    transport.parent = this.#tripId;

    const result = await this.shadowRoot.querySelector("transport-edit").edit_object(transport);

    if (result.action !== "cancel") {
      await this.#updateList();
    }
  }
}

customElements.define("travel-trip", TravelTrip);
