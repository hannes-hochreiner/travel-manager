import { Map, View, Feature, Overlay } from 'https://cdn.jsdelivr.net/npm/ol/+esm';
import { toLonLat, fromLonLat } from 'https://cdn.jsdelivr.net/npm/ol/proj/+esm';
import { OSM, Vector as VectorSource } from 'https://cdn.jsdelivr.net/npm/ol/source/+esm';
import { Tile as TileLayer, Vector as VectorLayer } from 'https://cdn.jsdelivr.net/npm/ol/layer/+esm';
import { Point, LineString } from 'https://cdn.jsdelivr.net/npm/ol/geom/+esm';
import { Style, Icon, Stroke } from 'https://cdn.jsdelivr.net/npm/ol/style/+esm';

export class TravelMapOverview extends HTMLElement {
  #map = null;
  #vectorSource = null;
  #iconDefault = null;
  #icons = {};

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

    this.#icons.accommodation = new Style({
      image: new Icon({
        anchor: [.5, .5],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: URL.createObjectURL(new Blob([`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#143f52"><path d="M40-200v-600h80v400h320v-320h320q66 0 113 47t47 113v360h-80v-120H120v120H40Zm240-240q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Z"/></svg>`], {type: 'image/svg+xml'})),
      }),
    });

    this.#icons.museum = new Style({
      image: new Icon({
        anchor: [.5, .5],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: URL.createObjectURL(new Blob([`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#143f52"><path d="M80-80v-80h80v-360H80v-80l400-280 400 280v80h-80v360h80v80H80Zm240-160h80v-160l80 120 80-120v160h80v-280h-80l-80 120-80-120h-80v280Z"/></svg>`], {type: 'image/svg+xml'})),
      }),
    });

    this.#icons.temple = new Style({
      image: new Icon({
        anchor: [.5, .5],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: URL.createObjectURL(new Blob([`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#143f52"><path d="M630-320v-112l-76-139q-20 10-32 29t-12 42v320l57 100h313l-40-500-280-320-13 13q-29 29-34.5 68t14.5 74l163 297v128h-60Zm-360 0v-128l163-297q20-35 13.5-74T412-887l-12-13-280 320L80-80h313l57-100v-320q0-23-12.5-42T406-571l-76 139v112h-60Z"/></svg>`], {type: 'image/svg+xml'})),
      }),
    });

    this.#icons.nature = new Style({
      image: new Icon({
        anchor: [.5, .5],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: URL.createObjectURL(new Blob([`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#143f52"><path d="M200-80v-80h240v-160h-80q-83 0-141.5-58.5T160-520q0-60 33-110.5t89-73.5q9-75 65.5-125.5T480-880q76 0 132.5 50.5T678-704q56 23 89 73.5T800-520q0 83-58.5 141.5T600-320h-80v160h240v80H200Z"/></svg>`], {type: 'image/svg+xml'})),
      }),
    });

    this.#icons.sight = new Style({
      image: new Icon({
        anchor: [.5, .5],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: URL.createObjectURL(new Blob([`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#143f52"><path d="M80-120v-80h160v-160h-80v-80h84q12-75 66.5-129.5T440-636v-204h280v160H520v44q75 12 129.5 66.5T716-440h84v80h-80v160h160v80H80Zm240-80h120v-160H320v160Zm200 0h120v-160H520v160Z"/></svg>`], {type: 'image/svg+xml'})),
      }),
    });

    this.#icons.transport = new Style({
      image: new Icon({
        anchor: [.5, .5],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: URL.createObjectURL(new Blob([`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#143f52"><path d="M760-320q-72 0-127-45t-69-115H445l-48-80h167q5-22 13.5-42t22.5-38H348l-48-80h342l-44-120H440v-80h158q26 0 46 14.5t29 38.5l54 147h33q83 0 141.5 58.5T960-520q0 83-58.5 141.5T760-320Zm0-80q50 0 85-35t35-85q0-50-35-85t-85-35h-3l39 107-76 27-38-105q-20 17-31 41t-11 50q0 50 35 85t85 35ZM280-40q-50 0-85-35t-35-85H0v-240h80v-120H0v-80h280l120 200h80q33 0 56.5 23.5T560-320v80q0 33-23.5 56.5T480-160h-80q0 50-35 85t-85 35ZM160-400h147l-72-120h-75v120Zm120 280q17 0 28.5-11.5T320-160q0-17-11.5-28.5T280-200q-17 0-28.5 11.5T240-160q0 17 11.5 28.5T280-120Z"/></svg>`], {type: 'image/svg+xml'})),
      }),
    });

    this.#icons.information = new Style({
      image: new Icon({
        anchor: [.5, .5],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: URL.createObjectURL(new Blob([`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#143f52"><path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>`], {type: 'image/svg+xml'})),
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
        if (object.type === "stay") {
          let position = object.position || [0, 0];
          long_max = Math.max(long_max, position[0]);
          long_min = Math.min(long_min, position[0]);
          lat_max = Math.max(lat_max, position[1]);
          lat_min = Math.min(lat_min, position[1]);
  
          let feature = new Feature({
            geometry: new Point(fromLonLat(position)),
          });
  
          if (this.#icons[object.subtype]) {
            feature.setStyle([this.#icons[object.subtype]]);
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
        } else if (object.type === "transport") {
          let startPosition = object.startPosition || [0, 0];
          long_max = Math.max(long_max, startPosition[0]);
          long_min = Math.min(long_min, startPosition[0]);
          lat_max = Math.max(lat_max, startPosition[1]);
          lat_min = Math.min(lat_min, startPosition[1]);
          let endPosition = object.endPosition || [0, 0];
          long_max = Math.max(long_max, endPosition[0]);
          long_min = Math.min(long_min, endPosition[0]);
          lat_max = Math.max(lat_max, endPosition[1]);
          lat_min = Math.min(lat_min, endPosition[1]);
  
          let feature = new Feature({
            geometry: new LineString([fromLonLat(startPosition), fromLonLat(endPosition)]),
          });

          const dx = endPosition[0] - startPosition[0];
          const dy = endPosition[1] - startPosition[1];
          const rotation = Math.atan2(dy, dx) - (Math.PI / 4);

          feature.setStyle([
            new Style({
              stroke: new Stroke({
                color: '#143f52',
                width: 2,
              }),
            }),
            new Style({
              geometry: new Point(fromLonLat([(endPosition[0] + startPosition[0]) / 2.0, (endPosition[1] + startPosition[1]) / 2.0])),
              image: new Icon({
                src: URL.createObjectURL(new Blob([`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#143f52"><path d="M516-120 402-402 120-516v-56l720-268-268 720h-56Z"/></svg>`], {type: 'image/svg+xml'})),
                anchor: [0.5, 0.5],
                rotateWithView: true,
                rotation: -rotation,
              }),
            }),
          ]);

          return feature;
        }
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
