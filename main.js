/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/Game/GameField.js
class GameField {
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
      li.addEventListener("click", event => this.onCellClick(event));
      this.arrCell.push(li);
      this.field.append(li);
    }
  }
  renderingStatistics() {
    const divStatistics = document.createElement("div");
    divStatistics.classList.add("statistics");
    divStatistics.insertAdjacentHTML("afterbegin", `<div class="stat-player">
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
      </div>`);
    const title = document.querySelector(".game").querySelector("h2");
    title.after(divStatistics);
    this.statisticsEl = divStatistics;
  }
  renderingShutter() {
    const divOver = document.createElement("div");
    divOver.classList.add("game-over");
    divOver.insertAdjacentHTML("afterbegin", `<div class="shutter">
        <h5>Ирга закончена</h5>
        <p class="result-game"></p>
        <button class="new-game">Новая игра</button>
      </div>`);
    this.statisticsEl.after(divOver);
    this.shutterEl = divOver.querySelector(".shutter");
    const btnNewGame = this.shutterEl.querySelector("button");
    btnNewGame.addEventListener("click", event => this.onNewGameClick(event));
  }
  updateStatistics(player, goblin, count) {
    const playerEl = this.statisticsEl.querySelector(".stat-player").querySelector("p");
    playerEl.textContent = player;
    const goblinEl = this.statisticsEl.querySelector(".stat-goblin").querySelector("p");
    goblinEl.textContent = goblin;
    const countEl = this.statisticsEl.querySelector(".stat-count").querySelector("p");
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
    return this.arrCell.findIndex(item => item.classList.contains("goblin"));
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
    this.newGameListeners.forEach(o => o.call(null));
  }
  onCellClick(event) {
    const index = this.arrCell.indexOf(event.currentTarget);
    this.cellClickListeners.forEach(o => o.call(null, index));
  }
}
;// CONCATENATED MODULE: ./src/js/Game/Statistic.js
class Statistic {
  constructor() {
    this.scoresPlayer = 0;
    this.scoresGoblin = 0;
    this.countGames = 1;
  }
}
;// CONCATENATED MODULE: ./src/js/Game/Controller.js


class Controller {
  constructor() {
    this.gameField = new GameField();
    this.intervalId = null;
    this.statistic = new Statistic();
    this.startScoresPlayer = null;
  }
  init() {
    this.gameField.renderingField();
    this.gameField.renderingStatistics();
    this.gameField.renderingShutter();
    this.startEmergenceGoblin();
    this.eventSubscription();
  }
  startEmergenceGoblin() {
    this.startScoresPlayer = this.statistic.scoresPlayer;
    this.gameField.addGoblin();
    this.statistic.scoresGoblin += 1;
    this.gameField.updateStatistics(this.statistic.scoresPlayer, this.statistic.scoresGoblin, this.statistic.countGames);
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.intervalId = setInterval(() => {
      this.gameField.removeGoblin();
      this.gameField.addGoblin();
      this.statistic.scoresGoblin += 1;
      this.gameField.updateStatistics(this.statistic.scoresPlayer, this.statistic.scoresGoblin, this.statistic.countGames);
      if (this.statistic.scoresGoblin === 5) {
        this.stopEmergenceGoblin();
        this.gameField.showGameOver(false);
      }
    }, 1000);
  }
  stopEmergenceGoblin() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.gameField.removeGoblin();
  }
  eventSubscription() {
    this.gameField.addCellClickListener(this.onCellClick.bind(this));
    this.gameField.addNewGameListener(this.onNewGameClick.bind(this));
  }
  onCellClick(index) {
    const idxGoblin = this.gameField.searchGoblin();
    if (index === idxGoblin) {
      this.statistic.scoresGoblin = 0;
      this.statistic.scoresPlayer += 1;
      this.gameField.updateStatistics(this.statistic.scoresPlayer, this.statistic.scoresGoblin, this.statistic.countGames);
      if (this.statistic.scoresPlayer === this.startScoresPlayer + 5) {
        this.stopEmergenceGoblin();
        this.gameField.showGameOver(true);
      }
    }
  }
  onNewGameClick() {
    this.statistic.scoresGoblin = 0;
    this.statistic.countGames += 1;
    this.gameField.hideGameOver();
    this.gameField.updateStatistics(this.statistic.scoresPlayer, this.statistic.scoresGoblin, this.statistic.countGames);
    this.startEmergenceGoblin();
  }
}
;// CONCATENATED MODULE: ./src/js/app.js
// TODO: write code here

const cntr = new Controller();
cntr.init();
;// CONCATENATED MODULE: ./src/index.js



// TODO: write your code in app.js
/******/ })()
;