// import { default as PouchDb } from "https://cdn.jsdelivr.net/npm/pouchdb/+esm";
import { Repo } from "./repo.js";

let cancelToken = null;
const bc = new BroadcastChannel("notification");
// let db = new PouchDb("travel");
// let dbLocal = new PouchDb("travel_local");

onmessage = async (e) => {
  if (e.data.type === "init") {
    let repo = await Repo.create();

    cancelToken = setInterval(async () => {
      try {
        let config = await repo.getConfig();

        if (config.offline) {
          return;
        }

        await repo.sync();

        let info = await repo.getInfo();
        info.lastSync = new Date();
        await repo.setInfo(info);

        if (config.notifyOnAutoSync) {
          bc.postMessage({title: "Sync", message: "Synchronization successful", type: "info"});
        }
      } catch (err) {
        console.log(err);
      }
    }, 1000 * 60 * 1);
  } else if (e.data.type === "stop") {
    if (cancelToken) {
      clearInterval(cancelToken);
      cancelToken = null;
    }  
  }
};

