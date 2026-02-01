// Gluttonous Word Snake game (browser)
// This javascript game is used to demonstrate AI concepts to beginners. Basically GenAI is like a word snake
// game, which predict the next token based on prediction scores on the context. This game can be run
// in two modes:
// 1. demo mode, which will stop after eating 10 words. While the demo is running, probability and socres
//    are shown on the screen, which looks similar to how AI predicts the next word.
// 2. player mode, player can construct the story by connecting the words with snake.
// When game is over, GenAI concents like probablility of chosing next token and how AI works will be
// displayed for education purposes.
//
// Include this script via <script src="word_snake.js"></script>

// ----- Word Data (embedded) -----
const WORD_DATA = {
  nouns: [
    "apple", "astronaut", "adventure", "bicycle", "butterfly", "castle", "dragon", "unicorn", "pirate", "robot",
    "candy", "icecream", "rainbow", "superhero", "dinosaur", "fairy", "wizard", "goblin", "monster", "pizza",
    "cake", "bubble", "sparkle", "rocket", "spaceship", "teddy", "balloon", "jellybean", "marshmallow", "sundae",
    "eagle", "elephant", "engine",
    "hammer", "house", "hippo",
    "kite", "kangaroo", "key",
    "lion", "lamp", "leaf",
    "nest", "needle", "newt",
    "oak", "orange", "otter",
    "quartz", "queen", "quail",
    "vase", "violin", "vulture",
    "xylophone", "xenon", "xray",
    "yak", "yacht", "yogurt",
    "zebra", "zoo", "zeppelin",
    "dolphin", "fox", "frog", "giraffe", "goat", "iguana", "island", "jaguar", "journal", "mountain", "panda", "rabbit", "tiger", "turtle", "umbrella", "urchin", "whale", "wolf", "coconut", "cupcake", "flamingo", "firetruck", "monkey", "sunflower", "squirrel",
    "banana", "bubbles", "candycorn", "doughnut", "eclair", "fuzzybear", "gigglegoblin", "hippopotamus", "icecreamcone", "jellyfish", "koala", "lemonade", "nachos", "octopus", "pancake", "quokka", "spaghetti", "taco", "velociraptor", "watermelon", "yoyo", "zucchini"
  ],
  verbs: [
    "amuse", "arrange", "admire",
    "bounce", "build", "bark", "climb", "crawl", "create",
    "dance", "discover", "dream", "explore", "giggle", "glide", "gallop", "imagine", "invest", "inspect",
    "juggle", "jump", "jog", "laugh", "listen", "march", "move", "melt", "nibble", "paint", "play", "push", "sing", "skip",
    "zoom", "fly", "flick", "float", "sprint", "spin", "twirl",
    "elevate", "examine", "exclaim",
    "hurry", "hum", "hunt",
    "kick", "knead", "know",
    "lean", "lurk",
    "navigate", "nudge", "nurse",
    "observe", "obtain", "offer",
    "question", "quench", "quiet",
    "venture", "vibrate", "visualize",
    "run", "roll", "reach",
    "tap", "tumble", "talk",
    "use", "unite", "upgrade",
    "whisper", "wander", "wave",
    "xerox", "xray", "xylophonize",
    "yell", "yawn", "yearn",
    "zap", "zigzag", "zest"
  ],
  adjectives: [
    "amazing", "brave", "bright", "calm", "curious", "dazzling", "eager", "fancy", "glittery", "happy",
    "sparkly", "fluffy", "fuzzy", "magical", "mysterious", "playful", "quick", "quiet", "radiant",
    "silly", "smart", "sparkling", "splendid", "strong", "tiny", "vibrant", "windy", "wonderful", "zany",
    "elegant", "energetic", "enigmatic",
    "humble", "hasty", "hearty",
    "keen", "kind", "kooky",
    "lively", "lazy", "luminous",
    "nervous", "nice", "noisy",
    "odd", "optimistic", "obscure",
    "quirky",
    "vivid", "vast", "vigilant",
    "xenial", "xenophobic", "xylophonic",
    "young", "yellow", "youthful",
    "zealous", "zesty", "zippy",
    "awesome", "angelic", "agile",
    "bold",
    "charming",
    "delightful", "determined",
    "graceful", "gloomy",
    "intelligent", "inquisitive", "intense",
    "jolly", "joyful", "judicious",
    "mellow",
    "peaceful", "proud",
    "quaint", "quixotic",
    "robust", "reliable",
    "tough", "tranquil",
    "unique", "upright", "ultra",
    "wise", "witty"
  ],
  connectors: ["and", "then", "because", "so", "meanwhile", "suddenly", "however", "after", "before"],
  phrases: [
    "a surprising twist",
    "a tiny mystery",
    "a friendly helper",
    "the plot thickens",
    "new clues appear",
    "the adventure continues",
    "a magical surprise",
    "the hero triumphs"
  ]
};

