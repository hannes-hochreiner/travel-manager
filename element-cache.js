export class ElementCache {
  #cache = new Map();
  #root = null;

  constructor(root) {
    console.log("ElementCache created.", root);
    this.#root = root;
  }

  get(name) {
    let element = this.#cache.get(name);

    if (!element) {
      element = this.#root.querySelector(name);
      this.#cache.set(name, element);
    }

    return element;
  }
}
