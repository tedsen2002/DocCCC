import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("./index.html", import.meta.url), "utf8");

assert.match(html, /<title>CCC 核心能力評分<\/title>/, "頁面標題應存在");
assert.match(html, /<button class="tab active" data-tab="assessment" type="button">六大核心<\/button>/, "原評分作業頁簽應改名為六大核心");
assert.match(html, /data-tab="ccc"/, "應有獨立 CCC 評核表分頁");
assert.match(html, /id="panel-ccc"/, "CCC 評核表應有獨立頁面容器");
assert.match(html, /data-tab="roster"/, "應有名單設定分頁");
assert.match(html, /data-tab="audit"/, "應有稽核紀錄分頁");
assert.match(html, /id="exportDataButton"[^>]*>匯出資料<\/button>/, "右上角應提供完整資料匯出按鈕");
assert.match(html, /id="importDataButton"[^>]*>匯入資料<\/button>/, "右上角應提供完整資料匯入按鈕");
assert.match(html, /id="importDataInput" type="file" accept="\.json,application\/json" hidden/, "匯入按鈕應使用隱藏的 JSON 檔案選擇器");
assert.match(html, /function exportDataBackup\(\)/, "應提供完整 JSON 備份匯出流程");
assert.match(html, /async function importDataBackup\(event\)/, "應提供完整 JSON 備份匯入流程");
assert.match(html, /取代目前瀏覽器內的所有資料/, "匯入取代現有資料前應明確警告使用者");
assert.match(html, /elements\.importDataInput\.addEventListener\("change", importDataBackup\)/, "選取備份檔後應啟動匯入流程");
assert.match(html, /const SCHEMA_VERSION = 7/, "期別刪除稽核加入後應使用 schema v7");
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
assert.match(html, /assessment\?\.cccDraft/, "CCC 草稿存在時不得移除名單人員");
assert.match(html, /assessment\?\.cccSubmission/, "CCC 正式提交存在時不得移除名單人員");
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

assert.match(html, /function renderCCCForm\(period\)/, "CCC 評核表應依目前期別名單產生表單");
assert.match(html, /period\?\.residents \|\| \[\]/, "CCC 評核表學生選項應來自該期名單快照");
assert.match(html, /function cccCoreMetrics\(assessment\)/, "CCC 六大核心分數應有獨立資料對應流程");
assert.match(html, /teacherDomainMetrics\(teacher\.itemScores\)/, "CCC 六大核心分數應沿用綠色六角圖的教師百分比");
assert.match(html, /function cccCoreScore\(assessment, metrics\)/, "六大核心考核表應沿用前頁 20 小項總分");
assert.match(html, /return itemScores\.reduce\(\(total, score\) => total \+ Number\(score\), 0\)/, "CCC 核心總分應直接加總教師 20 小項");
assert.match(html, /不再平均六個百分比/, "CCC 頁面應明示六軸百分比不再用於重算總分");
assert.doesNotMatch(html, /未加權六項平均/, "CCC 頁面不得再把六軸算術平均誤稱為核心總分");
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
assert.match(html, /"CCC 六大核心總分", "CCC 綜合總分", "CCC 結論"/, "CCC 提交稽核資料應可隨 CSV 匯出");
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

function extractFunction(name) {
  const match = scripts[0][1].match(new RegExp(`    (?:async )?function ${name}\\([\\s\\S]*?\\n    \\}`));
  assert.ok(match, `應可抽取 ${name} 做實際邏輯驗證`);
  return match[0];
}

assert.doesNotMatch(extractFunction("renamePeriod"), /password|addAuditEvent/, "更改期別名稱不得要求密碼或新增稽核事件");

