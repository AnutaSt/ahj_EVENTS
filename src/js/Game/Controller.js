import GameField from "./GameField";
import Statistic from "./Statistic";

export default class Controller {
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
    this.gameField.updateStatistics(
      this.statistic.scoresPlayer,
      this.statistic.scoresGoblin,
      this.statistic.countGames
    );
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.intervalId = setInterval(() => {
      this.gameField.removeGoblin();
      this.gameField.addGoblin();
      this.statistic.scoresGoblin += 1;
      this.gameField.updateStatistics(
        this.statistic.scoresPlayer,
        this.statistic.scoresGoblin,
        this.statistic.countGames
      );
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
      this.gameField.updateStatistics(
        this.statistic.scoresPlayer,
        this.statistic.scoresGoblin,
        this.statistic.countGames
      );
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
    this.gameField.updateStatistics(
      this.statistic.scoresPlayer,
      this.statistic.scoresGoblin,
      this.statistic.countGames
    );
    this.startEmergenceGoblin();
  }
}
