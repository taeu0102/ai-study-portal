const SEED_MONEY = 10000;
const STEP = 100;

const scenarios = [
  {
    name: "반도체 강세장",
    note: "AI 서버 투자 확대로 반도체 팹과 반도체 ETF 단지가 도시 생산성을 끌어올립니다.",
    sectors: {
      semiconductor: 2.8,
      manufacturing: -0.6,
      heavy: 0.4,
      shipbuilding: -0.3,
      energy: 1.1,
      etf: 1.3,
      stable: 0.1,
    },
  },
  {
    name: "금리 경계",
    note: "성장 섹터의 밸류에이션 부담이 커지고 현금성 자산의 완충력이 커집니다.",
    sectors: {
      semiconductor: -1.4,
      manufacturing: 0.8,
      heavy: 0.3,
      shipbuilding: 0.6,
      energy: -0.2,
      etf: -0.6,
      stable: 0.2,
    },
  },
  {
    name: "조선 수주 랠리",
    note: "LNG선과 해양 플랜트 수주 기대가 조선소와 중공업 지구의 가동률을 높입니다.",
    sectors: {
      semiconductor: 0.5,
      manufacturing: 1.2,
      heavy: 2.1,
      shipbuilding: 3.3,
      energy: 1.4,
      etf: 0.9,
      stable: 0.1,
    },
  },
  {
    name: "제조업 회복",
    note: "수출과 설비투자 기대가 제조 공장, 중공업, 시장 ETF를 고르게 밀어 올립니다.",
    sectors: {
      semiconductor: 1.1,
      manufacturing: 2.4,
      heavy: 1.6,
      shipbuilding: 0.7,
      energy: -0.7,
      etf: 1.2,
      stable: 0.1,
    },
  },
];

const sectorLabels = {
  semiconductor: "반도체",
  manufacturing: "제조업",
  heavy: "중공업",
  shipbuilding: "조선업",
  energy: "에너지",
  etf: "ETF",
  stable: "안정자산",
};

const assets = [
  {
    id: "cash",
    name: "현금 금고",
    ticker: "CASH",
    sector: "stable",
    building: "중앙 금고",
    icon: "landmark",
    visual: "vault",
    basePrice: 100,
    amount: 1200,
    alpha: 0,
    reason: "하락장에서 운영 자금 감소를 완충하는 도시의 기본 안전판입니다.",
  },
  {
    id: "samsung",
    name: "삼성전자",
    ticker: "005930",
    sector: "semiconductor",
    building: "반도체 공장",
    icon: "cpu",
    visual: "chip",
    basePrice: 83600,
    amount: 1900,
    alpha: 0.2,
    reason: "메모리 가격과 AI 서버 수요가 공장 가동률을 좌우합니다.",
  },
  {
    id: "skhynix",
    name: "SK하이닉스",
    ticker: "000660",
    sector: "semiconductor",
    building: "HBM 팹",
    icon: "microchip",
    visual: "hbm",
    basePrice: 218500,
    amount: 1300,
    alpha: 0.5,
    reason: "HBM 공급 기대가 커질수록 고층 생산동으로 확장되는 구조입니다.",
  },
  {
    id: "hyundai",
    name: "현대차",
    ticker: "005380",
    sector: "manufacturing",
    building: "제조 공장",
    icon: "factory",
    visual: "manufacturing",
    basePrice: 246000,
    amount: 900,
    alpha: 0.1,
    reason: "환율, 판매량, 전기차 마진 변화가 도시 물류 수입에 반영됩니다.",
  },
  {
    id: "posco",
    name: "POSCO홀딩스",
    ticker: "005490",
    sector: "heavy",
    building: "제철소",
    icon: "hammer",
    visual: "heavy",
    basePrice: 386000,
    amount: 900,
    alpha: 0.2,
    reason: "철강 가격, 원재료비, 인프라 투자 기대가 제철소의 열기와 생산량으로 반영됩니다.",
  },
  {
    id: "shipyard",
    name: "HD현대중공업",
    ticker: "329180",
    sector: "shipbuilding",
    building: "조선소",
    icon: "ship",
    visual: "shipyard",
    basePrice: 151000,
    amount: 800,
    alpha: 0.3,
    reason: "선박 수주, 운임, 해양 플랜트 기대가 도크와 크레인 가동률을 바꿉니다.",
  },
  {
    id: "tigersemi",
    name: "TIGER 반도체 ETF",
    ticker: "091230",
    sector: "etf",
    building: "반도체 산업단지",
    icon: "factory",
    visual: "complex",
    basePrice: 42800,
    amount: 1100,
    alpha: 0.1,
    reason: "개별 종목보다 넓은 반도체 밸류체인 흐름을 도시 단지로 보여줍니다.",
  },
  {
    id: "kodex200",
    name: "KODEX 200",
    ticker: "069500",
    sector: "etf",
    building: "시장 복합지구",
    icon: "blocks",
    visual: "market",
    basePrice: 39200,
    amount: 1000,
    alpha: 0,
    reason: "시장 전체 체력을 반영하는 중심 상권 역할을 합니다.",
  },
  {
    id: "energy",
    name: "한화솔루션",
    ticker: "009830",
    sector: "energy",
    building: "에너지 플랜트",
    icon: "zap",
    visual: "energy",
    basePrice: 31200,
    amount: 900,
    alpha: 0.3,
    reason: "태양광, 전력망, 원자재 이슈가 발전소 매출로 연결됩니다.",
  },
];