const backupLogic = new Function(`
  const DATA_BACKUP_APP = "DocCCC";
  const DATA_BACKUP_VERSION = 1;
  const SCHEMA_VERSION = 7;
  const RESIDENT_LEVELS = ["R1", "R2", "R3", "R4"];
  const ITEM_MAX_SCORE = 5;
  const COMPETENCIES = Array.from({ length: 6 }, () => ({}));
  const ASSESSMENT_ITEMS = Array.from({ length: 20 }, () => ({}));
  const migrateState = (saved) => saved ? { ...saved, schemaVersion: SCHEMA_VERSION } : null;
  ${extractFunction("createDataBackup")}
  ${extractFunction("validDataBackupState")}
  ${extractFunction("parseDataBackup")}
  return { createDataBackup, parseDataBackup };
`)();
const backupState = {
  schemaVersion: 7,
  periods: [{
    id: "period-1", name: "2026 年第 2 期", residents: [{ id: "r1", level: "R1", name: "測試醫師" }],
    assessments: { r1: { student: { levels: [3, 3, 3, 3, 3, 3], submittedAt: "2026-08-10T07:00:00.000Z" }, teacher: null, cccDraft: { comments: "保留草稿" } } }
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
const deletionAuditBackup = structuredClone(backupPayload);
deletionAuditBackup.data.auditLog.push({ type: "period-deletion", role: null, periodName: "已刪除期別", occurredAt: "2026-08-10T08:30:00.000Z" });
assert.equal(backupLogic.parseDataBackup(JSON.stringify(deletionAuditBackup)).auditLog.at(-1).type, "period-deletion", "含期別刪除事件的備份應可還原");
assert.throws(() => backupLogic.parseDataBackup("{}"), /有效的 DocCCC 備份/, "不得匯入其他 JSON 檔案");
assert.throws(
  () => backupLogic.parseDataBackup(JSON.stringify({ ...backupPayload, schemaVersion: 8 })),
  /較新版 DocCCC/,
  "不得用舊版網頁匯入較新 schema 的備份"
);
const unsafeBackup = structuredClone(backupPayload);
unsafeBackup.data.periods[0].residents[0].id = 'r1" onclick="alert(1)';
assert.throws(() => backupLogic.parseDataBackup(JSON.stringify(unsafeBackup)), /格式不正確/, "匯入時應拒絕不安全的資料識別碼");

const replacedBackupState = new Function(`
  let state = { marker: "old" };
  let selectedCCCResidentId = "old-resident";
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
  return { state, importedState, selectedCCCResidentId, activeScoreContext, activeModifyContext, activeDeletePeriodId, activeRenamePeriodId, auditUnlocked, persistCount, renderCount, replaced };
`)();
assert.equal(replacedBackupState.replaced, true, "有效匯入應回報已完成取代");
assert.strictEqual(replacedBackupState.state, replacedBackupState.importedState, "匯入應以備份完整取代目前瀏覽器狀態");
assert.equal(replacedBackupState.persistCount, 1, "匯入資料應寫入瀏覽器儲存一次");
assert.equal(replacedBackupState.renderCount, 1, "匯入完成後應重新渲染畫面");
assert.equal(replacedBackupState.selectedCCCResidentId, null, "匯入後應清除舊瀏覽器的 CCC 人員選取狀態");
assert.equal(replacedBackupState.activeScoreContext, null, "匯入後應清除舊評分操作狀態");
assert.equal(replacedBackupState.activeModifyContext, null, "匯入後應清除舊修改操作狀態");
assert.equal(replacedBackupState.activeDeletePeriodId, null, "匯入後應清除舊期別刪除操作狀態");
assert.equal(replacedBackupState.activeRenamePeriodId, null, "匯入後應清除舊期別重新命名狀態");
assert.equal(replacedBackupState.auditUnlocked, false, "匯入後應重新鎖定稽核紀錄頁");

const rejectedBackupReplacement = new Function(`
  let state = { marker: "old" };
  let selectedCCCResidentId = "old-resident";
  let activeScoreContext = { open: true };
  let activeModifyContext = { open: true };
  let renderCount = 0;
  const persist = () => false;
  const render = () => { renderCount += 1; };
  ${extractFunction("replaceStateFromBackup")}
  const replaced = replaceStateFromBackup({ marker: "imported" });
  return { state, selectedCCCResidentId, renderCount, replaced };
`)();
assert.equal(rejectedBackupReplacement.replaced, false, "瀏覽器無法保存時不得誤報匯入成功");
assert.equal(rejectedBackupReplacement.state.marker, "old", "匯入寫入失敗時應保留原本資料");
assert.equal(rejectedBackupReplacement.selectedCCCResidentId, "old-resident", "匯入失敗時不得清除目前操作狀態");
assert.equal(rejectedBackupReplacement.renderCount, 0, "匯入失敗時不得渲染未保存的備份資料");

const importHandlerResult = await new Function(`
  let importedState = null;
  let confirmation = "";
  let toast = "";
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
        assessments: { r1: { student: {}, teacher: {}, teacherDraft: {}, cccDraft: {}, cccSubmission: {} } }
      },
      { id: "p2", name: "2026 年第 2 期", residents: [], assessments: {} }
    ],
    selectedPeriodId: "p1",
    auditLog: [{ id: "existing-audit", type: "submission" }]
  };
  let activeDeletePeriodId = "p1";
  let selectedCCCResidentId = "r1";
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
  return { state, selectedCCCResidentId, persistCount, renderCount, elements, toasts, afterWrongPassword, afterLastPeriodAttempt };
`)();
assert.deepEqual(deletedPeriod.afterWrongPassword, { periodCount: 2, auditCount: 1, persistCount: 0 }, "錯誤管理密碼不得刪除期別或新增稽核事件");
assert.deepEqual(deletedPeriod.state.periods.map((period) => period.id), ["p2"], "正確管理密碼應只刪除指定期別");
assert.equal(deletedPeriod.state.selectedPeriodId, "p2", "刪除目前期別後應選取相鄰期別");
assert.equal(deletedPeriod.state.auditLog[0].id, "existing-audit", "刪除期別不得覆蓋既有稽核紀錄");
assert.equal(deletedPeriod.state.auditLog[1].type, "period-deletion", "刪除期別後應附加專屬稽核事件");
assert.deepEqual(
  deletedPeriod.state.auditLog[1].periodSummary,
  { residentCount: 1, studentSubmissionCount: 1, teacherSubmissionCount: 1, teacherDraftCount: 1, cccDraftCount: 1, cccSubmissionCount: 1 },
  "期別刪除事件應保存刪除前的名單、提交與草稿數量"
);
assert.equal(deletedPeriod.selectedCCCResidentId, null, "刪除期別後應清除 CCC 人員選取狀態");
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

const coreScoreLogic = new Function(`
  const ITEM_MAX_SCORE = 5;
  const COMPETENCIES = [
    ["PC", 8], ["MK", 2], ["PROF", 2], ["PBLI", 2], ["ICS", 3], ["SBP", 3]
  ].map(([code, count]) => ({ code, name: code, items: Array.from({ length: count }, () => ({})) }));
  const ASSESSMENT_ITEMS = COMPETENCIES.flatMap((competency) => competency.items);
  ${extractFunction("validItemScores")}
  ${extractFunction("teacherDomainMetrics")}
  ${extractFunction("cccCoreMetrics")}
  ${extractFunction("cccCoreScore")}
  return { teacherDomainMetrics, cccCoreScore };
`)();
const discrepancyItemScores = [5, 4, 4, 4, 4, 4, 4, 4, 3, 2, 3, 3, 3, 3, 4, 3, 3, 4, 4, 3];
const discrepancyAssessment = { teacher: { itemScores: discrepancyItemScores } };
const discrepancyMetrics = coreScoreLogic.teacherDomainMetrics(discrepancyItemScores);
const misleadingAxisAverage = Math.round(discrepancyMetrics.reduce((total, metric) => total + metric.percent, 0) / discrepancyMetrics.length * 10) / 10;
assert.equal(misleadingAxisAverage, 65.5, "六軸百分比等權平均可得到與前頁總分不同的 65.5");
assert.equal(coreScoreLogic.cccCoreScore(discrepancyAssessment, discrepancyMetrics), 71, "CCC 應沿用前頁 20 小項加總的 71 分");

const mapCoreScores = new Function(`
  const COMPETENCIES = ["PC", "MK", "PROF", "PBLI", "ICS", "SBP"].map((code) => ({ code, name: code }));
  const validItemScores = () => true;
  const teacherDomainMetrics = () => COMPETENCIES.map((competency, index) => ({ ...competency, percent: 60 + index * 5 }));
  ${extractFunction("cccCoreMetrics")}
  return cccCoreMetrics;
`)();
assert.deepEqual(
  mapCoreScores({ teacher: { itemScores: [5] } }).map((metric) => metric.score),
  [60, 65, 70, 75, 80, 85],
  "CCC 六大核心欄位應採用六角圖相同的教師百分比，而非原始小計"
);

const renderedCCC = new Function(`
  const COMPETENCIES = ["PC", "MK", "PROF", "PBLI", "ICS", "SBP"].map((code) => ({ code, name: code }));
  const CCC_EPA_OPTIONS = [["L1", "L1"], ["L2", "L2"], ["L3", "L3"], ["L4", "L4"], ["L5", "L5"]];
  const CCC_BOOLEAN_OPTIONS = [["none", "無"], ["yes", "有"]];
  const CCC_SEVERITY_OPTIONS = [["mild", "輕微"], ["moderate", "中等"], ["severe", "嚴重"]];
  const CCC_CONCLUSION_OPTIONS = [["promotion", "可晉升"]];
  const CCC_FOLLOWUP_OPTIONS = [["next-ccc", "下次適任性評核"]];
  let selectedCCCResidentId = null;
  const elements = {
    cccResidentSelect: { innerHTML: "", disabled: false },
    cccEmpty: { hidden: true, innerHTML: "" },
    cccForm: { hidden: true, dataset: {}, innerHTML: "", classList: { toggle() {} }, querySelectorAll() { return []; } }
  };
  const residentFor = (period, residentId) => period.residents.find((resident) => resident.id === residentId);
  const cccCoreMetrics = () => COMPETENCIES.map((competency, index) => ({ ...competency, score: 60 + index * 8 }));
  const validItemScores = (scores) => scores.length === 20;
  const formatReadableTime = (value) => value;
  ${extractFunction("escapeHTML")}
  ${extractFunction("cccScoreValue")}
  ${extractFunction("formatCCCScore")}
  ${extractFunction("cccCoreScore")}
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
      teacher: { itemScores: [5, 4, 4, 4, 4, 4, 4, 4, 3, 2, 3, 3, 3, 3, 4, 3, 3, 4, 4, 3] },
      cccDraft: { treatmentPlanScore: 90, journalMeetingScore: 70, annualExamScore: 100 }
    } }
  };
  renderCCCForm(period);
  return elements;
`)();
assert.match(renderedCCC.cccResidentSelect.innerHTML, /R1　測試醫師/, "CCC 學生選單應實際渲染目前期別名單");
assert.equal((renderedCCC.cccForm.innerHTML.match(/class="ccc-section-heading"/g) || []).length, 9, "CCC 初稿應完整渲染 Word 的九個區塊");
assert.equal((renderedCCC.cccForm.innerHTML.match(/class="ccc-core-score"/g) || []).length, 6, "CCC 初稿應渲染六項核心能力分數");
assert.match(renderedCCC.cccForm.innerHTML, /六大核心原始總分　71 分/, "CCC 初稿應顯示與前頁相同的 71 分核心總分");
assert.match(renderedCCC.cccForm.innerHTML, /81\.3 分/, "CCC 初稿應使用 71 分核心總分計算綜合加權總分");
assert.match(renderedCCC.cccForm.innerHTML, /id="cccCoreContribution"[^>]*>21\.3<\/output>/, "CCC 表單應顯示 71 分核心總分的 30% 加權得分");

const savedCCC = new Function(`
  const selectedCCCResidentId = "r1";
  const period = { residents: [{ id: "r1", level: "R1", name: "測試醫師" }], assessments: { r1: {} } };
  const values = {
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
assert.equal(savedCCC.draft.epaLevel, "L4", "CCC 草稿應保存 EPA 勾選結果");
assert.equal(savedCCC.draft.comments, "整體表現良好", "CCC 草稿應整理並保存總評語");
assert.equal(savedCCC.draft.learnerFeedback, "持續精進", "CCC 草稿應保存學員省思與回饋");
assert.equal(savedCCC.draft.mentorName, "導師甲", "CCC 草稿應保存正式表需要的導師欄位");
assert.equal(savedCCC.persistCount, 1, "CCC 草稿應寫入瀏覽器持久狀態一次");
assert.equal(savedCCC.renderCount, 1, "CCC 草稿保存後應重新渲染目前學生表單");

const submittedCCC = new Function(`
  const selectedCCCResidentId = "r1";
  const period = {
    name: "2026 年第 1 期",
    residents: [{ id: "r1", level: "R1", name: "測試醫師" }],
    assessments: { r1: { teacher: { itemScores: Array(20).fill(4) }, cccDraft: { savedAt: "draft" } } }
  };
  const elements = { cccForm: { reportValidity: () => true } };
  const currentPeriod = () => period;
  const residentFor = (targetPeriod, residentId) => targetPeriod.residents.find((resident) => resident.id === residentId);
  const cccCoreMetrics = () => [60, 70, 80, 90, 100, 80].map((score, index) => ({ code: String(index), name: String(index), score }));
  const validItemScores = () => true;
  const readCCCForm = () => ({
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
  ${extractFunction("cccScoreValue")}
  ${extractFunction("cccCoreScore")}
  ${extractFunction("cccWeightedTotal")}
  ${extractFunction("currentCCCContext")}
  ${extractFunction("submitCCCForm")}
  submitCCCForm({ preventDefault() {} });
  return { assessment: period.assessments.r1, auditEvent, persistCount, renderCount };
`)();
assert.equal(submittedCCC.assessment.cccSubmission.coreScore, 80, "CCC 正式提交應保存前頁六大核心總分快照");
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
  const cccCoreMetrics = () => null;
  const cccCoreScore = () => null;
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
    coreScore: 80, treatmentPlanScore: 90, journalMeetingScore: 70, annualExamScore: 100, weightedTotal: 84,
    epaLevel: "L4", teaching: "yes", teachingNote: "教學", research: "none", passport: "yes", safety: "none",
    conclusion: "promotion", followUp: "next-ccc", comments: "總評語", learnerFeedback: "學員回饋", learnerSignature: "測試醫師",
    mentorName: "導師甲", mentorDate: "2026-08-10", educationLeadName: "負責人乙", educationLeadDate: "2026-08-10",
    chiefName: "主任丙", chiefDate: "2026-08-10", submittedAt: "2026-08-10T02:00:00.000Z"
  };
  return cccPrintReportMarkup(period, resident, record);
`)();
assert.match(cccPDFMarkup, /住院醫師核心能力適任性評核表/, "評核 PDF 應產生指定的正式標題");
assert.doesNotMatch(cccPDFMarkup, /CCC|草稿預覽|正式提交/, "評核 PDF 可見內容不得再出現 CCC 或草稿／提交狀態小字");
assert.match(cccPDFMarkup, /六大核心考核表[\s\S]*30%[\s\S]*80[\s\S]*24/, "CCC PDF 應同列顯示核心原始總分與 30% 加權得分");
assert.match(cccPDFMarkup, /綜合加權總分[\s\S]*84/, "CCC PDF 應顯示四項加總後的 84 分");
assert.match(cccPDFMarkup, /學員回饋/, "CCC PDF 應帶入學員省思與回饋");
assert.match(cccPDFMarkup, /導師甲[\s\S]*負責人乙[\s\S]*主任丙/, "CCC PDF 應帶入三層簽核欄位");

console.log("PASS: static contract and JavaScript syntax verified");
