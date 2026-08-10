const SEED_MONEY = 10000;
const STEP = 100;
const TARGET_ASSET_COUNT = 10;
const MAX_PLAYERS = 8;
const STORAGE_KEYS = {
  muted: "portfolioCitySoundMuted",
};

const appConfig = window.PORTFOLIO_CITY_CONFIG || {};

const scenarios = [
  {
    name: "AI 반도체 강세",
    note: "AI 서버 투자와 고대역폭 메모리 수요가 반도체, 반도체 ETF, 성장주 구역의 생산성을 끌어올립니다.",
    sectors: {
      reserve: 0.18,
      etf: 1.2,
      semiconductor: 2.7,
      manufacturing: 0.2,
      heavy: 0.1,
      shipbuilding: -0.4,
      energy: 0.7,
      platform: 1.0,
      bio: -0.3,
      battery: 0.5,
      finance: 0.2,
      growth: 1.6,
    },
  },
  {
    name: "금리 경계",
    note: "금리 부담이 커지며 고성장 자산은 흔들리고 예금, 국채, 금융 구역의 방어력이 부각됩니다.",
    sectors: {
      reserve: 0.26,
      etf: -0.4,
      semiconductor: -1.2,
      manufacturing: 0.4,
      heavy: 0.7,
      shipbuilding: 0.5,
      energy: 0.1,
      platform: -1.8,
      bio: -0.8,
      battery: -1.0,
      finance: 0.9,
      growth: -1.5,
    },
  },
  {
    name: "제조 사이클 회복",
    note: "수출과 설비투자 기대가 제조업, 중공업, 조선업 건물의 가동률을 높입니다.",
    sectors: {
      reserve: 0.16,
      etf: 0.8,
      semiconductor: 0.5,
      manufacturing: 2.1,
      heavy: 1.8,
      shipbuilding: 2.6,
      energy: 0.6,
      platform: 0.1,
      bio: 0.2,
      battery: 1.1,
      finance: 0.4,
      growth: 0.7,
    },
  },
  {
    name: "에너지 전환",
    note: "전력망, 신재생, 배터리 투자 기대가 커지고 에너지 구역의 운영 수익이 개선됩니다.",
    sectors: {
      reserve: 0.17,
      etf: 0.7,
      semiconductor: 1.0,
      manufacturing: 0.9,
      heavy: 0.5,
      shipbuilding: 0.3,
      energy: 2.5,
      platform: -0.2,
      bio: 0.5,
      battery: 2.0,
      finance: 0.1,
      growth: 1.2,
    },
  },
];

const marketSessions = [
  {
    key: "morning",
    label: "장 시작",
    time: "09:00",
    tone: "아침 안개",
    note: "도시가 밝아지며 첫 주문과 자금 배치가 시작됩니다.",
  },
  {
    key: "noon",
    label: "장 중",
    time: "12:30",
    tone: "정오",
    note: "햇빛이 강해지고 섹터별 수익률 차이가 또렷하게 드러납니다.",
  },
  {
    key: "sunset",
    label: "장 마감",
    time: "15:30",
    tone: "노을",
    note: "노을빛 아래 하루 수익률이 정산되고 랭킹이 확정됩니다.",
  },
];

const sectorLabels = {
  reserve: "예금·국채",
  etf: "ETF",
  semiconductor: "반도체",
  manufacturing: "제조업",
  heavy: "중공업",
  shipbuilding: "조선업",
  energy: "에너지",
  platform: "플랫폼",
  bio: "바이오",
  battery: "배터리",
  finance: "금융",
  growth: "고성장",
};

const riskLabels = {
  reserve: "안정형 예금·국채",
  stable: "안정 투자형",
  balanced: "균형 투자형",
  high: "고수익형",
};

const assetClassLabels = {
  deposit: "예금",
  treasury: "국채",
  etf: "ETF",
  stock: "주식",
};

const searchFilterOptions = [
  { id: "all", label: "전체" },
  { id: "reserve", label: "예금·국채" },
  { id: "stable", label: "안정형" },
  { id: "etf", label: "ETF" },
  { id: "stock", label: "주식" },
  { id: "high", label: "고수익" },
];