const presets = {
  balanced: {
    cash: 1200,
    samsung: 1900,
    skhynix: 1300,
    hyundai: 900,
    posco: 900,
    shipyard: 800,
    tigersemi: 1100,
    kodex200: 1000,
    energy: 900,
  },
  growth: {
    cash: 500,
    samsung: 2300,
    skhynix: 1800,
    hyundai: 900,
    posco: 600,
    shipyard: 500,
    tigersemi: 1300,
    kodex200: 800,
    energy: 1300,
  },
  defense: {
    cash: 2600,
    samsung: 1200,
    skhynix: 700,
    hyundai: 700,
    posco: 1100,
    shipyard: 900,
    tigersemi: 700,
    kodex200: 1500,
    energy: 600,
  },
};

const state = {
  day: 0,
  selectedAssetId: "samsung",
};

const els = {
  marketName: document.querySelector("#marketName"),
  marketPulse: document.querySelector("#marketPulse"),
  cityLevel: document.querySelector("#cityLevel"),
  cityStatus: document.querySelector("#cityStatus"),
  capitalArc: document.querySelector("#capitalArc"),
  investedRate: document.querySelector("#investedRate"),
  seedMoney: document.querySelector("#seedMoney"),
  investedMoney: document.querySelector("#investedMoney"),
  cashMoney: document.querySelector("#cashMoney"),
  dailyPnl: document.querySelector("#dailyPnl"),
  allocationHint: document.querySelector("#allocationHint"),
  assetList: document.querySelector("#assetList"),
  operatingFunds: document.querySelector("#operatingFunds"),
  turnNumber: document.querySelector("#turnNumber"),
  cityGrade: document.querySelector("#cityGrade"),
  buildingCount: document.querySelector("#buildingCount"),
  scenarioTabs: document.querySelector("#scenarioTabs"),
  cityMap: document.querySelector("#cityMap"),
  sectorStrip: document.querySelector("#sectorStrip"),
  buildingDetail: document.querySelector("#buildingDetail"),
  flowLabel: document.querySelector("#flowLabel"),
  flowList: document.querySelector("#flowList"),
  reportDate: document.querySelector("#reportDate"),
  reportList: document.querySelector("#reportList"),
  nextMarketDay: document.querySelector("#nextMarketDay"),
  toast: document.querySelector("#toast"),
};

function getScenario(offset = 0) {
  const index = (state.day + offset + scenarios.length) % scenarios.length;
  return scenarios[index];
}

