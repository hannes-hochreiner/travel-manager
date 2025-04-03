export class TravelList extends HTMLElement {
  // static observedAttributes = ["color", "size"];
  // repo_channel = new BroadcastChannel("travel-repo");
  #repo = null;

  constructor() {
    super();
    let template = document.getElementById("travel-list-template");
    let templateContent = template.content;

    // const shadowRoot = this.attachShadow({ mode: "open", slotAssignment: "manual" });
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(templateContent.cloneNode(true));

    // this.repo_channel.onmessage = (event) => {
    //   console.log(event.data);
    //   let message = event.data;

    //   if (message.type === "response-travels") {
    //     // console.log(shadowRoot.querySelector("slot").assignedElements()[0]);
    //     message.travels.forEach((travel) => {
    //       // let viewTemplate = document.getElementById("travel-view-template");
    //       let travelViewElement = document.createElement("travel-view");

    //       travelViewElement.object = travel;
    //       // travelViewElement.setAttribute("object", travel);

    //       // console.log(testElement);

    //       // Object.keys(travel).forEach((key) => {
    //       //   let element = viewTemplate.content.querySelector("#" + key);

    //       //   if (element) {
    //       //     element.innerHTML = travel[key];
    //       //   }
    //       // });
    //       shadowRoot.appendChild(travelViewElement);
    //     })
    //     // shadhowRoot.querySelector("p").innerHTML = message.travels[0].title;
    //   }
    // };
  }

  set repo(repo) {
    this.#repo = repo;
    console.log("repo set");
    this.update();
  }

  update() {
    if (this.#repo) {
      (async () => await this.#repo.getTravels())().then((travels) => {
        console.log("got travels", travels);
        travels.forEach(travel => {
          let travelViewElement = document.createElement("travel-view");
          travelViewElement.object = travel;
          this.shadowRoot.appendChild(travelViewElement);
        });
      })
    }
  }

  connectedCallback() {
    console.log("TravelList added to page.");
    // this.update();
    // this.repo_channel.postMessage({ type: "request-travels" });
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
