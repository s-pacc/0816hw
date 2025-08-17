20250818HW

# 小嘟芙的成長日記 · Cat Diary

> **建議用網頁觀看：** 請透過發佈後的網站網址（https://s-pacc.github.io/feed-cat-or-not/cat.html）或本機伺服器開啟。  
> 直接雙擊 `cat.html` 可能因為 `file://` 路徑限制而導致版面/圖片載入異常。

一個可愛的前端小專案：兩隻貓咪住在一棟房子裡。  
你可以選擇要餵哪一隻，碗的食物會隨時間自動「變少」，餵到滿後再繼續按還會被**主人生氣提醒**。  

**English version is below.**

## ✨ 特色 Features
- 🏠 **House Layout（WIP）**：房子自適應設計尚在調整中。  
  目前在部分桌機寬螢幕下，可能需要捲動才看得到兩層；後續會改為完整自適應以確保內容都在屋內。
- 🍚 **Feeding Interaction**：選擇嘟嘟(Dudu)或芙芙(Fufu)，點飼料袋升級該貓的碗（empty → a little → some → full）。
- ⏳ **Auto Decay**：每隻貓可以設定不同的吃飯速度，碗會定期掉一格（例：嘟嘟 30s、芙芙 1min，因為嘟嘟比較愛吃）。
- 😡 **Anger Window**：滿碗後 5 分鐘內若持續餵食，依序顯示 **TOO MUCH → angry2 → angry3**。
- ☁️ **Animated Cloud Header**：雲朵鋪滿並持續向左移動，大小與速度可調。

---

## English

> **Recommended:** View on a published website (https://s-pacc.github.io/feed-cat-or-not/cat.html) or via a local server.  
> Opening `cat.html` directly with `file://` may cause layout/image loading issues.

A cute front-end mini project where two cats live in a house.  
Pick who to feed; bowls auto-decay over time; overfeeding within the anger window triggers playful warnings.  

### ✨ Features
- 🏠 **House Layout (WIP)** — The responsive house is still being tuned.  
  On some desktop widths you may need to scroll to see both floors; full responsiveness is planned.
- 🍚 **Feeding Interaction** — Choose Dudu or Fufu; click the food bag to upgrade that cat’s bowl (empty → a little → some → full).
- ⏳ **Auto Decay** — Per-cat decay speed (e.g., Dudu 30s, Fufu 1min, **because Dudu is greedy**); bowls step down over time.
- 😡 **Anger Window** — Within 5 minutes after reaching full, repeated feeding shows **TOO MUCH → angry2 → angry3**.
- ☁️ **Animated Cloud Header** — Clouds tile and scroll left; size and speed are tunable.
