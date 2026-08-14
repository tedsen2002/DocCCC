# 專案教訓

- 使用 File System Access API 時，必須由最上層頁面的使用者點擊直接呼叫 `showDirectoryPicker({ mode: "readwrite" })` 取得權限；不可把 `FileSystemHandle.requestPermission()` 當成可在任意流程補授權的機制。
- 資料夾選擇器返回後應直接嘗試讀寫固定檔案，不可再用 `queryPermission()` 阻塞流程；遠端或虛擬資料夾操作必須顯示階段狀態並設定逾時回饋。
- 列印表格若沿用網頁 badge 類別（例如 `.level`），必須在 `@media print` 明確重設 `display`、背景與圓角，並以實際 PDF 或列印媒體截圖確認欄寬未被破壞。
- 更新 `.gitignore` 前先讀回既有規則，只能追加評核資料忽略項目；提交前以 `git status --ignored` 確認本機參考文件、agent 中繼資料與含個資的 JSON 都未被納入。
