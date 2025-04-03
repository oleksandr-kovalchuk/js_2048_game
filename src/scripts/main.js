'use strict';

const Game = require('../modules/Game.class');
const game = new Game();
const GRID_SIZE = 4;

const cells = Array.from(document.querySelectorAll('.field-cell'));
const buttonStart = document.querySelector('.button.start');
const scoreElement = document.querySelector('.game-score');
const messageWinElement = document.querySelector('.message-win');
const messageLoseElement = document.querySelector('.message-lose');
const messageStartElement = document.querySelector('.message-start');

const keyActions = {
  ArrowLeft: () => game.moveLeft(),
  ArrowRight: () => game.moveRight(),
  ArrowUp: () => game.moveUp(),
  ArrowDown: () => game.moveDown(),
};

const handleKeyDown = (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const action = keyActions[e.key];

  if (action) {
    action();
    updateView();
  }
};

const updateCellsView = () => {
  const state = game.getState();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    const cellValue = state[row][col];

    cell.className = 'field-cell';
    cell.textContent = cellValue || '';

    if (cellValue) {
      cell.classList.add(`field-cell--${cellValue}`);
    }
  });
};

const updateScoreView = () => {
  scoreElement.textContent = game.getScore();
};

const updateGameStatusView = () => {
  // eslint-disable-next-line no-shadow
  const status = game.getStatus();

  if (status === 'win') {
    messageWinElement.classList.remove('hidden');
  } else if (status === 'lose') {
    messageLoseElement.classList.remove('hidden');
  }
};

const updateView = () => {
  updateCellsView();
  updateScoreView();
  updateGameStatusView();
};

const resetMessages = () => {
  [messageWinElement, messageLoseElement, messageStartElement].forEach(
    (msg) => {
      msg.classList.add('hidden');
    },
  );
};

const startNewGame = () => {
  if (buttonStart.classList.contains('restart')) {
    game.restart();
  }
  game.start();
  resetMessages();
  updateView();
  buttonStart.textContent = 'Restart';
  buttonStart.className = 'button restart';
};

document.addEventListener('keydown', handleKeyDown);
buttonStart.addEventListener('click', startNewGame);
