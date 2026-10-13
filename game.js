(() => {
'use strict';

// ============================================================
// データ
// ============================================================
// soft: 大きいほど早く潰れる（＝難しい）
const SQUISHIES = [
  { id: 'bombo',    name: 'ふわボンボロ',       rarity: 'N',   shape: 'round',   body: '#f6c886', shade: '#d9964a', deco: 'sugar',     soft: 1.0 },
  { id: 'mochi',    name: 'もっちり大福',       rarity: 'N',   shape: 'dome',    body: '#fff7f2', shade: '#ecd3c8', deco: 'dust',      soft: 0.85 },
  { id: 'pudding',  name: 'ぷるぷるプリン',     rarity: 'N',   shape: 'pudding', body: '#ffe38f', shade: '#eab64a', top: '#93501f', deco: 'none', soft: 1.2 },
  { id: 'macaron',  name: 'ぱふマカロン',       rarity: 'N',   shape: 'macaron', body: '#ffb8cc', shade: '#ef87a5', deco: 'none',      soft: 1.0 },
  { id: 'onigiri',  name: 'むぎゅおにぎり',     rarity: 'N',   shape: 'tri2',    body: '#f6f3ea', shade: '#d9d2c2', deco: 'nori', style: 'real', img: 'assets/sq/onigiri.png', soft: 0.9 },
  { id: 'melon',    name: 'さくもちメロンパン', rarity: 'R',   shape: 'round',   body: '#dcef92', shade: '#a9c75a', deco: 'grid',      soft: 0.9 },
  { id: 'dubai',    name: 'ドバチョコもち',     rarity: 'R',   shape: 'dome',    body: '#b07a52', shade: '#5b341f', deco: 'pistachio', ink: '#2a1208', soft: 0.85 },
  { id: 'sago',     name: 'つぶつぶサゴ',       rarity: 'R',   shape: 'round',   body: '#ffd9e6', shade: '#f2a9c2', deco: 'pearls',    soft: 1.1 },
  { id: 'yoajon',   name: 'もりもりヨアジョン', rarity: 'R',   shape: 'dome',    body: '#fffdf6', shade: '#e9e1cf', deco: 'berries',   soft: 1.0 },
  { id: 'mari',     name: 'クリームマリトッツォ', rarity: 'SR', shape: 'round',  body: '#eaa95e', shade: '#c27a33', deco: 'cream',     soft: 1.05 },
  { id: 'mizu',     name: 'みずまんじゅう',     rarity: 'SR',  shape: 'dome',    body: 'rgba(170,222,255,0.78)', shade: 'rgba(110,180,235,0.85)', deco: 'water', soft: 1.35 },
  { id: 'kuma',     name: 'きらきらゼリーくま', rarity: 'SSR', shape: 'bear',    body: '#ff9cc2', shade: '#e8679a', deco: 'sparkle',   soft: 1.15 },
  // ---- 第2弾 ----
  { id: 'ichigo',    name: 'いちご大福',         rarity: 'N',   shape: 'dome',    body: '#fff5f5', shade: '#f0cfd2', deco: 'berries', soft: 0.85 },
  { id: 'takoyaki',  name: 'ころころたこ焼き',   rarity: 'N',   shape: 'round',   body: '#d9944e', shade: '#a96324', deco: 'none',    soft: 1.0 },
  { id: 'kurocchi',  name: 'サクもちクロッチ',   rarity: 'R',   shape: 'dome',    body: '#e8b46a', shade: '#bf8436', deco: 'none',    soft: 0.95 },
  { id: 'fruitsand', name: 'フルーツサンド',     rarity: 'R',   shape: 'tri',     body: '#fffaf0', shade: '#ead9c0', deco: 'berries', soft: 1.05 },
  { id: 'pancake',   name: 'ふわふわパンケーキ', rarity: 'SR',  shape: 'pudding', body: '#f3c27c', shade: '#cf9447', top: '#f7e2a6', deco: 'none', soft: 1.2 },
  { id: 'wataame',   name: 'にじいろわたあめ',   rarity: 'SSR', shape: 'round',   body: '#ffd6f0', shade: '#c9b6ff', deco: 'sparkle', soft: 1.3 },
  // ---- 期間限定（ハロウィン）----
  { id: 'hw_pumpkin', name: 'かぼちゃプリン',     rarity: 'SR', shape: 'pudding', body: '#ffb35c', shade: '#e0802a', top: '#93501f', deco: 'none', soft: 1.15, limited: 'halloween' },
  { id: 'hw_ghost',   name: 'おばけマシュマロ',   rarity: 'R',  shape: 'dome',    body: '#ffffff', shade: '#e6dff0', deco: 'dust', soft: 1.0,  limited: 'halloween' },
  { id: 'hw_bat',     name: 'こうもりマカロン',   rarity: 'R',  shape: 'macaron', body: '#c9a6f0', shade: '#9b72d0', deco: 'none', soft: 1.0,  limited: 'halloween' },
  { id: 'hw_candy',   name: 'キャンディコーンゼリー', rarity: 'R', shape: 'tri',  body: '#ffd166', shade: '#f28c28', deco: 'none', soft: 1.15, limited: 'halloween' },
  { id: 'hw_mummy',   name: 'ミイラ大福',         rarity: 'SR', shape: 'dome',    body: '#fffaf0', shade: '#e6dcc8', deco: 'dust', soft: 0.9,  limited: 'halloween' },
];
// 絵は assets/sq/<id>.png（AI生成→tools/cutout.pyで透過）。無い・読めない時はプログラム描画にフォールバック
for (const s of SQUISHIES) s.img = s.img || `assets/sq/${s.id}.png`;
const SQ_BY_ID = Object.fromEntries(SQUISHIES.map(s => [s.id, s]));
// おじゃまスクイーズ（図鑑には入らない）
const SPICY = { id: 'spicy', name: 'げきからスクイーズ', rarity: '-', shape: 'round', body: '#ff6a45', shade: '#c9301c', deco: 'seeds', ink: '#3a0a05', mood: 'angry', soft: 1, img: 'assets/sq/spicy.png' };
const SHINY_RATE = 0.05, SHINY_RATE_FEVER = 0.14, SHINY_RATE_GACHA = 0.05;
const RARITY_RATE = { N: 60, R: 28, SR: 10, SSR: 2 };
const GACHA_COST = 100;
const DUP_REFUND = 20;

const ORDERS = [
  { key: 'fuwa',     text: 'ふわっと にぎって〜',   c: 0.32,  w: 0.22, mul: 1.0, wt: 3 },
  { key: 'shikkari', text: 'しっかり にぎにぎ！',   c: 0.57,  w: 0.19, mul: 1.2, wt: 3 },
  { key: 'gyu',      text: 'ぎゅ〜〜っと！',        c: 0.78,  w: 0.16, mul: 1.5, wt: 2.4 },
  { key: 'giri',     text: 'こわれる寸前まで…！',   c: 0.935, w: 0.09, mul: 2.2, wt: 1.2 },
];

const RANKS = [
  [0,    'にぎにぎ見習い'],
  [1500, 'ふわふわ職人'],
  [3500, 'もちもちマイスター'],
  [6000, 'むぎゅむぎゅ名人'],
  [9000, '伝説のにぎりびと'],
];
const rankOf = sc => RANKS.reduce((a, r) => (sc >= r[0] ? r[1] : a), RANKS[0][1]);

const ROUND_SEC = 60;

// ============================================================
// セーブ（ローカルのみ・失敗しても動く）
// ============================================================
// ?rec=1 で撮影モード（本番と別のセーブで、全キャラ・通貨使い放題）
const REC = new URLSearchParams(location.search).has('rec');
const SAVE_KEY = REC ? 'nigisq_rec' : 'nigisq_v1';
function loadSave() {
  if (REC) {
    try { const j = JSON.parse(localStorage.getItem(SAVE_KEY)); if (j && j.owned) return j; } catch (e) {}
    const owned = {}, shiny = {};
    SQUISHIES.forEach(s => { owned[s.id] = 5; });
    ['kuma', 'wataame', 'mari', 'mizu', 'pancake'].forEach(id => { shiny[id] = 1; });
    return { coins: 99999, gems: 99999, best: 0, owned, shiny, kanban: 'kuma', xp: 200000, stamina: { n: 99, t: Date.now() } };
  }
  try {
    const j = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (j && j.owned) return j;
  } catch (e) {}
  return { coins: 0, best: 0, owned: { bombo: 1, mochi: 1, pudding: 1 } };
}
let sv = loadSave();
function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(sv)); } catch (e) {} }
// 古いセーブにも新しい項目を足す
sv.xp = sv.xp || 0;
sv.decor = sv.decor || { bg: 'pink', plate: 'lace', bgm: 'normal' };
sv.bought = sv.bought || { pink: 1, lace: 1, normal: 1 };
sv.daily = sv.daily || {};
if (sv.gems == null) sv.gems = 50;       // はじめにすこしだけ
sv.pity = sv.pity || 0;
sv.week = sv.week || { id: null, best: 0 };
sv.pass = sv.pass || {};
sv.stamina = sv.stamina || { n: 5, t: Date.now() };
sv.items = sv.items || { drink: 1 };       // はじめに ドリンク1こ

// ============================================================
// プレイの補正値（看板の特技・今日のお題・お店レベルをここに集める）
// ============================================================
function baseMods() {
  return {
    perfectZone: 1, squeezeSpeed: 1, feverCombo: 8, burstGuard: 0, spicyWait: 1.6, spicyMul: 1,
    coinMul: 1, shinyMul: 1, startTime: 60, multiMul: 1, sideWiden: 1, picky: 1, scoreMul: 1,
    comboTime: null, widthMul: 1, spicyRate: 0.11, multiRate: 0.13, sideRate: 0.13, orderKeys: null, narrowBias: 0,
  };
}

// ---- A. 看板スクイーズの特技（同じスクイーズを集めるほどLvが上がる・最大Lv5）----
const skillLv = id => Math.max(1, Math.min(5, (sv.owned && sv.owned[id]) || 1));
const SKILLS = {
  bombo:   { name: 'コインざくざく',     desc: l => `もらえるコイン +${10 + 5 * (l - 1)}%`,            apply: (m, l) => { m.coinMul *= 1.10 + 0.05 * (l - 1); } },
  mochi:   { name: 'もっちりボディ',     desc: l => `つぶれるのが ${8 + 2 * (l - 1)}% ゆっくり`,       apply: (m, l) => { m.squeezeSpeed *= 0.92 - 0.02 * (l - 1); } },
  pudding: { name: 'ゆとりのカラメル',   desc: l => `はじまりの時間 +${3 + (l - 1)}びょう`,            apply: (m, l) => { m.startTime += 3 + (l - 1); } },
  macaron: { name: 'サンドの名手',       desc: l => `「3かい にぎにぎ」の点 ×${(1.3 + 0.1 * (l - 1)).toFixed(1)}`, apply: (m, l) => { m.multiMul *= 1.3 + 0.1 * (l - 1); } },
  onigiri: { name: '和の心',             desc: l => `げきからの がまん ${(1.6 - 0.1 * l).toFixed(1)}びょう・点 ×${(1.5 + 0.1 * l).toFixed(1)}`, apply: (m, l) => { m.spicyWait = 1.6 - 0.1 * l; m.spicyMul *= 1.5 + 0.1 * l; } },
  melon:   { name: 'すみっこ名人',       desc: l => `「はしを ぎゅっ」の帯 ${25 + 5 * (l - 1)}% ひろい`, apply: (m, l) => { m.sideWiden *= 1.25 + 0.05 * (l - 1); } },
  dubai:   { name: 'ザクザクガード',     desc: l => `ぱーんしても 時間がへらない（${l >= 3 ? 2 : 1}回まで）`, apply: (m, l) => { m.burstGuard += l >= 3 ? 2 : 1; } },
  sago:    { name: 'つぶつぶラッキー',   desc: l => `キラが でやすい ×${(1.5 + 0.25 * (l - 1)).toFixed(2)}`, apply: (m, l) => { m.shinyMul *= 1.5 + 0.25 * (l - 1); } },
  yoajon:  { name: 'こだわり歓迎',       desc: l => `こだわり客の点 さらに ×${(1.15 + 0.05 * (l - 1)).toFixed(2)}`, apply: (m, l) => { m.picky *= 1.15 + 0.05 * (l - 1); } },
  mari:    { name: 'クリームフィーバー', desc: l => `${l >= 5 ? 5 : l >= 3 ? 6 : 7}コンボで フィーバー`, apply: (m, l) => { m.feverCombo = Math.min(m.feverCombo, l >= 5 ? 5 : l >= 3 ? 6 : 7); } },
  mizu:    { name: 'みずみずしさ',       desc: l => `5コンボごとに +${l >= 3 ? 2 : 1}びょう`,            apply: (m, l) => { m.comboTime = { every: 5, sec: l >= 3 ? 2 : 1 }; } },
  kuma:    { name: 'ぷるぷるジェリー',   desc: l => `PERFECTの はんい ×${(1.4 + 0.1 * (l - 1)).toFixed(1)}`, apply: (m, l) => { m.perfectZone *= 1.4 + 0.1 * (l - 1); } },
  ichigo:    { name: 'あまずっぱい',       desc: l => `こだわり客の点 さらに ×${(1.08 + 0.04 * (l - 1)).toFixed(2)}`, apply: (m, l) => { m.picky *= 1.08 + 0.04 * (l - 1); } },
  takoyaki:  { name: 'ころがし上手',       desc: l => `「はしを ぎゅっ」の帯 ${10 + 5 * (l - 1)}% ひろい`, apply: (m, l) => { m.sideWiden *= 1.1 + 0.05 * (l - 1); } },
  kurocchi:  { name: 'サクもち食感',       desc: l => `PERFECTの はんい ×${(1.2 + 0.05 * (l - 1)).toFixed(2)}`, apply: (m, l) => { m.perfectZone *= 1.2 + 0.05 * (l - 1); } },
  fruitsand: { name: 'ボリューム満点',     desc: l => `もらえるコイン +${8 + 4 * (l - 1)}%`, apply: (m, l) => { m.coinMul *= 1.08 + 0.04 * (l - 1); } },
  pancake:   { name: 'ふわふわ3だん',      desc: l => `4コンボごとに +${l >= 3 ? 2 : 1}びょう`, apply: (m, l) => { m.comboTime = { every: 4, sec: l >= 3 ? 2 : 1 }; } },
  wataame:   { name: 'ゆめいろ',           desc: l => `すべての点 ×${(1.1 + 0.04 * (l - 1)).toFixed(2)}・PERFECTの はんい ×1.2`, apply: (m, l) => { m.scoreMul *= 1.1 + 0.04 * (l - 1); m.perfectZone *= 1.2; } },
  hw_candy:  { name: 'トリックオアトリート', desc: l => `げきからの点 ×${(1.5 + 0.1 * l).toFixed(1)}・がまん -0.1びょう`, apply: (m, l) => { m.spicyMul *= 1.5 + 0.1 * l; m.spicyWait -= 0.1; } },
  hw_mummy:  { name: 'ぐるぐるガード',     desc: l => `ぱーん${l >= 3 ? 2 : 1}回まで ノーカン・はじまり +2びょう`, apply: (m, l) => { m.burstGuard += l >= 3 ? 2 : 1; m.startTime += 2; } },
  hw_pumpkin: { name: 'ハロウィンパワー', desc: l => `すべての点 ×${(1.05 + 0.03 * (l - 1)).toFixed(2)}`, apply: (m, l) => { m.scoreMul *= 1.05 + 0.03 * (l - 1); } },
  hw_ghost:   { name: 'すりぬけ',         desc: l => `ぱーん${l >= 3 ? 2 : 1}回まで ノーカン・げきから がまん -0.2びょう`, apply: (m, l) => { m.burstGuard += l >= 3 ? 2 : 1; m.spicyWait -= 0.2; } },
  hw_bat:     { name: 'よるのつばさ',     desc: l => `PERFECTの はんい ×1.2・キラ ×${(1.3 + 0.1 * (l - 1)).toFixed(1)}`, apply: (m, l) => { m.perfectZone *= 1.2; m.shinyMul *= 1.3 + 0.1 * (l - 1); } },
};
const skillText = id => { const s = SKILLS[id]; return s ? `${s.name}：${s.desc(skillLv(id))}` : ''; };

// ---- B. 今日のお題（日付で決まる・全員同じ）----
const RULES = [
  { id: 'spicy',  name: '激辛デー',         desc: 'げきから客が いっぱい。がまんの点 ×2', apply: m => { m.spicyRate = 0.3; m.spicyMul *= 2; } },
  { id: 'picky',  name: 'こだわり客だらけ', desc: '帯が ほそい客が多い。こだわり点 ×1.2', apply: m => { m.narrowBias = 0.5; m.picky *= 1.2; } },
  { id: 'kira',   name: 'キラ祭り',         desc: 'キラが 3ばい でやすい',                apply: m => { m.shinyMul *= 3; } },
  { id: 'speed',  name: 'スピードデー',     desc: 'つぶれるのが はやい。点 ×1.3',         apply: m => { m.squeezeSpeed *= 1.25; m.scoreMul *= 1.3; } },
  { id: 'fuwa',   name: 'ふわっとデー',     desc: '「ふわっと」の注文ばかり。帯ほそめ',   apply: m => { m.orderKeys = ['fuwa']; m.widthMul *= 0.75; } },
  { id: 'fever',  name: 'フィーバーデー',   desc: '5コンボで フィーバー',                 apply: m => { m.feverCombo = Math.min(m.feverCombo, 5); } },
  { id: 'combo',  name: 'れんぞくデー',     desc: '「3かい にぎにぎ」が いっぱい。点 ×1.5', apply: m => { m.multiRate = 0.35; m.multiMul *= 1.5; } },
];
function todayKey(d = new Date()) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
function todayRule() {
  const k = todayKey(); let h = 0;
  for (const ch of k) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return RULES[h % RULES.length];
}
const DAILY_REWARD = 150;
// スコア何点で1コインか（2026/10/06：20→80。コインガチャがプレミアムより出ないように）
const COIN_DIV = 80;

// ---- C. お店のレベルと着せかえ ----
const LEVEL_XP = [0, 3000, 8000, 15000, 25000, 40000, 60000, 85000, 115000, 150000];
function shopLevel(xp = sv.xp) { let l = 1; while (l < LEVEL_XP.length && xp >= LEVEL_XP[l]) l++; return l; }
const levelCoinBonus = l => 1 + 0.05 * (l - 1);   // Lv が上がるほどコイン +5%
const DECOR = [
  { id: 'pink',      type: 'bg',    name: 'いちごミルクのお店', price: 0,   lv: 1, src: 'assets/ui/bg.jpg',           counterY: 0.6 },
  { id: 'mint',      type: 'bg',    name: 'ミントのお店',       price: 900, lv: 2, src: 'assets/ui/bg_mint.jpg',      counterY: 0.56 },
  { id: 'night',     type: 'bg',    name: 'よるのお店',         price: 1800, lv: 4, src: 'assets/ui/bg_night.jpg',     counterY: 0.6 },
  { id: 'halloween', type: 'bg',    name: 'ハロウィンのお店',   price: 0,   lv: 1, src: 'assets/ui/bg_halloween.jpg', counterY: 0.65, event: 'halloween' },
  { id: 'lavender',  type: 'bg',    name: 'ラベンダーのお店',   price: 1200, lv: 2, src: 'assets/ui/bg_lavender.jpg',  counterY: 0.65 },
  { id: 'lemon',     type: 'bg',    name: 'レモンのお店',       price: 1200, lv: 3, src: 'assets/ui/bg_lemon.jpg',     counterY: 0.58 },
  { id: 'soda',      type: 'bg',    name: 'ソーダのお店',       price: 1500, lv: 3, src: 'assets/ui/bg_soda.jpg',      counterY: 0.62 },
  { id: 'choco',     type: 'bg',    name: 'チョコのお店',       price: 1800, lv: 4, src: 'assets/ui/bg_choco.jpg',     counterY: 0.6 },
  { id: 'sakura',    type: 'bg',    name: 'さくらのお店',       price: 2100, lv: 5, src: 'assets/ui/bg_sakura.jpg',    counterY: 0.64 },
  { id: 'snow',      type: 'bg',    name: 'ゆきのお店',         price: 2400, lv: 5, src: 'assets/ui/bg_snow.jpg',      counterY: 0.61 },
  { id: 'sunset',    type: 'bg',    name: 'ゆうやけのお店',     price: 2700, lv: 6, src: 'assets/ui/bg_sunset.jpg',    counterY: 0.59 },
  { id: 'house',     type: 'bg',    name: 'おかしの家',         price: 3600, lv: 7, src: 'assets/ui/bg_house.jpg',    counterY: 0.67 },
  { id: 'lace',      type: 'plate', name: 'レースのおさら',     price: 0,   lv: 1, src: 'assets/ui/plate.png' },
  { id: 'berry',     type: 'plate', name: 'いちごのおさら',     price: 600, lv: 2, src: 'assets/ui/plate_berry.png' },
  { id: 'mintplate', type: 'plate', name: 'ミントのおさら',     price: 900, lv: 3, src: 'assets/ui/plate_mint.png' },
  { id: 'lavplate',  type: 'plate', name: 'ラベンダーのおさら', price: 600, lv: 2, src: 'assets/ui/plate_lav.png' },
  { id: 'lemonplate', type: 'plate', name: 'レモンのおさら',    price: 750, lv: 3, src: 'assets/ui/plate_lemon.png' },
  { id: 'chocoplate', type: 'plate', name: 'チョコのおさら',    price: 900, lv: 4, src: 'assets/ui/plate_choco.png' },
  { id: 'heartplate', type: 'plate', name: 'ハートのおさら',    price: 1200, lv: 4, src: 'assets/ui/plate_heart.png' },
  { id: 'starplate', type: 'plate', name: 'ほしのおさら',       price: 1200, lv: 5, src: 'assets/ui/plate_star.png' },
  { id: 'goldplate', type: 'plate', name: 'きんのおさら',       price: 2400, lv: 7, src: 'assets/ui/plate_gold.png' },
  { id: 'normal',    type: 'bgm',   name: 'いつものBGM',        price: 0,   lv: 1, bgm: { bpm: 112, wave: 'triangle', prog: 0 } },
  { id: 'calm',      type: 'bgm',   name: 'のんびりBGM',        price: 450, lv: 2, bgm: { bpm: 88,  wave: 'sine',     prog: 1 } },
  { id: 'pop',       type: 'bgm',   name: 'ポップBGM',          price: 750, lv: 3, bgm: { bpm: 132, wave: 'square',   prog: 2 } },
  { id: 'yume',      type: 'bgm',   name: 'ゆめかわBGM',        price: 450, lv: 2, bgm: { bpm: 92,  wave: 'sine',     prog: 3, oct: 24 } },
  { id: 'matsuri',   type: 'bgm',   name: 'おまつりBGM',        price: 750, lv: 3, bgm: { bpm: 140, wave: 'square',   prog: 4, pat: 1 } },
  { id: 'orgel',     type: 'bgm',   name: 'オルゴールBGM',      price: 900, lv: 4, bgm: { bpm: 104, wave: 'triangle', prog: 5, oct: 24, pat: 2 } },
  { id: 'jazzy',     type: 'bgm',   name: 'カフェBGM',          price: 900, lv: 5, bgm: { bpm: 96,  wave: 'triangle', prog: 6, pat: 1 } },
  { id: 'chip',      type: 'bgm',   name: 'ピコピコBGM',        price: 1200, lv: 6, bgm: { bpm: 150, wave: 'square',   prog: 7, pat: 2 } },
  { id: 'spooky',    type: 'bgm',   name: 'ハロウィンBGM',      price: 0,   lv: 1, bgm: { bpm: 112, wave: 'triangle', prog: 8 }, event: 'halloween' },
];
const DECOR_BY_ID = Object.fromEntries(DECOR.map(d => [d.id, d]));

// ---- D. 期間限定イベント ----
const EVENTS = [
  { id: 'halloween', name: 'ハロウィン', start: '2026-10-01', end: '2026-10-31', pickup: 0.3 },
];
function activeEvent(d = todayKey()) { return EVENTS.find(e => d >= e.start && d <= e.end) || null; }

function computeMods(daily, skillBoost = 0) {
  const m = baseMods();
  const kb = kanbanId();   // 未設定なら持っている先頭の子
  if (SKILLS[kb]) SKILLS[kb].apply(m, skillLv(kb) + skillBoost);   // ブーストで Lv6 まで
  if (daily) todayRule().apply(m);
  return m;
}

