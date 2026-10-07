# WG計算機（網頁版）

由 Unity 版 `WGPerformanceCalculator` 移植的純靜態網頁，可直接以 GitHub Pages 免費架設。

## 功能
- 日期（預設今天，可「跳回今天」）、LTD、MTD、目標業績 Goal（可從預設清單選擇）
- 計算 PROJ、達成率 %、DailyNeed、今日達標所需
- LTD / MTD / Goal 自動保存在瀏覽器（localStorage）
- 右上「公式」顯示計算公式

## 公式
| 項目 | 公式 |
|---|---|
| PROJ | MTD / 已過天數 × 當月天數 |
| % | PROJ / Goal |
| DailyNeed | (Goal − MTD) / 剩餘天數（月底最後一天顯示「月底已到」） |
| 今日達標所需 | Goal / 當月天數 × 已過天數 − MTD |

## 網站與部署
- 網址：https://karzeworks.github.io/wg-calculator/ （repo `karzeworks/wg-calculator`，`main` 分支根目錄）
- 推送到 `main` 後 GitHub Pages 會自動重新部署。

## 廣告（Google AdSense）
- 每頁 `<head>` 已放 AdSense 驗證碼；`ads.txt` 與隱私權政策位於網域根目錄，由 `karzeworks/karzeworks.github.io` repo 管理。
- 廣告版位只在周邊空白處：寬螢幕左右兩側 160×600、窄螢幕計算結果下方 300×250。
- 審核通過後到 AdSense「廣告 → 依廣告單元」建立固定尺寸的多媒體廣告，把 `data-ad-slot` 填進 `ads.js` 的 `AD_SLOTS`；不要開啟「自動廣告」，以免出現插頁或浮動廣告。

## 本機預覽
```bash
python -m http.server 5173
```
然後開啟 http://localhost:5173 。
