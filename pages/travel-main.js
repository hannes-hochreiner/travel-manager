import { TripEdit } from "../components/trip-edit.js";
import { TravelList } from "../components/travel-list.js";
import { TravelHeader } from "../components/travel-header.js";
import { TripView } from "../components/trip-view.js";
import { TravelLogin } from "../components/travel-login.js";
import { TravelConfirmation } from "../components/travel-confirmation.js";

export class TravelMain extends HTMLElement {
  #repo = null;
  #travelList = null;

  constructor(repo) {
    super();
    this.attachShadow({ mode: "open", slotAssignment: "manual", });
    this.#repo = repo;
  }

  async connectedCallback() {
    // const shadowRoot = this.attachShadow({ mode: "open", slotAssignment: "manual", });
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
            <button id="login">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z"/></svg>
            </button>
            <button id="sync">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M160-160v-80h110l-16-14q-52-46-73-105t-21-119q0-111 66.5-197.5T400-790v84q-72 26-116 88.5T240-478q0 45 17 87.5t53 78.5l10 10v-98h80v240H160Zm400-10v-84q72-26 116-88.5T720-482q0-45-17-87.5T650-648l-10-10v98h-80v-240h240v80H690l16 14q49 49 71.5 106.5T800-482q0 111-66.5 197.5T560-170Z"/></svg>
            </button>
          </div>
        </travel-header>
        <main>
          <trip-edit></trip-edit>
          <travel-login></travel-login>
          <travel-confirmation></travel-confirmation>
          <slot name="list"></slot>
        </main>
      </div>
    `;
    // this.#repo = repo;
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
    // this.#travelEdit = new TravelEdit();
    // this.appendChild(this.#travelEdit);
    // this.shadowRoot.querySelector("slot[name=edit]").assign(this.#travelEdit);
    
    // this.shadowRoot.addEventListener("click", (e) => console.log(e.target));
    
    // this.addEventListener("click", (e) => console.log(e.target));
    this.shadowRoot.querySelector("travel-login").callback = (data) => {
      (async () => {
        let url = "/api/_session";

        console.log(await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({name: data.username, password: data.password})
        }));
      })();
    };
    this.shadowRoot.querySelector("#login").addEventListener("click", () => {
      this.shadowRoot.querySelector("travel-login").show = true;
    });

    this.shadowRoot.querySelector("#sync").addEventListener("click", (e) => {
      (async () => {
        await this.#repo.sync();
        console.log("triggering update");
        this.#update();
      })();
    });
    console.log("triggering update");
    this.#update();
  }

  #update() {
    console.log("update", this.#repo);
    if (this.#repo) {
      (async () => {
        console.log("update");
        this.#travelList.objects = await this.#repo.getAllDocs("travel");
      })();
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
    this.#repo.addDoc(obj);
    this.#update();
  }

  #deleteTravel(travel) {
    let tc = this.shadowRoot.querySelector("travel-confirmation");

    tc.innerHTML = /*html*/ `
      <div slot="title">Delete ${travel.title}</div>
      <div slot="message">Are you sure you want to delete ${travel.title}?</div>
    `;
    tc.addEventListener("confirmed", () => {
      tc.show = false;
      (async () => {
        await this.#repo.deleteDoc(travel);
        this.#update();
      })();
    })
    tc.show = true;
  }

}

customElements.define("travel-main", TravelMain);
