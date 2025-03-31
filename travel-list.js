export class TravelList extends HTMLElement {
  // static observedAttributes = ["color", "size"];
  repo_channel = new BroadcastChannel("travel-repo");

  constructor() {
    super();
    let template = document.getElementById("travel-list-template");
    let templateContent = template.content;

    // const shadowRoot = this.attachShadow({ mode: "open", slotAssignment: "manual" });
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(templateContent.cloneNode(true));

    this.repo_channel.onmessage = (event) => {
      console.log(event.data);
      let message = event.data;

      if (message.type === "response-travels") {
        // console.log(shadowRoot.querySelector("slot").assignedElements()[0]);
        message.travels.forEach((travel) => {
          // let viewTemplate = document.getElementById("travel-view-template");
          let travelViewElement = document.createElement("travel-view");

          travelViewElement.object = travel;
          // travelViewElement.setAttribute("object", travel);

          // console.log(testElement);

          // Object.keys(travel).forEach((key) => {
          //   let element = viewTemplate.content.querySelector("#" + key);

          //   if (element) {
          //     element.innerHTML = travel[key];
          //   }
          // });
          shadowRoot.appendChild(travelViewElement);
        })
        // shadhowRoot.querySelector("p").innerHTML = message.travels[0].title;
      }
    };
  }

  connectedCallback() {
    console.log("TravelList added to page.");
    this.repo_channel.postMessage({ type: "request-travels" });
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
