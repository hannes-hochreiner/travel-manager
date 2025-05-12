import { Map, View, Feature, Overlay } from 'https://cdn.jsdelivr.net/npm/ol/+esm';
import { toLonLat, fromLonLat } from 'https://cdn.jsdelivr.net/npm/ol/proj/+esm';
import { OSM, Vector as VectorSource } from 'https://cdn.jsdelivr.net/npm/ol/source/+esm';
import { Tile as TileLayer, Vector as VectorLayer } from 'https://cdn.jsdelivr.net/npm/ol/layer/+esm';
import { Point } from 'https://cdn.jsdelivr.net/npm/ol/geom/+esm';
import { Style, Icon } from 'https://cdn.jsdelivr.net/npm/ol/style/+esm';

export class TravelMapOverview extends HTMLElement {
  #map = null;
  #vectorSource = null;
  #iconDefault = null;
  #iconAccommodation = null;
  #iconMuseum = null;
  #iconTemple = null;
  #iconNature = null;
  #iconSight = null;

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
    
    this.#iconDefault = new Style({
      image: new Icon({
        anchor: [.5, .5],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: URL.createObjectURL(new Blob([`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#143f52"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 400Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Z"/></svg>`], {type: 'image/svg+xml'})),
      }),
    });

    this.#iconAccommodation = new Style({
      image: new Icon({
        anchor: [.5, .5],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: URL.createObjectURL(new Blob([`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#143f52"><path d="M40-200v-600h80v400h320v-320h320q66 0 113 47t47 113v360h-80v-120H120v120H40Zm240-240q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Z"/></svg>`], {type: 'image/svg+xml'})),
      }),
    });

    this.#iconMuseum = new Style({
      image: new Icon({
        anchor: [.5, .5],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: URL.createObjectURL(new Blob([`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#143f52"><path d="M80-80v-80h80v-360H80v-80l400-280 400 280v80h-80v360h80v80H80Zm240-160h80v-160l80 120 80-120v160h80v-280h-80l-80 120-80-120h-80v280Z"/></svg>`], {type: 'image/svg+xml'})),
      }),
    });

    this.#iconTemple = new Style({
      image: new Icon({
        anchor: [.5, .5],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: URL.createObjectURL(new Blob([`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#143f52"><path d="M630-320v-112l-76-139q-20 10-32 29t-12 42v320l57 100h313l-40-500-280-320-13 13q-29 29-34.5 68t14.5 74l163 297v128h-60Zm-360 0v-128l163-297q20-35 13.5-74T412-887l-12-13-280 320L80-80h313l57-100v-320q0-23-12.5-42T406-571l-76 139v112h-60Z"/></svg>`], {type: 'image/svg+xml'})),
      }),
    });

    this.#iconNature = new Style({
      image: new Icon({
        anchor: [.5, .5],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: URL.createObjectURL(new Blob([`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#143f52"><path d="M200-80v-80h240v-160h-80q-83 0-141.5-58.5T160-520q0-60 33-110.5t89-73.5q9-75 65.5-125.5T480-880q76 0 132.5 50.5T678-704q56 23 89 73.5T800-520q0 83-58.5 141.5T600-320h-80v160h240v80H200Z"/></svg>`], {type: 'image/svg+xml'})),
      }),
    });

    this.#iconSight = new Style({
      image: new Icon({
        anchor: [.5, .5],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: URL.createObjectURL(new Blob([`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#143f52"><path d="M80-120v-80h160v-160h-80v-80h84q12-75 66.5-129.5T440-636v-204h280v160H520v44q75 12 129.5 66.5T716-440h84v80h-80v160h160v80H80Zm240-80h120v-160H320v160Zm200 0h120v-160H520v160Z"/></svg>`], {type: 'image/svg+xml'})),
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

        if (object.subtype === "accommodation") {
          feature.setStyle([this.#iconAccommodation]);
        } else if (object.subtype === "nature") {
          feature.setStyle([this.#iconNature]);
        } else if (object.subtype === "museum") {
          feature.setStyle([this.#iconMuseum]);
        } else if (object.subtype === "sight") {
          feature.setStyle([this.#iconSight]);
        } else if (object.subtype === "temple") {
          feature.setStyle([this.#iconTemple]);
        } else {
          feature.setStyle([this.#iconDefault]);
        }

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
