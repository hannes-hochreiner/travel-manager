export class TravelRepo extends HTMLElement {
  constructor() {
    super();
    let template = document.getElementById("travel-repo-template");
    const shadowRoot = this.attachShadow({ mode: "open", slotAssignment: "manual" });
    shadowRoot.appendChild(template.content.cloneNode(true));

    setTimeout(() => {
      let travelList = document.createElement("travel-list");
      this.appendChild(travelList);
      travelList.repo = this;
      shadowRoot.querySelector("slot").assign(travelList);
      // shadowRoot.querySelector("slot").assign(this.querySelector("[slot]"));
    }, 2000);
  }

  async getTravels() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([
          { title: "title 1", description: "description 1" },
          { title: "title 2", description: "description 2" }
        ]);
      }, 2000);
    })
  }

  connectedCallback() {
    console.log("TravelRepo added to page.");
  }

  disconnectedCallback() {
    console.log("Custom element removed from page.");
  }

  adoptedCallback() {
    console.log("Custom element moved to new page.");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Attribute ${name} has changed.`);
  }
}