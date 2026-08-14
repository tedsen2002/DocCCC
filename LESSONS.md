# 專案教訓

- 使用 File System Access API 時，必須由最上層頁面的使用者點擊直接呼叫 `showDirectoryPicker({ mode: "readwrite" })` 取得權限；不可把 `FileSystemHandle.requestPermission()` 當成可在任意流程補授權的機制。
- 資料夾選擇器返回後應直接嘗試讀寫固定檔案，不可再用 `queryPermission()` 阻塞流程；遠端或虛擬資料夾操作必須顯示階段狀態並設定逾時回饋。
- 列印表格若沿用網頁 badge 類別（例如 `.level`），必須在 `@media print` 明確重設 `display`、背景與圓角，並以實際 PDF 或列印媒體截圖確認欄寬未被破壞。
- 更新 `.gitignore` 前先讀回既有規則，只能追加評核資料忽略項目；提交前以 `git status --ignored` 確認本機參考文件、agent 中繼資料與含個資的 JSON 都未被納入。
- File System Access 回歸測試的 handle mock 必須實作實際會用到的契約（至少 `name`、`getFile()` 與 `createWritable()`）；同一測試若有一般載入與舊資料升級等多組 mock，應一次搜尋並同步補齊，避免把不完整替身誤判成產品回歸。
- 絕不可用 `showSaveFilePicker()` 連結或讀取既有的 `DocCCC-data.json`；Windows 網路位置可能在使用者確認儲存時、程式讀回驗證前就把原檔截成 0 KB。既有資料只可透過資料夾 handle 的 `getFileHandle(..., { create: false })`，或 `showOpenFilePicker()` 安全讀取後再由另一個直接點擊呼叫 `requestPermission({ mode: "readwrite" })`；替代流程必須先用可丟棄檔案在實際環境驗證。
- Windows FTP「網路位置」部署時，FTP 可保存最新版 `index.html` 供複製，但執行檔必須先複製到每台電腦的本機磁碟，FTP 只放共用 `DocCCC-data.json`；頁面應阻擋 `ftp:` 與帶 hostname 的 `file:` 啟動來源並提示本機執行。
- 多人共用 JSON 必須以「開啟時基準、本機狀態、寫入前 FTP 狀態」做三方合併；稽核採不可刪除聯集、已提交資料不得靜默覆蓋，且合併後新增的 `updatedAt` 必須經資料升級與重開仍完整保留。
