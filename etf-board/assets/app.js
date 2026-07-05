const lineLabels = {
  defense: "수비",
  midfield: "미드",
  attack: "공격",
};

const lineRules = {
  defense: "예금 · 채권 · 현금성만 배치",
  midfield: "ETF와 섹터 바스켓만 배치",
  attack: "상위 10 주도주만 배치",
};

const squadRules = {
  total: 10,
  attack: { min: 1, max: 4 },
  midfield: { min: 1, max: 5 },
  defense: { min: 1, max: 5 },
};

const lineOrder = ["attack", "midfield", "defense"];

const slotLabelSets = {
  attack: {
    1: ["ST"],
    2: ["LS", "RS"],
    3: ["LW", "ST", "RW"],
    4: ["LW", "LF", "RF", "RW"],
  },
  midfield: {
    1: ["CM"],
    2: ["LCM", "RCM"],
    3: ["LCM", "CM", "RCM"],
    4: ["LM", "LCM", "RCM", "RM"],
    5: ["LM", "LCM", "CM", "RCM", "RM"],
  },
  defense: {
    1: ["CB"],
    2: ["LCB", "RCB"],
    3: ["LCB", "CB", "RCB"],
    4: ["LB", "LCB", "RCB", "RB"],
    5: ["LWB", "LCB", "CB", "RCB", "RWB"],
  },
};

const lineDefaults = {
  defense: ["deposit12", "mmf", "bond3y", "cd91", "ustbill"],
  midfield: ["spy", "qqq", "soxx", "tiger500", "kodex200", "schd"],
  attack: ["nvda", "aapl", "msft", "avgo", "tsla", "googl"],
};

