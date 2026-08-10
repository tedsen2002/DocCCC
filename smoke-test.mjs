import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("./index.html", import.meta.url), "utf8");

assert.match(html, /<title>CCC 核心能力評分<\/title>/, "頁面標題應存在");
assert.match(html, /<button class="tab active" data-tab="assessment" type="button">六大核心<\/button>/, "原評分作業頁簽應改名為六大核心");
assert.match(html, /data-tab="ccc"/, "應有獨立 CCC 評核表分頁");
assert.match(html, /id="panel-ccc"/, "CCC 評核表應有獨立頁面容器");
assert.match(html, /data-tab="roster"/, "應有名單設定分頁");
assert.match(html, /data-tab="audit"/, "應有稽核紀錄分頁");
assert.match(html, /const SCHEMA_VERSION = 6/, "CCC 核心總分修正後應使用 schema v6");
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
assert.match(html, /放射腫瘤部 CCC 評核紀錄表/, "CCC PDF 應使用正式評核表標題");
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
  const match = scripts[0][1].match(new RegExp(`    function ${name}\\([\\s\\S]*?\\n    \\}`));
  assert.ok(match, `應可抽取 ${name} 做實際邏輯驗證`);
  return match[0];
}

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
  const CCC_FOLLOWUP_OPTIONS = [["next-ccc", "下次 CCC"]];
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
  const CCC_FOLLOWUP_OPTIONS = [["next-ccc", "下次 CCC"]];
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
assert.match(cccPDFMarkup, /放射腫瘤部 CCC 評核紀錄表/, "CCC PDF 應產生正式標題");
assert.match(cccPDFMarkup, /六大核心考核表[\s\S]*30%[\s\S]*80[\s\S]*24/, "CCC PDF 應同列顯示核心原始總分與 30% 加權得分");
assert.match(cccPDFMarkup, /綜合加權總分[\s\S]*84/, "CCC PDF 應顯示四項加總後的 84 分");
assert.match(cccPDFMarkup, /學員回饋/, "CCC PDF 應帶入學員省思與回饋");
assert.match(cccPDFMarkup, /導師甲[\s\S]*負責人乙[\s\S]*主任丙/, "CCC PDF 應帶入三層簽核欄位");

console.log("PASS: static contract and JavaScript syntax verified");
