export function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export function registerCustomElements(customElementsArray) {
  customElementsArray.forEach((element) => {
    if (!customElements.get(element[0])) {
      customElements.define(element[0], element[1]);
    }
  })
}

export function updateElementsFromObject(object, objectType, root) {
  Object.keys(objectType.meta.properties).forEach((key) => {
    const propertyType = objectType.meta.properties[key].type;
    const element = root.querySelector("#" + key);
    const property = propertyType == "attachments" ? object._attachments : object[key];
 
    if (element && property) {
      if (propertyType === "markdown") {
        element.markdown = object[key];
      } else if (propertyType === "attachments") {
        element.attachments = property;
      } else if (propertyType === "datetime") {
        element.innerText = object[key].substring(0, 16).replace("T", " ");
      } else {
        element.innerText = object[key];
      }
    }
  });
};
