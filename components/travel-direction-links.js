export class TravelDirectionLinks extends HTMLElement {
  #locations = [];

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = /*html*/ `
      <style>
        dialog {
          padding: 0;
        }

        div.content {
          display: flex;
          flex-direction: column;
          border: 1px solid;
        }

        header {
          background: linear-gradient(45deg, var(--tertiary-light), var(--tertiary));
          padding: 0.5rem;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--tertiary-dark);
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }

        footer {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }

        .action {
          flex-grow: 1;
        }

        main {
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        p {
          background-color: #aaa;
          padding: 5px;
        }

        footer button {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
        }
      </style>
      <dialog id="dialog">
        <div class="content">
          <header>
            Direction Links
            <div onclick="this.getRootNode().host.close()">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#143f52"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
            </div>
          </header>
          <main>
            <label for="select_origin">Origin</label>
            <select id="select_origin">
            </select>
            <label for="select_destination">Destination</label>
            <select id="select_destination">
            </select>
          </main>
          <footer>
            <button class="action" onclick="this.getRootNode().host.generateGoogleLink()">
              Google Maps
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#143f52"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z"/></svg>
            </button>
            <button class="action" onclick="this.getRootNode().host.generateOrganicLink()">
              Organic Maps
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#143f52"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z"/></svg>
          </button>
          </footer>
        </div>
      </dialog>
    `;
  }

  #renderOptions() {
    return this.#locations.map((location, index) => {
      return /*html*/ `
        <option value="${index}">${location.title}</option>
      `;
    }).join("");
  }

  generateGoogleLink() {
    let origin = this.#locations[parseInt(this.shadowRoot.querySelector("#select_origin").value)];
    let destination = this.#locations[parseInt(this.shadowRoot.querySelector("#select_destination").value)];

    window.open(`https://www.google.com/maps/dir/?api=1&origin=${origin.position[1]},${origin.position[0]}&destination=${destination.position[1]},${destination.position[0]}&travelmode=transit`, "_blank");
    this.close();
  }

  generateOrganicLink() {
    let origin = this.#locations[parseInt(this.shadowRoot.querySelector("#select_origin").value)];
    let destination = this.#locations[parseInt(this.shadowRoot.querySelector("#select_destination").value)];

    window.open(`om://route?sll=${origin.position[1]},${origin.position[0]}&saddr=${encodeURIComponent(origin.title)}&dll=${destination.position[1]},${destination.position[0]}&daddr=${encodeURIComponent(destination.title)}&type=transit`);
    this.close();
  }

  close() {
    this.shadowRoot.querySelector("#dialog").close();
    this.shadowRoot.querySelector("#select_origin").innerHTML = "";
    this.shadowRoot.querySelector("#select_destination").innerHTML = "";
    this.#locations = [];
  }

  set locations(locations) {
    this.#locations = locations;
    let options = this.#renderOptions();
    this.shadowRoot.querySelector("#select_origin").innerHTML = options;
    this.shadowRoot.querySelector("#select_destination").innerHTML = options;
    this.shadowRoot.querySelector("#dialog").showModal();
  }
}

customElements.define("travel-direction-links", TravelDirectionLinks);