function getReturn(asset, offset = 0) {
  return (getScenario(offset).sectors[asset.sector] ?? 0) + (asset.alpha ?? 0);
}

function getAllocatedTotal() {
  return assets.reduce((sum, asset) => sum + asset.amount, 0);
}

function getCashTotal() {
  const cashAsset = assets.find((asset) => asset.id === "cash");
  return cashAsset.amount + Math.max(SEED_MONEY - getAllocatedTotal(), 0);
}

function getInvestedTotal() {
  return assets
    .filter((asset) => asset.id !== "cash")
    .reduce((sum, asset) => sum + asset.amount, 0);
}

function getDailyPnl() {
  const assetPnl = assets.reduce((sum, asset) => sum + asset.amount * (getReturn(asset) / 100), 0);
  const idleCash = Math.max(SEED_MONEY - getAllocatedTotal(), 0);
  return assetPnl + idleCash * (getScenario().sectors.stable / 100);
}

function getCityGrade(operating) {
  const activeLots = assets.filter((asset) => asset.amount > 0).length;
  const maxWeight = Math.max(...assets.map((asset) => asset.amount)) / SEED_MONEY;
  if (operating >= 10300 && activeLots >= 8 && maxWeight < 0.24) return "A";
  if (operating >= 10000 && activeLots >= 7) return "B";
  if (operating >= 9700) return "C";
  return "D";
}

function getSelectedAsset() {
  return assets.find((asset) => asset.id === state.selectedAssetId) || assets[1];
}

function money(value) {
  return `${Math.round(value).toLocaleString("ko-KR")}만원`;
}

function percent(value) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

function impactClass(value) {
  return value >= 0 ? "positive" : "negative";
}

function formatPrice(value) {
  if (value >= 1000) return `${Math.round(value).toLocaleString("ko-KR")}원`;
  return `${value.toFixed(1)}원`;
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value ?? "";
  return div.innerHTML;
}

function tierForAmount(amount) {
  if (amount >= 1500) return 3;
  if (amount >= 700) return 2;
  return 1;
}

function statusForReturn(value) {
  if (value >= 1.5) return { label: "증설", className: "good" };
  if (value <= -1) return { label: "감산", className: "bad" };
  return { label: "정상 가동", className: "warn" };
}

