import { ElementCache } from "../element-cache.js";

export class TravelLocationEdit extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.location = null;
        this.parentId = null;
    }

    static get observedAttributes() {
        return ["location-id", "parent-id"];
    }

    async attributeChangedCallback(name, oldValue, newValue) {
        if (name === "location-id" && newValue !== oldValue) {
            await this.loadLocation(newValue);
        } else if (name === "parent-id" && newValue !== oldValue) {
            this.parentId = newValue;
            this.render();
        }
    }

    async loadLocation(locationId) {
        const repo = await ElementCache.get("travel-repo");
        this.location = await repo.getLocation(locationId);
        this.render();
    }

    async saveLocation(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        const location = {
            type: "location",
            subtype: formData.get("subtype"),
            title: formData.get("title"),
            description: formData.get("description"),
            parent: this.parentId,
            position: [0, 0] // Default position, can be updated later
        };

        if (this.location) {
            location._id = this.location._id;
            location._rev = this.location._rev;
        }

        const repo = await ElementCache.get("travel-repo");
        await repo.saveLocation(location);

        // Dispatch event to notify parent
        this.dispatchEvent(new CustomEvent("location-saved", {
            detail: { locationId: location._id },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    padding: 1rem;
                }
                form {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                label {
                    font-weight: bold;
                }
                input, textarea, select {
                    padding: 0.5rem;
                    border: 1px solid #ccc;
                    border-radius: 0.25rem;
                }
                textarea {
                    min-height: 100px;
                    resize: vertical;
                }
                button {
                    padding: 0.5rem 1rem;
                    background-color: #2196f3;
                    color: white;
                    border: none;
                    border-radius: 0.25rem;
                    cursor: pointer;
                }
                button:hover {
                    background-color: #1976d2;
                }
            </style>
            <form onsubmit="this.saveLocation(event)">
                <div class="form-group">
                    <label for="subtype">Type</label>
                    <select id="subtype" name="subtype" required>
                        <option value="accommodation" ${this.location?.subtype === "accommodation" ? "selected" : ""}>Accommodation</option>
                        <option value="sight" ${this.location?.subtype === "sight" ? "selected" : ""}>Sight</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="title">Title</label>
                    <input type="text" id="title" name="title" required 
                           value="${this.location?.title || ""}">
                </div>
                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea id="description" name="description" required>${this.location?.description || ""}</textarea>
                </div>
                <button type="submit">Save Location</button>
            </form>
        `;

        // Add event listener for form submission
        const form = this.shadowRoot.querySelector("form");
        form.onsubmit = (event) => this.saveLocation(event);
    }
}

customElements.define("travel-location-edit", TravelLocationEdit); 