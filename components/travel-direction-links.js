export class TravelDirectionLinks extends HTMLElement {
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
            <div onclick="this.getRootNode().querySelector('#dialog').close()">
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

  #renderOptions(locations) {
    return locations.map((location) => {
      return /*html*/ `
        <option value="${location.position}">${location.title}</option>
      `
    }).join("");
  }

  generateGoogleLink() {
    let origin = this.shadowRoot.querySelector("#select_origin").value.split(",");
    let destination = this.shadowRoot.querySelector("#select_destination").value.split(",");

    window.open(`https://www.google.com/maps/dir/?api=1&origin=${origin[1]},${origin[0]}&destination=${destination[1]},${destination[0]}&travelmode=transit`, "_blank");
    this.shadowRoot.querySelector("#dialog").close();
  }

  generateOrganicLink() {
    let origin = this.shadowRoot.querySelector("#select_origin").value.split(",");
    let destination = this.shadowRoot.querySelector("#select_destination").value.split(",");

    window.open(`om://route?sll=${origin[1]},${origin[0]}&dll=${destination[1]},${destination[0]}&type=transit`);
    this.shadowRoot.querySelector("#dialog").close();
  }

  set locations(locations) {
    this.shadowRoot.querySelector("#select_origin").innerHTML = this.#renderOptions(locations);
    this.shadowRoot.querySelector("#select_destination").innerHTML = this.#renderOptions(locations);
    this.shadowRoot.querySelector("#dialog").showModal();
  }
}

customElements.define("travel-direction-links", TravelDirectionLinks);