// ----- Simple AI (for demonstration) -----
class SimpleAI {
  constructor(repo, temperature = 0.8) {
    this.repo = repo;
    this.temperature = Math.max(0.05, Math.min(temperature, 2.0));
    this.used = new Set();
    this.rareLetters = new Set(["q", "z", "x", "w", "j", "k"]);
  }
  _candidates(start) {
    const want = start.toLowerCase();
    return this.repo.allWords().filter(w => w.toLowerCase().startsWith(want));
  }
  _score(word) {
    const lower = word.toLowerCase();
    const novelty = this.used.has(lower) ? 0.2 : 1.0;
    const adjBonus = this.repo.categories.adjectives.includes(word) ? 0.2 : 0;
    const verbBonus = this.repo.categories.verbs.includes(word) ? 0.15 : 0;
    const rareBonus = this.rareLetters.has(word[word.length - 1].toLowerCase()) ? 0.25 : 0;
    return 0.8 + novelty + adjBonus + verbBonus + rareBonus;
  }
  // Returns an object with AI reasoning for the given last word
  getReasoning(lastWord) {
    const lastLetter = lastWord[lastWord.length - 1];
    const candidates = this._candidates(lastLetter);
    const scored = candidates.map(w => ({ word: w, score: this._score(w) }));
    const top5 = scored.sort((a, b) => b.score - a.score).slice(0, 5);
    return {
      lastLetter,
      candidatesCount: candidates.length,
      topCandidates: top5
    };
  }
}

// ----- Word Repository -----
class WordRepo {
  constructor(data) {
    this.categories = data;
  }
  allWords() {
    return [...this.categories.adjectives, ...this.categories.nouns, ...this.categories.verbs];
  }
  connectors() {
    return this.categories.connectors;
  }
  phrases() {
    return this.categories.phrases;
  }
}

