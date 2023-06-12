import goblin from "../../img/goblin.png";
export default class Goblin {
  constructor() {
    this.element = document.createElement("img");
    this.element.classList.add("goblin");
    this.element.src = goblin;
  }
}
