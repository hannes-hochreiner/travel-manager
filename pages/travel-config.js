import { TravelHeader } from "../components/travel-header.js";
import { TravelLogin } from "../components/travel-login.js";
import { TravelNotification } from "../components/travel-notification.js";

export class TravelConfig extends HTMLElement {
  #repo = null;
  #bc = null;
  #config = null;
  #info = null;

  constructor(repo) {
    super();
    this.#repo = repo;
    this.#bc = new BroadcastChannel("notification");
  }

  async connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "open" });

    try {
      this.#config = await this.#repo.getConfig();
    } catch (err) {
      this.#config = {
        _id: "config",
        offline: false,
        notifyOnAutoSync: false,
      };
    }

    try {
      this.#info = await this.#repo.getInfo();
    } catch (err) {
      this.#info = {
        _id: "info",
        lastLogin: null,
        lastSync: null,
      };
    }

    shadowRoot.innerHTML = this.#render();
  }

  #render() {
    return /*html*/ `
      <style>
        div.content {
          display: flex;
          flex-direction: column;
        }

        main {
          margin: 1rem;
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
        }

        .breadcrumb {
          background: linear-gradient(45deg, var(--secondary), var(--secondary-light));
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: baseline;
          padding: 0 1rem; 
          color: var(--secondary-dark);
        }
        .breadcrumb h2 {
          margin: 0.5rem 0;
        }

        header {
          font-weight: 700;
          font-size: 1.2rem;
        }

        button {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          padding: 0.5rem;
          gap: 0.5rem;
        }
      </style>
      <div class="content">
        <travel-header>
        </travel-header>
        <div class="breadcrumb">
          <h2>Configuration</h2>
        </div>
        <main>
          <article id="authentication">
            ${this.#renderAuthentication()}
          </article>
          <article id="synchronization">
            ${this.#renderSynchronization()}
          </article>
          <article id="networking">
            ${this.#renderNetworking()}
          </article>
          <travel-login></travel-login>
          <travel-notification></travel-notification>
        </main>
      </div>
    `;
  }

  #renderNetworking() {
    return /*html*/ `
      <header>
        Networking Mode
      </header>
      <main>
        <button id="connect" onclick="this.getRootNode().host.toggleConnect(event)">
          ${this.#config.offline ? 
            '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M790-56 414-434q-47 11-87.5 33T254-346l-84-86q32-32 69-56t79-42l-90-90q-41 21-76.5 46.5T84-516L0-602q32-32 66.5-57.5T140-708l-84-84 56-56 736 736-58 56Zm-310-64q-42 0-71-29.5T380-220q0-42 29-71t71-29q42 0 71 29t29 71q0 41-29 70.5T480-120Zm236-238-29-29-29-29-144-144q81 8 151.5 41T790-432l-74 74Zm160-158q-77-77-178.5-120.5T480-680q-21 0-40.5 1.5T400-674L298-776q44-12 89.5-18t92.5-6q142 0 265 53t215 145l-84 86Z"/></svg>'
            :
            '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-120q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM254-346l-84-86q59-59 138.5-93.5T480-560q92 0 171.5 35T790-430l-84 84q-44-44-102-69t-124-25q-66 0-124 25t-102 69ZM84-516 0-600q92-94 215-147t265-53q142 0 265 53t215 147l-84 84q-77-77-178.5-120.5T480-680q-116 0-217.5 43.5T84-516Z"/></svg>'
          } 
          ${this.#config.offline ? "offline" : "online"}
        </button>
      </main>
    `
  }

  #renderAuthentication() {
    return /*html*/ `
      <header>
        Authentication
      </header>
      <main>
        Last login: ${this.#formatDate(this.#info.lastLogin)}
        <button id="login_button" onclick="this.getRootNode().host.login(event)">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z"/></svg> login
        </button>
      </main>
    `
  }

  #renderSynchronization() {
    return /*html*/ `
      <header>
        Synchronization
      </header>
      <main>
        Last synchronization: ${this.#formatDate(this.#info.lastSync)}
        <button onclick="this.getRootNode().host.toggleNotifyOnAutoSync(event)">
          ${this.#config.notifyOnAutoSync ? 
            '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M80-560q0-100 44.5-183.5T244-882l47 64q-60 44-95.5 111T160-560H80Zm720 0q0-80-35.5-147T669-818l47-64q75 55 119.5 138.5T880-560h-80ZM160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z"/></svg> synchronization notifications on'
            :
            '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M160-200v-80h80v-280q0-33 8.5-65t25.5-61l60 60q-7 16-10.5 32.5T320-560v280h248L56-792l56-56 736 736-56 56-146-144H160Zm560-154-80-80v-126q0-66-47-113t-113-47q-26 0-50 8t-44 24l-58-58q20-16 43-28t49-18v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v206Zm-276-50Zm36 324q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80Zm33-481Z"/></svg> synchronization notifications off'
          }
        </button>
        <button onclick="this.getRootNode().host.sync(event)">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M160-160v-80h110l-16-14q-52-46-73-105t-21-119q0-111 66.5-197.5T400-790v84q-72 26-116 88.5T240-478q0 45 17 87.5t53 78.5l10 10v-98h80v240H160Zm400-10v-84q72-26 116-88.5T720-482q0-45-17-87.5T650-648l-10-10v98h-80v-240h240v80H690l16 14q49 49 71.5 106.5T800-482q0 111-66.5 197.5T560-170Z"/></svg> synchronize
        </button>
      </main>
    `
  }

  async login() {
    try {
      const loginData = await this.shadowRoot.querySelector("travel-login").getLoginData();

      if (loginData) {
        let url = "/api/_session";
  
        console.log(await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({name: loginData.username, password: loginData.password})
        }));

        this.#info.lastLogin = new Date();
        await this.#repo.setInfo(this.#info);
        this.#info = await this.#repo.getInfo();
        this.shadowRoot.querySelector("#authentication").innerHTML = this.#renderAuthentication();
        this.#bc.postMessage({title: "Login", message: "Login successful", type: "success"});
      }
    } catch (error) {
      console.error(error);
      this.#bc.postMessage({title: "Login Error", message: error.message, type: "error"});
    }
  }

  async sync() {
    try {
      await this.#repo.sync();
      this.#info.lastSync = new Date();
      await this.#repo.setInfo(this.#info);
      this.#info = await this.#repo.getInfo();
      this.shadowRoot.querySelector("#synchronization").innerHTML = this.#renderSynchronization();
      this.#bc.postMessage({title: "Sync", message: "Synchronization successful", type: "info"});
    } catch (err) {
      console.log(err);
      this.#bc.postMessage({title: "Sync Error", message: err.message, type: "error"});
    }
  }

  async toggleConnect() {
    try {
      this.#config.offline = !this.#config.offline;
      await this.#repo.setConfig(this.#config);
      this.#config = await this.#repo.getConfig();
      this.shadowRoot.querySelector("#networking").innerHTML = this.#renderNetworking();
      this.#bc.postMessage({title: "Connection", message: this.#config.offline ? "Offline" : "Online", type: "info"});
    } catch (error) {
      console.error(error);
      this.#bc.postMessage({title: "Connection Error", message: error.message, type: "error"});
    }
  }

  async toggleNotifyOnAutoSync() {
    try {
      this.#config.notifyOnAutoSync = !this.#config.notifyOnAutoSync;
      await this.#repo.setConfig(this.#config);
      this.#config = await this.#repo.getConfig();
      this.shadowRoot.querySelector("#synchronization").innerHTML = this.#renderSynchronization();
      this.#bc.postMessage({title: "Notification", message: this.#config.notifyOnAutoSync ? "Automatic synchronization notification enabled" : "Automatic synchronization notification disabled", type: "info"});
    } catch (error) {
      console.error(error);
      this.#bc.postMessage({title: "Notification Error", message: error.message, type: "error"});
    }
  }

  #formatDate(date) {
    if (date) {
      date = new Date(date);

      return `${date.getFullYear()}-${this.#ensureTwoDigits(date.getMonth() + 1)}-${this.#ensureTwoDigits(date.getDate())} ${this.#ensureTwoDigits(date.getHours())}:${this.#ensureTwoDigits(date.getMinutes())}`;
    } else {
      return "unknown";
    }
  }

  #ensureTwoDigits(num) {
    num = parseInt(num);

    return num < 10 ? `0${num}` : num;
  }
}

customElements.define("travel-config", TravelConfig);
