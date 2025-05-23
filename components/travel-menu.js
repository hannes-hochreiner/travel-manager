export class TravelMenu extends HTMLElement {
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

        .dropdown svg {
          fill: var(--${style}-dark);
        }

        .dropdown-content {
          display: none;
          position: absolute;
          right: 0;
          top: -0.7rem;
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
        <svg onclick="this.parentElement.classList.toggle('open')" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"/></svg>
        <menu class="dropdown-content" onclick="this.parentElement.classList.remove('open')" onmouseleave="this.parentElement.classList.remove('open')">
          <slot></slot>
        </menu>
      </div>
    `;
  }
}