// ============================================================
// サウンド（WebAudio合成・素材なし）
// ============================================================
let AC = null, noiseBuf = null, MASTER = null;
function ac() {
  if (!AC) {
    try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; }
    MASTER = AC.createGain(); MASTER.gain.value = sv.mute ? 0 : 1; MASTER.connect(AC.destination);
  }
  if (AC.state === 'suspended') AC.resume();
  return AC;
}
function getNoise(a) {
  if (!noiseBuf) {
    noiseBuf = a.createBuffer(1, a.sampleRate, a.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  return noiseBuf;
}
function sNoise(dur, f0, f1, gain, type = 'lowpass', q = 1, delay = 0, at = 0) {
  const a = ac(); if (!a) return;
  const t = at || a.currentTime + delay;
  const src = a.createBufferSource(); src.buffer = getNoise(a);
  const f = a.createBiquadFilter(); f.type = type; f.Q.value = q;
  f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(Math.max(f1, 20), t + dur);
  const g = a.createGain();
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f).connect(g).connect(MASTER);
  src.start(t); src.stop(t + dur + 0.05);
}
function sTone(f0, f1, dur, gain, type = 'sine', delay = 0, at = 0) {
  const a = ac(); if (!a) return;
  const t = at || a.currentTime + delay;
  const o = a.createOscillator(); o.type = type;
  o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(f1, 20), t + dur);
  const g = a.createGain();
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(MASTER);
  o.start(t); o.stop(t + dur + 0.05);
}
const SFX = {
  squish(s) { sNoise(0.16, 1100 - 650 * s, 220, 0.18 + 0.15 * s, 'lowpass', 5); sTone(170 - 70 * s, 110, 0.1, 0.06); },
  // ぽよん：ピッチが上がって少し戻る
  release(s = 0.5) {
    const a = ac(); if (!a) return;
    const t = a.currentTime, o = a.createOscillator(), g = a.createGain();
    const lo = 210 - 40 * s;
    o.type = 'sine';
    o.frequency.setValueAtTime(lo, t);
    o.frequency.exponentialRampToValueAtTime(lo * 2.6, t + 0.09);
    o.frequency.exponentialRampToValueAtTime(lo * 1.7, t + 0.22);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.16, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
    o.connect(g).connect(MASTER); o.start(t); o.stop(t + 0.32);
    sNoise(0.3, 250, 1600, 0.05 + 0.05 * s, 'bandpass', 2);
  },
  // ミチッ（破裂寸前のきしみ）
  creak(s) {
    const f = 90 + Math.random() * 70;
    sTone(f, f * 0.8, 0.035, 0.05 + (s - 0.8) * 0.4, 'sawtooth');
    sNoise(0.03, 2400, 900, 0.05, 'bandpass', 8);
  },
  sparkle() { [2093, 2637, 3136].forEach((f, i) => sTone(f, f, 0.12, 0.035, 'sine', i * 0.04)); },
  fever() { [523, 659, 784, 1047, 1319].forEach((f, i) => sTone(f, f, 0.16, 0.08, 'square', i * 0.06)); },
  perfect() { sTone(988, 988, 0.12, 0.1, 'triangle'); sTone(1319, 1319, 0.22, 0.1, 'triangle', 0.08); sTone(1760, 1760, 0.25, 0.06, 'triangle', 0.16); },
  good() { sTone(784, 784, 0.14, 0.09, 'triangle'); },
  miss() { sTone(330, 200, 0.25, 0.09, 'triangle'); },
  burst() { sNoise(0.4, 3500, 250, 0.55, 'lowpass', 1); sTone(140, 40, 0.35, 0.35); sNoise(0.15, 6000, 2000, 0.15, 'highpass', 1, 0.02); },
  pop() { sTone(500, 900, 0.09, 0.08); },
  coin() { sTone(1200, 1200, 0.07, 0.07, 'square'); sTone(1600, 1600, 0.12, 0.06, 'square', 0.06); },
  fanfare() { [784, 988, 1175, 1568].forEach((f, i) => sTone(f, f, 0.18, 0.08, 'triangle', i * 0.09)); },
};
const vib = p => {
  try {
    const ua = navigator.userActivation;
    if (navigator.vibrate && (!ua || ua.hasBeenActive)) navigator.vibrate(p);
  } catch (e) {}
};

// ---- 握っている間ずっと鳴る「むにゅむにゅ」ループ ----
const SQL = { src: null, f: null, g: null, lfo: 0 };
function squelchStart() {
  const a = ac(); if (!a || SQL.src) return;
  SQL.src = a.createBufferSource(); SQL.src.buffer = getNoise(a); SQL.src.loop = true;
  SQL.f = a.createBiquadFilter(); SQL.f.type = 'bandpass'; SQL.f.Q.value = 7; SQL.f.frequency.value = 900;
  SQL.g = a.createGain(); SQL.g.gain.value = 0.0001;
  SQL.src.connect(SQL.f).connect(SQL.g).connect(MASTER);
  SQL.src.start();
}
function squelchUpdate(s, dt) {
  if (!SQL.src) return;
  SQL.lfo += dt * (7 + s * 10);
  const t = AC.currentTime;
  const wob = 0.5 + 0.5 * Math.sin(SQL.lfo) * Math.sin(SQL.lfo * 0.37 + 1);
  SQL.f.frequency.setTargetAtTime(1300 - 950 * s + wob * 260, t, 0.02);
  SQL.g.gain.setTargetAtTime((0.05 + 0.2 * s) * (0.55 + 0.45 * wob), t, 0.03);
}
function squelchStop() {
  if (!SQL.src) return;
  const t = AC.currentTime, src = SQL.src;
  SQL.g.gain.setTargetAtTime(0.0001, t, 0.03);
  setTimeout(() => { try { src.stop(); } catch (e) {} }, 150);
  SQL.src = null;
}

// ---- BGM（8分音符の簡単なループ。フィーバー中はテンポアップ） ----
const BGM = { timer: null, next: 0, step: 0, cfg: { bpm: 112, wave: 'triangle', prog: 0 } };
// 着せかえBGMごとのコード進行
const PROGS = [
  [[60, 64, 67, 72], [57, 60, 64, 69], [53, 57, 60, 65], [55, 59, 62, 67]],   // いつもの：C Am F G
  [[53, 57, 60, 64], [52, 55, 59, 62], [50, 53, 57, 60], [55, 59, 62, 65]],   // のんびり：Fmaj7 Em7 Dm7 G7
  [[62, 66, 69, 74], [59, 62, 66, 71], [55, 59, 62, 67], [57, 61, 64, 69]],   // ポップ：D Bm G A
  [[65, 69, 72, 76], [64, 67, 71, 74], [62, 65, 69, 72], [60, 64, 67, 71]],   // ゆめかわ：Fmaj7 Em7 Dm7 Cmaj7
  [[62, 64, 67, 69], [60, 62, 67, 69], [62, 64, 67, 69], [57, 60, 62, 64]],   // おまつり：ヨナ抜き風
  [[67, 71, 74, 79], [64, 67, 71, 76], [60, 64, 67, 72], [62, 66, 69, 74]],   // オルゴール：G Em C D
  [[62, 65, 69, 72], [55, 59, 62, 65], [60, 64, 67, 71], [57, 61, 64, 67]],   // カフェ：Dm7 G7 Cmaj7 A7
  [[60, 64, 67, 72], [65, 69, 72, 77], [67, 71, 74, 79], [65, 69, 72, 77]],   // ピコピコ：C F G F
  [[57, 60, 64, 69], [53, 57, 60, 65], [52, 56, 59, 64], [57, 60, 64, 69]],   // ハロウィン：Am F E Am
];
// 分散和音の並び（BGMごとに選ぶ）
const PATS = [[0, 2, 1, 3, 2, 1, 3, 2], [0, 1, 2, 3, 2, 1, 0, 1], [3, 2, 1, 0, 1, 2, 3, 2]];
const PAT = [0, 2, 1, 3, 2, 1, 3, 2];
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
function bgmStart() {
  if (BGM.timer || sv.mute) return;
  const a = ac(); if (!a) return;
  BGM.next = a.currentTime + 0.1; BGM.step = 0;
  BGM.timer = setInterval(bgmTick, 30);
}
function bgmStop() { clearInterval(BGM.timer); BGM.timer = null; }
function bgmTick() {
  const a = AC; if (!a) return;
  const fever = G.fever > 0, cfg = BGM.cfg;
  const st = 60 / (fever ? cfg.bpm * 1.35 : cfg.bpm) / 2;
  const prog = PROGS[cfg.prog] || PROGS[0];
  while (BGM.next < a.currentTime + 0.15) {
    const i = BGM.step % 32, ch = prog[Math.floor(i / 8)], k = i % 8, t = BGM.next;
    const pat = PATS[cfg.pat || 0], oct = cfg.oct || 12;
    sTone(mtof(ch[pat[k]] + oct), mtof(ch[pat[k]] + oct), st * 0.9, fever ? 0.035 : cfg.wave === 'square' ? 0.018 : 0.025, fever ? 'square' : cfg.wave, 0, t);
    if (k % 4 === 0) sTone(mtof(ch[0] - 12), mtof(ch[0] - 12), st * 1.8, 0.07, 'sine', 0, t);
    if (k % 2 === 1) sNoise(0.04, 9000, 6000, fever ? 0.05 : 0.025, 'highpass', 1, 0, t);
    if (fever && k % 4 === 2) sNoise(0.08, 1800, 400, 0.08, 'lowpass', 1, 0, t);
    BGM.next += st; BGM.step++;
  }
}
function setMute(m) {
  sv.mute = m; save();
  if (MASTER) MASTER.gain.value = m ? 0 : 1;
  if (m) bgmStop(); else bgmStart();
  const b = document.querySelector('#btnMute'); if (b) b.textContent = m ? '♪×' : '♪';
}

// ============================================================
// 描画：スクイーズ
// ============================================================
const TAU = Math.PI * 2;
const FACE_Y = { round: -0.92, dome: -0.5, pudding: -0.62, tri: -0.62, tri2: -0.78, bear: -0.88, macaron: -0.44 };

