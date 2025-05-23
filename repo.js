import { default as PouchDb } from "https://cdn.jsdelivr.net/npm/pouchdb/+esm";
import { default as PouchDbFind } from "https://cdn.jsdelivr.net/npm/pouchdb-find/+esm";

export class Repo {
  static #instance = null;
  #db = null;
  #dbLocal = null;

  constructor() {
    return new Promise((resolve, reject) => {
      if (!Repo.#instance) {
        Repo.#instance = this;

        PouchDb.plugin(PouchDbFind);
        this.#db = new PouchDb("travel");
        this.#dbLocal = new PouchDb("travel_local");
  
        try {
          this.#db.createIndex({
            index: {
              fields: ["type", "parent"],
              // name: "id_parent",
            },
          }).then(resolve(Repo.#instance));
        } catch (error) {
          reject(error);
        }  
      } else {
        resolve(Repo.#instance);
      }
    });
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
    const limit = 50;
    let lastCount = limit;
    const results = [];

    while (lastCount === limit) {
      let batch = (await this.#db.find({
        selector: { type: type, parent: parent },
        limit: limit,
        skip: results.length,
      })).docs;
      lastCount = batch.length;

      results.push(...batch);
    }

    return results;
  }

  async addAttachment(documentId, attachment, rev) {
    await this.#db.putAttachment(documentId, attachment.name, rev, attachment, attachment.type);
  }

  async getAttachment(documentId, attachmentId) {
    return await this.#db.getAttachment(documentId, attachmentId);
  }

  async deleteAttachment(documentId, attachmentId, rev) {
    await this.#db.removeAttachment(documentId, attachmentId, rev);
  }

  async sync() {
    let origin = "";

    if (typeof(window) === "undefined") {
      origin = self.location.origin;
    } else {
      origin = window.location.origin;
    }

    console.log(await this.#db.sync(new PouchDb(`${origin}/api`)));
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
