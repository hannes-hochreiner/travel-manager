import { TripEdit } from "../components/trip-edit.js";
import { TravelList } from "../components/travel-list.js";
import { TravelHeader } from "../components/travel-header.js";
import { TripView } from "../components/trip-view.js";
import { TravelLogin } from "../components/travel-login.js";
import { TravelConfirmation } from "../components/travel-confirmation.js";
import { TravelNotification } from "../components/travel-notification.js";

export class TravelMain extends HTMLElement {
  #repo = null;
  #travelList = null;
  #bc = null

  constructor(repo) {
    super();
    this.#repo = repo;
    this.#bc = new BroadcastChannel("notification");
  }

  async connectedCallback() {
    this.attachShadow({ mode: "open", slotAssignment: "manual", });
    this.shadowRoot.innerHTML = /*html*/ `
      <style>
        div.content {
          display: flex;
          flex-direction: column;
        }

        main {
          margin: 0 1rem;
        }
      </style>
      <div class="content">
        <travel-header>
          <div slot="actions">
            <button id="add_travel">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q146 0 255.5 91.5T872-559h-82q-19-73-68.5-130.5T600-776v16q0 33-23.5 56.5T520-680h-80v80q0 17-11.5 28.5T400-560h-80v80h80v120h-40L168-552q-3 18-5.5 36t-2.5 36q0 131 92 225t228 95v80Zm364-20L716-228q-21 12-45 20t-51 8q-75 0-127.5-52.5T440-380q0-75 52.5-127.5T620-560q75 0 127.5 52.5T800-380q0 27-8 51t-20 45l128 128-56 56ZM620-280q42 0 71-29t29-71q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 42 29 71t71 29Z"/></svg>
            </button>
            <a href="/config"><button>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg>
            </button></a>
          </div>
        </travel-header>
        <main>
          <trip-edit></trip-edit>
          <travel-login></travel-login>
          <travel-confirmation></travel-confirmation>
          <slot name="list"></slot>
          <travel-notification></travel-notification>
        </main>
      </div>
    `;

    this.shadowRoot.querySelector("#add_travel").addEventListener("click", () => this.#addTravel());
    this.#travelList = new TravelList({
      "travel": {
        "view": TripView,
        "editCb":(obj) => this.shadowRoot.querySelector("trip-edit").edit_object(obj,this.edit_complete.bind(this)),
        "deleteCb":(obj) => this.#deleteTravel(obj)
      }
    });
    this.appendChild(this.#travelList);
    this.shadowRoot.querySelector("slot[name=list]").assign(this.#travelList);
    await this.#update();
  }

  async #update() {
    if (this.#repo) {
      this.#travelList.objects = await this.#repo.getAllDocs("travel");
    }
  }

  #addTravel() {
    this.shadowRoot.querySelector("trip-edit").edit_object({
      _id: crypto.randomUUID(),
      type: "travel",
      title: "",
      description: "",
    },this.edit_complete.bind(this));
  }

  edit_complete(obj) {
    this.#repo.addDoc(obj).then(() => {
      this.#update();
    });
  }

  #deleteTravel(travel) {
    let tc = this.shadowRoot.querySelector("travel-confirmation");

    tc.innerHTML = /*html*/ `
      <div slot="title">Delete ${travel.title}</div>
      <div slot="message">Are you sure you want to delete ${travel.title}?</div>
    `;
    tc.confirm = async () => {
      await this.#repo.deleteDoc(travel);
      await this.#update();
    };
  }
}

customElements.define("travel-main", TravelMain);
