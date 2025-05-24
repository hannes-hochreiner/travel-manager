export class Transport {
  static meta = {
    properties: {
      title: { name: "Title", type: "string"},
      description: { name: "Description", type: "markdown"},
      startPosition: { name: "Origin", type: "position"},
      endPosition: { name: "Destination", type: "position"},
      startDateTime: { name: "Start", type: "datetime"},
      endDateTime: { name: "End", type: "datetime"},
      subtype: { name: "Type", type: "select", options: {
        "train": { name: "Train" },
        "plane": { name: "Plane" },
      }},
    },
  }

  static default(parent) {
    let date = new Date();
    let dateTime = date.toISOString().substring(0, 16);

    return {
      _id: crypto.randomUUID(),
      type: "transport",
      subtype: "train",
      title: "",
      description: "",
      parent: parent,
      startPosition: [0,0],
      endPosition: [0,0],
      startDateTime: dateTime,
      endDateTime: dateTime
    }
  }
}