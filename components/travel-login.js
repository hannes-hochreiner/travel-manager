export class TravelLogin extends HTMLElement {
  #resolve = null;
  #reject = null;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = /*html*/ `
      <style>
        dialog {
          padding: 0;
          width: calc(100% - 1rem);
        }

        div.content {
          display: flex;
          flex-direction: column;
          border: 1px solid;
        }

        header {
          background: linear-gradient(45deg, var(--tertiary-light), var(--tertiary));
          padding: 0.5rem;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--tertiary-dark);
        }

        footer {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }

        .action {
          flex-grow: 1;
        }

        main {
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        p {
          background-color: #aaa;
          padding: 5px;
        }
      </style>
      <dialog id="dialog">
        <div class="content">
          <header>
            Login
          </header>
          <main>
            <label for="username">Username</label>
            <input id="username" type="text" />
            <label for="password">Password</label>
            <input id="password" type="password" />
          </main>
          <footer>
            <button onclick="this.getRootNode().host.loginOk()" class="action">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
            </button>
            <button onclick="this.getRootNode().host.loginCancel()" class="action">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
            </button>
          </footer>
        </div>
      </dialog>
    `;
    // this.shadowRoot.querySelector("#button_save")
    //   .addEventListener("click", () => this.#login_ok());
    // this.shadowRoot.querySelector("#button_cancel")
    //   .addEventListener("click", () => this.#login_cancel());
  }

  // set show(show) {
  //   if (show) {
  //     this.shadowRoot.querySelector("#dialog").showModal();
  //   } else {
  //     this.shadowRoot.querySelector("#dialog").close();
  //   }
  // }

  // set callback(cb) {
  //   this.#cb = cb;
  // }

  async getLoginData() {
    return new Promise((resolve, reject) => {
      this.#resolve = resolve;
      this.#reject = reject;
      this.shadowRoot.querySelector("#username").value = "";
      this.shadowRoot.querySelector("#password").value = "";
      this.shadowRoot.querySelector("#dialog").showModal();
    })
  }

  loginOk() {
    this.shadowRoot.querySelector("#dialog").close();
    this.#resolve({
      username: this.shadowRoot.querySelector("#username").value,
      password: this.shadowRoot.querySelector("#password").value,
    });
    this.#resolve = null;
    this.#reject = null;
    this.shadowRoot.querySelector("#username").value = "";
    this.shadowRoot.querySelector("#password").value = "";
  }

  loginCancel() {
    this.shadowRoot.querySelector("#dialog").close();
    this.#resolve();
    this.#resolve = null;
    this.#reject = null;
    this.shadowRoot.querySelector("#username").value = "";
    this.shadowRoot.querySelector("#password").value = "";
  }
}

customElements.define("travel-login", TravelLogin);
