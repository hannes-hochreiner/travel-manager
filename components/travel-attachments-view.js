import { escapeHtml } from "../objects/utils.js";

export class TravelAttachmentsView extends HTMLElement {
  #attachments = {};

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
  }

  #render() {
    const style = this.getAttribute("data-style") || "primary";

    return /*html*/ `
      <style>
        .attachments {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
          padding: 0.5rem;
          gap: 0.5rem;
        }

        button.attachment {
          height: 5rem;
          background-color: var(--${style}-light);
          border: 1px solid var(--${style}-dark);
          border-radius: 0.25rem;
          color: var(--${style}-dark);
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
        }

        button.attachment:hover {
          background-color: var(--${style}-dark);
          color: var(--${style}-light);
        }
      </style>
      <div class="attachments">
        ${this.#renderAttachments()}
      </div>
    `;
  }

  #renderAttachments() {
    return Object.entries(this.#attachments).toSorted((a, b) => a[0].localeCompare(b[0])).map((attachment) => {
      return /*html*/ `
        <button slot="attachment" onclick="this.getRootNode().host.dispatchEvent(new CustomEvent('open-attachment', { detail: { attachment: '${escapeHtml(attachment[0])}' } }))" class="attachment">${escapeHtml(attachment[0])}</button>
      `;
    }).join("");
  }

  set attachments(attachments) {
    this.#attachments = attachments ? attachments : {};
    this.shadowRoot.innerHTML = this.#render();
  }
}
