import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";

const html = readFileSync(new URL("./index.html", import.meta.url), "utf8");
const milestonesHtml = readFileSync(new URL("./milestones.html", import.meta.url), "utf8");
const manualUrl = new URL("./manual/DocCCC_院內使用手冊.html", import.meta.url);
const manualHtml = readFileSync(manualUrl, "utf8");
const manualPdfUrl = new URL("./manual/DocCCC_院內使用手冊.pdf", import.meta.url);

assert.match(html, /<title>CCC 核心能力評分<\/title>/, "頁面標題應存在");
assert.match(html, /<button class="tab active" data-tab="assessment" type="button">六大核心<\/button>/, "原評分作業頁簽應改名為六大核心");
assert.match(html, /data-tab="ccc"/, "應有獨立 CCC 評核表分頁");
assert.match(html, /id="panel-ccc"/, "CCC 評核表應有獨立頁面容器");
assert.match(html, /data-tab="core-epa"/, "應有獨立 Core EPAs 評量表分頁");
assert.match(html, /id="panel-core-epa"/, "Core EPAs 評量表應有獨立頁面容器");
assert.match(html, /data-tab="assessment"[\s\S]*id="milestonesReferenceLink"[\s\S]*data-tab="core-epa"[\s\S]*data-tab="score-summary"[\s\S]*data-tab="ccc"/, "入口應依六大核心、美國 RT Milestones、Core EPAs、分數統計、CCC 排列");
assert.match(html, /id="panel-score-summary"/, "應有獨立 EPA／六大核心分數統計頁");
assert.match(html, /data-tab="roster"/, "應有名單設定分頁");
assert.match(html, /data-tab="audit"/, "應有稽核紀錄分頁");
assert.match(html, /id="milestonesReferenceLink" class="tab tab-reference" href="milestones\.html" target="_blank" rel="noopener">美國RT- Milestones<\/a>/, "Milestones 入口應另開獨立離線 HTML");
assert.doesNotMatch(html, /id="panel-milestones"|data-tab="milestones"/, "主頁不應再內嵌 Milestones 面板");

