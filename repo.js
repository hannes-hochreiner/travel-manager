import { default as PouchDb } from "https://cdn.jsdelivr.net/npm/pouchdb/+esm";
import { default as PouchDbFind } from "https://cdn.jsdelivr.net/npm/pouchdb-find/+esm";

export class Repo {
  #db = null;
  #dbLocal = null;

  static async create() {
    let repo = new Repo();
    
    PouchDb.plugin(PouchDbFind);
    repo.#db = new PouchDb("travel");
    repo.#dbLocal = new PouchDb("travel_local");

    try {
      await repo.#db.createIndex({
        index: {
          fields: ["type", "parent"],
          // name: "id_parent",
        },
      });
    } catch (error) {
      console.log(error);
    }

    return repo;
  }

  async addDoc(doc) {
    await this.#db.put(doc);
  }

  async deleteDoc(doc) {
    await this.#db.remove(doc);
  }

  async getDoc(id) {
    return await this.#db.get(id);
  }

  async getAllDocs(type, parent) {
    return (
      await this.#db.find({
        selector: { type: type, parent: parent },
      })
    ).docs;
  }

  async sync() {
    console.log(await this.#db.sync(new PouchDb(`${window.location.origin}/api`)));
  }

  async getConfig() {
    return await this.#dbLocal.get("config");
  }

  async setConfig(config) {
    await this.#dbLocal.put(config);
  }

  async getInfo() {
    return await this.#dbLocal.get("info");
  }

  async setInfo(info) {
    await this.#dbLocal.put(info);
  }
}