function roundTri(c, pts, r) {
  c.moveTo((pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2);
  for (let i = 0; i < 3; i++) {
    const p1 = pts[(i + 1) % 3], p2 = pts[(i + 2) % 3];
    c.arcTo(p1[0], p1[1], p2[0], p2[1], r);
  }
  c.closePath();
}

function bodyPath(c, sq, R) {
  c.beginPath();
  switch (sq.shape) {
    case 'round':
      c.ellipse(0, -R * 0.95, R, R * 0.95, 0, 0, TAU); break;
    case 'bear':
      c.ellipse(0, -R * 0.92, R, R * 0.92, 0, 0, TAU);
      c.moveTo(-R * 0.68 + R * 0.33, -R * 1.68);
      c.arc(-R * 0.68, -R * 1.68, R * 0.33, 0, TAU);
      c.moveTo(R * 0.68 + R * 0.33, -R * 1.68);
      c.arc(R * 0.68, -R * 1.68, R * 0.33, 0, TAU);
      break;
    case 'dome':
      c.moveTo(-R * 1.12, -R * 0.06);
      c.bezierCurveTo(-R * 1.2, -R * 1.42, R * 1.2, -R * 1.42, R * 1.12, -R * 0.06);
      c.quadraticCurveTo(R * 1.1, R * 0.02, R * 0.9, R * 0.02);
      c.lineTo(-R * 0.9, R * 0.02);
      c.quadraticCurveTo(-R * 1.1, R * 0.02, -R * 1.12, -R * 0.06);
      break;
    case 'pudding':
      c.moveTo(-R * 1.0, 0);
      c.lineTo(-R * 0.74, -R * 1.22);
      c.quadraticCurveTo(-R * 0.71, -R * 1.38, -R * 0.55, -R * 1.38);
      c.lineTo(R * 0.55, -R * 1.38);
      c.quadraticCurveTo(R * 0.71, -R * 1.38, R * 0.74, -R * 1.22);
      c.lineTo(R * 1.0, 0);
      c.closePath();
      break;
    case 'tri':
      roundTri(c, [[0, -R * 1.75], [R * 1.15, 0], [-R * 1.15, 0]], R * 0.42); break;
    case 'tri2':  // ふっくらした三角（リアル寄り）
      c.moveTo(0, -R * 1.78);
      c.bezierCurveTo(R * 0.42, -R * 1.78, R * 1.3, -R * 0.5, R * 1.2, -R * 0.16);
      c.bezierCurveTo(R * 1.14, R * 0.02, R * 0.9, R * 0.03, 0, R * 0.03);
      c.bezierCurveTo(-R * 0.9, R * 0.03, -R * 1.14, R * 0.02, -R * 1.2, -R * 0.16);
      c.bezierCurveTo(-R * 1.3, -R * 0.5, -R * 0.42, -R * 1.78, 0, -R * 1.78);
      c.closePath();
      break;
    case 'macaron':
      c.ellipse(0, -R * 1.3, R * 1.02, R * 0.42, 0, 0, TAU);
      c.moveTo(R * 1.02, -R * 0.4);
      c.ellipse(0, -R * 0.4, R * 1.02, R * 0.4, 0, 0, TAU);
      break;
  }
}

function drawFace(c, R, y, mood, ink = '#4a2b33') {
  const ex = R * 0.3, er = R * 0.085;
  c.fillStyle = 'rgba(255,120,150,0.45)';
  c.beginPath(); c.ellipse(-R * 0.55, y + R * 0.14, R * 0.15, R * 0.09, 0, 0, TAU); c.fill();
  c.beginPath(); c.ellipse(R * 0.55, y + R * 0.14, R * 0.15, R * 0.09, 0, 0, TAU); c.fill();
  c.strokeStyle = ink; c.fillStyle = ink; c.lineWidth = R * 0.055; c.lineCap = 'round'; c.lineJoin = 'round';
  if (mood === 'squint') {
    c.beginPath();
    c.moveTo(-ex - er, y - er); c.lineTo(-ex + er, y); c.lineTo(-ex - er, y + er);
    c.moveTo(ex + er, y - er); c.lineTo(ex - er, y); c.lineTo(ex + er, y + er);
    c.stroke();
  } else if (mood === 'happy') {
    c.beginPath();
    c.arc(-ex, y + er * 0.6, er * 1.2, Math.PI * 1.1, Math.PI * 1.9);
    c.moveTo(ex + er * 1.2 * Math.cos(Math.PI * 1.1), y + er * 0.6 + er * 1.2 * Math.sin(Math.PI * 1.1));
    c.arc(ex, y + er * 0.6, er * 1.2, Math.PI * 1.1, Math.PI * 1.9);
    c.stroke();
  } else if (mood === 'sad') {
    c.beginPath();
    c.moveTo(-ex - er, y); c.lineTo(-ex + er, y);
    c.moveTo(ex - er, y); c.lineTo(ex + er, y);
    c.stroke();
  } else {
    c.beginPath(); c.arc(-ex, y, er, 0, TAU); c.arc(ex, y, er, 0, TAU); c.fill();
    c.fillStyle = '#fff';
    c.beginPath(); c.arc(-ex - er * 0.3, y - er * 0.35, er * 0.35, 0, TAU); c.arc(ex - er * 0.3, y - er * 0.35, er * 0.35, 0, TAU); c.fill();
  }
  if (mood === 'angry') {
    c.strokeStyle = ink; c.lineWidth = R * 0.06;
    c.beginPath();
    c.moveTo(-ex - er * 1.6, y - er * 2.6); c.lineTo(-ex + er * 1.3, y - er * 1.5);
    c.moveTo(ex + er * 1.6, y - er * 2.6); c.lineTo(ex - er * 1.3, y - er * 1.5);
    c.stroke();
  }
  // ω の口
  c.strokeStyle = ink; c.lineWidth = R * 0.045;
  const my = y + R * 0.17, mw = R * 0.07;
  c.beginPath();
  if (mood === 'squint') {
    c.ellipse(0, my + mw * 0.3, mw * 0.9, mw * 1.1, 0, 0, TAU);
    c.stroke();
  } else {
    c.arc(-mw, my, mw, 0, Math.PI);
    c.arc(mw, my, mw, 0, Math.PI);
    c.stroke();
  }
}

function drawDeco(c, sq, R) {
  switch (sq.deco) {
    case 'sugar':
      c.fillStyle = 'rgba(255,255,255,0.9)';
      for (let i = 0; i < 22; i++) {
        const a = i * 2.4, rr = R * (0.25 + 0.7 * ((i * 37) % 10) / 10);
        const x = Math.cos(a) * rr, y = -R * 0.95 + Math.sin(a) * rr * 0.95;
        if (y > -R * 1.15 && y < -R * 0.3 && Math.abs(y + R * 0.9) > R * 0.28) { c.fillRect(x, y, R * 0.05, R * 0.05); }
        else if (y <= -R * 1.15) c.fillRect(x, y, R * 0.05, R * 0.05);
      }
      break;
    case 'dust':
      c.fillStyle = 'rgba(255,255,255,0.8)';
      for (let i = 0; i < 14; i++) { c.beginPath(); c.arc(Math.cos(i * 2.1) * R * 0.8, -R * 0.95 + Math.sin(i * 1.3) * R * 0.08, R * 0.03, 0, TAU); c.fill(); }
      break;
    case 'grid':
      c.strokeStyle = 'rgba(140,170,60,0.55)'; c.lineWidth = R * 0.04;
      for (let k = -3; k <= 3; k++) {
        c.beginPath(); c.moveTo(k * R * 0.38 - R, -R * 2.2); c.lineTo(k * R * 0.38 + R, R * 0.2); c.stroke();
        c.beginPath(); c.moveTo(k * R * 0.38 + R, -R * 2.2); c.lineTo(k * R * 0.38 - R, R * 0.2); c.stroke();
      }
      break;
    case 'pistachio':
      c.fillStyle = '#a5cf6a';
      c.beginPath();
      // 割れ目からとろっと出たピスタチオクリーム
      c.moveTo(-R * 1.3, -R * 0.2);
      for (let i = 0; i <= 8; i++) {
        const x = -R * 1.3 + i * R * 0.325;
        c.quadraticCurveTo(x - R * 0.16, -R * (0.2 - (i % 2 ? 0.16 : 0.0)), x, -R * 0.2);
      }
      c.lineTo(R * 1.3, R * 0.2); c.lineTo(-R * 1.3, R * 0.2); c.closePath(); c.fill();
      c.fillStyle = '#e6c48a';
      for (let i = 0; i < 9; i++) c.fillRect(-R * 0.9 + i * R * 0.22, -R * (0.08 + (i % 3) * 0.04), R * 0.08, R * 0.03);
      break;
    case 'pearls':
      for (let i = 0; i < 11; i++) {
        const x = Math.cos(i * 2.3) * R * 0.75, y = -R * 0.95 + Math.sin(i * 1.7) * R * 0.75;
        if (Math.abs(y + R * 0.85) < R * 0.3 && Math.abs(x) < R * 0.7) continue;
        c.fillStyle = 'rgba(120,70,90,0.55)'; c.beginPath(); c.arc(x, y, R * 0.075, 0, TAU); c.fill();
        c.fillStyle = 'rgba(255,255,255,0.7)'; c.beginPath(); c.arc(x - R * 0.025, y - R * 0.025, R * 0.022, 0, TAU); c.fill();
      }
      break;
    case 'berries':
      [[-0.45, -0.98, '#ff4f6d'], [0.05, -1.1, '#7a4fd0'], [0.5, -0.96, '#ff4f6d'], [-0.15, -1.05, '#ffcf3a']].forEach(([x, y, col]) => {
        c.fillStyle = col; c.beginPath(); c.arc(x * R, y * R, R * 0.13, 0, TAU); c.fill();
        c.fillStyle = 'rgba(255,255,255,0.6)'; c.beginPath(); c.arc(x * R - R * 0.04, y * R - R * 0.04, R * 0.035, 0, TAU); c.fill();
      });
      break;
    case 'cream':
      c.fillStyle = '#fffaf0';
      c.beginPath();
      c.ellipse(0, -R * 1.12, R * 1.05, R * 0.22, 0, 0, TAU); c.fill();
      for (let i = -3; i <= 3; i++) { c.beginPath(); c.arc(i * R * 0.3, -R * 1.2, R * 0.17, 0, TAU); c.fill(); }
      c.fillStyle = '#ff4f6d'; c.beginPath(); c.arc(R * 0.25, -R * 1.32, R * 0.11, 0, TAU); c.fill();
      break;
    case 'nori':
      c.fillStyle = '#2f3f35';
      c.beginPath();
      c.moveTo(-R * 0.38, R * 0.1); c.lineTo(-R * 0.38, -R * 0.42); c.quadraticCurveTo(0, -R * 0.48, R * 0.38, -R * 0.42); c.lineTo(R * 0.38, R * 0.1); c.closePath(); c.fill();
      break;
    case 'water':
      c.fillStyle = 'rgba(255,255,255,0.55)';
      [[-0.55, -0.35, 0.06], [-0.3, -0.75, 0.04], [0.6, -0.4, 0.05], [0.4, -0.8, 0.035], [0.1, -0.3, 0.03]].forEach(([x, y, r]) => {
        c.beginPath(); c.arc(x * R, y * R, r * R, 0, TAU); c.fill();
      });
      c.fillStyle = 'rgba(255,170,200,0.9)';
      c.beginPath(); c.ellipse(0, -R * 0.42, R * 0.38, R * 0.28, 0, 0, TAU); c.fill();
      break;
    case 'seeds':
      c.fillStyle = '#ffe07a';
      for (let i = 0; i < 12; i++) {
        const x = Math.cos(i * 2.4) * R * 0.78, y = -R * 0.95 + Math.sin(i * 1.9) * R * 0.78;
        if (Math.abs(y + R * 0.9) < R * 0.32 && Math.abs(x) < R * 0.7) continue;
        c.beginPath(); c.ellipse(x, y, R * 0.07, R * 0.045, i, 0, TAU); c.fill();
      }
      c.fillStyle = '#4caf50';
      c.beginPath(); c.ellipse(0, -R * 1.86, R * 0.22, R * 0.1, 0, 0, TAU); c.fill();
      break;
    case 'sparkle':
      c.fillStyle = 'rgba(255,255,255,0.85)';
      [[-0.55, -1.3, 0.12], [0.6, -0.6, 0.09], [-0.7, -0.45, 0.07], [0.4, -1.35, 0.06]].forEach(([x, y, s]) => star(c, x * R, y * R, s * R));
      break;
  }
}
function star(c, x, y, s) {
  c.beginPath();
  c.moveTo(x, y - s); c.quadraticCurveTo(x, y, x + s, y); c.quadraticCurveTo(x, y, x, y + s);
  c.quadraticCurveTo(x, y, x - s, y); c.quadraticCurveTo(x, y, x, y - s); c.fill();
}

// s: 潰れ量 0..1 / jig: ぷるぷる量 / mood
function drawSquishy(c, sq, x, baseY, R, s, jig = 0, mood = 'normal', alpha = 1, silhouette = false, shiny = false) {
  const ease = s * (2 - s) * 0.6 + s * 0.4;
  let sx = 1 + 0.48 * ease, sy = 1 - 0.46 * ease;
  sx += jig * 0.08; sy -= jig * 0.08;
  c.save();
  c.globalAlpha = alpha;
  // 影
  c.fillStyle = 'rgba(90,58,70,0.13)';
  c.beginPath(); c.ellipse(x, baseY + R * 0.04, R * 1.05 * sx, R * 0.16, 0, 0, TAU); c.fill();
  c.translate(x, baseY);
  c.scale(sx, sy);

  if (silhouette) {
    bodyPath(c, sq, R); c.fillStyle = 'rgba(90,58,70,0.16)'; c.fill();
    c.restore(); return;
  }

  drawBody(c, sq, R, mood, shiny);
  c.restore();
}

// ---- リアル寄りの描き方（メロジョイ風：素材感・マットな陰影・小さい顔） ----
function seeded(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

function softInnerEdge(c, sq, R, color, width, steps = 6) {
  // 輪郭の内側をぼかして暗くする（AO風）。clip済み前提
  for (let i = steps; i >= 1; i--) {
    bodyPath(c, sq, R);
    c.lineWidth = width * i / steps * 2;
    c.strokeStyle = color.replace('A', (0.3 / steps).toFixed(3));
    c.stroke();
  }
}

function drawRice(c, R, rnd) {
  // 下地
  c.fillStyle = '#f3f0e7';
  c.fillRect(-R * 1.5, -R * 2.0, R * 3, R * 2.2);
  // お米の粒：奥→手前で3層
  const layers = [[420, 0.92], [300, 0.97], [170, 1.0]];
  for (const [n, light] of layers) {
    for (let i = 0; i < n; i++) {
      const x = (rnd() - 0.5) * R * 2.6, y = -rnd() * R * 1.95;
      const a = rnd() * Math.PI, len = R * (0.095 + rnd() * 0.035), wid = len * 0.52;
      const v = Math.round(240 + rnd() * 15 * light);
      c.save(); c.translate(x, y); c.rotate(a);
      c.fillStyle = `rgb(${v},${v - 1},${v - 6})`;
      c.beginPath(); c.ellipse(0, 0, len / 2, wid / 2, 0, 0, TAU); c.fill();
      c.strokeStyle = 'rgba(170,155,130,0.2)'; c.lineWidth = R * 0.006; c.stroke();
      // 粒の上側だけ少し明るい
      c.fillStyle = 'rgba(255,255,255,0.55)';
      c.beginPath(); c.ellipse(-len * 0.08, -wid * 0.14, len * 0.3, wid * 0.18, 0, 0, TAU); c.fill();
      c.restore();
    }
  }
}

function drawNoriReal(c, R, rnd) {
  c.save();
  c.beginPath();
  c.moveTo(-R * 0.46, R * 0.1);
  c.lineTo(-R * 0.47, -R * 0.5);
  c.bezierCurveTo(-R * 0.2, -R * 0.56, R * 0.2, -R * 0.56, R * 0.47, -R * 0.5);
  c.lineTo(R * 0.46, R * 0.1);
  c.closePath();
  const g = c.createLinearGradient(-R * 0.5, 0, R * 0.5, 0);
  g.addColorStop(0, '#16201a'); g.addColorStop(0.35, '#2a3a2e'); g.addColorStop(0.6, '#1d2a21'); g.addColorStop(1, '#121a15');
  c.fillStyle = g; c.fill();
  c.clip();
  // のりの繊維
  c.strokeStyle = 'rgba(160,190,150,0.08)'; c.lineWidth = R * 0.008;
  for (let i = 0; i < 70; i++) {
    const x = (rnd() - 0.5) * R, y = -rnd() * R * 0.6;
    c.beginPath(); c.moveTo(x, y); c.lineTo(x + (rnd() - 0.5) * R * 0.15, y + (rnd() - 0.5) * R * 0.1); c.stroke();
  }
  // 上の縁の柔らかいツヤ
  c.fillStyle = 'rgba(255,255,255,0.07)';
  c.fillRect(-R * 0.5, -R * 0.56, R, R * 0.07);
  c.restore();
}

function drawBodyReal(c, sq, R, mood, shiny) {
  const rnd = seeded(sq.id.length * 7919 + 13);
  c.save();
  bodyPath(c, sq, R); c.clip();
  drawRice(c, R, rnd);
  // マットな陰影：左上から光、右下に影
  const lg = c.createRadialGradient(-R * 0.45, -R * 1.25, R * 0.1, -R * 0.2, -R * 0.9, R * 1.7);
  lg.addColorStop(0, 'rgba(255,255,255,0.5)'); lg.addColorStop(0.5, 'rgba(255,255,255,0)'); lg.addColorStop(1, 'rgba(140,115,85,0.16)');
  c.fillStyle = lg; c.fillRect(-R * 1.5, -R * 2.0, R * 3, R * 2.2);
  const bg = c.createLinearGradient(0, -R * 0.5, 0, R * 0.05);
  bg.addColorStop(0, 'rgba(120,95,70,0)'); bg.addColorStop(1, 'rgba(120,95,70,0.25)');
  c.fillStyle = bg; c.fillRect(-R * 1.5, -R * 0.5, R * 3, R * 0.6);
  softInnerEdge(c, sq, R, 'rgba(110,90,65,A)', R * 0.09);
  if (sq.deco === 'nori') drawNoriReal(c, R, rnd);
  if (shiny) {
    const rg = c.createLinearGradient(-R * 1.2, -R * 2, R * 1.2, 0);
    ['#ff7fa8', '#ffd34d', '#7fe0a0', '#7fc8ff', '#c79bff', '#ff7fa8'].forEach((col, i) => rg.addColorStop(i / 5, col));
    c.globalAlpha = 0.32; c.fillStyle = rg; c.fillRect(-R * 1.5, -R * 2.2, R * 3, R * 2.5);
    c.globalAlpha = 1; c.fillStyle = '#fff';
    [[-0.55, -1.15, 0.1], [0.5, -1.0, 0.08], [0.75, -0.35, 0.06]].forEach(([x, y, s]) => star(c, x * R, y * R, s * R));
  }
  c.restore();
  // ごく薄い輪郭
  bodyPath(c, sq, R);
  c.lineWidth = R * (shiny ? 0.06 : 0.014); c.strokeStyle = shiny ? '#ffd34d' : 'rgba(170,150,120,0.28)'; c.stroke();
  // 小さい顔
  const fy = FACE_Y[sq.shape] * R;
  const bl = (x) => {
    const g = c.createRadialGradient(x, fy + R * 0.09, 0, x, fy + R * 0.09, R * 0.13);
    g.addColorStop(0, 'rgba(255,140,150,0.45)'); g.addColorStop(1, 'rgba(255,140,150,0)');
    c.fillStyle = g; c.beginPath(); c.arc(x, fy + R * 0.09, R * 0.13, 0, TAU); c.fill();
  };
  bl(-R * 0.34); bl(R * 0.34);
  const ink = '#2b1d1a', ex = R * 0.19, er = R * 0.048;
  c.fillStyle = ink; c.strokeStyle = ink; c.lineCap = 'round'; c.lineWidth = R * 0.03;
  if (mood === 'squint') {
    c.beginPath();
    c.moveTo(-ex - er, fy - er); c.lineTo(-ex + er, fy); c.lineTo(-ex - er, fy + er);
    c.moveTo(ex + er, fy - er); c.lineTo(ex - er, fy); c.lineTo(ex + er, fy + er);
    c.stroke();
  } else if (mood === 'happy') {
    c.beginPath(); c.arc(-ex, fy + er * 0.6, er * 1.3, Math.PI * 1.15, Math.PI * 1.85);
    c.moveTo(ex + er * 1.3 * Math.cos(Math.PI * 1.15), fy + er * 0.6 + er * 1.3 * Math.sin(Math.PI * 1.15));
    c.arc(ex, fy + er * 0.6, er * 1.3, Math.PI * 1.15, Math.PI * 1.85); c.stroke();
  } else if (mood === 'sad') {
    c.beginPath(); c.moveTo(-ex - er, fy); c.lineTo(-ex + er, fy); c.moveTo(ex - er, fy); c.lineTo(ex + er, fy); c.stroke();
  } else {
    c.beginPath(); c.arc(-ex, fy, er, 0, TAU); c.arc(ex, fy, er, 0, TAU); c.fill();
  }
  // 小さい口
  c.lineWidth = R * 0.022;
  c.beginPath();
  if (mood === 'squint') c.ellipse(0, fy + R * 0.09, R * 0.03, R * 0.04, 0, 0, TAU);
  else { c.arc(-R * 0.03, fy + R * 0.06, R * 0.03, 0.1, Math.PI - 0.1); c.arc(R * 0.03, fy + R * 0.06, R * 0.03, 0.1, Math.PI - 0.1); }
  c.stroke();
}

// ---- 画像スクイーズ（AI生成などの透過PNG）----
// 画像が読めたらそれを使い、読めない間は手描き（プログラム描画）にフォールバックする。
const IMG = {};
function loadSquishyImages(onReady) {
  for (const sq of [...SQUISHIES, SPICY]) {
    if (!sq.img) continue;
    let tries = 0;
    const im = new Image();
    im.onload = () => { IMG[sq.id] = { img: im, shiny: null }; BODY_CACHE.clear(); onReady && onReady(sq); };
    // 同時読み込みで接続が切れることがあるので、少し待って数回やり直す
    im.onerror = () => { if (++tries <= 3) setTimeout(() => { im.src = `${sq.img}?r=${tries}`; }, 300 * tries); };
    im.src = sq.img;
  }
}
function shinyVariant(entry) {
  if (entry.shiny) return entry.shiny;
  const im = entry.img, pad = Math.round(im.width * 0.03);
  const cv = document.createElement('canvas'); cv.width = im.width + pad * 2; cv.height = im.height + pad * 2;
  const g = cv.getContext('2d');
  // 金のふち：シルエットを金色にして周囲にずらし描き
  const sil = document.createElement('canvas'); sil.width = im.width; sil.height = im.height;
  const sg = sil.getContext('2d'); sg.drawImage(im, 0, 0); sg.globalCompositeOperation = 'source-in'; sg.fillStyle = '#ffd34d'; sg.fillRect(0, 0, im.width, im.height);
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; g.drawImage(sil, pad + Math.cos(a) * pad * 0.8, pad + Math.sin(a) * pad * 0.8); }
  // 本体＋虹色の膜＋星
  const body = document.createElement('canvas'); body.width = im.width; body.height = im.height;
  const bg = body.getContext('2d'); bg.drawImage(im, 0, 0);
  bg.globalCompositeOperation = 'source-atop';
  const rg = bg.createLinearGradient(0, 0, im.width, im.height);
  ['#ff7fa8', '#ffd34d', '#7fe0a0', '#7fc8ff', '#c79bff', '#ff7fa8'].forEach((col, i) => rg.addColorStop(i / 5, col));
  bg.globalAlpha = 0.33; bg.fillStyle = rg; bg.fillRect(0, 0, im.width, im.height);
  bg.globalAlpha = 0.95; bg.fillStyle = '#fff';
  [[0.28, 0.3, 0.05], [0.72, 0.42, 0.04], [0.8, 0.78, 0.03], [0.2, 0.75, 0.035]].forEach(([x, y, s]) => star(bg, x * im.width, y * im.height, s * im.width));
  g.drawImage(body, pad, pad);
  entry.shiny = cv;
  return cv;
}
function drawBodyImage(c, sq, R, shiny) {
  const e = IMG[sq.id];
  const src = shiny ? shinyVariant(e) : e.img;
  const k = Math.min(2.5 * R / src.width, 2.0 * R / src.height);
  const w = src.width * k, h = src.height * k;
  c.drawImage(src, -w / 2, -h + R * 0.03, w, h);
}

// 変形なしの本体（原点＝底の中心、上がマイナス）
function drawBody(c, sq, R, mood, shiny = false) {
  if (IMG[sq.id]) { drawBodyImage(c, sq, R, shiny); return; }
  if (sq.style === 'real') { drawBodyReal(c, sq, R, mood, shiny); return; }
  const g = c.createLinearGradient(0, -R * 1.9, 0, 0);
  g.addColorStop(0, sq.body); g.addColorStop(0.55, sq.body); g.addColorStop(1, sq.shade);
  if (sq.shape === 'macaron') {
    // クリームの層
    c.fillStyle = '#fffaf2';
    c.beginPath(); c.roundRect(-R * 0.92, -R * 1.02, R * 1.84, R * 0.36, R * 0.15); c.fill();
    c.strokeStyle = '#f3dccb'; c.lineWidth = R * 0.04; c.stroke();
  }
  bodyPath(c, sq, R);
  c.fillStyle = g; c.fill();
  c.lineWidth = R * 0.05; c.strokeStyle = sq.shade; c.stroke();

  c.save();
  bodyPath(c, sq, R); c.clip();
  if (sq.shape === 'pudding') {
    c.fillStyle = sq.top;
    c.beginPath();
    c.moveTo(-R * 1.2, -R * 1.5); c.lineTo(R * 1.2, -R * 1.5); c.lineTo(R * 1.2, -R * 1.12);
    for (let i = 0; i <= 6; i++) {
      const xx = R * 1.2 - i * R * 0.4;
      c.quadraticCurveTo(xx - R * 0.2, -R * (i % 2 ? 0.92 : 1.12), xx - R * 0.4, -R * 1.12);
    }
    c.closePath(); c.fill();
  }
  drawDeco(c, sq, R);
  // ツヤ
  c.fillStyle = 'rgba(255,255,255,0.55)';
  const fy = FACE_Y[sq.shape] * R;
  c.beginPath(); c.ellipse(-R * 0.45, fy - R * 0.5, R * 0.24, R * 0.12, -0.5, 0, TAU); c.fill();
  c.beginPath(); c.arc(-R * 0.18, fy - R * 0.62, R * 0.05, 0, TAU); c.fill();
  if (shiny) {
    // キラ個体：虹色の膜＋星
    const rg = c.createLinearGradient(-R * 1.2, -R * 2, R * 1.2, 0);
    ['#ff7fa8', '#ffd34d', '#7fe0a0', '#7fc8ff', '#c79bff', '#ff7fa8'].forEach((col, i) => rg.addColorStop(i / 5, col));
    c.globalAlpha = 0.38; c.fillStyle = rg; c.fillRect(-R * 1.5, -R * 2.2, R * 3, R * 2.5);
    c.globalAlpha = 1; c.fillStyle = '#ffffff';
    [[-0.6, -1.2, 0.11], [0.55, -1.05, 0.08], [0.7, -0.35, 0.06], [-0.75, -0.4, 0.07], [0.1, -1.5, 0.06]].forEach(([x, y, s]) => star(c, x * R, y * R, s * R));
  }
  c.restore();
  if (shiny) {
    bodyPath(c, sq, R);
    c.lineWidth = R * 0.07; c.strokeStyle = '#ffd34d'; c.stroke();
  }

  drawFace(c, R, FACE_Y[sq.shape] * R, mood, sq.ink);
}

// ============================================================
// ソフトボディ風の変形描画
//   本体を一度オフスクリーンに描き、格子メッシュを変形して貼り付ける。
//   指で押した所が沈み、横にむにゅっと広がる。
// ============================================================
const BODY_CACHE = new Map();
const MX0 = -1.45, MX1 = 1.45, MY0 = -2.15, MY1 = 0.3;   // 本体のローカル範囲（R単位）
function bodyTexture(sq, R, mood, k, shiny) {
  const key = `${sq.id}|${mood}|${Math.round(R * k)}|${shiny ? 1 : 0}`;
  let t = BODY_CACHE.get(key);
  if (t) return t;
  const c2 = document.createElement('canvas');
  c2.width = Math.ceil((MX1 - MX0) * R * k); c2.height = Math.ceil((MY1 - MY0) * R * k);
  const g = c2.getContext('2d');
  g.scale(k, k); g.translate(-MX0 * R, -MY0 * R);
  drawBody(g, sq, R, mood, shiny);
  t = c2;
  if (BODY_CACHE.size > 80) BODY_CACHE.clear();
  BODY_CACHE.set(key, t);
  return t;
}

function texTri(c, img, x0, y0, x1, y1, x2, y2, u0, v0, u1, v1, u2, v2) {
  const d = u0 * (v1 - v2) + u1 * (v2 - v0) + u2 * (v0 - v1);
  if (!d) return;
  const a = (x0 * (v1 - v2) + x1 * (v2 - v0) + x2 * (v0 - v1)) / d;
  const b = (x0 * (u2 - u1) + x1 * (u0 - u2) + x2 * (u1 - u0)) / d;
  const e = (x0 * (u1 * v2 - u2 * v1) + x1 * (u2 * v0 - u0 * v2) + x2 * (u0 * v1 - u1 * v0)) / d;
  const cc = (y0 * (v1 - v2) + y1 * (v2 - v0) + y2 * (v0 - v1)) / d;
  const dd = (y0 * (u2 - u1) + y1 * (u0 - u2) + y2 * (u1 - u0)) / d;
  const f = (y0 * (u1 * v2 - u2 * v1) + y1 * (u2 * v0 - u0 * v2) + y2 * (u0 * v1 - u1 * v0)) / d;
  // 継ぎ目が出ないよう、クリップだけ少し外に広げる
  const mx = (x0 + x1 + x2) / 3, my = (y0 + y1 + y2) / 3, ex = 0.7;
  const grow = (x, y) => { const dx = x - mx, dy = y - my, l = Math.hypot(dx, dy) || 1; return [x + dx / l * ex, y + dy / l * ex]; };
  const p0 = grow(x0, y0), p1 = grow(x1, y1), p2 = grow(x2, y2);
  c.save();
  c.beginPath(); c.moveTo(p0[0], p0[1]); c.lineTo(p1[0], p1[1]); c.lineTo(p2[0], p2[1]); c.closePath(); c.clip();
  c.transform(a, cc, b, dd, e, f);
  c.drawImage(img, 0, 0);
  c.restore();
}

// def: { e: 潰れ(負なら縦伸び), px: 指のx(R単位), jig: ぷるぷる, sway: 左右ゆれ }
function deformPoint(lx, ly, def) {
  const { e, px, jig, sway } = def;
  const h = Math.max(0, Math.min(1, -ly / 1.9));            // 0=底 1=てっぺん
  const prof = Math.exp(-((h - 0.38) ** 2) / 0.16);           // 中段ほど膨らむ
  let x = lx * (1 + e * (0.28 + 0.42 * prof));
  let y = ly * (1 - 0.5 * e);
  // 指のくぼみ（上の方ほど深く沈む）
  if (e > 0) {
    const dent = e * 0.42 * Math.exp(-((lx - px) ** 2) / 0.28) * Math.pow(h, 1.6);
    y += dent;
    x += Math.sign(lx - px) * dent * 0.35;
  }
  // ぷるぷる・ゆれ（上ほど大きく）
  x *= 1 + jig * 0.1 * h;
  y *= 1 - jig * 0.1 * h;
  x += sway * h * h * 0.18;
  return [x, y];
}

const MESH_NX = 12, MESH_NY = 12;
function drawSquishySoft(c, sq, x, baseY, R, def, mood, k, shiny = false) {
  const img = bodyTexture(sq, R, mood, k, shiny);
  const e = def.e;
  // 影
  c.fillStyle = 'rgba(90,58,70,0.14)';
  c.beginPath(); c.ellipse(x, baseY + R * 0.04, R * 1.08 * (1 + Math.max(e, 0) * 0.55), R * 0.16, 0, 0, TAU); c.fill();
  const P = [];
  for (let j = 0; j <= MESH_NY; j++) {
    const row = [];
    for (let i = 0; i <= MESH_NX; i++) {
      const lx = MX0 + (MX1 - MX0) * i / MESH_NX, ly = MY0 + (MY1 - MY0) * j / MESH_NY;
      const d = deformPoint(lx, ly, def);
      row.push([x + d[0] * R, baseY + d[1] * R, (lx - MX0) * R * k, (ly - MY0) * R * k]);
    }
    P.push(row);
  }
  for (let j = 0; j < MESH_NY; j++) for (let i = 0; i < MESH_NX; i++) {
    const a = P[j][i], b = P[j][i + 1], cq = P[j + 1][i], dq = P[j + 1][i + 1];
    texTri(c, img, a[0], a[1], b[0], b[1], dq[0], dq[1], a[2], a[3], b[2], b[3], dq[2], dq[3]);
    texTri(c, img, a[0], a[1], dq[0], dq[1], cq[0], cq[1], a[2], a[3], dq[2], dq[3], cq[2], cq[3]);
  }
}

// ============================================================
// メイン画面
// ============================================================
const $ = s => document.querySelector(s);
const cv = $('#cv'), ctx = cv.getContext('2d');
let W = 0, H = 0, DPR = 1;
function resize() {
  const r = cv.getBoundingClientRect();
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = r.width; H = r.height;
  cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
}
window.addEventListener('resize', resize);
resize();

const FEVER_SEC = 8;
// PERFECTになる範囲（帯の中心から片側）。看板の特技で広がる
const perfectHalf = o => Math.min((o.hi - o.lo) * 0.45, (o.hi - o.lo) * 0.22 * (G.mods ? G.mods.perfectZone : 1));
const M = () => G.mods || baseMods();
const ONOMA = [[0.12, 'むにっ'], [0.36, 'むにゅ〜'], [0.6, 'ぎゅむっ'], [0.8, 'ミチミチ…']];

const G = {
  mode: 'title',          // title | play | over
  time: ROUND_SEC, score: 0, combo: 0, maxCombo: 0,
  perfects: 0, goods: 0, misses: 0, bursts: 0, served: 0,
  sq: SQ_BY_ID.bombo, order: null,
  s: 0, sv: 0, pressing: false, pressValid: false, pressServed: -1, holdTick: 0, creakT: 0,
  px: 0, pxT: 0, onomaIdx: 0, onomaSide: 1,
  lock: 0, pendingNext: false, popIn: 1, burstT: 0,
  jig: 0, jigV: 0, sway: 0, swayV: 0, shake: 0, flash: 0, hitstop: 0, zoom: 0,
  mood: 'normal', fever: 0, feverHue: 0, t: 0,
  floaters: [], parts: [], rings: [], splats: [],
};

// タイトルのロゴ下端とUIパネル上端（canvas座標）。表示の変化やリサイズで取り直す
const TITLE_BOX = { logoBottom: 0, panelTop: 0 };
function measureTitle() {
  const app = $('#app').getBoundingClientRect();
  const logo = document.querySelector('.logo'), panel = document.querySelector('.title-bottom');
  if (!logo || !panel || $('#title').classList.contains('hidden')) return;
  TITLE_BOX.logoBottom = logo.getBoundingClientRect().bottom - app.top;
  TITLE_BOX.panelTop = panel.getBoundingClientRect().top - app.top;
}
window.addEventListener('resize', () => requestAnimationFrame(measureTitle));
function layout() {
  const R = Math.min(W * 0.25, H * 0.15);
  const play = G.mode === 'play' || G.mode === 'cont';
  if (G.mode === 'room') {
    const RR = Math.min(W * 0.3, H * 0.18);
    return { cx: W * 0.5, baseY: H * 0.66, R: RR, gx: W - 34, gTop: H * 0.3, gBot: H * 0.74 };
  }
  if (!play && TITLE_BOX.panelTop) {
    // タイトル：ロゴの下〜UIパネルの上のすき間に収める（せまい画面では小さくする）
    const { logoBottom, panelTop } = TITLE_BOX;
    const RT = Math.max(28, Math.min(R, (panelTop - logoBottom) / 2.35));
    // すき間のまん中あたりに置く（お皿の下端がパネルにかからない範囲で）
    const baseYT = Math.min(panelTop - RT * 0.25, Math.max(logoBottom + RT * 2.1, (logoBottom + panelTop) / 2 + RT * 0.9));
    return { cx: W * 0.5, baseY: baseYT, R: RT, gx: W - 34, gTop: H * 0.3, gBot: H * 0.74 };
  }
  const baseY = play ? H * 0.72 : H * 0.5;
  return { cx: play ? W * 0.47 : W * 0.5, baseY, R, gx: W - 34, gTop: H * 0.3, gBot: H * 0.74 };
}

function ownedList() { return SQUISHIES.filter(s => sv.owned[s.id]); }
// ?try=onigiri でタイトルのスクイーズを固定（見た目の確認用）
const TRY_SQ = SQ_BY_ID[new URLSearchParams(location.search).get('try')] || null;
function pickSquishy() {
  if (G.mode !== 'play') return TRY_SQ || SQ_BY_ID[kanbanId()];
  const list = ownedList();
  // 看板スクイーズは よく出てくる
  if (Math.random() < 0.35 && G.sq !== SQ_BY_ID[kanbanId()]) return SQ_BY_ID[kanbanId()];
  let n = list[Math.floor(Math.random() * list.length)];
  if (list.length > 1 && n === G.sq) n = list[(list.indexOf(n) + 1) % list.length];
  return n;
}
function makeBand(keys, widen = 1) {
  const m = M();
  const allow = m.orderKeys && (!keys || keys.some(k => m.orderKeys.includes(k))) ? m.orderKeys : null;
  const pool = ORDERS.filter(o => (!keys || keys.includes(o.key)) && (!allow || allow.includes(o.key)));
  const tot = pool.reduce((a, o) => a + o.wt, 0);
  let r = Math.random() * tot, o = pool[0];
  for (const x of pool) { r -= x.wt; if (r <= 0) { o = x; break; } }
  const diff = Math.min(G.served / 25, 1);
  // 帯の幅をお客さんごとにランダムに。細い「こだわり」ほど点が高い
  const wr = Math.random() * (1 - m.narrowBias);   // お題「こだわり客だらけ」で細い帯が出やすい
  const wm = wr < 0.2 ? 0.55 : wr < 0.45 ? 0.78 : wr < 0.8 ? 1 : 1.35;
  const w = o.w * (1 - 0.35 * diff) * widen * wm * m.widthMul;
  let c = o.c + (Math.random() - 0.5) * 0.07 * diff;
  c = Math.max(w / 2 + 0.06, Math.min(0.985 - w / 2, c));
  return { ...o, c, lo: c - w / 2, hi: c + w / 2, kind: 'normal',
    bandMul: Math.pow(1 / wm, 0.8) * (wm < 0.9 ? m.picky : 1), tag: wm < 0.6 ? 'こだわりつよめ' : wm < 0.9 ? 'こだわり' : wm > 1.2 ? 'おおらか' : '' };
}
// 特殊なお客さん（3人目以降に混ざる）
function pickOrder() {
  // 撮影シーン用：次の注文を指定できる
  if (G.forceOrder) { const f = G.forceOrder; G.forceOrder = null; return f === 'spicy' ? { kind: 'spicy', key: 'spicy', text: 'それは にぎっちゃダメ！', wait: 1.6, waitMax: 1.6, lo: 0, hi: 0, c: 0, mul: 1 } : makeBand([f]); }
  if (G.normalOnly) return makeBand();
  if (G.served >= 3) {
    const r = Math.random(), m = M();
    const wait = Math.max(0.8, m.spicyWait);
    if (r < m.spicyRate) return { kind: 'spicy', key: 'spicy', text: 'それは にぎっちゃダメ！', wait, waitMax: wait, lo: 0, hi: 0, c: 0, mul: 1 };
    if (r < m.spicyRate + m.multiRate) return { ...makeBand(['fuwa', 'shikkari'], 1.15), kind: 'multi', need: 3, done: 0, perfDone: 0, base: 'multi' };
    if (r < m.spicyRate + m.multiRate + m.sideRate) {
      const side = Math.random() < 0.5 ? -1 : 1;
      return { ...makeBand(['shikkari', 'gyu'], m.sideWiden), kind: 'side', side, text: side < 0 ? 'ひだりはしを ぎゅっ！' : 'みぎはしを ぎゅっ！' };
    }
  }
  return makeBand();
}
function orderText(o) {
  if (o.kind === 'multi') return `3かい にぎにぎ！ ${'●'.repeat(o.done)}${'○'.repeat(o.need - o.done)}`;
  return o.text;
}

function resetSquishy() {
  G.s = 0; G.sv = 0; G.popIn = 0; G.mood = G.sq.mood || 'normal'; G.jig = 0; G.jigV = 0; G.sway = 0; G.swayV = 0;
}
function nextCustomer() {
  G.order = pickOrder();
  G.sq = G.order.kind === 'spicy' ? SPICY : pickSquishy();
  G.shiny = G.order.kind === 'normal' && (G.forceShiny || Math.random() < (G.fever > 0 ? SHINY_RATE_FEVER : SHINY_RATE) * M().shinyMul);
  G.forceShiny = false;
  if (G.forceSq) { G.sq = G.forceSq; G.forceSq = null; resetSquishy(); }
  resetSquishy();
  G.served++;
  const special = G.order.kind !== 'normal';
  const tag = G.order.tag ? `・${G.order.tag}${G.order.bandMul > 1.05 ? `（×${G.order.bandMul.toFixed(1)}）` : ''}` : '';
  $('#orderWho').textContent = (special ? `とくべつなおきゃくさん（${G.served}人目）` : `おきゃくさん ${G.served}人目`) + tag;
  $('#orderTxt').textContent = orderText(G.order);
  const ob = $('#order');
  ob.classList.toggle('special', special);
  ob.classList.toggle('danger', G.order.kind === 'spicy');
  ob.classList.add('pop'); setTimeout(() => ob.classList.remove('pop'), 150);
  SFX.pop();
  if (G.shiny) {
    const L = layout();
    floater('キラ！？', L.cx, L.baseY - L.R * 2.3, '#f5a623', 34, 1.0, -0.1);
    floater('PERFECTでゲット', L.cx, L.baseY - L.R * 2.3 + 30, '#a77be0', 16, 1.2);
    SFX.sparkle(); setTimeout(SFX.sparkle, 120); vib([10, 40, 10]);
  }
}
// シェア画像の主役：その回にお渡しできた中で一番レアなもの（キラを取ったらキラが最優先）
const RAR_RANK = { N: 0, R: 1, SR: 2, SSR: 3 };
function noteFeatured(sq, shiny) {
  if (!sq || sq === SPICY) return;
  const f = G.featured;
  if (!f || (shiny && !f.shiny) || (!f.shiny && RAR_RANK[sq.rarity] > RAR_RANK[f.sq.rarity])) G.featured = { sq, shiny };
}
function addCombo() {
  noteFeatured(G.sq, false);
  G.combo++;
  G.maxCombo = Math.max(G.maxCombo, G.combo);
  if (G.combo % M().feverCombo === 0 && G.fever <= 0) startFever();
  const ct = M().comboTime;
  if (ct && G.combo % ct.every === 0) {
    G.time += ct.sec;
    const L = layout(); floater(`+${ct.sec}びょう`, L.cx - L.R * 1.2, L.baseY - L.R * 2.0, '#2aa88a', 18);
  }
}

function floater(text, x, y, color = '#e85d8c', size = 30, life = 0.9, rot = 0, rise = 40) {
  G.floaters.push({ text, x, y, color, size, life, t: 0, rot, rise });
}
function sparkleBurst(x, y, n, kinds, colors, speed = 380) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * TAU, sp = speed * (0.4 + Math.random() * 0.8);
    G.parts.push({
      x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - speed * 0.4, g: 600,
      r: 5 + Math.random() * 7, c: colors[i % colors.length], kind: kinds[i % kinds.length],
      rot: Math.random() * TAU, vr: (Math.random() - 0.5) * 10, life: 0.7 + Math.random() * 0.5, t: 0,
    });
  }
}

