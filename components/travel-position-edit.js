import { Map, View, Feature } from 'https://cdn.jsdelivr.net/npm/ol/+esm';
import { toLonLat, fromLonLat } from 'https://cdn.jsdelivr.net/npm/ol/proj/+esm';
import { OSM, Vector as VectorSource } from 'https://cdn.jsdelivr.net/npm/ol/source/+esm';
import { Tile as TileLayer, Vector as VectorLayer } from 'https://cdn.jsdelivr.net/npm/ol/layer/+esm';
import { Point } from 'https://cdn.jsdelivr.net/npm/ol/geom/+esm';
import { Style, Icon } from 'https://cdn.jsdelivr.net/npm/ol/style/+esm';

export class TravelPositionEdit extends HTMLElement {
  #position = null;
  #map = null;
  #icon = null;

  constructor() {
    super();
    
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = /*html*/ `
      <style>
        @import "https://cdn.jsdelivr.net/npm/ol@10.5.0/ol.css";

        .tabs {
          display: flex;
          border-bottom: 1px solid #ccc;
          margin-bottom: 1rem;
        }
        .tab {
          padding: 0.5rem 1rem;
          cursor: pointer;
          border: 1px solid transparent;
          border-bottom: none;
          margin-bottom: -1px;
          border-radius: 0.25rem 0.25rem 0 0;
        }
        .tab.active {
          background-color: #f5f5f5;
          border-color: #ccc;
        }
        .tab-content {
          display: none;
        }
        .tab-content.active {
          display: block;
        }
        .tab-content[data-tab="numerical"].active {
          display: flex;
          flex-direction: row;
          gap: 0.5rem;
          margin-bottom: 1rem;
          align-items: center;
          justify-content: space-between;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
          width: 100px;
          flex-grow: 4;
        }
        label {
          font-weight: bold;
        }
        input {
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 0.25rem;
        }
        #map {
          height: 350px;
        }
      </style>
      <div class="content">
        <div class="tabs">
          <div class="tab active" data-tab="numerical">Numerical Input</div>
          <div class="tab" data-tab="map">Map Selection</div>
        </div>
        
        <div class="tab-content active" data-tab="numerical">
          <div class="form-group">
            <label for="longitude">Longitude</label>
            <input id="longitude" type="number" step="0.000001" />
          </div>
          <button onclick="this.getRootNode().host.swapLongLat()">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#143f52"><path d="M280-160 80-360l200-200 56 57-103 103h287v80H233l103 103-56 57Zm400-240-56-57 103-103H440v-80h287L624-743l56-57 200 200-200 200Z"/></svg>
          </button>
          <div class="form-group">
            <label for="latitude">Latitude</label>
            <input id="latitude" type="number" step="0.000001" />
          </div>
          <button onclick="this.getRootNode().host.getGeoUrl()">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#143f52"><path d="m720-120-56-57 63-63H480v-80h247l-63-64 56-56 160 160-160 160Zm120-400h-80v-240h-80v120H280v-120h-80v560h200v80H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h167q11-35 43-57.5t70-22.5q40 0 71.5 22.5T594-840h166q33 0 56.5 23.5T840-760v240ZM480-760q17 0 28.5-11.5T520-800q0-17-11.5-28.5T480-840q-17 0-28.5 11.5T440-800q0 17 11.5 28.5T480-760Z"/></svg>
          </button>
        </div>
        
        <div class="tab-content" data-tab="map">
          <div id="map"></div>
        </div>
      </div>
    `;

    this.#position = [0,0];
    
    let longitude = this.shadowRoot.querySelector("#longitude");
    let latitude = this.shadowRoot.querySelector("#latitude");

    longitude.onchange = this.#longLatChanged.bind(this);
    longitude.value = this.#position[0];
    latitude.onchange = this.#longLatChanged.bind(this);
    latitude.value = this.#position[1];

    this.#icon = new Feature({
      geometry: new Point(fromLonLat(this.#position)),
    });

    const iconStyle = new Style({
      image: new Icon({
        anchor: [.5, .5],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: URL.createObjectURL(new Blob([`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#143f52"><path d="M440-42v-80q-125-14-214.5-103.5T122-440H42v-80h80q14-125 103.5-214.5T440-838v-80h80v80q125 14 214.5 103.5T838-520h80v80h-80q-14 125-103.5 214.5T520-122v80h-80Zm40-158q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 116 82 198t198 82Zm0-120q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm0-80q33 0 56.5-23.5T560-480q0-33-23.5-56.5T480-560q-33 0-56.5 23.5T400-480q0 33 23.5 56.5T480-400Zm0-80Z"/></svg>`], {type: 'image/svg+xml'})),
      }),
    });

    this.#icon.setStyle([iconStyle]);

    this.#map = new Map({
      layers: [
        new TileLayer({source: new OSM()}),
        new VectorLayer({
          source: new VectorSource({
            features: [this.#icon],
          }),
        }),
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
      target: this.shadowRoot.querySelector("#map")
    });
  
    this.#map.on('singleclick', this.#mapSingleClick.bind(this));

    // Add tab switching functionality
    const tabs = this.shadowRoot.querySelectorAll(".tab");
    tabs.forEach(tab => {
      tab.onclick = () => this.#switchTab(tab.dataset.tab);
    });
  }

  #switchTab(tabName) {
    const tabs = this.shadowRoot.querySelectorAll(".tab");
    const contents = this.shadowRoot.querySelectorAll(".tab-content");
    
    tabs.forEach(tab => tab.classList.remove("active"));
    contents.forEach(content => content.classList.remove("active"));
    
    this.shadowRoot.querySelector(`.tab[data-tab="${tabName}"]`).classList.add("active");
    this.shadowRoot.querySelector(`.tab-content[data-tab="${tabName}"]`).classList.add("active");
  }

  #mapSingleClick(evt) {
    const coordinate = evt.coordinate;
    this.#position = toLonLat(coordinate);
  
    this.#icon.setGeometry(new Point(fromLonLat(this.#position)));
    this.shadowRoot.querySelector("#longitude").value = this.#position[0];
    this.shadowRoot.querySelector("#latitude").value = this.#position[1];
  }

  #longLatChanged() {
    this.#position[0] = parseFloat(this.shadowRoot.querySelector("#longitude").value);
    this.#position[1] = parseFloat(this.shadowRoot.querySelector("#latitude").value);

    this.#icon.setGeometry(new Point(fromLonLat(this.#position)));
    this.#map.getView().setCenter(fromLonLat(this.#position));
  }

  swapLongLat() {
    this.value = [this.#position[1], this.#position[0]];
  }

  async getGeoUrl() {
    let text = (await navigator.clipboard.readText()).trim();

    if (text.startsWith("geo:")) {
      let parts = text.split(":")[1].split(",");
      this.value = [parseFloat(parts[1]), parseFloat(parts[0])];
    } else {
      let parts = text.split(",");
      this.value = [parseFloat(parts[1]), parseFloat(parts[0])];
    }
  }

  set value(value) {
    this.#position = value;
    this.#icon.setGeometry(new Point(fromLonLat(this.#position)));
    this.#map.getView().setCenter(fromLonLat(this.#position));
    this.shadowRoot.querySelector("#longitude").value = this.#position[0];
    this.shadowRoot.querySelector("#latitude").value = this.#position[1];
  }

  get value() {
    return this.#position
  }

  connectedCallback() {
  }
}

customElements.define("travel-position-edit", TravelPositionEdit);
