import { ElementCache } from "../element-cache.js";

export class TravelLocationView extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.location = null;
    }

    static get observedAttributes() {
        return ["location-id"];
    }

    async attributeChangedCallback(name, oldValue, newValue) {
        if (name === "location-id" && newValue !== oldValue) {
            await this.loadLocation(newValue);
        }
    }

    async loadLocation(locationId) {
        const repo = await ElementCache.get("travel-repo");
        this.location = await repo.getLocation(locationId);
        this.render();
    }

    render() {
        if (!this.location) {
            this.shadowRoot.innerHTML = "";
            return;
        }

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    padding: 1rem;
                }
                .location-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }
                .location-title {
                    font-size: 1.5rem;
                    font-weight: bold;
                }
                .location-dates {
                    color: #666;
                    margin: 0.5rem 0;
                }
                .location-description {
                    margin-top: 1rem;
                    white-space: pre-wrap;
                }
                .location-type {
                    display: inline-block;
                    padding: 0.25rem 0.5rem;
                    border-radius: 0.25rem;
                    background-color: #e0e0e0;
                    color: #333;
                    font-size: 0.875rem;
                }
            </style>
            <div class="location-header">
                <div class="location-title">${this.location.title}</div>
                <span class="location-type">${this.location.subtype}</span>
            </div>
            <div class="location-description">${this.location.description}</div>
        `;
    }
}

customElements.define("travel-location-view", TravelLocationView); 