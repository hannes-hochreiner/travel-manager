export class Transport {
  static meta = {
    properties: {
      title: { name: "Title", type: "string"},
      description: { name: "Description", type: "markdown"},
      startPosition: { name: "Origin", type: "position"},
      endPosition: { name: "Destination", type: "position"},
      startDateTime: { name: "Start", type: "datetime"},
      endDateTime: { name: "End", type: "datetime"},
      attachments: { name: "Attachments", type: "attachments"},
      subtype: { name: "Type", type: "select", options: {
        "train": { name: "Train", icon: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M160-340v-380q0-53 27.5-84.5t72.5-48q45-16.5 102.5-22T480-880q66 0 124.5 5.5t102 22q43.5 16.5 68.5 48t25 84.5v380q0 59-40.5 99.5T660-200l60 60v20h-80l-80-80H400l-80 80h-80v-20l60-60q-59 0-99.5-40.5T160-340Zm320-460q-106 0-155 12.5T258-760h448q-15-17-64.5-28.5T480-800ZM240-560h200v-120H240v120Zm420 80H240h480-60Zm-140-80h200v-120H520v120ZM340-320q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm280 0q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm-320 40h360q26 0 43-17t17-43v-140H240v140q0 26 17 43t43 17Zm180-480h226-448 222Z"/></svg>` },
        "plane": { name: "Plane", icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m397-115-99-184-184-99 71-70 145 25 102-102-317-135 84-86 385 68 124-124q23-23 57-23t57 23q23 23 23 56.5T822-709L697-584l68 384-85 85-136-317-102 102 26 144-71 71Z"/></svg>' },
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
      endDateTime: dateTime,
      _attachments: {},
    }
  }
}