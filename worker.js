import { default as PouchDb } from "https://cdn.jsdelivr.net/npm/pouchdb/+esm";

let cancelToken = null;
let db = new PouchDb("travel");
let dbLocal = new PouchDb("travel_local");

onmessage = async (e) => {
  if (e.data.type === "init") {
    cancelToken = setInterval(async () => {
      try {
        let config = await dbLocal.get("config");

        if (config.offline) {
          return;
        }

        await db.sync(new PouchDb(`${self.location.origin}/api`));

        let info = await dbLocal.get("info");
        info.lastSync = new Date();
        await dbLocal.put(info);

        if (config.notifyOnAutoSync) {
          self.postMessage({title: "Sync", message: "Synchronization successful", type: "info"});
        }
      } catch (err) {
        console.log(err);
      }
    }, 1000 * 60 * 5);
  } else if (e.data.type === "stop") {
    if (cancelToken) {
      clearInterval(cancelToken);
      cancelToken = null;
    }  
  }
};