const assets = {
  deposit12: {
    id: "deposit12",
    line: "defense",
    ticker: "예금12M",
    name: "정기예금 12개월",
    group: "현금성 수비",
    price: "3.62%",
    change: "+0.01%p",
    changeValue: 0.01,
    tone: "positive",
    score: "낮음",
    issue: "단기 금리가 완만하게 내려오며 현금성 방어 라인이 안정 구간을 유지했습니다.",
    flow: [
      { label: "3일 전", value: "3.65%", change: "-0.02%p", numeric: 3.65 },
      { label: "2일 전", value: "3.64%", change: "-0.01%p", numeric: 3.64 },
      { label: "1일 전", value: "3.61%", change: "-0.03%p", numeric: 3.61 },
      { label: "현재", value: "3.62%", change: "+0.01%p", numeric: 3.62 },
    ],
    points: ["수익률보다 변동성 완충 역할이 큽니다.", "공격 라인의 손실일을 흡수하는 기준 자산입니다."],
  },
  mmf: {
    id: "mmf",
    line: "defense",
    ticker: "MMF",
    name: "초단기 MMF",
    group: "대기 자금",
    price: "3.48%",
    change: "0.00%p",
    changeValue: 0,
    tone: "neutral",
    score: "낮음",
    issue: "자금 대기 수요가 늘며 변동성 큰 구간에서 수비 비중을 지키는 역할을 했습니다.",
    flow: [
      { label: "3일 전", value: "3.47%", change: "+0.01%p", numeric: 3.47 },
      { label: "2일 전", value: "3.48%", change: "+0.01%p", numeric: 3.48 },
      { label: "1일 전", value: "3.48%", change: "0.00%p", numeric: 3.48 },
      { label: "현재", value: "3.48%", change: "0.00%p", numeric: 3.48 },
    ],
    points: ["매매 판단보다 현금 보유 기준선을 잡는 카드입니다.", "급등주 추격을 줄이는 브레이크 역할을 합니다."],
  },
  bond3y: {
    id: "bond3y",
    line: "defense",
    ticker: "국고3Y",
    name: "국고채 3년",
    group: "채권 수비",
    price: "102.4",
    change: "+0.18%",
    changeValue: 0.18,
    tone: "positive",
    score: "낮음",
    issue: "금리 하락 기대가 들어오며 단기 채권 가격이 완만하게 반등했습니다.",
    flow: [
      { label: "3일 전", value: "101.7", change: "+0.05%", numeric: 101.7 },
      { label: "2일 전", value: "101.9", change: "+0.20%", numeric: 101.9 },
      { label: "1일 전", value: "102.2", change: "+0.29%", numeric: 102.2 },
      { label: "현재", value: "102.4", change: "+0.18%", numeric: 102.4 },
    ],
    points: ["주식이 흔들릴 때 방향이 다르게 움직이는지 봅니다.", "수비 라인에서는 수익률보다 분산 효과를 확인합니다."],
  },
  cd91: {
    id: "cd91",
    line: "defense",
    ticker: "CD91",
    name: "CD 91일 금리",
    group: "단기 금리 수비",
    price: "3.55%",
    change: "-0.01%p",
    changeValue: -0.01,
    tone: "negative",
    score: "낮음",
    issue: "단기 자금시장이 안정되며 CD 금리는 소폭 내려왔고 현금성 대기 자산의 기준점이 됐습니다.",
    flow: [
      { label: "3일 전", value: "3.58%", change: "0.00%p", numeric: 3.58 },
      { label: "2일 전", value: "3.57%", change: "-0.01%p", numeric: 3.57 },
      { label: "1일 전", value: "3.56%", change: "-0.01%p", numeric: 3.56 },
      { label: "현재", value: "3.55%", change: "-0.01%p", numeric: 3.55 },
    ],
    points: ["공격 라인의 변동성을 볼 때 현금성 기준 금리로 삼습니다.", "수익률보다 시장의 유동성 온도를 확인하는 카드입니다."],
  },
  ustbill: {
    id: "ustbill",
    line: "defense",
    ticker: "미국단기채",
    name: "미국 단기채",
    group: "달러 채권 수비",
    price: "100.8",
    change: "+0.06%",
    changeValue: 0.06,
    tone: "positive",
    score: "낮음",
    issue: "달러 단기채는 금리 인하 기대를 일부 반영하며 방어 라인에서 완만한 가격 상승을 보였습니다.",
    flow: [
      { label: "3일 전", value: "100.5", change: "+0.02%", numeric: 100.5 },
      { label: "2일 전", value: "100.6", change: "+0.10%", numeric: 100.6 },
      { label: "1일 전", value: "100.7", change: "+0.10%", numeric: 100.7 },
      { label: "현재", value: "100.8", change: "+0.06%", numeric: 100.8 },
    ],
    points: ["달러 방어 자산으로 환율과 금리 방향을 함께 봅니다.", "국내 예금 카드와 비교해 방어 수단을 넓힙니다."],
  },
  spy: {
    id: "spy",
    line: "midfield",
    ticker: "SPY",
    name: "SPDR S&P 500 ETF",
    group: "미국 대형주 ETF",
    price: "$626.31",
    change: "+0.42%",
    changeValue: 0.42,
    tone: "positive",
    score: "중간",
    issue: "대형 기술주와 헬스케어가 동시에 받치며 지수형 ETF 흐름이 넓게 유지됐습니다.",
    flow: [
      { label: "3일 전", value: "$619.84", change: "+0.31%", numeric: 619.84 },
      { label: "2일 전", value: "$622.10", change: "+0.36%", numeric: 622.1 },
      { label: "1일 전", value: "$623.69", change: "+0.26%", numeric: 623.69 },
      { label: "현재", value: "$626.31", change: "+0.42%", numeric: 626.31 },
    ],
    holdings: [
      { ticker: "NVDA", weight: "7.4%", change: "+1.8%", reason: "AI 서버 수요와 데이터센터 투자 기대" },
      { ticker: "MSFT", weight: "6.8%", change: "+0.7%", reason: "클라우드 매출 안정과 생산성 AI 수요" },
      { ticker: "LLY", weight: "1.6%", change: "-0.5%", reason: "단기 차익 실현으로 헬스케어 일부 약세" },
    ],
    points: ["미드필더 기준 카드로 시장 전체의 폭을 봅니다.", "구성 종목 원인을 확인하면 지수 상승의 질을 분리할 수 있습니다."],
  },
  qqq: {
    id: "qqq",
    line: "midfield",
    ticker: "QQQ",
    name: "Invesco QQQ ETF",
    group: "나스닥 100 ETF",
    price: "$557.40",
    change: "+0.86%",
    changeValue: 0.86,
    tone: "positive",
    score: "중간",
    issue: "반도체와 플랫폼 종목이 동시에 강해 기술주 중심 흐름이 우세했습니다.",
    flow: [
      { label: "3일 전", value: "$548.90", change: "+0.22%", numeric: 548.9 },
      { label: "2일 전", value: "$551.36", change: "+0.45%", numeric: 551.36 },
      { label: "1일 전", value: "$552.65", change: "+0.23%", numeric: 552.65 },
      { label: "현재", value: "$557.40", change: "+0.86%", numeric: 557.4 },
    ],
    holdings: [
      { ticker: "AAPL", weight: "8.6%", change: "+1.1%", reason: "신제품 사이클 기대와 자사주 매입 수급" },
      { ticker: "AVGO", weight: "5.2%", change: "+2.3%", reason: "AI 네트워크 칩 수요 확대" },
      { ticker: "TSLA", weight: "3.1%", change: "-0.8%", reason: "인도량 확인 전 경계 매물" },
    ],
    points: ["기술주 쏠림이 있는지 확인하는 미드필더 카드입니다.", "공격 라인과 같은 방향이면 성장주 장세로 해석합니다."],
  },
  soxx: {
    id: "soxx",
    line: "midfield",
    ticker: "SOXX",
    name: "iShares Semiconductor ETF",
    group: "반도체 ETF",
    price: "$248.72",
    change: "+1.24%",
    changeValue: 1.24,
    tone: "positive",
    score: "높음",
    issue: "AI 가속기와 메모리 가격 기대가 맞물리며 반도체 바스켓이 지수보다 강했습니다.",
    flow: [
      { label: "3일 전", value: "$241.20", change: "-0.34%", numeric: 241.2 },
      { label: "2일 전", value: "$243.84", change: "+1.09%", numeric: 243.84 },
      { label: "1일 전", value: "$245.67", change: "+0.75%", numeric: 245.67 },
      { label: "현재", value: "$248.72", change: "+1.24%", numeric: 248.72 },
    ],
    holdings: [
      { ticker: "NVDA", weight: "9.8%", change: "+1.8%", reason: "GPU 수요와 공급 우위 지속" },
      { ticker: "AMD", weight: "6.5%", change: "+1.5%", reason: "AI 칩 경쟁 기대 재부각" },
      { ticker: "INTC", weight: "3.4%", change: "-0.4%", reason: "파운드리 수익성 우려" },
    ],
    points: ["ETF 안의 구성 종목을 보면 반도체 상승이 특정 종목인지 업종 전체인지 분리됩니다.", "공격수 NVDA만 강한지, 바스켓도 따라오는지 비교합니다."],
  },
  tiger500: {
    id: "tiger500",
    line: "midfield",
    ticker: "TIGER S&P500",
    name: "TIGER 미국S&P500",
    group: "국내 상장 미국 ETF",
    price: "21,840",
    change: "+0.39%",
    changeValue: 0.39,
    tone: "positive",
    score: "중간",
    issue: "미국 지수 상승과 환율 안정이 동시에 반영되며 완만한 상승 흐름을 만들었습니다.",
    flow: [
      { label: "3일 전", value: "21,520", change: "+0.19%", numeric: 21520 },
      { label: "2일 전", value: "21,630", change: "+0.51%", numeric: 21630 },
      { label: "1일 전", value: "21,755", change: "+0.58%", numeric: 21755 },
      { label: "현재", value: "21,840", change: "+0.39%", numeric: 21840 },
    ],
    holdings: [
      { ticker: "NVDA", weight: "7.4%", change: "+1.8%", reason: "AI 인프라 투자 확대" },
      { ticker: "BRK.B", weight: "1.5%", change: "+0.3%", reason: "방어적 대형주 수급" },
      { ticker: "JPM", weight: "1.3%", change: "-0.2%", reason: "금리 방향 확인 대기" },
    ],
    points: ["국내 투자자가 미국 흐름을 보는 미드필더 카드입니다.", "환율과 원지수 방향을 같이 확인합니다."],
  },
  kodex200: {
    id: "kodex200",
    line: "midfield",
    ticker: "KODEX200",
    name: "KODEX 200",
    group: "국내 대표 ETF",
    price: "39,120",
    change: "-0.18%",
    changeValue: -0.18,
    tone: "negative",
    score: "중간",
    issue: "반도체 일부는 버텼지만 2차전지와 금융이 눌리며 국내 지수 흐름은 약했습니다.",
    flow: [
      { label: "3일 전", value: "39,410", change: "+0.16%", numeric: 39410 },
      { label: "2일 전", value: "39,330", change: "-0.20%", numeric: 39330 },
      { label: "1일 전", value: "39,190", change: "-0.36%", numeric: 39190 },
      { label: "현재", value: "39,120", change: "-0.18%", numeric: 39120 },
    ],
    holdings: [
      { ticker: "005930", weight: "25.1%", change: "+0.4%", reason: "메모리 가격 기대" },
      { ticker: "000660", weight: "8.9%", change: "+1.2%", reason: "HBM 수요 기대" },
      { ticker: "373220", weight: "2.8%", change: "-2.1%", reason: "전기차 수요 둔화 우려" },
    ],
    points: ["국내 시장 흐름을 미국 ETF와 나란히 비교합니다.", "지수 하락일에도 어떤 업종이 버티는지 확인합니다."],
  },
  schd: {
    id: "schd",
    line: "midfield",
    ticker: "SCHD",
    name: "Schwab US Dividend Equity ETF",
    group: "배당 ETF",
    price: "$81.34",
    change: "+0.12%",
    changeValue: 0.12,
    tone: "positive",
    score: "중간",
    issue: "성장주 강세 속에서도 배당 ETF는 낮은 변동성으로 완만한 플러스 흐름을 유지했습니다.",
    flow: [
      { label: "3일 전", value: "$80.91", change: "-0.04%", numeric: 80.91 },
      { label: "2일 전", value: "$81.05", change: "+0.17%", numeric: 81.05 },
      { label: "1일 전", value: "$81.24", change: "+0.23%", numeric: 81.24 },
      { label: "현재", value: "$81.34", change: "+0.12%", numeric: 81.34 },
    ],
    holdings: [
      { ticker: "TXN", weight: "4.2%", change: "+0.5%", reason: "배당 안정성과 반도체 저변 수요" },
      { ticker: "PEP", weight: "3.8%", change: "+0.2%", reason: "필수소비 방어 수요" },
      { ticker: "VZ", weight: "3.6%", change: "-0.3%", reason: "통신 섹터 성장 둔화 우려" },
    ],
    points: ["공격적 기술주 장세와 다른 방어형 ETF의 흐름을 비교합니다.", "수익률만이 아니라 낙폭 관리 관점에서 봅니다."],
  },
  nvda: {
    id: "nvda",
    line: "attack",
    ticker: "NVDA",
    name: "NVIDIA",
    group: "상위 10 주도주",
    price: "$171.92",
    change: "+1.80%",
    changeValue: 1.8,
    tone: "positive",
    score: "높음",
    issue: "데이터센터 AI 가속기 수요와 공급 우위가 이어지며 공격 라인의 중심이 됐습니다.",
    flow: [
      { label: "3일 전", value: "$166.30", change: "-0.44%", numeric: 166.3 },
      { label: "2일 전", value: "$168.04", change: "+1.05%", numeric: 168.04 },
      { label: "1일 전", value: "$168.88", change: "+0.50%", numeric: 168.88 },
      { label: "현재", value: "$171.92", change: "+1.80%", numeric: 171.92 },
    ],
    points: ["공격 라인에서는 변동성과 주도력을 함께 봅니다.", "SOXX와 QQQ가 같이 오르면 단일 종목보다 넓은 흐름입니다."],
  },
  aapl: {
    id: "aapl",
    line: "attack",
    ticker: "AAPL",
    name: "Apple",
    group: "상위 10 주도주",
    price: "$213.55",
    change: "+1.10%",
    changeValue: 1.1,
    tone: "positive",
    score: "중간",
    issue: "기기 교체 수요와 서비스 매출 기대가 동시에 반영되며 반등했습니다.",
    flow: [
      { label: "3일 전", value: "$209.12", change: "+0.18%", numeric: 209.12 },
      { label: "2일 전", value: "$210.36", change: "+0.59%", numeric: 210.36 },
      { label: "1일 전", value: "$211.23", change: "+0.41%", numeric: 211.23 },
      { label: "현재", value: "$213.55", change: "+1.10%", numeric: 213.55 },
    ],
    points: ["QQQ와 함께 보면 플랫폼 대형주의 방향을 읽기 쉽습니다.", "반도체보다 소비재 성격도 있어 성장주의 폭을 확인합니다."],
  },
  msft: {
    id: "msft",
    line: "attack",
    ticker: "MSFT",
    name: "Microsoft",
    group: "상위 10 주도주",
    price: "$502.11",
    change: "+0.70%",
    changeValue: 0.7,
    tone: "positive",
    score: "중간",
    issue: "클라우드와 업무용 AI 수요가 안정적으로 이어지며 지수 하단을 받쳤습니다.",
    flow: [
      { label: "3일 전", value: "$496.18", change: "+0.11%", numeric: 496.18 },
      { label: "2일 전", value: "$498.70", change: "+0.51%", numeric: 498.7 },
      { label: "1일 전", value: "$498.62", change: "-0.02%", numeric: 498.62 },
      { label: "현재", value: "$502.11", change: "+0.70%", numeric: 502.11 },
    ],
    points: ["지수형 ETF에서 비중이 큰 안정형 공격수입니다.", "급등보다 추세 유지 여부를 확인합니다."],
  },
  tsla: {
    id: "tsla",
    line: "attack",
    ticker: "TSLA",
    name: "Tesla",
    group: "상위 10 주도주",
    price: "$317.82",
    change: "-0.80%",
    changeValue: -0.8,
    tone: "negative",
    score: "높음",
    issue: "인도량 확인 전 경계 매물이 나오며 공격 라인 안에서도 방향이 갈렸습니다.",
    flow: [
      { label: "3일 전", value: "$323.14", change: "+1.40%", numeric: 323.14 },
      { label: "2일 전", value: "$321.02", change: "-0.66%", numeric: 321.02 },
      { label: "1일 전", value: "$320.38", change: "-0.20%", numeric: 320.38 },
      { label: "현재", value: "$317.82", change: "-0.80%", numeric: 317.82 },
    ],
    points: ["공격 라인 안에서 혼자 약하면 테마 분화 신호입니다.", "ETF의 구성 종목 기여도를 통해 영향 범위를 확인합니다."],
  },
  avgo: {
    id: "avgo",
    line: "attack",
    ticker: "AVGO",
    name: "Broadcom",
    group: "상위 10 주도주",
    price: "$276.44",
    change: "+2.30%",
    changeValue: 2.3,
    tone: "positive",
    score: "높음",
    issue: "AI 네트워크 칩 수요가 재평가되며 반도체 ETF를 밀어 올렸습니다.",
    flow: [
      { label: "3일 전", value: "$264.80", change: "-0.20%", numeric: 264.8 },
      { label: "2일 전", value: "$268.14", change: "+1.26%", numeric: 268.14 },
      { label: "1일 전", value: "$270.23", change: "+0.78%", numeric: 270.23 },
      { label: "현재", value: "$276.44", change: "+2.30%", numeric: 276.44 },
    ],
    points: ["NVDA 외 반도체 확산 여부를 보는 공격 카드입니다.", "SOXX 구성 종목 원인과 함께 읽습니다."],
  },
  googl: {
    id: "googl",
    line: "attack",
    ticker: "GOOGL",
    name: "Alphabet",
    group: "상위 10 주도주",
    price: "$195.02",
    change: "+0.32%",
    changeValue: 0.32,
    tone: "positive",
    score: "중간",
    issue: "광고 매출과 클라우드 수익성 기대가 유지되며 완만한 상승 흐름을 보였습니다.",
    flow: [
      { label: "3일 전", value: "$193.76", change: "-0.12%", numeric: 193.76 },
      { label: "2일 전", value: "$194.18", change: "+0.22%", numeric: 194.18 },
      { label: "1일 전", value: "$194.40", change: "+0.11%", numeric: 194.4 },
      { label: "현재", value: "$195.02", change: "+0.32%", numeric: 195.02 },
    ],
    points: ["플랫폼 대형주 흐름을 확인하는 공격 카드입니다.", "기술주 상승이 반도체에만 쏠렸는지 비교합니다."],
  },
};

