export class TravelAttachmentsView extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = /*html*/ `
      <style>
        .attachments {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
          padding: 0.5rem;
          gap: 0.5rem;
        }

        ::slotted([slot="attachment"]) {
          height: 5rem;
        }
      </style>
      <div class="attachments">
        <slot name="attachment"></slot>
      </div>
    `;
  }
}