function renderBuildingArt(visual, ticker = "") {
  const label = escapeHtml(ticker);
  const common = 'class="building-art" viewBox="0 0 180 150" aria-hidden="true" focusable="false"';

  if (visual === "cityhall") {
    return `
      <svg ${common}>
        <path class="ground" d="M19 118 L90 84 L161 118 L90 146 Z" />
        <path class="road" d="M78 134 L90 112 L102 134 L90 146 Z" />
        <rect class="hall-base" x="46" y="64" width="88" height="52" rx="8" />
        <rect class="hall-wing" x="31" y="78" width="32" height="34" rx="6" />
        <rect class="hall-wing" x="117" y="78" width="32" height="34" rx="6" />
        <path class="hall-roof" d="M37 66 L90 34 L143 66 Z" />
        <rect class="hall-tower" x="76" y="38" width="28" height="78" rx="6" />
        <circle class="clock" cx="90" cy="58" r="8" />
        <path class="flag-pole" d="M104 37 V17" />
        <path class="flag" d="M106 18 H132 L126 30 H106 Z" />
        <path class="pillars" d="M57 79 V111 M75 75 V111 M90 73 V111 M105 75 V111 M123 79 V111" />
      </svg>
    `;
  }

  if (visual === "chip") {
    return `
      <svg ${common}>
        <path class="ground" d="M18 119 L91 84 L162 119 L90 146 Z" />
        <rect class="factory" x="36" y="57" width="108" height="60" rx="12" />
        <rect class="chip-core" x="55" y="67" width="70" height="39" rx="5" />
        <path class="chip-lines" d="M46 72 H28 M46 85 H25 M46 99 H28 M134 72 H152 M134 85 H155 M134 99 H152 M61 58 V42 M76 58 V38 M91 58 V42 M106 58 V38 M121 58 V42" />
        <path class="circuit" d="M64 80 H84 V73 H106 M64 94 H93 V101 H115" />
        <rect class="label-plate" x="64" y="110" width="52" height="20" rx="5" />
        <text x="90" y="124" text-anchor="middle">${label}</text>
      </svg>
    `;
  }

  if (visual === "hbm") {
    return `
      <svg ${common}>
        <path class="ground" d="M20 119 L91 84 L160 119 L90 146 Z" />
        <rect class="memory memory-back" x="42" y="42" width="36" height="82" rx="7" />
        <rect class="memory memory-mid" x="72" y="32" width="36" height="92" rx="7" />
        <rect class="memory memory-front" x="103" y="49" width="34" height="75" rx="7" />
        <path class="stack-lines" d="M48 58 H72 M48 74 H72 M48 90 H72 M48 106 H72 M78 49 H102 M78 65 H102 M78 81 H102 M78 97 H102 M109 64 H131 M109 80 H131 M109 96 H131" />
        <path class="pins" d="M38 126 H142 M49 130 V138 M67 130 V138 M85 130 V138 M103 130 V138 M121 130 V138" />
        <rect class="label-plate" x="64" y="110" width="52" height="20" rx="5" />
        <text x="90" y="124" text-anchor="middle">${label}</text>
      </svg>
    `;
  }

  if (visual === "manufacturing") {
    return `
      <svg ${common}>
        <path class="ground" d="M19 120 L90 84 L161 120 L91 146 Z" />
        <path class="factory-roof" d="M35 75 H55 L55 55 L78 75 H91 L91 55 L114 75 H145 V119 H35 Z" />
        <rect class="factory-front" x="42" y="82" width="96" height="39" rx="8" />
        <path class="windows" d="M54 94 H75 M86 94 H107 M118 94 H130" />
        <path class="conveyor" d="M47 124 H136" />
        <circle class="wheel" cx="64" cy="124" r="5" />
        <circle class="wheel" cx="119" cy="124" r="5" />
        <path class="arm" d="M124 70 L145 54 L153 62 L136 82" />
        <rect class="label-plate" x="64" y="110" width="52" height="20" rx="5" />
        <text x="90" y="124" text-anchor="middle">${label}</text>
      </svg>
    `;
  }

  if (visual === "heavy") {
    return `
      <svg ${common}>
        <path class="ground" d="M18 120 L90 84 L162 120 L91 146 Z" />
        <rect class="steel-base" x="43" y="77" width="86" height="45" rx="8" />
        <path class="furnace" d="M65 41 H101 L112 122 H54 Z" />
        <rect class="chimney" x="115" y="36" width="22" height="84" rx="8" />
        <rect class="chimney thin" x="42" y="54" width="16" height="65" rx="7" />
        <path class="smoke" d="M124 29 C117 21 127 14 137 20 M48 47 C40 40 48 31 58 37" />
        <path class="molten" d="M71 96 C82 91 94 100 105 94 V119 H71 Z" />
        <rect class="label-plate" x="64" y="110" width="52" height="20" rx="5" />
        <text x="90" y="124" text-anchor="middle">${label}</text>
      </svg>
    `;
  }

  if (visual === "shipyard") {
    return `
      <svg ${common}>
        <path class="water-ground" d="M18 120 L90 84 L162 120 L91 146 Z" />
        <path class="dock" d="M36 105 H144 L133 132 H49 Z" />
        <path class="ship" d="M48 94 H129 L113 121 H62 Z" />
        <path class="ship-deck" d="M68 79 H105 L116 94 H56 Z" />
        <path class="crane" d="M42 34 V104 M42 38 H126 M102 38 V82" />
        <path class="hook" d="M102 82 V94 C102 101 112 101 112 94" />
        <path class="waves" d="M35 135 C47 128 59 142 71 135 C83 128 95 142 107 135 C119 128 131 142 143 135" />
        <rect class="label-plate" x="64" y="110" width="52" height="20" rx="5" />
        <text x="90" y="124" text-anchor="middle">${label}</text>
      </svg>
    `;
  }

  if (visual === "energy") {
    return `
      <svg ${common}>
        <path class="ground" d="M19 120 L90 84 L161 120 L91 146 Z" />
        <path class="cooling" d="M103 44 H139 C132 72 132 96 143 124 H99 C111 96 111 72 103 44 Z" />
        <rect class="plant" x="42" y="75" width="64" height="48" rx="9" />
        <path class="solar" d="M29 97 L77 82 L97 96 L50 114 Z M43 101 L87 88 M56 94 L77 108" />
        <path class="bolt" d="M82 42 L65 76 H80 L69 104 L100 63 H84 Z" />
        <path class="steam" d="M119 36 C110 27 120 18 132 25 M136 35 C127 27 139 17 148 25" />
        <rect class="label-plate" x="64" y="110" width="52" height="20" rx="5" />
        <text x="90" y="124" text-anchor="middle">${label}</text>
      </svg>
    `;
  }

  if (visual === "complex") {
    return `
      <svg ${common}>
        <path class="ground" d="M18 120 L90 84 L162 120 L91 146 Z" />
        <rect class="complex-tower a" x="37" y="66" width="38" height="57" rx="8" />
        <rect class="complex-tower b" x="72" y="43" width="42" height="80" rx="8" />
        <rect class="complex-tower c" x="111" y="73" width="31" height="50" rx="7" />
        <path class="complex-lines" d="M47 78 H66 M47 91 H66 M47 104 H66 M82 58 H104 M82 72 H104 M82 86 H104 M82 100 H104 M119 86 H136 M119 99 H136" />
        <path class="connector" d="M56 127 H130 M77 119 L92 108 L112 119" />
        <rect class="label-plate" x="64" y="110" width="52" height="20" rx="5" />
        <text x="90" y="124" text-anchor="middle">${label}</text>
      </svg>
    `;
  }

  return `
    <svg ${common}>
      <path class="ground" d="M18 120 L90 84 L162 120 L91 146 Z" />
      <rect class="market-block a" x="43" y="75" width="32" height="50" rx="8" />
      <rect class="market-block b" x="78" y="48" width="36" height="77" rx="8" />
      <rect class="market-block c" x="118" y="65" width="26" height="60" rx="8" />
      <path class="market-windows" d="M52 87 H66 M52 101 H66 M87 62 H105 M87 76 H105 M87 90 H105 M87 104 H105 M125 78 H137 M125 92 H137 M125 106 H137" />
      <path class="plaza" d="M49 132 H133 M64 132 C71 119 109 119 116 132" />
      <rect class="label-plate" x="64" y="110" width="52" height="20" rx="5" />
      <text x="90" y="124" text-anchor="middle">${label}</text>
    </svg>
  `;
}

