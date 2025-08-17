/************** 可調參數 **************/
const DECAY_MINUTES_PER_STEP = {
  dudu: 0.5, // 嘟嘟：30 秒掉一格
  fufu: 1    // 芙芙：60 秒掉一格
};
const ANGER_WINDOW_MINUTES = 5;           // 滿了後 5 分鐘內的生氣視窗
const TICK_MS = 15 * 1000;                // 每 15 秒檢查一次即可

/************** 時間常數 **************/
const DECAY_MS_PER_STEP = {
  dudu: DECAY_MINUTES_PER_STEP.dudu * 60 * 1000,
  fufu: DECAY_MINUTES_PER_STEP.fufu * 60 * 1000,
};
const ANGER_WINDOW_MS = ANGER_WINDOW_MINUTES * 60 * 1000;

/************** 圖片路徑 **************/
const BOWL_STATES = [
  "./cat-images/bowl/empty.png",
  "./cat-images/bowl/a-little.png", // 若是 "a little.png" 就改回有空白版本
  "./cat-images/bowl/some.png",
  "./cat-images/bowl/full.png"
];
const OVER_ASSETS = {
  tooMuch: "./cat-images/TOO MUCH.png",
  angry2:  "./cat-images/hoster-emo/face_angry_woman2.png",
  angry3:  "./cat-images/hoster-emo/face_angry_woman3.png",
};
const MAX_LEVEL = BOWL_STATES.length - 1;

/************** 狀態 **************/
const cats = {
  dudu: { level: 1, over: 0, lastChange: Date.now(), fullSince: null },
  fufu: { level: 1, over: 0, lastChange: Date.now(), fullSince: null }
};
let selected = "dudu";

/************** DOM **************/
const foodBag = document.getElementById("food-bag");
const bowls   = document.querySelectorAll(".bowl");
const picks   = document.querySelectorAll(".pick");
const toast   = document.getElementById("toast");
const toastImg= toast.querySelector("img");

/************** 初始化 **************/
bowls.forEach(b => {
  const cat = b.dataset.cat;
  cats[cat].lastChange = Date.now();
  updateBowl(cat);
  b.addEventListener("click", () => selectCat(cat)); // 點碗可切換對象
});
toggleBowlHighlight();

picks.forEach(btn => btn.addEventListener("click", () => selectCat(btn.dataset.cat)));

function selectCat(cat){
  selected = cat;
  picks.forEach(btn => btn.classList.toggle("active", btn.dataset.cat === cat));
  toggleBowlHighlight();
}
function toggleBowlHighlight(){
  bowls.forEach(b => b.classList.toggle("selected", b.dataset.cat === selected));
}

/************** 餵食（按飼料） **************/
foodBag.addEventListener("click", () => feed(selected));

function feed(catKey){
  const state = cats[catKey];
  const card  = document.querySelector(`.box[data-cat="${catKey}"] .box-img`);

  // 還沒滿：加一階
  if (state.level < MAX_LEVEL){
    state.level += 1;
    state.over = 0;
    state.lastChange = Date.now();       // 只有真的升級才更新 lastChange
    updateBowl(catKey);

    // 剛好到滿 → 記錄 full 時間，啟動 5 分鐘生氣視窗
    if (state.level === MAX_LEVEL){
      state.fullSince = Date.now();
    }

    if (card) showEating(card);
    hideToast();
    return;
  }

  // 已經滿了：根據 5 分鐘生氣視窗顯示提示
  const now = Date.now();
  if (state.fullSince && (now - state.fullSince) <= ANGER_WINDOW_MS){
    // 視窗內：依序 TOO MUCH → angry2 → angry3
    const imgPath =
      state.over === 0 ? OVER_ASSETS.tooMuch :
      state.over === 1 ? OVER_ASSETS.angry2  :
                         OVER_ASSETS.angry3;
    state.over = Math.min(state.over + 1, 2);
    showToast(imgPath);
  } else {
    // 視窗外：重置序列並重新起算
    state.fullSince = now;
    state.over = 0;
    showToast(OVER_ASSETS.tooMuch);
  }

  // 注意：滿了又被按，等級沒變，不更新 lastChange（避免延後自動變少）
}

/************** 定期自動吃（衰減） **************/
setInterval(() => {
  Object.keys(cats).forEach(decayOneStepIfNeeded);
}, TICK_MS);

function decayOneStepIfNeeded(catKey){
  const state = cats[catKey];
  const now = Date.now();

  if (state.level === 0){
    // 已空：更新錨點避免累積
    state.lastChange = now;
    state.fullSince = null;
    state.over = 0;
    return;
  }

  const decayMs = DECAY_MS_PER_STEP[catKey] ?? (3 * 60 * 1000);
  const elapsed = now - (state.lastChange || now);
  const steps = Math.floor(elapsed / decayMs);

  if (steps > 0){
    const before = state.level;
    state.level = Math.max(0, state.level - steps);
    state.lastChange = now;  // 重新錨點
    updateBowl(catKey);

    // 只要掉到小於滿，重置滿/生氣狀態
    if (before === MAX_LEVEL && state.level < MAX_LEVEL){
      state.fullSince = null;
      state.over = 0;
    }

    // 可愛效果：自動吃時也切一下吃吃圖
    const card  = document.querySelector(`.box[data-cat="${catKey}"] .box-img`);
    if (card) showEating(card);
  }
}

/************** 小工具 **************/
function updateBowl(catKey){
  const bowl = Array.from(bowls).find(b => b.dataset.cat === catKey);
  if (bowl){
    bowl.src = BOWL_STATES[cats[catKey].level];
    bump(bowl);
  }
}
function bump(el){
  el.classList.remove("pop");
  void el.offsetWidth;
  el.classList.add("pop");
}
function showEating(imgEl){
  const normal = imgEl.dataset.normal;
  const eat    = imgEl.dataset.eat;
  imgEl.src = eat;
  setTimeout(() => { imgEl.src = normal; }, 900);
}
function showToast(imgPath){
  toastImg.src = imgPath;
  toast.classList.add("show");
  toast.onclick = hideToast;
  clearTimeout(toast._t);
  toast._t = setTimeout(hideToast, 2000);
}
function hideToast(){
  toast.classList.remove("show");
}
