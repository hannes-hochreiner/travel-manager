export class TravelHeader extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = /*html*/ `
      <style>
        header {
          background-color: var(--dark);
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: baseline;
          padding: 0 1rem;
          color: var(--light)
        }

        h1 {
          
        }
      </style>
      <header>
        <h1>Travel</h1>
        <slot name="actions"></slot>
      </header>
    `;
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

customElements.define("travel-header", TravelHeader);