const formationPresets = {
  "4-3-3": {
    name: "4-3-3",
    counts: { defense: 4, midfield: 3, attack: 3 },
  },
  "3-5-2": {
    name: "3-5-2",
    counts: { defense: 3, midfield: 5, attack: 2 },
  },
  "4-4-2": {
    name: "4-4-2",
    counts: { defense: 4, midfield: 4, attack: 2 },
  },
  "4-1-2-3": {
    name: "4-1-2-3",
    counts: { defense: 4, midfield: 3, attack: 3 },
    slotOverrides: [
      { id: "attack-1", line: "attack", label: "LW", top: 17, left: 24 },
      { id: "attack-2", line: "attack", label: "ST", top: 15, left: 50 },
      { id: "attack-3", line: "attack", label: "RW", top: 17, left: 76 },
      { id: "midfield-1", line: "midfield", label: "LCM", top: 43, left: 36 },
      { id: "midfield-2", line: "midfield", label: "RCM", top: 43, left: 64 },
      { id: "midfield-3", line: "midfield", label: "DM", top: 57, left: 50 },
      { id: "defense-1", line: "defense", label: "LB", top: 80, left: 20 },
      { id: "defense-2", line: "defense", label: "LCB", top: 82, left: 40 },
      { id: "defense-3", line: "defense", label: "RCB", top: 82, left: 60 },
      { id: "defense-4", line: "defense", label: "RB", top: 80, left: 80 },
    ],
  },
  custom: {
    name: "커스텀",
    counts: { defense: 4, midfield: 3, attack: 3 },
  },
};

