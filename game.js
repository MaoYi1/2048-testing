/**
 * 2048 Game Logic
 * Features: 4x4 board, keyboard + touch, scoring, win/lose overlay,
 *           CSS animations, localStorage best score.
 */

(function () {
  'use strict';

  const GRID_SIZE = 4;
  const BEST_SCORE_KEY = '2048-best-score';

  // ── State ───────────────────────────────────────────────────────────────────
  let board = [];        // 4x4 matrix, 0 = empty
  let score = 0;
  let bestScore = parseInt(localStorage.getItem(BEST_SCORE_KEY) || '0', 10);
  let won = false;       // true once 2048 is reached (guard single win popup)
  let gameOver = false;  // true when no moves remain

  // ── DOM refs ────────────────────────────────────────────────────────────────
  const boardEl       = document.getElementById('board');
  const scoreEl       = document.getElementById('score');
  const bestScoreEl   = document.getElementById('best-score');
  const overlayEl     = document.getElementById('overlay');
  const overlayEmoji  = document.getElementById('overlay-emoji');
  const overlayTitle  = document.getElementById('overlay-title');
  const overlaySub    = document.getElementById('overlay-subtitle');
  const overlayFScore = document.getElementById('overlay-final-score');
  const btnContinue   = document.getElementById('btn-continue');
  const btnRestart    = document.getElementById('btn-restart');
  const newGameBtn    = document.getElementById('new-game-btn');

  // ── Initialisation ──────────────────────────────────────────────────────────
  function init() {
    board = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
    score = 0;
    won = false;
    gameOver = false;
    spawnTile();
    spawnTile();
    bestScoreEl.textContent = bestScore;
    render();
    overlayEl.classList.add('hidden');
  }

  // ── Tile spawning ───────────────────────────────────────────────────────────
  function spawnTile() {
    const empty = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (board[r][c] === 0) empty.push([r, c]);
      }
    }
    if (empty.length === 0) return false;
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    board[r][c] = Math.random() < 0.9 ? 2 : 4;
    return [r, c];
  }

  // ── Rendering ───────────────────────────────────────────────────────────────
  // Tiles are placed in the CSS grid using grid-row / grid-column so positioning
  // is reliable at all viewport sizes without pixel arithmetic.

  function render(newCell, mergedCells) {
    // Remove old tiles and cells
    boardEl.querySelectorAll('.tile').forEach(el => el.remove());
    boardEl.querySelectorAll('.cell').forEach(el => el.remove());

    // Background cells (4×4 grid)
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      boardEl.appendChild(cell);
    }

    // Tile elements placed in grid
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const val = board[r][c];
        if (val === 0) continue;

        const tile = document.createElement('div');
        tile.className = `tile ${tileClass(val)}`;
        tile.textContent = val;
        // Place in CSS grid (1-indexed)
        tile.style.gridRow    = r + 1;
        tile.style.gridColumn = c + 1;

        // Animation classes
        const key = r + '-' + c;
        if (newCell && newCell[0] === r && newCell[1] === c) {
          tile.classList.add('tile-new');
        } else if (mergedCells && mergedCells.has(key)) {
          tile.classList.add('tile-merged');
        }

        boardEl.appendChild(tile);
      }
    }

    // Scores
    scoreEl.textContent = score;
    bestScoreEl.textContent = bestScore;
  }

  function tileClass(val) {
    if (val <= 2048) return `tile-${val}`;
    return 'tile-super';
  }

  // ── Move logic ───────────────────────────────────────────────────────────────
  // Each move is performed on a 1D array (one row or column), then mapped back.

  /**
   * Slide and merge a single line (left direction).
   * Returns { line, gained, mergedIdxs } where mergedIdxs are indices in
   * the *result* line that were produced by a merge.
   */
  function slideLine(line) {
    const nonZero = line.filter(v => v !== 0);
    const result = [];
    const mergedIdxs = new Set();
    let gained = 0;

    let i = 0;
    while (i < nonZero.length) {
      if (i + 1 < nonZero.length && nonZero[i] === nonZero[i + 1]) {
        const merged = nonZero[i] * 2;
        result.push(merged);
        mergedIdxs.add(result.length - 1);
        gained += merged;
        i += 2;
      } else {
        result.push(nonZero[i]);
        i++;
      }
    }
    // Pad with zeros
    while (result.length < GRID_SIZE) result.push(0);
    return { line: result, gained, mergedIdxs };
  }

  /**
   * Apply a move in a given direction. Returns { moved, mergedCells }.
   * mergedCells: Set of "r-c" keys for newly merged tile positions.
   */
  function applyMove(dir) {
    let moved = false;
    let totalGained = 0;
    const mergedCells = new Set();

    const processLine = (getLine, setCell) => {
      const orig = getLine();
      const { line, gained, mergedIdxs } = slideLine(orig.slice());

      // Check if changed
      let changed = false;
      for (let i = 0; i < GRID_SIZE; i++) {
        if (orig[i] !== line[i]) { changed = true; break; }
      }
      if (changed) {
        moved = true;
        totalGained += gained;
        setCell(line, mergedIdxs);
      }
    };

    if (dir === 'left') {
      for (let r = 0; r < GRID_SIZE; r++) {
        const getLine = () => board[r].slice();
        processLine(getLine, (line, midxs) => {
          for (let c = 0; c < GRID_SIZE; c++) {
            board[r][c] = line[c];
            if (midxs.has(c)) mergedCells.add(r + '-' + c);
          }
        });
      }
    } else if (dir === 'right') {
      for (let r = 0; r < GRID_SIZE; r++) {
        const getLine = () => board[r].slice().reverse();
        processLine(getLine, (line, midxs) => {
          const rev = line.slice().reverse();
          for (let c = 0; c < GRID_SIZE; c++) {
            board[r][c] = rev[c];
            if (midxs.has(GRID_SIZE - 1 - c)) mergedCells.add(r + '-' + c);
          }
        });
      }
    } else if (dir === 'up') {
      for (let c = 0; c < GRID_SIZE; c++) {
        const getLine = () => board.map(row => row[c]);
        processLine(getLine, (line, midxs) => {
          for (let r = 0; r < GRID_SIZE; r++) {
            board[r][c] = line[r];
            if (midxs.has(r)) mergedCells.add(r + '-' + c);
          }
        });
      }
    } else if (dir === 'down') {
      for (let c = 0; c < GRID_SIZE; c++) {
        const getLine = () => board.map(row => row[c]).reverse();
        processLine(getLine, (line, midxs) => {
          const rev = line.slice().reverse();
          for (let r = 0; r < GRID_SIZE; r++) {
            board[r][c] = rev[r];
            if (midxs.has(GRID_SIZE - 1 - r)) mergedCells.add(r + '-' + c);
          }
        });
      }
    }

    if (moved) {
      score += totalGained;
      if (score > bestScore) {
        bestScore = score;
        localStorage.setItem(BEST_SCORE_KEY, bestScore);
      }
    }

    return { moved, mergedCells };
  }

  // ── Win / Lose checks ────────────────────────────────────────────────────────
  function check2048() {
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (board[r][c] === 2048) return true;
      }
    }
    return false;
  }

  function canMove() {
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (board[r][c] === 0) return true;
        if (c + 1 < GRID_SIZE && board[r][c] === board[r][c + 1]) return true;
        if (r + 1 < GRID_SIZE && board[r][c] === board[r + 1][c]) return true;
      }
    }
    return false;
  }

  // ── Overlay helpers ──────────────────────────────────────────────────────────
  function showWin() {
    overlayEmoji.textContent = '🎉';
    overlayTitle.textContent = '你赢了！';
    overlaySub.textContent = '你合成了 2048！';
    overlayFScore.textContent = '';
    btnContinue.style.display = 'inline-block';
    overlayEl.classList.remove('hidden');
  }

  function showGameOver() {
    overlayEmoji.textContent = '😔';
    overlayTitle.textContent = '游戏结束';
    overlaySub.textContent = '没有可移动的空间了！';
    overlayFScore.textContent = `最终得分：${score}`;
    btnContinue.style.display = 'none';
    overlayEl.classList.remove('hidden');
  }

  // ── Move handler ─────────────────────────────────────────────────────────────
  function move(dir) {
    if (gameOver) return;

    const { moved, mergedCells } = applyMove(dir);
    if (!moved) return;

    const newCell = spawnTile();
    render(newCell || null, mergedCells);

    // Win check (only show once)
    if (!won && check2048()) {
      won = true;
      setTimeout(showWin, 300);
      return;
    }

    // Lose check
    if (!canMove()) {
      gameOver = true;
      setTimeout(showGameOver, 300);
    }
  }

  // ── Keyboard input ───────────────────────────────────────────────────────────
  const KEY_MAP = {
    ArrowLeft:  'left',
    ArrowRight: 'right',
    ArrowUp:    'up',
    ArrowDown:  'down',
  };

  document.addEventListener('keydown', e => {
    const dir = KEY_MAP[e.key];
    if (!dir) return;
    e.preventDefault();
    move(dir);
  });

  // ── Touch / Swipe input ──────────────────────────────────────────────────────
  let touchStartX = 0;
  let touchStartY = 0;

  boardEl.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  boardEl.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    if (Math.max(absDx, absDy) < 20) return; // too small
    if (absDx > absDy) {
      move(dx > 0 ? 'right' : 'left');
    } else {
      move(dy > 0 ? 'down' : 'up');
    }
  }, { passive: true });

  // ── Button handlers ──────────────────────────────────────────────────────────
  newGameBtn.addEventListener('click', init);

  btnRestart.addEventListener('click', () => {
    init();
  });

  btnContinue.addEventListener('click', () => {
    overlayEl.classList.add('hidden');
  });

  // ── Start game ───────────────────────────────────────────────────────────────
  init();
})();