// ---------- 入力 ----------
function pointerToPx(clientX) {
  const r = cv.getBoundingClientRect(), L = layout();
  return Math.max(-0.65, Math.min(0.65, (clientX - r.left - L.cx) / L.R));
}
function press(clientX) {
  ac(); bgmStart();
  if (G.pressing) return;
  G.pressing = true;
  G.pressServed = G.served;
  G.pxT = clientX == null ? 0 : pointerToPx(clientX);
  if (G.s < 0.05) G.px = G.pxT;
  G.pressValid = canPress();
  if (G.pressValid) beginSqueeze();
}
function beginSqueeze() {
  if (G.mode === 'play' && G.order && G.order.kind === 'spicy') { spicyFail(); return; }
  G.pressPx = G.pxT;
  G.holdTick = 0; G.onomaIdx = 0; G.onomaSide = Math.random() < 0.5 ? -1 : 1;
  ONOMA.forEach(([th], i) => { if (G.s >= th) G.onomaIdx = i + 1; });
  squelchStart(); SFX.squish(G.s); vib(12);
}
function release() {
  if (!G.pressing) return;
  G.pressing = false;
  squelchStop();
  if (!G.pressValid) return;
  G.pressValid = false;
  const s = G.s;
  if (s > 0.08) {
    const L = layout();
    floater(s > 0.6 ? 'ぷるるんっ' : 'ぽよん', L.cx + G.onomaSide * L.R * 1.1, L.baseY - L.R * 1.5, '#ff9cc2', 22, 0.7, G.onomaSide * 0.15, 30);
  }
  G.sv = 0;
  G.swayV += (Math.random() - 0.5) * 6 * s;
  SFX.release(s);
  if (G.mode !== 'play') { kickJig(s); roomSqueezed(s); return; }
  if (s < 0.05) return; // 誤タップは無視
  judge(s);
}
cv.addEventListener('pointerdown', e => { e.preventDefault(); press(e.clientX); });
let lastMoveX = null;
cv.addEventListener('pointermove', e => {
  if (!G.pressing) { lastMoveX = null; return; }
  G.pxT = pointerToPx(e.clientX);
  // ルーム・タイトルでは、押したまま横にこするとゆらゆら揺れる（なでなで）
  if (G.mode !== 'play' && lastMoveX != null) G.swayV += (e.clientX - lastMoveX) * 0.06;
  lastMoveX = e.clientX;
});
window.addEventListener('pointerup', release);
window.addEventListener('pointercancel', release);
window.addEventListener('contextmenu', e => e.preventDefault());
window.addEventListener('keydown', e => { if (e.code === 'Space' && !e.repeat) { e.preventDefault(); press(); } });
window.addEventListener('keyup', e => { if (e.code === 'Space') release(); });

const canPress = () => G.burstT <= 0 && G.lock <= 0 && G.popIn > 0.6;
function kickJig(s) { G.jigV += 3 + s * 6; }

function judge(v) {
  const o = G.order, L = layout();
  const pz = perfectHalf(o);
  const comboMul = 1 + Math.min(G.combo, 15) * 0.1;
  const feverMul = G.fever > 0 ? 2 : 1;
  let res;
  if (v >= o.lo && v <= o.hi) res = Math.abs(v - o.c) <= pz ? 'perfect' : 'good';
  else res = v < o.lo ? 'weak' : 'strong';
  if (o.kind === 'side' && !(G.pressPx * o.side > 0.18)) res = 'side';

  const fy = L.baseY - L.R * 2.3;
  const cy = L.baseY - L.R * 0.9;

  // 3かい にぎにぎ：途中の1回ずつ
  if (o.kind === 'multi' && (res === 'perfect' || res === 'good') && o.done + 1 < o.need) {
    o.done++; if (res === 'perfect') o.perfDone++;
    const pts = Math.round((res === 'perfect' ? 150 : 70) * o.mul * feverMul);
    G.score += pts;
    floater(`${o.done}/${o.need} ${res === 'perfect' ? 'ぴったり' : 'OK'}`, L.cx, fy, res === 'perfect' ? '#f5a623' : '#5fa8e8', 28, 0.6);
    $('#orderTxt').textContent = orderText(o);
    G.mood = 'happy'; (res === 'perfect' ? SFX.good : SFX.pop)();
    sparkleBurst(L.cx, cy, 5, ['star'], ['#ffd34d', '#ffffff'], 260);
    kickJig(v);
    G.lock = 0.3;   // 次のお客さんへは進まない
    return;
  }
  if (o.kind === 'multi' && (res === 'perfect' || res === 'good')) {
    o.done++; if (res === 'perfect') o.perfDone++;
    $('#orderTxt').textContent = orderText(o);
    res = o.perfDone === o.need ? 'perfect' : 'good';
  }

  const bonus = (o.kind === 'normal' ? 1 : 1.6) * (G.shiny && res === 'perfect' ? 3 : 1) * (o.bandMul || 1)
    * M().scoreMul * (o.kind === 'multi' ? M().multiMul : 1);
  if (res === 'perfect') {
    addCombo(); G.perfects++;
    const pts = Math.round(300 * o.mul * comboMul * feverMul * bonus);
    G.score += pts; G.time += 1;
    floater(o.kind === 'multi' ? '3れんぞく PERFECT!' : 'PERFECT!', L.cx, fy, '#f5a623', o.kind === 'multi' ? 32 : 42);
    floater(`+${pts}`, L.cx, fy + 40, '#e85d8c', 24);
    floater('+1びょう', L.cx + L.R * 1.2, fy + 70, '#2aa88a', 18);
    if (G.shiny) getShiny(G.sq);
    G.mood = 'happy'; SFX.perfect(); SFX.sparkle(); vib([10, 30, 10]);
    G.hitstop = 0.07; G.zoom = 0.06;
    G.rings.push({ x: L.cx, y: cy, t: 0, life: 0.5, c: '#f5b72c' });
    sparkleBurst(L.cx, cy, 16, ['star', 'heart', 'star'], ['#ffd34d', '#ff9cc2', '#ffffff', '#7fd8c4'], 420);
  } else if (res === 'good') {
    addCombo(); G.goods++;
    const pts = Math.round(120 * o.mul * comboMul * feverMul * bonus);
    if (G.shiny) floater('キラは PERFECTじゃないと…', L.cx, fy - 34, '#a77be0', 15, 1.0);
    G.score += pts;
    floater('GOOD', L.cx, fy, '#5fa8e8', 34);
    floater(`+${pts}`, L.cx, fy + 36, '#e85d8c', 22);
    G.mood = 'happy'; SFX.good();
    G.zoom = 0.025;
    sparkleBurst(L.cx, cy, 7, ['dot', 'star'], ['#bfe6ff', '#ffffff'], 300);
  } else {
    G.combo = 0; G.misses++;
    floater({ weak: 'よわい〜', strong: 'つよすぎ！', side: 'そこじゃない〜' }[res], L.cx, fy, '#9a7884', 32);
    if (o.kind === 'multi') floater(`${o.done}/${o.need} で しっぱい`, L.cx, fy + 34, '#9a7884', 16);
    if (G.shiny) floater('キラが にげた…', L.cx, fy - 34, '#a77be0', 16, 1.0);
    G.mood = 'sad'; SFX.miss();
  }
  if (G.combo >= 3 && (res === 'perfect' || res === 'good')) floater(`${G.combo} コンボ`, L.cx - L.R * 1.25, fy + 74, '#a77be0', 18, 0.8);
  kickJig(v);
  G.lock = 0.7; G.pendingNext = true;
}

function getShiny(sq) {
  sv.shiny = sv.shiny || {};
  const isNew = !sv.shiny[sq.id];
  sv.shiny[sq.id] = (sv.shiny[sq.id] || 0) + 1;
  save();
  G.shinyGot = (G.shinyGot || 0) + 1;
  noteFeatured(sq, true);
  const L = layout();
  floater(isNew ? 'キラ ゲット！ NEW' : 'キラ ゲット！', L.cx, L.baseY - L.R * 2.3 - 40, '#ff5e9a', 30, 1.4, -0.06);
  SFX.fanfare(); G.flash = 0.4;
  sparkleBurst(L.cx, L.baseY - L.R, 24, ['star', 'star', 'heart'], ['#ffd34d', '#ff7fa8', '#7fc8ff', '#c79bff', '#ffffff'], 520);
}

function spicyFail() {
  const L = layout();
  G.pressValid = false;
  G.combo = 0; G.misses++;
  G.time = Math.max(0, G.time - 3);
  G.mood = 'squint';
  floater('からっ！！', L.cx, L.baseY - L.R * 2.2, '#ff3b1f', 50, 1.0, -0.08);
  floater('-3びょう', L.cx + L.R * 1.2, L.baseY - L.R * 1.4, '#9a7884', 18);
  sparkleBurst(L.cx, L.baseY - L.R * 0.8, 26, ['dot', 'dot', 'star'], ['#ff3b1f', '#ff8a1f', '#ffd34d'], 480);
  G.shake = 14; G.zoom = 0.05;
  SFX.miss(); sNoise(0.35, 1800, 200, 0.35, 'lowpass', 1); vib([60, 40, 60]);
  kickJig(0.6);
  G.lock = 0.8; G.pendingNext = true;
}
function spicySuccess() {
  const L = layout();
  addCombo();
  const pts = Math.round(220 * (1 + Math.min(G.combo, 15) * 0.1) * (G.fever > 0 ? 2 : 1) * M().spicyMul * M().scoreMul);
  G.score += pts;
  floater('がまん えらい！', L.cx, L.baseY - L.R * 2.3, '#2aa88a', 32);
  floater(`+${pts}`, L.cx, L.baseY - L.R * 2.3 + 36, '#e85d8c', 22);
  SFX.good(); G.mood = 'normal';
  G.lock = 0.35; G.pendingNext = true;
}

function startFever() {
  G.fever = FEVER_SEC;
  const L = layout();
  floater('フィーバー！！', W / 2, H * 0.3, '#ff5e9a', 48, 1.4, -0.08, 20);
  floater('8びょう スコア2ばい', W / 2, H * 0.3 + 40, '#a77be0', 18, 1.4, -0.08, 20);
  SFX.fever(); vib([20, 40, 20, 40, 60]);
  G.flash = 0.6;
  sparkleBurst(W / 2, H * 0.4, 26, ['star', 'heart', 'dot'], ['#ffd34d', '#ff7fa8', '#7fd8c4', '#a77be0', '#ffffff'], 520);
  $('#app').classList.add('fever');
}
function endFever() { G.fever = 0; $('#app').classList.remove('fever'); }

function burst() {
  const L = layout();
  G.pressValid = false;
  G.pressServed = -1;   // 押しっぱなしのまま次の子を にぎらない（いちど指をはなす）
  squelchStop();
  G.bursts++;
  const col = [G.sq.body, G.sq.shade, '#ffffff', '#ffd1df'];
  const cx = L.cx, cy = L.baseY - L.R * 0.5;
  for (let i = 0; i < 40; i++) {
    const a = Math.random() * TAU, sp = 200 + Math.random() * 620;
    G.parts.push({
      x: cx, y: cy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 260, g: 950,
      r: L.R * (0.06 + Math.random() * 0.17), c: col[i % col.length], kind: 'dot',
      rot: 0, vr: 0, life: 1.0 + Math.random() * 0.6, t: 0,
    });
  }
  // 画面にべちゃっと張り付く汁
  for (let i = 0; i < 7; i++) {
    const r = 18 + Math.random() * 38;
    G.splats.push({
      x: 20 + Math.random() * (W - 40), y: H * 0.15 + Math.random() * H * 0.55, r,
      c: col[i % 2], t: 0, life: 1.8 + Math.random() * 0.6,
      blobs: Array.from({ length: 5 }, () => [(Math.random() - 0.5) * r * 1.8, (Math.random() - 0.5) * r * 1.8, r * (0.25 + Math.random() * 0.35)]),
      drips: Array.from({ length: 2 + (i % 2) }, () => [(Math.random() - 0.5) * r, r * (0.12 + Math.random() * 0.12), 30 + Math.random() * 70]),
    });
  }
  G.rings.push({ x: cx, y: cy, t: 0, life: 0.45, c: '#ffffff', w: 14 });
  G.shake = 18; G.flash = 0.35; G.hitstop = 0.09; G.zoom = 0.09;
  SFX.burst(); vib([40, 30, 90]);
  floater('ぱーん！！', cx, L.baseY - L.R * 1.6, '#e85d8c', 52, 1.1, -0.06);
  G.burstT = 0.9;
  if (G.mode === 'play') {
    G.combo = 0;
    if (G.guards > 0) {
      G.guards--;
      floater('ガード！', cx + L.R * 1.2, L.baseY - L.R * 1.1, '#2aa88a', 20);
    } else {
      G.time = Math.max(0, G.time - 2);
      floater('-2びょう', cx + L.R * 1.2, L.baseY - L.R * 1.1, '#9a7884', 18);
    }
    G.pendingNext = true;
  }
}

// ---------- 更新 ----------
function update(dt) {
  G.t += dt;
  if (G.mode === 'play') {
    G.time -= dt;
    if (G.time <= 0) { G.time = 0; if (G.contUsed) endGame(); else offerContinue(); }
  }
  if (G.fever > 0) { G.fever -= dt; G.feverHue += dt * 90; if (G.fever <= 0) endFever(); }
  if (G.popIn < 1) G.popIn = Math.min(1, G.popIn + dt * 3);
  // 登場アニメ中に押し始めた指は、出そろった時点で有効にする（前のお客さんからの押しっぱなしは無効のまま）
  if (G.pressing && !G.pressValid && G.pressServed === G.served && canPress()) {
    G.pressValid = true; beginSqueeze();
  }
  G.px += (G.pxT - G.px) * Math.min(1, dt * 10);

  if (G.burstT > 0) {
    G.burstT -= dt;
    G.s = 0;
    if (G.burstT <= 0) {
      if (G.mode === 'play' && G.pendingNext) { G.pendingNext = false; nextCustomer(); }
      else if (G.mode !== 'play') { if (G.mode !== 'room') G.sq = pickSquishy(); resetSquishy(); SFX.pop(); }
    }
  } else if (G.pressing && G.pressValid) {
    const soft = G.sq.soft;
    const spd = G.mode === 'play' && G.mods ? G.mods.squeezeSpeed : 1;
    G.s = Math.max(G.s, 0) + dt * 0.55 * soft * spd * (0.55 + 1.4 * Math.max(G.s, 0));
    // 撮影シーンの自動プレイ：ねらった強さぴったりで はなす
    if (G.autoTarget != null && G.s >= G.autoTarget) { G.s = G.autoTarget; G.autoTarget = null; release(); }
    G.sv = 0;
    squelchUpdate(G.s, dt);
    G.holdTick += dt;
    if (G.holdTick > 0.15) { G.holdTick = 0; vib(6 + Math.round(G.s * 14)); }
    // 擬音
    if (G.onomaIdx < ONOMA.length && G.s >= ONOMA[G.onomaIdx][0]) {
      const L = layout(), side = G.onomaSide;
      const lv = G.onomaIdx;
      floater(ONOMA[lv][1], L.cx + side * L.R * (1.05 + lv * 0.08), L.baseY - L.R * (1.15 + lv * 0.22),
        lv >= 3 ? '#e85d8c' : '#c0789a', 18 + lv * 4, 0.75, side * (0.12 + lv * 0.04), 18);
      G.onomaSide = -side; G.onomaIdx++;
      SFX.squish(G.s);
    }
    // 破裂寸前：ミチミチ
    if (G.s > 0.8) {
      G.creakT -= dt;
      if (G.creakT <= 0) { G.creakT = 0.05 + Math.random() * 0.09 * (1.1 - G.s) * 4; SFX.creak(G.s); }
    }
    G.mood = G.s > 0.62 ? 'squint' : 'normal';
    if (G.s >= 1) { G.s = 1; burst(); }
  } else {
    if (G.mode === 'play') {
      // ばねで戻る（減衰弱め＝ちょっと縦に伸びすぎて ぽよん）
      G.sv += (-G.s * 120 - G.sv * 11) * dt; G.s += G.sv * dt;
    } else if (G.s > 0.05) {
      // タイトル：ゆ〜っくり戻る（メロジョイ感）
      G.s -= dt * (G.s * 0.75 + 0.015); G.sv = -0.4;
    } else {
      // 戻りきる直前だけ ぽよん
      G.sv += (-G.s * 90 - G.sv * 7) * dt; G.s += G.sv * dt;
    }
    if (Math.abs(G.s) < 0.002 && Math.abs(G.sv) < 0.02) { G.s = 0; G.sv = 0; }
    if (G.s < 0.35 && G.mood === 'squint') G.mood = 'normal';
  }

  if (G.lock > 0) {
    G.lock -= dt;
    if (G.lock <= 0 && G.pendingNext && G.mode === 'play') { G.pendingNext = false; nextCustomer(); }
  }
  // げきから：さわらずに がまんできたら成功
  if (G.mode === 'play' && G.order && G.order.kind === 'spicy' && !G.pendingNext && G.lock <= 0 && G.popIn >= 1) {
    G.order.wait -= dt;
    if (G.order.wait <= 0) spicySuccess();
  }
  // キラ個体・げきからのまわりに粒を出す
  if (G.burstT <= 0 && (G.shiny || G.sq === SPICY) && G.mode !== 'over') {
    G.sparkT = (G.sparkT || 0) - dt;
    if (G.sparkT <= 0) {
      const L = layout();
      G.sparkT = G.shiny ? 0.07 : 0.12;
      const a = Math.random() * TAU;
      const spicy = G.sq === SPICY;
      G.parts.push({
        x: L.cx + Math.cos(a) * L.R * (1.0 + Math.random() * 0.4), y: L.baseY - L.R * 0.9 + Math.sin(a) * L.R * 0.9,
        vx: (Math.random() - 0.5) * 30, vy: spicy ? -70 - Math.random() * 50 : -20 - Math.random() * 30, g: spicy ? -40 : 20,
        r: 3 + Math.random() * 5, c: spicy ? ['#ff6a1f', '#ffb21f'][Math.random() < 0.5 ? 0 : 1] : ['#ffd34d', '#ffffff', '#ff9cc2', '#7fc8ff'][Math.floor(Math.random() * 4)],
        kind: spicy ? 'dot' : 'star', rot: 0, vr: 3, life: 0.6 + Math.random() * 0.4, t: 0,
      });
    }
  }

  // ぷるぷる・ゆれ（バネ）
  G.jigV += (-G.jig * 180 - G.jigV * 9) * dt;
  G.jig += G.jigV * dt * 0.05;
  G.swayV += (-G.sway * 90 - G.swayV * 5) * dt;
  G.sway += G.swayV * dt;

  for (const p of G.parts) { p.t += dt; p.vy += (p.g || 900) * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.985; p.rot += p.vr * dt; }
  G.parts = G.parts.filter(p => p.t < p.life);
  for (const f of G.floaters) f.t += dt;
  G.floaters = G.floaters.filter(f => f.t < f.life);
  for (const r of G.rings) r.t += dt;
  G.rings = G.rings.filter(r => r.t < r.life);
  for (const s of G.splats) s.t += dt;
  G.splats = G.splats.filter(s => s.t < s.life);
  G.shake *= Math.pow(0.0005, dt);
  G.flash = Math.max(0, G.flash - dt * 2.2);
  G.zoom *= Math.pow(0.002, dt);

  if (G.mode === 'play') updateHud();
}

// ---------- 描画 ----------
// AI生成の背景・お皿。読めない間は従来のプログラム描画
const UI_IMG = {};
// bg: カウンター天板の奥の線が画像の上から何割の位置か（スクイーズの底をここに合わせる）
const UI_META = { bg: { src: 'assets/ui/bg.jpg', counterY: 0.6 }, plate: { src: 'assets/ui/plate.png' },
  banner: { src: 'assets/ui/banner.png' }, gacha: { src: 'assets/ui/gacha.png' } };
