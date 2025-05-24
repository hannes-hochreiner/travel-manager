import { default as marked } from "https://cdn.jsdelivr.net/npm/marked/marked.min.js/+esm";

export class TravelMarkdownView extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    
    let style = this.getAttribute("data-style") || "primary";

    shadowRoot.innerHTML = /*html*/ `
      <style>
        div#markdown {
          padding: 0;
          margin: 0.5rem;
        }

        div#markdown h1, div#markdown h2, div#markdown h3, div#markdown h4, div#markdown h5, div#markdown h6 {
          color: var(--${style}-dark);
        }

        div#markdown h1 {
          font-size: 1.5rem;
        }

        div#markdown h2 {
          font-size: 1.3rem;
        }

        div#markdown h3 {
          font-size: 1.2rem;
          font-style: italic;
        }

        div#markdown a {
          color: var(--${style}-dark);
        }
      </style>
      <div id="markdown">
      </div>
    `;
  }

  set markdown(markdown) {
    this.shadowRoot.querySelector("#markdown").innerHTML = marked.parse(markdown);
    this.shadowRoot.querySelectorAll("a").forEach((link) => {
      link.target = "_blank";
    });
  }
}