function isValidCounts(counts) {
  const total = lineOrder.reduce((sum, line) => sum + counts[line], 0);
  return total === squadRules.total && lineOrder.every((line) => counts[line] >= squadRules[line].min && counts[line] <= squadRules[line].max);
}

function buildLineup(counts, previousFormation = {}) {
  const nextFormation = {};
  lineOrder.forEach((line) => {
    const previousByLine = Object.entries(previousFormation)
      .filter(([, assetId]) => assets[assetId]?.line === line)
      .map(([, assetId]) => assetId);
    const candidates = [...previousByLine, ...lineDefaults[line]].filter((assetId, index, list) => list.indexOf(assetId) === index);

    for (let index = 0; index < counts[line]; index += 1) {
      nextFormation[`${line}-${index + 1}`] = candidates[index] || "";
    }
  });
  return nextFormation;
}

function distributeSlots(line, count, top) {
  const leftSets = {
    1: [50],
    2: [35, 65],
    3: [24, 50, 76],
    4: [20, 40, 60, 80],
    5: [14, 32, 50, 68, 86],
  };
  const topOffsets = {
    1: [0],
    2: [0, 0],
    3: [1, -1, 1],
    4: [0, 2, 2, 0],
    5: [1, -1, 1, -1, 1],
  };
  const widthByCount = {
    1: "min(142px, 22%)",
    2: "min(142px, 22%)",
    3: "min(136px, 21%)",
    4: "min(118px, 18%)",
    5: "min(98px, 16%)",
  };
  const labels = slotLabelSets[line][count];
  return leftSets[count].map((left, index) => ({
    id: `${line}-${index + 1}`,
    line,
    label: labels[index],
    top: top + topOffsets[count][index],
    left,
    width: widthByCount[count],
  }));
}

