const SEED_MONEY = 10000;
const STEP = 100;

const scenarios = [
  {
    name: "반도체 강세장",
    note: "AI 서버 투자 확대로 반도체와 관련 ETF가 도시 생산성을 끌어올립니다.",
    sectors: {
      semiconductor: 2.8,
      auto: -0.6,
      energy: 1.1,
      platform: -1.2,
      bio: 0.4,
      etf: 1.3,
      stable: 0.1,
    },
  },
  {
    name: "금리 경계",
    note: "성장 섹터의 밸류에이션 부담이 커지고 현금성 자산의 완충력이 커집니다.",
    sectors: {
      semiconductor: -1.4,
      auto: 0.8,
      energy: -0.2,
      platform: -2.2,
      bio: -0.9,
      etf: -0.6,
      stable: 0.2,
    },
  },
  {
    name: "에너지 순환매",
    note: "유가와 전력망 이슈로 에너지 구역이 확장되고 일부 성장주는 쉬어갑니다.",
    sectors: {
      semiconductor: 0.5,
      auto: 1.7,
      energy: 3.1,
      platform: -0.4,
      bio: 0.2,
      etf: 0.9,
      stable: 0.1,
    },
  },
  {
    name: "시장 회복",
    note: "위험 선호가 회복되며 플랫폼, 바이오, ETF가 고르게 반등합니다.",
    sectors: {
      semiconductor: 1.1,
      auto: 0.9,
      energy: -0.7,
      platform: 2.4,
      bio: 1.6,
      etf: 1.2,
      stable: 0.1,
    },
  },
];

const sectorLabels = {
  semiconductor: "반도체",
  auto: "자동차",
  energy: "에너지",
  platform: "플랫폼",
  bio: "바이오",
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
    basePrice: 83600,
    amount: 2100,
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
    basePrice: 218500,
    amount: 1400,
    alpha: 0.5,
    reason: "HBM 공급 기대가 커질수록 고층 생산동으로 확장되는 구조입니다.",
  },
  {
    id: "hyundai",
    name: "현대차",
    ticker: "005380",
    sector: "auto",
    building: "자동차 공장",
    icon: "car",
    basePrice: 246000,
    amount: 900,
    alpha: 0.1,
    reason: "환율, 판매량, 전기차 마진 변화가 도시 물류 수입에 반영됩니다.",
  },
  {
    id: "tigersemi",
    name: "TIGER 반도체 ETF",
    ticker: "091230",
    sector: "etf",
    building: "반도체 산업단지",
    icon: "factory",
    basePrice: 42800,
    amount: 1200,
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
    basePrice: 31200,
    amount: 800,
    alpha: 0.3,
    reason: "태양광, 전력망, 원자재 이슈가 발전소 매출로 연결됩니다.",
  },
  {
    id: "naver",
    name: "NAVER",
    ticker: "035420",
    sector: "platform",
    building: "데이터 타워",
    icon: "server",
    basePrice: 188000,
    amount: 700,
    alpha: -0.1,
    reason: "광고 경기와 AI 서비스 기대가 데이터 타워의 임대 수익을 바꿉니다.",
  },
  {
    id: "bio",
    name: "삼성바이오로직스",
    ticker: "207940",
    sector: "bio",
    building: "바이오 연구소",
    icon: "flask-conical",
    basePrice: 845000,
    amount: 700,
    alpha: 0.2,
    reason: "수주와 공장 증설 기대가 연구소 레벨을 높입니다.",
  },
];

const presets = {
  balanced: {
    cash: 1200,
    samsung: 2100,
    skhynix: 1400,
    hyundai: 900,
    tigersemi: 1200,
    kodex200: 1000,
    energy: 800,
    naver: 700,
    bio: 700,
  },
  growth: {
    cash: 500,
    samsung: 2300,
    skhynix: 1800,
    hyundai: 700,
    tigersemi: 1300,
    kodex200: 800,
    energy: 900,
    naver: 900,
    bio: 800,
  },
  defense: {
    cash: 2600,
    samsung: 1300,
    skhynix: 800,
    hyundai: 800,
    tigersemi: 900,
    kodex200: 1800,
    energy: 900,
    naver: 400,
    bio: 500,
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
      <div class="building city-hall">
        <div class="building-body"></div>
        <span class="building-chip"><i data-lucide="landmark" aria-hidden="true"></i>시청</span>
      </div>
    </button>
  `;

  const lots = assets
    .filter((asset) => asset.id !== "cash")
    .map((asset) => {
      if (asset.amount <= 0) {
        return `
          <button class="lot is-empty" type="button" data-select-asset="${asset.id}">
            <span class="empty-lot"><i aria-hidden="true"></i>${escapeHtml(sectorLabels[asset.sector])} 부지</span>
          </button>
        `;
      }

      const tier = tierForAmount(asset.amount);
      return `
        <button class="lot ${asset.id === state.selectedAssetId ? "is-selected" : ""}" type="button" data-select-asset="${asset.id}">
          <div class="building tier-${tier} sector-${asset.sector}">
            <div class="building-body"></div>
            <span class="building-chip"><i data-lucide="${asset.icon}" aria-hidden="true"></i>${escapeHtml(asset.building)}</span>
          </div>
        </button>
      `;
    })
    .join("");

  els.cityMap.innerHTML = cityHall + lots;
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
