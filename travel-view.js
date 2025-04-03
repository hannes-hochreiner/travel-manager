export class TravelView extends HTMLElement {
  // static observedAttributes = ["color", "size"];
  #object = null;

  constructor() {
    super();
    let template = document.getElementById("travel-view-template");
    let templateContent = template.content;

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(templateContent.cloneNode(true));
  }

  set object(object) {
    console.log(object);
    this.#object = object;
    this.update();
  }

  update() {
    Object.keys(this.#object).forEach((key) => {
      let element = this.shadowRoot.querySelector("#" + key);

      if (element) {
        element.innerHTML = this.#object[key];
      }
    });
  }

  connectedCallback() {
    console.log("TravelView added to page.");
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