const assetUniverse = [
  {
    id: "deposit-kr",
    name: "정기예금 12개월",
    ticker: "DEPOSIT",
    sector: "reserve",
    assetClass: "deposit",
    riskType: "reserve",
    building: "시중은행",
    icon: "landmark",
    visual: "bank",
    basePrice: 100,
    amount: 1000,
    alpha: 0,
    volatility: "낮음",
    tags: ["예금", "현금성", "원화"],
    reason: "원금 안정성을 맡는 기본 건물입니다. 시장이 흔들릴 때 도시 운영 자금의 급격한 감소를 완화합니다.",
  },
  {
    id: "bond-kr",
    name: "한국 국채 3년",
    ticker: "KTB3Y",
    sector: "reserve",
    assetClass: "treasury",
    riskType: "reserve",
    building: "국채 보관소",
    icon: "scroll-text",
    visual: "bond",
    basePrice: 100,
    amount: 1000,
    alpha: 0.02,
    volatility: "낮음",
    tags: ["국채", "채권", "방어"],
    reason: "금리와 경기 방어를 공부하기 위한 국채 슬롯입니다. 수익은 낮지만 랭킹 변동성을 줄입니다.",
  },
  {
    id: "bond-us",
    name: "미국 국채 ETF",
    ticker: "TLT",
    sector: "reserve",
    assetClass: "treasury",
    riskType: "reserve",
    building: "달러 국채청",
    icon: "badge-dollar-sign",
    visual: "treasury",
    basePrice: 92,
    amount: 1000,
    alpha: 0.03,
    volatility: "낮음",
    tags: ["미국채", "달러", "방어"],
    reason: "국내 자산과 다른 방향으로 움직일 수 있는 방어 자산입니다. 환율과 금리 흐름을 함께 보게 만듭니다.",
  },
  {
    id: "kodex200",
    name: "KODEX 200",
    ticker: "069500",
    sector: "etf",
    assetClass: "etf",
    riskType: "stable",
    building: "시장 ETF 지구",
    icon: "blocks",
    visual: "market",
    basePrice: 39200,
    amount: 1000,
    alpha: 0,
    volatility: "보통",
    tags: ["ETF", "코스피", "분산"],
    reason: "시장 전체 체력을 보는 안정 투자형 ETF입니다. 개별 종목보다 넓은 흐름을 보여줍니다.",
  },
  {
    id: "dividend-etf",
    name: "TIGER 배당성장",
    ticker: "211560",
    sector: "etf",
    assetClass: "etf",
    riskType: "stable",
    building: "배당 정원",
    icon: "leaf",
    visual: "complex",
    basePrice: 16800,
    amount: 1000,
    alpha: -0.05,
    volatility: "보통",
    tags: ["ETF", "배당", "안정형"],
    reason: "배당주 묶음을 통해 안정 투자형의 역할을 공부합니다. 급등보다 꾸준한 현금흐름에 초점이 있습니다.",
  },
  {
    id: "samsung",
    name: "삼성전자",
    ticker: "005930",
    sector: "semiconductor",
    assetClass: "stock",
    riskType: "balanced",
    building: "반도체 팹",
    icon: "cpu",
    visual: "chip",
    basePrice: 83600,
    amount: 1300,
    alpha: 0.2,
    volatility: "보통",
    tags: ["반도체", "메모리", "대형주"],
    reason: "메모리 가격과 AI 서버 수요가 도시의 반도체 생산성에 연결됩니다.",
  },
  {
    id: "hyundai",
    name: "현대차",
    ticker: "005380",
    sector: "manufacturing",
    assetClass: "stock",
    riskType: "balanced",
    building: "자동차 공장",
    icon: "factory",
    visual: "manufacturing",
    basePrice: 246000,
    amount: 900,
    alpha: 0.08,
    volatility: "보통",
    tags: ["자동차", "제조", "수출"],
    reason: "환율, 판매량, 전기차 마진 변화가 제조업 구역의 생산성으로 반영됩니다.",
  },
  {
    id: "posco",
    name: "POSCO홀딩스",
    ticker: "005490",
    sector: "heavy",
    assetClass: "stock",
    riskType: "balanced",
    building: "제철소",
    icon: "hammer",
    visual: "heavy",
    basePrice: 386000,
    amount: 800,
    alpha: 0.15,
    volatility: "보통",
    tags: ["철강", "소재", "중공업"],
    reason: "철강 가격, 원재료비, 인프라 투자 기대가 중공업 생산성과 연결됩니다.",
  },
  {
    id: "skhynix",
    name: "SK하이닉스",
    ticker: "000660",
    sector: "semiconductor",
    assetClass: "stock",
    riskType: "high",
    building: "HBM 타워",
    icon: "microchip",
    visual: "hbm",
    basePrice: 218500,
    amount: 1200,
    alpha: 0.55,
    volatility: "높음",
    tags: ["HBM", "AI", "고수익"],
    reason: "HBM 공급 기대가 커질수록 높은 수익을 낼 수 있지만, 반도체 사이클에 민감합니다.",
  },
  {
    id: "shipyard",
    name: "HD현대중공업",
    ticker: "329180",
    sector: "shipbuilding",
    assetClass: "stock",
    riskType: "high",
    building: "조선 도크",
    icon: "ship",
    visual: "shipyard",
    basePrice: 151000,
    amount: 800,
    alpha: 0.35,
    volatility: "높음",
    tags: ["조선", "수주", "고수익"],
    reason: "선박 수주와 운임 기대가 살아날 때 강하게 반응하는 고수익형 구역입니다.",
  },
  {
    id: "tigersemi",
    name: "TIGER 반도체 ETF",
    ticker: "091230",
    sector: "etf",
    assetClass: "etf",
    riskType: "balanced",
    building: "반도체 ETF 바스켓",
    icon: "boxes",
    visual: "complex",
    basePrice: 42800,
    amount: 0,
    alpha: 0.1,
    volatility: "보통",
    tags: ["ETF", "반도체", "분산"],
    reason: "개별 반도체주보다 넓은 공급망 흐름을 확인할 수 있는 ETF 구역입니다.",
  },
  {
    id: "lgenergy",
    name: "LG에너지솔루션",
    ticker: "373220",
    sector: "battery",
    assetClass: "stock",
    riskType: "high",
    building: "배터리 플랜트",
    icon: "battery-charging",
    visual: "energy",
    basePrice: 414000,
    amount: 0,
    alpha: 0.25,
    volatility: "높음",
    tags: ["배터리", "전기차", "고수익"],
    reason: "전기차 수요와 소재 가격 변화에 민감하게 반응하는 성장형 공장입니다.",
  },
  {
    id: "hanwha",
    name: "한화솔루션",
    ticker: "009830",
    sector: "energy",
    assetClass: "stock",
    riskType: "high",
    building: "태양광 발전소",
    icon: "zap",
    visual: "energy",
    basePrice: 31200,
    amount: 0,
    alpha: 0.3,
    volatility: "높음",
    tags: ["에너지", "태양광", "고수익"],
    reason: "태양광과 전력망 투자가 커질 때 도시 에너지 생산성을 높입니다.",
  },
  {
    id: "naver",
    name: "NAVER",
    ticker: "035420",
    sector: "platform",
    assetClass: "stock",
    riskType: "high",
    building: "플랫폼 데이터센터",
    icon: "server",
    visual: "market",
    basePrice: 189000,
    amount: 0,
    alpha: 0.35,
    volatility: "높음",
    tags: ["플랫폼", "AI", "광고"],
    reason: "광고, 커머스, AI 서비스 기대가 수익률을 크게 흔들 수 있는 고수익형 건물입니다.",
  },
  {
    id: "samsungbio",
    name: "삼성바이오로직스",
    ticker: "207940",
    sector: "bio",
    assetClass: "stock",
    riskType: "balanced",
    building: "바이오 랩",
    icon: "flask-conical",
    visual: "manufacturing",
    basePrice: 862000,
    amount: 0,
    alpha: 0.15,
    volatility: "보통",
    tags: ["바이오", "CDMO", "제조"],
    reason: "수주와 공장 가동률이 중요한 바이오 제조형 건물입니다.",
  },
  {
    id: "kbfinance",
    name: "KB금융",
    ticker: "105560",
    sector: "finance",
    assetClass: "stock",
    riskType: "stable",
    building: "금융 본부",
    icon: "landmark",
    visual: "bank",
    basePrice: 82400,
    amount: 0,
    alpha: 0.05,
    volatility: "보통",
    tags: ["금융", "배당", "안정형"],
    reason: "금리와 배당 흐름을 읽기 좋은 안정 투자형 주식입니다.",
  },
  {
    id: "kosdaq150",
    name: "KODEX 코스닥150",
    ticker: "229200",
    sector: "growth",
    assetClass: "etf",
    riskType: "high",
    building: "성장주 타워",
    icon: "chart-no-axes-combined",
    visual: "market",
    basePrice: 13800,
    amount: 0,
    alpha: 0.25,
    volatility: "높음",
    tags: ["ETF", "성장주", "고수익"],
    reason: "중소형 성장주의 넓은 흐름을 따라가며 수익과 변동성이 모두 큰 구역입니다.",
  },
  {
    id: "money-market",
    name: "MMF 단기금융",
    ticker: "MMF",
    sector: "reserve",
    assetClass: "deposit",
    riskType: "reserve",
    building: "단기금융 창고",
    icon: "wallet-cards",
    visual: "bank",
    basePrice: 100,
    amount: 0,
    alpha: 0.01,
    volatility: "낮음",
    tags: ["MMF", "현금성", "방어"],
    reason: "짧은 기간 자금을 보관하는 안정형 슬롯입니다. 공격력은 낮지만 도시 운영을 안정시킵니다.",
  },
];

const presets = {
  balanced: {
    label: "균형형",
    selectedIds: [
      "deposit-kr",
      "bond-kr",
      "bond-us",
      "kodex200",
      "dividend-etf",
      "samsung",
      "hyundai",
      "posco",
      "skhynix",
      "shipyard",
    ],
    amounts: {
      "deposit-kr": 1000,
      "bond-kr": 1000,
      "bond-us": 1000,
      kodex200: 1000,
      "dividend-etf": 1000,
      samsung: 1300,
      hyundai: 900,
      posco: 800,
      skhynix: 1200,
      shipyard: 800,
    },
  },
  growth: {
    label: "성장형",
    selectedIds: [
      "deposit-kr",
      "bond-kr",
      "bond-us",
      "kodex200",
      "samsung",
      "naver",
      "skhynix",
      "lgenergy",
      "hanwha",
      "kosdaq150",
    ],
    amounts: {
      "deposit-kr": 700,
      "bond-kr": 700,
      "bond-us": 600,
      kodex200: 700,
      samsung: 1200,
      naver: 900,
      skhynix: 1700,
      lgenergy: 1100,
      hanwha: 900,
      kosdaq150: 1500,
    },
  },
  defense: {
    label: "방어형",
    selectedIds: [
      "deposit-kr",
      "bond-kr",
      "bond-us",
      "kodex200",
      "dividend-etf",
      "samsung",
      "hyundai",
      "posco",
      "tigersemi",
      "skhynix",
    ],
    amounts: {
      "deposit-kr": 1500,
      "bond-kr": 1400,
      "bond-us": 1300,
      kodex200: 1100,
      "dividend-etf": 1000,
      samsung: 900,
      hyundai: 800,
      posco: 700,
      tigersemi: 700,
      skhynix: 600,
    },
  },
};