// 読み込みが終わるまでは前の絵を出し続ける（着せかえで一瞬消えないように）
const UI_SRC = {};
function loadUiImage(k, src) {
  if (UI_SRC[k] === src && UI_IMG[k]) return;
  UI_SRC[k] = src;
  let tries = 0;
  const im = new Image();
  im.onload = () => { if (UI_SRC[k] === src) UI_IMG[k] = im; };
  im.onerror = () => { if (++tries <= 3) setTimeout(() => { im.src = `${src}?r=${tries}`; }, 300 * tries); };
  im.src = src;
}
for (const [k, m] of Object.entries(UI_META)) if (k !== 'bg' && k !== 'plate') loadUiImage(k, m.src);

function drawBgImage(c, L) {
  const im = UI_IMG.bg;
  // 幅いっぱい（足りなければ高さいっぱい）に広げ、カウンター線を baseY に合わせる
  let s = W / im.width;
  let y = L.baseY - UI_META.bg.counterY * im.height * s;
  if (y > 0) { s = L.baseY / (UI_META.bg.counterY * im.height); y = 0; }
  if (y + im.height * s < H) { s = Math.max(s, (H - L.baseY) / ((1 - UI_META.bg.counterY) * im.height)); y = L.baseY - UI_META.bg.counterY * im.height * s; }
  const w = im.width * s;
  c.drawImage(im, (W - w) / 2, y, w, im.height * s);
}

function drawPlate(c, L) {
  const e = Math.max(G.s, 0);
  const im = UI_IMG.plate;
  if (im) {
    // 真上寄りの絵なので、縦をつぶして斜めから見たお皿にする
    const w = L.R * (3.1 + e * 0.15), h = w * 0.34;
    c.drawImage(im, L.cx - w / 2, L.baseY + L.R * 0.1 - h / 2 + e * 2, w, h);
    return;
  }
  c.fillStyle = '#ffffff';
  c.beginPath(); c.ellipse(L.cx, L.baseY + 6 + e * 3, L.R * (1.55 + e * 0.12), L.R * 0.28, 0, 0, TAU); c.fill();
  c.strokeStyle = '#ffd2e0'; c.lineWidth = 3; c.stroke();
}

function drawBg(c) {
  const L = layout();
  if (UI_IMG.bg) {
    drawBgImage(c, L);
    if (G.fever > 0) {
      c.save(); c.globalAlpha = 0.45; drawFeverRays(c, L); c.restore();
    }
    drawPlate(c, L);
    return;
  }
  if (G.fever > 0) {
    drawFeverRays(c, L);
  }
  // ひさし
  const n = 8, sw = W / n;
  for (let i = 0; i < n; i++) {
    c.fillStyle = i % 2 ? '#ffffff' : '#ffb3cb';
    c.beginPath();
    c.moveTo(i * sw, 0); c.lineTo((i + 1) * sw, 0); c.lineTo((i + 1) * sw, 26);
    c.arc(i * sw + sw / 2, 26, sw / 2, 0, Math.PI); c.closePath(); c.fill();
  }
  // 棚の水玉
  c.fillStyle = 'rgba(255,255,255,0.5)';
  for (let y = 70; y < L.baseY - 20; y += 46) for (let x = (y / 46 % 2) * 23; x < W; x += 46) { c.beginPath(); c.arc(x, y, 5, 0, TAU); c.fill(); }
  // カウンター
  c.fillStyle = '#ffd9a8';
  c.fillRect(0, L.baseY, W, H - L.baseY);
  c.fillStyle = '#f7c487';
  c.fillRect(0, L.baseY, W, 10);
  c.fillStyle = 'rgba(255,255,255,0.35)';
  for (let x = -40; x < W; x += 60) c.fillRect(x + ((L.baseY / 10) % 60), L.baseY + 24, 34, 4);
  drawPlate(c, L);
}

// フィーバー：虹色の放射ストライプ
function drawFeverRays(c, L) {
  const cx = W / 2, cy = L.baseY - L.R;
  c.save(); c.translate(cx, cy); c.rotate(G.t * 0.4);
  for (let i = 0; i < 16; i++) {
    c.fillStyle = `hsla(${(G.feverHue + i * 22) % 360}, 90%, 85%, 0.55)`;
    c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, Math.max(W, H) * 1.2, i * TAU / 16, (i + 0.5) * TAU / 16); c.closePath(); c.fill();
  }
  c.restore();
}

function drawGauge(c) {
  if (G.mode !== 'play' || !G.order) return;
  const L = layout(), o = G.order;
  const x = L.gx, top = L.gTop, bot = L.gBot, w = 20, h = bot - top;
  if (o.kind === 'spicy') {
    // がまんメーター（減っていく）
    const k = Math.max(0, o.wait / o.waitMax);
    c.fillStyle = 'rgba(255,255,255,0.9)';
    c.beginPath(); c.roundRect(x - w / 2 - 4, top - 4, w + 8, h + 8, 14); c.fill();
    c.strokeStyle = '#c99a86'; c.lineWidth = 2; c.stroke();
    c.fillStyle = '#ff8a5c';
    c.fillRect(x - w / 2, bot - k * h, w, k * h);
    c.fillStyle = '#c9301c'; c.font = '700 10px "M PLUS Rounded 1c", sans-serif'; c.textAlign = 'center';
    c.fillText('がまん', x, top - 10);
    return;
  }
  const yOf = v => bot - v * h;
  c.fillStyle = 'rgba(255,250,243,0.95)';
  c.beginPath(); c.roundRect(x - w / 2 - 4, top - 4, w + 8, h + 8, 14); c.fill();
  c.strokeStyle = '#c99a86'; c.lineWidth = 2; c.stroke();
  c.fillStyle = '#ffd0d8';
  c.fillRect(x - w / 2, top, w, 6);
  c.fillStyle = 'rgba(127,216,196,0.55)';
  c.fillRect(x - w / 2, yOf(o.hi), w, (o.hi - o.lo) * h);
  const pz = perfectHalf(o);
  c.fillStyle = 'rgba(42,168,138,0.85)';
  c.fillRect(x - w / 2, yOf(o.c + pz), w, pz * 2 * h);
  const v = Math.max(0, Math.min(G.s, 1));
  const inBand = v >= o.lo && v <= o.hi;
  c.fillStyle = inBand ? 'rgba(42,168,138,0.35)' : 'rgba(255,127,168,0.35)';
  c.fillRect(x - w / 2, yOf(v), w, v * h);
  const danger = v > 0.88;
  const jx = danger ? (Math.random() - 0.5) * 3 : 0;
  c.fillStyle = danger ? '#e85d8c' : '#5a3a46';
  c.beginPath(); c.moveTo(x - w / 2 - 12 + jx, yOf(v)); c.lineTo(x - w / 2 - 2 + jx, yOf(v) - 6); c.lineTo(x - w / 2 - 2 + jx, yOf(v) + 6); c.closePath(); c.fill();
  c.fillRect(x - w / 2, yOf(v) - 1.5, w, 3);
  c.fillStyle = danger ? '#e85d8c' : '#9a7884'; c.font = '700 10px "M PLUS Rounded 1c", sans-serif'; c.textAlign = 'center';
  c.fillText('ぱーん', x + jx, top - 10);
}

// 画像スクイーズは顔の表情を変えられないので、まわりの記号で気持ちを出す
function drawMoodFx(c, L) {
  const R = L.R, e = Math.max(0, G.s);
  const topY = L.baseY - R * 1.95 * (1 - 0.5 * e);
  const sideX = R * (1.15 + e * 0.5);
  if (G.mood === 'squint') {
    // 汗＋ぎゅっ線
    const k = Math.min(1, (e - 0.55) / 0.3);
    if (k > 0) {
      c.save();
      c.globalAlpha = k;
      for (const [sx, sy, sz] of [[1, 0.1, 1], [-1, 0.35, 0.8]]) {
        const x = L.cx + sx * sideX * 0.85, y = topY + R * sy + Math.sin(G.t * 9 + sx) * 2;
        const r = R * 0.1 * sz;
        c.fillStyle = '#9fd8ff'; c.strokeStyle = '#fff'; c.lineWidth = 2;
        c.beginPath(); c.moveTo(x, y - r * 1.8); c.quadraticCurveTo(x + r, y - r * 0.2, x, y + r); c.quadraticCurveTo(x - r, y - r * 0.2, x, y - r * 1.8);
        c.fill(); c.stroke();
      }
      c.strokeStyle = '#e85d8c'; c.lineWidth = 3; c.lineCap = 'round';
      for (let i = 0; i < 3; i++) {
        const a = -Math.PI / 2 + (i - 1) * 0.45, x = L.cx - R * 0.55, y = topY - R * 0.1;
        c.beginPath(); c.moveTo(x + Math.cos(a) * R * 0.18, y + Math.sin(a) * R * 0.18); c.lineTo(x + Math.cos(a) * R * 0.34, y + Math.sin(a) * R * 0.34); c.stroke();
      }
      c.restore();
    }
  } else if (G.mood === 'happy') {
    c.save(); c.fillStyle = '#ff7fa8';
    for (let i = 0; i < 2; i++) {
      const ph = (G.t * 1.2 + i * 0.5) % 1;
      c.globalAlpha = 1 - ph;
      c.translate(0, 0);
      c.save(); c.translate(L.cx + (i ? 1 : -1) * R * 0.75, topY - ph * R * 0.5); heart(c, R * 0.12); c.restore();
    }
    c.restore();
  } else if (G.mood === 'sad') {
    c.save(); c.strokeStyle = 'rgba(120,140,200,0.7)'; c.lineWidth = 3; c.lineCap = 'round';
    for (let i = -1; i <= 1; i++) { c.beginPath(); c.moveTo(L.cx + i * R * 0.22, topY - R * 0.35); c.lineTo(L.cx + i * R * 0.22, topY - R * 0.12); c.stroke(); }
    c.restore();
  }
}

function heart(c, r) {
  c.beginPath();
  c.moveTo(0, r * 0.35);
  c.bezierCurveTo(-r * 1.2, -r * 0.4, -r * 0.5, -r * 1.2, 0, -r * 0.45);
  c.bezierCurveTo(r * 0.5, -r * 1.2, r * 1.2, -r * 0.4, 0, r * 0.35);
  c.fill();
}

function drawSplat(c, s) {
  const k = s.t / s.life;
  c.globalAlpha = k < 0.7 ? 0.92 : 0.92 * (1 - (k - 0.7) / 0.3);
  const pop = s.t < 0.08 ? s.t / 0.08 : 1;
  c.fillStyle = s.c;
  c.save(); c.translate(s.x, s.y); c.scale(pop, pop);
  c.beginPath(); c.arc(0, 0, s.r, 0, TAU); c.fill();
  for (const [bx, by, br] of s.blobs) { c.beginPath(); c.arc(bx, by, br, 0, TAU); c.fill(); }
  // たれる
  for (const [dx, dw, dl] of s.drips) {
    const len = dl * Math.min(1, s.t / 1.2);
    c.beginPath(); c.roundRect(dx - dw / 2, 0, dw, s.r * 0.6 + len, dw / 2); c.fill();
    c.beginPath(); c.arc(dx, s.r * 0.6 + len, dw * 0.75, 0, TAU); c.fill();
  }
  c.fillStyle = 'rgba(255,255,255,0.5)';
  c.beginPath(); c.ellipse(-s.r * 0.35, -s.r * 0.35, s.r * 0.28, s.r * 0.16, -0.6, 0, TAU); c.fill();
  c.restore();
  c.globalAlpha = 1;
}

function render() {
  const c = ctx, L = layout();
  c.setTransform(DPR, 0, 0, DPR, 0, 0);
  c.clearRect(0, 0, W, H);
  c.save();
  if (G.shake > 0.3) c.translate((Math.random() - 0.5) * G.shake, (Math.random() - 0.5) * G.shake);
  // ズームパンチ
  if (G.zoom > 0.001) {
    const zx = L.cx, zy = L.baseY - L.R;
    c.translate(zx, zy); c.scale(1 + G.zoom, 1 + G.zoom); c.translate(-zx, -zy);
  }
  drawBg(c);

  if (G.burstT <= 0) {
    const pop = G.popIn < 1 ? easeBack(G.popIn) : 1;
    c.save();
    c.translate(L.cx, L.baseY); c.scale(pop, pop); c.translate(-L.cx, -L.baseY);
    const tremble = G.pressing && G.pressValid && G.s > 0.7 ? (Math.random() - 0.5) * (G.s - 0.7) * 14 : 0;
    drawSquishySoft(c, G.sq, L.cx + tremble, L.baseY, L.R,
      { e: G.s, px: G.px, jig: G.jig, sway: G.sway }, G.mood, DPR, G.shiny);
    if (IMG[G.sq.id]) drawMoodFx(c, L);
    // 「ここを押して」の矢印
    if (G.mode === 'play' && G.order && G.order.kind === 'side' && !G.pendingNext) {
      const ax = L.cx + G.order.side * L.R * 0.62, ay = L.baseY - L.R * (2.05 - G.s * 0.8) + Math.sin(G.t * 8) * 5;
      c.fillStyle = '#ff5e9a'; c.strokeStyle = '#fff'; c.lineWidth = 4; c.lineJoin = 'round';
      c.beginPath(); c.moveTo(ax - 13, ay - 18); c.lineTo(ax + 13, ay - 18); c.lineTo(ax, ay); c.closePath(); c.stroke(); c.fill();
      c.font = '800 13px "M PLUS Rounded 1c", sans-serif'; c.textAlign = 'center';
      c.strokeText('ここ', ax, ay - 24); c.fillText('ここ', ax, ay - 24);
    }
    // 破裂寸前は赤く張りつめる（判定のあるプレイ中だけ。ルーム・タイトルでは出さない）
    if (G.mode === 'play' && G.pressing && G.s > 0.85) {
      c.globalAlpha = (G.s - 0.85) / 0.15 * (0.25 + 0.15 * Math.sin(G.t * 40));
      c.fillStyle = '#ff4f7a';
      c.beginPath(); c.ellipse(L.cx, L.baseY - L.R * 0.5, L.R * 1.6, L.R * 0.6, 0, 0, TAU); c.fill();
      c.globalAlpha = 1;
    }
    c.restore();
  }
  for (const r of G.rings) {
    const k = r.t / r.life;
    c.globalAlpha = 1 - k;
    c.strokeStyle = r.c; c.lineWidth = (r.w || 8) * (1 - k);
    c.beginPath(); c.ellipse(r.x, r.y, L.R * (0.8 + k * 1.6), L.R * (0.5 + k * 1.1), 0, 0, TAU); c.stroke();
  }
  for (const p of G.parts) {
    c.globalAlpha = Math.max(0, 1 - Math.pow(p.t / p.life, 2));
    c.fillStyle = p.c;
    if (p.kind === 'dot') { c.beginPath(); c.arc(p.x, p.y, p.r, 0, TAU); c.fill(); }
    else {
      c.save(); c.translate(p.x, p.y); c.rotate(p.rot);
      if (p.kind === 'star') star(c, 0, 0, p.r * 1.4); else heart(c, p.r * 1.3);
      c.restore();
    }
  }
  c.globalAlpha = 1;
  drawGauge(c);
  for (const f of G.floaters) {
    const k = f.t / f.life;
    c.globalAlpha = Math.max(0, 1 - k * k);
    const sc = k < 0.15 ? 0.5 + k / 0.15 * 0.5 + Math.sin(k / 0.15 * Math.PI) * 0.25 : 1;
    c.save();
    c.font = `800 ${f.size}px "M PLUS Rounded 1c", sans-serif`;
    const hw = c.measureText(f.text).width / 2 + 10;
    const fx = Math.max(hw, Math.min(W - hw - (G.mode === 'play' ? 44 : 0), f.x));
    c.translate(fx, f.y - k * f.rise); c.rotate(f.rot); c.scale(sc, sc);
    c.textAlign = 'center'; c.lineJoin = 'round';
    c.lineWidth = Math.max(5, f.size * 0.2); c.strokeStyle = '#fff';
    c.strokeText(f.text, 0, 0);
    c.fillStyle = f.color; c.fillText(f.text, 0, 0);
    c.restore();
  }
  c.globalAlpha = 1;
  c.restore();
  for (const s of G.splats) drawSplat(c, s);
  if (G.flash > 0) { c.fillStyle = `rgba(255,255,255,${Math.min(0.7, G.flash)})`; c.fillRect(0, 0, W, H); }
}
function easeBack(t) { const s = 1.9; t -= 1; return t * t * ((s + 1) * t + s) + 1; }

// ============================================================
// 画面遷移
// ============================================================
const show = (id, on) => $(id).classList.toggle('hidden', !on);

function updateHud() {
  const t = Math.ceil(G.time);
  const el = $('#hudTime');
  el.textContent = t; el.classList.toggle('low', t <= 10);
  $('#hudScore').textContent = G.score;
  $('#hudCombo').textContent = G.combo;
}

function kanbanId() {
  if (sv.kanban && sv.owned[sv.kanban]) return sv.kanban;
  return ownedList()[0].id;
}
function refreshTitle() {
  $('#tCoins').textContent = sv.coins; $('#tGems').textContent = sv.gems;
  refreshStaminaUI(); refreshMissionBadge();
  $('#tRankInfo').textContent = `${sv.week.best ? `今週${myRank()}位` : '今週 記録なし'}・${todayRule().name}`;
  const rc = roomCount();
  $('#tRoomInfo').textContent = rc.rewarded ? 'じゆうに さわれるよ' : `今日 ${Math.min(rc.count, ROOM_GOAL)}/${ROOM_GOAL}で+${ROOM_REWARD}コイン`;
  const kb = SQ_BY_ID[kanbanId()];
  $('#tKanban').innerHTML = `<b>看板：${kb.name}</b> <span class="lv">Lv${skillLv(kb.id)}</span><br><small>${skillText(kb.id)}</small>`;
  const ev = activeEvent();
  show('#tEvent', !!ev);
  if (ev) $('#tEvent').textContent = `${ev.name} 開催中！ 〜${ev.end.slice(5).replace('-', '/')}`;
  requestAnimationFrame(measureTitle);
  // フォント読み込み後に高さが変わることがあるので、もう一度
  if (document.fonts) document.fonts.ready.then(() => requestAnimationFrame(measureTitle));
}
function toTitle() {
  G.mode = 'title';
  endFever();
  ['#hud', '#order', '#holdHint', '#result', '#gacha', '#dex', '#shop', '#room', '#rank', '#prep', '#cont'].forEach(id => show(id, false));
  show('#title', true);
  // 週の集計・月パスのうけとり
  const msgs = [checkWeekRollover(), claimPass()].filter(Boolean);
  if (msgs.length) toast(msgs.join('／'));
  refreshTitle();
  G.order = null; G.shiny = false; G.sq = SQ_BY_ID[kanbanId()]; resetSquishy();
}

function startGame(daily = true, boosts = []) {
  ac(); bgmStart();
  endFever();
  const mods = computeMods(daily, boosts.some(b => b.skill) ? 1 : 0);
  boosts.forEach(b => b.apply && b.apply(mods));
  Object.assign(G, {
    mode: 'play', daily: !!daily, mods, guards: mods.burstGuard, contUsed: false, boosts: boosts.map(b => b.name),
    time: mods.startTime, score: 0, combo: 0, maxCombo: 0,
    perfects: 0, goods: 0, misses: 0, bursts: 0, served: 0, shinyGot: 0, featured: null,
    lock: 0, pendingNext: false, burstT: 0, floaters: [], parts: [], rings: [], splats: [],
    pressing: false, pressValid: false,
  });
  ['#title', '#result', '#gacha', '#dex', '#shop', '#prep', '#rank', '#room'].forEach(id => show(id, false));
  ['#hud', '#order', '#holdHint'].forEach(id => show(id, true));
  nextCustomer();
  updateHud();
  if (boosts.length) floater(boosts.map(b => b.name).join('・'), W / 2, H * 0.33 + 84, '#f0a92a', 15, 2.2, 0, 10);
  // 開始時に看板の特技（とお題）を知らせる
  const L = layout(), kb = kanbanId();
  floater(`看板：${SQ_BY_ID[kb].name}`, W / 2, H * 0.33, '#e2648c', 22, 2.0, 0, 10);
  floater(SKILLS[kb] ? SKILLS[kb].name : '', W / 2, H * 0.33 + 28, '#a77be0', 18, 2.0, 0, 10);
  if (daily) floater(`今日のお題：${todayRule().name}`, W / 2, H * 0.33 + 56, '#2aa88a', 18, 2.2, 0, 10);
}

let lastResult = null;
function endGame() {
  G.mode = 'over';
  G.pressing = false; G.pressValid = false; squelchStop();
  endFever();
  const lvBefore = shopLevel();
  let coins = Math.floor(G.score / COIN_DIV * G.mods.coinMul * levelCoinBonus(lvBefore));
  const isBest = G.score > sv.best;
  // お店の経験値＝スコア
  sv.xp += G.score;
  const lvAfter = shopLevel();
  let extra = '';
  if (lvAfter > lvBefore) {
    const reward = 100 * lvAfter;
    coins += reward;
    extra += `<br><span class="lvup">おみせ Lv${lvAfter} にアップ！ +${reward}コイン</span>`;
  }
  // 今日のお題
  if (G.daily) {
    const k = todayKey(), d = sv.daily[k] || { best: 0, rewarded: false };
    if (!d.rewarded) { d.rewarded = true; coins += DAILY_REWARD; sv.gems += 10; extra += `<br><span class="lvup">今日はじめてのプレイ！ +${DAILY_REWARD}コイン・${GEM_IC}10</span>`; }
    if (G.score > d.best) { d.best = G.score; extra += `<br><small>今日のお題ベスト更新！</small>`; }
    sv.daily = { [k]: d };   // 今日の分だけ残す
  }
  sv.coins += coins;
  if (isBest) sv.best = G.score;
  bumpMission('play'); if (G.perfects) bumpMission('perfect', G.perfects);
  // 週間ランキング
  checkWeekRollover();
  const rankBefore = sv.week.best ? myRank() : null;
  const weekBest = G.score > sv.week.best;
  if (weekBest) sv.week.best = G.score;
  const rankAfter = myRank();
  save();
  $('#resWeek').innerHTML = weekBest
    ? `今週ベスト更新！ <b>${rankBefore ? `${rankBefore}位 → ` : ''}${rankAfter}位</b>${rankBefore && rankAfter < rankBefore ? ' ⤴' : ''}`
    : `今週 ${rankAfter}位（ベスト ${sv.week.best}）`;
  lastResult = { score: G.score, rank: rankOf(G.score), perfects: G.perfects, goods: G.goods, maxCombo: G.maxCombo, bursts: G.bursts, served: G.served - 1,
    sq: (G.featured && G.featured.sq) || (G.sq === SPICY ? SQUISHIES[0] : G.sq), shiny: !!(G.featured && G.featured.shiny), shinyGot: G.shinyGot || 0 };
  ['#hud', '#order', '#holdHint'].forEach(id => show(id, false));
  $('#resRank').textContent = lastResult.rank;
  $('#resScore').textContent = G.score;
  const rb = $('#resBest');
  rb.textContent = isBest ? 'ベスト更新！' : `ベスト ${sv.best}`;
  rb.classList.toggle('new', isBest);
  $('#resStats').innerHTML =
    `<div>${G.perfects}<span>PERFECT</span></div><div>${G.goods}<span>GOOD</span></div>` +
    `<div>${G.maxCombo}<span>最大コンボ</span></div><div>${G.bursts}<span>ぱーん</span></div>`;
  $('#resCoin').innerHTML = `コイン <b>+${coins}</b>（もってる ${sv.coins}）` +
    (G.shinyGot ? `<br><span class="shinytag">✨ キラ ${G.shinyGot}こ ゲット！</span>` : '') + extra;
  G.shiny = false;
  show('#result', true);
  if (isBest) SFX.fanfare(); else SFX.coin();
}