function getActiveFormationConfig() {
  if (state.formationKey === "custom") {
    return { ...formationPresets.custom, counts: { ...state.formationCounts }, name: `커스텀 ${state.formationCounts.defense}-${state.formationCounts.midfield}-${state.formationCounts.attack}` };
  }
  return formationPresets[state.formationKey];
}

function getSlots() {
  const config = getActiveFormationConfig();
  if (config.slotOverrides) {
    return config.slotOverrides.map((slot) => ({
      ...slot,
      width: slot.line === "midfield" ? "min(128px, 20%)" : "min(118px, 18%)",
    }));
  }

  return [
    ...distributeSlots("attack", config.counts.attack, 17),
    ...distributeSlots("midfield", config.counts.midfield, 49),
    ...distributeSlots("defense", config.counts.defense, 80),
  ];
}

const news = [
  { tag: "미드", ticker: "SOXX", title: "반도체 ETF가 지수보다 강한 흐름", body: "AI 서버와 HBM 기대가 동시에 반영됐습니다." },
  { tag: "수비", ticker: "국고3Y", title: "금리 하락 기대가 채권 가격 지지", body: "수비 라인의 완충 역할이 커졌습니다." },
  { tag: "공격", ticker: "NVDA", title: "AI 주도주가 재차 전진", body: "QQQ와 SOXX 동반 강세 여부가 핵심입니다." },
  { tag: "국내", ticker: "KODEX200", title: "국내 지수는 업종별 온도 차", body: "반도체와 2차전지의 방향이 갈렸습니다." },
];

const moversA = [
  ["AVGO", "Broadcom", "+2.30%"],
  ["NVDA", "NVIDIA", "+1.80%"],
  ["AMD", "Advanced Micro Devices", "+1.50%"],
  ["AAPL", "Apple", "+1.10%"],
  ["QQQ", "Nasdaq 100 ETF", "+0.86%"],
];

const moversB = [
  ["TSLA", "Tesla", "-0.80%"],
  ["LLY", "Eli Lilly", "-0.50%"],
  ["INTC", "Intel", "-0.40%"],
  ["VZ", "Verizon", "-0.30%"],
  ["KODEX200", "Korea 200 ETF", "-0.18%"],
];

const state = {
  formationKey: "4-3-3",
  formationCounts: { ...formationPresets["4-3-3"].counts },
  customDraft: { ...formationPresets.custom.counts },
  formation: buildLineup(formationPresets["4-3-3"].counts),
  selectedId: "qqq",
  pickedId: null,
  draggingId: null,
  filter: "all",
  moverSet: "up",
};

const pitch = document.querySelector("#pitch");
const benchList = document.querySelector("#benchList");
const assetDetail = document.querySelector("#assetDetail");
const reportPanel = document.querySelector("#reportPanel");
const newsList = document.querySelector("#newsList");
const moverList = document.querySelector("#moverList");
const toast = document.querySelector("#toast");
const formationName = document.querySelector("#formationName");
const squadCount = document.querySelector("#squadCount");
const customRuleStatus = document.querySelector("#customRuleStatus");
const applyCustomFormation = document.querySelector("#applyCustomFormation");

function signedClass(value) {
  if (value > 0) return "positive";
  if (value < 0) return "negative";
  return "neutral";
}