const manualImageSources = [...manualHtml.matchAll(/<img src="([^"]+)"/g)].map((match) => match[1]);
assert.equal(manualImageSources.length, 27, "院內手冊應包含完整的 27 張圈選操作截圖");
assert.equal(new Set(manualImageSources).size, manualImageSources.length, "院內手冊不應重複使用同一張操作截圖");
for (const source of manualImageSources) {
  assert.ok(existsSync(new URL(source, manualUrl)), `院內手冊截圖應存在：${source}`);
}
assert.match(manualHtml, /本機操作 HTML、FTP 共用單一 JSON/, "院內手冊應先說明本機 HTML 與 FTP JSON 的日常架構");
assert.match(manualHtml, /id="milestones"[\s\S]*邊看邊評分/, "院內手冊應說明 Milestones 的並排使用方式");
assert.match(manualHtml, /瀏覽器會另開 <code>milestones\.html<\/code>/, "院內手冊應說明 Milestones 是獨立頁面");
assert.match(manualHtml, /Core EPA[\s\S]*教師姓名[\s\S]*確定並提交[\s\S]*提交後整張鎖定/, "院內手冊應說明 Core EPA 具名教師、提交與鎖定流程");
assert.match(manualHtml, /class="password">tsgh123<\/p>/, "院內手冊應提供管理修改密碼");
assert.doesNotMatch(manualHtml, /DOC12345|稽核檢視密碼/, "院內手冊不得揭露或教學稽核檢視密碼");
assert.ok(manualHtml.indexOf('id="advanced"') > manualHtml.indexOf('id="admin"'), "匯入、匯出、共用資料夾與衝突等進階內容應放在一般流程之後");
assert.ok(existsSync(manualPdfUrl), "院內手冊應提供可列印 PDF");
assert.ok(statSync(manualPdfUrl).size > 1_000_000, "院內手冊 PDF 應包含實際截圖而非空白骨架");
const manualPdfText = readFileSync(manualPdfUrl).toString("latin1");
const manualPdfPageCount = (manualPdfText.match(/\/Type\s*\/Page\b/g) || []).length;
assert.ok(manualPdfPageCount >= 20 && manualPdfPageCount <= 24, `院內手冊 PDF 應維持可閱讀且無零碎尾頁的篇幅，目前為 ${manualPdfPageCount} 頁`);
assert.match(html, /id="exportDataButton"[^>]*>匯出資料<\/button>/, "右上角應提供完整資料匯出按鈕");
assert.match(html, /id="importDataButton"[^>]*>匯入資料<\/button>/, "右上角應提供完整資料匯入按鈕");
assert.match(html, /id="sharedFileDialog"/, "開啟網頁時應有強制連結共用 JSON 的阻擋畫面");
assert.match(html, /const SHARED_DATA_FILENAME = "DocCCC-data\.json"/, "共用資料應使用固定 JSON 檔名");
assert.match(html, /directoryHandle\.getFileHandle\(SHARED_DATA_FILENAME, \{ create: false \}\)/, "直接模式應只讀取共用資料夾內的固定 JSON 且不得建立其他檔案");
assert.match(html, /if \(file\.name !== SHARED_DATA_FILENAME\)/, "相容匯入時也應拒絕其他 JSON 檔名");
assert.match(html, /window\.showDirectoryPicker\(\{[\s\S]*?mode: "readwrite"/, "支援的 Edge 或 Chrome 應在選取共用資料夾時直接要求讀寫模式");
assert.match(html, /id="openNetworkSharedFileButton" class="btn btn-create"[^>]*>開啟 FTP 共用檔案<\/button>/, "本機 HTML 應提供單一醒目的 FTP 共用檔案按鈕");
assert.match(html, /id="sharedFileBackupButton"[^>]*hidden/, "起始畫面應隱藏瀏覽器備份按鈕");
assert.match(html, /id="openSharedFileButton"[^>]*hidden/, "起始畫面應隱藏共用資料夾按鈕");
assert.doesNotMatch(html, /id="authorizeNetworkSharedFileButton"|允許寫入並開始使用/, "FTP 開檔流程不得再要求第二個網站內授權按鈕");
assert.match(html, /window\.showOpenFilePicker\(\{[\s\S]*?id: "docccc-network-json"/, "FTP JSON 應使用開啟既有檔案的選擇器");
assert.doesNotMatch(html, /showSaveFilePicker|openSharedJsonFileButton/, "不得用儲存選擇器連結既有共用 JSON，以免確認儲存時先將原檔截成 0 KB");
assert.match(html, /const permission = await handle\.requestPermission\(\{ mode: "readwrite" \}\)/, "選取 FTP JSON 後應在同一開檔流程要求讀寫權限");
assert.doesNotMatch(html, /queryPermission/, "選取資料夾後不得再以額外權限查詢阻塞遠端檔案載入");
assert.match(html, /id="sharedFileProgress"[^>]*aria-live="polite"/, "選取資料夾後應持續顯示目前讀取階段");
assert.match(html, /withSharedFileTimeout\([\s\S]*?getFileHandle/, "遠端資料夾讀取卡住時應有逾時回饋");
assert.match(html, /const isTopLevelPage = window\.self === window\.top/, "嵌入或預覽框開啟時應停用直接寫入並提示改用最上層分頁");
assert.match(html, /function isRemoteHTMLLaunch\(\)[\s\S]*window\.location\.protocol === "ftp:"[\s\S]*window\.location\.hostname/, "HTML 從 FTP 或 UNC 網路位置啟動時應可辨識並阻擋");
assert.match(html, /FTP 可以保存最新版 index\.html[\s\S]*不可直接從 FTP／UNC 執行/, "網路位置直接啟動 HTML 時應明確提示複製至本機");
assert.match(html, /sharedFileHandle\.createWritable\(\)/, "資料變更後應直接覆寫已授權的同一個 JSON");
assert.match(html, /let verifiedText = await readSharedDataFile\(sharedFileHandle\)/, "共用 JSON 寫入後應重新讀取驗證");
assert.match(html, /currentText !== sharedFileBaselineText/, "覆寫前應辨識已被其他電腦更新的共用 JSON");
assert.match(html, /reconcileSharedFileChanges\(currentText\)/, "共用 JSON 更新時應先執行三方合併而非直接覆蓋");
assert.match(html, /const MERGE_AMBIGUITY_MS = 5 \* 60 \* 1000/, "同欄位修改相差五分鐘內應視為需要人工選擇");
assert.match(html, /id="mergeConflictDialog"/, "無法安全判斷的同欄位修改應提供選擇視窗");
assert.match(html, /id="mergeConflictPassword"[^>]*type="password"/, "已提交或鎖定內容的合併應要求管理密碼");
assert.match(html, /type: "merge-resolution"/, "鎖定內容的合併選擇應建立不可覆蓋的稽核事件");
assert.match(html, /window\.addEventListener\("beforeunload", warnIfSharedFileUnsynced\)/, "尚未同步時關閉頁面應觸發離開警告");
assert.match(html, /initializeSharedDataGate\(\);/, "頁面初始化後應依開啟模式設定共用 JSON 流程");
assert.match(html, /const isHostedPreview = window\.location\.protocol === "http:" \|\| window\.location\.protocol === "https:"/, "HTTP(S) 公開版本應辨識為免強制連結模式");
assert.match(html, /if \(isHostedPreview\) \{[\s\S]*sharedFileMode = "preview";[\s\S]*setSharedFileStatus\("local", "瀏覽器本機模式"\);[\s\S]*return;/, "公開版本應直接進入瀏覽器本機模式且不開啟阻擋對話框");
assert.match(html, /if \(sharedFileMode === "locked" \|\| sharedFileMode === "preview"\) return;/, "公開預覽的本機變更不得誤標成待同步 JSON");
assert.match(html, /canConnectFromPreview \? "連結 JSON" : "儲存 JSON"/, "公開預覽仍應保留自願連結共用 JSON 的入口");
assert.match(html, /id="importDataInput" type="file" accept="\.json,application\/json" hidden/, "匯入按鈕應使用隱藏的 JSON 檔案選擇器");
assert.match(html, /function exportDataBackup\(\)/, "應提供完整 JSON 備份匯出流程");
assert.match(html, /async function importDataBackup\(event\)/, "應提供完整 JSON 備份匯入流程");
assert.match(html, /取代目前瀏覽器內的所有資料/, "匯入取代現有資料前應明確警告使用者");
assert.match(html, /const CCC_SCORE_LOOKUP_URL = "https:\/\/rt-linebot\.onrender\.com\/r-rating"/, "CCC 表頭 QR Code 應指向指定的分數查詢網址");
assert.match(html, /data-qr-value="\$\{CCC_SCORE_LOOKUP_URL\}"/, "QR Code 應保留可測試的原始網址標記");
assert.match(html, /conturing\/journal分數查詢<br><small>密碼artd12345!<\/small>/, "CCC 表頭應顯示指定的查詢說明與密碼");
assert.match(html, /<svg viewBox="0 0 37 37"[^>]*>[\s\S]*CCC_SCORE_LOOKUP_QR_PATH/, "分數查詢 QR Code 應完整內嵌，不得依賴外網圖片服務");
assert.match(html, /elements\.importDataInput\.addEventListener\("change", importDataBackup\)/, "選取備份檔後應啟動匯入流程");
assert.match(html, /const SCHEMA_VERSION = 13/, "指定教師與 N\/A 計分加入後應使用 schema v13");
assert.match(html, /const ITEM_MAX_SCORE = 5/, "每個教師分項滿分應為 5 分");
assert.match(html, /const ITEM_NOT_APPLICABLE = "NA"/, "教師分項應以固定 NA 值保存不適用");
assert.match(html, /function itemScoreOptions\(selected = null\)/, "教師 N\/A 或 1–5 分應由共用下拉選項產生");
assert.match(html, /<option value="\$\{ITEM_NOT_APPLICABLE\}"[^>]*>N\/A<\/option>/, "教師分項應提供 N\/A 選項");
assert.doesNotMatch(html, /\[0, 1, 2, 3, 4, 5\]/, "教師分項不得再提供 0 分選項");
assert.match(html, /<select class="item-score-select"[^>]+required>/, "教師分項應使用 N\/A 或 1–5 下拉選單");
assert.doesNotMatch(html, /name="\$\{prefix\}-item-\$\{currentIndex\}" type="number"/, "教師分項不得再使用數字輸入框");
assert.match(html, /level >= 1 && level <= 5/, "學生與教師 Level 應限制為 1–5");
assert.match(html, /form\[role\] \|\| \(role === "teacher" && !form\.student\)/, "每張表的教師評分應等待該張學生自評完成");
assert.match(html, /const submittedAt = new Date\(\)\.toISOString\(\)/, "提交時應保存完成時間");
assert.match(html, /id="teacherIdentityField"[\s\S]*目前評分教師[\s\S]*確定我是評分教師[\s\S]*變更評分教師/, "教師評分開始前應確認目前教師或變更姓名");
assert.match(html, /elements\.scoreFields\.querySelectorAll\("select"\)[\s\S]*control\.disabled = !confirmed/, "教師完成身分確認前應鎖住六大核心評分欄位");
assert.match(html, /residents: rosterSnapshot/, "每個期別應保存獨立名單快照");
assert.match(html, /const RESIDENT_LEVELS = \["R1", "R2", "R3", "R4"\]/, "名單應支援四種住院醫師年級");
assert.match(html, /data-add-resident-level/, "名單設定應可依年級新增人員");
assert.match(html, /period\.assessments\[resident\.id\] = makeResidentAssessment\(\)/, "新增人員時應建立可容納多張六大核心表單的人員記錄");
assert.match(html, /id="addSixCoreFormButton" class="btn btn-create"[^>]*>＋ 新增表單<\/button>/, "六大核心頁右上應有醒目的新增表單按鈕");
assert.match(html, /id="printButton" class="btn btn-export"[^>]*>匯出 PDF<\/button>/, "六大核心頁右上應有醒目的 PDF 按鈕");
assert.match(html, /id="sixCoreResidentForNewForm" name="residentId" required/, "從固定操作列新增六大核心表單時應選擇住院醫師");
assert.match(html, /name="assessmentDate" type="date" required/, "新增六大核心評核時應要求選擇日期");
assert.match(html, /id="sixCoreAssignedTeacherName" name="assignedTeacherName"[^>]*required/, "新增六大核心表單時應先輸入指定教師");
assert.match(html, /id="coreEpaAssignedTeacherName" name="assignedTeacherName"[^>]*required/, "新增 Core EPA 表單時應先輸入指定教師");
assert.match(html, /delete period\.assessments\[residentId\]/, "移除未評核人員時應同步移除空白評分表");
assert.match(html, /function residentHasProtectedData/, "移除前應檢查評核與稽核資料");
assert.match(html, /sixCoreFormsFor\(assessment\)\.some\(\(form\) => form\.student \|\| form\.teacher \|\| form\.teacherDraft\)/, "任一六大核心表單已有資料時不得移除名單人員");
assert.match(html, /assessment\?\.cccDraft/, "CCC 草稿存在時不得移除名單人員");
assert.match(html, /assessment\?\.cccSubmission/, "CCC 正式提交存在時不得移除名單人員");
assert.match(html, /coreEpaFormsFor\(assessment\)\.length > 0/, "任一 Core EPA 表單存在時不得移除名單人員");
assert.match(html, /type: "unlock"/, "密碼解鎖應建立稽核事件");
assert.match(html, /type: "modification"/, "分數修改應建立稽核事件");
assert.match(html, /const ADMIN_PASSWORD = "tsgh123"/, "應設定預設管理密碼");
assert.match(html, /id="renamePeriodButton"[^>]*>更改期別名稱<\/button>/, "應提供更改目前期別名稱的入口");
assert.match(html, /id="renamePeriodName"[^>]*type="text"/, "期別重新命名應使用一般文字欄位");
assert.match(html, /id="deletePeriodButton"[^>]*>刪除目前期別<\/button>/, "應提供刪除目前期別的操作入口");
assert.match(html, /id="deletePeriodPassword"[^>]*type="password"/, "刪除期別應透過密碼欄位驗證");
assert.match(html, /type: "period-deletion"/, "刪除期別應建立獨立稽核事件");
assert.match(html, /periodSummary: periodAuditSummary\(period\)/, "期別刪除稽核應保存刪除當下的資料摘要");
assert.match(html, /const AUDIT_PASSWORD = "DOC12345"/, "稽核紀錄頁應設定獨立檢視密碼");
assert.match(html, /id="auditAuthForm"/, "稽核紀錄頁應先顯示密碼驗證表單");
assert.match(html, /if \(!auditUnlocked\) \{\s*elements\.auditContent\.innerHTML = "";/, "稽核頁未解鎖時不得把紀錄渲染到頁面");
assert.match(html, /if \(!auditUnlocked\) \{ showToast\("請先輸入稽核檢視密碼。"\); return; \}/, "未解鎖時不得匯出稽核 CSV");
assert.match(html, /function exportAuditCSV\(\)/, "稽核紀錄應可匯出試算表 CSV");
assert.match(html, /window\.print\(\)/, "六大核心頁應支援列印為 PDF");
assert.match(html, /@page \{ size: A4 landscape/, "列印版應使用 A4 橫式");
assert.match(html, /\.resident-card:not\(\.complete\) \{ display: none !important; \}/, "列印時應省略尚未完成的學生");
assert.match(html, /\.formal-print-report \{[^}]*break-after: page;/, "列印版應讓每張已完成的六大核心表單另起一頁");
assert.match(html, /\.resident-card\.complete::before \{ display: none !important; \}/, "列印時不得讓卡片頂部裝飾線遮住正式標題");
assert.match(html, /\.formal-print-report \{[^}]*padding-top: 3mm;/, "正式列印表頭應保留上方安全距離");
assert.match(html, /class="formal-print-report"/, "每位學生應有獨立正式列印表");
assert.match(html, /三軍總醫院 放射腫瘤部住院醫師訓練考核表/, "列印標題應採用 Word 正式表名");
assert.match(html, /ACGME Milestones 2\.0 暨有效分項 100 分制雙軌評核/, "列印副標題應說明有效分項換算 100 分");
assert.match(html, /class="formal-code-legend"/, "正式列印表應醒目說明六角圖縮寫");
assert.match(html, /六角圖縮寫對照/, "縮寫對照應有清楚標題");
assert.match(html, /<td>\$\{metric\.code\} \$\{metric\.name\}<small>（滿分\$\{metric\.nominalMax\}）<\/small><\/td>/, "最後評分表的核心能力應顯示代碼、中文全名與原始滿分");
assert.match(html, /const firstInGroup = rowIndex === 0 \|\| column\[rowIndex - 1\]\.competency\.code !== competency\.code/, "原始詳細評分表應辨識每個能力群組的第一列");
assert.match(html, /<td class="domain" rowspan="\$\{domainItemCount\}">\$\{escapeHTML\(competency\.name\)\}<\/td>/, "核心能力中文全名應依題數合併儲存格");
assert.match(html, /data-radar-kind="print-absolute"/, "列印表應包含教師分項六角圖");
assert.match(html, /data-radar-kind="print-levels"/, "列印表應包含學生與教師 Level 六角圖");
assert.match(html, /教師評核分數/, "教師 Level 應使用教師評核分數名稱");
assert.doesNotMatch(html, /教師整體表現|<th>教師整體<\/th>/, "不得再使用語意不清的教師整體表現名稱");
assert.match(html, /紅色虛線：學生自評/, "列印紅藍六角圖應標示學生自評圖例");
assert.match(html, /藍色實線：教師評核分數/, "列印紅藍六角圖應標示教師評核圖例");
assert.match(html, /scores: form\.student\.levels, color: ROLE_COLORS\.student, dash: \[7, 5\]/, "每張表的學生自評六角圖應使用虛線");
assert.match(html, /context\.setLineDash\(dash\)/, "六角圖繪製應套用資料線型");
assert.match(html, /function printItemTables\(assessment\)/, "列印表應包含 20 項原始詳細評分");
assert.match(html, /<th class="score">評分<\/th>/, "原始詳細評分表欄名應簡潔顯示評分");
assert.doesNotMatch(html, /<th class="score">小項評分<\/th>/, "原始詳細評分表不得再顯示小項評分欄名");
assert.match(html, /目前沒有已完成且可輸出的評核/, "沒有完整評核時不應輸出空白 PDF");
assert.match(html, /data-radar-kind="absolute"/, "應提供教師絕對百分比六角圖");
assert.match(html, /data-radar-kind="levels"/, "應提供學生與教師 Level 六角圖");
assert.match(html, /repeat\(auto-fit, minmax\(min\(240px, 100%\), 1fr\)\)/, "網頁六角圖應依可用寬度自動改為單欄");
assert.match(html, /\.legend span \{ white-space: nowrap; \}/, "網頁六角圖的單一圖例不得拆字換行");
assert.match(html, /\.chart-title strong \{[^}]*white-space: nowrap;/, "網頁六角圖標題不得換行");
assert.match(html, /<strong>Level 評核比較<\/strong>/, "網頁紅藍六角圖應使用精簡標題");
assert.match(html, /<span class="student">學生<\/span><span class="teacher">教師<\/span>/, "網頁圖例應精簡標示學生與教師");
assert.match(html, /<strong>教師評分<\/strong>/, "綠色百分比六角圖標題應為教師評分");
assert.match(html, /teacherDomainMetrics/, "教師分項應換算各能力小計與百分比");
assert.match(html, /score \/ max \* 100/, "絕對六角圖應依各能力滿分換算百分比");
assert.match(html, /function teacherMetricResultText\(metric\)/, "六角圖下方應以共用格式顯示有效分母與 N\/A 數量");
assert.match(html, /\$\{metric\.code\} \$\{metric\.name\}（滿分\$\{metric\.nominalMax\}）/, "網頁評分表應在能力名稱後顯示精簡原始滿分");
assert.match(html, /<small>N\/A \$\{metric\.notApplicable\}項<\/small>/, "列印彙整表應顯示各能力 N\/A 數量");
assert.match(html, /#e5484d/, "學生圖形應使用紅色");
assert.match(html, /#1769ff/, "教師圖形應使用藍色");
assert.match(html, /#1d6b50/, "絕對百分比圖形應使用綠色");
assert.match(html, /id="scoreDetailDialog"/, "教師六角圖應能開啟原始分項明細");
assert.match(html, /function openScoreDetail\(residentId, formId\)/, "原始分項明細應精確開啟指定日期的六大核心表單");
assert.match(html, /點擊查看 20 項原始評分/, "教師六角圖應提示可查看原始評分");
assert.match(html, /舊版資料僅供查看/, "既有 0–100 資料應保留為唯讀資料");
assert.match(html, /id="saveDraftButton"/, "教師評核表應提供暫存按鈕");
assert.match(html, /function saveTeacherDraft\(\)/, "教師評核暫存應有獨立儲存流程");
assert.match(html, /form\.teacherDraft = \{ teacherName, itemScores, levels, savedAt:/, "每張表暫存應保存教師姓名、分項與 Level");
assert.match(html, /delete form\.teacherDraft/, "指定表單正式提交後應清除自己的教師暫存");
assert.match(html, /itemScores: itemScores \? \[\.\.\.itemScores\]/, "稽核事件應保存教師分項快照");
assert.match(html, /levels: levels \? \[\.\.\.levels\]/, "稽核事件應保存 Level 快照");
assert.match(html, /ASSESSMENT_ITEMS\.map\(\(item\) => `\$\{item\.code\} 分項`\)/, "CSV 應匯出 20 個分項");
assert.match(html, /localStorage\.setItem/, "公開預覽版應在瀏覽器保存資料");
assert.match(html, /暫存、提交與其他正式資料變更會自動寫回同一檔案/, "頁面應清楚說明共用 JSON 的自動儲存行為");

assert.match(html, /function renderCCCForm\(period\)/, "CCC 評核表應依目前期別名單產生表單");
assert.match(html, /period\?\.residents \|\| \[\]/, "CCC 評核表學生選項應來自該期名單快照");
assert.match(html, /function sixCoreAggregate\(assessment, dateFrom = "", dateTo = ""\)/, "CCC 六大核心分數應依日期範圍彙整多張表單");
assert.match(html, /teacherDomainMetrics\(teacher\.itemScores\)/, "每張六大核心表單應沿用綠色六角圖的教師百分比");
assert.match(html, /percent: max > 0 \? Math\.round\(score \/ max \* 1000\) \/ 10 : null/, "每張六大核心總分應以有效得分除以有效滿分換算至 100 分");
assert.match(html, /N\/A 不列入分子與分母/, "CCC 頁面應明示 N\/A 不參與單張分數計算");
assert.doesNotMatch(html, /未加權六項平均/, "CCC 頁面不得再把六軸算術平均誤稱為核心總分");
assert.match(html, /name="coreDateFrom" type="date"/, "CCC 應提供六大核心納入起日");
assert.match(html, /name="coreDateTo" type="date"/, "CCC 應提供六大核心納入迄日");
assert.match(html, /coreSourceForms: aggregate\.forms\.map\(sixCoreSourceSnapshot\)/, "CCC 提交應鎖定實際納入的六大核心表單快照");
assert.match(html, /scores\[0\] \* 0\.3 \+ scores\[1\] \* 0\.25 \+ scores\[2\] \* 0\.25 \+ scores\[3\] \* 0\.2/, "臨床綜合總分應依 Word 權重計算");
assert.match(html, /function cccWeightedContribution\(score, weight\)/, "各項原始分數應個別顯示加權得分以避免誤讀");
assert.match(html, /原始分數<\/span><span>加權得分/, "CCC 分數表應清楚區分原始分數與加權得分");
assert.match(html, /name="treatmentPlanScore" type="number" min="0" max="100"/, "治療計畫應提供百分制手動輸入");
assert.match(html, /name="journalMeetingScore" type="number" min="0" max="100"/, "Journal meeting 應提供百分制手動輸入");
assert.match(html, /name="annualExamScore" type="number" min="0" max="100"/, "學會年度考試應提供百分制手動輸入");
assert.match(html, /CCC_EPA_OPTIONS/, "EPA 臨床授權應提供 L1–L5 勾選項");
assert.match(html, /name="comments" maxlength="2000"/, "CCC 總評語應提供手動輸入欄位");
assert.match(html, /assessment\.cccDraft = \{/, "CCC 初稿應保存到該期該學生的評核記錄");
assert.match(html, />暫存<\/button>/, "CCC 表單應提供可繼續編輯的暫存按鈕");
assert.match(html, />提交<\/button>/, "CCC 表單應提供正式提交按鈕");
assert.match(html, />匯出 PDF<\/button>/, "CCC 表單應提供 PDF 匯出按鈕");
assert.match(html, /function submitCCCForm\(event\)/, "CCC 正式提交應有獨立流程");
assert.match(html, /assessment\.cccSubmission = submission/, "CCC 提交應保存不可變的正式快照");
assert.match(html, /if \(submitted\) \{\s*elements\.cccForm\.querySelectorAll\("input, textarea"\)/, "CCC 正式提交後應鎖定所有可編輯欄位");
assert.match(html, /type: "ccc-submission"/, "CCC 正式提交應留下稽核事件");
assert.match(html, /"CCC 納入起日", "CCC 納入迄日", "CCC 納入張數", "CCC 六大核心平均"/, "CCC 日期範圍、表單張數與平均應可隨稽核 CSV 匯出");
assert.match(html, /@page ccc-report \{ size: A4 portrait/, "CCC PDF 應使用 A4 直式頁面");
assert.match(html, /pageStyle\.textContent = "@page \{ size: A4 portrait; margin: 7mm; \}"/, "CCC 匯出時應覆寫既有橫式列印設定");
assert.match(html, /height: 280mm;/, "CCC PDF 內容應保留列印安全距離並限制在 A4 單頁內");
assert.match(html, /function exportCCCPDF\(\)/, "CCC 表單應能匯出獨立 PDF");
assert.match(html, /住院醫師核心能力適任性評核表/, "評核 PDF 應使用指定的正式表名");
assert.doesNotMatch(html, /ccc-print-status|草稿預覽/, "評核 PDF 不得顯示右上或右下的草稿／提交狀態小字");
assert.match(html, /document\.title = `住院醫師核心能力適任性評核表_/, "評核 PDF 檔名應使用正式表名");
assert.match(html, /name="learnerFeedback"/, "參考表所需的學員省思與回饋欄應存在");
assert.match(html, /name="mentorName"/, "參考表所需的導師簽核欄應存在");
assert.match(html, /name="educationLeadName"/, "參考表所需的教學負責人簽核欄應存在");
assert.match(html, /name="chiefName"/, "參考表所需的科主任簽核欄應存在");

assert.match(html, /function renderCoreEPAForm\(period\)/, "Core EPAs 評量表應依目前期別名單產生表單");
assert.match(html, /const CORE_EPA_ITEMS = \[/, "應定義原始表單的 Core EPA 項目");
assert.doesNotMatch(html, /coreEPAChoiceMarkup|CORE_EPA_TRAINEE_TYPES|學員類別/, "Core EPAs 不得再顯示或要求學員類別");
assert.match(html, /id="coreEpaNewAssessmentDate" name="assessmentDate" type="date" required/, "新增 Core EPA 表單時應要求評量日期");
assert.match(html, /function coreEpaFormsFor\(assessment\)/, "每位住院醫師應保存多張 Core EPA 表單");
assert.match(html, /assessment\.coreEpaForms\.push\(form\)/, "同一期同一人應可附加 Core EPA 表單");
assert.match(html, /id="coreEpaFormSelect"/, "Core EPA 頁應可切換同一人的多張表單");
assert.match(html, /name="learnerAdvice" maxlength="4000"/, "Core EPAs 應提供對學員的學習建議欄");
assert.match(html, /name="mentorAdvice" maxlength="4000"/, "Core EPAs 應提供對導師的建議欄");
assert.match(html, /name="programAdvice" maxlength="4000"/, "Core EPAs 應提供對訓練計畫與科部的建議欄");
assert.match(html, /assessment\.coreEpaForms\[formIndex\] = \{/, "Core EPA 暫存應只更新目前選取的表單");
assert.match(html, /data-core-epa-action="draft">暫存目前表單<\/button>/, "Core EPAs 應提供可繼續編輯的暫存按鈕");
assert.match(html, /data-core-epa-identity[\s\S]*目前評分教師[\s\S]*確定我是評分教師[\s\S]*變更評分教師/, "Core EPA 應先要求確認目前教師或變更姓名");
assert.match(html, /function confirmedCoreEPATeacherName/, "Core EPA 應以已確認的實際教師姓名提交");
assert.match(html, /type="submit">確定並提交<\/button>/, "Core EPA 表單底部應提供確定並提交按鈕");
assert.match(html, /function submitCoreEPAForm\(event\)/, "Core EPA 應有獨立正式提交流程");
assert.match(html, /submittedAt: form\.submittedAt \|\| timestamp/, "Core EPA 第一次提交後應保存固定提交時間");
assert.match(html, /id="coreEpaUnlockPassword"[^>]*type="password"/, "Core EPA 已提交表單應提供管理密碼解鎖視窗");
assert.match(html, /function unlockCoreEPAForm\(event\)/, "Core EPA 管理解鎖應有獨立流程");
assert.match(html, /type: modifying \? "core-epa-modification" : "core-epa-submission"/, "Core EPA 提交與修改應留下不同稽核事件");
assert.match(html, /querySelectorAll\("input, textarea"\)[^;]*control\.disabled = true/, "Core EPA 正式提交後應停用所有可編輯欄位");
assert.match(html, /id="addCoreEpaFormButton" class="btn btn-create"[^>]*>＋ 新增表單<\/button>[\s\S]*id="coreEpaExportButton" class="btn btn-export"[^>]*>匯出 PDF<\/button>/, "Core EPA 新增與 PDF 按鈕應和六大核心使用相同位置順序及醒目配色");
assert.match(html, /id="cccExportButton" class="btn btn-export"[^>]*>匯出 PDF<\/button>/, "CCC 的 PDF 按鈕也應固定在頁面右上操作列");
assert.match(html, /function exportCoreEPAPDF\(\)/, "Core EPAs 應有獨立 PDF 匯出流程");
assert.match(html, /@page core-epa-report \{ size: A4 portrait/, "Core EPAs PDF 應使用 A4 直式頁面");
assert.match(html, /page: core-epa-report;/, "Core EPAs 列印內容應套用獨立頁面設定");
assert.match(html, /三軍總醫院 放射腫瘤部 core EPAs 評量表/, "Core EPAs 網頁與 PDF 應使用原始表名");

const competencyCodes = [...html.matchAll(/^\s+code: "(PC|MK|PROF|PBLI|ICS|SBP)",$/gm)].map((match) => match[1]);
assert.deepEqual(competencyCodes, ["PC", "MK", "PROF", "PBLI", "ICS", "SBP"], "應依 Word 定義六項 ACGME 核心能力");

const itemCodes = [...html.matchAll(/\{ code: "(PC[1-8]|MK[1-2]|PROF1|PROF2\/3|PBLI[1-2]|ICS[1-3]|SBP[1-3])", description:/g)].map((match) => match[1]);
assert.equal(itemCodes.length, 20, "應依 Word 定義 20 個教師評分小項");
assert.deepEqual(
  [
    itemCodes.filter((code) => code.startsWith("PC")).length,
    itemCodes.filter((code) => code.startsWith("MK")).length,
    itemCodes.filter((code) => code.startsWith("PROF")).length,
    itemCodes.filter((code) => code.startsWith("PBLI")).length,
    itemCodes.filter((code) => code.startsWith("ICS")).length,
    itemCodes.filter((code) => code.startsWith("SBP")).length
  ],
  [8, 2, 2, 2, 3, 3],
  "各能力的小項數應與 Word 一致"
);
assert.equal(itemCodes.length * 5, 100, "20 個小項的總滿分應為 100 分");

const coreEpaCodes = [...html.matchAll(/\{ code: "(EPA(?:[1-9]|10|11))", name:/g)].map((match) => match[1]);
assert.deepEqual(
  coreEpaCodes,
  ["EPA1", "EPA2", "EPA3", "EPA4", "EPA5", "EPA6", "EPA7", "EPA8", "EPA9", "EPA10", "EPA11"],
  "Core EPAs 分頁應完整保留原始 Word 的 11 個評量項目"
);
assert.match(html, /typeof form\.updatedAt === "string"[\s\S]*?\{ updatedAt: form\.updatedAt \}/, "Core EPA 人工解決衝突後的修改時間應可跨重開保留");

const milestoneReference = milestonesHtml.match(/const MILESTONE_REFERENCE_GROUPS = \[([\s\S]*?)\n    \];/);
assert.ok(milestoneReference, "獨立頁應內嵌 PDF 整理後的中文 Milestones 參考資料");
assert.equal((milestoneReference[1].match(/sourcePage:/g) || []).length, 21, "中文參考頁應完整涵蓋原 PDF 的 21 項次能力");
const milestoneGroups = new Function(`return [${milestoneReference[1]}];`)();
const milestoneItems = milestoneGroups.flatMap((group) => group.items);
assert.equal(milestoneGroups.length, 6, "中文參考頁應依原表分成六個能力領域");
assert.equal(milestoneItems.length, 21, "中文參考頁應有 21 項次能力");
assert.ok(milestoneItems.every((item) => item.levels.length === 5 && item.levels.every((level) =>
  Array.isArray(level) && level.length > 0 && level.every((statement) => typeof statement === "string" && statement.trim()))),
"每項次能力都應完整提供 Level 1–5 的中文敘述");
for (const domainCode of ["PC", "MK", "SBP", "PBLI", "PROF", "ICS"]) {
  assert.match(milestoneReference[1], new RegExp(`code: "${domainCode}"`), `中文參考頁應包含 ${domainCode} 能力領域`);
}
assert.match(milestonesHtml, /Level 4：[\s\S]*設計為畢業目標，但不是單獨的畢業要件/, "參考頁應保留 Level 4 並非單獨畢業要件的重要限制");
assert.match(milestonesHtml, /非官方翻譯；若有解釋疑義，以原始 PDF 為準/, "中文整理應明確標示非官方翻譯及原始來源優先");
assert.match(milestonesHtml, /並排使用：[\s\S]*一邊查看敘述、一邊輸入成績/, "獨立頁應提示老師可與評分頁並排使用");
assert.doesNotMatch(milestonesHtml, /localStorage|showOpenFilePicker|DocCCC-data\.json/, "唯讀參考頁不得讀寫評分資料");

const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
assert.equal(scripts.length, 1, "應只有一段應用程式腳本");
new Function(scripts[0][1]);
const milestoneScripts = [...milestonesHtml.matchAll(/<script>([\s\S]*?)<\/script>/g)];
assert.equal(milestoneScripts.length, 1, "獨立 Milestones 頁應只有一段腳本");
new Function(milestoneScripts[0][1]);

const mergeCoreMatch = scripts[0][1].match(/\/\/ MERGE_CORE_START([\s\S]*?)\/\/ MERGE_CORE_END/);
assert.ok(mergeCoreMatch, "應可抽取三方合併核心做實際邏輯驗證");
const mergeCore = new Function("SCHEMA_VERSION", "MERGE_AMBIGUITY_MS", `${mergeCoreMatch[1]}; return { mergeSharedStates };`)(13, 5 * 60 * 1000);
const cloned = (value) => JSON.parse(JSON.stringify(value));
const mergeState = (form, auditLog = []) => ({
  schemaVersion: 13,
  selectedPeriodId: "p1",
  periods: [{
    id: "p1", name: "第一期", createdAt: "2026-08-14T00:00:00.000Z",
    residents: [{ id: "r1", level: "R1", name: "王醫師" }],
    assessments: { r1: { sixCoreForms: [], coreEpaForms: form ? [form] : [] } }
  }],
  auditLog
});
const coreForm = {
  id: "core-epa-1", assessmentDate: "2026-08-14", createdAt: "2026-08-14T00:00:00.000Z",
  savedAt: "2026-08-14T09:00:00.000Z", levels: Array(11).fill(""), learnerAdvice: "原始學員建議", mentorAdvice: "原始導師建議", programAdvice: ""
};

const nonOverlappingBase = mergeState(coreForm);
const nonOverlappingLocal = cloned(nonOverlappingBase);
nonOverlappingLocal.periods[0].assessments.r1.coreEpaForms[0].learnerAdvice = "本機更新學員建議";
nonOverlappingLocal.periods[0].assessments.r1.coreEpaForms[0].savedAt = "2026-08-14T10:01:00.000Z";
const nonOverlappingShared = cloned(nonOverlappingBase);
nonOverlappingShared.periods[0].assessments.r1.coreEpaForms[0].mentorAdvice = "FTP 更新導師建議";
nonOverlappingShared.periods[0].assessments.r1.coreEpaForms[0].savedAt = "2026-08-14T10:02:00.000Z";
const nonOverlappingMerge = mergeCore.mergeSharedStates(nonOverlappingBase, nonOverlappingLocal, nonOverlappingShared);
assert.equal(nonOverlappingMerge.conflicts.length, 0, "不同欄位即使在五分鐘內修改也應自動合併");
assert.equal(nonOverlappingMerge.state.periods[0].assessments.r1.coreEpaForms[0].learnerAdvice, "本機更新學員建議", "應保留本機修改的不同欄位");
assert.equal(nonOverlappingMerge.state.periods[0].assessments.r1.coreEpaForms[0].mentorAdvice, "FTP 更新導師建議", "應保留 FTP 修改的不同欄位");

const unionBase = mergeState(null);
const unionLocal = cloned(unionBase);
unionLocal.periods[0].assessments.r1.coreEpaForms.push({ ...coreForm, id: "local-form" });
const unionShared = cloned(unionBase);
unionShared.periods[0].assessments.r1.coreEpaForms.push({ ...coreForm, id: "shared-form" });
const unionMerge = mergeCore.mergeSharedStates(unionBase, unionLocal, unionShared);
assert.deepEqual(unionMerge.state.periods[0].assessments.r1.coreEpaForms.map((form) => form.id).sort(), ["local-form", "shared-form"], "兩台電腦新增的不同表單應依 ID 取聯集");

const newerBase = mergeState(coreForm);
const newerLocal = cloned(newerBase);
newerLocal.periods[0].assessments.r1.coreEpaForms[0].learnerAdvice = "較舊本機值";
newerLocal.periods[0].assessments.r1.coreEpaForms[0].savedAt = "2026-08-14T10:00:00.000Z";
const newerShared = cloned(newerBase);
newerShared.periods[0].assessments.r1.coreEpaForms[0].learnerAdvice = "較新 FTP 值";
newerShared.periods[0].assessments.r1.coreEpaForms[0].savedAt = "2026-08-14T10:06:00.001Z";
const newerMerge = mergeCore.mergeSharedStates(newerBase, newerLocal, newerShared);
assert.equal(newerMerge.conflicts.length, 0, "同欄位修改相差超過五分鐘時應自動採較新版本");
assert.equal(newerMerge.state.periods[0].assessments.r1.coreEpaForms[0].learnerAdvice, "較新 FTP 值", "超過五分鐘應採時間較新的 FTP 欄位");

const closeShared = cloned(newerShared);
closeShared.periods[0].assessments.r1.coreEpaForms[0].savedAt = "2026-08-14T10:05:00.000Z";
const closeMerge = mergeCore.mergeSharedStates(newerBase, newerLocal, closeShared);
assert.equal(closeMerge.conflicts.length, 1, "同欄位修改剛好相差五分鐘仍應要求人工選擇");
assert.match(closeMerge.conflicts[0].path, /learnerAdvice$/, "衝突應精確定位到同一個實際欄位");
const resolvedCloseMerge = mergeCore.mergeSharedStates(newerBase, newerLocal, closeShared, { [closeMerge.conflicts[0].path]: "local" });
assert.equal(resolvedCloseMerge.conflicts.length, 0, "人工選擇後應可完成合併");
assert.equal(resolvedCloseMerge.state.periods[0].assessments.r1.coreEpaForms[0].learnerAdvice, "較舊本機值", "應套用使用者選擇的本機欄位");

const clearLocal = cloned(newerBase);
clearLocal.periods[0].assessments.r1.coreEpaForms[0].learnerAdvice = "";
clearLocal.periods[0].assessments.r1.coreEpaForms[0].savedAt = "2026-08-14T10:10:00.000Z";
const clearShared = cloned(newerBase);
clearShared.periods[0].assessments.r1.coreEpaForms[0].learnerAdvice = "FTP 非空值";
clearShared.periods[0].assessments.r1.coreEpaForms[0].savedAt = "2026-08-14T10:01:00.000Z";
const clearMerge = mergeCore.mergeSharedStates(newerBase, clearLocal, clearShared);
assert.equal(clearMerge.state.periods[0].assessments.r1.coreEpaForms[0].learnerAdvice, "", "明確清空且時間較新超過五分鐘時應允許空值勝出");

const lockedBase = mergeState(null);
lockedBase.periods[0].assessments.r1.sixCoreForms = [{
  id: "six-core-1", assessmentDate: "2026-08-14", createdAt: "2026-08-14T08:00:00.000Z",
  student: { levels: [1, 1, 1, 1, 1, 1], submittedAt: "2026-08-14T08:30:00.000Z" },
  teacher: null
}];
const lockedLocal = cloned(lockedBase);
lockedLocal.periods[0].assessments.r1.sixCoreForms[0].student.levels[0] = 2;
lockedLocal.periods[0].assessments.r1.sixCoreForms[0].student.updatedAt = "2026-08-14T09:00:00.000Z";
const lockedShared = cloned(lockedBase);
lockedShared.periods[0].assessments.r1.sixCoreForms[0].student.levels[0] = 3;
lockedShared.periods[0].assessments.r1.sixCoreForms[0].student.updatedAt = "2026-08-14T11:00:00.000Z";
const lockedMerge = mergeCore.mergeSharedStates(lockedBase, lockedLocal, lockedShared);
assert.equal(lockedMerge.conflicts.length, 1, "已提交評分即使修改時間相差超過五分鐘也不得靜默覆蓋");
assert.equal(lockedMerge.conflicts[0].locked, true, "已提交評分的衝突應標記為需要管理密碼");

const submittedCoreEPA = {
  ...coreForm,
  teacherName: "教師甲",
  submittedAt: "2026-08-14T09:00:00.000Z",
  savedAt: "2026-08-14T09:00:00.000Z",
  levels: Array(11).fill("3")
};
const lockedCoreEPABase = mergeState(submittedCoreEPA);
const lockedCoreEPALocal = cloned(lockedCoreEPABase);
lockedCoreEPALocal.periods[0].assessments.r1.coreEpaForms[0].levels[0] = "4";
lockedCoreEPALocal.periods[0].assessments.r1.coreEpaForms[0].updatedAt = "2026-08-14T10:00:00.000Z";
const lockedCoreEPAShared = cloned(lockedCoreEPABase);
lockedCoreEPAShared.periods[0].assessments.r1.coreEpaForms[0].levels[0] = "5";
lockedCoreEPAShared.periods[0].assessments.r1.coreEpaForms[0].updatedAt = "2026-08-14T11:00:00.000Z";
const lockedCoreEPAMerge = mergeCore.mergeSharedStates(lockedCoreEPABase, lockedCoreEPALocal, lockedCoreEPAShared);
assert.equal(lockedCoreEPAMerge.conflicts.length, 1, "已提交 Core EPA 的雙邊修改不得依時間靜默覆蓋");
assert.equal(lockedCoreEPAMerge.conflicts[0].locked, true, "已提交 Core EPA 的衝突應要求管理密碼");

const originalAudit = { id: "audit-original", type: "submission", occurredAt: "2026-08-14T08:30:00.000Z" };
const localAudit = { id: "audit-local", type: "unlock", occurredAt: "2026-08-14T09:00:00.000Z" };
const sharedAudit = { id: "audit-shared", type: "submission", occurredAt: "2026-08-14T09:01:00.000Z" };
const auditBase = mergeState(null, [originalAudit]);
const auditLocal = mergeState(null, [localAudit]);
const auditShared = mergeState(null, [originalAudit, sharedAudit]);
const auditMerge = mergeCore.mergeSharedStates(auditBase, auditLocal, auditShared);
assert.deepEqual(auditMerge.state.auditLog.map((event) => event.id), ["audit-original", "audit-local", "audit-shared"], "稽核事件應採不可刪除的聯集合併");

function extractFunction(name) {
  const match = scripts[0][1].match(new RegExp(`    (?:async )?function ${name}\\([\\s\\S]*?\\n    \\}`));
  assert.ok(match, `應可抽取 ${name} 做實際邏輯驗證`);
  return match[0];
}

const migratedCoreEPATimestamp = new Function(`
  const CORE_EPA_ITEMS = Array.from({ length: 11 });
  const localDateValue = () => "2026-08-14";
  ${extractFunction("migrateCoreEPAForm")}
  return migrateCoreEPAForm({
    id: "core-epa-test", assessmentDate: "2026-08-14",
    createdAt: "2026-08-14T08:00:00.000Z", savedAt: "2026-08-14T09:00:00.000Z",
    updatedAt: "2026-08-14T10:04:00.000Z", levels: Array(11).fill(""),
    learnerAdvice: "", mentorAdvice: "", programAdvice: ""
  }, { id: "p1", createdAt: "2026-08-14T08:00:00.000Z" }, { id: "r1" }, 0).updatedAt;
`)();
assert.equal(migratedCoreEPATimestamp, "2026-08-14T10:04:00.000Z", "Core EPA 合併選擇的修改時間在重新載入後仍應保留");

assert.doesNotMatch(extractFunction("renamePeriod"), /password|addAuditEvent/, "更改期別名稱不得要求密碼或新增稽核事件");
assert.doesNotMatch(extractFunction("openSharedDataFile"), /requestPermission/, "共用資料夾流程不得額外要求會失去使用者手勢的權限");
assert.match(extractFunction("openNetworkSharedDataFile"), /requestPermission\(\{ mode: "readwrite" \}\)/, "FTP JSON 應在同一開檔流程要求 readwrite 權限");

const persistSignal = new Function(`
  const state = { marker: "changed" };
  let scheduledOptions = null;
  const localStorage = { setItem() {} };
  const scheduleSharedFileWrite = (options) => { scheduledOptions = options; };
  const showToast = () => {};
  const console = { error() {} };
  const STORAGE_KEY = "test";
  ${extractFunction("persist")}
  const saved = persist();
  return { saved, scheduledOptions };
`)();
assert.deepEqual(persistSignal, {
  saved: true, scheduledOptions: { explicit: true }
}, "表單暫存、提交及名單變更的 persist 應把 FTP JSON 視為明確存檔動作");

const sharedGateModes = new Function(`
  let sharedFileMode = "locked";
  let gateCount = 0;
  const statuses = [];
  const progress = [];
  const window = {
    location: { protocol: "https:", hostname: "" },
    isSecureContext: true,
    showDirectoryPicker() {},
    showOpenFilePicker() {}
  };
  window.self = window;
  window.top = window;
  const elements = {
    openSharedFileButton: { hidden: false },
    sharedFileBackupButton: { hidden: false },
    openNetworkSharedFileButton: { hidden: false },
    fallbackSharedFileButton: { hidden: false },
    sharedFileCompatibility: { hidden: false },
    sharedFileDialogTitle: { textContent: "" },
    sharedFileDialogIntro: { textContent: "" },
    closeSharedFileDialogButton: { hidden: true },
    sharedFileDialog: { open: false, close() { this.open = false; } }
  };
  const setSharedFileDialogProgress = (message, state) => progress.push({ message, state });
  const setSharedFileStatus = (status, message) => statuses.push({ status, message });
  let gateMessage = "";
  const showSharedFileGate = (message = "") => { gateCount += 1; gateMessage = message; };
  ${extractFunction("isRemoteHTMLLaunch")}
  ${extractFunction("canUseDirectoryAccess")}
  ${extractFunction("canUseNetworkFileAccess")}
  ${extractFunction("initializeSharedDataGate")}
  initializeSharedDataGate();
  const hosted = { sharedFileMode, gateCount, status: statuses.at(-1), closeHidden: elements.closeSharedFileDialogButton.hidden };
  window.location.protocol = "file:";
  sharedFileMode = "preview";
  gateCount = 0;
  initializeSharedDataGate();
  const localFile = { sharedFileMode, gateCount, status: statuses.at(-1), closeHidden: elements.closeSharedFileDialogButton.hidden };
  window.location.hostname = "10.200.1.34";
  gateCount = 0;
  gateMessage = "";
  initializeSharedDataGate();
  const remoteFile = { sharedFileMode, gateCount, title: elements.sharedFileDialogTitle.textContent, gateMessage };
  return { hosted, localFile, remoteFile };
`)();
assert.deepEqual(sharedGateModes.hosted, {
  sharedFileMode: "preview", gateCount: 0, status: { status: "local", message: "瀏覽器本機模式" }, closeHidden: false
}, "HTTPS 公開預覽啟動時不得強制開啟共用資料夾");
assert.deepEqual(sharedGateModes.localFile, {
  sharedFileMode: "locked", gateCount: 1, status: { status: "locked", message: "待連結 JSON" }, closeHidden: true
}, "file:// 院內版本仍應強制連結共用 JSON");
assert.equal(sharedGateModes.remoteFile.sharedFileMode, "locked", "FTP／UNC 上的 HTML 必須保持鎖定");
assert.equal(sharedGateModes.remoteFile.gateCount, 1, "FTP／UNC 上的 HTML 應顯示阻擋畫面");
assert.match(sharedGateModes.remoteFile.title, /複製到本機/, "FTP／UNC 上的 HTML 應以標題提示複製本機");
assert.match(sharedGateModes.remoteFile.gateMessage, /本機資料夾/, "FTP／UNC 上的 HTML 應說明可使用的本機路徑");

const backupLogic = new Function(`
  const DATA_BACKUP_APP = "DocCCC";
  const DATA_BACKUP_VERSION = 1;
  const SCHEMA_VERSION = 13;
  const RESIDENT_LEVELS = ["R1", "R2", "R3", "R4"];
  const ITEM_MAX_SCORE = 5;
  const ITEM_NOT_APPLICABLE = "NA";
  const COMPETENCIES = Array.from({ length: 6 }, () => ({}));
  const ASSESSMENT_ITEMS = Array.from({ length: 20 }, () => ({}));
  const CORE_EPA_ITEMS = Array.from({ length: 11 }, (_, index) => ({ code: "EPA" + (index + 1) }));
  const CORE_EPA_LEVEL_OPTIONS = [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["not-assessed", "未評量"]];
  const migrateState = (saved) => saved ? { ...saved, schemaVersion: SCHEMA_VERSION } : null;
  ${extractFunction("createDataBackup")}
  ${extractFunction("validDataBackupState")}
  ${extractFunction("parseDataBackup")}
  return { createDataBackup, parseDataBackup };
`)();
const backupState = {
  schemaVersion: 13,
  periods: [{
    id: "period-1", name: "2026 年第 2 期", residents: [{ id: "r1", level: "R1", name: "測試醫師" }],
    assessments: { r1: {
      sixCoreForms: [{
        id: "six-core-1", assessmentDate: "2026-08-10", createdAt: "2026-08-10T06:30:00.000Z",
        student: { levels: [3, 3, 3, 3, 3, 3], submittedAt: "2026-08-10T07:00:00.000Z" }, teacher: null
      }],
      cccDraft: { comments: "保留草稿" },
      coreEpaForms: [{
        id: "core-epa-1", assessmentDate: "2026-08-10", createdAt: "2026-08-10T07:00:00.000Z",
        levels: ["4", "4", "4", "3", "3", "3", "2", "2", "2", "2", "2"],
        learnerAdvice: "持續精進", mentorAdvice: "", programAdvice: "", savedAt: "2026-08-10T07:30:00.000Z"
      }]
    } }
  }],
  selectedPeriodId: "period-1",
  auditLog: [{ type: "submission", role: "student", periodName: "2026 年第 2 期", occurredAt: "2026-08-10T07:00:00.000Z" }]
};
const backupPayload = backupLogic.createDataBackup(backupState, "2026-08-10T08:00:00.000Z");
assert.equal(backupPayload.app, "DocCCC", "完整備份應帶有 DocCCC 格式識別");
assert.equal(backupPayload.backupVersion, 1, "完整備份應帶有獨立格式版本");
assert.equal(backupPayload.exportedAt, "2026-08-10T08:00:00.000Z", "完整備份應記錄匯出時間");
assert.deepEqual(backupPayload.data, backupState, "完整備份應包含期別、名單、評分、草稿與稽核狀態");
assert.deepEqual(backupLogic.parseDataBackup(JSON.stringify(backupPayload)), backupState, "有效備份應可在另一個瀏覽器還原完整狀態");
assert.equal(
  backupLogic.parseDataBackup(JSON.stringify(backupPayload)).periods[0].assessments.r1.coreEpaForms[0].levels[0],
  "4",
  "完整備份應在另一個瀏覽器還原 Core EPAs 草稿"
);
const preCoreEpaBackup = structuredClone(backupPayload);
preCoreEpaBackup.schemaVersion = 7;
preCoreEpaBackup.data.schemaVersion = 7;
delete preCoreEpaBackup.data.periods[0].assessments.r1.coreEpaForms;
assert.equal(backupLogic.parseDataBackup(JSON.stringify(preCoreEpaBackup)).schemaVersion, 13, "舊備份應可遷移到目前 schema v13");
const deletionAuditBackup = structuredClone(backupPayload);
deletionAuditBackup.data.auditLog.push({ type: "period-deletion", role: null, periodName: "已刪除期別", occurredAt: "2026-08-10T08:30:00.000Z" });
assert.equal(backupLogic.parseDataBackup(JSON.stringify(deletionAuditBackup)).auditLog.at(-1).type, "period-deletion", "含期別刪除事件的備份應可還原");
assert.throws(() => backupLogic.parseDataBackup("{}"), /有效的 DocCCC 備份/, "不得匯入其他 JSON 檔案");
assert.throws(
  () => backupLogic.parseDataBackup(JSON.stringify({ ...backupPayload, schemaVersion: 14 })),
  /較新版 DocCCC/,
  "不得用舊版網頁匯入較新 schema 的備份"
);
const unsafeBackup = structuredClone(backupPayload);
unsafeBackup.data.periods[0].residents[0].id = 'r1" onclick="alert(1)';
assert.throws(() => backupLogic.parseDataBackup(JSON.stringify(unsafeBackup)), /格式不正確/, "匯入時應拒絕不安全的資料識別碼");
const invalidCoreEpaBackup = structuredClone(backupPayload);
invalidCoreEpaBackup.data.periods[0].assessments.r1.coreEpaForms[0].levels[0] = "6";
assert.throws(() => backupLogic.parseDataBackup(JSON.stringify(invalidCoreEpaBackup)), /格式不正確/, "匯入時應拒絕超出 1–5 的 Core EPA 信賴程度");

const migratedLegacyAssessment = new Function(`
  const SCHEMA_VERSION = 13;
  const RESIDENT_LEVELS = ["R1", "R2", "R3", "R4"];
  const ITEM_MAX_SCORE = 5;
  const ITEM_NOT_APPLICABLE = "NA";
  const defaultResidents = () => [];
  const legacyAuditEvents = () => [];
  const CORE_EPA_ITEMS = Array.from({ length: 11 });
  ${extractFunction("localDateValue")}
  ${extractFunction("copyResidents")}
  ${extractFunction("normalizeItemScore")}
  ${extractFunction("migrateItemScores")}
  ${extractFunction("migrateSixCoreScoreRecord")}
  ${extractFunction("inferredSixCoreDate")}
  ${extractFunction("migrateCoreEPAForm")}
  ${extractFunction("migrateResidentAssessment")}
  ${extractFunction("migrateState")}
  const saved = {
    schemaVersion: 8,
    periods: [{
      id: "p1", name: "舊期別", createdAt: "2026-01-01T00:00:00.000Z",
      residents: [{ id: "r1", level: "R1", name: "測試" }, { id: "r2", level: "R2", name: "空白" }],
      assessments: {
        r1: {
          student: { levels: [3, 3, 3, 3, 3, 3], submittedAt: "2026-01-10T01:00:00.000Z" },
          teacher: { levels: [4, 4, 4, 4, 4, 4], itemScores: [0, ...Array(19).fill(4)], teacherName: "教師", submittedAt: "2026-01-11T01:00:00.000Z" },
          cccDraft: { comments: "保留" },
          coreEpaDraft: {
            traineeType: "pgy1", assessmentDate: "2026-01-09", levels: ["4", "4", "4", "3", "3", "3", "2", "2", "2", "2", "2"],
            learnerAdvice: "保留建議", mentorAdvice: "導師建議", programAdvice: "科部建議", savedAt: "2026-01-09T02:00:00.000Z"
          }
        },
        r2: { student: null, teacher: null }
      }
    }],
    selectedPeriodId: "p1", auditLog: []
  };
  return migrateState(saved);
`)();
const migratedR1 = migratedLegacyAssessment.periods[0].assessments.r1;
assert.equal(migratedLegacyAssessment.schemaVersion, 13, "schema v8 應遷移至 v13");
assert.equal(migratedR1.sixCoreForms.length, 1, "舊版每人單張評核應轉成一張六大核心表單");
assert.equal(migratedR1.sixCoreForms[0].assessmentDate, "2026-01-11", "舊評核日期應優先取教師提交日期");
assert.equal(migratedR1.sixCoreForms[0].assignedTeacherName, "教師", "舊六大核心表單應從實際評分教師推定指定教師");
assert.equal(migratedR1.sixCoreForms[0].teacher.itemScores[0], "NA", "歷史 0 分應在遷移時一律改為 N/A");
assert.equal("student" in migratedR1, false, "遷移後不得保留會造成雙重來源的頂層學生資料");
assert.equal(migratedR1.cccDraft.comments, "保留", "遷移多表單時不得遺失 CCC 草稿");
assert.equal(migratedR1.coreEpaForms.length, 1, "舊版單一 Core EPA 草稿應轉成第一張表單");
assert.equal(migratedR1.coreEpaForms[0].assessmentDate, "2026-01-09", "Core EPA 遷移應保留評量日期");
assert.equal(migratedR1.coreEpaForms[0].learnerAdvice, "保留建議", "Core EPA 遷移不得遺失建議內容");
assert.equal("traineeType" in migratedR1.coreEpaForms[0], false, "遷移後應移除不再使用的學員類別");
assert.equal("coreEpaDraft" in migratedR1, false, "遷移後不得保留單一 Core EPA 舊欄位");
assert.equal(migratedLegacyAssessment.periods[0].assessments.r2.sixCoreForms.length, 0, "舊版空白人員不得產生幽靈表單");
assert.equal(migratedLegacyAssessment.periods[0].assessments.r2.coreEpaForms.length, 0, "舊版空白人員不得產生 Core EPA 幽靈表單");

const replacedBackupState = new Function(`
  let state = { marker: "old" };
  let selectedCCCResidentId = "old-resident";
  let selectedCoreEPAResidentId = "old-core-epa-resident";
  let selectedCoreEPAFormId = "old-core-epa-form";
  let activeScoreContext = { open: true };
  let activeModifyContext = { open: true };
  let activeDeletePeriodId = "old-period";
  let activeRenamePeriodId = "old-period";
  let auditUnlocked = true;
  let persistCount = 0;
  let renderCount = 0;
  const persist = () => { persistCount += 1; return true; };
  const render = () => { renderCount += 1; };
  ${extractFunction("replaceStateFromBackup")}
  const importedState = { marker: "imported" };
  const replaced = replaceStateFromBackup(importedState);
  return { state, importedState, selectedCCCResidentId, selectedCoreEPAResidentId, selectedCoreEPAFormId, activeScoreContext, activeModifyContext, activeDeletePeriodId, activeRenamePeriodId, auditUnlocked, persistCount, renderCount, replaced };
`)();
assert.equal(replacedBackupState.replaced, true, "有效匯入應回報已完成取代");
assert.strictEqual(replacedBackupState.state, replacedBackupState.importedState, "匯入應以備份完整取代目前瀏覽器狀態");
assert.equal(replacedBackupState.persistCount, 1, "匯入資料應寫入瀏覽器儲存一次");
assert.equal(replacedBackupState.renderCount, 1, "匯入完成後應重新渲染畫面");
assert.equal(replacedBackupState.selectedCCCResidentId, null, "匯入後應清除舊瀏覽器的 CCC 人員選取狀態");
assert.equal(replacedBackupState.selectedCoreEPAResidentId, null, "匯入後應清除舊瀏覽器的 Core EPAs 人員選取狀態");
assert.equal(replacedBackupState.selectedCoreEPAFormId, null, "匯入後應清除舊瀏覽器的 Core EPA 表單選取狀態");
assert.equal(replacedBackupState.activeScoreContext, null, "匯入後應清除舊評分操作狀態");
assert.equal(replacedBackupState.activeModifyContext, null, "匯入後應清除舊修改操作狀態");
assert.equal(replacedBackupState.activeDeletePeriodId, null, "匯入後應清除舊期別刪除操作狀態");
assert.equal(replacedBackupState.activeRenamePeriodId, null, "匯入後應清除舊期別重新命名狀態");
assert.equal(replacedBackupState.auditUnlocked, false, "匯入後應重新鎖定稽核紀錄頁");

const rejectedBackupReplacement = new Function(`
  let state = { marker: "old" };
  let selectedCCCResidentId = "old-resident";
  let selectedCoreEPAResidentId = "old-core-epa-resident";
  let selectedCoreEPAFormId = "old-core-epa-form";
  let activeScoreContext = { open: true };
  let activeModifyContext = { open: true };
  let renderCount = 0;
  const persist = () => false;
  const render = () => { renderCount += 1; };
  ${extractFunction("replaceStateFromBackup")}
  const replaced = replaceStateFromBackup({ marker: "imported" });
  return { state, selectedCCCResidentId, selectedCoreEPAResidentId, selectedCoreEPAFormId, renderCount, replaced };
`)();
assert.equal(rejectedBackupReplacement.replaced, false, "瀏覽器無法保存時不得誤報匯入成功");
assert.equal(rejectedBackupReplacement.state.marker, "old", "匯入寫入失敗時應保留原本資料");
assert.equal(rejectedBackupReplacement.selectedCCCResidentId, "old-resident", "匯入失敗時不得清除目前操作狀態");
assert.equal(rejectedBackupReplacement.selectedCoreEPAResidentId, "old-core-epa-resident", "匯入失敗時不得清除 Core EPAs 操作狀態");
assert.equal(rejectedBackupReplacement.selectedCoreEPAFormId, "old-core-epa-form", "匯入失敗時不得清除 Core EPA 表單選取狀態");
assert.equal(rejectedBackupReplacement.renderCount, 0, "匯入失敗時不得渲染未保存的備份資料");

const importHandlerResult = await new Function(`
  let importedState = null;
  let confirmation = "";
  let toast = "";
  const MAX_DATA_FILE_BYTES = 20 * 1024 * 1024;
  const parseDataBackup = JSON.parse;
  const replaceStateFromBackup = (value) => { importedState = value; return true; };
  const window = { confirm(message) { confirmation = message; return true; } };
  const showToast = (message) => { toast = message; };
  const console = { error() {} };
  ${extractFunction("importDataBackup")}
  const target = {
    value: "selected",
    files: [{
      name: "DocCCC_完整備份.json",
      size: 1024,
      async text() { return JSON.stringify({ periods: [{ residents: [{}, {}] }, { residents: [{}] }] }); }
    }]
  };
  return importDataBackup({ target }).then(() => ({ importedState, confirmation, toast, inputValue: target.value }));
`)();
assert.equal(importHandlerResult.importedState.periods.length, 2, "確認匯入後應交由完整狀態取代流程處理");
assert.match(importHandlerResult.confirmation, /2 個期別、3 筆名單資料/, "匯入確認應顯示即將取代的資料筆數");
assert.match(importHandlerResult.toast, /已匯入 2 個期別/, "匯入完成後應回報結果");
assert.equal(importHandlerResult.inputValue, "", "每次匯入後應清空檔案欄位以允許重選同一檔案");

const sharedWriteResult = await new Function(`
  const MAX_DATA_FILE_BYTES = 20 * 1024 * 1024;
  const state = { marker: "new-shared-state" };
  let fileText = '{"marker":"old-shared-state"}';
  let pendingText = "";
  let writeCount = 0;
  let sharedFileBaselineText = fileText;
  let sharedFileBaselineState = null;
  let sharedFileDirty = true;
  let sharedFileConflict = false;
  let sharedFileWriteError = false;
  let sharedFileMode = "direct";
  const sharedFileHandle = {
    async queryPermission() { return "granted"; },
    async getFile() { return { size: fileText.length, async text() { return fileText; } }; },
    async createWritable() {
      writeCount += 1;
      return { async write(value) { pendingText = value; }, async close() { fileText = pendingText; } };
    }
  };
  const statuses = [];
  let gateMessage = "";
  let toast = "";
  const setSharedFileStatus = (status, message) => statuses.push({ status, message });
  const showSharedFileGate = (message) => { gateMessage = message; };
  const showToast = (message) => { toast = message; };
  const sharedFileSyncTime = () => "12:34:56";
  const createDataBackup = (sourceState) => ({ app: "DocCCC", data: sourceState });
  const cloneMergeValue = (value) => JSON.parse(JSON.stringify(value));
  const MAX_MERGE_WRITE_ATTEMPTS = 3;
  const reconcileSharedFileChanges = async () => ({ merged: true });
  const console = { error() {} };
  ${extractFunction("readSharedDataFile")}
  ${extractFunction("flushSharedFileWrites")}
  return flushSharedFileWrites().then((saved) => ({
    saved, fileText, writeCount, sharedFileBaselineText, sharedFileDirty,
    sharedFileConflict, sharedFileWriteError, statuses, gateMessage, toast
  }));
`)();
assert.equal(sharedWriteResult.saved, true, "共用 JSON 寫入及讀回驗證成功時應回報完成");
assert.equal(sharedWriteResult.writeCount, 1, "一次資料變更應覆寫同一個共用檔案一次");
assert.equal(JSON.parse(sharedWriteResult.fileText).data.marker, "new-shared-state", "共用 JSON 應保存最新應用程式狀態");
assert.equal(sharedWriteResult.sharedFileBaselineText, sharedWriteResult.fileText, "成功寫入後應以讀回內容更新衝突基準");
assert.equal(sharedWriteResult.sharedFileDirty, false, "成功寫入後不應保留未同步標記");
assert.equal(sharedWriteResult.sharedFileConflict, false, "正常寫入不應誤報資料衝突");
assert.equal(sharedWriteResult.statuses.at(-1).status, "saved", "成功寫入後右上角應顯示已同步");

const sharedConflictResult = await new Function(`
  const MAX_DATA_FILE_BYTES = 20 * 1024 * 1024;
  let state = { marker: "local-change" };
  let fileText = '{"marker":"other-computer-change"}';
  let pendingText = "";
  let writeCount = 0;
  let sharedFileBaselineText = '{"marker":"original"}';
  let sharedFileBaselineState = { marker: "original" };
  let sharedFileDirty = true;
  let sharedFileConflict = false;
  let sharedFileWriteError = false;
  let sharedFileMode = "direct";
  const sharedFileHandle = {
    async queryPermission() { return "granted"; },
    async getFile() { return { size: fileText.length, async text() { return fileText; } }; },
    async createWritable() {
      writeCount += 1;
      return { async write(value) { pendingText = value; }, async close() { fileText = pendingText; } };
    }
  };
  const statuses = [];
  let gateMessage = "";
  const setSharedFileStatus = (status, message) => statuses.push({ status, message });
  const showSharedFileGate = (message) => { gateMessage = message; };
  const showToast = () => {};
  const sharedFileSyncTime = () => "12:34:56";
  const createDataBackup = (sourceState) => ({ app: "DocCCC", data: sourceState });
  const cloneMergeValue = (value) => JSON.parse(JSON.stringify(value));
  const MAX_MERGE_WRITE_ATTEMPTS = 3;
  const reconcileSharedFileChanges = async (currentText) => {
    state = { marker: "merged-local-and-shared" };
    sharedFileBaselineText = currentText;
    sharedFileBaselineState = { marker: "other-computer-change" };
    return { merged: true };
  };
  const console = { error() {} };
  ${extractFunction("readSharedDataFile")}
  ${extractFunction("flushSharedFileWrites")}
  return flushSharedFileWrites().then((saved) => ({ saved, fileText, writeCount, sharedFileDirty, sharedFileConflict, statuses, gateMessage, state }));
`)();
assert.equal(sharedConflictResult.saved, true, "共用檔案已被其他電腦更新時應先合併再完成儲存");
assert.equal(sharedConflictResult.writeCount, 1, "三方合併完成後應寫入一次合併結果");
assert.equal(sharedConflictResult.sharedFileDirty, false, "合併並寫回成功後不應保留未同步標記");
assert.equal(sharedConflictResult.sharedFileConflict, false, "可安全合併的更新不應鎖成資料衝突");
assert.equal(sharedConflictResult.statuses.at(-1).status, "saved", "合併成功後右上角應回到已同步");
assert.equal(sharedConflictResult.state.marker, "merged-local-and-shared", "寫回前應套用合併後的本機狀態");

const sharedWriteScheduling = new Function(`
  let sharedFileMode = "network-file";
  let sharedFileDirty = false;
  let sharedFileConflict = false;
  let sharedFileWriteError = false;
  let startCount = 0;
  const statuses = [];
  const setSharedFileStatus = (status, message) => statuses.push({ status, message });
  const startSharedFileWrite = () => { startCount += 1; };
  ${extractFunction("scheduleSharedFileWrite")}
  scheduleSharedFileWrite();
  const networkImplicit = { startCount, dirty: sharedFileDirty, status: statuses.at(-1) };
  scheduleSharedFileWrite({ explicit: true });
  const networkExplicit = { startCount, dirty: sharedFileDirty, status: statuses.at(-1) };
  sharedFileMode = "direct";
  scheduleSharedFileWrite();
  const folderAutomatic = { startCount, dirty: sharedFileDirty, status: statuses.at(-1) };
  return { networkImplicit, networkExplicit, folderAutomatic };
`)();
assert.deepEqual(sharedWriteScheduling.networkImplicit, {
  startCount: 0, dirty: true, status: { status: "dirty", message: "待儲存 JSON" }
}, "FTP JSON 的非正式狀態變更只應標記待儲存，不得自行覆寫");
assert.equal(sharedWriteScheduling.networkExplicit.startCount, 1, "FTP JSON 的暫存、提交或明確儲存應啟動寫回");
assert.equal(sharedWriteScheduling.folderAutomatic.startCount, 2, "共用資料夾模式仍應自動同步");

const beforeUnloadResult = new Function(`
  let sharedFileDirty = true;
  let sharedFileWritePromise = null;
  ${extractFunction("warnIfSharedFileUnsynced")}
  const dirtyEvent = { prevented: false, returnValue: null, preventDefault() { this.prevented = true; } };
  warnIfSharedFileUnsynced(dirtyEvent);
  sharedFileDirty = false;
  const cleanEvent = { prevented: false, returnValue: null, preventDefault() { this.prevented = true; } };
  warnIfSharedFileUnsynced(cleanEvent);
  return { dirtyEvent, cleanEvent };
`)();
assert.equal(beforeUnloadResult.dirtyEvent.prevented, true, "尚未同步時關閉網頁應請瀏覽器顯示警告");
assert.equal(beforeUnloadResult.cleanEvent.prevented, false, "已同步時不應干擾正常關閉網頁");

const renamedPeriod = new Function(`
  let state = {
    periods: [
      { id: "p1", name: "2026 年第 1 期", residents: [{ id: "r1" }], assessments: { r1: { student: {} } } },
      { id: "p2", name: "2026 年第 2 期", residents: [], assessments: {} }
    ],
    selectedPeriodId: "p1",
    auditLog: [{ id: "existing-audit" }]
  };
  let activeRenamePeriodId = "p1";
  let persistCount = 0;
  let renderCount = 0;
  const residentsBefore = state.periods[0].residents;
  const assessmentsBefore = state.periods[0].assessments;
  const auditBefore = state.auditLog;
  const elements = {
    renamePeriodName: { value: "2026 年第 2 期", selectCount: 0, focusCount: 0, select() { this.selectCount += 1; }, focus() { this.focusCount += 1; } },
    renamePeriodDialog: { closeCount: 0, close() { this.closeCount += 1; } },
    renamePeriodForm: { resetCount: 0, reset() { this.resetCount += 1; } }
  };
  const persist = () => { persistCount += 1; return true; };
  const render = () => { renderCount += 1; };
  const showToast = () => {};
  ${extractFunction("renamePeriod")}
  renamePeriod({ preventDefault() {} });
  const afterDuplicate = { name: state.periods[0].name, persistCount, auditCount: state.auditLog.length };
  elements.renamePeriodName.value = "  2026 年上半年  ";
  renamePeriod({ preventDefault() {} });
  return {
    state, persistCount, renderCount, afterDuplicate,
    sameResidents: state.periods[0].residents === residentsBefore,
    sameAssessments: state.periods[0].assessments === assessmentsBefore,
    sameAuditLog: state.auditLog === auditBefore
  };
`)();
assert.deepEqual(renamedPeriod.afterDuplicate, { name: "2026 年第 1 期", persistCount: 0, auditCount: 1 }, "重新命名不得接受與其他期別重複的名稱");
assert.equal(renamedPeriod.state.periods[0].name, "2026 年上半年", "重新命名應整理空白並更新目前期別名稱");
assert.equal(renamedPeriod.state.periods[1].name, "2026 年第 2 期", "重新命名不得影響其他期別");
assert.equal(renamedPeriod.state.selectedPeriodId, "p1", "重新命名後應維持目前選取期別");
assert.equal(renamedPeriod.sameResidents, true, "重新命名不得重建或修改名單快照");
assert.equal(renamedPeriod.sameAssessments, true, "重新命名不得重建或修改評核資料");
assert.equal(renamedPeriod.sameAuditLog, true, "重新命名不得改寫稽核紀錄陣列");
assert.equal(renamedPeriod.state.auditLog.length, 1, "重新命名不得新增稽核事件");
assert.equal(renamedPeriod.persistCount, 1, "有效的新名稱應持久化一次");
assert.equal(renamedPeriod.renderCount, 1, "重新命名完成後應重新渲染一次");

const deletedPeriod = new Function(`
  const ADMIN_PASSWORD = "tsgh123";
  let state = {
    periods: [
      {
        id: "p1", name: "2026 年第 1 期", residents: [{ id: "r1", level: "R1", name: "測試醫師" }],
        assessments: { r1: { sixCoreForms: [{ id: "f1", student: {}, teacher: {}, teacherDraft: {} }], cccDraft: {}, cccSubmission: {}, coreEpaForms: [{ id: "e1" }, { id: "e2" }] } }
      },
      { id: "p2", name: "2026 年第 2 期", residents: [], assessments: {} }
    ],
    selectedPeriodId: "p1",
    auditLog: [{ id: "existing-audit", type: "submission" }]
  };
  let activeDeletePeriodId = "p1";
  let selectedCCCResidentId = "r1";
  let selectedCoreEPAResidentId = "r1";
  let selectedCoreEPAFormId = "e1";
  let persistCount = 0;
  let renderCount = 0;
  const toasts = [];
  const elements = {
    deletePeriodPassword: { value: "wrong", selectCount: 0, select() { this.selectCount += 1; } },
    deletePeriodDialog: { closeCount: 0, close() { this.closeCount += 1; } },
    deletePeriodForm: { resetCount: 0, reset() { this.resetCount += 1; } }
  };
  const persist = () => { persistCount += 1; return true; };
  const render = () => { renderCount += 1; };
  const showToast = (message) => { toasts.push(message); };
  ${extractFunction("sixCoreFormsFor")}
  ${extractFunction("coreEpaFormsFor")}
  ${extractFunction("addAuditEvent")}
  ${extractFunction("periodAuditSummary")}
  ${extractFunction("deletePeriod")}
  deletePeriod({ preventDefault() {} });
  const afterWrongPassword = { periodCount: state.periods.length, auditCount: state.auditLog.length, persistCount };
  elements.deletePeriodPassword.value = ADMIN_PASSWORD;
  deletePeriod({ preventDefault() {} });
  activeDeletePeriodId = "p2";
  deletePeriod({ preventDefault() {} });
  const afterLastPeriodAttempt = { periodCount: state.periods.length, auditCount: state.auditLog.length, persistCount };
  return { state, selectedCCCResidentId, selectedCoreEPAResidentId, selectedCoreEPAFormId, persistCount, renderCount, elements, toasts, afterWrongPassword, afterLastPeriodAttempt };
`)();
assert.deepEqual(deletedPeriod.afterWrongPassword, { periodCount: 2, auditCount: 1, persistCount: 0 }, "錯誤管理密碼不得刪除期別或新增稽核事件");
assert.deepEqual(deletedPeriod.state.periods.map((period) => period.id), ["p2"], "正確管理密碼應只刪除指定期別");
assert.equal(deletedPeriod.state.selectedPeriodId, "p2", "刪除目前期別後應選取相鄰期別");
assert.equal(deletedPeriod.state.auditLog[0].id, "existing-audit", "刪除期別不得覆蓋既有稽核紀錄");
assert.equal(deletedPeriod.state.auditLog[1].type, "period-deletion", "刪除期別後應附加專屬稽核事件");
assert.deepEqual(
  deletedPeriod.state.auditLog[1].periodSummary,
  { residentCount: 1, sixCoreFormCount: 1, studentSubmissionCount: 1, teacherSubmissionCount: 1, teacherDraftCount: 1, cccDraftCount: 1, cccSubmissionCount: 1, coreEpaFormCount: 2 },
  "期別刪除事件應保存刪除前的名單、提交與草稿數量"
);
assert.equal(deletedPeriod.selectedCCCResidentId, null, "刪除期別後應清除 CCC 人員選取狀態");
assert.equal(deletedPeriod.selectedCoreEPAResidentId, null, "刪除期別後應清除 Core EPAs 人員選取狀態");
assert.equal(deletedPeriod.selectedCoreEPAFormId, null, "刪除期別後應清除 Core EPA 表單選取狀態");
assert.equal(deletedPeriod.persistCount, 1, "成功刪除應只持久化一次");
assert.equal(deletedPeriod.renderCount, 1, "成功刪除後應重新渲染一次");
assert.deepEqual(deletedPeriod.afterLastPeriodAttempt, { periodCount: 1, auditCount: 2, persistCount: 1 }, "不得刪除最後一個期別或誤留刪除事件");

const auditUnlock = new Function(`
  const AUDIT_PASSWORD = "DOC12345";
  let auditUnlocked = false;
  let renderCount = 0;
  const toasts = [];
  const elements = {
    auditPassword: { value: "wrong", selectCount: 0, select() { this.selectCount += 1; } },
    auditAuthForm: { resetCount: 0, reset() { this.resetCount += 1; } }
  };
  const renderAudit = () => { renderCount += 1; };
  const showToast = (message) => { toasts.push(message); };
  ${extractFunction("unlockAudit")}
  unlockAudit({ preventDefault() {} });
  const wrongPasswordUnlocked = auditUnlocked;
  elements.auditPassword.value = AUDIT_PASSWORD;
  unlockAudit({ preventDefault() {} });
  return { auditUnlocked, wrongPasswordUnlocked, renderCount, elements, toasts };
`)();
assert.equal(auditUnlock.wrongPasswordUnlocked, false, "錯誤稽核密碼不得顯示稽核紀錄");
assert.equal(auditUnlock.auditUnlocked, true, "正確稽核密碼應解鎖稽核紀錄");
assert.equal(auditUnlock.renderCount, 1, "成功解鎖後才應渲染稽核紀錄");
assert.equal(auditUnlock.elements.auditAuthForm.resetCount, 1, "成功解鎖後應清除密碼欄位");

const cccMath = new Function(`
  ${extractFunction("cccScoreValue")}
  ${extractFunction("cccWeightedTotal")}
  ${extractFunction("cccWeightedContribution")}
  return { cccScoreValue, cccWeightedTotal, cccWeightedContribution };
`)();
assert.equal(cccMath.cccWeightedTotal(80, 90, 70, 100), 84, "加權總分應依 30/25/25/20 權重得到正確結果");
assert.equal(cccMath.cccWeightedTotal(80, "", 70, 100), null, "任一人工成績尚未填寫時不應顯示不完整總分");
assert.equal(cccMath.cccScoreValue(101), "", "百分制欄位不得接受超過 100 分的值");
assert.equal(cccMath.cccWeightedContribution(71, 0.3), 21.3, "71 分的核心總分乘 30% 應顯示 21.3 分加權貢獻");

const sixCoreTeacherIdentity = new Function(`
  let activeScoreContext = { role: "teacher" };
  let selectedMode = "";
  const form = { assignedTeacherName: "指定教師甲", teacherDraft: { teacherName: "暫存教師乙" } };
  const scoreControls = Array.from({ length: 26 }, () => ({ disabled: false }));
  const elements = {
    scoreForm: { elements: { teacherIdentityMode: { get value() { return selectedMode; } } } },
    teacherNameField: { hidden: true },
    teacherName: { value: "", required: false },
    scoreFields: { querySelectorAll() { return scoreControls; } },
    saveDraftButton: { disabled: false },
    submitScoreButton: { disabled: false }
  };
  const activeSixCoreForm = () => form;
  ${extractFunction("makeSixCoreForm")}
  ${extractFunction("currentSixCoreTeacherName")}
  ${extractFunction("confirmedSixCoreTeacherName")}
  ${extractFunction("refreshSixCoreTeacherIdentity")}
  const createdForm = makeSixCoreForm("2026-08-21", "指定教師甲");
  refreshSixCoreTeacherIdentity();
  const beforeConfirmation = {
    allDisabled: scoreControls.every((control) => control.disabled),
    draftDisabled: elements.saveDraftButton.disabled,
    submitDisabled: elements.submitScoreButton.disabled
  };
  selectedMode = "current";
  refreshSixCoreTeacherIdentity();
  const assignedConfirmation = {
    teacherName: confirmedSixCoreTeacherName(),
    allEnabled: scoreControls.every((control) => !control.disabled),
    draftEnabled: !elements.saveDraftButton.disabled,
    submitEnabled: !elements.submitScoreButton.disabled
  };
  selectedMode = "change";
  elements.teacherName.value = "";
  refreshSixCoreTeacherIdentity();
  const blankChangeDisabled = scoreControls.every((control) => control.disabled);
  elements.teacherName.value = "  實際教師乙  ";
  refreshSixCoreTeacherIdentity();
  return {
    createdForm, beforeConfirmation, assignedConfirmation, blankChangeDisabled,
    changedTeacherName: confirmedSixCoreTeacherName(),
    changedAllEnabled: scoreControls.every((control) => !control.disabled)
  };
`)();
assert.equal(sixCoreTeacherIdentity.createdForm.assignedTeacherName, "指定教師甲", "新建六大核心表單應保存住院醫師輸入的指定教師");
assert.deepEqual(sixCoreTeacherIdentity.beforeConfirmation, {
  allDisabled: true, draftDisabled: true, submitDisabled: true
}, "六大核心教師尚未確認身分時不得評分、暫存或提交");
assert.deepEqual(sixCoreTeacherIdentity.assignedConfirmation, {
  teacherName: "暫存教師乙", allEnabled: true, draftEnabled: true, submitEnabled: true
}, "再次開啟暫存表單時，確認目前評分教師後即應開放六大核心評分");
assert.equal(sixCoreTeacherIdentity.blankChangeDisabled, true, "選擇變更教師但未輸入新姓名時仍不得評分");
assert.equal(sixCoreTeacherIdentity.changedTeacherName, "實際教師乙", "變更教師時應使用整理空白後的新姓名");
assert.equal(sixCoreTeacherIdentity.changedAllEnabled, true, "輸入新教師姓名後應開放六大核心評分");

const coreScoreLogic = new Function(`
  const ITEM_MAX_SCORE = 5;
  const ITEM_NOT_APPLICABLE = "NA";
  const COMPETENCIES = [
    ["PC", "病人照護", 8], ["MK", "醫學知識", 2], ["PROF", "專業素養", 2], ["PBLI", "從實作中學習及改進", 2], ["ICS", "人際及溝通技巧", 3], ["SBP", "制度下之臨床工作", 3]
  ].map(([code, name, count]) => ({ code, name, items: Array.from({ length: count }, () => ({})) }));
  const ASSESSMENT_ITEMS = COMPETENCIES.flatMap((competency) => competency.items);
  ${extractFunction("formatCCCScore")}
  ${extractFunction("sixCoreFormsFor")}
  ${extractFunction("validItemScores")}
  ${extractFunction("teacherDomainMetrics")}
  ${extractFunction("teacherFormTotal")}
  ${extractFunction("teacherMetricResultText")}
  ${extractFunction("sixCoreFormResult")}
  ${extractFunction("completedSixCoreResults")}
  ${extractFunction("sixCoreAggregate")}
  ${extractFunction("resultSummary")}
  ${extractFunction("printSummaryTable")}
  return { teacherDomainMetrics, sixCoreAggregate, resultSummary, printSummaryTable };
`)();
const discrepancyItemScores = [5, 4, 4, 4, 4, 4, 4, 4, 3, 2, 3, 3, 3, 3, 4, 3, 3, 4, 4, 3];
const discrepancyMetrics = coreScoreLogic.teacherDomainMetrics(discrepancyItemScores);
const misleadingAxisAverage = Math.round(discrepancyMetrics.reduce((total, metric) => total + metric.percent, 0) / discrepancyMetrics.length * 10) / 10;
assert.equal(misleadingAxisAverage, 65.4, "六軸百分比等權平均可得到與前頁總分不同的 65.4");
const multiFormAssessment = { sixCoreForms: [
  { id: "f1", assessmentDate: "2026-01-10", createdAt: "2026-01-10T01:00:00Z", teacher: { itemScores: discrepancyItemScores } },
  { id: "f2", assessmentDate: "2026-03-15", createdAt: "2026-03-15T01:00:00Z", teacher: { itemScores: Array(20).fill(5) } },
  { id: "f3", assessmentDate: "2026-02-01", createdAt: "2026-02-01T01:00:00Z", student: { levels: Array(6).fill(3) }, teacherDraft: { itemScores: Array(20).fill(4) } }
] };
assert.equal(coreScoreLogic.sixCoreAggregate(multiFormAssessment, "2026-01-01", "2026-01-31").score, 71, "日期範圍只納入第一張時應沿用該張 20 小項總分 71 分");
assert.equal(coreScoreLogic.sixCoreAggregate(multiFormAssessment).score, 85.5, "兩張正式教師評核應等權平均為 85.5 分");
assert.equal(coreScoreLogic.sixCoreAggregate(multiFormAssessment).forms.length, 2, "學生單獨完成與教師草稿不得列入平均");
assert.deepEqual(coreScoreLogic.sixCoreAggregate(multiFormAssessment, "2026-03-01", "2026-03-31").metrics.map((metric) => metric.score), [100, 100, 100, 100, 100, 100], "日期篩選後六項能力平均應來自範圍內表單");
const notApplicableAssessment = { sixCoreForms: [{
  id: "na-example", assessmentDate: "2026-04-01", createdAt: "2026-04-01T01:00:00Z",
  teacher: { itemScores: [5, 5, 5, 5, 5, 5, "NA", "NA", 4, 4, 3, 4, 5, 4, 4, 4, 4, 3, 3, 3] }
}] };
const notApplicableAggregate = coreScoreLogic.sixCoreAggregate(notApplicableAssessment);
assert.equal(notApplicableAggregate.score, 83.3, "兩項 N/A 的範例應以 75/90 換算為 83.3 分");
assert.equal(coreScoreLogic.teacherDomainMetrics(notApplicableAssessment.sixCoreForms[0].teacher.itemScores)[0].max, 30, "PC 八項中兩項 N/A 時有效滿分應為 30");
const oneNotApplicableAssessment = {
  student: { levels: Array(6).fill(3) },
  teacher: { levels: Array(6).fill(4), itemScores: [...Array(7).fill(5), "NA", ...Array(12).fill(5)] }
};
const oneNotApplicableWebSummary = coreScoreLogic.resultSummary(oneNotApplicableAssessment);
const oneNotApplicablePrintSummary = coreScoreLogic.printSummaryTable(oneNotApplicableAssessment);
assert.match(oneNotApplicableWebSummary, /PC 病人照護（滿分40）[\s\S]*35\/35（100%）｜N\/A 1項/, "六角圖下方應顯示 PC 原始滿分 40、有效分母 35 與一項 N/A");
assert.match(oneNotApplicablePrintSummary, /PC 病人照護<small>（滿分40）<\/small>[\s\S]*35\/35<small>N\/A 1項<\/small>/, "列印彙整表應以精簡排版顯示原始滿分、有效分母與 N/A 數量");
const allNotApplicableAggregate = coreScoreLogic.sixCoreAggregate({ sixCoreForms: [{
  id: "all-na", assessmentDate: "2026-04-02", createdAt: "2026-04-02T01:00:00Z",
  teacher: { itemScores: Array(20).fill("NA") }
}] });
assert.equal(allNotApplicableAggregate.score, null, "整張表全部 N/A 時不得被當成 0 分");
assert.equal(allNotApplicableAggregate.forms.length, 0, "整張表全部 N/A 時不得納入後續六大核心平均");

const radarNullHandling = new Function(`
  const COMPETENCIES = ["PC", "MK", "PROF", "PBLI", "ICS", "SBP"].map((code) => ({ code }));
  const arcs = [];
  const context = {
    clearRect() {}, beginPath() {}, moveTo() {}, lineTo() {}, closePath() {}, stroke() {}, fill() {}, fillText() {}, setLineDash() {},
    arc(x, y) { arcs.push({ x, y }); }
  };
  const canvas = { width: 320, height: 320, getContext() { return context; } };
  ${extractFunction("drawRadarChart")}
  drawRadarChart(canvas, [{ scores: [null, 80, 70, 60, 50, 40], color: "#000" }], 100);
  return arcs;
`)();
assert.equal(radarNullHandling.length, 5, "整個能力皆為 N/A 時六角圖應留空該軸，不得誤畫成 0 分標記");

const renderedCCC = new Function(`
  const ITEM_MAX_SCORE = 5;
  const ITEM_NOT_APPLICABLE = "NA";
  const COMPETENCIES = [
    ["PC", 8], ["MK", 2], ["PROF", 2], ["PBLI", 2], ["ICS", 3], ["SBP", 3]
  ].map(([code, count]) => ({ code, name: code, items: Array.from({ length: count }, () => ({})) }));
  const ASSESSMENT_ITEMS = COMPETENCIES.flatMap((competency) => competency.items);
  const CCC_EPA_OPTIONS = [["L1", "L1"], ["L2", "L2"], ["L3", "L3"], ["L4", "L4"], ["L5", "L5"]];
  const CCC_BOOLEAN_OPTIONS = [["none", "無"], ["yes", "有"]];
  const CCC_SEVERITY_OPTIONS = [["mild", "輕微"], ["moderate", "中等"], ["severe", "嚴重"]];
  const CCC_CONCLUSION_OPTIONS = [["promotion", "可晉升"]];
  const CCC_FOLLOWUP_OPTIONS = [["next-ccc", "下次適任性評核"]];
  const CCC_SCORE_LOOKUP_URL = "https://rt-linebot.onrender.com/r-rating";
  const CCC_SCORE_LOOKUP_QR_PATH = "M4 4h7v1H4z";
  let selectedCCCResidentId = null;
  const elements = {
    cccResidentSelect: { innerHTML: "", disabled: false },
    cccExportButton: { disabled: false },
    cccEmpty: { hidden: true, innerHTML: "" },
    cccForm: { hidden: true, dataset: {}, innerHTML: "", classList: { toggle() {} }, querySelectorAll() { return []; } }
  };
  const residentFor = (period, residentId) => period.residents.find((resident) => resident.id === residentId);
  const formatReadableTime = (value) => value;
  ${extractFunction("escapeHTML")}
  ${extractFunction("cccScoreLookupMarkup")}
  ${extractFunction("sixCoreFormsFor")}
  ${extractFunction("validItemScores")}
  ${extractFunction("teacherDomainMetrics")}
  ${extractFunction("teacherFormTotal")}
  ${extractFunction("sixCoreFormResult")}
  ${extractFunction("completedSixCoreResults")}
  ${extractFunction("sixCoreAggregate")}
  ${extractFunction("sixCoreDefaultRange")}
  ${extractFunction("sixCoreSourceSnapshot")}
  ${extractFunction("cccIncludedFormsMarkup")}
  ${extractFunction("cccScoreValue")}
  ${extractFunction("formatCCCScore")}
  ${extractFunction("cccWeightedTotal")}
  ${extractFunction("cccWeightedContribution")}
  ${extractFunction("cccDraftFor")}
  ${extractFunction("cccRecordFor")}
  ${extractFunction("cccChoiceMarkup")}
  ${extractFunction("renderCCCForm")}
  const period = {
    name: "2026 年第 1 期",
    residents: [{ id: "r1", level: "R1", name: "測試醫師" }],
    assessments: { r1: {
      sixCoreForms: [{
        id: "f1", assessmentDate: "2026-01-10", createdAt: "2026-01-10T01:00:00Z",
        teacher: { teacherName: "教師", itemScores: [5, 4, 4, 4, 4, 4, 4, 4, 3, 2, 3, 3, 3, 3, 4, 3, 3, 4, 4, 3] }
      }],
      cccDraft: { treatmentPlanScore: 90, journalMeetingScore: 70, annualExamScore: 100 }
    } }
  };
  renderCCCForm(period);
  return elements;
`)();
assert.match(renderedCCC.cccResidentSelect.innerHTML, /R1　測試醫師/, "CCC 學生選單應實際渲染目前期別名單");
assert.equal((renderedCCC.cccForm.innerHTML.match(/class="ccc-section-heading"/g) || []).length, 9, "CCC 初稿應完整渲染 Word 的九個區塊");
assert.equal((renderedCCC.cccForm.innerHTML.match(/class="ccc-core-score"/g) || []).length, 6, "CCC 初稿應渲染六項核心能力分數");
assert.match(renderedCCC.cccForm.innerHTML, /六大核心平均　71 分（1 張）/, "CCC 初稿應顯示日期範圍內一張表單的 71 分平均");
assert.match(renderedCCC.cccForm.innerHTML, /納入 1 張：<\/strong>2026-01-10/, "CCC 初稿應預覽實際納入的表單日期");
assert.match(renderedCCC.cccForm.innerHTML, /81\.3 分/, "CCC 初稿應使用 71 分核心總分計算綜合加權總分");
assert.match(renderedCCC.cccForm.innerHTML, /id="cccCoreContribution"[^>]*>21\.3<\/output>/, "CCC 表單應顯示 71 分核心總分的 30% 加權得分");
assert.match(renderedCCC.cccForm.innerHTML, /https:\/\/rt-linebot\.onrender\.com\/r-rating/, "CCC 表頭應實際渲染分數查詢 QR Code 連結");

const savedCCC = new Function(`
  const selectedCCCResidentId = "r1";
  const period = { residents: [{ id: "r1", level: "R1", name: "測試醫師" }], assessments: { r1: {} } };
  const values = {
    coreDateFrom: "2026-01-01", coreDateTo: "2026-03-31",
    treatmentPlanScore: "88.5", journalMeetingScore: "79", annualExamScore: "91",
    epaLevel: "L4", teaching: "yes", teachingNote: "  教學紀錄  ", research: "none", researchNote: "",
    passport: "yes", safety: "none", safetyDescription: "", safetySeverity: "", safetyImprovement: "",
    conclusion: "promotion", followUp: "next-ccc", comments: "  整體表現良好  ",
    learnerFeedback: "  持續精進  ", learnerSignature: "測試醫師", mentorName: "導師甲", mentorDate: "2026-08-10",
    educationLeadName: "負責人乙", educationLeadDate: "2026-08-10", chiefName: "主任丙", chiefDate: "2026-08-10"
  };
  const FormData = class { get(name) { return values[name] ?? null; } };
  const elements = { cccForm: {} };
  const currentPeriod = () => period;
  const residentFor = (targetPeriod, residentId) => targetPeriod.residents.find((resident) => resident.id === residentId);
  let persistCount = 0;
  let renderCount = 0;
  const persist = () => { persistCount += 1; };
  const renderCCCForm = () => { renderCount += 1; };
  const showToast = () => {};
  ${extractFunction("cccScoreValue")}
  ${extractFunction("readCCCForm")}
  ${extractFunction("currentCCCContext")}
  ${extractFunction("saveCCCDraft")}
  saveCCCDraft();
  return { draft: period.assessments.r1.cccDraft, persistCount, renderCount };
`)();
assert.equal(savedCCC.draft.treatmentPlanScore, 88.5, "CCC 草稿應保存百分制數字成績");
assert.equal(savedCCC.draft.coreDateFrom, "2026-01-01", "CCC 草稿應保存六大核心納入起日");
assert.equal(savedCCC.draft.coreDateTo, "2026-03-31", "CCC 草稿應保存六大核心納入迄日");
assert.equal(savedCCC.draft.epaLevel, "L4", "CCC 草稿應保存 EPA 勾選結果");
assert.equal(savedCCC.draft.comments, "整體表現良好", "CCC 草稿應整理並保存總評語");
assert.equal(savedCCC.draft.learnerFeedback, "持續精進", "CCC 草稿應保存學員省思與回饋");
assert.equal(savedCCC.draft.mentorName, "導師甲", "CCC 草稿應保存正式表需要的導師欄位");
assert.equal(savedCCC.persistCount, 1, "CCC 草稿應寫入瀏覽器持久狀態一次");
assert.equal(savedCCC.renderCount, 1, "CCC 草稿保存後應重新渲染目前學生表單");

const submittedCCC = new Function(`
  const ITEM_MAX_SCORE = 5;
  const ITEM_NOT_APPLICABLE = "NA";
  const COMPETENCIES = [
    ["PC", 8], ["MK", 2], ["PROF", 2], ["PBLI", 2], ["ICS", 3], ["SBP", 3]
  ].map(([code, count]) => ({ code, name: code, items: Array.from({ length: count }, () => ({})) }));
  const ASSESSMENT_ITEMS = COMPETENCIES.flatMap((competency) => competency.items);
  const selectedCCCResidentId = "r1";
  const period = {
    name: "2026 年第 1 期",
    residents: [{ id: "r1", level: "R1", name: "測試醫師" }],
    assessments: { r1: {
      sixCoreForms: [
        { id: "f1", assessmentDate: "2026-01-10", createdAt: "2026-01-10T01:00:00Z", teacher: { teacherName: "教師甲", itemScores: Array(20).fill(4) } },
        { id: "f2", assessmentDate: "2026-03-15", createdAt: "2026-03-15T01:00:00Z", teacher: { teacherName: "教師乙", itemScores: Array(20).fill(5) } }
      ],
      cccDraft: { savedAt: "draft" }
    } }
  };
  const elements = { cccForm: { reportValidity: () => true } };
  const currentPeriod = () => period;
  const residentFor = (targetPeriod, residentId) => targetPeriod.residents.find((resident) => resident.id === residentId);
  const readCCCForm = () => ({
    coreDateFrom: "2026-01-01", coreDateTo: "2026-01-31",
    treatmentPlanScore: 90, journalMeetingScore: 70, annualExamScore: 100, mentorName: "導師甲", conclusion: "promotion"
  });
  const window = { confirm: () => true };
  let auditEvent = null;
  let persistCount = 0;
  let renderCount = 0;
  const addAuditEvent = (event) => { auditEvent = event; };
  const persist = () => { persistCount += 1; };
  const render = () => { renderCount += 1; };
  const showToast = () => {};
  ${extractFunction("sixCoreFormsFor")}
  ${extractFunction("validItemScores")}
  ${extractFunction("teacherDomainMetrics")}
  ${extractFunction("teacherFormTotal")}
  ${extractFunction("sixCoreFormResult")}
  ${extractFunction("completedSixCoreResults")}
  ${extractFunction("sixCoreAggregate")}
  ${extractFunction("sixCoreSourceSnapshot")}
  ${extractFunction("cccScoreValue")}
  ${extractFunction("cccWeightedTotal")}
  ${extractFunction("currentCCCContext")}
  ${extractFunction("submitCCCForm")}
  submitCCCForm({ preventDefault() {} });
  return { assessment: period.assessments.r1, auditEvent, persistCount, renderCount };
`)();
assert.equal(submittedCCC.assessment.cccSubmission.coreScore, 80, "CCC 正式提交應保存前頁六大核心總分快照");
assert.equal(submittedCCC.assessment.cccSubmission.coreSourceForms.length, 1, "CCC 正式提交應只鎖定日期範圍內的表單");
assert.equal(submittedCCC.assessment.cccSubmission.coreSourceForms[0].formId, "f1", "CCC 快照應保存實際納入的表單 ID");
assert.equal(submittedCCC.assessment.cccSubmission.weightedTotal, 84, "CCC 正式提交應保存綜合加權總分快照");
assert.equal(submittedCCC.assessment.cccDraft, undefined, "CCC 正式提交後應移除可編輯草稿");
assert.equal(submittedCCC.auditEvent.type, "ccc-submission", "CCC 正式提交應建立專屬稽核事件");
assert.equal(submittedCCC.auditEvent.role, "ccc", "CCC 稽核事件應標示為 CCC 評核表");
assert.equal(submittedCCC.persistCount, 1, "CCC 正式提交應持久化一次");
assert.equal(submittedCCC.renderCount, 1, "CCC 正式提交後應重新渲染為鎖定狀態");

const cccPDFMarkup = new Function(`
  const CCC_EPA_OPTIONS = [["L4", "L4：可獨立"]];
  const CCC_BOOLEAN_OPTIONS = [["none", "無"], ["yes", "有"]];
  const CCC_SEVERITY_OPTIONS = [["mild", "輕微"]];
  const CCC_CONCLUSION_OPTIONS = [["promotion", "可晉升"]];
  const CCC_FOLLOWUP_OPTIONS = [["next-ccc", "下次適任性評核"]];
  const sixCoreAggregate = () => ({ metrics: null, score: null, forms: [] });
  const formatReadableTime = () => "2026/08/10 10:00";
  ${extractFunction("escapeHTML")}
  ${extractFunction("cccScoreValue")}
  ${extractFunction("formatCCCScore")}
  ${extractFunction("cccWeightedTotal")}
  ${extractFunction("cccWeightedContribution")}
  ${extractFunction("cccOptionLabel")}
  ${extractFunction("formatCCCPrintDate")}
  ${extractFunction("cccPrintText")}
  ${extractFunction("cccPrintReportMarkup")}
  const period = { name: "2026 年第 1 期", assessments: { r1: {} } };
  const resident = { id: "r1", level: "R1", name: "測試醫師" };
  const record = {
    coreMetrics: [60, 70, 80, 90, 100, 80].map((score, index) => ({ code: String(index), score })),
    coreScore: 80, coreDateFrom: "2026-01-01", coreDateTo: "2026-03-31",
    coreSourceForms: [{ formId: "f1", assessmentDate: "2026-01-10", teacherName: "教師", score: 80 }],
    treatmentPlanScore: 90, journalMeetingScore: 70, annualExamScore: 100, weightedTotal: 84,
    epaLevel: "L4", teaching: "yes", teachingNote: "教學", research: "none", passport: "yes", safety: "none",
    conclusion: "promotion", followUp: "next-ccc", comments: "總評語", learnerFeedback: "學員回饋", learnerSignature: "測試醫師",
    mentorName: "導師甲", mentorDate: "2026-08-10", educationLeadName: "負責人乙", educationLeadDate: "2026-08-10",
    chiefName: "主任丙", chiefDate: "2026-08-10", submittedAt: "2026-08-10T02:00:00.000Z"
  };
  return cccPrintReportMarkup(period, resident, record);
`)();
assert.match(cccPDFMarkup, /住院醫師核心能力適任性評核表/, "評核 PDF 應產生指定的正式標題");
assert.doesNotMatch(cccPDFMarkup, /ccc-score-lookup|rt-linebot|conturing\/journal|artd12345|<svg/i, "CCC PDF 不得包含網頁版 QR Code、查詢網址或密碼");
assert.doesNotMatch(cccPDFMarkup, /CCC|草稿預覽|正式提交/, "評核 PDF 可見內容不得再出現 CCC 或草稿／提交狀態小字");
assert.match(cccPDFMarkup, /六大核心考核表[\s\S]*30%[\s\S]*80[\s\S]*24/, "CCC PDF 應同列顯示核心原始總分與 30% 加權得分");
assert.match(cccPDFMarkup, /綜合加權總分[\s\S]*84/, "CCC PDF 應顯示四項加總後的 84 分");
assert.match(cccPDFMarkup, /學員回饋/, "CCC PDF 應帶入學員省思與回饋");
assert.match(cccPDFMarkup, /導師甲[\s\S]*負責人乙[\s\S]*主任丙/, "CCC PDF 應帶入三層簽核欄位");

const renderedCoreEPA = new Function(`
  const CORE_EPA_ITEMS = Array.from({ length: 11 }, (_, index) => ({ code: "EPA" + (index + 1), name: "評量項目 " + (index + 1) }));
  const CORE_EPA_LEVEL_OPTIONS = [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["not-assessed", "未評量"]];
  const CORE_EPA_LEVEL_GUIDE = [["Level 1", "共同操作"], ["Level 2", "必要協助"], ["Level 3", "事後確認"], ["Level 4", "必要時知會"], ["Level 5", "獨立執行"]];
  const CORE_EPA_THRESHOLDS = ["R1 標準", "R2 標準"];
  let selectedCoreEPAResidentId = null;
  let selectedCoreEPAFormId = null;
  let unlockedCoreEPAFormId = null;
  const elements = {
    coreEpaResidentSelect: { innerHTML: "", disabled: false },
    coreEpaFormSelect: { innerHTML: "", disabled: false },
    addCoreEpaFormButton: { disabled: false },
    coreEpaExportButton: { disabled: false },
    coreEpaEmpty: { hidden: true, innerHTML: "" },
    coreEpaForm: { hidden: true, innerHTML: "", dataset: {}, classList: { toggle() {} }, querySelectorAll() { return []; } }
  };
  const residentFor = (period, residentId) => period.residents.find((resident) => resident.id === residentId);
  const formatReadableTime = (value) => value;
  const refreshCoreEPATeacherIdentity = () => {};
  ${extractFunction("escapeHTML")}
  ${extractFunction("coreEpaFormsFor")}
  ${extractFunction("findCoreEPAForm")}
  ${extractFunction("coreEPAFormFor")}
  ${extractFunction("coreEPAFormHasContent")}
  ${extractFunction("coreEPALevelMarkup")}
  ${extractFunction("renderCoreEPAForm")}
  const period = {
    name: "2026 年第 1 期",
    residents: [{ id: "r1", level: "R1", name: "測試醫師" }],
    assessments: { r1: { coreEpaForms: [
      { id: "e1", assessmentDate: "2026-06-01", createdAt: "2026-06-01T01:00:00.000Z", assignedTeacherName: "教師甲", teacherName: "教師甲", savedAt: "2026-06-01T02:00:00.000Z", levels: Array(11).fill("3"), learnerAdvice: "", mentorAdvice: "", programAdvice: "" },
      { id: "e2", assessmentDate: "2026-08-14", createdAt: "2026-08-14T01:00:00.000Z", assignedTeacherName: "教師乙", teacherName: "暫存教師丙", savedAt: "2026-08-14T02:00:00.000Z", levels: ["4", "4", "4", "3", "3", "3", "2", "2", "2", "2", "2"], learnerAdvice: "", mentorAdvice: "", programAdvice: "" }
    ] } }
  };
  renderCoreEPAForm(period);
  return { elements, selectedCoreEPAFormId };
`)();
assert.match(renderedCoreEPA.elements.coreEpaResidentSelect.innerHTML, /R1　測試醫師/, "Core EPAs 住院醫師選單應實際渲染目前期別名單");
assert.match(renderedCoreEPA.elements.coreEpaFormSelect.innerHTML, /第 1 張 · 2026-06-01[\s\S]*第 2 張 · 2026-08-14/, "Core EPAs 應列出同一人的多張日期表單");
assert.equal(renderedCoreEPA.selectedCoreEPAFormId, "e2", "進入 Core EPA 頁時應預設開啟最新建立的表單");
assert.equal((renderedCoreEPA.elements.coreEpaForm.innerHTML.match(/class="core-epa-row"/g) || []).length, 11, "Core EPAs 表單應渲染 11 個評量項目");
assert.match(renderedCoreEPA.elements.coreEpaForm.innerHTML, /name="level-EPA11"/, "Core EPAs 表單應可填寫 EPA11 信賴程度");
assert.doesNotMatch(renderedCoreEPA.elements.coreEpaForm.innerHTML, /學員類別|traineeType/, "Core EPAs 表單不得再顯示學員類別");
assert.match(renderedCoreEPA.elements.coreEpaForm.innerHTML, /對訓練計畫與科部的建議/, "Core EPAs 表單應完整渲染原始建議欄位");
assert.match(renderedCoreEPA.elements.coreEpaForm.innerHTML, /目前評分教師：[\s\S]*暫存教師丙[\s\S]*住院醫師指定：[\s\S]*教師乙[\s\S]*確定我是評分教師[\s\S]*變更評分教師/, "Core EPA 暫存後應直接顯示目前教師，重新確認即可續填");
assert.equal(renderedCoreEPA.elements.coreEpaForm.dataset.currentTeacherName, "暫存教師丙", "Core EPA 應以暫存姓名作為再次確認的目前評分教師");
const confirmedCoreEPACurrentTeacher = new Function(`
  ${extractFunction("confirmedCoreEPATeacherName")}
  const form = {
    dataset: { assignedTeacherName: "指定教師乙", currentTeacherName: "暫存教師丙" },
    elements: { teacherIdentityMode: { value: "current" }, teacherName: { value: "" } }
  };
  return confirmedCoreEPATeacherName(form);
`)();
assert.equal(confirmedCoreEPACurrentTeacher, "暫存教師丙", "Core EPA 點選確定我是評分教師後應直接沿用暫存姓名");
assert.match(renderedCoreEPA.elements.coreEpaForm.innerHTML, />確定並提交<\/button>/, "尚未提交的 Core EPA 表單應在底部顯示正式提交按鈕");

const createdCoreEPA = new Function(`
  const CORE_EPA_ITEMS = Array.from({ length: 11 });
  let activeCoreEPACreateResidentId = "r1";
  let selectedCoreEPAFormId = null;
  let unlockedCoreEPAFormId = null;
  const period = { residents: [{ id: "r1", level: "R1", name: "測試醫師" }], assessments: { r1: { coreEpaForms: [] } } };
  const elements = {
    coreEpaNewAssessmentDate: { value: "2026-07-01" },
    coreEpaAssignedTeacherName: { value: "教師甲", focus() {} },
    coreEpaFormDialog: { close() {} },
    coreEpaForm: { querySelector() { return null; } }
  };
  const currentPeriod = () => period;
  const residentFor = (targetPeriod, residentId) => targetPeriod.residents.find((resident) => resident.id === residentId);
  let persistCount = 0;
  let renderCount = 0;
  const persist = () => { persistCount += 1; return true; };
  const render = () => { renderCount += 1; };
  const showToast = () => {};
  const requestAnimationFrame = () => {};
  ${extractFunction("makeCoreEPAForm")}
  ${extractFunction("createCoreEPAForm")}
  createCoreEPAForm({ preventDefault() {} });
  activeCoreEPACreateResidentId = "r1";
  elements.coreEpaNewAssessmentDate.value = "2026-09-15";
  elements.coreEpaAssignedTeacherName.value = "教師乙";
  createCoreEPAForm({ preventDefault() {} });
  return { forms: period.assessments.r1.coreEpaForms, selectedCoreEPAFormId, persistCount, renderCount };
`)();
assert.deepEqual(createdCoreEPA.forms.map((form) => form.assessmentDate), ["2026-07-01", "2026-09-15"], "同一期同一人應可建立兩張以上 Core EPA 表單");
assert.notEqual(createdCoreEPA.forms[0].id, createdCoreEPA.forms[1].id, "每張 Core EPA 表單應有獨立識別碼");
assert.equal(createdCoreEPA.selectedCoreEPAFormId, createdCoreEPA.forms[1].id, "新增後應開啟剛建立的 Core EPA 表單");
assert.equal(createdCoreEPA.persistCount, 2, "每次新增 Core EPA 表單都應持久化");
assert.deepEqual(createdCoreEPA.forms.map((form) => form.assignedTeacherName), ["教師甲", "教師乙"], "每張 Core EPA 表單應保存住院醫師指定教師");

const savedCoreEPA = new Function(`
  const CORE_EPA_ITEMS = Array.from({ length: 11 }, (_, index) => ({ code: "EPA" + (index + 1) }));
  const selectedCoreEPAResidentId = "r1";
  const selectedCoreEPAFormId = "e2";
  const period = { residents: [{ id: "r1", level: "R1", name: "測試醫師" }], assessments: { r1: { coreEpaForms: [
    { id: "e1", assessmentDate: "2026-06-01", createdAt: "2026-06-01T01:00:00.000Z", savedAt: "2026-06-01T02:00:00.000Z", levels: Array(11).fill("2"), learnerAdvice: "舊表", mentorAdvice: "", programAdvice: "" },
    { id: "e2", assessmentDate: "2026-08-14", createdAt: "2026-08-14T01:00:00.000Z", assignedTeacherName: "教師甲", savedAt: null, levels: Array(11).fill(""), learnerAdvice: "", mentorAdvice: "", programAdvice: "" }
  ] } } };
  const values = {
    teacherIdentityMode: "change",
    teacherName: "  教師甲  ",
    learnerAdvice: "  持續精進  ",
    mentorAdvice: "  加強回饋  ", programAdvice: "  增加實作機會  ",
    ...Object.fromEntries(CORE_EPA_ITEMS.map((item, index) => ["level-" + item.code, index === 10 ? "not-assessed" : String(index % 5 + 1)]))
  };
  const FormData = class { get(name) { return values[name] ?? null; } };
  const elements = { coreEpaForm: { dataset: { assignedTeacherName: "教師甲" } } };
  const currentPeriod = () => period;
  const residentFor = (targetPeriod, residentId) => targetPeriod.residents.find((resident) => resident.id === residentId);
  let persistCount = 0;
  let renderCount = 0;
  const persist = () => { persistCount += 1; return true; };
  const renderCoreEPAForm = () => { renderCount += 1; };
  const showToast = () => {};
  const confirmedCoreEPATeacherName = () => "教師甲";
  ${extractFunction("coreEpaFormsFor")}
  ${extractFunction("findCoreEPAForm")}
  ${extractFunction("readCoreEPAForm")}
  ${extractFunction("currentCoreEPAContext")}
  ${extractFunction("saveCoreEPAForm")}
  saveCoreEPAForm();
  return { forms: period.assessments.r1.coreEpaForms, persistCount, renderCount };
`)();
assert.equal(savedCoreEPA.forms[0].learnerAdvice, "舊表", "暫存目前 Core EPA 表單不得覆蓋同一人的其他表單");
assert.equal(savedCoreEPA.forms[1].assessmentDate, "2026-08-14", "Core EPA 暫存應保留建立時的評量日期");
assert.equal("traineeType" in savedCoreEPA.forms[1], false, "Core EPA 新格式不得保存學員類別");
assert.deepEqual(savedCoreEPA.forms[1].levels.slice(0, 5), ["1", "2", "3", "4", "5"], "Core EPAs 表單應依 EPA 順序保存信賴程度");
assert.equal(savedCoreEPA.forms[1].levels[10], "not-assessed", "Core EPAs 表單應保存未評量狀態");
assert.equal(savedCoreEPA.forms[1].teacherName, "教師甲", "Core EPA 草稿應保存並整理教師姓名");
assert.equal(savedCoreEPA.forms[1].learnerAdvice, "持續精進", "Core EPAs 表單應整理建議欄位空白");
assert.equal(savedCoreEPA.persistCount, 1, "Core EPAs 草稿應寫入瀏覽器持久狀態一次");
assert.equal(savedCoreEPA.renderCount, 1, "Core EPAs 草稿保存後應重新渲染目前學員表單");

const submittedCoreEPAResult = new Function(`
  const CORE_EPA_ITEMS = Array.from({ length: 11 }, (_, index) => ({ code: "EPA" + (index + 1) }));
  let selectedCoreEPAResidentId = "r1";
  let selectedCoreEPAFormId = "e1";
  let unlockedCoreEPAFormId = null;
  const period = { id: "p1", name: "第一期", residents: [{ id: "r1", level: "R1", name: "測試醫師" }], assessments: { r1: { coreEpaForms: [
    { id: "e1", assessmentDate: "2026-08-14", createdAt: "2026-08-14T01:00:00.000Z", assignedTeacherName: "指定教師", savedAt: null, submittedAt: null, teacherName: "", levels: Array(11).fill(""), learnerAdvice: "", mentorAdvice: "", programAdvice: "" }
  ] } } };
  const values = {
    teacherIdentityMode: "change",
    teacherName: "教師甲", learnerAdvice: "學員建議", mentorAdvice: "", programAdvice: "",
    ...Object.fromEntries(CORE_EPA_ITEMS.map((item) => ["level-" + item.code, "4"]))
  };
  const FormData = class { get(name) { return values[name] ?? null; } };
  const elements = { coreEpaForm: { dataset: { assignedTeacherName: "指定教師" }, reportValidity() { return true; }, elements: { teacherName: { focus() {} } } } };
  const state = { auditLog: [] };
  const currentPeriod = () => period;
  const residentFor = (targetPeriod, residentId) => targetPeriod.residents.find((resident) => resident.id === residentId);
  const mergeValuesEqual = (left, right) => JSON.stringify(left) === JSON.stringify(right);
  const window = { confirm() { return true; } };
  let persistCount = 0;
  const persist = () => { persistCount += 1; return true; };
  const render = () => {};
  const showToast = () => {};
  const confirmedCoreEPATeacherName = () => "教師甲";
  ${extractFunction("coreEpaFormsFor")}
  ${extractFunction("findCoreEPAForm")}
  ${extractFunction("readCoreEPAForm")}
  ${extractFunction("currentCoreEPAContext")}
  ${extractFunction("addAuditEvent")}
  ${extractFunction("submitCoreEPAForm")}
  submitCoreEPAForm({ preventDefault() {} });
  return { form: period.assessments.r1.coreEpaForms[0], auditLog: state.auditLog, persistCount, unlockedCoreEPAFormId };
`)();
assert.equal(submittedCoreEPAResult.form.teacherName, "教師甲", "Core EPA 正式提交應保存具名教師");
assert.ok(submittedCoreEPAResult.form.submittedAt, "Core EPA 正式提交應保存完成時間");
assert.deepEqual(submittedCoreEPAResult.form.levels, Array(11).fill("4"), "Core EPA 正式提交應保存 EPA1–EPA11 完整快照");
assert.equal(submittedCoreEPAResult.auditLog[0].type, "core-epa-submission", "Core EPA 正式提交應新增專屬稽核事件");
assert.equal(submittedCoreEPAResult.auditLog[0].coreEpaForm.teacherName, "教師甲", "Core EPA 稽核事件應保存整張表單快照");
assert.equal(submittedCoreEPAResult.auditLog[0].assignedTeacherName, "指定教師", "Core EPA 稽核事件應同時保存住院醫師指定教師");
assert.equal(submittedCoreEPAResult.persistCount, 1, "Core EPA 正式提交應持久化一次");

const modifiedCoreEPAResult = new Function(`
  const ADMIN_PASSWORD = "tsgh123";
  const CORE_EPA_ITEMS = Array.from({ length: 11 }, (_, index) => ({ code: "EPA" + (index + 1) }));
  let selectedCoreEPAResidentId = "r1";
  let selectedCoreEPAFormId = "e1";
  let unlockedCoreEPAFormId = null;
  const originalSubmittedAt = "2026-08-14T09:00:00.000Z";
  const period = { id: "p1", name: "第一期", residents: [{ id: "r1", level: "R1", name: "測試醫師" }], assessments: { r1: { coreEpaForms: [
    { id: "e1", assessmentDate: "2026-08-14", createdAt: "2026-08-14T01:00:00.000Z", assignedTeacherName: "指定教師", savedAt: originalSubmittedAt, submittedAt: originalSubmittedAt, teacherName: "教師甲", levels: Array(11).fill("3"), learnerAdvice: "原建議", mentorAdvice: "", programAdvice: "" }
  ] } } };
  const values = {
    teacherName: "教師乙", learnerAdvice: "修改後建議", mentorAdvice: "", programAdvice: "",
    ...Object.fromEntries(CORE_EPA_ITEMS.map((item, index) => ["level-" + item.code, index === 0 ? "4" : "3"]))
  };
  const FormData = class { get(name) { return values[name] ?? null; } };
  const elements = {
    coreEpaUnlockPassword: { value: ADMIN_PASSWORD, select() {} },
    coreEpaUnlockDialog: { close() {} },
    coreEpaForm: { dataset: { assignedTeacherName: "指定教師" }, reportValidity() { return true; }, elements: { teacherName: { focus() {} } } }
  };
  const state = { auditLog: [] };
  const currentPeriod = () => period;
  const residentFor = (targetPeriod, residentId) => targetPeriod.residents.find((resident) => resident.id === residentId);
  let persistCount = 0;
  const persist = () => { persistCount += 1; return true; };
  const render = () => {};
  const renderCoreEPAForm = () => {};
  const renderAudit = () => {};
  const requestAnimationFrame = (callback) => callback();
  const showToast = () => {};
  const window = { confirm() { throw new Error("修改已提交表單不應再呼叫首次提交確認"); } };
  ${extractFunction("cloneMergeValue")}
  ${extractFunction("mergeValuesEqual")}
  ${extractFunction("coreEpaFormsFor")}
  ${extractFunction("findCoreEPAForm")}
  ${extractFunction("readCoreEPAForm")}
  ${extractFunction("currentCoreEPAContext")}
  ${extractFunction("addAuditEvent")}
  ${extractFunction("unlockCoreEPAForm")}
  ${extractFunction("submitCoreEPAForm")}
  unlockCoreEPAForm({ preventDefault() {} });
  const unlockedAfterPassword = unlockedCoreEPAFormId;
  submitCoreEPAForm({ preventDefault() {} });
  return { form: period.assessments.r1.coreEpaForms[0], auditLog: state.auditLog, persistCount, unlockedAfterPassword, unlockedCoreEPAFormId, originalSubmittedAt };
`)();
assert.equal(modifiedCoreEPAResult.unlockedAfterPassword, "e1", "正確管理密碼應只解鎖目前 Core EPA 表單");
assert.equal(modifiedCoreEPAResult.auditLog[0].type, "unlock", "Core EPA 密碼解鎖應立即留下稽核事件");
assert.equal(modifiedCoreEPAResult.auditLog[1].type, "core-epa-modification", "Core EPA 修改應留下專屬稽核事件");
assert.equal(modifiedCoreEPAResult.auditLog[1].beforeCoreEpaForm.teacherName, "教師甲", "Core EPA 修改稽核應保留修改前快照");
assert.equal(modifiedCoreEPAResult.auditLog[1].coreEpaForm.teacherName, "教師乙", "Core EPA 修改稽核應保存修改後快照");
assert.equal(modifiedCoreEPAResult.form.submittedAt, modifiedCoreEPAResult.originalSubmittedAt, "Core EPA 修改不得覆蓋原始提交時間");
assert.equal(modifiedCoreEPAResult.form.levels[0], "4", "Core EPA 解鎖後應可保存修改內容");
assert.equal(modifiedCoreEPAResult.unlockedCoreEPAFormId, null, "Core EPA 修改保存後應立即重新鎖定");
assert.equal(modifiedCoreEPAResult.persistCount, 2, "Core EPA 解鎖與修改應各自持久化稽核狀態");

const coreEPAPDFMarkup = new Function(`
  const CORE_EPA_ITEMS = Array.from({ length: 11 }, (_, index) => ({ code: "EPA" + (index + 1), name: "評量項目 " + (index + 1) }));
  const CORE_EPA_LEVEL_GUIDE = [["Level 1", "共同操作"], ["Level 2", "必要協助"], ["Level 3", "事後確認"], ["Level 4", "必要時知會"], ["Level 5", "獨立執行"]];
  const CORE_EPA_THRESHOLDS = ["第一年住院醫師標準", "第二年住院醫師標準"];
  ${extractFunction("escapeHTML")}
  ${extractFunction("formatCCCPrintDate")}
  ${extractFunction("coreEPALevelLabel")}
  ${extractFunction("coreEPAPrintReportMarkup")}
  const period = { name: "2026 年第 1 期" };
  const resident = { level: "R1", name: "測試醫師" };
  const record = {
    assessmentDate: "2026-08-14",
    assignedTeacherName: "指定教師",
    teacherName: "教師甲",
    levels: ["4", "4", "4", "3", "3", "3", "2", "2", "2", "2", "5"],
    learnerAdvice: "學員建議", mentorAdvice: "導師建議", programAdvice: "科部建議"
  };
  return coreEPAPrintReportMarkup(period, resident, record);
`)();
assert.match(coreEPAPDFMarkup, /三軍總醫院 放射腫瘤部 core EPAs 評量表/, "Core EPAs PDF 應產生原始正式標題");
assert.match(coreEPAPDFMarkup, /EPA11[\s\S]*Level 5/, "Core EPAs PDF 應帶入 EPA11 的信賴程度");
assert.match(coreEPAPDFMarkup, /住院醫師姓名：[\s\S]*測試醫師[\s\S]*年資：[\s\S]*R1/, "Core EPAs PDF 應帶入住院醫師姓名與年資");
assert.match(coreEPAPDFMarkup, /評核教師：[\s\S]*教師甲/, "Core EPAs PDF 應帶入具名評核教師");
assert.match(coreEPAPDFMarkup, /指定教師：[\s\S]*指定教師/, "Core EPAs PDF 應帶入住院醫師原先指定教師");
assert.doesNotMatch(coreEPAPDFMarkup, /學員類別/, "Core EPAs PDF 不得再顯示學員類別");
assert.match(coreEPAPDFMarkup, /學員建議[\s\S]*導師建議[\s\S]*科部建議/, "Core EPAs PDF 應帶入三組建議內容");
assert.match(coreEPAPDFMarkup, /2026 年第 1 期/, "Core EPAs PDF 應帶入評量期別");

await import("./ftp-write-probe-test.mjs");

console.log("PASS: static contract and JavaScript syntax verified");
