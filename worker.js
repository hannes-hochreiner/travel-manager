import { default as PouchDb } from "https://cdn.jsdelivr.net/npm/pouchdb/+esm";

let cancelToken = null;
let db = new PouchDb("travel");

onmessage = async (e) => {
  if (e.data.type === "init") {
    cancelToken = setInterval(async () => {
      console.log(await db.sync(new PouchDb(`${self.location.origin}/api`)));
    }, 1000 * 60 * 5);
  } else if (e.data.type === "stop") {
    if (cancelToken) {
      clearInterval(cancelToken);
      cancelToken = null;
    }  
  }
};

