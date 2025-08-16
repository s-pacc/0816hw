// ── 資產路徑 ───────────────────────────────────────────────
const BOWL_STATES = [
  "cat images/bowl/empty.png",
  "cat images/bowl/a-little.png",
  "cat images/bowl/some.png",
  "cat images/bowl/full.png"
];
const OVER_ASSETS = {
  tooMuch: "cat images/TOO MUCH.png",
  angry2:  "cat images/hoster-emo/face_angry_woman2.png",
  angry3:  "cat images/hoster-emo/face_angry_woman3.png",
};

// ── 狀態 ──────────────────────────────────────────────────
const cats = {
  dudu: { level: 1, over: 0 },  // level 1 = a little
  fufu: { level: 1, over: 0 }
};
let selected = "dudu"; // 預設先選嘟嘟

// ── DOM 取得 ─────────────────────────────────────────────
const foodBag = document.getElementById("food-bag");
const bowls   = document.querySelectorAll(".bowl");
const picks   = document.querySelectorAll(".pick");
const toast   = document.getElementById("toast");
const toastImg= toast.querySelector("img");

// 把每個碗設定初始圖片，並在選取時高亮
bowls.forEach(b => {
  const cat = b.dataset.cat;
  b.src = BOWL_STATES[cats[cat].level];
  toggleBowlHighlight();
  // 點碗也可切換選擇對象
  b.addEventListener("click", () => selectCat(cat));
});

// 選擇器按鈕
picks.forEach(btn => {
  btn.addEventListener("click", () => selectCat(btn.dataset.cat));
});

function selectCat(cat){
  selected = cat;
  picks.forEach(btn => btn.classList.toggle("active", btn.dataset.cat === cat));
  toggleBowlHighlight();
}

function toggleBowlHighlight(){
  bowls.forEach(b => b.classList.toggle("selected", b.dataset.cat === selected));
}

// 餵食流程
foodBag.addEventListener("click", () => feed(selected));

function feed(catKey){
  const state = cats[catKey];
  const bowl  = [...bowls].find(b => b.dataset.cat === catKey);
  const card  = document.querySelector(`.box[data-cat="${catKey}"] .box-img`);

  if (!bowl || !card) return;

  // 還沒滿：加一階、播放吃吃圖
  if (state.level < BOWL_STATES.length - 1){
    state.level += 1;
    state.over = 0; // 重新開始計次
    bowl.src = BOWL_STATES[state.level];
    bump(bowl);
    showEating(card);
    hideToast();
    return;
  }

  // 已經滿：顯示超量/生氣圖
  const imgPath =
    state.over === 0 ? OVER_ASSETS.tooMuch :
    state.over === 1 ? OVER_ASSETS.angry2  :
                       OVER_ASSETS.angry3;

  state.over += 1; // 繼續按就升級怒氣（停在 angry3）
  if (state.over > 2) state.over = 2;

  showToast(imgPath);
}

// 小動畫：碗彈一下
function bump(el){
  el.classList.remove("pop");
  void el.offsetWidth; // reflow 以重播動畫
  el.classList.add("pop");
}

// 暫時切成吃吃圖，再換回原圖
function showEating(imgEl){
  const normal = imgEl.dataset.normal;
  const eat    = imgEl.dataset.eat;
  imgEl.src = eat;
  setTimeout(() => { imgEl.src = normal; }, 900);
}

// 中央提示（TOO MUCH / 生氣臉）
function showToast(imgPath){
  toastImg.src = imgPath;
  toast.classList.add("show");
  // 點擊遮罩可關閉
  toast.onclick = hideToast;
  // 2 秒自動淡出
  clearTimeout(toast._t);
  toast._t = setTimeout(hideToast, 2000);
}
function hideToast(){
  toast.classList.remove("show");
}
