import { ElementCache } from "../element-cache.js";
import { TravelEdit } from "../components/travel-edit.js";
import { TravelList } from "../components/travel-list.js";
import { TravelHeader } from "../components/travel-header.js";
import { TravelView } from "../components/travel-view.js";

export class TravelMain extends HTMLElement {
  #ec = null;
  #repo = null;
  #travelList = null;
  #travelEdit = null;

  constructor(repo) {
    super();

    const shadowRoot = this.attachShadow({ mode: "open", slotAssignment: "manual", });
    shadowRoot.innerHTML = /*html*/ `
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
          </div>
        </travel-header>
        <main>
          <slot name="edit"></slot>
          <slot name="list"></slot>
        </main>
      </div>
    `;
    this.#repo = repo;
    this.#ec = new ElementCache(this.shadowRoot);
    this.#ec.get("#add_travel").addEventListener("click", () => this.#addTravel());
    this.#travelList = new TravelList({
      "travel": {
        "view": TravelView,
        "editCb":(obj) => this.#travelEdit.edit_object(obj,this.edit_complete.bind(this)),
        "deleteCb":(obj) => this.#deleteTravel(obj)
      }
    });
    this.appendChild(this.#travelList);
    this.#ec.get("slot[name=list]").assign(this.#travelList);
    this.#travelEdit = new TravelEdit();
    this.appendChild(this.#travelEdit);
    this.#ec.get("slot[name=edit]").assign(this.#travelEdit);
  }

  #update() {
    if (this.#repo) {
      (async () => {
        this.#travelList.objects = await this.#repo.getAllDocs("travel");
      })();
    }
  }

  #addTravel() {
    this.#travelEdit.edit_object({
      _id: crypto.randomUUID(),
      type: "travel",
      title: "",
      description: "",
    },this.edit_complete.bind(this));
  }

  edit_complete(obj) {
    this.#repo.addDoc(obj);
    this.#update();
  }

  #deleteTravel(travel) {
    this.#repo.deleteDoc(travel);
    this.#update();
  }

  connectedCallback() {
    this.#update();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Attribute ${name} has changed.`);
  }
}

customElements.define("travel-main", TravelMain);
