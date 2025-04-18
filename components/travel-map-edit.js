import { Map, View, Feature } from 'https://esm.run/ol';
import { toLonLat, fromLonLat } from 'https://esm.run/ol/proj';
import { OSM, Vector as VectorSource } from 'https://esm.run/ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'https://esm.run/ol/layer';
import { Point } from 'https://esm.run/ol/geom';
import { Style, Icon } from 'https://esm.run/ol/style';
// import View from 'https://cdn.jsdelivr.net/npm/openlayers@10.5.0/build/ol/View.js';

export class TravelMapEdit extends HTMLElement {
  #position = null;
  #map = null;
  #icon = null;

  constructor() {
    super();
    
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = /*html*/ `
      <style>
        @import "https://cdn.jsdelivr.net/npm/ol@10.5.0/ol.css";

        dialog {
          padding: 0;
        }

        div.content {
          display: flex;
          flex-direction: column;
          border: 1px solid;
        }

        header input {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--secondary-dark);
          width: calc(100% - 1rem);
          background-color: var(--secondary-light);
        }

        header {
          background-color: var(--secondary-light);
          padding: 0.5rem;
        }

        footer {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }

        .action {
          flex-grow: 1;
        }

        #map {
          height: 350px;
        }
      </style>
      <div class="content">
        <main>
          <input id="longitude" type="number" />
          <input id="latitude" type="number" />
          <div id="map"></div>
        </main>
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

customElements.define("travel-map-edit", TravelMapEdit);
