import { Map, View, Feature } from 'https://esm.run/ol';
import { toLonLat, fromLonLat } from 'https://esm.run/ol/proj';
import { OSM, Vector as VectorSource } from 'https://esm.run/ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'https://esm.run/ol/layer';
import { Point } from 'https://esm.run/ol/geom';
import { Style, Icon } from 'https://esm.run/ol/style';
// import View from 'https://cdn.jsdelivr.net/npm/openlayers@10.5.0/build/ol/View.js';

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
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
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
          <div class="form-group">
            <label for="latitude">Latitude</label>
            <input id="latitude" type="number" step="0.000001" />
          </div>
        </div>
        
        <div class="tab-content" data-tab="map">
          <div id="map"></div>
          <div class="crosshair"></div>
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
        src: '/data/map-pin.svg',
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
  }

  set value(value) {
    this.#position = value;
    this.#icon.setGeometry(new Point(fromLonLat(this.#position)));
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