function render() {
  renderFormationMeta();
  renderPitch();
  renderBench();
  renderDetail();
  renderReport();
  renderNews();
  renderMovers();
  renderSignals();
}

function renderFormationMeta() {
  const config = getActiveFormationConfig();
  const placedCount = Object.values(state.formation).filter(Boolean).length;
  const draftTotal = lineOrder.reduce((sum, line) => sum + state.customDraft[line], 0);
  const draftValid = isValidCounts(state.customDraft);

  formationName.textContent = config.name;
  squadCount.textContent = `${placedCount}/${squadRules.total}`;
  customRuleStatus.textContent = `총 ${draftTotal}/${squadRules.total}`;
  customRuleStatus.classList.toggle("is-valid", draftValid);
  customRuleStatus.classList.toggle("is-invalid", !draftValid);
  applyCustomFormation.disabled = !draftValid;

  lineOrder.forEach((line) => {
    const value = document.querySelector(`[data-custom-value="${line}"]`);
    if (value) value.textContent = state.customDraft[line];
  });

  document.querySelectorAll("[data-custom-adjust]").forEach((button) => {
    const [line, deltaText] = button.dataset.customAdjust.split(":");
    const delta = Number(deltaText);
    const nextValue = state.customDraft[line] + delta;
    button.disabled = nextValue < squadRules[line].min || nextValue > squadRules[line].max;
  });
}

function renderPitch() {
  pitch.querySelectorAll(".slot").forEach((node) => node.remove());

  getSlots().forEach((slot) => {
    const slotNode = document.createElement("div");
    slotNode.className = "slot";
    slotNode.dataset.slotId = slot.id;
    slotNode.dataset.line = slot.line;
    slotNode.style.top = `${slot.top}%`;
    slotNode.style.left = `${slot.left}%`;
    slotNode.style.setProperty("--slot-width", slot.width);
    slotNode.addEventListener("dragover", handleDragOver);
    slotNode.addEventListener("dragleave", clearDropState);
    slotNode.addEventListener("drop", handleDrop);
    slotNode.addEventListener("click", () => handleSlotClick(slot.id));

    const asset = assets[state.formation[slot.id]];
    if (asset) {
      slotNode.appendChild(createFormationCard(asset, slot));
    } else {
      const empty = document.createElement("div");
      empty.className = "slot-empty";
      empty.textContent = `${slot.label} · ${lineLabels[slot.line]}`;
      slotNode.appendChild(empty);
    }

    pitch.appendChild(slotNode);
  });
}

function createFormationCard(asset, slot) {
  const card = document.createElement("article");
  card.className = `formation-card${asset.id === state.selectedId ? " is-selected" : ""}`;
  card.dataset.assetId = asset.id;
  card.dataset.line = asset.line;
  card.draggable = true;
  card.innerHTML = `
    <div class="card-kicker">
      <span>${slot.label}</span>
      <span class="line-badge ${asset.line}">${lineLabels[asset.line]}</span>
    </div>
    <strong class="card-name">${asset.ticker}</strong>
    <div class="card-price">
      <span>${asset.price}</span>
      <strong class="${asset.tone}">${asset.change}</strong>
    </div>
  `;
  card.addEventListener("click", (event) => {
    event.stopPropagation();
    if (state.pickedId && state.pickedId !== asset.id) {
      const slotId = card.closest(".slot")?.dataset.slotId;
      placeAsset(state.pickedId, slotId);
      return;
    }
    selectAsset(asset.id);
  });
  card.addEventListener("dragstart", (event) => {
    state.draggingId = asset.id;
    event.dataTransfer.setData("text/plain", asset.id);
    event.dataTransfer.effectAllowed = "move";
  });
  card.addEventListener("dragend", () => {
    state.draggingId = null;
    clearDropState();
  });
  return card;
}

function renderBench() {
  const used = new Set(Object.values(state.formation));
  const benchAssets = Object.values(assets)
    .filter((asset) => !used.has(asset.id))
    .filter((asset) => state.filter === "all" || asset.line === state.filter)
    .sort((a, b) => a.line.localeCompare(b.line) || b.changeValue - a.changeValue);

  benchList.innerHTML = "";
  benchAssets.forEach((asset) => {
    const card = document.createElement("article");
    card.className = `bench-card${state.pickedId === asset.id ? " is-picked" : ""}`;
    card.draggable = true;
    card.dataset.assetId = asset.id;
    card.innerHTML = `
      <span class="line-badge ${asset.line}">${lineLabels[asset.line]}</span>
      <strong>${asset.ticker}</strong>
      <span>${asset.name}</span>
    `;
    card.addEventListener("click", () => {
      state.pickedId = state.pickedId === asset.id ? null : asset.id;
      selectAsset(asset.id);
      renderBench();
    });
    card.addEventListener("dragstart", (event) => {
      state.draggingId = asset.id;
      event.dataTransfer.setData("text/plain", asset.id);
      event.dataTransfer.effectAllowed = "move";
    });
    card.addEventListener("dragend", () => {
      state.draggingId = null;
      clearDropState();
    });
    benchList.appendChild(card);
  });
}

