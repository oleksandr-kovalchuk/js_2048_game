'use strict';

class Game {
  constructor(initialState = Game.defaultState()) {
    this.score = 0;
    this.status = 'idle';
    this.initialState = this.cloneState(initialState);
    this.state = this.cloneState(initialState);
    this.size = initialState.length;
  }

  static defaultState() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.state;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status === 'idle') {
      this.status = 'playing';
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  restart() {
    this.state = this.cloneState(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  addRandomTile() {
    const emptyTiles = this.getEmptyTiles();

    if (emptyTiles.length > 0) {
      const [row, col] =
        emptyTiles[Math.floor(Math.random() * emptyTiles.length)];

      this.state[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  move(direction) {
    if (this.status !== 'playing') {
      return;
    }

    if (this.performMove(direction)) {
      this.addRandomTile();
      this.checkGameState();
    }
  }

  moveRight() {
    this.move('right');
  }
  moveLeft() {
    this.move('left');
  }
  moveUp() {
    this.move('up');
  }
  moveDown() {
    this.move('down');
  }

  hasEmptyCells() {
    return this.getEmptyTiles().length > 0;
  }

  canCombine() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const current = this.state[row][col];

        if (col < this.size - 1 && current === this.state[row][col + 1]) {
          return true;
        }

        if (row < this.size - 1 && current === this.state[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }

  checkGameState() {
    for (const row of this.state) {
      if (row.includes(2048)) {
        this.status = 'win';

        return;
      }
    }

    if (!this.hasEmptyCells() && !this.canCombine()) {
      this.status = 'lose';
    }
  }

  performMove(direction) {
    const previousState = this.cloneState(this.state);

    switch (direction) {
      case 'left':
        this.state = this.state.map((row) => this.padRow(this.combineRow(row)));
        break;

      case 'right':
        this.state = this.state.map((row) => {
          return this.padRow(this.combineRow([...row].reverse())).reverse();
        });
        break;

      case 'up': {
        const transposed = this.transposeState(this.state);
        const moved = transposed.map((row) => {
          return this.padRow(this.combineRow(row));
        });

        this.state = this.transposeState(moved);
        break;
      }

      case 'down': {
        const transposed = this.transposeState(this.state);
        const moved = transposed.map((row) => {
          return this.padRow(this.combineRow([...row].reverse())).reverse();
        });

        this.state = this.transposeState(moved);
        break;
      }

      default:
        return false;
    }

    return !this.areStatesEqual(previousState, this.state);
  }

  combineRow(row) {
    const filtered = row.filter((num) => num !== 0);

    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        this.score += filtered[i];
        filtered[i + 1] = 0;
        i++;
      }
    }

    return filtered.filter((num) => num !== 0);
  }

  padRow(row) {
    return [...row, ...Array(this.size - row.length).fill(0)];
  }

  cloneState(state) {
    return state.map((row) => [...row]);
  }

  areStatesEqual(state1, state2) {
    return state1.every((row, rIndex) => {
      return row.every((cell, cIndex) => cell === state2[rIndex][cIndex]);
    });
  }

  transposeState(state) {
    return state[0].map((_, colIndex) => state.map((row) => row[colIndex]));
  }

  getEmptyTiles() {
    const empty = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.state[row][col] === 0) {
          empty.push([row, col]);
        }
      }
    }

    return empty;
  }
}

module.exports = Game;
