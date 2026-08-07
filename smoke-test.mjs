import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("./index.html", import.meta.url), "utf8");

assert.match(html, /<title>CCC 核心能力評分<\/title>/, "頁面標題應存在");
assert.match(html, /data-tab="assessment"/, "應有評分作業分頁");
assert.match(html, /data-tab="roster"/, "應有名單設定分頁");
assert.match(html, /data-tab="audit"/, "應有稽核紀錄分頁");
assert.match(html, /const SCHEMA_VERSION = 3/, "新版評核資料應使用 schema v3");
assert.match(html, /const ITEM_MAX_SCORE = 5/, "每個教師分項滿分應為 5 分");
assert.match(html, /function itemScoreOptions\(selected = null\)/, "教師 0–5 分應由共用下拉選項產生");
assert.match(html, /<select class="item-score-select"[^>]+required>/, "教師分項應使用 0–5 下拉選單");
assert.doesNotMatch(html, /name="\$\{prefix\}-item-\$\{currentIndex\}" type="number"/, "教師分項不得再使用數字輸入框");
assert.match(html, /level >= 1 && level <= 5/, "學生與教師 Level 應限制為 1–5");
assert.match(html, /assessment\.teacher \|\| !assessment\.student/, "教師評分應等待學生完成");
assert.match(html, /const submittedAt = new Date\(\)\.toISOString\(\)/, "提交時應保存完成時間");
assert.match(html, /elements\.teacherName\.required = role === "teacher"/, "教師評分應要求教師姓名");
assert.match(html, /residents: rosterSnapshot/, "每個期別應保存獨立名單快照");
assert.match(html, /const RESIDENT_LEVELS = \["R1", "R2", "R3", "R4"\]/, "名單應支援四種住院醫師年級");
assert.match(html, /data-add-resident-level/, "名單設定應可依年級新增人員");
assert.match(html, /period\.assessments\[resident\.id\] = \{ student: null, teacher: null \}/, "新增人員時應同步建立空白評分表");
assert.match(html, /delete period\.assessments\[residentId\]/, "移除未評核人員時應同步移除空白評分表");
assert.match(html, /function residentHasProtectedData/, "移除前應檢查評核與稽核資料");
assert.match(html, /assessment\?\.teacherDraft/, "教師暫存存在時不得移除名單人員");
assert.match(html, /type: "unlock"/, "密碼解鎖應建立稽核事件");
assert.match(html, /type: "modification"/, "分數修改應建立稽核事件");
assert.match(html, /const ADMIN_PASSWORD = "tsgh123"/, "應設定預設管理密碼");
assert.match(html, /function exportAuditCSV\(\)/, "稽核紀錄應可匯出試算表 CSV");
assert.match(html, /window\.print\(\)/, "評分作業應支援列印為 PDF");
assert.match(html, /@page \{ size: A4 landscape/, "列印版應使用 A4 橫式");
assert.match(html, /\.resident-card:not\(\.complete\) \{ display: none !important; \}/, "列印時應省略尚未完成的學生");
assert.match(html, /\.resident-card\.complete \{ break-after: page;/, "列印版應強制每位學生另起一頁");
assert.match(html, /\.resident-card\.complete::before \{ display: none !important; \}/, "列印時不得讓卡片頂部裝飾線遮住正式標題");
assert.match(html, /\.formal-print-report \{[^}]*padding-top: 3mm;/, "正式列印表頭應保留上方安全距離");
assert.match(html, /class="formal-print-report"/, "每位學生應有獨立正式列印表");
assert.match(html, /三軍總醫院 放射腫瘤部住院醫師訓練考核表/, "列印標題應採用 Word 正式表名");
assert.match(html, /ACGME Milestones 2\.0 暨 100分制雙軌評核/, "列印副標題應採用 Word 表名");
assert.match(html, /class="formal-code-legend"/, "正式列印表應醒目說明六角圖縮寫");
assert.match(html, /六角圖縮寫對照/, "縮寫對照應有清楚標題");
assert.match(html, /<td>\$\{metric\.name\}<\/td>/, "最後評分表的核心能力應顯示中文全名");
assert.match(html, /const firstInGroup = rowIndex === 0 \|\| column\[rowIndex - 1\]\.competency\.code !== competency\.code/, "原始詳細評分表應辨識每個能力群組的第一列");
assert.match(html, /<td class="domain" rowspan="\$\{domainItemCount\}">\$\{escapeHTML\(competency\.name\)\}<\/td>/, "核心能力中文全名應依題數合併儲存格");
assert.match(html, /data-radar-kind="print-absolute"/, "列印表應包含教師分項六角圖");
assert.match(html, /data-radar-kind="print-levels"/, "列印表應包含學生與教師 Level 六角圖");
assert.match(html, /教師評核分數/, "教師 Level 應使用教師評核分數名稱");
assert.doesNotMatch(html, /教師整體表現|<th>教師整體<\/th>/, "不得再使用語意不清的教師整體表現名稱");
assert.match(html, /紅色虛線：學生自評/, "列印紅藍六角圖應標示學生自評圖例");
assert.match(html, /藍色實線：教師評核分數/, "列印紅藍六角圖應標示教師評核圖例");
assert.match(html, /scores: assessment\.student\.levels, color: ROLE_COLORS\.student, dash: \[7, 5\]/, "學生自評六角圖應使用虛線");
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
assert.match(html, /#e5484d/, "學生圖形應使用紅色");
assert.match(html, /#1769ff/, "教師圖形應使用藍色");
assert.match(html, /#1d6b50/, "絕對百分比圖形應使用綠色");
assert.match(html, /id="scoreDetailDialog"/, "教師六角圖應能開啟原始分項明細");
assert.match(html, /function openScoreDetail\(residentId\)/, "原始分項明細應由指定學生的六角圖開啟");
assert.match(html, /點擊查看 20 項原始評分/, "教師六角圖應提示可查看原始評分");
assert.match(html, /舊版資料僅供查看/, "既有 0–100 資料應保留為唯讀資料");
assert.match(html, /id="saveDraftButton"/, "教師評核表應提供暫存按鈕");
assert.match(html, /function saveTeacherDraft\(\)/, "教師評核暫存應有獨立儲存流程");
assert.match(html, /assessment\.teacherDraft = \{ teacherName, itemScores, levels, savedAt:/, "暫存應保存教師姓名、分項與 Level");
assert.match(html, /delete assessment\.teacherDraft/, "正式提交後應清除教師暫存");
assert.match(html, /itemScores: itemScores \? \[\.\.\.itemScores\]/, "稽核事件應保存教師分項快照");
assert.match(html, /levels: levels \? \[\.\.\.levels\]/, "稽核事件應保存 Level 快照");
assert.match(html, /ASSESSMENT_ITEMS\.map\(\(item\) => `\$\{item\.code\} 分項`\)/, "CSV 應匯出 20 個分項");
assert.match(html, /localStorage\.setItem/, "公開預覽版應在瀏覽器保存資料");

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

const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
assert.equal(scripts.length, 1, "應只有一段應用程式腳本");
new Function(scripts[0][1]);

console.log("PASS: static contract and JavaScript syntax verified");