function renderDetail() {
  const asset = assets[state.selectedId] || assets.qqq;
  assetDetail.innerHTML = `
    <div class="detail-heading">
      <span class="detail-badge ${asset.line}">${lineLabels[asset.line]}</span>
      <h2>${asset.name}</h2>
      <p>${asset.ticker} · ${asset.group}</p>
    </div>
    <div class="metric-grid">
      <div class="metric"><span>현재</span><strong>${asset.price}</strong></div>
      <div class="metric"><span>변화</span><strong class="${asset.tone}">${asset.change}</strong></div>
      <div class="metric"><span>변동성</span><strong>${asset.score}</strong></div>
    </div>
    <div class="detail-subtitle">흐름</div>
    ${createSparkline(asset.flow)}
    <div class="flow-list">
      ${asset.flow.map((flow) => `
        <div class="flow-row">
          <span>${flow.label}</span>
          <strong>${flow.value}</strong>
          <strong class="${flow.change.includes("-") ? "negative" : flow.change === "0.00%p" ? "neutral" : "positive"}">${flow.change}</strong>
        </div>
      `).join("")}
    </div>
    <div class="detail-subtitle">이슈</div>
    <div class="report-line"><p>${asset.issue}</p></div>
    ${asset.holdings ? `
      <div class="detail-subtitle">ETF 구성 종목 원인</div>
      <div class="holding-list">
        ${asset.holdings.map((holding) => `
          <div class="holding-row">
            <strong>${holding.ticker}</strong>
            <div>
              <span>${holding.weight}</span>
              <p>${holding.reason}</p>
            </div>
            <strong class="${holding.change.includes("-") ? "negative" : "positive"}">${holding.change}</strong>
          </div>
        `).join("")}
      </div>
    ` : ""}
  `;
}

function createSparkline(flow) {
  const values = flow.map((item) => item.numeric);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values.map((value, index) => {
    const x = 18 + index * (264 / (values.length - 1));
    const y = 70 - ((value - min) / range) * 48;
    return `${x},${y}`;
  }).join(" ");
  const circles = values.map((value, index) => {
    const x = 18 + index * (264 / (values.length - 1));
    const y = 70 - ((value - min) / range) * 48;
    return `<circle cx="${x}" cy="${y}" r="4"></circle>`;
  }).join("");

  return `
    <svg class="sparkline" viewBox="0 0 300 90" role="img" aria-label="최근 흐름 그래프">
      <polyline points="${points}"></polyline>
      ${circles}
    </svg>
  `;
}

function renderReport() {
  const config = getActiveFormationConfig();
  const placedAssets = Object.values(state.formation).map((id) => assets[id]).filter(Boolean);
  const byLine = {
    defense: placedAssets.filter((asset) => asset.line === "defense"),
    midfield: placedAssets.filter((asset) => asset.line === "midfield"),
    attack: placedAssets.filter((asset) => asset.line === "attack"),
  };
  const midfieldEtfs = byLine.midfield;
  const positiveAttack = byLine.attack.filter((asset) => asset.changeValue > 0).length;
  const negativeAttack = byLine.attack.length - positiveAttack;
  const etfDrivers = midfieldEtfs
    .flatMap((asset) => (asset.holdings || []).slice(0, 2).map((holding) => `${asset.ticker}/${holding.ticker}: ${holding.reason}`))
    .slice(0, 4);

  reportPanel.innerHTML = `
    <h2>${config.name} 포메이션 보고서</h2>
    <div class="report-lines">
      <div class="report-line">
        <strong>스쿼드 규칙</strong>
        <p>총 ${placedAssets.length}/${squadRules.total}개 자산으로 구성됩니다. 공격수는 1-4명, 미드필더와 수비는 각각 1-5명 범위 안에서만 설정할 수 있습니다.</p>
      </div>
      <div class="report-line">
        <strong>수비 라인</strong>
        <p>${byLine.defense.map((asset) => asset.ticker).join(", ")}가 변동성 완충 역할을 맡습니다. 금리형 카드의 움직임이 작으면 공격 라인의 신호를 더 또렷하게 볼 수 있습니다.</p>
      </div>
      <div class="report-line">
        <strong>미드 라인</strong>
        <p>${midfieldEtfs.map((asset) => asset.ticker).join(", ")}를 통해 시장 폭을 확인합니다. ETF가 같이 오르면 개별 주도주가 아니라 섹터와 지수로 흐름이 확산된 상태입니다.</p>
      </div>
      <div class="report-line">
        <strong>공격 라인</strong>
        <p>공격수 ${byLine.attack.length}개 중 ${positiveAttack}개가 상승, ${negativeAttack}개가 하락입니다. 공격 라인이 엇갈리면 테마 내부 분화를 먼저 봅니다.</p>
      </div>
      <div class="report-line">
        <strong>ETF 구성 원인</strong>
        <p>${etfDrivers.join(" · ")}</p>
      </div>
    </div>
  `;
}

function renderNews() {
  newsList.innerHTML = "";
  document.querySelector("#newsCount").textContent = `${news.length}건`;
  news.forEach((item) => {
    const node = document.createElement("article");
    node.className = "news-item";
    node.innerHTML = `
      <header>
        <span>${item.tag}</span>
        <span>${item.ticker}</span>
      </header>
      <strong>${item.title}</strong>
      <p>${item.body}</p>
    `;
    newsList.appendChild(node);
  });
}

function renderMovers() {
  const movers = state.moverSet === "up" ? moversA : moversB;
  moverList.innerHTML = "";
  movers.forEach((item, index) => {
    const node = document.createElement("article");
    const isNegative = item[2].startsWith("-");
    node.className = "mover-item";
    node.innerHTML = `
      <strong class="rank">${index + 1}</strong>
      <div>
        <strong>${item[0]}</strong>
        <span>${item[1]}</span>
      </div>
      <strong class="${isNegative ? "negative" : "positive"}">${item[2]}</strong>
    `;
    moverList.appendChild(node);
  });
}