const rivalTemplates = [
  {
    id: "rival-alpha",
    name: "알파 도시",
    holdings: makeHoldings(["deposit-kr", "bond-kr", "bond-us", "kodex200", "samsung", "naver", "skhynix", "lgenergy", "hanwha", "kosdaq150"], [700, 700, 600, 700, 1200, 900, 1700, 1100, 900, 1500]),
  },
  {
    id: "rival-value",
    name: "가치 도시",
    holdings: makeHoldings(["deposit-kr", "bond-kr", "bond-us", "kodex200", "dividend-etf", "kbfinance", "hyundai", "posco", "samsungbio", "shipyard"], [1300, 1300, 1100, 1000, 900, 900, 900, 900, 800, 900]),
  },
  {
    id: "rival-factory",
    name: "공업 도시",
    holdings: makeHoldings(["deposit-kr", "bond-kr", "bond-us", "kodex200", "hyundai", "posco", "shipyard", "hanwha", "lgenergy", "tigersemi"], [900, 900, 800, 800, 1100, 1200, 1300, 1000, 1100, 900]),
  },
  {
    id: "rival-defense",
    name: "방어 도시",
    holdings: makeHoldings(["deposit-kr", "bond-kr", "bond-us", "money-market", "kodex200", "dividend-etf", "kbfinance", "samsung", "posco", "skhynix"], [1500, 1400, 1300, 800, 1000, 900, 900, 800, 800, 600]),
  },
  {
    id: "rival-chip",
    name: "칩 시티",
    holdings: makeHoldings(["deposit-kr", "bond-kr", "bond-us", "kodex200", "tigersemi", "samsung", "skhynix", "naver", "lgenergy", "kosdaq150"], [800, 800, 700, 800, 1100, 1500, 1700, 700, 900, 1000]),
  },
  {
    id: "rival-energy",
    name: "전력 도시",
    holdings: makeHoldings(["deposit-kr", "bond-kr", "bond-us", "kodex200", "dividend-etf", "hanwha", "lgenergy", "posco", "shipyard", "skhynix"], [900, 900, 800, 900, 700, 1500, 1400, 800, 900, 1200]),
  },
  {
    id: "rival-market",
    name: "인덱스 도시",
    holdings: makeHoldings(["deposit-kr", "bond-kr", "bond-us", "kodex200", "dividend-etf", "tigersemi", "kosdaq150", "samsung", "hyundai", "skhynix"], [1000, 1000, 900, 1400, 1100, 1000, 900, 900, 800, 1000]),
  },
];

const state = {
  day: 0,
  selectedAssetId: "samsung",
  selectedAssetIds: [...presets.balanced.selectedIds],
  searchQuery: "",
  searchFilter: "all",
  remoteAssets: [],
  searchStatus: appConfig.stockSearchEndpoint ? "API 연결 대기" : "샘플 검색",
  news: {
    assetId: "",
    status: appConfig.newsEndpoint ? "API 연결 대기" : "샘플 뉴스",
    items: [],
    requestId: 0,
  },
  rivals: rivalTemplates.slice(0, 3).map(cloneRival),
};

const sound = {
  context: null,
  muted: localStorage.getItem(STORAGE_KEYS.muted) === "true",
  lastPlayed: {},
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
  ruleSummary: document.querySelector("#ruleSummary"),
  ruleGrid: document.querySelector("#ruleGrid"),
  searchModeLabel: document.querySelector("#searchModeLabel"),
  stockSearchInput: document.querySelector("#stockSearchInput"),
  searchFilters: document.querySelector("#searchFilters"),
  searchResults: document.querySelector("#searchResults"),
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
  newsSourceLabel: document.querySelector("#newsSourceLabel"),
  newsList: document.querySelector("#newsList"),
  flowLabel: document.querySelector("#flowLabel"),
  flowList: document.querySelector("#flowList"),
  playerCountLabel: document.querySelector("#playerCountLabel"),
  addRivalButton: document.querySelector("#addRivalButton"),
  resetRivalsButton: document.querySelector("#resetRivalsButton"),
  rankingList: document.querySelector("#rankingList"),
  reportDate: document.querySelector("#reportDate"),
  reportList: document.querySelector("#reportList"),
  nextMarketDay: document.querySelector("#nextMarketDay"),
  soundToggle: document.querySelector("#soundToggle"),
  timeCycle: document.querySelector("#timeCycle"),
  toast: document.querySelector("#toast"),
};

function makeHoldings(ids, amounts) {
  return ids.map((id, index) => ({ id, amount: amounts[index] ?? 0 }));
}

function cloneRival(template) {
  return {
    id: template.id,
    name: template.name,
    holdings: template.holdings.map((holding) => ({ ...holding })),
  };
}

function getScenario(offset = 0) {
  const index = (state.day + offset + scenarios.length) % scenarios.length;
  return scenarios[index];
}

function getMarketSession(offset = 0) {
  const index = (state.day + offset + marketSessions.length) % marketSessions.length;
  return marketSessions[index];
}

function getAllAssets() {
  const localTickers = new Set(assetUniverse.map((asset) => asset.ticker));
  const uniqueRemoteAssets = state.remoteAssets.filter((asset) => !localTickers.has(asset.ticker));
  return [...assetUniverse, ...uniqueRemoteAssets];
}

function getAssetById(id) {
  return getAllAssets().find((asset) => asset.id === id);
}

function isSelected(id) {
  return state.selectedAssetIds.includes(id);
}

function getSelectedAssets() {
  return state.selectedAssetIds.map(getAssetById).filter(Boolean);
}

function getSelectedAsset() {
  const selected = getAssetById(state.selectedAssetId);
  if (selected && isSelected(selected.id)) return selected;
  const firstSelected = getSelectedAssets()[0] || assetUniverse[0];
  state.selectedAssetId = firstSelected.id;
  return firstSelected;
}

function getReturn(asset, offset = 0) {
  return (getScenario(offset).sectors[asset.sector] ?? 0) + (asset.alpha ?? 0);
}

function getAllocatedTotal(assets = getSelectedAssets()) {
  return assets.reduce((sum, asset) => sum + (asset.amount || 0), 0);
}

function getReserveTotal(assets = getSelectedAssets()) {
  const allocated = getAllocatedTotal(assets);
  const reserveAmount = assets
    .filter((asset) => asset.isDepositOrTreasury || asset.riskType === "reserve")
    .reduce((sum, asset) => sum + (asset.amount || 0), 0);
  return reserveAmount + Math.max(SEED_MONEY - allocated, 0);
}

function getMarketInvestedTotal(assets = getSelectedAssets()) {
  return assets
    .filter((asset) => asset.riskType !== "reserve")
    .reduce((sum, asset) => sum + (asset.amount || 0), 0);
}

function getDailyPnl(assets = getSelectedAssets()) {
  const assetPnl = assets.reduce((sum, asset) => sum + (asset.amount || 0) * (getReturn(asset) / 100), 0);
  const idleCash = Math.max(SEED_MONEY - getAllocatedTotal(assets), 0);
  return assetPnl + idleCash * (getScenario().sectors.reserve / 100);
}

function getRuleStats(assets = getSelectedAssets()) {
  const reserveCount = assets.filter((asset) => asset.isDepositOrTreasury || asset.riskType === "reserve").length;
  const highCount = assets.filter((asset) => asset.riskType === "high").length;
  const stableCount = assets.filter((asset) => asset.riskType === "reserve" || asset.riskType === "stable").length;

  return [
    {
      key: "count",
      label: "종목 수",
      value: `${assets.length}/${TARGET_ASSET_COUNT}`,
      valid: assets.length === TARGET_ASSET_COUNT,
      help: "정확히 10개",
    },
    {
      key: "reserve",
      label: "예금·국채",
      value: `${reserveCount}/3+`,
      valid: reserveCount >= 3,
      help: "최소 3개",
    },
    {
      key: "high",
      label: "고수익형",
      value: `${highCount}/1+`,
      valid: highCount >= 1,
      help: "최소 1개",
    },
    {
      key: "stable",
      label: "안정 투자형",
      value: `${stableCount}/5`,
      valid: stableCount <= 5,
      help: "최대 5개",
    },
  ];
}

function getRuleWarnings() {
  return getRuleStats()
    .filter((rule) => !rule.valid)
    .map((rule) => `${rule.label} ${rule.help}`);
}

