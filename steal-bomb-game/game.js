const MAX_TURNS = 3;
const HUMAN_INDEX = 0;

const state = {
  playerCount: 6,
  players: [],
  deck: [],
  discard: [],
  currentIndex: 0,
  phase: "turn",
  logs: [],
  pending: null,
  lastDiscard: null,
  finishedResults: [],
};

let cardSeq = 1;

const el = {
  playerCount: document.querySelector("#playerCount"),
  newGameBtn: document.querySelector("#newGameBtn"),
  phaseLabel: document.querySelector("#phaseLabel"),
  turnTitle: document.querySelector("#turnTitle"),
  roundPill: document.querySelector("#roundPill"),
  deckCount: document.querySelector("#deckCount"),
  discardCard: document.querySelector("#discardCard"),
  seatLayer: document.querySelector("#seatLayer"),
  playerStatus: document.querySelector("#playerStatus"),
  currentHint: document.querySelector("#currentHint"),
  logList: document.querySelector("#logList"),
  myHand: document.querySelector("#myHand"),
  myBest: document.querySelector("#myBest"),
  myTip: document.querySelector("#myTip"),
  primaryAction: document.querySelector("#primaryAction"),
  fastAction: document.querySelector("#fastAction"),
  choiceModal: document.querySelector("#choiceModal"),
  modalKicker: document.querySelector("#modalKicker"),
  modalTitle: document.querySelector("#modalTitle"),
  modalCopy: document.querySelector("#modalCopy"),
  modalCards: document.querySelector("#modalCards"),
  closeModalBtn: document.querySelector("#closeModalBtn"),
};

function makeCard(month, variant) {
  return {
    id: `c${cardSeq++}`,
    kind: "month",
    month,
    gwang: [1, 3, 8].includes(month) && variant === 0,
    variant,
  };
}

function makeBomb() {
  return {
    id: `b${cardSeq++}`,
    kind: "bomb",
    month: 0,
    gwang: false,
    variant: 0,
  };
}

function buildDeck(playerCount) {
  cardSeq = 1;
  const deck = [];
  for (let variant = 0; variant < 4; variant += 1) {
    for (let month = 1; month <= 10; month += 1) {
      deck.push(makeCard(month, variant));
    }
  }
  const bombCount = Math.max(2, Math.ceil(playerCount / 2));
  for (let i = 0; i < bombCount; i += 1) deck.push(makeBomb());
  return shuffle(deck);
}