function renderSignals() {
  const placedAssets = Object.values(state.formation).map((id) => assets[id]).filter(Boolean);
  const avg = placedAssets.reduce((sum, asset) => sum + asset.changeValue, 0) / placedAssets.length;
  const midfield = placedAssets.filter((asset) => asset.line === "midfield");
  const attack = placedAssets.filter((asset) => asset.line === "attack");
  const midPositive = midfield.filter((asset) => asset.changeValue > 0).length;
  const attackLeader = [...attack].sort((a, b) => b.changeValue - a.changeValue)[0];

  document.querySelector("#marketMood").textContent = avg > 0.45 ? "위험 선호" : avg < 0 ? "방어 우위" : "중립 상승";
  document.querySelector("#midfieldSignal").textContent = `${midPositive}/${midfield.length} ETF 상승`;
  document.querySelector("#attackSignal").textContent = `${attackLeader.ticker} 주도`;
}

function handleDragOver(event) {
  event.preventDefault();
  const slotNode = event.currentTarget;
  const draggedId = state.draggingId || event.dataTransfer.getData("text/plain");
  const asset = assets[draggedId] || assets[state.pickedId];
  clearDropState(event);
  if (asset && asset.line === slotNode.dataset.line) {
    slotNode.classList.add("can-drop");
  } else {
    slotNode.classList.add("cannot-drop");
  }
}

function clearDropState(event) {
  const container = event?.currentTarget || pitch;
  container.querySelectorAll?.(".slot").forEach((slotNode) => {
    slotNode.classList.remove("can-drop", "cannot-drop");
  });
  if (container.classList?.contains("slot")) {
    container.classList.remove("can-drop", "cannot-drop");
  }
}

function handleDrop(event) {
  event.preventDefault();
  const assetId = state.draggingId || event.dataTransfer.getData("text/plain");
  placeAsset(assetId, event.currentTarget.dataset.slotId);
  clearDropState(event);
}

function handleSlotClick(slotId) {
  const placedId = state.formation[slotId];
  if (state.pickedId) {
    placeAsset(state.pickedId, slotId);
    return;
  }
  if (placedId) {
    selectAsset(placedId);
  }
}

function placeAsset(assetId, slotId) {
  const asset = assets[assetId];
  const slot = getSlots().find((item) => item.id === slotId);
  if (!asset || !slot) return;

  if (asset.line !== slot.line) {
    showToast(`${asset.ticker}는 ${lineLabels[asset.line]} 카드입니다. ${lineLabels[slot.line]} 칸에는 ${lineRules[slot.line]}할 수 있습니다.`);
    return;
  }

  const previousSlot = Object.entries(state.formation).find(([, id]) => id === assetId)?.[0];
  if (previousSlot) {
    state.formation[previousSlot] = state.formation[slotId];
  }
  state.formation[slotId] = assetId;
  state.pickedId = null;
  state.selectedId = assetId;
  render();
}

function selectAsset(assetId) {
  state.selectedId = assetId;
  renderPitch();
  renderDetail();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 3200);
}

function pickSelectedAsset() {
  if (Object.values(state.formation).includes(state.selectedId)) return state.selectedId;
  return Object.entries(state.formation).find(([slotId]) => slotId.startsWith("midfield-"))?.[1] || Object.values(state.formation).find(Boolean);
}

function applyFormation(key) {
  if (key === "custom" && !isValidCounts(state.customDraft)) {
    showToast("커스텀 포메이션은 공격 1-4, 미드/수비 1-5 범위에서 총 10개일 때만 적용할 수 있습니다.");
    renderFormationMeta();
    return;
  }

  const counts = key === "custom" ? { ...state.customDraft } : { ...formationPresets[key].counts };
  state.formationKey = key;
  state.formationCounts = counts;
  if (key !== "custom") {
    state.customDraft = { ...counts };
  }
  state.formation = buildLineup(counts, state.formation);
  state.selectedId = pickSelectedAsset();
  state.pickedId = null;

  document.querySelectorAll("[data-formation-key]").forEach((node) => {
    node.classList.toggle("is-active", node.dataset.formationKey === key);
  });
  render();
}

document.querySelectorAll("[data-formation-key]").forEach((button) => {
  button.addEventListener("click", () => {
    applyFormation(button.dataset.formationKey);
  });
});

document.querySelectorAll("[data-custom-adjust]").forEach((button) => {
  button.addEventListener("click", () => {
    const [line, deltaText] = button.dataset.customAdjust.split(":");
    const delta = Number(deltaText);
    const nextValue = state.customDraft[line] + delta;
    if (nextValue < squadRules[line].min || nextValue > squadRules[line].max) return;
    state.customDraft[line] = nextValue;
    renderFormationMeta();
  });
});

applyCustomFormation.addEventListener("click", () => {
  applyFormation("custom");
});

document.querySelectorAll("[data-line-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-line-filter]").forEach((node) => node.classList.remove("is-active"));
    button.classList.add("is-active");
    state.filter = button.dataset.lineFilter;
    renderBench();
  });
});

document.querySelector("#rotateMovers").addEventListener("click", () => {
  state.moverSet = state.moverSet === "up" ? "down" : "up";
  renderMovers();
});

document.querySelector("#refreshReport").addEventListener("click", () => {
  renderReport();
  showToast("포메이션 기준 보고서를 다시 계산했습니다.");
});

document.querySelector("#downloadReport").addEventListener("click", () => {
  const reportText = reportPanel.innerText;
  const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "etf-board-report.txt";
  anchor.click();
  URL.revokeObjectURL(url);
});

render();
