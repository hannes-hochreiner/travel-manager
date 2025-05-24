export class TravelMenu extends HTMLElement {
  #mouseEnter = false;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    
    let style = this.getAttribute("style") || "primary";

    shadowRoot.innerHTML = /*html*/ `
      <style>
        .dropdown {
          position: relative;
          display: inline-block;
        }

        .dropdown button svg {
          fill: var(--${style}-dark);
        }

        .dropdown button {
          background: none;
          border: none;
          padding: 0.5rem;
          border-radius: 0.25rem;
        }

        .dropdown.open button {
          background-color: var(--${style}-light);
        }

        .dropdown button:hover {
          cursor: pointer;
          background-color: var(--${style}-light);
        }

        .dropdown-content {
          display: none;
          position: absolute;
          right: 0;
          top: 1rem;
          background-color: var(--background);
          min-width: 15rem;
          box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
          padding: 0.5rem;
          z-index: 1;
          list-style: none;
        }

        .dropdown.open .dropdown-content {
          display: flex;
          flex-direction: column;
        }

        .dropdown-content ::slotted(li) {
          display: flex;
          flex-direction: row;
          gap: 0.5rem;
          padding: 0.5rem;
        }

        .dropdown-content ::slotted(li:hover) {
          cursor: pointer;
          background-color: var(--${style}-light);
        }
      </style>
      <div class="dropdown">
        <button onclick="this.getRootNode().host.toggleOpen()" onfocusout="this.getRootNode().host.focusOut(event)">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"/></svg>
        </button>
        <menu class="dropdown-content" onmouseenter="this.getRootNode().host.mouseEnter()" onclick="this.getRootNode().host.close()" onmouseleave="this.getRootNode().host.close()">
          <slot></slot>
        </menu>
      </div>
    `;
  }

  toggleOpen() {
    this.shadowRoot.querySelector(".dropdown").classList.toggle("open");
    this.#mouseEnter = false;
  }

  focusOut(event) {
    if (!this.#mouseEnter) {
      this.close();
    }
  }

  close() {
    this.shadowRoot.querySelector(".dropdown").classList.remove("open");
  }

  mouseEnter() {
    this.#mouseEnter = true;
  }
}