// ---------- ガチャ ----------
let gachaReturn = 'title';
// ガチャは2種類：コイン（無料で貯まる・N/R中心）とプレミアム（ジェム・SR/SSRが出やすい・限定・天井）
const GACHAS = {
  premium: { name: 'プレミアム', cur: 'gems', cost: 30, cost10: 300, rates: { N: 40, R: 35, SR: 20, SSR: 5 }, pickup: true, pity: 100 },
  coin:    { name: 'コイン',     cur: 'coins', cost: 300, cost10: 3000, rates: { N: 70, R: 25, SR: 4.5, SSR: 0.5 }, pickup: false, pity: 0 },
};
let gachaKind = 'premium';
// ジェム（課金通貨）のアイコン。テキストの ◆ のかわりに使う
const GEM_IC = '<img class="gem-ic" src="assets/ui/gem.png" alt="ジェム">';
const curName = c => c === 'gems' ? GEM_IC : 'コイン';
function openGacha(from) {
  gachaReturn = from;
  show('#gacha', true);
  sizeGachaCanvas();
  GA.phase = 'idle'; GA.t = 0; GA.parts = []; GA.multi = null;
  renderGachaInfo();
  refreshGacha();
}
function renderGachaInfo() {
  const g = GACHAS[gachaKind], ev = activeEvent();
  document.querySelectorAll('#gachaTabs button').forEach(b => b.classList.toggle('on', b.dataset.g === gachaKind));
  $('#gachaInfo').innerHTML =
    (gachaKind === 'premium'
      ? `SSR ${g.rates.SSR}%・SR ${g.rates.SR}%｜10連は さいごの1こ SR以上！<br>` +
        `<span class="pity">SSRかくてい まで あと <b>${g.pity - (sv.pity || 0)}</b> 回</span>` +
        (ev ? `<br><span class="evtag">${ev.name}限定 ピックアップ中！</span>` : '')
      : `コインで ひける ガチャ（N・Rが 中心）<br><small>おなじ子が かさなると 特技Lvアップ</small>`);
  $('#btnPull').innerHTML = `1回 ${curName(g.cur)}${g.cost}`;
  $('#btnPull10').innerHTML = `10連 ${curName(g.cur)}${g.cost10}`;
}
function refreshGacha() {
  const g = GACHAS[gachaKind], busy = GA.phase !== 'idle' && GA.phase !== 'done';
  $('#gCoins').textContent = sv.coins; $('#gGems').textContent = sv.gems;
  $('#btnPull').disabled = busy || sv[g.cur] < g.cost;
  $('#btnPull10').disabled = busy || sv[g.cur] < g.cost10;
}
document.querySelectorAll('#gachaTabs button').forEach(b => b.addEventListener('click', () => {
  if (GA.phase !== 'idle' && GA.phase !== 'done') return;
  gachaKind = b.dataset.g; GA.phase = 'idle'; GA.multi = null; renderGachaInfo(); refreshGacha();
}));
function rollRarity(rates) {
  const tot = Object.values(rates).reduce((a, b) => a + b, 0);
  let r = Math.random() * tot;
  for (const [k, w] of Object.entries(rates)) { r -= w; if (r <= 0) return k; }
  return 'N';
}
// minRar: 'SR' なら SR以上を保証（10連の最後）。forceSSR は天井
function rollGacha(kind = 'premium', minRar = null, forceSSR = false) {
  const g = GACHAS[kind], ev = activeEvent();
  let rates = { ...g.rates };
  if (forceSSR) rates = { SSR: 1 };
  else if (minRar === 'SR') rates = { SR: rates.SR, SSR: rates.SSR };
  const rar = rollRarity(rates);
  // プレミアムはイベント中、一定確率で限定ピックアップ枠から（引いたレアリティと同じ限定がいれば）
  if (g.pickup && ev && Math.random() < ev.pickup) {
    const lim = SQUISHIES.filter(s => s.limited === ev.id && s.rarity === rar);
    if (lim.length) return lim[Math.floor(Math.random() * lim.length)];
  }
  const pool = SQUISHIES.filter(s => s.rarity === rar && !s.limited);
  return pool[Math.floor(Math.random() * pool.length)];
}
// 1回分の結果をセーブに反映
function grantPull(kind, minRar) {
  const g = GACHAS[kind];
  let forceSSR = false;
  if (g.pity) { sv.pity = (sv.pity || 0) + 1; if (sv.pity >= g.pity) forceSSR = true; }
  const got = rollGacha(kind, minRar, forceSSR);
  if (g.pity && got.rarity === 'SSR') sv.pity = 0;
  const shiny = Math.random() < SHINY_RATE_GACHA;
  const isNew = !sv.owned[got.id];
  sv.owned[got.id] = (sv.owned[got.id] || 0) + 1;
  if (shiny) { sv.shiny = sv.shiny || {}; sv.shiny[got.id] = (sv.shiny[got.id] || 0) + 1; }
  if (!isNew && !shiny) sv.coins += DUP_REFUND;
  return { got, shiny, isNew, pity: forceSSR };
}
// ---- ガチャ演出 ----
// idle → shake(機械ガラガラ) → drop(カプセルころん) → wait(タップ待ち) →[upgrade(昇格)→wait]→ open → done
const CAP_COLOR = { N: ['#ffb3c9', '#ff86a8'], R: ['#a9d6ff', '#5fa8f0'], SR: ['#d6bcff', '#a77be0'], SSR: ['#ffe58a', '#f5b02a'] };
const GA = { phase: 'idle', t: 0, got: null, shiny: false, isNew: false, shown: 'N', upgrade: false, taps: 0, capY: 0, capVY: 0, bounces: 0, parts: [] };
const gcv = $('#gachaCv'), gctx = gcv.getContext('2d');
const GW = 290, GH = 290;
function sizeGachaCanvas() {
  const r = gcv.getBoundingClientRect();
  const w = r.width || GW;
  gcv.width = Math.round(w * DPR); gcv.height = Math.round(w * DPR);
  GA.scale = w / GW;
}

const RAR_ORDER = ['N', 'R', 'SR', 'SSR'];
function pullGacha(n = 1) {
  const g = GACHAS[gachaKind], cost = n === 10 ? g.cost10 : g.cost;
  if (sv[g.cur] < cost || (GA.phase !== 'idle' && GA.phase !== 'done')) return;
  ac(); sizeGachaCanvas();
  sv[g.cur] -= cost;
  const results = [];
  for (let i = 0; i < n; i++) {
    // 10連の最後は、それまでにSR以上が無ければSR以上を保証（プレミアムのみ）
    const needSR = n === 10 && i === 9 && gachaKind === 'premium' && !results.some(r => RAR_RANK[r.got.rarity] >= 2);
    results.push(grantPull(gachaKind, needSR ? 'SR' : null));
  }
  save();
  bumpMission('gacha', n);
  // カプセルの色は一番いい結果。SR以上は半分の確率で「ピンク→タップで色が変わる」昇格演出
  const best = results.reduce((a, r) => (RAR_RANK[r.got.rarity] > RAR_RANK[a.got.rarity] || (r.shiny && !a.shiny) ? r : a), results[0]);
  const high = RAR_RANK[best.got.rarity] >= 2;
  const upgrade = high && Math.random() < 0.5;
  Object.assign(GA, { phase: 'shake', t: 0, got: best.got, shiny: best.shiny, isNew: best.isNew, multi: n > 1 ? results : null,
    upgrade, shown: upgrade ? 'N' : best.got.rarity, taps: 0, parts: [], capY: 0, capVY: 0, bounces: 0, flash: 0 });
  $('#gachaInfo').innerHTML = 'ガラガラ…';
  refreshGacha();
}

function gachaTap() {
  if (GA.phase !== 'wait') return;
  ac();
  GA.taps++;
  if (GA.upgrade && GA.shown !== GA.got.rarity) {
    // 昇格！
    GA.shown = GA.got.rarity; GA.phase = 'upgrade'; GA.t = 0; GA.flash = 1;
    SFX.fever(); vib([20, 30, 40]);
    gachaBurst(GW / 2, 175, 22, CAP_COLOR[GA.shown], 300);
    $('#gachaInfo').innerHTML = '<span class="hint">！？ いろが かわった！</span>';
    return;
  }
  GA.phase = 'open'; GA.t = 0; GA.flash = 0.9;
  SFX.burst(); SFX.sparkle(); vib([30, 20, 60]);
  gachaBurst(GW / 2, 175, GA.got.rarity === 'SSR' || GA.shiny ? 46 : 28, [...CAP_COLOR[GA.shown], '#ffffff', '#ffd34d'], 420);
}
gcv.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); gachaTap(); });

function gachaBurst(x, y, n, colors, speed) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * TAU, sp = speed * (0.3 + Math.random() * 0.8);
    GA.parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - speed * 0.3, r: 3 + Math.random() * 5,
      c: colors[i % colors.length], kind: i % 3 ? 'star' : 'dot', rot: Math.random() * TAU, t: 0, life: 0.8 + Math.random() * 0.6 });
  }
}

function gachaReveal() {
  const got = GA.got, shiny = GA.shiny, isNew = GA.isNew;
  if (GA.multi) {
    const cnt = {}; let news = 0, shinies = 0;
    GA.multi.forEach(r => { cnt[r.got.rarity] = (cnt[r.got.rarity] || 0) + 1; if (r.isNew) news++; if (r.shiny) shinies++; });
    $('#gachaInfo').innerHTML = RAR_ORDER.slice().reverse().filter(k => cnt[k]).map(k => `<span class="rar ${k}">${k}</span>×${cnt[k]}`).join(' ') +
      (news ? ` <span class="newtag">NEW ${news}</span>` : '') + (shinies ? ` <span class="shinytag">✨キラ ${shinies}</span>` : '') +
      (GA.multi.some(r => r.pity) ? '<br><span class="pity">天井で SSR かくてい！</span>' : '');
  } else {
    $('#gachaInfo').innerHTML = `<span class="rar ${got.rarity}">${got.rarity}</span>` +
      (shiny ? '<span class="shinytag">✨キラ！</span> ' : '') +
      (isNew ? '<span class="newtag">NEW!</span>' : shiny ? '' : `<span>かぶり +${DUP_REFUND}コイン・特技Lv${skillLv(got.id)}</span>`) +
      (got.limited ? ' <span class="evtag">限定</span>' : '') +
      `<span class="nm">${shiny ? 'キラ' : ''}${got.name}</span><small>${skillText(got.id)}</small>`;
  }
  if (shiny || got.rarity === 'SR' || got.rarity === 'SSR') SFX.fanfare(); else SFX.perfect();
}

function gachaUpdate(dt) {
  if ($('#gacha').classList.contains('hidden')) return;
  GA.t += dt;
  GA.flash = Math.max(0, (GA.flash || 0) - dt * 2.5);
  if (GA.phase === 'shake') {
    if (Math.floor(GA.t / 0.09) !== Math.floor((GA.t - dt) / 0.09)) { sNoise(0.06, 2500, 900, 0.12, 'bandpass', 3); sTone(300 + Math.random() * 200, 200, 0.05, 0.03, 'square'); }
    if (GA.t > 0.9) { GA.phase = 'drop'; GA.t = 0; GA.capY = 0; GA.capVY = 0; GA.bounces = 0; }
  } else if (GA.phase === 'drop') {
    // 取り出し口からころん→床でぽよんぽよん
    GA.capVY += 1500 * dt; GA.capY += GA.capVY * dt;
    const floor = 1;
    if (GA.capY >= floor * 60) {
      GA.capY = 60; GA.capVY *= -0.45; GA.bounces++;
      sTone(420 - GA.bounces * 60, 260, 0.08, 0.1, 'triangle');
      if (GA.bounces >= 3 || Math.abs(GA.capVY) < 60) {
        GA.phase = 'wait'; GA.t = 0;
        $('#gachaInfo').innerHTML = '<span class="hint">タップして あけてね！</span>';
      }
    }
  } else if (GA.phase === 'upgrade') {
    if (GA.t > 0.6) { GA.phase = 'wait'; GA.t = 0; $('#gachaInfo').innerHTML = '<span class="hint">タップ！</span>'; }
  } else if (GA.phase === 'open') {
    if (GA.t > 0.35 && !GA.revealed) { GA.revealed = true; gachaReveal(); }
    if (GA.t > 0.9) { GA.phase = 'done'; GA.revealed = false; refreshGacha(); }
  }
  for (const p of GA.parts) { p.t += dt; p.vy += 500 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += dt * 4; }
  GA.parts = GA.parts.filter(p => p.t < p.life);
  if (GA.phase === 'done' && Math.random() < dt * (GA.got.rarity === 'SSR' || GA.shiny ? 14 : 5)) {
    const a = Math.random() * TAU;
    GA.parts.push({ x: GW / 2 + Math.cos(a) * 90, y: 170 + Math.sin(a) * 70, vx: 0, vy: -30, r: 4 + Math.random() * 4,
      c: ['#ffffff', '#ffd34d', CAP_COLOR[GA.got.rarity][0]][Math.floor(Math.random() * 3)], kind: 'star', rot: 0, t: 0, life: 0.9 });
  }
}

function drawCapsule(c, x, y, r, rar, open = 0, wobble = 0) {
  const [lt, dk] = CAP_COLOR[rar];
  c.save(); c.translate(x, y); c.rotate(wobble);
  c.lineWidth = 3; c.strokeStyle = '#6b4436';
  // 下半分（クリーム）
  c.save(); c.translate(0, open * r * 1.2); c.rotate(open * 0.5);
  c.beginPath(); c.arc(0, 0, r, 0, Math.PI); c.closePath();
  const gb = c.createLinearGradient(0, 0, 0, r); gb.addColorStop(0, '#fffdf9'); gb.addColorStop(1, '#f2dfcc');
  c.fillStyle = gb; c.fill(); c.stroke();
  c.restore();
  // 上半分（レアリティ色）
  c.save(); c.translate(0, -open * r * 1.6); c.rotate(-open * 0.9);
  c.beginPath(); c.arc(0, 0, r, Math.PI, TAU); c.closePath();
  if (rar === 'SSR') {
    const rg = c.createLinearGradient(-r, -r, r, 0);
    ['#ff9fc0', '#ffd34d', '#8fe3b0', '#8fc8ff', '#c79bff'].forEach((col, i) => rg.addColorStop(i / 4, col));
    c.fillStyle = rg;
  } else {
    const gt = c.createLinearGradient(0, -r, 0, 0); gt.addColorStop(0, lt); gt.addColorStop(1, dk); c.fillStyle = gt;
  }
  c.fill(); c.stroke();
  c.fillStyle = 'rgba(255,255,255,0.6)';
  c.beginPath(); c.ellipse(-r * 0.38, -r * 0.55, r * 0.26, r * 0.13, -0.5, 0, TAU); c.fill();
  c.restore();
  // 帯
  if (open < 0.05) { c.fillStyle = '#6b4436'; c.fillRect(-r, -1.5, r * 2, 3); }
  c.restore();
}

function gachaRender() {
  if ($('#gacha').classList.contains('hidden')) return;
  const c = gctx, k = DPR * (GA.scale || 1);
  c.setTransform(k, 0, 0, k, 0, 0);
  c.clearRect(0, 0, GW, GH);
  const ph = GA.phase, t = GA.t;
  const machine = UI_IMG.gacha;
  // 機械（開封後は消える）
  const machineAlpha = ph === 'idle' || ph === 'shake' || ph === 'drop' ? 1 : ph === 'wait' || ph === 'upgrade' ? 0.35 : Math.max(0, 0.35 - t);
  if (machineAlpha > 0) {
    c.save(); c.globalAlpha = machineAlpha;
    const sh = ph === 'shake' ? Math.sin(t * 60) * 4 : 0;
    c.translate(GW / 2 + sh, 0); c.rotate(ph === 'shake' ? Math.sin(t * 45) * 0.03 : 0);
    if (machine) {
      const mh = 230, mw = mh * machine.width / machine.height;
      c.drawImage(machine, -mw / 2, 6, mw, mh);
    } else {
      c.fillStyle = '#ffd6e2'; c.strokeStyle = '#6b4436'; c.lineWidth = 3;
      c.beginPath(); c.arc(0, 80, 70, 0, TAU); c.fill(); c.stroke();
      c.beginPath(); c.roundRect(-60, 130, 120, 100, 18); c.fill(); c.stroke();
    }
    c.restore();
  }
  // 後光（開封後）
  if (ph === 'open' || ph === 'done') {
    const rar = GA.got.rarity, col = CAP_COLOR[rar][0];
    c.save(); c.translate(GW / 2, 170); c.rotate((ph === 'done' ? GA.t + 0.9 : t) * 0.6);
    const n = 14, len = 220 * Math.min(1, (ph === 'open' ? t : 1) * 3);
    for (let i = 0; i < n; i++) {
      c.fillStyle = rar === 'SSR' || GA.shiny ? `hsla(${(i * 26 + GA.t * 80) % 360},90%,82%,0.55)` : col;
      c.globalAlpha = rar === 'SSR' || GA.shiny ? 1 : 0.5;
      c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, len, i * TAU / n, (i + 0.5) * TAU / n); c.closePath(); c.fill();
    }
    c.restore();
    const glow = c.createRadialGradient(GW / 2, 170, 10, GW / 2, 170, 120);
    glow.addColorStop(0, 'rgba(255,255,255,0.95)'); glow.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = glow; c.fillRect(0, 0, GW, GH);
  }
  // カプセル
  if (ph === 'drop' || ph === 'wait' || ph === 'upgrade' || (ph === 'open' && t < 0.5)) {
    let x = GW / 2, y, r, wob = 0, open = 0;
    if (ph === 'drop') { y = 196 + GA.capY * 0.35; r = 20 + GA.capY * 0.15; }
    else {
      const ease = Math.min(1, (ph === 'wait' ? t : 1) * 4);
      y = 217 - 45 * ease; r = 29 + 17 * ease;
      wob = ph === 'wait' ? Math.sin(GA.t * 9) * 0.12 * (0.6 + 0.4 * Math.sin(GA.t * 2.3)) : 0;
      if (ph === 'upgrade') { wob = Math.sin(t * 50) * 0.2 * (1 - t); r += Math.sin(t * 20) * 2; }
      if (ph === 'open') { open = Math.min(1, t * 3.2); c.globalAlpha = 1 - Math.max(0, t - 0.3) * 5; }
    }
    drawCapsule(c, x, y, r, GA.shown, open, wob);
    c.globalAlpha = 1;
  }
  // 中身
  if (GA.multi && ((ph === 'open' && t > 0.15) || ph === 'done')) {
    // 10連：5×2のマスに順番にぽんぽん出す
    GA.multi.forEach((r, i) => {
      const k = ph === 'done' ? 1 : Math.max(0, Math.min(1, (t - 0.15 - i * 0.04) / 0.3));
      if (k <= 0) return;
      const col = i % 5, row = Math.floor(i / 5);
      const x = 33 + col * 56, y = 120 + row * 96;
      c.save(); c.translate(x, y); c.scale(easeBack(k), easeBack(k));
      const rc = CAP_COLOR[r.got.rarity];
      c.fillStyle = r.got.rarity === 'SSR' || r.shiny ? `hsla(${(i * 40 + GA.t * 90) % 360},90%,86%,1)` : rc[0];
      c.strokeStyle = '#6b4436'; c.lineWidth = 2;
      c.beginPath(); c.roundRect(-25, -38, 50, 80, 12); c.fill(); c.stroke();
      drawSquishy(c, r.got, 0, 22, 19, 0, 0, 'happy', 1, false, r.shiny);
      c.font = `800 10px ${FONT}`; c.textAlign = 'center'; c.fillStyle = '#6b4436';
      c.fillText(r.got.rarity, 0, 36);
      if (r.isNew) { c.fillStyle = '#e2648c'; c.fillText('NEW', 0, -27); }
      c.restore();
    });
  } else if ((ph === 'open' && t > 0.15) || ph === 'done') {
    const pop = ph === 'done' ? 1 : easeBack(Math.min(1, (t - 0.15) / 0.45));
    const bob = ph === 'done' ? Math.sin(GA.t * 3) * 3 : 0;
    c.save(); c.translate(GW / 2, 236 + bob); c.scale(pop, pop);
    if (UI_IMG.plate) { const pw = 190, phh = pw * 0.34; c.drawImage(UI_IMG.plate, -pw / 2, 6 - phh / 2, pw, phh); }
    drawSquishy(c, GA.got, 0, 0, 62, 0, 0, 'happy', 1, false, GA.shiny);
    c.restore();
  }
  for (const p of GA.parts) {
    c.globalAlpha = Math.max(0, 1 - (p.t / p.life) ** 2); c.fillStyle = p.c;
    if (p.kind === 'dot') { c.beginPath(); c.arc(p.x, p.y, p.r, 0, TAU); c.fill(); }
    else { c.save(); c.translate(p.x, p.y); c.rotate(p.rot); star(c, 0, 0, p.r * 1.5); c.restore(); }
  }
  c.globalAlpha = 1;
  if (GA.flash > 0) { c.fillStyle = `rgba(255,255,255,${GA.flash})`; c.fillRect(0, 0, GW, GH); }
}

// ---------- 図鑑 ----------
function dexCell(s) {
  const n = sv.owned[s.id] || 0;
  const cell = document.createElement('div');
  cell.className = 'dex-cell' + (n && kanbanId() === s.id ? ' kanban' : '') + (n ? '' : ' locked');
  const cc = document.createElement('canvas'); cc.width = 160; cc.height = 160;
  const sh = (sv.shiny && sv.shiny[s.id]) || 0;
  drawSquishy(cc.getContext('2d'), s, 80, 140, 42, 0, 0, 'normal', 1, !n, sh > 0);
  cell.appendChild(cc);
  const lbl = document.createElement('div');
  lbl.innerHTML = n
    ? `<span class="rar ${s.rarity}">${s.rarity}</span>${s.name}<div class="cnt">Lv${skillLv(s.id)}${sh ? ` <span class="shinytag">✨×${sh}</span>` : ''}</div><div class="sk">${SKILLS[s.id] ? SKILLS[s.id].name : ''}</div>`
    : `<span class="rar ${s.rarity}">${s.rarity}</span>？？？<div class="cnt">&nbsp;</div><div class="sk">&nbsp;</div>`;
  cell.appendChild(lbl);
  if (n) cell.addEventListener('click', () => {
    sv.kanban = s.id; save();
    $('#dexDetail').innerHTML = `<b>${s.name}</b> を 看板にしたよ！<br><small>${skillText(s.id)}（${n}こ もってる・あつめるほどLvアップ）</small>`;
    document.querySelectorAll('.dex-cell.kanban').forEach(e => e.classList.remove('kanban'));
    cell.classList.add('kanban');
    SFX.pop();
    if (G.mode === 'title') { G.sq = s; resetSquishy(); refreshTitle(); }
  });
  return cell;
}
function openDex() {
  show('#dex', true);
  const grid = $('#dexGrid'); grid.innerHTML = '';
  const kb = SQ_BY_ID[kanbanId()];
  $('#dexDetail').innerHTML = `いまの看板：<b>${kb.name}</b><br><small>${skillText(kb.id)}｜タップで看板を かえられるよ</small>`;
  const regular = SQUISHIES.filter(s => !s.limited), limited = SQUISHIES.filter(s => s.limited);
  regular.forEach(s => grid.appendChild(dexCell(s)));
  // 期間限定：開催中か、1つでも持っていれば表示
  const ev = activeEvent();
  const showLim = limited.filter(s => (ev && s.limited === ev.id) || sv.owned[s.id]);
  if (showLim.length) {
    const h = document.createElement('div'); h.className = 'dex-head';
    h.textContent = ev ? `${ev.name} 限定（〜${ev.end.slice(5).replace('-', '/')}）` : '期間限定';
    grid.appendChild(h);
    showLim.forEach(s => grid.appendChild(dexCell(s)));
  }
  const have = regular.filter(s => sv.owned[s.id]).length;
  const haveL = limited.filter(s => sv.owned[s.id]).length;
  $('#dexCount').textContent = `${have} / ${regular.length}` + (haveL ? `＋限定${haveL}` : '');
}

// ---------- おみせ（着せかえ・レベル）----------
let shopTab = 'bg';
function decorAvailable(d) {
  if (d.event) return !!activeEvent() && activeEvent().id === d.event || sv.bought[d.id];
  return true;
}
function openShop() {
  show('#shop', true);
  renderShop();
}
function renderShop() {
  const lv = shopLevel(), cur = LEVEL_XP[lv - 1], nxt = LEVEL_XP[lv] || null;
  $('#sLevel').textContent = `おみせ Lv${lv}`;
  $('#sXp').style.width = nxt ? `${Math.min(100, (sv.xp - cur) / (nxt - cur) * 100)}%` : '100%';
  $('#sNext').textContent = nxt ? `つぎのLvまで ${nxt - sv.xp}てん（コイン +${Math.round((levelCoinBonus(lv) - 1) * 100)}% 中）` : 'さいだいLv！';
  $('#sCoins').textContent = sv.coins;
  document.querySelectorAll('#shopTabs button').forEach(b => b.classList.toggle('on', b.dataset.t === shopTab));
  const grid = $('#shopGrid'); grid.innerHTML = '';
  for (const d of DECOR.filter(x => x.type === shopTab && decorAvailable(x))) {
    const owned = !!sv.bought[d.id], equipped = sv.decor[d.type] === d.id, locked = lv < d.lv;
    const el = document.createElement('div');
    el.className = 'shop-item' + (equipped ? ' on' : '');
    const thumb = d.type === 'bgm' ? `<div class="thumb bgm">♪</div>`
      : `<div class="thumb ${d.type}" style="background-image:url(${d.src})"></div>`;
    const btn = equipped ? '<span class="tag">つかってる</span>'
      : owned ? '<button class="mini">つかう</button>'
      : locked ? `<span class="tag lock">Lv${d.lv}で かいほう</span>`
      : `<button class="mini buy" ${sv.coins < d.price ? 'disabled' : ''}>${d.price ? `${d.price}コイン` : 'もらう'}</button>`;
    el.innerHTML = `${thumb}<div class="nm">${d.name}${d.event ? ' <span class="evtag">期間限定</span>' : ''}</div>${btn}`;
    const b = el.querySelector('button');
    if (b) b.addEventListener('click', e => {
      e.stopPropagation();
      if (!owned) { if (sv.coins < d.price) return; sv.coins -= d.price; sv.bought[d.id] = 1; SFX.coin(); }
      else SFX.pop();
      equipDecor(d);
      save(); renderShop(); refreshTitle();
    });
    if (d.type === 'bgm') el.querySelector('.thumb').addEventListener('click', () => previewBgm(d));
    grid.appendChild(el);
  }
}
document.querySelectorAll('#shopTabs button').forEach(b => b.addEventListener('click', () => { shopTab = b.dataset.t; renderShop(); }));