function render() {
  const scenario = getScenario();
  const allocated = getAllocatedTotal();
  const invested = getInvestedTotal();
  const cash = getCashTotal();
  const pnl = getDailyPnl();
  const operating = SEED_MONEY + pnl;
  const investedRate = Math.min(allocated / SEED_MONEY, 1);

  els.marketName.textContent = scenario.name;
  els.marketPulse.textContent = `도시 생산성 ${percent((pnl / SEED_MONEY) * 100)}`;
  els.cityLevel.textContent = operating >= 10500 ? "시청 Lv.3" : operating >= 10000 ? "시청 Lv.2" : "시청 Lv.1";
  els.cityStatus.textContent = pnl >= 0 ? "운영 자금 증가" : "운영 자금 방어";
  els.seedMoney.textContent = money(SEED_MONEY);
  els.investedMoney.textContent = money(invested);
  els.cashMoney.textContent = money(cash);
  els.dailyPnl.textContent = `${pnl >= 0 ? "+" : ""}${money(pnl)}`;
  els.dailyPnl.className = impactClass(pnl);
  els.operatingFunds.textContent = money(operating);
  els.turnNumber.textContent = `DAY ${String(state.day + 1).padStart(2, "0")}`;
  els.cityGrade.textContent = `${getCityGrade(operating)} RANK`;
  els.buildingCount.textContent = `${assets.filter((asset) => asset.amount > 0).length}동`;
  els.investedRate.textContent = `${Math.round(investedRate * 100)}%`;
  els.capitalArc.style.strokeDashoffset = String(301 * (1 - investedRate));
  els.allocationHint.textContent = `${money(SEED_MONEY)} 기준`;
  els.reportDate.textContent = `Day ${state.day + 1}`;

  renderScenarioTabs();
  renderAssets();
  renderCity();
  renderSectorStrip();
  renderDetail();
  renderFlow();
  renderReport();
  refreshIcons();
}

