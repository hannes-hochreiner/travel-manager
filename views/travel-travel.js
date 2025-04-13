import { ElementCache } from "../element-cache.js";
// import { TravelEdit } from "./travel-edit.js";
import { TravelList } from "../travel-list.js";
import { TravelView } from "../travel-view.js";
import { TravelStayView } from "../components/travel-stay-view.js";
import { TravelStayEdit } from "../components/travel-stay-edit.js";
import { TravelHeader } from "../components/travel-header.js";

export class TravelTravel extends HTMLElement {
  #ec = null;
  #repo = null;
  #travelId = null;
  #travel = null;
  #stayEdit = null;
  #travelList = null;

  constructor(repo, params) {
    super();

    const shadowRoot = this.attachShadow({ mode: "open", slotAssignment: "manual" });
    shadowRoot.innerHTML = /*html*/ `
      <style>
      </style>
      <div class="content">
        <travel-header>
          <div slot="actions">
            <button id="add_stay">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M120-120v-560h240v-80l120-120 120 120v240h240v400H120Zm80-80h80v-80h-80v80Zm0-160h80v-80h-80v80Zm0-160h80v-80h-80v80Zm240 320h80v-80h-80v80Zm0-160h80v-80h-80v80Zm0-160h80v-80h-80v80Zm0-160h80v-80h-80v80Zm240 480h80v-80h-80v80Zm0-160h80v-80h-80v80Z"/></svg>
            </button>
            <button id="add_transport">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m770-120-56-56 63-64H610v-80h167l-63-64 56-56 160 160-160 160ZM400-360q56 0 101-27.5t71-72.5q-35-29-79-44.5T400-520q-49 0-93 15.5T228-460q26 45 71 72.5T400-360Zm0-200q33 0 56.5-23.5T480-640q0-33-23.5-56.5T400-720q-33 0-56.5 23.5T320-640q0 33 23.5 56.5T400-560Zm0 67Zm0 413Q239-217 159.5-334.5T80-552q0-150 96.5-239T400-880q127 0 223.5 89T720-552q0 9-.5 18.5T717-514h-81q2-10 3-19.5t1-18.5q0-109-69.5-178.5T400-800q-101 0-170.5 69.5T160-552q0 71 59 162.5T400-186q23-20 42.5-40t37.5-39l9 9 19.5 19.5q10.5 10.5 19 19.5l8.5 9q-29 31-63 63t-73 65Z"/></svg>
            </button>
          </div>
        </travel-header>
        <main>
          <a href="/">back</a>
          <p id="travelId"></p>
          <slot name="travel"></slot>
          <slot name="stay-edit"></slot>
          <slot name="list"></slot>
        </main>
      </div>
    `;
    this.#ec = new ElementCache(this.shadowRoot);
    this.#repo = repo;
    this.#travelId = params["travelId"];
    this.#ec.get("#add_stay").addEventListener("click", () => this.#addStay());
    this.#stayEdit = new TravelStayEdit();
    this.appendChild(this.#stayEdit);
    this.#ec.get("slot[name=stay-edit]").assign(this.#stayEdit);
    this.#travelList = new TravelList({
      "stay": {
        "view": TravelStayView,
        "editCb":(obj) => this.#stayEdit.edit_object(obj,this.#editStayComplete.bind(this)),
        "deleteCb":(obj) => this.#deleteStay(obj)
      }
    });
    this.appendChild(this.#travelList);
    this.#ec.get("slot[name=list]").assign(this.#travelList);

    (async () => {
      this.#travel = await this.#repo.getDoc(this.#travelId);
      let travelElement = new TravelView(this.#travel);
      this.appendChild(travelElement);
      this.#ec.get("slot[name=travel]").assign(travelElement);
      this.#travelList.objects = await this.#repo.getAllDocs("stay", this.#travelId);
    })();

    this.#update();
  }

  #deleteStay(stay) {
    this.#repo.deleteDoc(stay);
    this.#update();
  }

  #update() {
    this.#ec.get("#travelId").innerHTML = this.#travelId;
  }

  #updateList() {
    (async () => {
      this.#travelList.objects = await this.#repo.getAllDocs("stay", this.#travelId);
    })();
  }

  #addStay() {
    this.#stayEdit.edit_object({
      _id: crypto.randomUUID(),
      type: "stay",
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      parent: this.#travelId,
      longitude: 0,
      latitude: 0
    },this.#editStayComplete.bind(this));
  }

  #editStayComplete(obj) {
    this.#repo.addDoc(obj);
    this.#updateList();
  }
}

customElements.define("travel-travel", TravelTravel);
