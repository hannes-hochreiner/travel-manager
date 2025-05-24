export class Stay {
  static meta = {
    properties: {
      title: { name: "Title", type: "string"},
      description: { name: "Description", type: "markdown"},
      position: { name: "Position", type: "position"},
      startDate: { name: "Start", type: "date"},
      endDate: { name: "End", type: "date"},
    },
  }

  static default(parent) {
    const date = new Date();
    const dateStr = date.toISOString().substring(0, 10);

    return {
      _id: crypto.randomUUID(),
      type: "stay",
      title: "",
      description: "",
      startDate: dateStr,
      endDate: dateStr,
      parent: parent,
      position: [0,0]
    }
  }
}