function renderScenarioTabs() {
  els.scenarioTabs.innerHTML = scenarios
    .map(
      (scenario, index) => `
        <button class="scenario-tab ${index === state.day ? "is-active" : ""}" type="button" data-scenario="${index}">
          ${escapeHtml(scenario.name)}
        </button>
      `,
    )
    .join("");
}

function renderAssets() {
  els.assetList.innerHTML = assets
    .map((asset) => {
      const weight = (asset.amount / SEED_MONEY) * 100;
      const dailyReturn = getReturn(asset);
      return `
        <article class="asset-card ${asset.id === state.selectedAssetId ? "is-selected" : ""} ${asset.amount === 0 ? "is-empty" : ""}"
          role="button" tabindex="0" data-select-asset="${asset.id}">
          <div class="asset-icon"><i data-lucide="${asset.icon}" aria-hidden="true"></i></div>
          <div class="asset-title">
            <strong>${escapeHtml(asset.name)}</strong>
            <span class="asset-meta">${escapeHtml(sectorLabels[asset.sector])} · ${percent(dailyReturn)}</span>
          </div>
          <div class="asset-actions">
            <button class="mini-button" type="button" data-adjust="${asset.id}:-${STEP}" aria-label="${asset.name} 투자금 줄이기">-</button>
            <span class="amount">${money(asset.amount)}</span>
            <button class="mini-button" type="button" data-adjust="${asset.id}:${STEP}" aria-label="${asset.name} 투자금 늘리기">+</button>
          </div>
          <div class="weight-bar" aria-hidden="true"><span style="width: ${Math.min(weight, 100)}%"></span></div>
        </article>
      `;
    })
    .join("");
}

function renderCity() {
  const cityHall = `
    <button class="lot is-base ${state.selectedAssetId === "cash" ? "is-selected" : ""}" type="button" data-select-asset="cash">
      <span class="tile-ground"></span>
      <div class="building illustration city-hall visual-cityhall">
        <span class="sprite-shadow"></span>
        ${renderBuildingArt("cityhall")}
        <span class="building-chip"><i data-lucide="landmark" aria-hidden="true"></i>시청</span>
      </div>
    </button>
  `;

  const lots = assets
    .filter((asset) => asset.id !== "cash")
    .map((asset, index) => {
      const slotClass = `slot-pos-${index + 1}`;
      if (asset.amount <= 0) {
        return `
          <button class="lot is-empty ${slotClass}" type="button" data-select-asset="${asset.id}">
            <span class="tile-ground"></span>
            <span class="empty-lot"><i aria-hidden="true"></i>${escapeHtml(sectorLabels[asset.sector])} 부지</span>
          </button>
        `;
      }

      const tier = tierForAmount(asset.amount);
      return `
        <button class="lot ${slotClass} ${asset.id === state.selectedAssetId ? "is-selected" : ""}" type="button" data-select-asset="${asset.id}">
          <span class="tile-ground"></span>
          <div class="building illustration tier-${tier} sector-${asset.sector} visual-${asset.visual}">
            <span class="sprite-shadow"></span>
            ${renderBuildingArt(asset.visual, asset.ticker)}
            <span class="building-chip"><i data-lucide="${asset.icon}" aria-hidden="true"></i>${escapeHtml(asset.building)}</span>
          </div>
        </button>
      `;
    })
    .join("");

  const mapDecorations = `
    <span class="map-deco deco-tree deco-tree-1" aria-hidden="true"></span>
    <span class="map-deco deco-tree deco-tree-2" aria-hidden="true"></span>
    <span class="map-deco deco-crane" aria-hidden="true"></span>
    <span class="map-deco deco-water" aria-hidden="true"></span>
  `;

  els.cityMap.innerHTML = cityHall + lots + mapDecorations;
}

