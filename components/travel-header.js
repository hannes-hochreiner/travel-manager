export class TravelHeader extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = /*html*/ `
      <style>
        header {
          background: linear-gradient(45deg, var(--primary-light), var(--primary));
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: baseline;
          padding: 0 1rem;
          color: var(--primary-dark);
        }

        a {
          text-decoration: none;
          color: var(--primary-dark);
        }
      </style>
      <header>
        <a href="/"><h1>Travel</h1></a>
        <slot name="actions"></slot>
      </header>
    `;
  }
}

customElements.define("travel-header", TravelHeader);