function equipDecor(d) {
  sv.decor[d.type] = d.id;
  applyDecor();
}
function applyDecor() {
  const bg = DECOR_BY_ID[sv.decor.bg] || DECOR_BY_ID.pink;
  const pl = DECOR_BY_ID[sv.decor.plate] || DECOR_BY_ID.lace;
  UI_META.bg.counterY = bg.counterY;
  loadUiImage('bg', bg.src);
  loadUiImage('plate', pl.src);
  const bm = (DECOR_BY_ID[sv.decor.bgm] || DECOR_BY_ID.normal).bgm;
  BGM.cfg = bm;
}
// BGMはサムネをタップで試聴（とじると つかってるBGMに戻る）
function previewBgm(d) { ac(); BGM.cfg = d.bgm; bgmStop(); bgmStart(); }

// ============================================================
// 週間ランキング（Web版は架空のライバル。本番はサーバー／Game Center等に置き換える）
// ============================================================
function weekStart(d = new Date()) { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() - (x.getDay() + 6) % 7); return x; }
const weekKey = (d = new Date()) => todayKey(weekStart(d));
function weekProgress(d = new Date()) { return Math.min(1, (d - weekStart(d)) / (7 * 864e5)); }
const RIVAL_NAMES = ['もちこ', 'ぷにお', 'ふわりん', 'まるっち', 'しらたま', 'あんず', 'くりーむ', 'ぴよ', 'こむぎ', 'もなか', 'ぽてと', 'みるく',
  'きなこ', 'ぷりん', 'わらび', 'ましゅ', 'ゆず', 'さくら', 'ころね', 'むぎ', 'ちょこ', 'めろん', 'いちご', 'らむね', 'ばにら', 'てんてん', 'ぽぷり', 'のあ', 'すあま'];
function rivalsFor(wk, progress) {
  const rnd = seeded([...wk].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7));
  return RIVAL_NAMES.map((name, i) => {
    const base = 15000 * Math.pow(0.885, i) * (0.85 + rnd() * 0.3);
    // ライバルも1週間かけて記録を伸ばしてくる（序盤に少し伸びが早い人もいる）
    const pace = 0.5 + 0.5 * Math.pow(progress, 0.6 + rnd() * 0.8);
    return { name, score: Math.round(base * pace / 10) * 10, kanban: SQUISHIES[Math.floor(rnd() * 12)] };
  });
}
function weekBoard(score = sv.week.best) {
  const rows = rivalsFor(sv.week.id, weekProgress()).map(r => ({ ...r }));
  rows.push({ name: 'あなた', score, me: true, kanban: SQ_BY_ID[kanbanId()] });
  rows.sort((a, b) => b.score - a.score || (a.me ? -1 : 1));
  return rows;
}
const myRank = (score = sv.week.best) => weekBoard(score).findIndex(r => r.me) + 1;
const WEEK_REWARD = r => r === 1 ? 100 : r <= 3 ? 60 : r <= 10 ? 30 : 10;
// 週がかわったら先週の順位で報酬
function checkWeekRollover() {
  const cur = weekKey();
  if (sv.week.id === cur) return null;
  let msg = null;
  if (sv.week.id && sv.week.best > 0) {
    const rows = rivalsFor(sv.week.id, 1); rows.push({ me: true, score: sv.week.best });
    rows.sort((a, b) => b.score - a.score);
    const r = rows.findIndex(x => x.me) + 1, g = WEEK_REWARD(r);
    sv.gems += g;
    msg = `先週の ランキング ${r}位！ ${GEM_IC}${g} ゲット`;
  }
  sv.week = { id: cur, best: 0 };
  save();
  return msg;
}
function openRank() {
  show('#rank', true);
  const rows = weekBoard(), me = rows.findIndex(r => r.me) + 1;
  const end = weekStart(); end.setDate(end.getDate() + 7);
  const days = Math.max(0, Math.ceil((end - new Date()) / 864e5));
  $('#rankHead').innerHTML = `今週の あなた：<b>${sv.week.best ? `${me}位` : 'まだ記録なし'}</b>（ベスト ${sv.week.best}）<br><small>しゅうけいまで あと ${days}日｜今日のお題：${todayRule().name}</small>`;
  const list = $('#rankList'); list.innerHTML = '';
  rows.forEach((r, i) => {
    const el = document.createElement('div');
    el.className = 'rank-row' + (r.me ? ' me' : '') + (i < 3 ? ` top${i + 1}` : '');
    el.innerHTML = `<span class="no">${i + 1}</span><span class="nm">${r.name}</span><span class="kb">${r.kanban ? r.kanban.name : ''}</span><span class="sc">${r.score}</span>`;
    list.appendChild(el);
  });
  const meEl = list.querySelector('.me');
  if (meEl) setTimeout(() => meEl.scrollIntoView({ block: 'center' }), 0);
}

// ============================================================
// ジェム（有償通貨）・ジェムショップ（テスト）・月パス
// ============================================================
const GEM_PACKS = [
  { gems: 60, bonus: 0, price: '¥160' },
  { gems: 300, bonus: 20, price: '¥800' },
  { gems: 980, bonus: 100, price: '¥2,440' },
  { gems: 3000, bonus: 500, price: '¥7,400' },
];
const PASS = { price: '¥480', days: 30, daily: 20, first: 100 };
const passActive = () => sv.pass && sv.pass.until && todayKey() <= sv.pass.until;
function openGemShop() {
  show('#gemshop', true);
  const list = $('#gemList'); list.innerHTML = '';
  const pass = document.createElement('div'); pass.className = 'gem-item pass';
  pass.innerHTML = `<div><b>月パス</b><small>すぐに ${GEM_IC}${PASS.first}＋${PASS.days}日間 まいにち ${GEM_IC}${PASS.daily}${passActive() ? `<br>（${sv.pass.until.slice(5).replace('-', '/')}まで 有効）` : ''}</small></div><button class="mini">${PASS.price}</button>`;
  pass.querySelector('button').addEventListener('click', () => {
    const until = new Date(); until.setDate(until.getDate() + PASS.days - 1);
    sv.pass = { until: todayKey(until), claimed: todayKey() }; sv.gems += PASS.first + PASS.daily;
    save(); SFX.fanfare(); toast(`月パス かいし！ ${GEM_IC}${PASS.first + PASS.daily}`); openGemShop(); refreshAll();
  });
  list.appendChild(pass);
  for (const p of GEM_PACKS) {
    const el = document.createElement('div'); el.className = 'gem-item';
    el.innerHTML = `<div><b>${GEM_IC}${p.gems}</b>${p.bonus ? ` <span class="bonus">＋おまけ${GEM_IC}${p.bonus}</span>` : ''}</div><button class="mini">${p.price}</button>`;
    el.querySelector('button').addEventListener('click', () => { sv.gems += p.gems + p.bonus; save(); SFX.coin(); toast(`${GEM_IC}${p.gems + p.bonus} ゲット（テスト）`); refreshAll(); });
    list.appendChild(el);
  }
}
function claimPass() {
  if (!passActive() || sv.pass.claimed === todayKey()) return null;
  sv.pass.claimed = todayKey(); sv.gems += PASS.daily; save();
  return `月パス ${GEM_IC}${PASS.daily} うけとり！`;
}

// ============================================================
// プレイ前ブースト
// ============================================================
const BOOSTS = [
  { id: 'time',  name: '+5びょう',          desc: 'はじまりの時間が のびる', cur: 'coins', cost: 100, apply: m => { m.startTime += 5; } },
  { id: 'score', name: 'スコア +10%',       desc: 'ぜんぶの点が ふえる',     cur: 'coins', cost: 150, apply: m => { m.scoreMul *= 1.1; } },
  { id: 'kira',  name: 'キラ 2ばい',        desc: 'キラが でやすい',         cur: 'gems',  cost: 20,  apply: m => { m.shinyMul *= 2; } },
  { id: 'skill', name: '看板の特技 Lv+1',   desc: 'このプレイだけ 特技が強く', cur: 'gems',  cost: 30,  skill: 1 },
];
const prepSel = new Set();
function openPrep() {
  ac();
  show('#prep', true);
  const kb = SQ_BY_ID[kanbanId()], r = todayRule();
  $('#prepInfo').innerHTML = `<b>看板：${kb.name}</b> <span class="lv">Lv${skillLv(kb.id)}</span><br><small>${skillText(kb.id)}</small>` +
    `<div class="prep-rule">今日のお題：<b>${r.name}</b><br><small>${r.desc}</small></div>` +
    `<div class="prep-week">今週 ${sv.week.best ? `${myRank()}位（ベスト ${sv.week.best}）` : 'まだ記録なし'}</div>`;
  renderBoosts();
}
function boostTotal() {
  const t = { coins: 0, gems: 0 };
  for (const b of BOOSTS) if (prepSel.has(b.id)) t[b.cur] += b.cost;
  return t;
}
function renderBoosts() {
  const list = $('#boostList'); list.innerHTML = '';
  for (const b of BOOSTS) {
    const el = document.createElement('button');
    el.className = 'boost' + (prepSel.has(b.id) ? ' on' : '');
    el.innerHTML = `<span class="ck">${prepSel.has(b.id) ? '✓' : ''}</span><span class="bn"><b>${b.name}</b><small>${b.desc}</small></span><span class="bc">${curName(b.cur)}${b.cost}</span>`;
    el.addEventListener('click', () => { prepSel.has(b.id) ? prepSel.delete(b.id) : prepSel.add(b.id); SFX.pop(); renderBoosts(); });
    list.appendChild(el);
  }
  const t = boostTotal();
  $('#pCoins').textContent = sv.coins; $('#pGems').textContent = sv.gems;
  const ok = sv.coins >= t.coins && sv.gems >= t.gems;
  $('#btnStart').disabled = !ok;
  const st = staminaNow();
  $('#pSta').textContent = `${st.n}/${STA_MAX}`;
  $('#btnStart').innerHTML = (st.n < 1 ? 'スタミナを かいふくする' : 'スタート！') +
    `<small>♥1${t.coins ? `・コイン${t.coins}` : ''}${t.gems ? `・${GEM_IC}${t.gems}` : ''} つかう</small>`;
}
function startFromPrep() {
  const t = boostTotal();
  if (sv.coins < t.coins || sv.gems < t.gems) return;
  if (!useStamina()) { openStamina('スタミナが たりないよ'); return; }
  sv.coins -= t.coins; sv.gems -= t.gems; save();
  const boosts = BOOSTS.filter(b => prepSel.has(b.id));
  show('#prep', false);
  startGame(true, boosts);
}

// ============================================================
// コンティニュー
// ============================================================
const CONT_GEMS = 30, CONT_SEC = 10;
function adLeft() { return !(sv.ad && sv.ad.date === todayKey() && sv.ad.count >= 1); }
function offerContinue() {
  G.mode = 'cont'; G.pressing = false; G.pressValid = false; squelchStop();
  show('#cont', true);
  $('#cScore').textContent = G.score;
  // 「あと少しで抜ける」を見せる
  const rows = weekBoard(Math.max(sv.week.best, G.score)), now = myRank(Math.max(sv.week.best, G.score));
  const above = rows[now - 2];
  $('#cRank').innerHTML = G.score > sv.week.best
    ? `このままだと 今週 <b>${now}位</b>` + (above ? `<br><small>あと <b>${above.score - G.score + 10}</b>てんで ${above.name}さんを ぬける！</small>` : '<br><small>1位！</small>')
    : `今週ベスト ${sv.week.best}（${myRank()}位）まで あと <b>${sv.week.best - G.score}</b>てん`;
  $('#btnContGem').disabled = sv.gems < CONT_GEMS;
  $('#btnContAd').disabled = !adLeft();
}
function doContinue() {
  show('#cont', false);
  G.contUsed = true; G.mode = 'play'; G.time = CONT_SEC;
  const L = layout(); floater(`+${CONT_SEC}びょう！`, W / 2, H * 0.4, '#2aa88a', 34, 1.2);
  SFX.fever();
}
function showFakeAd(done) {
  show('#adfake', true);
  let s = 3; $('#adSec').textContent = s;
  const iv = setInterval(() => { s--; $('#adSec').textContent = s; if (s <= 0) { clearInterval(iv); show('#adfake', false); done(); } }, 1000);
}

// ============================================================
// もちもちルーム（サブ要素：時間制限・点数なしで自由にさわる）
// ============================================================
const ROOM_GOAL = 20, ROOM_REWARD = 30;
function openRoom() {
  ac(); bgmStart();
  G.mode = 'room';
  ['#title', '#dex', '#shop'].forEach(id => show(id, false));
  show('#room', true);
  G.order = null; G.shiny = false; G.sq = SQ_BY_ID[kanbanId()]; resetSquishy();
  renderRoomShelf(); renderRoomDaily();
}
function roomCount() { return sv.room && sv.room.date === todayKey() ? sv.room : (sv.room = { date: todayKey(), count: 0, rewarded: false }); }
function renderRoomDaily() {
  const r = roomCount();
  $('#roomDaily').innerHTML = r.rewarded ? '今日の もちもち ボーナス うけとりずみ'
    : `今日の もちもち ${Math.min(r.count, ROOM_GOAL)}/${ROOM_GOAL}（たっせいで +${ROOM_REWARD}コイン）`;
}
function roomSqueezed(s) {
  if (G.mode !== 'room' || s < 0.25) return;
  const r = roomCount();
  r.count++;
  if (!r.rewarded && r.count >= ROOM_GOAL) { r.rewarded = true; sv.coins += ROOM_REWARD; toast(`もちもち ボーナス +${ROOM_REWARD}コイン`); SFX.coin(); }
  bumpMission('room');
  save(); renderRoomDaily();
}
function renderRoomShelf() {
  const shelf = $('#roomShelf'); shelf.innerHTML = '';
  for (const s of SQUISHIES.filter(x => sv.owned[x.id])) {
    const variants = [false]; if (sv.shiny && sv.shiny[s.id]) variants.push(true);
    for (const sh of variants) {
      const b = document.createElement('button'); b.className = 'shelf-item' + (G.sq === s && G.shiny === sh ? ' on' : '');
      const cc = document.createElement('canvas'); cc.width = 120; cc.height = 120;
      drawSquishy(cc.getContext('2d'), s, 60, 104, 32, 0, 0, 'normal', 1, false, sh);
      b.appendChild(cc);
      if (sh) { const t = document.createElement('i'); t.textContent = '✨'; b.appendChild(t); }
      b.addEventListener('pointerdown', e => e.stopPropagation());
      b.addEventListener('click', () => { G.sq = s; G.shiny = sh; resetSquishy(); SFX.pop(); renderRoomShelf(); });
      shelf.appendChild(b);
    }
  }
}
function closeRoom() { show('#room', false); toTitle(); }