function renderSectorStrip() {
  const scenario = getScenario();
  els.sectorStrip.innerHTML = Object.entries(sectorLabels)
    .map(([key, label]) => {
      const value = scenario.sectors[key] ?? 0;
      return `
        <div class="sector-card ${value < 0 ? "is-negative" : ""}">
          <span>${escapeHtml(label)}</span>
          <strong>${percent(value)}</strong>
        </div>
      `;
    })
    .join("");
}

function renderDetail() {
  const asset = getSelectedAsset();
  const currentReturn = getReturn(asset);
  const status = statusForReturn(currentReturn);
  const contribution = asset.amount * (currentReturn / 100);
  const tier = asset.id === "cash" ? "기본 제공" : `Lv.${tierForAmount(asset.amount)}`;

  els.buildingDetail.innerHTML = `
    <div class="detail-header">
      <div class="detail-icon"><i data-lucide="${asset.icon}" aria-hidden="true"></i></div>
      <div>
        <span class="eyebrow">${escapeHtml(asset.ticker)}</span>
        <h3>${escapeHtml(asset.building)}</h3>
      </div>
    </div>
    <div class="detail-meta">
      <span class="badge">${escapeHtml(asset.name)}</span>
      <span class="badge ${status.className}">${status.label}</span>
      <span class="badge">${escapeHtml(sectorLabels[asset.sector])}</span>
    </div>
    <p>${escapeHtml(asset.reason)}</p>
    <div class="status-row">
      <div class="status-card">
        <span>투자 금액</span>
        <strong>${money(asset.amount)}</strong>
      </div>
      <div class="status-card">
        <span>건물 단계</span>
        <strong>${tier}</strong>
      </div>
      <div class="status-card">
        <span>오늘 등락</span>
        <strong class="${impactClass(currentReturn)}">${percent(currentReturn)}</strong>
      </div>
      <div class="status-card">
        <span>운영 영향</span>
        <strong class="${impactClass(contribution)}">${contribution >= 0 ? "+" : ""}${money(contribution)}</strong>
      </div>
    </div>
  `;
}

function renderFlow() {
  const asset = getSelectedAsset();
  els.flowLabel.textContent = `${asset.name} 기준`;

  const rows = [-3, -2, -1, 0].map((offset, index) => {
    const rate = getReturn(asset, offset);
    const close = asset.basePrice * (1 + rate / 100 + index * 0.004);
    const label = offset === 0 ? "현재" : `${Math.abs(offset)}일 전`;
    const width = Math.min(100, Math.max(8, Math.abs(rate) * 24));
    return `
      <div class="flow-item ${rate < 0 ? "is-negative" : ""}">
        <span>${label}</span>
        <div class="flow-bar"><i style="--bar: ${width}%"></i></div>
        <strong class="${impactClass(rate)}">${percent(rate)}</strong>
        <span class="flow-close">${formatPrice(close)}</span>
      </div>
    `;
  });

  els.flowList.innerHTML = rows.join("");
}

