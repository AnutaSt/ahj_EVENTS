export default class GameField {
  constructor() {
    this.field = document.querySelector(".game-field");
    this.size = 4;
    this.arrCell = [];
    this.statisticsEl = null;
    this.shutterEl = null;
    this.cellClickListeners = [];
    this.newGameListeners = [];
  }

  createCell() {
    const cell = document.createElement("li");
    cell.classList.add("game-field_cell");
    return cell;
  }

  renderingField() {
    for (let i = 0; i < Math.pow(this.size, 2); i++) {
      const li = this.createCell();
      li.addEventListener("click", (event) => this.onCellClick(event));
      this.arrCell.push(li);
      this.field.append(li);
    }
  }

  renderingStatistics() {
    const divStatistics = document.createElement("div");
    divStatistics.classList.add("statistics");
    divStatistics.insertAdjacentHTML(
      "afterbegin",
      `<div class="stat-player">
        <h6>Баллы Игрока</h6>
        <p>0</p>
      </div>
      <div class="stat-goblin">
        <h6>Показан Гоблин</h6>
        <p>0</p>
      </div>
      <div class="stat-count">
        <h6>Количество игр</h6>
        <p>0</p>
      </div>`
    );
    const title = document.querySelector(".game").querySelector("h2");
    title.after(divStatistics);
    this.statisticsEl = divStatistics;
  }

  renderingShutter() {
    const divOver = document.createElement("div");
    divOver.classList.add("game-over");
    divOver.insertAdjacentHTML(
      "afterbegin",
      `<div class="shutter">
        <h5>Ирга закончена</h5>
        <p class="result-game"></p>
        <button class="new-game">Новая игра</button>
      </div>`
    );
    this.statisticsEl.after(divOver);
    this.shutterEl = divOver.querySelector(".shutter");

    const btnNewGame = this.shutterEl.querySelector("button");
    btnNewGame.addEventListener("click", (event) => this.onNewGameClick(event));
  }

  updateStatistics(player, goblin, count) {
    const playerEl = this.statisticsEl
      .querySelector(".stat-player")
      .querySelector("p");
    playerEl.textContent = player;
    const goblinEl = this.statisticsEl
      .querySelector(".stat-goblin")
      .querySelector("p");
    goblinEl.textContent = goblin;
    const countEl = this.statisticsEl
      .querySelector(".stat-count")
      .querySelector("p");
    countEl.textContent = count;
  }

  showGameOver(isVictoryPlayer) {
    this.shutterEl.classList.add("active");
    const msg = this.shutterEl.querySelector(".result-game");
    if (isVictoryPlayer) {
      msg.textContent = "Вы победили";
      msg.classList.add("victory");
    } else {
      msg.textContent = "Вы проиграли";
      msg.classList.add("defeat");
    }
  }

  hideGameOver() {
    this.shutterEl.classList.remove("active");
    const msg = this.shutterEl.querySelector(".result-game");
    msg.textContent = "";
    msg.className = "result-game";
  }

  generateIndex() {
    const idxGoblin = this.searchGoblin();
    let index = -1;
    const max = Math.pow(this.size, 2);
    do {
      index = Math.floor(Math.random() * max);
    } while (index === idxGoblin);
    return index;
  }

  searchGoblin() {
    return this.arrCell.findIndex((item) => item.classList.contains("goblin"));
  }
  removeGoblin() {
    const idx = this.searchGoblin();
    if (idx >= 0) {
      this.arrCell[idx].classList.remove("goblin");
    }
  }

  addGoblin() {
    const idx = this.searchGoblin();
    if (idx < 0) {
      const index = this.generateIndex();
      this.arrCell[index].classList.add("goblin");
    }
  }

  addCellClickListener(callback) {
    this.cellClickListeners.push(callback);
  }

  addNewGameListener(callback) {
    this.newGameListeners.push(callback);
  }

  onNewGameClick(event) {
    event.preventDefault();
    this.newGameListeners.forEach((o) => o.call(null));
  }

  onCellClick(event) {
    const index = this.arrCell.indexOf(event.currentTarget);
    this.cellClickListeners.forEach((o) => o.call(null, index));
  }
}
