export class TravelView extends HTMLElement {
  // static observedAttributes = ["color", "size"];
  repo_channel = new BroadcastChannel("travel-repo");
  #object = null;

  constructor() {
    super();
    let template = document.getElementById("travel-view-template");
    let templateContent = template.content;

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(templateContent.cloneNode(true));

    // this.repo_channel.onmessage = (event) => {
    //   console.log(event.data);
    //   let message = event.data;

    //   if (message.type === "handshake") {
    //     this.repo_channel.postMessage({ type: "request-travels" });
    //   } else if (message.type === "response-travels") {
    //     message.travels.forEach((travel) => {
    //       let viewTemplate = document.getElementById("travel-view-template");

    //       Object.keys(travel).forEach((key) => {
    //         let element = viewTemplate.content.querySelector("#" + key);

    //         if (element) {
    //           element.innerHTML = travel[key];
    //         }
    //       });
    //       shadowRoot.appendChild(viewTemplate.content.cloneNode(true));
    //     })
    //     // shadhowRoot.querySelector("p").innerHTML = message.travels[0].title;
    //   }
    // };
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