function renderReport() {
  const scenario = getScenario();
  const contributions = assets
    .map((asset) => ({
      asset,
      impact: asset.amount * (getReturn(asset) / 100),
      rate: getReturn(asset),
    }))
    .sort((a, b) => b.impact - a.impact);

  const best = contributions[0];
  const worst = contributions[contributions.length - 1];
  const maxWeight = Math.max(...assets.map((asset) => asset.amount)) / SEED_MONEY;
  const cashRatio = getCashTotal() / SEED_MONEY;
  const balanceMessage =
    maxWeight >= 0.28
      ? "한 산업 구역의 비중이 커서 시장 충격이 도시 전체로 빠르게 번질 수 있습니다."
      : "산업 구역이 비교적 고르게 배치되어 변동성이 분산됩니다.";
  const cashMessage =
    cashRatio >= 0.2
      ? "현금성 자산이 충분해 하락장에서 시청 운영비를 버틸 수 있습니다."
      : "현금성 자산이 낮아 급락장에서 추가 방어 건물이 필요할 수 있습니다.";

  els.reportList.innerHTML = `
    <div class="report-item">
      <i data-lucide="trending-up" aria-hidden="true"></i>
      <p><strong>성장 엔진</strong>${escapeHtml(best.asset.building)}이 ${percent(best.rate)}로 ${best.impact >= 0 ? "+" : ""}${money(best.impact)}를 만들었습니다.</p>
    </div>
    <div class="report-item">
      <i data-lucide="triangle-alert" aria-hidden="true"></i>
      <p><strong>부담 구역</strong>${escapeHtml(worst.asset.building)}의 영향은 ${worst.impact >= 0 ? "+" : ""}${money(worst.impact)}입니다.</p>
    </div>
    <div class="report-item">
      <i data-lucide="shield-check" aria-hidden="true"></i>
      <p><strong>도시 안정성</strong>${cashMessage}</p>
    </div>
    <div class="report-item">
      <i data-lucide="map" aria-hidden="true"></i>
      <p><strong>배치 진단</strong>${balanceMessage}</p>
    </div>
    <div class="report-item">
      <i data-lucide="newspaper" aria-hidden="true"></i>
      <p><strong>시장 메모</strong>${escapeHtml(scenario.note)}</p>
    </div>
  `;
}

function adjustAsset(id, delta) {
  const asset = assets.find((item) => item.id === id);
  if (!asset) return;

  if (delta > 0 && getAllocatedTotal() + delta > SEED_MONEY) {
    showToast("시드머니를 초과할 수 없습니다.");
    return;
  }

  asset.amount = Math.max(0, asset.amount + delta);
  state.selectedAssetId = id;
  render();
}

function applyPreset(name) {
  const preset = presets[name];
  if (!preset) return;

  assets.forEach((asset) => {
    asset.amount = preset[asset.id] ?? 0;
  });
  showToast(`${name === "growth" ? "성장형" : name === "defense" ? "방어형" : "균형형"} 도시 배치를 적용했습니다.`);
  render();
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    els.toast.classList.remove("show");
  }, 1800);
}

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

document.addEventListener("click", (event) => {
  const adjustButton = event.target.closest("[data-adjust]");
  if (adjustButton) {
    const [id, delta] = adjustButton.dataset.adjust.split(":");
    adjustAsset(id, Number(delta));
    return;
  }

  const assetTarget = event.target.closest("[data-select-asset]");
  if (assetTarget) {
    state.selectedAssetId = assetTarget.dataset.selectAsset;
    render();
    return;
  }

  const scenarioButton = event.target.closest("[data-scenario]");
  if (scenarioButton) {
    state.day = Number(scenarioButton.dataset.scenario);
    render();
    return;
  }

  const presetButton = event.target.closest("[data-preset]");
  if (presetButton) {
    applyPreset(presetButton.dataset.preset);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const assetTarget = event.target.closest("[data-select-asset]");
  if (!assetTarget) return;
  event.preventDefault();
  state.selectedAssetId = assetTarget.dataset.selectAsset;
  render();
});

els.nextMarketDay.addEventListener("click", () => {
  state.day = (state.day + 1) % scenarios.length;
  showToast(`${getScenario().name}으로 시장이 전환됐습니다.`);
  render();
});

window.addEventListener("load", refreshIcons);

render();
