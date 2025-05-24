export class Trip {
  static meta = {
    properties: {
      title: { name: "Title", type: "string"},
      description: { name: "Description", type: "markdown"},
    },
  }

  static default() {
    return {
      _id: crypto.randomUUID(),
      title: "",
      description: "",
    }
  }
}