// ============================================================
// スタミナ（ランキング挑戦1回＝♥1。最大5・1時間に1回復）
// ============================================================
const STA_MAX = 5, STA_REGEN_MS = 60 * 60 * 1000, STA_GEM_COST = 10, STA_AD_PER_DAY = 3;
function staminaNow() {
  const st = sv.stamina, now = Date.now();
  if (st.n >= STA_MAX) { st.t = now; return st; }
  const ticks = Math.floor((now - st.t) / STA_REGEN_MS);
  if (ticks > 0) { st.n = Math.min(STA_MAX, st.n + ticks); st.t = st.n >= STA_MAX ? now : st.t + ticks * STA_REGEN_MS; }
  return st;
}
function staminaNextMs() { const st = staminaNow(); return st.n >= STA_MAX ? 0 : STA_REGEN_MS - (Date.now() - st.t); }
const fmtMs = ms => { const s = Math.ceil(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
function addStamina(k) {
  const st = staminaNow();
  const wasFull = st.n >= STA_MAX;
  st.n += k;                         // 回復アイテムなどは上限をこえてもOK
  if (wasFull) st.t = Date.now();
  save(); refreshStaminaUI();
}
function useStamina() {
  if (REC) return true;
  const st = staminaNow();
  if (st.n < 1) return false;
  if (st.n >= STA_MAX) st.t = Date.now();   // 満タンから減らした瞬間から回復タイマー開始
  st.n--; save();
  return true;
}
function adStaminaLeft() { const a = sv.adSta && sv.adSta.date === todayKey() ? sv.adSta.count : 0; return STA_AD_PER_DAY - a; }
function openStamina(reason) {
  show('#stamina', true);
  renderStamina(reason);
}
function renderStamina(reason) {
  const st = staminaNow();
  $('#staHearts').innerHTML = Array.from({ length: Math.max(STA_MAX, st.n) }, (_, i) => `<i class="${i < st.n ? 'on' : ''}">♥</i>`).join('');
  $('#staInfo').innerHTML = (reason ? `<b>${reason}</b><br>` : '') +
    (st.n >= STA_MAX ? 'スタミナ まんたん！' : `つぎの かいふくまで <b id="staTimer">${fmtMs(staminaNextMs())}</b>（1時間に ♥1）`);
  const drinks = sv.items.drink || 0;
  $('#btnStaDrink').innerHTML = `スタミナドリンクを のむ（♥+1）<small>もってる：${drinks}こ｜ミッションで もらえるよ</small>`;
  $('#btnStaDrink').disabled = drinks < 1;
  $('#btnStaAd').innerHTML = `どうがを見て ♥+1<small>今日 あと${adStaminaLeft()}回</small>`;
  $('#btnStaAd').disabled = adStaminaLeft() < 1;
  $('#btnStaGem').innerHTML = `${GEM_IC}${STA_GEM_COST}で ♥+${STA_MAX} かいふく<small>もってる ${GEM_IC}${sv.gems}</small>`;
  $('#btnStaGem').disabled = sv.gems < STA_GEM_COST;
}
function refreshStaminaUI() {
  const st = staminaNow();
  if ($('#tSta')) $('#tSta').textContent = `${st.n}/${STA_MAX}`;
  if ($('#tStaT')) $('#tStaT').textContent = st.n >= STA_MAX ? 'MAX' : fmtMs(staminaNextMs());
  if (!$('#stamina').classList.contains('hidden')) {
    const tm = $('#staTimer'); if (tm) tm.textContent = fmtMs(staminaNextMs());
  }
}
setInterval(() => { if (G.mode === 'title' || !$('#stamina').classList.contains('hidden')) refreshStaminaUI(); }, 1000);

// ============================================================
// デイリーミッション（無料でスタミナドリンクなどがもらえる）
// ============================================================
const MISSIONS = [
  { id: 'play1',   name: 'ランキングに 1回 ちょうせん',  key: 'play',    goal: 1,  reward: { drink: 1 } },
  { id: 'play3',   name: 'ランキングに 3回 ちょうせん',  key: 'play',    goal: 3,  reward: { drink: 1 } },
  { id: 'perfect', name: 'PERFECTを 15回 だす',          key: 'perfect', goal: 15, reward: { coins: 100 } },
  { id: 'room',    name: 'もちもちルームで 20回 にぎる', key: 'room',    goal: 20, reward: { drink: 1 } },
  { id: 'gacha',   name: 'ガチャを 1回 ひく',            key: 'gacha',   goal: 1,  reward: { gems: 5 } },
  { id: 'all',     name: 'ぜんぶの ミッションを クリア', key: 'all',     goal: 5,  reward: { gems: 10, drink: 1 } },
];
function missionState() {
  if (!sv.missions || sv.missions.date !== todayKey()) sv.missions = { date: todayKey(), prog: {}, claimed: {} };
  return sv.missions;
}
function missionProg(m) {
  const ms = missionState();
  if (m.key === 'all') return MISSIONS.filter(x => x.id !== 'all' && ms.claimed[x.id]).length;
  return ms.prog[m.key] || 0;
}
function bumpMission(key, k = 1) {
  const ms = missionState();
  const before = MISSIONS.filter(m => m.key === key && missionProg(m) < m.goal).length;
  ms.prog[key] = (ms.prog[key] || 0) + k;
  save();
  const done = MISSIONS.filter(m => m.key === key && !ms.claimed[m.id] && missionProg(m) >= m.goal).length;
  if (done && before) toast('ミッション たっせい！ うけとってね');
  refreshMissionBadge();
}
const rewardText = r => [r.drink ? `ドリンク×${r.drink}` : '', r.coins ? `コイン${r.coins}` : '', r.gems ? `${GEM_IC}${r.gems}` : ''].filter(Boolean).join('＋');
function claimMission(m) {
  const ms = missionState();
  if (ms.claimed[m.id] || missionProg(m) < m.goal) return;
  ms.claimed[m.id] = true;
  const r = m.reward;
  if (r.drink) sv.items.drink = (sv.items.drink || 0) + r.drink;
  if (r.coins) sv.coins += r.coins;
  if (r.gems) sv.gems += r.gems;
  save(); SFX.coin(); toast(`${rewardText(r)} ゲット！`);
  renderMissions(); refreshAll();
}
function openMissions() { show('#missions', true); renderMissions(); }
function renderMissions() {
  const list = $('#missionList'); list.innerHTML = '';
  const ms = missionState();
  for (const m of MISSIONS) {
    const p = Math.min(missionProg(m), m.goal), done = p >= m.goal, got = ms.claimed[m.id];
    const el = document.createElement('div');
    el.className = 'mission' + (got ? ' got' : done ? ' done' : '');
    el.innerHTML = `<div class="mi"><b>${m.name}</b><div class="mbar"><i style="width:${p / m.goal * 100}%"></i></div><small>${p}/${m.goal}｜ほうしゅう：${rewardText(m.reward)}</small></div>` +
      (got ? '<span class="tag">うけとりずみ</span>' : `<button class="mini" ${done ? '' : 'disabled'}>うけとる</button>`);
    const b = el.querySelector('button'); if (b) b.addEventListener('click', () => claimMission(m));
    list.appendChild(el);
  }
  $('#missionDrinks').textContent = sv.items.drink || 0;
}
function refreshMissionBadge() {
  const ms = missionState();
  const n = MISSIONS.filter(m => !ms.claimed[m.id] && missionProg(m) >= m.goal).length;
  const b = $('#btnMissionT'); if (b) b.dataset.badge = n ? n : '';
}

// ---- 共通 ----
let toastTimer = null;
function toast(msg) {
  if (REC && RECM.busy) return;   // 撮影中は お知らせを出さない
  const el = $('#toast'); el.innerHTML = msg; show('#toast', true);
  clearTimeout(toastTimer); toastTimer = setTimeout(() => show('#toast', false), 2200);
}
function refreshAll() {
  if (G.mode === 'title') refreshTitle();
  if (!$('#gacha').classList.contains('hidden')) refreshGacha();
  if (!$('#prep').classList.contains('hidden')) renderBoosts();
  if (!$('#cont').classList.contains('hidden')) $('#btnContGem').disabled = sv.gems < CONT_GEMS;
  if (!$('#stamina').classList.contains('hidden')) renderStamina();
  if (!$('#missions').classList.contains('hidden')) renderMissions();
  refreshStaminaUI(); refreshMissionBadge();
}
function openRates() {
  show('#rates', true);
  const ev = activeEvent();
  const body = Object.entries(GACHAS).map(([k, g]) => {
    const rows = RAR_ORDER.slice().reverse().map(r => {
      const pool = SQUISHIES.filter(s => s.rarity === r && !s.limited);
      return `<tr><td><span class="rar ${r}">${r}</span></td><td>${g.rates[r]}%</td><td>${pool.map(s => s.name).join('・')}</td></tr>`;
    }).join('');
    return `<h4>${g.name}ガチャ（1回 ${curName(g.cur)}${g.cost}）</h4><table>${rows}</table>` +
      (g.pity ? `<p>${g.pity}回ひくと SSRかくてい（天井）。10連は さいごの1こ SR以上。</p>` : '') +
      (g.pickup && ev ? `<p>${ev.name}期間中は ${Math.round(ev.pickup * 100)}% で、引いたレアリティの限定スクイーズに おきかわります（${SQUISHIES.filter(s => s.limited === ev.id).map(s => `${s.rarity} ${s.name}`).join('・')}）。</p>` : '');
  }).join('');
  $('#ratesBody').innerHTML = body + '<p>キラは どのガチャでも 5%。おなじ子が出たときは コイン+20（キラ以外）。</p>';
}

// ---------- 結果画像（シェア用） ----------
// 画面のCSSと同じ「茶色ふち＋下に影」の文字
const FONT = '"M PLUS Rounded 1c", sans-serif';
function outlinedText(c, text, x, y, size, fill, { stroke = '#6b4436', sw = size * 0.18, shadow = '#b9786a', sh = size * 0.08 } = {}) {
  c.save();
  c.font = `800 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'alphabetic'; c.lineJoin = 'round';
  if (sh) { c.lineWidth = sw; c.strokeStyle = shadow; c.strokeText(text, x, y + sh); c.fillStyle = shadow; c.fillText(text, x, y + sh); }
  c.lineWidth = sw; c.strokeStyle = stroke; c.strokeText(text, x, y);
  c.fillStyle = fill; c.fillText(text, x, y);
  c.restore();
}
function pill(c, x, y, w, h, fill, line = '#6b4436', lw = 5) {
  c.beginPath(); c.roundRect(x - w / 2, y - h / 2, w, h, h / 2);
  c.fillStyle = fill; c.fill(); c.lineWidth = lw; c.strokeStyle = line; c.stroke();
}
// 背景をぼかす（ctx.filter 非対応の端末でも効くよう、縮小→拡大でぼかす）
function blurredCover(img, w, h, k = 10) {
  const sm = document.createElement('canvas'); sm.width = Math.ceil(w / k); sm.height = Math.ceil(h / k);
  const g = sm.getContext('2d');
  const s = Math.max(sm.width / img.width, sm.height / img.height);
  g.drawImage(img, (sm.width - img.width * s) / 2, (sm.height - img.height * s) / 2, img.width * s, img.height * s);
  return sm;
}

function makeShareImage() {
  const r = lastResult; if (!r) return null;
  const SW = 1080, SH = 1350;
  const S = document.createElement('canvas'); S.width = SW; S.height = SH;
  const c = S.getContext('2d');
  c.imageSmoothingQuality = 'high';
  // 背景：お店をぼかして、やわらかいピンクを重ねる
  if (UI_IMG.bg) c.drawImage(blurredCover(UI_IMG.bg, SW, SH), 0, 0, SW, SH);
  else { const g = c.createLinearGradient(0, 0, 0, SH); g.addColorStop(0, '#ffe3ec'); g.addColorStop(1, '#fff2dc'); c.fillStyle = g; c.fillRect(0, 0, SW, SH); }
  const veil = c.createLinearGradient(0, 0, 0, SH);
  veil.addColorStop(0, 'rgba(255,240,245,0.35)'); veil.addColorStop(0.55, 'rgba(255,240,245,0.15)'); veil.addColorStop(1, 'rgba(255,236,226,0.55)');
  c.fillStyle = veil; c.fillRect(0, 0, SW, SH);
  // キラキラの粒
  const rnd = seeded(r.score + 7);
  for (let i = 0; i < 26; i++) {
    c.globalAlpha = 0.5 + rnd() * 0.5; c.fillStyle = '#fff';
    star(c, rnd() * SW, rnd() * SH * 0.7, 6 + rnd() * 12);
  }
  c.globalAlpha = 1;

  // タイトル（リボンの上）
  if (UI_IMG.banner) { const bw = 1000, bh = bw * UI_IMG.banner.height / UI_IMG.banner.width; c.drawImage(UI_IMG.banner, (SW - bw) / 2, 130, bw, bh); }
  outlinedText(c, 'にぎにぎ', SW / 2, 150, 92, '#ffc2d4');
  outlinedText(c, 'スクイーズ', SW / 2, 262, 104, '#fff7ee');

  // 主役のスクイーズ（お皿＋後光）
  const cx = SW / 2, baseY = 760, R = 175;
  const halo = c.createRadialGradient(cx, baseY - R, 20, cx, baseY - R, R * 2.2);
  halo.addColorStop(0, r.shiny ? 'rgba(255,240,170,0.95)' : 'rgba(255,255,255,0.9)'); halo.addColorStop(1, 'rgba(255,255,255,0)');
  c.fillStyle = halo; c.beginPath(); c.arc(cx, baseY - R, R * 2.2, 0, TAU); c.fill();
  if (UI_IMG.plate) { const pw = R * 3.2, ph = pw * 0.34; c.drawImage(UI_IMG.plate, cx - pw / 2, baseY + R * 0.1 - ph / 2, pw, ph); }
  drawSquishy(c, r.sq, cx, baseY, R, 0, 0, 'happy', 1, false, r.shiny);
  if (r.shiny) {
    c.save(); c.translate(cx + R * 1.15, baseY - R * 2.05); c.rotate(0.12);
    pill(c, 0, 0, 300, 74, '#fff3c4', '#e89a00', 5);
    c.font = `800 40px ${FONT}`; c.textAlign = 'center'; c.fillStyle = '#c47a00'; c.fillText('✨キラ ゲット！', 0, 14);
    c.restore();
  }

  // スコアのカード
  const top = 845, ch = 400;
  c.save();
  c.shadowColor = 'rgba(120,70,60,0.25)'; c.shadowBlur = 30; c.shadowOffsetY = 10;
  c.beginPath(); c.roundRect(90, top, SW - 180, ch, 56); c.fillStyle = '#fffaf3'; c.fill();
  c.restore();
  c.lineWidth = 6; c.strokeStyle = '#c99a86'; c.beginPath(); c.roundRect(90, top, SW - 180, ch, 56); c.stroke();
  c.setLineDash([14, 10]); c.lineWidth = 4; c.strokeStyle = '#f6c9d6';
  c.beginPath(); c.roundRect(110, top + 20, SW - 220, ch - 40, 42); c.stroke(); c.setLineDash([]);

  pill(c, cx, top + 6, 440, 80, '#ff8fb1');
  c.font = `800 42px ${FONT}`; c.textAlign = 'center'; c.fillStyle = '#fff'; c.fillText(r.rank, cx, top + 21);

  c.font = `800 170px ${FONT}`;
  const sw = c.measureText(String(r.score)).width;
  outlinedText(c, String(r.score), cx - 30, top + 220, 170, '#6b4436', { stroke: '#fff7ee', sw: 22, shadow: '#e8c9bd', sh: 10 });
  c.font = `800 50px ${FONT}`; c.fillStyle = '#6b4436'; c.textAlign = 'left'; c.fillText('てん', cx - 30 + sw / 2 + 12, top + 220);

  const chips = [[`PERFECT ${r.perfects}`, '#fff3c4'], [`最大コンボ ${r.maxCombo}`, '#efe4ff'], [`ぱーん ${r.bursts}`, '#ffe1d8']];
  chips.forEach(([t, col], i) => {
    const x = cx + (i - 1) * 285;
    pill(c, x, top + 300, 262, 66, col, '#c99a86', 4);
    c.font = `800 32px ${FONT}`; c.textAlign = 'center'; c.fillStyle = '#6b4436'; c.fillText(t, x, top + 311);
  });

  // ハッシュタグ
  pill(c, cx, 1300, 560, 72, '#ffffff', '#e2648c', 5);
  c.font = `800 38px ${FONT}`; c.fillStyle = '#e2648c'; c.textAlign = 'center'; c.fillText('#にぎにぎスクイーズ', cx, 1313);
  return S;
}
async function shareResult() {
  try { await document.fonts.ready; } catch (e) {}
  const S = makeShareImage(); if (!S) return;
  const blob = await new Promise(res => S.toBlob(res, 'image/png'));
  const file = new File([blob], 'nigi-squeeze.png', { type: 'image/png' });
  try {
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], text: `にぎにぎスクイーズで ${lastResult.score}てん！ #にぎにぎスクイーズ` });
      return;
    }
  } catch (e) { if (e && e.name === 'AbortError') return; }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = 'nigi-squeeze.png';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

// ---------- ボタン ----------
const on = (id, fn) => $(id).addEventListener('click', e => { e.stopPropagation(); fn(); });
on('#btnPlay', openPrep);
on('#btnRetry', () => { show('#result', false); openPrep(); });
on('#btnStart', startFromPrep);
on('#btnPrepClose', () => show('#prep', false));
on('#btnContGem', () => { if (sv.gems < CONT_GEMS) return; sv.gems -= CONT_GEMS; save(); doContinue(); });
on('#btnContAd', () => { if (!adLeft()) return; show('#cont', false); showFakeAd(() => { sv.ad = { date: todayKey(), count: 1 }; save(); doContinue(); }); });
on('#btnContNo', () => { show('#cont', false); endGame(); });
on('#btnRankT', openRank);
on('#btnStamina', () => openStamina());
on('#btnPStamina', () => openStamina());
on('#btnStaClose', () => { show('#stamina', false); refreshAll(); });
on('#btnStaDrink', () => { if ((sv.items.drink || 0) < 1) return; sv.items.drink--; addStamina(1); SFX.coin(); renderStamina(); refreshAll(); });
on('#btnStaAd', () => {
  if (adStaminaLeft() < 1) return;
  showFakeAd(() => { const c = sv.adSta && sv.adSta.date === todayKey() ? sv.adSta.count : 0; sv.adSta = { date: todayKey(), count: c + 1 }; addStamina(1); renderStamina(); refreshAll(); });
});
on('#btnStaGem', () => { if (sv.gems < STA_GEM_COST) return; sv.gems -= STA_GEM_COST; addStamina(STA_MAX); SFX.fanfare(); renderStamina(); refreshAll(); });
on('#btnMissionT', openMissions);
on('#btnMissionClose', () => { show('#missions', false); refreshAll(); });
on('#btnRankR', openRank);
on('#btnRankClose', () => show('#rank', false));
on('#btnGemsT', openGemShop);
on('#btnGemClose', () => { show('#gemshop', false); refreshAll(); });
on('#btnRoom', openRoom);
on('#btnRoomClose', closeRoom);
on('#btnRates', openRates);
on('#btnRatesClose', () => show('#rates', false));
on('#btnPull10', () => pullGacha(10));
on('#btnKanban', openDex);
on('#btnShopT', openShop);
on('#btnShopClose', () => { show('#shop', false); applyDecor(); bgmStop(); bgmStart(); refreshTitle(); });
on('#btnHome', toTitle);
on('#btnGachaT', () => openGacha('title'));
on('#btnGachaR', () => openGacha('result'));
on('#btnDexT', openDex);
on('#btnPull', () => pullGacha(1));
on('#btnGachaClose', () => { show('#gacha', false); if (gachaReturn === 'title') refreshTitle(); });
on('#btnDexClose', () => { show('#dex', false); if (G.mode === 'title') refreshTitle(); });
on('#btnShare', shareResult);
on('#btnMute', () => { ac(); setMute(!sv.mute); });
document.querySelectorAll('button').forEach(b => b.addEventListener('pointerdown', e => e.stopPropagation()));
$('#btnMute').textContent = sv.mute ? '♪×' : '♪';

// ============================================================
// 撮影モード（?rec=1）：見せ場の自動再生・キャプション・タッチ表示・タブ録画
// ============================================================
const RECM = { busy: false, rec: null, chunks: [] };
const sleep = ms => new Promise(r => setTimeout(r, ms));
// 条件がそろうまで待つ（タイムアウトあり）
const until = (fn, ms = 5000) => new Promise(res => {
  const t0 = performance.now();
  (function poll() { if (fn() || performance.now() - t0 > ms) res(); else setTimeout(poll, 30); })();
});
function recCaption(text, sub = '', ms = 0) {
  const el = $('#recCap');
  el.innerHTML = text ? `<b>${text}</b>${sub ? `<small>${sub}</small>` : ''}` : '';
  el.classList.toggle('hidden', !text);
  el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
  if (ms) setTimeout(() => { if (el.innerHTML.includes(text)) el.classList.add('hidden'); }, ms);
}
// 指の位置（画面録画で「どこを押してるか」が分かるように）
function touchAt(x, y, down) {
  const el = $('#recTouch'); if (!el) return;
  el.style.left = `${x}px`; el.style.top = `${y}px`;
  el.classList.toggle('down', !!down); el.classList.remove('hidden');
}
function touchHide() { const el = $('#recTouch'); if (el) el.classList.add('hidden'); }
// 台本用の「指」：dx は スクイーズ中心からの横ずれ（R単位）
function fingerDown(dx = 0) {
  const L = layout(), r = cv.getBoundingClientRect(), app = $('#app').getBoundingClientRect();
  press(r.left + L.cx + dx * L.R);
  touchAt(L.cx + dx * L.R + (r.left - app.left), L.baseY - L.R * 1.2 + (r.top - app.top), true);
}
function fingerUp() { release(); const el = $('#recTouch'); if (el) el.classList.remove('down'); setTimeout(touchHide, 250); }

// プレイ中に1人分をこなす（perfect=false なら わざと強すぎ）
async function autoServe(perfect = true) {
  await until(() => G.mode !== 'play' || (G.order && canPress() && !G.pendingNext && G.popIn >= 1), 4000);
  if (G.mode !== 'play') return;
  const o = G.order;
  if (o.kind === 'spicy') { await until(() => G.order !== o || G.mode !== 'play', 4000); return; }
  const reps = o.kind === 'multi' ? o.need : 1;
  for (let i = 0; i < reps; i++) {
    await until(() => canPress() || G.mode !== 'play', 2000);
    G.autoTarget = perfect ? o.c : Math.min(0.99, o.hi + 0.06);
    fingerDown(o.kind === 'side' ? o.side * 0.55 : 0);
    await until(() => !G.pressing || G.burstT > 0 || G.mode !== 'play', 4000);
    G.autoTarget = null;
    fingerUp();
    await sleep(o.kind === 'multi' ? 380 : 120);
  }
  await until(() => G.order !== o || G.mode !== 'play', 3000);
}
// 撮影用のプレイ開始：開始の文字を出さず、テンポよく（にぎる速さ1.5倍）
function startRecPlay() {
  startGame(false, []);   // 今日のお題は かけない（注文がばらけて 見ばえがいい）
  G.floaters = []; G.mods.squeezeSpeed *= 1.5;
  $('#recCap').classList.add('low');
}
function quietTitle() { G.mode = 'over'; ['#hud', '#order', '#holdHint', '#cont', '#result'].forEach(id => show(id, false)); toTitle(); }

const REC_SCENES = [
  { id: 'burst', name: '破裂ASMR', desc: 'ゆっくり にぎって ぱーん！×3', run: async () => {
    openRoom(); show('#room', false);
    for (const id of ['bombo', 'pudding', 'kuma']) {
      G.sq = SQ_BY_ID[id]; G.shiny = id === 'kuma'; resetSquishy(); SFX.pop();
      recCaption('さいごまで にぎると…', SQ_BY_ID[id].name);
      await sleep(900);
      fingerDown(0.15);
      await until(() => G.burstT > 0, 6000);
      recCaption('ぱーん！！');
      fingerUp();
      await sleep(1500);
    }
    recCaption('');
  } },
  { id: 'perfect', name: 'PERFECT連続→フィーバー', desc: 'ぴったりで わたし続ける', run: async () => {
    G.normalOnly = true;
    startRecPlay();
    recCaption('ちょうどいい 強さで わたせ！', 'みどりの帯で はなすと PERFECT');
    await sleep(1600);
    // フィーバーが終わるまで（最大20人）ぴったりで わたし続ける
    let feverSeen = false;
    for (let i = 0; i < 20 && G.mode === 'play'; i++) {
      if (i === 2) recCaption('');
      await autoServe(true);
      if (G.fever > 0 && !feverSeen) { feverSeen = true; recCaption('フィーバー！！', 'スコア 2ばい'); }
      if (feverSeen && G.fever > 0 && G.fever < 6) recCaption('');
      if (feverSeen && G.fever <= 0) break;
    }
    await sleep(800);
    G.normalOnly = false; recCaption(''); quietTitle();
  } },
  { id: 'kira', name: 'キラ個体ゲット', desc: 'レア個体が でてきて ゲット', run: async () => {
    G.normalOnly = true;
    startRecPlay();
    // 2人目をキラ個体に（1人目はふつうに わたす）
    G.forceShiny = true; G.forceSq = SQ_BY_ID.wataame; G.forceOrder = 'gyu';
    await autoServe(true);
    await until(() => G.shiny, 5000);
    recCaption('…ん？', 'なんか 光ってる');
    await sleep(500);
    recCaption('キラ個体！？', 'PERFECTでしか ゲットできない…');
    await sleep(1200);
    await autoServe(true);
    recCaption('ゲット！！', '');
    await sleep(2000);
    G.normalOnly = false; recCaption(''); quietTitle();
  } },
  { id: 'dex', name: '全キャラしょうかい', desc: '23体を 順番に にぎにぎ', run: async () => {
    openRoom(); show('#room', false);
    for (const s of SQUISHIES) {
      G.sq = s; G.shiny = false; resetSquishy(); SFX.pop();
      recCaption(s.name, `${s.rarity}${s.limited ? '・ハロウィン限定' : ''}`);
      await sleep(450);
      fingerDown(0); await sleep(520); fingerUp();
      await sleep(650);
    }
    recCaption('ぜんぶで 23しゅるい！'); await sleep(1500); recCaption('');
  } },
  { id: 'gacha', name: 'ガチャ SSR昇格', desc: 'ピンク→虹色に かわる', run: async () => {
    toTitle(); openGacha('title'); gachaKind = 'premium'; renderGachaInfo(); refreshGacha();
    $('#recCap').classList.add('top');
    const ownedBefore = sv.owned.wataame; sv.owned.wataame = 0;   // 動画では「NEW!」に見せる
    recCaption('SSRが でるまで ひく！'); await sleep(1200);
    // この1回だけ、結果をSSR＋昇格演出に固定する
    const orig = rollGacha;
    rollGacha = () => SQ_BY_ID.wataame;
    const origRand = Math.random; let n = 0;
    Math.random = () => (n++ < 1 ? 0.99 : origRand());   // キラ判定だけ外す
    pullGacha(1);
    Math.random = origRand; rollGacha = orig;
    GA.upgrade = true; GA.shown = 'N';
    recCaption('');
    await until(() => GA.phase === 'wait', 4000); await sleep(700);
    touchAt(gcv.getBoundingClientRect().left - $('#app').getBoundingClientRect().left + 145, gcv.getBoundingClientRect().top - $('#app').getBoundingClientRect().top + 175, true);
    gachaTap(); recCaption('…！？'); await sleep(400); touchHide();
    await until(() => GA.phase === 'wait', 3000); await sleep(900);
    recCaption('きた！！');
    touchAt(gcv.getBoundingClientRect().left - $('#app').getBoundingClientRect().left + 145, gcv.getBoundingClientRect().top - $('#app').getBoundingClientRect().top + 175, true);
    gachaTap(); await sleep(400); touchHide();
    await sleep(2400); recCaption(''); show('#gacha', false);
    sv.owned.wataame = Math.max(ownedBefore, sv.owned.wataame); save(); $('#recCap').classList.remove('top');
  } },
];

async function runScene(sc, record) {
  if (RECM.busy) return;
  RECM.busy = true;
  show('#recPanel', false); show('#recPill', false);
  if (record) { const ok = await startTabRecording(); if (!ok) { RECM.busy = false; show('#recPill', true); return; } await sleep(600); }
  try { await sc.run(); } catch (e) { console.error(e); }
  await sleep(500);
  if (G.mode === 'room') { show('#room', false); toTitle(); }
  if (record) await stopTabRecording(sc.id);
  RECM.busy = false; recCaption(''); touchHide(); show('#recPill', true); $('#recCap').classList.remove('low');
}

// タブ録画（PCのChrome向け。スマホは本体の画面収録を使う）
async function startTabRecording() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) { toast('このブラウザは録画できません（本体の画面収録を使ってね）'); return false; }
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: 60 }, audio: true, preferCurrentTab: true, selfBrowserSurface: 'include' });
    const type = ['video/mp4;codecs=avc1', 'video/webm;codecs=vp9,opus', 'video/webm'].find(t => window.MediaRecorder && MediaRecorder.isTypeSupported(t)) || '';
    RECM.chunks = [];
    RECM.rec = new MediaRecorder(stream, type ? { mimeType: type, videoBitsPerSecond: 8e6 } : undefined);
    RECM.rec.ondataavailable = e => { if (e.data.size) RECM.chunks.push(e.data); };
    RECM.rec.start(200);
    return true;
  } catch (e) { toast('録画が キャンセルされました'); return false; }
}
function stopTabRecording(name) {
  return new Promise(res => {
    const r = RECM.rec; if (!r) return res();
    r.onstop = () => {
      const type = r.mimeType || 'video/webm', ext = type.includes('mp4') ? 'mp4' : 'webm';
      const blob = new Blob(RECM.chunks, { type });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
      a.download = `nigi-${name}-${Date.now()}.${ext}`; document.body.appendChild(a); a.click(); a.remove();
      r.stream.getTracks().forEach(t => t.stop()); RECM.rec = null;
      toast(`動画を ほぞんしました（${ext}）`); res();
    };
    r.stop();
  });
}

function setupRecMode() {
  document.body.classList.add('rec');
  const app = $('#app');
  app.insertAdjacentHTML('beforeend', `
    <div id="recCap" class="hidden"></div>
    <div id="recTouch" class="hidden"></div>
    <button id="recPill">撮影</button>
    <div id="recPanel" class="hidden">
      <div class="rp-head">撮影モード<small>セーブは本番と別です</small></div>
      <div class="rp-opts">
        <label><input type="checkbox" id="rp916" checked> 9:16の枠</label>
        <label><input type="checkbox" id="rpUi"> ボタン類をかくす</label>
      </div>
      <div class="rp-list" id="rpList"></div>
      <div class="rp-note">「録画」はPCのChromeで このタブを録画して ほぞんします。スマホは本体の画面収録で「再生」を使ってね。</div>
      <button class="btn link" id="rpClose">とじる</button>
    </div>`);
  const list = $('#rpList');
  REC_SCENES.forEach(sc => {
    const row = document.createElement('div'); row.className = 'rp-row';
    row.innerHTML = `<div><b>${sc.name}</b><small>${sc.desc}</small></div><button class="mini play">再生</button><button class="mini rec">録画</button>`;
    row.querySelector('.play').addEventListener('click', () => runScene(sc, false));
    row.querySelector('.rec').addEventListener('click', () => runScene(sc, true));
    list.appendChild(row);
  });
  $('#recPill').addEventListener('click', () => show('#recPanel', true));
  $('#rpClose').addEventListener('click', () => show('#recPanel', false));
  const apply = () => {
    document.body.classList.toggle('rec916', $('#rp916').checked);
    document.body.classList.toggle('recNoUi', $('#rpUi').checked);
    requestAnimationFrame(() => { resize(); measureTitle(); sizeGachaCanvas(); });
  };
  $('#rp916').addEventListener('change', apply); $('#rpUi').addEventListener('change', apply);
  apply();
  // 実際の指も表示する
  app.addEventListener('pointerdown', e => { const r = app.getBoundingClientRect(); touchAt(e.clientX - r.left, e.clientY - r.top, true); }, true);
  app.addEventListener('pointermove', e => { if (e.buttons) { const r = app.getBoundingClientRect(); touchAt(e.clientX - r.left, e.clientY - r.top, true); } }, true);
  window.addEventListener('pointerup', () => { const el = $('#recTouch'); if (el) el.classList.remove('down'); setTimeout(touchHide, 250); });
  document.querySelectorAll('#recPanel button, #recPill').forEach(b => b.addEventListener('pointerdown', e => e.stopPropagation()));
}
if (REC) setupRecMode();

// ============================================================
// ループ
// ============================================================
let last = performance.now();
function frame(now) {
  let dt = Math.min(0.05, (now - last) / 1000); last = now;
  gachaUpdate(dt); gachaRender();
  // ヒットストップ：一瞬だけ時間をほぼ止める
  if (G.hitstop > 0) { G.hitstop -= dt; dt *= 0.06; }
  update(dt); render();
  requestAnimationFrame(frame);
}
applyDecor();
toTitle();
// 画像が後から届いたら、開いている図鑑を描き直す
loadSquishyImages(() => { if (!$('#dex').classList.contains('hidden')) openDex(); });
requestAnimationFrame(frame);

// 検証用フック（rAFが止まる環境で手回しする）
window.NIGI = { G, GA, staminaNow, useStamina, addStamina, openStamina, openMissions, bumpMission, missionState, openShop, openPrep, startFromPrep, prepSel, openRank, weekBoard, myRank, openGemShop, openRoom, openRates, grantPull, offerContinue, checkWeekRollover, computeMods, todayRule, activeEvent, rollGacha, refreshTitle, SKILLS, gachaUpdate, gachaRender, gachaTap, pullGacha, sv, nextCustomer, getShiny, drawSquishy, drawSquishySoft, step(sec, n = 1) { for (let i = 0; i < n; i++) update(sec); render(); }, press, release, startGame, endGame, openGacha, openDex, makeShareImage, SQUISHIES };
})();
