import { TravelHeader } from "../components/travel-header.js";
import { TravelLogin } from "../components/travel-login.js";
import { Repo } from "../repo.js";
import { Config } from "../objects/config.js";

export class TravelConfig extends HTMLElement {
  #bc = null;
  #config = null;
  #info = null;

  constructor() {
    super();
    this.#bc = new BroadcastChannel("notification");
  }

  async connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "open" });
    const repo = await new Repo();

    try {
      this.#config = await repo.getConfig();
    } catch (err) {
      this.#config = Config.default();
    }

    try {
      this.#info = await repo.getInfo();
    } catch (err) {
      this.#info = {
        _id: "info",
        lastSync: null,
      };
    }

    shadowRoot.innerHTML = await this.#render();
  }

  async #render() {
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
          <article id="synchronization">
            ${this.#renderSynchronization()}
          </article>
          <article id="external-apps">
            ${this.#renderExternalApps()}
          </article>
          <article id="storage">
            ${await this.#renderStorage()}
          </article>
          <travel-login></travel-login>
        </main>
      </div>
    `;
  }

  #renderExternalApps() {
    return /*html*/ `
      <header>
        External Apps
      </header>
      <main>
        <button onclick="this.getRootNode().host.toggleOrganicMaps(event)">
          ${this.#config.organicMapsAvailable ?
            '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m600-120-240-84-186 72q-20 8-37-4.5T120-170v-560q0-13 7.5-23t20.5-15l212-72 240 84 186-72q20-8 37 4.5t17 33.5v560q0 13-7.5 23T812-192l-212 72Zm-40-98v-468l-160-56v468l160 56Zm80 0 120-40v-474l-120 46v468Zm-440-10 120-46v-468l-120 40v474Zm440-458v468-468Zm-320-56v468-468Z"/></svg>'
            :
            '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 400Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Z"/></svg>'
          }
          Organic Maps ${this.#config.organicMapsAvailable ? "available" : "not available"}
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

  async #renderStorage() {
    let estimate = await navigator.storage.estimate();

    return /*html*/ `
      <header>
        Storage
      </header>
      <main>
        Quota: ${Math.round(estimate.quota / (1024 * 1024))} MB<br>
        Usage: ${Math.round(estimate.usage / (1024 * 1024))} MB<br>
        Persisted: ${(await navigator.storage.persisted()) ? "yes" : "no"}
        <button onclick="this.getRootNode().host.persist(event)">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M160-120v-80h640v80H160Zm320-160L280-480l56-56 104 104v-408h80v408l104-104 56 56-200 200Z"/></svg> Persist
        </button>
      </main>
    `
  }

  async persist() {
    try {
      let result = await navigator.storage.persist(); 

      console.log("persist", result);

      if (result) {
        this.#bc.postMessage({title: "Persist", message: "Storage persisted", type: "info"});
      } else {
        this.#bc.postMessage({title: "Persist Error", message: "Storage not persisted", type: "error"});
      }

      this.shadowRoot.querySelector("#storage").innerHTML = await this.#renderStorage();
    } catch (error) {
      console.error(error);
      this.#bc.postMessage({title: "Persist Error", message: error.message, type: "error"});
    }
  }

  async sync() {
    try {
      const repo = await new Repo();
      await repo.sync();
      this.#info.lastSync = new Date();
      await repo.setInfo(this.#info);
      this.#info = await repo.getInfo();
      this.shadowRoot.querySelector("#synchronization").innerHTML = this.#renderSynchronization();
      this.#bc.postMessage({title: "Sync", message: "Synchronization successful", type: "info"});
    } catch (err) {
      console.log(err);
      this.#bc.postMessage({title: "Sync Error", message: err.message, type: "error"});
    }
  }

  async toggleOrganicMaps() {
    try {
      const repo = await new Repo();
      const fresh = await repo.getConfig();
      fresh.organicMapsAvailable = !fresh.organicMapsAvailable;
      await repo.setConfig(fresh);
      this.#config = await repo.getConfig();
      this.shadowRoot.querySelector("#external-apps").innerHTML = this.#renderExternalApps();
      this.#bc.postMessage({ title: "External Apps", message: this.#config.organicMapsAvailable ? "Organic Maps enabled" : "Organic Maps disabled", type: "info" });
    } catch (error) {
      console.error(error);
      this.#bc.postMessage({ title: "External Apps Error", message: error.message, type: "error" });
    }
  }

  async toggleNotifyOnAutoSync() {
    try {
      const repo = await new Repo();
      const fresh = await repo.getConfig();
      fresh.notifyOnAutoSync = !fresh.notifyOnAutoSync;
      await repo.setConfig(fresh);
      this.#config = await repo.getConfig();
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
