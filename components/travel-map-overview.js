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
        src: '/data/map-location.svg',
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