// ----- Gluttonous Snake Game -----
class GluttonousSnakeGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.cellSize = 20; // pixels
    this.cols = 30;
    this.rows = 30;
    this.width = this.cols * this.cellSize;
    this.height = this.rows * this.cellSize;
    this.speed = 200; // ms per move (slower for easier play)
    this.timeLimit = 60; // seconds
    this.score = 0;
    this.timeLeft = this.timeLimit;
    this.intervalId = null;
    this.demoIntervalId = null;
    this.isDemo = false;
    this.gameOver = false;
    this.demoEatenCount = 0;
    this.repo = new WordRepo(WORD_DATA);
    this.ai = new SimpleAI(this.repo);
    this.prevProbs = null;
    this.direction = { x: 1, y: 0 }; // start moving right
    this.pendingDirection = null;
    this.snake = [{ x: Math.floor(this.cols / 2), y: Math.floor(this.rows / 2) }];
    this.candidates = [];
    this.chain = [];
    this.createUI();
    this.bindEvents();
  }

  createUI() {
    // Clear container and set up layout
    this.container.innerHTML = "";
    this.container.style.display = "flex";
    this.container.style.flexDirection = "row";
    // Left panel: score/timer, canvas with candidate panel, AI info, buttons
    const leftPanel = document.createElement("div");
    leftPanel.style.flex = "1";
    // Score & timer panel
    const panel = document.createElement("div");
    panel.style.marginBottom = "10px";
    this.scoreEl = document.createElement("span");
    this.scoreEl.textContent = "Score: 0";
    this.timerEl = document.createElement("span");
    this.timerEl.style.marginLeft = "20px";
    this.timerEl.textContent = "Time: 20s";
    panel.appendChild(this.scoreEl);
    panel.appendChild(this.timerEl);
    leftPanel.appendChild(panel);
    // Canvas and candidate panel side by side
    const gameWrapper = document.createElement("div");
    gameWrapper.className = "game-wrapper";
    gameWrapper.style.display = "flex";
    gameWrapper.style.alignItems = "flex-start";
    // Canvas
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.style.border = "1px solid #333";
    // Responsive size: fill container up to max width, maintain aspect ratio
    this.canvas.style.width = "50%";
    this.canvas.style.maxWidth = `${this.width}px`;
    this.canvas.style.height = "50%";
    // this.canvas.style.height = "auto";
    this.ctx = this.canvas.getContext("2d");
    gameWrapper.appendChild(this.canvas);
    // Adjust canvas size based on container width
    this.adjustCanvasSize();
    // Resize handling for responsive layout
    window.addEventListener('resize', () => {
      this.adjustCanvasSize();
      this.placeCandidates();
      this.draw();
    });
    // Candidate panel (right of canvas)
    this.candidatePanel = document.createElement("div");
    this.candidatePanel.style.marginLeft = "10px";
    this.candidatePanel.style.maxHeight = "200px";
    this.candidatePanel.style.overflowY = "auto";
    this.candidatePanel.style.border = "1px solid #ccc";
    this.candidatePanel.style.padding = "5px";
    this.candidatePanel.style.fontFamily = "monospace";
    gameWrapper.appendChild(this.candidatePanel);
    leftPanel.appendChild(gameWrapper);
    // Explanation area (bottom of game rectangle)
    this.explanationArea = document.createElement("div");
    this.explanationArea.style.marginTop = "10px";
    this.explanationArea.style.fontFamily = "Arial, sans-serif";
    this.explanationArea.style.whiteSpace = "pre-wrap";
    leftPanel.appendChild(this.explanationArea);
    // AI info area (below canvas and candidates)
    this.aiInfo = document.createElement("div");
    this.aiInfo.style.marginTop = "10px";
    this.aiInfo.style.whiteSpace = "pre-wrap";
    this.aiInfo.style.fontFamily = "monospace";
    leftPanel.appendChild(this.aiInfo);
    // Bulletin explaining AI scoring (softmax) – kid‑friendly
    this.scoreBulletin = document.createElement("div");
    this.scoreBulletin.style.marginTop = "10px";
    this.scoreBulletin.style.fontFamily = "Arial, sans-serif";
    this.scoreBulletin.style.whiteSpace = "pre-wrap";
    this.scoreBulletin.textContent = "🔢 How the AI scores words: It gives each word a raw score, then applies a softmax (turns scores into percentages) so the highest‑scoring word is most likely to be chosen. This helps the AI pick the next token like picking the most popular candy in a jar!";
    // leftPanel.appendChild(this.scoreBulletin);
    // Sentence area (current story) - placed below AI info
    this.sentenceArea = document.createElement("div");
    this.sentenceArea.style.marginTop = "10px";
    this.sentenceArea.style.fontFamily = "Arial, sans-serif";
    this.sentenceArea.style.whiteSpace = "pre-wrap";
    leftPanel.appendChild(this.sentenceArea);
    // Start and Demo buttons
    this.startBtn = document.createElement("button");
    this.startBtn.textContent = "Start Game";
    this.startBtn.style.display = "block";
    this.startBtn.style.marginTop = "10px";
    leftPanel.appendChild(this.startBtn);
    this.demoBtn = document.createElement("button");
    this.demoBtn.textContent = "Demo Mode";
    this.demoBtn.style.display = "block";
    this.demoBtn.style.marginTop = "10px";
    leftPanel.appendChild(this.demoBtn);
    this.container.appendChild(leftPanel);
  }

  bindEvents() {
    document.addEventListener("keydown", e => {
      const key = e.key;
      if (key === "ArrowUp" && this.direction.y !== 1) this.pendingDirection = { x: 0, y: -1 };
      else if (key === "ArrowDown" && this.direction.y !== -1) this.pendingDirection = { x: 0, y: 1 };
      else if (key === "ArrowLeft" && this.direction.x !== 1) this.pendingDirection = { x: -1, y: 0 };
      else if (key === "ArrowRight" && this.direction.x !== -1) this.pendingDirection = { x: 1, y: 0 };
    });
    this.startBtn.addEventListener("click", () => this.start());
    this.demoBtn.addEventListener("click", () => this.startDemo());
  }

  // Adjust canvas size based on container width for responsiveness
  adjustCanvasSize() {
    // Determine max size: use 600px for larger screens, 250px for small screens (<600px)
    const containerWidth = this.container.clientWidth;
    const maxCanvasSize = containerWidth < 500 ? 250 : 500;
    const maxSize = Math.min(containerWidth, maxCanvasSize);
    // Compute new cell size to fit the grid within maxSize
    const newCellSize = Math.max(10, Math.floor(maxSize / Math.max(this.cols, this.rows)));
    this.cellSize = newCellSize;
    this.width = this.cols * this.cellSize;
    this.height = this.rows * this.cellSize;
    // Update canvas pixel dimensions
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    // Ensure CSS makes canvas fill container and limit max width
    this.canvas.style.width = "100%";
    this.canvas.style.maxWidth = `${this.width}px`;
    this.canvas.style.height = "auto";
  }

  start() {
    this.reset();
    this.placeCandidates();
    this.startBtn.disabled = true;
    this.intervalId = setInterval(() => this.gameLoop(), this.speed);
    this.timerId = setInterval(() => this.updateTimer(), 1000);
  }

  // Demo mode: automatically moves snake to eat 10 words and shows AI reasoning
  startDemo() {
    this.isDemo = true;
    this.reset();
    this.placeCandidates();
    this.startBtn.disabled = true;
    this.demoBtn.disabled = true;
    this.demoEatenCount = 0;
    this.demoIntervalId = setInterval(() => this.demoLoop(), this.speed);
  }

  demoLoop() {
    if (this.chain.length >= 10) {
      this.endDemo();
      return;
    }
    // Simple auto‑move towards the food
    const head = this.snake[0];
    if (this.candidates.length === 0) {
      this.placeCandidates();
      return;
    }
    // Auto‑move towards highest‑scoring candidate in demo mode
    let target = null;
    for (const cand of this.candidates) {
      if (!target || cand.score > target.score) target = cand;
    }
    if (target) {
      // Move horizontally if it brings us closer and stays within bounds
      if (head.x < target.x && head.x + 1 < this.cols) {
        this.direction = { x: 1, y: 0 };
      } else if (head.x > target.x && head.x - 1 >= 0) {
        this.direction = { x: -1, y: 0 };
      } else if (head.y < target.y && head.y + 1 < this.rows) {
        this.direction = { x: 0, y: 1 };
      } else if (head.y > target.y && head.y - 1 >= 0) {
        this.direction = { x: 0, y: -1 };
      }
    }
    // Run one game step
    this.gameLoop();
  }

  endDemo() {
    clearInterval(this.demoIntervalId);
    this.startBtn.disabled = false;
    this.demoBtn.disabled = false;
    this.aiInfo.textContent += `\nDemo finished after eating 10 words!`;
    const story = this._storyFromChain(this.chain);
    if (this.storyArea) this.storyArea.textContent = story;
    // Concise, kid‑friendly explanation with emojis
    const explanation = "🤖 <b>GenAI Explanation</b>\n" +
      "🔤 <b>Next word prediction</b>: The AI looks at the last letter (the \"context\") and picks a word that fits.\n" +
      "🧠 <b>How LLMs write</b>: They learned from many stories, so they can guess the next word like a game of word‑snake.\n" +
      "⚠️ <b>Limits</b>: The AI doesn’t really understand; it can make silly mistakes and only knows what it has read.\n" +
      "🔢 <b>How the AI scores words</b>: It gives each word a raw score, then applies a softmax (turns scores into percentages) so the highest‑scoring word is most likely to be chosen. This helps the AI pick the next token like picking the most popular candy in a jar!\n";
    if (this.explanationArea) this.explanationArea.innerHTML = explanation;
    this.gameOver = true;
  }

  reset() {
    this.gameOver = false;
    this.score = 0;
    this.timeLeft = this.timeLimit;
    this.direction = { x: 1, y: 0 };
    this.pendingDirection = null;
    this.snake = [{ x: Math.floor(this.cols / 2), y: Math.floor(this.rows / 2) }];
    this.candidates = [];
    this.ai.used.clear();
    this.updateScore();
    this.updateTimerDisplay();
    this.aiInfo.textContent = "";
    this.chain = [];
    if (this.storyArea) this.storyArea.textContent = "";
    if (this.candidatePanel) this.candidatePanel.innerHTML = "";
    if (this.sentenceArea) this.sentenceArea.textContent = "";
    if (this.explanationArea) this.explanationArea.textContent = "";
  }

  updateTimer() {
    this.timeLeft--;
    this.updateTimerDisplay();
    if (this.timeLeft <= 0 && !this.gameOver) this.endGame();
  }

  updateTimerDisplay() {
    this.timerEl.textContent = `Time: ${this.timeLeft}s`;
  }

  updateScore() {
    this.scoreEl.textContent = `Score: ${this.score}`;
  }

  placeCandidates() {
    // Determine empty cells
    const empty = [];
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        if (!this.snake.some(seg => seg.x === x && seg.y === y)) {
          empty.push({ x, y });
        }
      }
    }
    if (empty.length === 0) return; // no space

    // Determine the next category based on the current chain length
    // const categories = ['nouns', 'verbs', 'adjectives', 'connectors', 'phrases'];
    const categories = ['nouns', 'verbs', 'adjectives', 'connectors'];
    const nextCategory = categories[this.chain.length % categories.length];
    // Retrieve words for the selected category
    let categoryWords;
    if (nextCategory === 'connectors') {
      categoryWords = this.repo.connectors();
    } else if (nextCategory === 'phrases') {
      categoryWords = this.repo.phrases();
    } else {
      categoryWords = this.repo.categories[nextCategory];
    }

    // Determine candidate words based on context (last letter) or category type
    let scoredCandidates = [];
    if (nextCategory === 'connectors' || nextCategory === 'phrases') {
      // For connectors and phrases, ignore the last letter context and use all words in the category
      scoredCandidates = categoryWords.map(w => ({ word: w, score: this.ai._score(w) }));
    } else if (this.chain.length > 0) {
      const lastWord = this.chain[this.chain.length - 1];
      const lastLetter = lastWord[lastWord.length - 1].toLowerCase();
      const candidates = categoryWords.filter(w => w.toLowerCase().startsWith(lastLetter));
      const source = candidates.length > 0 ? candidates : categoryWords;
      scoredCandidates = source.map(w => ({ word: w, score: this.ai._score(w) }));
    } else {
      // First word: use the first category (nouns)
      scoredCandidates = categoryWords.map(w => ({ word: w, score: this.ai._score(w) }));
    }

    // Sort by score descending and take top N (e.g., 5)
    scoredCandidates.sort((a, b) => b.score - a.score);
    const topCandidates = scoredCandidates.slice(0, 5);

    // Shuffle empty positions
    const shuffledEmpty = empty.sort(() => Math.random() - 0.5);
    this.candidates = [];

    // Assign each top candidate to a position where the word fits within canvas bounds
    for (const { word, score } of topCandidates) {
      this.ctx.font = `${this.cellSize - 2}px Arial`;
      for (let i = 0; i < shuffledEmpty.length; i++) {
        const pos = shuffledEmpty[i];
        const textWidth = this.ctx.measureText(word).width;
        const left = pos.x * this.cellSize + this.cellSize / 2 - textWidth / 2;
        const right = left + textWidth;
        if (left >= 0 && right <= this.width) {
          this.candidates.push({ x: pos.x, y: pos.y, word, score });
          shuffledEmpty.splice(i, 1);
          break;
        }
      }
    }

    // Fallback: if no candidates placed, ensure at least one candidate is placed in any empty cell
    if (this.candidates.length === 0 && topCandidates.length > 0 && shuffledEmpty.length > 0) {
      const pos = shuffledEmpty[0];
      const { word, score } = topCandidates[0];
      this.ctx.font = `${this.cellSize - 2}px Arial`;
      const textWidth = this.ctx.measureText(word).width;
      const left = pos.x * this.cellSize + this.cellSize / 2 - textWidth / 2;
      const right = left + textWidth;
      if (left >= 0 && right <= this.width) {
        this.candidates.push({ x: pos.x, y: pos.y, word, score });
      }
    }
  }

  gameLoop() {
    // Update direction if pending
    if (this.pendingDirection) {
      this.direction = this.pendingDirection;
      this.pendingDirection = null;
    }
    // Compute new head position
    const head = this.snake[0];
    const newHead = { x: head.x + this.direction.x, y: head.y + this.direction.y };
    // Check wall collision
    if (newHead.x < 0 || newHead.x >= this.cols || newHead.y < 0 || newHead.y >= this.rows) {
      if (!this.gameOver) this.endGame();
      return;
    }
    // Check self collision
    if (this.snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
      if (!this.gameOver) this.endGame();
      return;
    }
    // Add new head
    this.snake.unshift(newHead);
    // Check candidate collision
    let ateCandidate = null;
    for (let i = 0; i < this.candidates.length; i++) {
      const cand = this.candidates[i];
      if (newHead.x === cand.x && newHead.y === cand.y) {
        ateCandidate = cand;
        this.candidates.splice(i, 1);
        break;
      }
    }
    if (ateCandidate) {
      this.score++;
      this.updateScore();
      // Record eaten word for story
      this.chain.push(ateCandidate.word);
      // AI reasoning for the eaten word
      this.ai.used.add(ateCandidate.word.toLowerCase());
      const reasoning = this.ai.getReasoning(ateCandidate.word);
      this.lastChosenScore = ateCandidate.score;
      this.showAIInfo(ateCandidate.word, reasoning);
      // Place new candidates (snake grows, so we don't pop tail)
      this.placeCandidates();
    } else {
      // Move snake (remove tail)
      this.snake.pop();
    }
    this.draw();
  }

  draw() {
    // Clear canvas
    this.ctx.fillStyle = "#fff";
    this.ctx.fillRect(0, 0, this.width, this.height);
    // Draw snake
    this.ctx.fillStyle = "#4caf50";
    for (const seg of this.snake) {
      this.ctx.fillRect(seg.x * this.cellSize, seg.y * this.cellSize, this.cellSize, this.cellSize);
    }
    // Draw food word (as text)
    if (this.candidates && this.candidates.length) {
      this.ctx.fillStyle = "#d32f2f";
      this.ctx.font = `${this.cellSize - 2}px Arial`;
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      for (const cand of this.candidates) {
        this.ctx.fillText(cand.word, cand.x * this.cellSize + this.cellSize / 2, cand.y * this.cellSize + this.cellSize / 2);
      }
    }
  }

  showAIInfo(eatenWord, reasoning) {
    // If the game is over, do nothing
    if (this.gameOver) return;
    // Determine the previous word's last letter (or use first letter of current word if none)
    let prevLastLetter;
    if (this.chain.length > 1) {
      const prevWord = this.chain[this.chain.length - 2];
      prevLastLetter = prevWord[prevWord.length - 1].toLowerCase();
    } else {
      // First word: use its first letter as context
      prevLastLetter = eatenWord[0].toLowerCase();
    }
    // Compute full candidate list with scores based on previous context
    const allCandidates = this.ai._candidates(prevLastLetter);
    const scored = allCandidates.map(w => ({ word: w, score: this.ai._score(w) }));
    scored.sort((a, b) => b.score - a.score);
    const topCandidates = scored.slice(0, 5);
    // Use the score stored when the word was placed (the highest score at selection time)
    const chosenScore = this.lastChosenScore !== undefined ? this.lastChosenScore : this.ai._score(eatenWord);
    // Build AI info text
    let info = `You ate: ${eatenWord}\n`;
    info += `AI step – last letter '${prevLastLetter}' → candidates: ${allCandidates.length}\n`;
    if (topCandidates.length > 0) {
      const topList = topCandidates.map(p => `${p.word}:${p.score.toFixed(2)}`).join(", ");
      info += `Top ${topCandidates.length} scores: ${topList}\n`;
    }
    info += "The AI treats the last letter as the context token, generates candidate words, scores them using novelty, adjective/verb bonuses, and a rare‑letter boost.";
    this.aiInfo.textContent = info;
    // Update candidate panel with scores
    const entry = document.createElement("div");
    entry.style.borderBottom = "1px solid #eee";
    entry.style.padding = "2px 0";
    entry.textContent = `Chosen: ${eatenWord} (score:${chosenScore.toFixed(2)}); Candidates: ${topCandidates.map(p => `${p.word}:${p.score.toFixed(2)}`).join(", ")}`;
    this.candidatePanel.appendChild(entry);
    // Update sentence area with current story
    if (this.sentenceArea) this.sentenceArea.textContent = this._storyFromChain(this.chain);
  }
  
    _storyFromChain(chain) {
      // Build story directly from the chain order, preserving connectors and phrases.
      if (!chain || chain.length === 0) return '';
      // Capitalize the first word of the story.
      const first = chain[0];
      const capitalizedFirst = first.charAt(0).toUpperCase() + first.slice(1);
      const rest = chain.slice(1);
      const words = [capitalizedFirst, ...rest];
      let text = words.join(' ');
      // Ensure the story ends with a period.
      if (!/[.!?]$/.test(text)) text += '.';
      return text;
    }

  endGame() {
    // Prevent multiple executions of endGame
    if (this.gameOver) return;
    this.gameOver = true;
    clearInterval(this.intervalId);
    clearInterval(this.timerId);
    this.startBtn.disabled = false;
    this.aiInfo.textContent += `\nGame over! Final score: ${this.score}`;
    const story = this._storyFromChain(this.chain);
    if (this.storyArea) this.storyArea.textContent = story;
    // Concise, kid‑friendly explanation with emojis
    const explanation = "🤖 <b>GenAI Explanation</b>\n" +
      "🔤 <b>Next word prediction</b>: The AI looks at the last letter (the \"context\") and picks a word that fits.\n" +
      "🧠 <b>How LLMs write</b>: They learned from many stories, so they can guess the next word like a game of word‑snake.\n" +
      "⚠️ <b>Limits</b>: The AI doesn’t really understand; it can make silly mistakes and only knows what it has read.\n" +
      "🔢 <b>How the AI scores words</b>: It gives each word a raw score, then applies a softmax (turns scores into percentages) so the highest‑scoring word is most likely to be chosen. This helps the AI pick the next token like picking the most popular candy in a jar!\n";
    if (this.explanationArea) this.explanationArea.innerHTML = explanation;
  }
}

// ----- Initialize on page load -----
window.addEventListener("DOMContentLoaded", () => {
  // Create a container div if not present
  let container = document.getElementById("gluttonous-snake-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "gluttonous-snake-container";
    document.body.appendChild(container);
  }
  // Instantiate the game
  new GluttonousSnakeGame("gluttonous-snake-container");
});
