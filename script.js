const $ = (id) => document.getElementById(id);

function show(sectionId) {
  $(sectionId).classList.remove("hidden");
  setTimeout(() => $(sectionId).scrollIntoView({ behavior: "smooth", block: "center" }), 50);
}

function hearts(count = 18) {
  for (let i = 0; i < count; i++) {
    const h = document.createElement("div");
    h.className = "heart";
    h.textContent = ["❤️","💗","✨","🌸"][Math.floor(Math.random()*4)];
    h.style.left = (20 + Math.random()*60) + "vw";
    h.style.top = (45 + Math.random()*20) + "vh";
    h.style.animationDelay = (Math.random()*.35) + "s";
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 2200);
  }
}

$("openBtn").addEventListener("click", () => {
  show("gift");
  hearts(22);
});

$("photoBtn").addEventListener("click", () => {
  show("photoSection");
});

$("puzzleBtn").addEventListener("click", () => {
  show("puzzleSection");
  initPuzzle();
});

$("brotherPhoto").addEventListener("error", () => {
  $("brotherPhoto").style.display = "none";
  $("photoFallback").style.display = "flex";
});

let puzzleReady = false;
let tiles = [];
let selected = null;
let swaps = 0;
const solved = [0,1,2,3,4,5,6,7,8];

function initPuzzle() {
  if (puzzleReady) return;
  puzzleReady = true;
  createPuzzle();
}

function createPuzzle() {
  const puzzle = $("puzzle");
  tiles = [...solved];

  // Guaranteed to be shuffled enough to solve, while still keeping it fair.
  for (let i = 0; i < 35; i++) {
    const a = Math.floor(Math.random()*9);
    let b = Math.floor(Math.random()*9);
    while (b === a) b = Math.floor(Math.random()*9);
    [tiles[a], tiles[b]] = [tiles[b], tiles[a]];
  }

  if (tiles.every((v,i) => v === i)) {
    [tiles[0], tiles[1]] = [tiles[1], tiles[0]];
  }

  swaps = 0;
  $("swapCount").textContent = swaps;
  $("puzzleStatus").textContent = "Tap two tiles to swap them. 😜";
  $("continueBtn").classList.add("hidden");
  renderPuzzle();
}

function renderPuzzle() {
  const puzzle = $("puzzle");
  puzzle.innerHTML = "";

  tiles.forEach((tileValue, position) => {
    const button = document.createElement("button");
    button.className = "tile";
    button.type = "button";
    button.setAttribute("aria-label", `Puzzle tile ${position + 1}`);
    const row = Math.floor(tileValue / 3);
    const col = tileValue % 3;
    button.style.backgroundPosition = `${col * 50}% ${row * 50}%`;

    if (selected === position) button.classList.add("selected");

    button.addEventListener("click", () => selectTile(position));
    puzzle.appendChild(button);
  });
}

function selectTile(position) {
  if (selected === null) {
    selected = position;
    renderPuzzle();
    return;
  }

  if (selected === position) {
    selected = null;
    renderPuzzle();
    return;
  }

  [tiles[selected], tiles[position]] = [tiles[position], tiles[selected]];
  selected = null;
  swaps++;
  $("swapCount").textContent = swaps;
  renderPuzzle();

  if (tiles.every((v,i) => v === i)) {
    $("puzzleStatus").textContent = `Solved in ${swaps} swaps! Okay, you're actually smart. 😂`;
    $("continueBtn").classList.remove("hidden");
    hearts(18);
  } else {
    $("puzzleStatus").textContent = swaps > 12
      ? "Bhai... picture ko thoda aur dekho. 😂"
      : "Getting there! 🪢";
  }
}

$("continueBtn").addEventListener("click", () => {
  show("finalSection");
  hearts(28);
});
