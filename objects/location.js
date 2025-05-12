export class Location {
  static meta = {
    properties: {
      title: { name: "Title", type: "string"},
      description: { name: "Description", type: "markdown"},
      position: { name: "Position", type: "position"},
      subtype: { name: "Type", type: "select", options: {
        "accommodation": { name: "Accommodation" },
        "sight": { name: "Sight" },
        "museum": { name: "Museum" },
        "nature": { name: "Nature" },
        "temple": { name: "Temple" },
      }},
    },
  }
}