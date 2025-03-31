export class TravelRepo extends HTMLElement {
  repo_channel = new BroadcastChannel("travel-repo");

  constructor() {
    super();
    let template = document.getElementById("travel-repo-template");
    const shadowRoot = this.attachShadow({ mode: "open", slotAssignment: "manual" });
    // const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(template.content.cloneNode(true));

    this.repo_channel.onmessage = (event) => {
      console.log(event.data);
      let message = event.data;

      if (message.type === "request-travels") {
        this.repo_channel.postMessage({
          type: "response-travels", travels: [
            { title: "title 1", description: "description 1" },
            { title: "title 2", description: "description 2" }
          ]
        });
      }
    };
    // this.repo_channel.postMessage({ type: "handshake" });

    setTimeout(() => {
      shadowRoot.querySelector("slot").assign(this.querySelector("[slot]"));
    }, 3000);
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