function shuffle(cards) {
  const copy = [...cards];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function drawCard() {
  if (state.deck.length === 0 && state.discard.length > 0) {
    state.deck = shuffle(state.discard);
    state.discard = [];
    addLog("버린 카드를 섞어 덱을 다시 만들었습니다.");
  }
  if (state.deck.length === 0) {
    state.deck = buildDeck(state.playerCount);
    addLog("임시 덱을 새로 보충했습니다.");
  }
  return state.deck.pop();
}

function createPlayer(index) {
  const hand = [drawCard(), drawCard(), drawCard()].map((card) => ({
    card,
    open: false,
  }));
  return {
    id: index,
    name: index === HUMAN_INDEX ? "P1" : `P${index + 1}`,
    isHuman: index === HUMAN_INDEX,
    turns: 0,
    hand,
  };
}

function newGame() {
  state.playerCount = Number(el.playerCount.value);
  state.deck = buildDeck(state.playerCount);
  state.discard = [];
  state.currentIndex = 0;
  state.phase = "chooseOpen";
  state.pending = null;
  state.lastDiscard = null;
  state.finishedResults = [];
  state.players = Array.from({ length: state.playerCount }, (_, index) => createPlayer(index));
  state.players.forEach((player) => {
    if (!player.isHuman) setOpenCard(player, chooseInitialOpenIndex(player));
  });
  state.logs = [];
  state.pending = { playerIndex: HUMAN_INDEX };
  addLog(`${state.playerCount}인 게임을 시작했습니다. 먼저 P1의 바닥 공개패를 선택합니다.`);
  render();
}

function cardName(card) {
  if (!card) return "없음";
  if (card.kind === "bomb") return "폭탄";
  return `${card.month}월${card.gwang ? " 광" : ""}`;
}

function slotOpenIndex(player) {
  return player.hand.findIndex((slot) => slot.open);
}

function hiddenIndexes(player) {
  return player.hand.map((slot, index) => (slot.open ? -1 : index)).filter((index) => index >= 0);
}

function setOpenCard(player, openIndex) {
  player.hand.forEach((slot, index) => {
    slot.open = index === openIndex;
  });
}

function chooseInitialOpenIndex(player) {
  const bombIndex = player.hand.findIndex((slot) => slot.card.kind === "bomb");
  if (bombIndex >= 0) return bombIndex;

  let lowestIndex = 0;
  let lowestScore = Number.POSITIVE_INFINITY;
  player.hand.forEach((slot, index) => {
    const score = slot.card.kind === "bomb" ? -100 : slot.card.month + (slot.card.gwang ? 0.5 : 0);
    if (score < lowestScore) {
      lowestScore = score;
      lowestIndex = index;
    }
  });
  return lowestIndex;
}

function chooseHumanOpen(openIndex) {
  if (state.phase !== "chooseOpen") return;
  const player = state.players[HUMAN_INDEX];
  setOpenCard(player, openIndex);
  state.phase = "turn";
  state.pending = null;
  addLog(`P1이 ${cardName(player.hand[openIndex].card)}을 바닥 공개패로 선택했습니다.`);
  render();
}

function nextIndex(index) {
  return (index + 1) % state.players.length;
}

function advanceCurrentIndex() {
  let next = nextIndex(state.currentIndex);
  let guard = 0;
  while (state.players[next].turns >= MAX_TURNS && guard < state.players.length) {
    next = nextIndex(next);
    guard += 1;
  }
  state.currentIndex = next;
}

function runCurrentTurn() {
  if (state.phase === "finished") {
    newGame();
    return;
  }
  if (state.phase !== "turn") return;

  const current = state.players[state.currentIndex];
  const drawn = drawCard();
  addLog(`${current.name}이 덱에서 ${cardName(drawn)}을 뽑았습니다.`);

  if (current.isHuman) {
    state.phase = "chooseReplace";
    state.pending = {
      playerIndex: state.currentIndex,
      drawnCard: drawn,
    };
    render();
    return;
  }

  applyOpenDecision(current, drawn, shouldAIReplaceOpen(current, drawn));
  continueAfterOpenDecision();
  render();
}

function applyOpenDecision(player, drawn, shouldReplace) {
  const openIndex = slotOpenIndex(player);
  const floorCard = player.hand[openIndex].card;

  if (shouldReplace) {
    state.discard.push(floorCard);
    state.lastDiscard = floorCard;
    player.hand[openIndex].card = drawn;
    player.hand[openIndex].open = true;
    addLog(`${player.name}이 바닥패 ${cardName(floorCard)}을 버리고 ${cardName(drawn)}로 교체했습니다.`);
    return;
  }

  state.discard.push(drawn);
  state.lastDiscard = drawn;
  addLog(`${player.name}이 뽑은 ${cardName(drawn)}을 버리고 바닥패를 유지했습니다.`);
}

function shouldAIReplaceOpen(player, drawn) {
  const openIndex = slotOpenIndex(player);
  const floorCard = player.hand[openIndex].card;
  if (floorCard.kind === "bomb" && drawn.kind !== "bomb") return true;
  if (floorCard.kind !== "bomb" && drawn.kind === "bomb") return false;

  const currentBest = evaluateBest(player.hand.map((slot) => slot.card));
  const simulatedCards = player.hand.map((slot, index) => (index === openIndex ? drawn : slot.card));
  const simulatedBest = evaluateBest(simulatedCards);
  return simulatedBest.score > currentBest.score || (simulatedBest.score === currentBest.score && simulatedBest.tie > currentBest.tie);
}

function chooseReplaceDecision(shouldReplace) {
  if (state.phase !== "chooseReplace" || !state.pending) return;
  const player = state.players[state.pending.playerIndex];
  applyOpenDecision(player, state.pending.drawnCard, shouldReplace);
  continueAfterOpenDecision();
  render();
}

function continueAfterOpenDecision() {
  const stealerIndex = nextIndex(state.currentIndex);
  const current = state.players[state.currentIndex];
  if (stealerIndex === HUMAN_INDEX) {
    state.phase = "chooseSteal";
    state.pending = {
      victimIndex: state.currentIndex,
      stealerIndex,
    };
    addLog(`${current.name}의 턴 후, P1이 카드를 훔칠 차례입니다.`);
  } else {
    autoSteal(stealerIndex, state.currentIndex);
    completeTurn();
  }
}

function completeTurn() {
  const current = state.players[state.currentIndex];
  current.turns += 1;
  addLog(`${current.name}이 ${current.turns}/${MAX_TURNS}턴을 종료했습니다.`);

  if (state.players.every((player) => player.turns >= MAX_TURNS)) {
    finishGame();
    return;
  }
  advanceCurrentIndex();
  state.phase = "turn";
  state.pending = null;
}

function autoSteal(stealerIndex, victimIndex) {
  const stealer = state.players[stealerIndex];
  const victim = state.players[victimIndex];
  const stealIndex = chooseStealIndex(victim);
  moveCardBetweenPlayers(stealer, victim, stealIndex, chooseReturnIndex(stealer));
}

function chooseStealIndex(victim) {
  const candidates = hiddenIndexes(victim);
  const bombIndex = candidates.find((index) => victim.hand[index].card.kind === "bomb");
  if (bombIndex !== undefined) return bombIndex;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function chooseReturnIndex(stealer) {
  const candidates = hiddenIndexes(stealer);
  const bombIndex = candidates.find((index) => stealer.hand[index].card.kind === "bomb");
  if (bombIndex !== undefined) return bombIndex;

  let lowestIndex = 0;
  let lowestScore = Number.POSITIVE_INFINITY;
  candidates.forEach((index) => {
    const slot = stealer.hand[index];
    const cardScore = slot.card.kind === "bomb" ? -100 : slot.card.month + (slot.card.gwang ? 0.5 : 0);
    if (cardScore < lowestScore) {
      lowestScore = cardScore;
      lowestIndex = index;
    }
  });
  return lowestIndex;
}

function moveCardBetweenPlayers(stealer, victim, stealIndex, returnIndex) {
  const stolenSlot = victim.hand.splice(stealIndex, 1)[0];
  const returnedSlot = stealer.hand.splice(returnIndex, 1)[0];

  victim.hand.push({
    card: returnedSlot.card,
    open: false,
  });
  stealer.hand.push({
    card: stolenSlot.card,
    open: false,
  });

  addLog(`${stealer.name}이 ${victim.name}에게서 ${cardName(stolenSlot.card)}을 가져가고 ${cardName(returnedSlot.card)}을 돌려줬습니다.`);
}

function startHumanSteal(cardIndex) {
  if (state.phase !== "chooseSteal" || !state.pending) return;
  const victim = state.players[state.pending.victimIndex];
  const stealer = state.players[HUMAN_INDEX];
  if (victim.hand[cardIndex]?.open) return;
  const stolenSlot = victim.hand.splice(cardIndex, 1)[0];

  stealer.hand.push({
    card: stolenSlot.card,
    open: false,
    justStolen: true,
  });
  state.pending.stolenCard = stolenSlot.card;
  state.phase = "chooseReturn";
  addLog(`P1이 ${victim.name}에게서 ${cardName(stolenSlot.card)}을 훔쳤습니다.`);
  render();
}

function finishHumanSteal(returnIndex) {
  if (state.phase !== "chooseReturn" || !state.pending) return;
  const victim = state.players[state.pending.victimIndex];
  const stealer = state.players[HUMAN_INDEX];
  if (stealer.hand[returnIndex]?.open) return;
  const returnedSlot = stealer.hand.splice(returnIndex, 1)[0];

  victim.hand.push({
    card: returnedSlot.card,
    open: false,
  });
  stealer.hand.forEach((slot) => {
    delete slot.justStolen;
  });
  addLog(`P1이 ${victim.name}에게 ${cardName(returnedSlot.card)}을 돌려줬습니다.`);
  completeTurn();
  render();
}

function autoUntilHumanChoice() {
  let guard = 0;
  while (state.phase === "turn" && state.currentIndex !== HUMAN_INDEX && guard < 30) {
    runCurrentTurn();
    guard += 1;
  }
  render();
}

function addLog(message) {
  state.logs.unshift(message);
  state.logs = state.logs.slice(0, 12);
}

function finishGame() {
  state.phase = "finished";
  state.finishedResults = rankPlayers();
  addLog("모든 플레이어가 3턴을 종료했습니다. 최종 패를 공개합니다.");
}

function rankPlayers() {
  return state.players
    .map((player) => {
      const hasBomb = player.hand.some((slot) => slot.card.kind === "bomb");
      const best = evaluateBest(player.hand.map((slot) => slot.card));
      return {
        player,
        hasBomb,
        best,
      };
    })
    .sort((a, b) => {
      if (a.hasBomb !== b.hasBomb) return a.hasBomb ? 1 : -1;
      if (b.best.score !== a.best.score) return b.best.score - a.best.score;
      return b.best.tie - a.best.tie;
    });
}

function evaluateBest(cards) {
  const normalCards = cards.filter((card) => card.kind === "month");
  if (normalCards.length < 2) {
    return { label: "판정불가", score: 0, tie: 0 };
  }

  let best = { label: "망통", score: 0, tie: 0 };
  for (let i = 0; i < normalCards.length; i += 1) {
    for (let j = i + 1; j < normalCards.length; j += 1) {
      const combo = evaluatePair(normalCards[i], normalCards[j]);
      if (combo.score > best.score || (combo.score === best.score && combo.tie > best.tie)) {
        best = combo;
      }
    }
  }
  return best;
}

function evaluatePair(a, b) {
  const months = [a.month, b.month].sort((x, y) => x - y);
  const tie = Math.max(a.month, b.month);
  const bothGwang = a.gwang && b.gwang;

  if (bothGwang && months[0] === 3 && months[1] === 8) return { label: "삼팔광땡", score: 12000, tie };
  if (bothGwang && months[0] === 1 && months[1] === 8) return { label: "일팔광땡", score: 11000, tie };
  if (bothGwang && months[0] === 1 && months[1] === 3) return { label: "일삼광땡", score: 10000, tie };

  if (a.month === b.month) {
    return { label: `${a.month}땡`, score: 9000 + a.month, tie: a.month };
  }

  const key = months.join("-");
  const specials = {
    "1-2": ["알리", 8000],
    "1-4": ["독사", 7900],
    "1-9": ["구삥", 7800],
    "1-10": ["장삥", 7700],
    "4-10": ["장사", 7600],
    "4-6": ["세륙", 7500],
  };
  if (specials[key]) {
    return { label: specials[key][0], score: specials[key][1], tie };
  }

  const gut = (a.month + b.month) % 10;
  if (gut === 0) return { label: "망통", score: 5000, tie };
  return { label: `${gut}끗`, score: 6000 + gut, tie };
}

function seatPosition(index, total) {
  const angle = ((180 - (index * 360) / total) * Math.PI) / 180;
  const radiusX = 43;
  const radiusY = 36;
  return {
    left: 50 + Math.cos(angle) * radiusX,
    top: 50 - Math.sin(angle) * radiusY,
  };
}

function render() {
  renderBoardState();
  renderSeats();
  renderStatus();
  renderHand();
  renderLogs();
  renderActions();
  renderModal();
}

function renderBoardState() {
  const current = state.players[state.currentIndex];
  const allTurns = state.players.reduce((sum, player) => sum + player.turns, 0);
  el.deckCount.textContent = `${state.deck.length}장`;
  el.discardCard.className = `small-card${state.lastDiscard?.kind === "bomb" ? " bomb" : ""}${!state.lastDiscard ? " muted" : ""}`;
  el.discardCard.innerHTML = state.lastDiscard ? miniCardHTML(state.lastDiscard) : "없음";
  el.roundPill.textContent = `${allTurns}/${state.playerCount * MAX_TURNS}턴 진행`;

  if (state.phase === "finished") {
    el.phaseLabel.textContent = "게임 종료";
    el.turnTitle.textContent = "최종 순위가 공개되었습니다";
    el.currentHint.textContent = "결과 공개";
    return;
  }

  if (state.phase === "chooseOpen") {
    el.phaseLabel.textContent = "공개패 선택";
    el.turnTitle.textContent = "처음 받은 3장 중 바닥에 공개할 패를 고르세요";
    el.currentHint.textContent = "P1 선택";
    return;
  }

  if (state.phase === "chooseReplace") {
    el.phaseLabel.textContent = "바닥패 교체";
    el.turnTitle.textContent = "뽑은 패를 확인한 뒤 바닥패 교체 여부를 선택하세요";
    el.currentHint.textContent = "교체 선택";
    return;
  }

  if (state.phase === "chooseSteal") {
    const victim = state.players[state.pending.victimIndex];
    el.phaseLabel.textContent = "도난 단계";
    el.turnTitle.textContent = `P1이 ${victim.name}의 카드 1장을 훔칩니다`;
    el.currentHint.textContent = `${victim.name} 선택`;
    return;
  }

  if (state.phase === "chooseReturn") {
    const victim = state.players[state.pending.victimIndex];
    el.phaseLabel.textContent = "교환 단계";
    el.turnTitle.textContent = `${victim.name}에게 돌려줄 카드 선택`;
    el.currentHint.textContent = "반환 선택";
    return;
  }

  el.phaseLabel.textContent = current.isHuman ? "내 차례" : "AI 차례";
  el.turnTitle.textContent = `${current.name}이 카드를 뽑고 바닥패 교체 여부를 결정합니다`;
  el.currentHint.textContent = `${current.name} 진행`;
}

function renderSeats() {
  el.seatLayer.innerHTML = "";
  state.players.forEach((player, index) => {
    const publicSlot = player.hand.find((slot) => slot.open);
    const best = evaluateBest(player.hand.map((slot) => slot.card));
    const pos = seatPosition(index, state.players.length);
    const seat = document.createElement("article");
    const classes = ["seat"];
    if (index === state.currentIndex && state.phase === "turn") classes.push("current");
    if (player.isHuman) classes.push("human");
    if (publicSlot?.card.kind === "bomb") classes.push("danger");
    seat.className = classes.join(" ");
    seat.style.left = `${pos.left}%`;
    seat.style.top = `${pos.top}%`;
    seat.innerHTML = `
      <div class="seat-top">
        <span class="seat-name">${player.name}</span>
        <span class="turn-count">${player.turns}/${MAX_TURNS}턴</span>
      </div>
      <div class="public-line">
        <div class="public-card ${publicSlot?.card.kind === "bomb" ? "bomb" : ""}">${publicSlot ? miniCardHTML(publicSlot.card) : "교환중"}</div>
        <div class="seat-meta">
          <span>공개 카드</span>
          <b>${player.isHuman ? best.label : "비공개 2장"}</b>
        </div>
      </div>
    `;
    el.seatLayer.appendChild(seat);
  });
}

function renderStatus() {
  el.playerStatus.innerHTML = "";
  state.players.forEach((player, index) => {
    const publicSlot = player.hand.find((slot) => slot.open);
    const row = document.createElement("div");
    const classes = ["status-row"];
    if (index === state.currentIndex && state.phase === "turn") classes.push("current");
    if (publicSlot?.card.kind === "bomb") classes.push("danger");
    row.className = classes.join(" ");
    row.innerHTML = `
      <div class="avatar">${index + 1}</div>
      <div class="status-main">
        <b>${player.name}${player.isHuman ? " · 나" : ""}</b>
        <span>${publicSlot ? `공개 ${cardName(publicSlot.card)}` : "공개 카드 교환중"}</span>
      </div>
      <small>${player.turns}/${MAX_TURNS}</small>
    `;
    el.playerStatus.appendChild(row);
  });
}

function renderHand() {
  const human = state.players[HUMAN_INDEX];
  const best = evaluateBest(human.hand.map((slot) => slot.card));
  const hasBomb = human.hand.some((slot) => slot.card.kind === "bomb");
  el.myBest.textContent = hasBomb ? `${best.label} · 폭탄 보유` : best.label;
  el.myTip.textContent = state.phase === "finished"
    ? "새 게임을 눌러 다시 시작할 수 있습니다."
    : "바닥 공개패는 훔치거나 돌려줄 수 없고, 뽑은 패를 확인한 뒤 교체 여부를 고릅니다.";
  el.myHand.innerHTML = human.hand.map((slot) => cardHTML(slot, { visible: true })).join("");
}

function renderLogs() {
  el.logList.innerHTML = state.logs.slice(0, 8).map((log) => `<li>${log}</li>`).join("");
}

function renderActions() {
  if (state.phase === "finished") {
    el.primaryAction.textContent = "새 게임";
    el.primaryAction.disabled = false;
    el.fastAction.disabled = true;
    return;
  }

  if (state.phase === "chooseOpen") {
    el.primaryAction.textContent = "공개패 선택";
    el.primaryAction.disabled = true;
    el.fastAction.disabled = true;
    return;
  }

  if (state.phase === "chooseReplace") {
    el.primaryAction.textContent = "교체 선택";
    el.primaryAction.disabled = true;
    el.fastAction.disabled = true;
    return;
  }

  if (state.phase !== "turn") {
    el.primaryAction.textContent = "선택 대기";
    el.primaryAction.disabled = true;
    el.fastAction.disabled = true;
    return;
  }

  const current = state.players[state.currentIndex];
  el.primaryAction.textContent = current.isHuman ? "카드 뽑기" : `${current.name} 진행`;
  el.primaryAction.disabled = false;
  el.fastAction.disabled = current.isHuman;
}

function renderModal() {
  if (state.phase === "chooseOpen") {
    const human = state.players[HUMAN_INDEX];
    el.choiceModal.classList.remove("hidden");
    el.closeModalBtn.hidden = true;
    el.modalKicker.textContent = "게임 시작";
    el.modalTitle.textContent = "바닥에 공개할 패를 선택하세요";
    el.modalCopy.textContent = "처음 받은 3장 중 1장은 공개패가 됩니다. 이 카드는 다른 사람에게 넘길 수 없고, 내 턴에 덱과만 교체됩니다.";
    el.modalCards.innerHTML = human.hand
      .map((slot, index) => `
        <button type="button" data-open-index="${index}" aria-label="${cardName(slot.card)} 공개하기">
          ${cardHTML(slot, { visible: true, choice: true })}
        </button>
      `)
      .join("");
    return;
  }

  if (state.phase === "chooseReplace") {
    const player = state.players[state.pending.playerIndex];
    const openIndex = slotOpenIndex(player);
    const floorSlot = player.hand[openIndex];
    const drawnSlot = { card: state.pending.drawnCard, open: false };
    el.choiceModal.classList.remove("hidden");
    el.closeModalBtn.hidden = true;
    el.modalKicker.textContent = "카드 확인";
    el.modalTitle.textContent = "바닥패를 교체하시겠습니까?";
    el.modalCopy.textContent = "뽑은 패를 보고 결정합니다. 교체하지 않으면 뽑은 패가 버려지고, 교체하면 기존 바닥패가 버려집니다.";
    el.modalCards.innerHTML = `
      <div class="replace-choice">
        <div class="replace-card">
          <span>현재 바닥패</span>
          ${cardHTML(floorSlot, { visible: true, locked: true })}
        </div>
        <div class="replace-card drawn">
          <span>뽑은 패</span>
          ${cardHTML(drawnSlot, { visible: true })}
        </div>
        <div class="replace-buttons">
          <button type="button" class="keep" data-replace-action="keep">바닥패 유지</button>
          <button type="button" class="replace" data-replace-action="replace">뽑은 패로 교체</button>
        </div>
      </div>
    `;
    return;
  }

  if (state.phase === "chooseSteal") {
    const victim = state.players[state.pending.victimIndex];
    el.choiceModal.classList.remove("hidden");
    el.closeModalBtn.hidden = true;
    el.modalKicker.textContent = "도난 단계";
    el.modalTitle.textContent = `${victim.name}의 숨긴 패 1장을 훔치세요`;
    el.modalCopy.textContent = "바닥 공개패는 훔칠 수 없습니다. 선택 가능한 카드는 숨겨진 패뿐입니다.";
    el.modalCards.innerHTML = victim.hand
      .map((slot, index) => `
        <button type="button" ${slot.open ? "disabled" : `data-steal-index="${index}"`} aria-label="${slot.open ? "바닥 공개패는 훔칠 수 없음" : `${index + 1}번 숨긴 패 훔치기`}">
          ${cardHTML(slot, { visible: slot.open, choice: !slot.open, locked: slot.open })}
        </button>
      `)
      .join("");
    return;
  }

  if (state.phase === "chooseReturn") {
    const victim = state.players[state.pending.victimIndex];
    const human = state.players[HUMAN_INDEX];
    el.choiceModal.classList.remove("hidden");
    el.closeModalBtn.hidden = true;
    el.modalKicker.textContent = "교환 단계";
    el.modalTitle.textContent = `${victim.name}에게 돌려줄 카드 선택`;
    el.modalCopy.textContent = "카드를 훔쳤으니 내 숨긴 패 중 1장을 돌려줘야 합니다. 내 바닥 공개패는 돌려줄 수 없습니다.";
    el.modalCards.innerHTML = human.hand
      .map((slot, index) => `
        <button type="button" ${slot.open ? "disabled" : `data-return-index="${index}"`} aria-label="${slot.open ? "바닥 공개패는 돌려줄 수 없음" : `${cardName(slot.card)} 돌려주기`}">
          ${cardHTML(slot, { visible: true, choice: !slot.open, locked: slot.open })}
        </button>
      `)
      .join("");
    return;
  }

  if (state.phase === "finished") {
    el.choiceModal.classList.remove("hidden");
    el.closeModalBtn.hidden = false;
    el.modalKicker.textContent = "최종 결과";
    el.modalTitle.textContent = "3턴 종료 · 순위 공개";
    el.modalCopy.textContent = "폭탄 보유자는 족보와 관계없이 최하위로 처리됩니다.";
    el.modalCards.innerHTML = `<div class="result-board">${state.finishedResults
      .map((result, index) => resultHTML(result, index))
      .join("")}</div>`;
    return;
  }

  el.closeModalBtn.hidden = false;
  el.choiceModal.classList.add("hidden");
}

function miniCardHTML(card) {
  if (!card) return "없음";
  return `
    <div class="mini-art" aria-label="${cardName(card)}">
      ${card.kind === "bomb" ? hwatuArt(card, true) : `<img class="mini-face" src="${cardImagePath(card)}" alt="${cardName(card)}" />`}
    </div>
  `;
}

function cardHTML(slot, options = {}) {
  const { visible = true, choice = false, locked = false } = options;
  const card = slot.card;
  if (!visible) {
    return `
      <div class="game-card back ${choice ? "choice" : ""}${locked ? " locked" : ""}" tabindex="${choice ? "0" : "-1"}">
        <span class="month">?</span>
        <span class="caption">비공개</span>
      </div>
    `;
  }

  const classes = ["game-card"];
  if (slot.open) classes.push("open");
  if (card.kind === "bomb") classes.push("bomb");
  if (choice) classes.push("choice");
  if (locked) classes.push("locked");
  const badge = slot.open ? `<span class="badge">공개</span>` : "";
  const stolenBadge = slot.justStolen ? `<span class="badge">도난</span>` : badge;

  if (card.kind === "bomb") {
    return `
      <div class="${classes.join(" ")}" tabindex="${choice ? "0" : "-1"}">
        ${stolenBadge}
        ${hwatuArt(card)}
        <span class="month">폭탄</span>
        <span class="caption">최종 보유 시 최하위</span>
      </div>
    `;
  }

  return `
    <div class="${classes.join(" ")} month-${card.month}" tabindex="${choice ? "0" : "-1"}">
      ${stolenBadge || (card.gwang ? `<span class="badge">광</span>` : "")}
      <img class="card-face" src="${cardImagePath(card)}" alt="${cardName(card)}" />
    </div>
  `;
}

function cardImagePath(card) {
  const fileMap = {
    "1-0": "Hanafuda_January_Hikari.png",
    "1-1": "Hanafuda_January_Tanzaku.png",
    "1-2": "Hanafuda_January_Kasu_1.png",
    "1-3": "Hanafuda_January_Kasu_2.png",
    "2-0": "Hanafuda_February_Tane.png",
    "2-1": "Hanafuda_February_Tanzaku.png",
    "2-2": "Hanafuda_February_Kasu_1.png",
    "2-3": "Hanafuda_February_Kasu_2.png",
    "3-0": "Hanafuda_March_Hikari.png",
    "3-1": "Hanafuda_March_Tanzaku.png",
    "3-2": "Hanafuda_March_Kasu_1.png",
    "3-3": "Hanafuda_March_Kasu_2.png",
    "4-0": "Hanafuda_April_Tane.png",
    "4-1": "Hanafuda_April_Tanzaku.png",
    "4-2": "Hanafuda_April_Kasu_1.png",
    "4-3": "Hanafuda_April_Kasu_2.png",
    "5-0": "Hanafuda_May_Tane.png",
    "5-1": "Hanafuda_May_Tanzaku.png",
    "5-2": "Hanafuda_May_Kasu_1.png",
    "5-3": "Hanafuda_May_Kasu_2.png",
    "6-0": "Hanafuda_June_Tane.png",
    "6-1": "Hanafuda_June_Tanzaku.png",
    "6-2": "Hanafuda_June_Kasu_1.png",
    "6-3": "Hanafuda_June_Kasu_2.png",
    "7-0": "Hanafuda_July_Tane.png",
    "7-1": "Hanafuda_July_Tanzaku.png",
    "7-2": "Hanafuda_July_Kasu_1.png",
    "7-3": "Hanafuda_July_Kasu_2.png",
    "8-0": "Hanafuda_August_Hikari.png",
    "8-1": "Hanafuda_August_Tane.png",
    "8-2": "Hanafuda_August_Kasu_1.png",
    "8-3": "Hanafuda_August_Kasu_2.png",
    "9-0": "Hanafuda_September_Tane.png",
    "9-1": "Hanafuda_September_Tanzaku.png",
    "9-2": "Hanafuda_September_Kasu_1.png",
    "9-3": "Hanafuda_September_Kasu_2.png",
    "10-0": "Hanafuda_October_Tane.png",
    "10-1": "Hanafuda_October_Tanzaku.png",
    "10-2": "Hanafuda_October_Kasu_1.png",
    "10-3": "Hanafuda_October_Kasu_2.png",
  };
  return `https://taeu0102.github.io/steal-bomb-game/assets/hanafuda/${fileMap[`${card.month}-${card.variant}`]}`;
}

function hwatuArt(card, mini = false) {
  const view = mini ? 'viewBox="0 0 72 96"' : 'viewBox="0 0 96 132"';
  const scale = mini ? 0.75 : 1;
  if (card.kind === "bomb") {
    return `
      <svg class="hwatu-art bomb-art" ${view} role="img" aria-label="폭탄 카드">
        <rect x="3" y="3" width="${90 * scale}" height="${126 * scale}" rx="${12 * scale}" fill="#ffe3de" stroke="#e2453a" stroke-width="${2 * scale}" />
        <circle cx="${48 * scale}" cy="${50 * scale}" r="${21 * scale}" fill="#2b2929" />
        <circle cx="${40 * scale}" cy="${43 * scale}" r="${6 * scale}" fill="#565050" />
        <path d="M${58 * scale} ${28 * scale} C${68 * scale} ${12 * scale}, ${76 * scale} ${17 * scale}, ${80 * scale} ${24 * scale}" fill="none" stroke="#f4c94d" stroke-width="${5 * scale}" stroke-linecap="round" />
        <path d="M${76 * scale} ${16 * scale} C${90 * scale} ${18 * scale}, ${86 * scale} ${34 * scale}, ${74 * scale} ${30 * scale}Z" fill="#ff7d45" />
        <text x="${48 * scale}" y="${103 * scale}" text-anchor="middle" font-size="${16 * scale}" font-weight="900" fill="#84231d">BOMB</text>
      </svg>
    `;
  }

  const glow = card.gwang
    ? `<circle cx="${74 * scale}" cy="${21 * scale}" r="${12 * scale}" fill="#f4c94d" />
       <path d="M${67 * scale} ${21 * scale}h${14 * scale}M${74 * scale} ${14 * scale}v${14 * scale}" stroke="#fff8df" stroke-width="${2 * scale}" />`
    : "";
  const base = (inner) => `
    <svg class="hwatu-art" ${view} role="img" aria-label="${cardName(card)}">
      <rect x="3" y="3" width="${90 * scale}" height="${126 * scale}" rx="${12 * scale}" fill="#fff7ea" stroke="#d8bf82" stroke-width="${2 * scale}" />
      <rect x="${9 * scale}" y="${9 * scale}" width="${78 * scale}" height="${114 * scale}" rx="${8 * scale}" fill="#fdf4df" />
      ${glow}
      ${inner}
      <text x="${18 * scale}" y="${118 * scale}" text-anchor="middle" font-size="${14 * scale}" font-weight="900" fill="#2b7669">${card.month}</text>
    </svg>
  `;

  const m = card.month;
  if (m === 1) {
    return base(`
      <circle cx="${68 * scale}" cy="${27 * scale}" r="${13 * scale}" fill="#d94335" />
      <path d="M${22 * scale} ${111 * scale} C${27 * scale} ${72 * scale}, ${34 * scale} ${38 * scale}, ${46 * scale} ${18 * scale}" stroke="#2f3f2f" stroke-width="${7 * scale}" fill="none" stroke-linecap="round" />
      <path d="M${33 * scale} ${53 * scale} C${18 * scale} ${43 * scale}, ${20 * scale} ${28 * scale}, ${39 * scale} ${32 * scale}" stroke="#2f7d42" stroke-width="${8 * scale}" fill="none" stroke-linecap="round" />
      <path d="M${40 * scale} ${68 * scale} C${59 * scale} ${61 * scale}, ${64 * scale} ${43 * scale}, ${47 * scale} ${36 * scale}" stroke="#246b36" stroke-width="${8 * scale}" fill="none" stroke-linecap="round" />
    `);
  }
  if (m === 2) {
    return base(`
      <path d="M${20 * scale} ${114 * scale} C${31 * scale} ${78 * scale}, ${40 * scale} ${42 * scale}, ${58 * scale} ${20 * scale}" stroke="#4f3325" stroke-width="${6 * scale}" fill="none" stroke-linecap="round" />
      ${flower(40, 58, "#df4d72", scale)}
      ${flower(55, 40, "#df4d72", scale)}
      ${flower(31, 78, "#f06c8f", scale)}
      <path d="M${54 * scale} ${82 * scale} C${70 * scale} ${78 * scale}, ${76 * scale} ${89 * scale}, ${62 * scale} ${96 * scale}" stroke="#2f7d42" stroke-width="${5 * scale}" fill="none" stroke-linecap="round" />
    `);
  }
  if (m === 3) {
    return base(`
      <rect x="${17 * scale}" y="${21 * scale}" width="${48 * scale}" height="${19 * scale}" rx="${3 * scale}" fill="#db4a3e" />
      <path d="M${21 * scale} ${40 * scale}h${40 * scale}" stroke="#f4c94d" stroke-width="${4 * scale}" />
      <path d="M${29 * scale} ${112 * scale} C${33 * scale} ${76 * scale}, ${47 * scale} ${53 * scale}, ${70 * scale} ${33 * scale}" stroke="#513c2d" stroke-width="${5 * scale}" fill="none" stroke-linecap="round" />
      ${flower(42, 65, "#f5a8be", scale)}
      ${flower(58, 52, "#f5a8be", scale)}
      ${flower(34, 82, "#f7b9c9", scale)}
    `);
  }
  if (m === 4) {
    return base(`
      <path d="M${67 * scale} ${22 * scale} C${52 * scale} ${47 * scale}, ${48 * scale} ${76 * scale}, ${36 * scale} ${112 * scale}" stroke="#5a3a22" stroke-width="${6 * scale}" fill="none" stroke-linecap="round" />
      ${droop(56, 42, scale)}
      ${droop(45, 59, scale)}
      ${droop(38, 76, scale)}
      <path d="M${54 * scale} ${34 * scale} C${72 * scale} ${41 * scale}, ${78 * scale} ${55 * scale}, ${64 * scale} ${62 * scale}" stroke="#2f7d42" stroke-width="${5 * scale}" fill="none" stroke-linecap="round" />
    `);
  }
  if (m === 5) {
    return base(`
      <path d="M${16 * scale} ${106 * scale} C${36 * scale} ${95 * scale}, ${56 * scale} ${99 * scale}, ${82 * scale} ${89 * scale}" stroke="#4d8cc4" stroke-width="${8 * scale}" fill="none" stroke-linecap="round" />
      <path d="M${27 * scale} ${110 * scale} C${31 * scale} ${74 * scale}, ${35 * scale} ${47 * scale}, ${41 * scale} ${24 * scale}" stroke="#2f7d42" stroke-width="${5 * scale}" fill="none" stroke-linecap="round" />
      <path d="M${55 * scale} ${110 * scale} C${55 * scale} ${78 * scale}, ${58 * scale} ${52 * scale}, ${67 * scale} ${28 * scale}" stroke="#2f7d42" stroke-width="${5 * scale}" fill="none" stroke-linecap="round" />
      ${iris(42, 31, scale)}
      ${iris(67, 36, scale)}
    `);
  }
  if (m === 6) {
    return base(`
      <path d="M${21 * scale} ${112 * scale} C${28 * scale} ${81 * scale}, ${44 * scale} ${57 * scale}, ${66 * scale} ${33 * scale}" stroke="#5a3a22" stroke-width="${5 * scale}" fill="none" stroke-linecap="round" />
      ${bigFlower(47, 62, "#d94f6d", scale)}
      ${bigFlower(63, 42, "#e86f86", scale)}
      <path d="M${28 * scale} ${33 * scale} C${42 * scale} ${17 * scale}, ${54 * scale} ${24 * scale}, ${46 * scale} ${39 * scale}Z" fill="#2f7d42" />
    `);
  }
  if (m === 7) {
    return base(`
      <path d="M${17 * scale} ${108 * scale} C${31 * scale} ${72 * scale}, ${50 * scale} ${45 * scale}, ${77 * scale} ${28 * scale}" stroke="#5a3a22" stroke-width="${5 * scale}" fill="none" stroke-linecap="round" />
      <path d="M${33 * scale} ${88 * scale} C${18 * scale} ${71 * scale}, ${23 * scale} ${56 * scale}, ${44 * scale} ${62 * scale}" fill="#7e3f7f" />
      <path d="M${50 * scale} ${67 * scale} C${38 * scale} ${50 * scale}, ${45 * scale} ${36 * scale}, ${65 * scale} ${43 * scale}" fill="#9a4d9f" />
      <ellipse cx="${70 * scale}" cy="${82 * scale}" rx="${12 * scale}" ry="${8 * scale}" fill="#6b4030" />
      <path d="M${58 * scale} ${82 * scale}l${-7 * scale} ${-6 * scale}M${80 * scale} ${82 * scale}l${5 * scale} ${-5 * scale}" stroke="#3a261d" stroke-width="${2 * scale}" />
    `);
  }
  if (m === 8) {
    return base(`
      <circle cx="${62 * scale}" cy="${32 * scale}" r="${19 * scale}" fill="#f0d36a" />
      <path d="M${20 * scale} ${111 * scale} C${25 * scale} ${78 * scale}, ${31 * scale} ${49 * scale}, ${39 * scale} ${26 * scale}" stroke="#80764e" stroke-width="${5 * scale}" fill="none" stroke-linecap="round" />
      <path d="M${42 * scale} ${112 * scale} C${46 * scale} ${79 * scale}, ${53 * scale} ${57 * scale}, ${68 * scale} ${36 * scale}" stroke="#8b7b4f" stroke-width="${5 * scale}" fill="none" stroke-linecap="round" />
      <path d="M${30 * scale} ${44 * scale} C${16 * scale} ${36 * scale}, ${17 * scale} ${24 * scale}, ${36 * scale} ${28 * scale}" fill="#d7c991" />
      <path d="M${56 * scale} ${59 * scale} C${73 * scale} ${51 * scale}, ${76 * scale} ${39 * scale}, ${60 * scale} ${42 * scale}" fill="#d7c991" />
    `);
  }
  if (m === 9) {
    return base(`
      <path d="M${22 * scale} ${112 * scale} C${33 * scale} ${78 * scale}, ${45 * scale} ${50 * scale}, ${59 * scale} ${25 * scale}" stroke="#4b6f35" stroke-width="${5 * scale}" fill="none" stroke-linecap="round" />
      ${bigFlower(43, 61, "#d8b23f", scale)}
      ${bigFlower(61, 42, "#e4c762", scale)}
      <path d="M${56 * scale} ${91 * scale}h${23 * scale}l${-5 * scale} ${15 * scale}h${-13 * scale}z" fill="#db4a3e" stroke="#823227" stroke-width="${2 * scale}" />
      <path d="M${59 * scale} ${95 * scale}h${16 * scale}" stroke="#f8e7ca" stroke-width="${2 * scale}" />
    `);
  }
  return base(`
    <path d="M${20 * scale} ${112 * scale} C${34 * scale} ${78 * scale}, ${49 * scale} ${52 * scale}, ${73 * scale} ${25 * scale}" stroke="#4f3325" stroke-width="${5 * scale}" fill="none" stroke-linecap="round" />
    ${maple(40, 70, "#d64c33", scale)}
    ${maple(58, 48, "#c33d2f", scale)}
    ${maple(69, 80, "#e07a33", scale)}
    <path d="M${31 * scale} ${36 * scale} C${51 * scale} ${20 * scale}, ${69 * scale} ${28 * scale}, ${58 * scale} ${45 * scale}" fill="#6b4030" />
    <path d="M${33 * scale} ${36 * scale}l${-9 * scale} ${-6 * scale}M${57 * scale} ${43 * scale}l${9 * scale} ${-6 * scale}" stroke="#3a261d" stroke-width="${2 * scale}" />
  `);
}

function flower(x, y, color, scale) {
  const sx = x * scale;
  const sy = y * scale;
  const r = 5 * scale;
  return `
    <circle cx="${sx}" cy="${sy - r}" r="${r}" fill="${color}" />
    <circle cx="${sx + r}" cy="${sy}" r="${r}" fill="${color}" />
    <circle cx="${sx}" cy="${sy + r}" r="${r}" fill="${color}" />
    <circle cx="${sx - r}" cy="${sy}" r="${r}" fill="${color}" />
    <circle cx="${sx}" cy="${sy}" r="${2.2 * scale}" fill="#f6e8a9" />
  `;
}

function bigFlower(x, y, color, scale) {
  const petals = Array.from({ length: 8 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 8;
    const cx = (x + Math.cos(angle) * 9) * scale;
    const cy = (y + Math.sin(angle) * 9) * scale;
    return `<ellipse cx="${cx}" cy="${cy}" rx="${5 * scale}" ry="${9 * scale}" fill="${color}" transform="rotate(${(angle * 180) / Math.PI} ${cx} ${cy})" />`;
  }).join("");
  return `${petals}<circle cx="${x * scale}" cy="${y * scale}" r="${6 * scale}" fill="#f5df7b" />`;
}

function droop(x, y, scale) {
  return `
    <path d="M${x * scale} ${y * scale} C${(x - 5) * scale} ${(y + 14) * scale}, ${(x - 1) * scale} ${(y + 22) * scale}, ${(x - 8) * scale} ${(y + 34) * scale}" stroke="#7d4aa0" stroke-width="${5 * scale}" fill="none" stroke-linecap="round" />
    <circle cx="${(x - 6) * scale}" cy="${(y + 19) * scale}" r="${4 * scale}" fill="#b98add" />
  `;
}

function iris(x, y, scale) {
  return `
    <path d="M${x * scale} ${y * scale} C${(x - 12) * scale} ${(y - 7) * scale}, ${(x - 15) * scale} ${(y + 8) * scale}, ${(x - 3) * scale} ${(y + 9) * scale}Z" fill="#6f54b5" />
    <path d="M${x * scale} ${y * scale} C${(x + 12) * scale} ${(y - 7) * scale}, ${(x + 15) * scale} ${(y + 8) * scale}, ${(x + 3) * scale} ${(y + 9) * scale}Z" fill="#7c63c7" />
    <path d="M${x * scale} ${y * scale} C${(x - 1) * scale} ${(y + 13) * scale}, ${(x + 9) * scale} ${(y + 15) * scale}, ${(x + 7) * scale} ${(y + 2) * scale}Z" fill="#8b70d2" />
  `;
}

function maple(x, y, color, scale) {
  return `
    <path d="M${x * scale} ${(y - 16) * scale}l${5 * scale} ${9 * scale}l${10 * scale} ${-4 * scale}l${-4 * scale} ${9 * scale}l${10 * scale} ${4 * scale}l${-10 * scale} ${4 * scale}l${4 * scale} ${10 * scale}l${-11 * scale} ${-4 * scale}l${-4 * scale} ${11 * scale}l${-4 * scale} ${-11 * scale}l${-11 * scale} ${4 * scale}l${4 * scale} ${-10 * scale}l${-10 * scale} ${-4 * scale}l${10 * scale} ${-4 * scale}l${-4 * scale} ${-9 * scale}l${10 * scale} ${4 * scale}z" fill="${color}" />
  `;
}

function shortCardName(card) {
  if (!card) return "없음";
  if (card.kind === "bomb") return "폭탄";
  return `${card.month}월`;
}

function resultHTML(result, index) {
  const handText = result.player.hand.map((slot) => cardName(slot.card)).join(" / ");
  return `
    <div class="result-row ${result.hasBomb ? "bombed" : ""}">
      <span class="result-rank">${index + 1}위</span>
      <strong>${result.player.name}</strong>
      <span>${handText}</span>
      <b>${result.hasBomb ? "폭탄 최하위" : result.best.label}</b>
    </div>
  `;
}

el.newGameBtn.addEventListener("click", newGame);
el.primaryAction.addEventListener("click", runCurrentTurn);
el.fastAction.addEventListener("click", autoUntilHumanChoice);
el.closeModalBtn.addEventListener("click", () => {
  if (state.phase === "finished") {
    el.choiceModal.classList.add("hidden");
  }
});
el.modalCards.addEventListener("click", (event) => {
  const stealButton = event.target.closest("[data-steal-index]");
  if (stealButton) {
    startHumanSteal(Number(stealButton.dataset.stealIndex));
    return;
  }

  const openButton = event.target.closest("[data-open-index]");
  if (openButton) {
    chooseHumanOpen(Number(openButton.dataset.openIndex));
    return;
  }

  const replaceButton = event.target.closest("[data-replace-action]");
  if (replaceButton) {
    chooseReplaceDecision(replaceButton.dataset.replaceAction === "replace");
    return;
  }

  const returnButton = event.target.closest("[data-return-index]");
  if (returnButton) {
    finishHumanSteal(Number(returnButton.dataset.returnIndex));
  }
});

newGame();
