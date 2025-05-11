import { Map, View, Feature, Overlay } from 'https://cdn.jsdelivr.net/npm/ol/+esm';
import { toLonLat, fromLonLat } from 'https://cdn.jsdelivr.net/npm/ol/proj/+esm';
import { OSM, Vector as VectorSource } from 'https://cdn.jsdelivr.net/npm/ol/source/+esm';
import { Tile as TileLayer, Vector as VectorLayer } from 'https://cdn.jsdelivr.net/npm/ol/layer/+esm';
import { Point } from 'https://cdn.jsdelivr.net/npm/ol/geom/+esm';
import { Style, Icon } from 'https://cdn.jsdelivr.net/npm/ol/style/+esm';

export class TravelMapOverview extends HTMLElement {
  #map = null;
  #vectorSource = null;
  #iconStyle = null;

  constructor() {
    super();
    
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = /*html*/ `
      <style>
        @import "https://cdn.jsdelivr.net/npm/ol@10.5.0/ol.css";

        #map {
          height: 350px;
        }
        .overlay-content {
          background-color: rgba(255, 255, 255, 0.6);
          padding: 0 .5rem;
          border-radius: 5px;
        }
      </style>
      <div class="content">
        <div id="map"></div>
      </div>
    `;
    
    this.#iconStyle = new Style({
      image: new Icon({
        anchor: [.5, .5],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: URL.createObjectURL(new Blob([`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#143f52"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 400Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Z"/></svg>`], {type: 'image/svg+xml'})),
      }),
    });

    this.#vectorSource = new VectorSource();

    this.#map = new Map({
      layers: [
        new TileLayer({source: new OSM()}),
        new VectorLayer({
          source: this.#vectorSource,
        }),
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
      target: this.shadowRoot.querySelector("#map")
    });

    this.shadowRoot.querySelector("#map").addEventListener("mouseover", (e) => {
      this.#map.getOverlays().forEach(overlay => overlay.getElement().style.display = "none");
    });
    this.shadowRoot.querySelector("#map").addEventListener("mouseout", (e) => {
      this.#map.getOverlays().forEach(overlay => overlay.getElement().style.display = "block");
    });
  }

  set objects(objects) {
    let long_max = -180;
    let long_min = 180;
    let lat_max = -90;
    let lat_min = 90;
    this.#vectorSource.clear();
    this.#map.getOverlays().forEach(overlay => this.#map.removeOverlay(overlay));

    if (objects && objects.length > 0) {
      this.#vectorSource.addFeatures(objects.map(object => {
        let position = object.position || [0, 0];
        long_max = Math.max(long_max, position[0]);
        long_min = Math.min(long_min, position[0]);
        lat_max = Math.max(lat_max, position[1]);
        lat_min = Math.min(lat_min, position[1]);

        let feature = new Feature({
          geometry: new Point(fromLonLat(position)),
        });

        feature.setStyle([this.#iconStyle]);

        let overlayElement = document.createElement('div');
        overlayElement.innerHTML = /*html*/ `
          <div class="overlay-content">
            <p>${object.title}</p>
          </div>
        `;
  
        this.#map.addOverlay(new Overlay({
          position: fromLonLat(position),
          positioning: 'top-center',
          element: overlayElement,
        }));
  
        return feature;
      }));

      let min = fromLonLat([long_min, lat_min]);
      let max = fromLonLat([long_max, lat_max]);

      this.#map.getView().fit([min[0], min[1], max[0], max[1]], {
        padding: [100, 100, 100, 100],
        maxZoom: 15,
      });
    }
  }

  async getBlob() {
    return new Promise((resolve, reject) => {
      this.shadowRoot.querySelector("canvas").toBlob((blob) => {
        resolve(blob);
      });
    });
  }
}

customElements.define("travel-map-overview", TravelMapOverview);