function isRuleValid() {
  return getRuleStats().every((rule) => rule.valid);
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

function formatPrice(asset, value) {
  if (asset.assetClass === "deposit" || asset.assetClass === "treasury") {
    return `${value.toFixed(2)}p`;
  }
  if (value >= 1000) return `${Math.round(value).toLocaleString("ko-KR")}원`;
  return `${value.toFixed(1)}원`;
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value ?? "";
  return div.innerHTML;
}

function tierForAmount(amount) {
  if (amount >= 1400) return 3;
  if (amount >= 800) return 2;
  return 1;
}

function statusForReturn(value) {
  if (value >= 1.5) return { label: "강세", className: "good" };
  if (value <= -1) return { label: "약세", className: "bad" };
  return { label: "관망", className: "warn" };
}

function getCityGrade(operating) {
  const selectedAssets = getSelectedAssets();
  const diversity = new Set(selectedAssets.map((asset) => asset.sector)).size;
  const maxWeight = Math.max(...selectedAssets.map((asset) => asset.amount || 0), 0) / SEED_MONEY;
  if (!isRuleValid()) return "READY";
  if (operating >= 10300 && diversity >= 6 && maxWeight < 0.22) return "A";
  if (operating >= 10000 && diversity >= 5) return "B";
  if (operating >= 9700) return "C";
  return "D";
}

function getAssetSearchText(asset) {
  return [asset.name, asset.ticker, sectorLabels[asset.sector], assetClassLabels[asset.assetClass], riskLabels[asset.riskType], ...(asset.tags || [])]
    .join(" ")
    .toLowerCase();
}

function matchesFilter(asset) {
  if (state.searchFilter === "all") return true;
  if (state.searchFilter === "reserve") return asset.riskType === "reserve";
  if (state.searchFilter === "stable") return asset.riskType === "reserve" || asset.riskType === "stable";
  if (state.searchFilter === "etf") return asset.assetClass === "etf";
  if (state.searchFilter === "stock") return asset.assetClass === "stock";
  if (state.searchFilter === "high") return asset.riskType === "high";
  return true;
}

function getSearchResults() {
  const query = state.searchQuery.trim().toLowerCase();
  return getAllAssets()
    .filter(matchesFilter)
    .filter((asset) => !query || getAssetSearchText(asset).includes(query))
    .sort((a, b) => {
      const aSelected = isSelected(a.id) ? 1 : 0;
      const bSelected = isSelected(b.id) ? 1 : 0;
      return bSelected - aSelected || a.name.localeCompare(b.name, "ko-KR");
    })
    .slice(0, 9);
}

function makeSearchUrl(asset) {
  const query = encodeURIComponent(`${asset.name} ${asset.ticker} 뉴스`);
  return `https://search.naver.com/search.naver?where=news&query=${query}`;
}

function normalizeSector(value = "") {
  const text = String(value).toLowerCase();
  if (text.includes("semi") || text.includes("반도체")) return "semiconductor";
  if (text.includes("manufact") || text.includes("auto") || text.includes("제조") || text.includes("자동차")) return "manufacturing";
  if (text.includes("ship") || text.includes("조선")) return "shipbuilding";
  if (text.includes("energy") || text.includes("solar") || text.includes("에너지")) return "energy";
  if (text.includes("bio") || text.includes("바이오")) return "bio";
  if (text.includes("battery") || text.includes("배터리")) return "battery";
  if (text.includes("finance") || text.includes("금융")) return "finance";
  if (text.includes("etf")) return "etf";
  if (text.includes("bond") || text.includes("treasury") || text.includes("deposit") || text.includes("국채") || text.includes("예금")) return "reserve";
  return "growth";
}

function normalizeRiskType(value = "", assetClass = "stock", sector = "growth") {
  const text = String(value).toLowerCase();
  if (assetClass === "deposit" || assetClass === "treasury" || sector === "reserve" || text.includes("reserve") || text.includes("국채") || text.includes("예금")) return "reserve";
  if (text.includes("stable") || text.includes("안정") || sector === "finance") return "stable";
  if (text.includes("high") || text.includes("growth") || text.includes("고수익")) return "high";
  return assetClass === "etf" ? "balanced" : "balanced";
}

function normalizeAssetClass(value = "", ticker = "") {
  const text = `${value} ${ticker}`.toLowerCase();
  if (text.includes("deposit") || text.includes("예금") || text === "mmf") return "deposit";
  if (text.includes("bond") || text.includes("treasury") || text.includes("국채")) return "treasury";
  if (text.includes("etf") || text.includes("kodex") || text.includes("tiger")) return "etf";
  return "stock";
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function normalizeRemoteAsset(item) {
  const ticker = String(item.ticker || item.symbol || item.code || "").trim().toUpperCase();
  const name = String(item.name || item.title || item.companyName || ticker || "검색 종목").trim();
  const assetClass = normalizeAssetClass(item.assetClass || item.type || item.market, ticker);
  const sector = normalizeSector(item.sector || item.industry || item.category || assetClass);
  const riskType = normalizeRiskType(item.riskType || item.risk || item.profile, assetClass, sector);
  const id = `api-${slugify(ticker || name)}`;

  return {
    id,
    name,
    ticker: ticker || id.toUpperCase(),
    sector,
    assetClass,
    riskType,
    building: item.building || `${sectorLabels[sector] || "시장"} 건물`,
    icon: item.icon || (assetClass === "etf" ? "blocks" : riskType === "reserve" ? "landmark" : "building-2"),
    visual: item.visual || (riskType === "reserve" ? "bank" : assetClass === "etf" ? "complex" : sector === "semiconductor" ? "chip" : "market"),
    basePrice: Number(item.price || item.basePrice || 100),
    amount: 0,
    alpha: Number(item.alpha || 0),
    volatility: item.volatility || (riskType === "high" ? "높음" : "보통"),
    tags: [item.market, item.industry, item.category].filter(Boolean),
    reason: item.reason || "API 검색으로 불러온 종목입니다. 실제 서비스에서는 종목 상세, 가격, 뉴스 데이터를 함께 연결합니다.",
    source: "api",
  };
}

async function fetchConfiguredStockSearch(query) {
  if (!appConfig.stockSearchEndpoint || query.trim().length < 2) return;

  state.searchStatus = "API 검색 중";
  renderSearch();

  try {
    const url = new URL(appConfig.stockSearchEndpoint, window.location.href);
    url.searchParams.set("q", query.trim());
    const response = await fetch(url.toString(), { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`stock search failed: ${response.status}`);
    const json = await response.json();
    const rows = Array.isArray(json) ? json : json.items || json.results || json.data || [];
    state.remoteAssets = rows.map(normalizeRemoteAsset).filter((asset) => asset.name && asset.ticker);
    state.searchStatus = "API 검색";
  } catch (error) {
    console.warn(error);
    state.searchStatus = "샘플 검색";
  }

  renderSearch();
  refreshIcons();
}

function renderBuildingArt(visual, ticker = "") {
  const label = escapeHtml(ticker);
  const common = 'class="building-art" viewBox="0 0 180 150" aria-hidden="true" focusable="false"';

  if (visual === "cityhall") {
    return `
      <svg ${common}>
        <path class="ground" d="M19 118 L90 84 L161 118 L90 146 Z" />
        <path class="road" d="M78 134 L90 112 L102 134 L90 146 Z" />
        <rect class="hall-wing" x="29" y="78" width="34" height="35" rx="6" />
        <rect class="hall-wing" x="117" y="78" width="34" height="35" rx="6" />
        <rect class="hall-base" x="45" y="66" width="90" height="50" rx="8" />
        <path class="hall-roof" d="M36 67 L90 32 L144 67 Z" />
        <rect class="hall-tower" x="75" y="38" width="30" height="78" rx="6" />
        <circle class="clock" cx="90" cy="58" r="8" />
        <path class="flag-pole" d="M105 38 V17" />
        <path class="flag" d="M107 18 H134 L127 30 H107 Z" />
        <path class="pillars" d="M57 80 V111 M73 76 V111 M90 73 V111 M107 76 V111 M123 80 V111" />
      </svg>
    `;
  }

  if (visual === "bank") {
    return `
      <svg ${common}>
        <path class="ground" d="M20 119 L90 84 L160 119 L90 146 Z" />
        <path class="bank-roof" d="M39 65 L90 34 L141 65 Z" />
        <rect class="bank-base" x="42" y="65" width="96" height="56" rx="7" />
        <path class="bank-pillars" d="M58 74 V112 M78 74 V112 M102 74 V112 M122 74 V112" />
        <circle class="coin" cx="90" cy="52" r="9" />
        <path class="bank-steps" d="M37 121 H143 M47 130 H133" />
        <rect class="label-plate" x="61" y="110" width="58" height="20" rx="5" />
        <text x="90" y="124" text-anchor="middle">${label}</text>
      </svg>
    `;
  }

  if (visual === "bond") {
    return `
      <svg ${common}>
        <path class="ground" d="M20 119 L90 84 L160 119 L90 146 Z" />
        <rect class="bond-paper" x="45" y="44" width="90" height="76" rx="10" />
        <path class="bond-fold" d="M118 44 V64 H135" />
        <path class="bond-lines" d="M61 67 H105 M61 82 H119 M61 97 H100" />
        <circle class="seal" cx="116" cy="95" r="13" />
        <path class="ribbon" d="M111 107 L104 126 L116 118 L128 126 L122 107" />
        <rect class="label-plate" x="61" y="110" width="58" height="20" rx="5" />
        <text x="90" y="124" text-anchor="middle">${label}</text>
      </svg>
    `;
  }

  if (visual === "treasury") {
    return `
      <svg ${common}>
        <path class="ground" d="M20 119 L90 84 L160 119 L90 146 Z" />
        <rect class="treasury-base" x="38" y="72" width="104" height="49" rx="8" />
        <path class="treasury-dome" d="M53 72 C57 48 123 48 127 72 Z" />
        <path class="treasury-columns" d="M56 78 V113 M73 78 V113 M90 78 V113 M107 78 V113 M124 78 V113" />
        <path class="flag-pole" d="M90 49 V27" />
        <path class="flag" d="M92 29 H122 L114 41 H92 Z" />
        <path class="bank-steps" d="M34 121 H146 M45 130 H135" />
        <rect class="label-plate" x="61" y="110" width="58" height="20" rx="5" />
        <text x="90" y="124" text-anchor="middle">${label}</text>
      </svg>
    `;
  }

  if (visual === "chip") {
    return `
      <svg ${common}>
        <path class="ground" d="M18 119 L91 84 L162 119 L90 146 Z" />
        <rect class="chip-package" x="50" y="43" width="80" height="80" rx="12" />
        <rect class="chip-core" x="68" y="61" width="44" height="44" rx="7" />
        <path class="chip-pins" d="M50 58 H31 M50 74 H28 M50 90 H28 M50 106 H31 M130 58 H149 M130 74 H152 M130 90 H152 M130 106 H149 M65 43 V25 M82 43 V22 M98 43 V22 M115 43 V25 M65 123 V141 M82 123 V144 M98 123 V144 M115 123 V141" />
        <path class="circuit" d="M73 77 H87 V68 H105 M73 93 H94 V103 H109" />
        <rect class="label-plate" x="61" y="110" width="58" height="20" rx="5" />
        <text x="90" y="124" text-anchor="middle">${label}</text>
      </svg>
    `;
  }

  if (visual === "hbm") {
    return `
      <svg ${common}>
        <path class="ground" d="M20 119 L91 84 L160 119 L90 146 Z" />
        <rect class="memory memory-back" x="44" y="48" width="31" height="76" rx="7" />
        <rect class="memory memory-mid" x="73" y="34" width="35" height="90" rx="7" />
        <rect class="memory memory-front" x="105" y="44" width="32" height="80" rx="7" />
        <path class="stack-lines" d="M50 62 H70 M50 78 H70 M50 94 H70 M50 110 H70 M79 51 H102 M79 67 H102 M79 83 H102 M79 99 H102 M111 59 H131 M111 75 H131 M111 91 H131 M111 107 H131" />
        <path class="pins" d="M38 127 H142 M49 131 V139 M67 131 V139 M85 131 V139 M103 131 V139 M121 131 V139" />
        <rect class="label-plate" x="61" y="110" width="58" height="20" rx="5" />
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
        <rect class="label-plate" x="61" y="110" width="58" height="20" rx="5" />
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
        <rect class="label-plate" x="61" y="110" width="58" height="20" rx="5" />
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
        <rect class="label-plate" x="61" y="110" width="58" height="20" rx="5" />
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
        <rect class="label-plate" x="61" y="110" width="58" height="20" rx="5" />
        <text x="90" y="124" text-anchor="middle">${label}</text>
      </svg>
    `;
  }

  if (visual === "complex") {
    return `
      <svg ${common}>
        <path class="ground" d="M18 120 L90 84 L162 120 L91 146 Z" />
        <path class="basket" d="M37 86 C47 118 132 118 143 86 H37 Z" />
        <rect class="complex-tower a" x="48" y="62" width="27" height="48" rx="7" />
        <rect class="complex-tower b" x="76" y="45" width="31" height="65" rx="7" />
        <rect class="complex-tower c" x="109" y="68" width="25" height="42" rx="7" />
        <path class="complex-lines" d="M56 74 H68 M84 59 H99 M84 73 H99 M84 87 H99 M116 81 H128 M116 94 H128" />
        <path class="connector" d="M54 127 H128 M64 84 C78 72 102 72 116 84" />
        <rect class="label-plate" x="61" y="110" width="58" height="20" rx="5" />
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
      <rect class="label-plate" x="61" y="110" width="58" height="20" rx="5" />
      <text x="90" y="124" text-anchor="middle">${label}</text>
    </svg>
  `;
}

function render() {
  const scenario = getScenario();
  const session = getMarketSession();
  const selectedAssets = getSelectedAssets();
  const allocated = getAllocatedTotal(selectedAssets);
  const marketInvested = getMarketInvestedTotal(selectedAssets);
  const reserve = getReserveTotal(selectedAssets);
  const pnl = getDailyPnl(selectedAssets);
  const operating = SEED_MONEY + pnl;
  const investedRate = Math.min(allocated / SEED_MONEY, 1);
  const ruleValid = isRuleValid();

  document.body.dataset.marketSession = session.key;
  els.marketName.textContent = `${session.time} · ${scenario.name}`;
  els.marketPulse.textContent = `${session.label} · 도시 생산성 ${percent((pnl / SEED_MONEY) * 100)}`;
  els.cityLevel.textContent = operating >= 10500 ? "시청 Lv.3" : operating >= 10000 ? "시청 Lv.2" : "시청 Lv.1";
  els.cityStatus.textContent = ruleValid ? (pnl >= 0 ? "운영 자금 증가" : "방어 운영 중") : "스쿼드 규칙 확인";
  els.seedMoney.textContent = money(SEED_MONEY);
  els.investedMoney.textContent = money(marketInvested);
  els.cashMoney.textContent = money(reserve);
  els.dailyPnl.textContent = `${pnl >= 0 ? "+" : ""}${money(pnl)}`;
  els.dailyPnl.className = impactClass(pnl);
  els.operatingFunds.textContent = money(operating);
  els.turnNumber.textContent = `DAY ${String(state.day + 1).padStart(2, "0")}`;
  els.cityGrade.textContent = `${getCityGrade(operating)} RANK`;
  els.buildingCount.textContent = `${selectedAssets.length}개`;
  els.investedRate.textContent = `${Math.round(investedRate * 100)}%`;
  els.capitalArc.style.strokeDashoffset = String(301 * (1 - investedRate));
  els.allocationHint.textContent = `${selectedAssets.length}/${TARGET_ASSET_COUNT} 슬롯`;
  els.reportDate.textContent = `Day ${state.day + 1}`;

  renderRuleStatus();
  renderSearch();
  renderScenarioTabs();
  renderTimeCycle();
  renderAssets();
  renderCity();
  renderSectorStrip();
  renderDetail();
  renderNews();
  renderFlow();
  renderRanking();
  renderReport();
  renderSoundButton();
  refreshIcons();
}

function renderRuleStatus() {
  const rules = getRuleStats();
  els.ruleSummary.textContent = rules.every((rule) => rule.valid) ? "룰 충족" : "룰 확인 필요";
  els.ruleSummary.className = rules.every((rule) => rule.valid) ? "is-valid" : "is-warning";
  els.ruleGrid.innerHTML = rules
    .map(
      (rule) => `
        <div class="rule-chip ${rule.valid ? "is-valid" : "is-warning"}">
          <span>${escapeHtml(rule.label)}</span>
          <strong>${escapeHtml(rule.value)}</strong>
          <small>${escapeHtml(rule.help)}</small>
        </div>
      `,
    )
    .join("");
}

function renderTimeCycle() {
  const activeSession = getMarketSession();
  els.timeCycle.innerHTML = marketSessions
    .map(
      (session) => `
        <span class="time-chip ${session.key === activeSession.key ? "is-active" : ""}">
          <i>${escapeHtml(session.time)}</i>
          <strong>${escapeHtml(session.label)}</strong>
          <small>${escapeHtml(session.tone)}</small>
        </span>
      `,
    )
    .join("");
}

function renderSearch() {
  const results = getSearchResults();
  els.searchModeLabel.textContent = state.searchStatus;
  els.searchFilters.innerHTML = searchFilterOptions
    .map(
      (filter) => `
        <button class="filter-tab ${state.searchFilter === filter.id ? "is-active" : ""}" type="button" data-search-filter="${filter.id}">
          ${escapeHtml(filter.label)}
        </button>
      `,
    )
    .join("");

  if (!results.length) {
    els.searchResults.innerHTML = `
      <div class="empty-result">
        <i data-lucide="search-x" aria-hidden="true"></i>
        <span>검색 결과가 없습니다.</span>
      </div>
    `;
    return;
  }

  els.searchResults.innerHTML = results
    .map((asset) => {
      const selected = isSelected(asset.id);
      const disabled = selected || state.selectedAssetIds.length >= TARGET_ASSET_COUNT;
      const addLabel = selected ? "담김" : "담기";
      return `
        <article class="search-result ${selected ? "is-selected" : ""}">
          <div class="asset-icon"><i data-lucide="${asset.icon}" aria-hidden="true"></i></div>
          <div class="search-copy">
            <strong>${escapeHtml(asset.name)}</strong>
            <span>${escapeHtml(asset.ticker)} · ${escapeHtml(sectorLabels[asset.sector])} · ${escapeHtml(riskLabels[asset.riskType])}</span>
          </div>
          <button class="mini-button" type="button" data-add-asset="${asset.id}" ${disabled ? "disabled" : ""}>${addLabel}</button>
        </article>
      `;
    })
    .join("");
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
  const selectedAssets = getSelectedAssets();

  els.assetList.innerHTML = selectedAssets
    .map((asset, index) => {
      const weight = (asset.amount / SEED_MONEY) * 100;
      const dailyReturn = getReturn(asset);
      return `
        <article class="asset-card ${asset.id === state.selectedAssetId ? "is-selected" : ""} ${asset.amount === 0 ? "is-empty" : ""}"
          role="button" tabindex="0" data-select-asset="${asset.id}">
          <span class="slot-number">${String(index + 1).padStart(2, "0")}</span>
          <div class="asset-icon"><i data-lucide="${asset.icon}" aria-hidden="true"></i></div>
          <div class="asset-title">
            <strong>${escapeHtml(asset.name)}</strong>
            <span class="asset-meta">${escapeHtml(asset.ticker)} · ${escapeHtml(sectorLabels[asset.sector])} · ${percent(dailyReturn)}</span>
          </div>
          <span class="profile-badge ${asset.riskType}">${escapeHtml(riskLabels[asset.riskType])}</span>
          <div class="asset-actions">
            <button class="mini-button" type="button" data-adjust="${asset.id}:-${STEP}" aria-label="${asset.name} 투자금 줄이기">-</button>
            <span class="amount">${money(asset.amount)}</span>
            <button class="mini-button" type="button" data-adjust="${asset.id}:${STEP}" aria-label="${asset.name} 투자금 늘리기">+</button>
            <button class="mini-button danger" type="button" data-remove-asset="${asset.id}" aria-label="${asset.name} 제거">
              <i data-lucide="x" aria-hidden="true"></i>
            </button>
          </div>
          <div class="weight-bar" aria-hidden="true"><span style="width: ${Math.min(weight, 100)}%"></span></div>
        </article>
      `;
    })
    .join("");
}

function renderCity() {
  const selectedAssets = getSelectedAssets();
  const cityHall = `
    <div class="lot is-base" aria-label="시청">
      <span class="tile-ground"></span>
      <div class="building illustration city-hall visual-cityhall">
        <span class="sprite-shadow"></span>
        ${renderBuildingArt("cityhall")}
        <span class="building-chip"><i data-lucide="landmark" aria-hidden="true"></i>시청</span>
      </div>
    </div>
  `;

  const lots = Array.from({ length: TARGET_ASSET_COUNT })
    .map((_, index) => {
      const asset = selectedAssets[index];
      const slotClass = `slot-pos-${index + 1}`;

      if (!asset) {
        return `
          <button class="lot is-empty ${slotClass}" type="button">
            <span class="tile-ground"></span>
            <span class="empty-lot"><i data-lucide="plus" aria-hidden="true"></i>빈 슬롯</span>
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
    <span class="map-route route-main" aria-hidden="true"></span>
    <span class="map-route route-cross" aria-hidden="true"></span>
    <span class="map-deco deco-tree deco-tree-1" aria-hidden="true"></span>
    <span class="map-deco deco-tree deco-tree-2" aria-hidden="true"></span>
    <span class="map-deco deco-hill deco-hill-1" aria-hidden="true"></span>
    <span class="map-deco deco-hill deco-hill-2" aria-hidden="true"></span>
    <span class="map-deco deco-farm" aria-hidden="true"></span>
    <span class="map-deco deco-crane" aria-hidden="true"></span>
    <span class="map-deco deco-water" aria-hidden="true"></span>
    <span class="map-deco deco-cloud deco-cloud-1" aria-hidden="true"></span>
    <span class="map-deco deco-cloud deco-cloud-2" aria-hidden="true"></span>
  `;

  els.cityMap.innerHTML = cityHall + lots + mapDecorations;
}

function renderSectorStrip() {
  const scenario = getScenario();
  const keys = Array.from(new Set(getSelectedAssets().map((asset) => asset.sector)));
  els.sectorStrip.innerHTML = keys
    .map((key) => {
      const value = scenario.sectors[key] ?? 0;
      return `
        <div class="sector-card ${value < 0 ? "is-negative" : ""}">
          <span>${escapeHtml(sectorLabels[key])}</span>
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
  const tier = `Lv.${tierForAmount(asset.amount)}`;

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
      <span class="badge">${escapeHtml(riskLabels[asset.riskType])}</span>
      <span class="badge">${escapeHtml(assetClassLabels[asset.assetClass])}</span>
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

function fallbackNewsForAsset(asset) {
  const scenario = getScenario();
  const sector = sectorLabels[asset.sector] || "시장";
  return [
    {
      title: `${asset.name}, ${sector} 흐름 속 ${percent(getReturn(asset))} 반응`,
      source: "학습용 샘플",
      publishedAt: "오늘",
      summary: `${scenario.name} 국면에서 ${asset.building}의 수익률이 도시 운영 자금에 반영됐습니다.`,
      url: makeSearchUrl(asset),
    },
    {
      title: `${sector} 구역 체크: ${asset.volatility} 변동성 자산의 역할`,
      source: "도시 리포트",
      publishedAt: "어제",
      summary: `${riskLabels[asset.riskType]} 자산으로 분류되어 10종목 룰과 랭킹 점수에 함께 반영됩니다.`,
      url: makeSearchUrl(asset),
    },
    {
      title: `${asset.ticker} 관련 기사 더 보기`,
      source: "뉴스 검색",
      publishedAt: "실시간 링크",
      summary: "실제 API 프록시를 연결하면 이 영역에 최신 기사 제목과 출처가 표시됩니다.",
      url: makeSearchUrl(asset),
    },
  ];
}

function normalizeNewsItem(item, asset) {
  return {
    title: String(item.title || item.headline || `${asset.name} 뉴스`).trim(),
    source: String(item.source || item.publisher || item.origin || "뉴스").trim(),
    publishedAt: String(item.publishedAt || item.datetime || item.date || "최근").trim(),
    summary: String(item.summary || item.description || item.content || "").trim(),
    url: String(item.url || item.link || makeSearchUrl(asset)).trim(),
  };
}

async function loadNewsForAsset(asset) {
  if (!asset) return;

  const requestId = state.news.requestId + 1;
  state.news.requestId = requestId;
  state.news.assetId = asset.id;

  if (!appConfig.newsEndpoint) {
    state.news.status = "샘플 뉴스";
    state.news.items = fallbackNewsForAsset(asset);
    renderNews();
    refreshIcons();
    return;
  }

  state.news.status = "뉴스 불러오는 중";
  state.news.items = [];
  renderNews();

  try {
    const url = new URL(appConfig.newsEndpoint, window.location.href);
    url.searchParams.set("ticker", asset.ticker);
    url.searchParams.set("name", asset.name);
    const response = await fetch(url.toString(), { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`news request failed: ${response.status}`);
    const json = await response.json();
    const rows = Array.isArray(json) ? json : json.items || json.results || json.articles || json.data || [];
    if (state.news.requestId !== requestId) return;
    state.news.status = "API 뉴스";
    state.news.items = rows.slice(0, 5).map((item) => normalizeNewsItem(item, asset));
    if (!state.news.items.length) state.news.items = fallbackNewsForAsset(asset);
  } catch (error) {
    console.warn(error);
    if (state.news.requestId !== requestId) return;
    state.news.status = "샘플 뉴스";
    state.news.items = fallbackNewsForAsset(asset);
  }

  renderNews();
  refreshIcons();
}

function renderNews() {
  const asset = getSelectedAsset();
  if (state.news.assetId !== asset.id || !state.news.items.length) {
    state.news.items = fallbackNewsForAsset(asset);
    state.news.assetId = asset.id;
  }

  els.newsSourceLabel.textContent = state.news.status;
  els.newsList.innerHTML = state.news.items
    .slice(0, 4)
    .map(
      (item) => `
        <a class="news-item" href="${escapeHtml(item.url)}" target="_blank" rel="noopener">
          <span>${escapeHtml(item.source)} · ${escapeHtml(item.publishedAt)}</span>
          <strong>${escapeHtml(item.title)}</strong>
          <small>${escapeHtml(item.summary)}</small>
        </a>
      `,
    )
    .join("");
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
        <span class="flow-close">${formatPrice(asset, close)}</span>
      </div>
    `;
  });

  els.flowList.innerHTML = rows.join("");
}

function getHoldingsForUser() {
  return getSelectedAssets().map((asset) => ({ id: asset.id, amount: asset.amount }));
}

function calculatePlayerResult(player) {
  const holdings = player.isUser ? getHoldingsForUser() : player.holdings;
  const resolvedHoldings = holdings
    .map((holding) => ({ asset: getAssetById(holding.id), amount: holding.amount }))
    .filter((holding) => holding.asset);
  const total = resolvedHoldings.reduce((sum, holding) => sum + holding.amount, 0);
  const pnl = resolvedHoldings.reduce((sum, holding) => sum + holding.amount * (getReturn(holding.asset) / 100), 0);
  const rate = total ? (pnl / total) * 100 : 0;
  const reserveRatio = total
    ? resolvedHoldings
        .filter((holding) => holding.asset.riskType === "reserve")
        .reduce((sum, holding) => sum + holding.amount, 0) / total
    : 0;
  const diversity = new Set(resolvedHoldings.map((holding) => holding.asset.sector)).size;
  const score = Math.round(1000 + pnl * 2 + diversity * 15 + reserveRatio * 80);

  return {
    id: player.id,
    name: player.name,
    isUser: player.isUser,
    total,
    pnl,
    rate,
    reserveRatio,
    diversity,
    score,
    count: resolvedHoldings.length,
  };
}

function renderRanking() {
  const players = [{ id: "me", name: "내 도시", isUser: true }, ...state.rivals];
  const results = players
    .map(calculatePlayerResult)
    .sort((a, b) => b.rate - a.rate || b.score - a.score || b.reserveRatio - a.reserveRatio);

  els.playerCountLabel.textContent = `${players.length}/${MAX_PLAYERS}`;
  els.addRivalButton.disabled = players.length >= MAX_PLAYERS;

  els.rankingList.innerHTML = results
    .map(
      (result, index) => `
        <article class="ranking-card ${result.isUser ? "is-me" : ""}">
          <span class="rank-badge">${index + 1}</span>
          <div>
            <strong>${escapeHtml(result.name)}</strong>
            <span>${result.count}종목 · 분산 ${result.diversity}섹터</span>
          </div>
          <div class="rank-score">
            <strong class="${impactClass(result.rate)}">${percent(result.rate)}</strong>
            <span>${result.pnl >= 0 ? "+" : ""}${money(result.pnl)} · ${result.score}점</span>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderReport() {
  const scenario = getScenario();
  const selectedAssets = getSelectedAssets();
  const contributions = selectedAssets
    .map((asset) => ({
      asset,
      impact: asset.amount * (getReturn(asset) / 100),
      rate: getReturn(asset),
    }))
    .sort((a, b) => b.impact - a.impact);

  const best = contributions[0];
  const worst = contributions[contributions.length - 1];
  const maxWeight = Math.max(...selectedAssets.map((asset) => asset.amount || 0), 0) / SEED_MONEY;
  const reserveRatio = getReserveTotal(selectedAssets) / SEED_MONEY;
  const warnings = getRuleWarnings();
  const etfAssets = selectedAssets.filter((asset) => asset.assetClass === "etf");
  const balanceMessage =
    maxWeight >= 0.24
      ? "특정 건물 비중이 커서 같은 시장 충격에 도시 전체가 빠르게 흔들릴 수 있습니다."
      : "비중이 비교적 고르게 배치되어 여러 산업 흐름을 동시에 학습할 수 있습니다.";
  const reserveMessage =
    reserveRatio >= 0.3
      ? "예금·국채 방어선이 규칙을 충족해 다음날 손실 변동을 낮추는 역할을 합니다."
      : "예금·국채 비중이 낮습니다. 규칙상 최소 3개는 반드시 필요합니다.";
  const ruleMessage = warnings.length ? warnings.join(", ") : "10종목, 예금·국채, 고수익형, 안정 투자형 상한을 모두 충족했습니다.";
  const etfMessage = etfAssets.length
    ? `${etfAssets.map((asset) => asset.name).join(", ")}는 여러 종목을 묶은 건물로, ${scenario.name}에서 관련 섹터 흐름을 함께 반영합니다.`
    : "ETF가 없으면 개별 종목 흐름은 또렷하지만 시장 전체나 산업 바스켓 흐름을 공부하기 어렵습니다.";

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
      <p><strong>스쿼드 규칙</strong>${escapeHtml(ruleMessage)}</p>
    </div>
    <div class="report-item">
      <i data-lucide="boxes" aria-hidden="true"></i>
      <p><strong>ETF 흐름</strong>${escapeHtml(etfMessage)}</p>
    </div>
    <div class="report-item">
      <i data-lucide="map" aria-hidden="true"></i>
      <p><strong>배치 진단</strong>${escapeHtml(balanceMessage)} ${escapeHtml(reserveMessage)}</p>
    </div>
    <div class="report-item">
      <i data-lucide="newspaper" aria-hidden="true"></i>
      <p><strong>시장 메모</strong>${escapeHtml(scenario.note)}</p>
    </div>
  `;
}

function selectAsset(id, options = {}) {
  const asset = getAssetById(id);
  if (!asset || !isSelected(id)) return;
  state.selectedAssetId = id;
  render();
  if (!options.silent) playSound("selectTick");
  loadNewsForAsset(asset);
}

function addAsset(id) {
  const asset = getAssetById(id);
  if (!asset) return;

  if (isSelected(id)) {
    showToast("이미 스쿼드에 담은 종목입니다.");
    playSound("blocked");
    return;
  }

  if (state.selectedAssetIds.length >= TARGET_ASSET_COUNT) {
    showToast("10개 슬롯이 모두 찼습니다. 기존 종목을 제거한 뒤 담아주세요.");
    playSound("blocked");
    return;
  }

  const remaining = Math.max(SEED_MONEY - getAllocatedTotal(), 0);
  asset.amount = remaining > 0 ? Math.min(1000, remaining) : 0;
  state.selectedAssetIds.push(id);
  state.selectedAssetId = id;
  showToast(`${asset.name} 종목을 스쿼드에 담았습니다.`);
  playSound("coinUp");
  render();
  loadNewsForAsset(asset);
}

function removeAsset(id) {
  const asset = getAssetById(id);
  if (!asset || !isSelected(id)) return;

  state.selectedAssetIds = state.selectedAssetIds.filter((assetId) => assetId !== id);
  if (state.selectedAssetId === id) {
    state.selectedAssetId = state.selectedAssetIds[0] || "deposit-kr";
  }

  showToast(`${asset.name} 종목을 스쿼드에서 제거했습니다.`);
  playSound("coinDown");
  render();
  loadNewsForAsset(getSelectedAsset());
}

function adjustAsset(id, delta) {
  const asset = getAssetById(id);
  if (!asset || !isSelected(id)) return;

  if (delta > 0 && getAllocatedTotal() + delta > SEED_MONEY) {
    showToast("시드머니를 초과할 수 없습니다.");
    playSound("blocked");
    return;
  }

  if (delta < 0 && asset.amount + delta < 0) {
    showToast("투자금은 0만원보다 낮출 수 없습니다.");
    playSound("blocked");
    return;
  }

  asset.amount = Math.max(0, asset.amount + delta);
  state.selectedAssetId = id;
  playSound(delta > 0 ? "coinUp" : "coinDown");
  render();
}

function applyPreset(name) {
  const preset = presets[name];
  if (!preset) return;

  getAllAssets().forEach((asset) => {
    asset.amount = 0;
  });

  state.selectedAssetIds = [...preset.selectedIds];
  Object.entries(preset.amounts).forEach(([id, amount]) => {
    const asset = getAssetById(id);
    if (asset) asset.amount = amount;
  });

  state.selectedAssetId = state.selectedAssetIds.includes(state.selectedAssetId) ? state.selectedAssetId : state.selectedAssetIds[0];
  showToast(`${preset.label} 스쿼드를 적용했습니다.`);
  playSound("presetApply");
  render();
  loadNewsForAsset(getSelectedAsset());
}

function addRival() {
  const playerCount = state.rivals.length + 1;
  if (playerCount >= MAX_PLAYERS) {
    showToast("한 방에는 최대 8명까지만 참가할 수 있습니다.");
    playSound("blocked");
    return;
  }

  const nextTemplate = rivalTemplates.find((template) => !state.rivals.some((rival) => rival.id === template.id));
  if (!nextTemplate) {
    showToast("추가할 샘플 참가자가 없습니다.");
    playSound("blocked");
    return;
  }

  state.rivals.push(cloneRival(nextTemplate));
  showToast(`${nextTemplate.name}가 방에 참가했습니다.`);
  playSound("selectTick");
  render();
}

function resetRivals() {
  state.rivals = rivalTemplates.slice(0, 3).map(cloneRival);
  showToast("랭킹 참가자를 초기화했습니다.");
  playSound("presetApply");
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

function getAudioContext() {
  if (sound.context) return sound.context;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  sound.context = new AudioContext();
  return sound.context;
}

function playTone(frequency, start, duration, type = "sine", volume = 0.035) {
  const context = sound.context;
  if (!context) return;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const startAt = context.currentTime + start;
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startAt);
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(startAt);
  oscillator.stop(startAt + duration + 0.04);
}

function playSound(name) {
  if (sound.muted) return;
  const now = performance.now();
  if (sound.lastPlayed[name] && now - sound.lastPlayed[name] < 55) return;
  sound.lastPlayed[name] = now;

  const context = getAudioContext();
  if (!context) return;

  const startPlayback = () => {
    if (name === "selectTick") {
      playTone(660, 0, 0.045, "sine", 0.025);
      playTone(880, 0.035, 0.04, "sine", 0.018);
    } else if (name === "coinUp") {
      playTone(740, 0, 0.07, "triangle", 0.035);
      playTone(1040, 0.05, 0.06, "triangle", 0.028);
    } else if (name === "coinDown") {
      playTone(520, 0, 0.07, "triangle", 0.032);
      playTone(390, 0.05, 0.06, "triangle", 0.025);
    } else if (name === "blocked") {
      playTone(180, 0, 0.11, "square", 0.026);
      playTone(140, 0.06, 0.1, "square", 0.02);
    } else if (name === "presetApply") {
      playTone(523, 0, 0.08, "sine", 0.028);
      playTone(659, 0.07, 0.08, "sine", 0.028);
      playTone(784, 0.14, 0.1, "sine", 0.03);
    } else if (name === "marketAdvance") {
      playTone(220, 0, 0.18, "sawtooth", 0.025);
      playTone(660, 0.08, 0.12, "sine", 0.026);
      playTone(1200, 0.18, 0.09, "triangle", 0.02);
    } else if (name === "levelUp") {
      [523, 659, 784, 1046].forEach((frequency, index) => playTone(frequency, index * 0.07, 0.09, "sine", 0.032));
    }
  };

  if (context.state === "suspended") {
    context.resume().then(startPlayback).catch(() => {});
  } else {
    startPlayback();
  }
}

function setSoundMuted(muted) {
  sound.muted = muted;
  localStorage.setItem(STORAGE_KEYS.muted, String(muted));
  renderSoundButton();
  refreshIcons();
  if (!muted) playSound("selectTick");
}

function renderSoundButton() {
  const icon = sound.muted ? "volume-x" : "volume-2";
  els.soundToggle.innerHTML = `<i data-lucide="${icon}" aria-hidden="true"></i>`;
  els.soundToggle.setAttribute("aria-label", sound.muted ? "사운드 켜기" : "사운드 끄기");
  els.soundToggle.title = sound.muted ? "사운드 켜기" : "사운드 끄기";
  els.soundToggle.classList.toggle("is-muted", sound.muted);
}

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function debounceSearch() {
  window.clearTimeout(debounceSearch.timer);
  debounceSearch.timer = window.setTimeout(() => {
    fetchConfiguredStockSearch(state.searchQuery);
  }, 240);
}

document.addEventListener("click", (event) => {
  const adjustButton = event.target.closest("[data-adjust]");
  if (adjustButton) {
    const [id, delta] = adjustButton.dataset.adjust.split(":");
    adjustAsset(id, Number(delta));
    return;
  }

  const removeButton = event.target.closest("[data-remove-asset]");
  if (removeButton) {
    removeAsset(removeButton.dataset.removeAsset);
    return;
  }

  const addButton = event.target.closest("[data-add-asset]");
  if (addButton) {
    addAsset(addButton.dataset.addAsset);
    return;
  }

  const filterButton = event.target.closest("[data-search-filter]");
  if (filterButton) {
    state.searchFilter = filterButton.dataset.searchFilter;
    playSound("selectTick");
    render();
    return;
  }

  const assetTarget = event.target.closest("[data-select-asset]");
  if (assetTarget) {
    selectAsset(assetTarget.dataset.selectAsset);
    return;
  }

  const scenarioButton = event.target.closest("[data-scenario]");
  if (scenarioButton) {
    state.day = Number(scenarioButton.dataset.scenario);
    playSound("selectTick");
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
  selectAsset(assetTarget.dataset.selectAsset);
});

els.stockSearchInput.addEventListener("input", (event) => {
  state.searchQuery = event.target.value;
  renderSearch();
  refreshIcons();
  debounceSearch();
});

els.nextMarketDay.addEventListener("click", () => {
  if (!isRuleValid()) {
    showToast("10종목 스쿼드 규칙을 먼저 충족해야 결과를 비교할 수 있습니다.");
    playSound("blocked");
    return;
  }

  state.day = (state.day + 1) % scenarios.length;
  const pnl = getDailyPnl();
  const session = getMarketSession();
  showToast(`${session.label} ${session.time} · ${getScenario().name} 결과를 반영했습니다.`);
  playSound(pnl >= 0 ? "marketAdvance" : "blocked");
  render();
});

els.soundToggle.addEventListener("click", () => {
  setSoundMuted(!sound.muted);
});

els.addRivalButton.addEventListener("click", addRival);
els.resetRivalsButton.addEventListener("click", resetRivals);
window.addEventListener("load", refreshIcons);

render();
loadNewsForAsset(getSelectedAsset());
