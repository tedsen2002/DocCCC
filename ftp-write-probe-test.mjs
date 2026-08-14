import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const probeHtml = readFileSync(new URL("./ftp-write-probe.html", import.meta.url), "utf8");
const scriptMatch = probeHtml.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(scriptMatch, "FTP 寫入測試頁應包含單一腳本");
const probeScript = scriptMatch[1];

assert.match(probeHtml, /只能使用可丟棄測試檔/, "測試頁應醒目禁止使用正式資料");
assert.match(probeHtml, /下載記憶中的原始備份/, "寫入前應保留可下載的原始位元組");
assert.match(probeScript, /window\.showOpenFilePicker\(/, "既有測試檔應使用安全的開啟選擇器");
assert.doesNotMatch(probeScript, /showSaveFilePicker/, "不得用另存選擇器開啟既有 JSON，以免選取時截成 0 KB");
assert.match(probeScript, /await requestWritePermission\(probeHandle\);[\s\S]*await writeAndVerify\(/, "第一次寫入應由明確點擊先要求 readwrite 權限");
assert.match(probeScript, /const before = await readHandleSnapshot\(handle\);[\s\S]*bytesEqual\(before\.bytes, expectedBytes\)/, "每次覆寫前應檢查遠端檔案是否遭到其他程式修改");
assert.match(probeScript, /const immediate = await readHandleSnapshot\(handle\);[\s\S]*const delayed = await readHandleSnapshot\(handle\);/, "寫入後應立即與延遲各讀回驗證一次");

function extractFunction(name) {
  const signature = new RegExp(`(?:async\\s+)?function\\s+${name}\\s*\\(`, "g");
  const match = signature.exec(probeScript);
  assert.ok(match, `應可抽取 ${name} 做真實邏輯測試`);
  const start = match.index;
  const bodyStart = probeScript.indexOf("{", signature.lastIndex);
  assert.notEqual(bodyStart, -1, `${name} 應有函式本體`);
  let depth = 0;
  let quote = "";
  let escaped = false;
  let templateDepth = 0;
  for (let index = bodyStart; index < probeScript.length; index += 1) {
    const character = probeScript[index];
    const previous = probeScript[index - 1];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (quote && character === "\\") {
      escaped = true;
      continue;
    }
    if (quote) {
      if (quote === "`" && character === "$" && probeScript[index + 1] === "{") {
        templateDepth += 1;
      } else if (quote === "`" && character === "}" && templateDepth > 0) {
        templateDepth -= 1;
      } else if (character === quote && (quote !== "`" || templateDepth === 0)) {
        quote = "";
      }
      continue;
    }
    if (character === '"' || character === "'" || character === "`") {
      quote = character;
      continue;
    }
    if (character === "/" && probeScript[index + 1] === "/") {
      const lineEnd = probeScript.indexOf("\n", index + 2);
      index = lineEnd === -1 ? probeScript.length : lineEnd;
      continue;
    }
    if (character === "/" && probeScript[index + 1] === "*") {
      const commentEnd = probeScript.indexOf("*/", index + 2);
      index = commentEnd === -1 ? probeScript.length : commentEnd + 1;
      continue;
    }
    if (character === "{") depth += 1;
    if (character === "}") {
      depth -= 1;
      if (depth === 0) return probeScript.slice(start, index + 1);
    }
    if (previous === "\\") escaped = false;
  }
  assert.fail(`無法找出 ${name} 的結尾`);
}

const core = new Function(`
  const TEST_FILENAME = "DocCCC-ftp-write-test.json";
  const PRODUCTION_FILENAME = "DocCCC-data.json";
  const PROBE_APP = "DocCCC-FTP-Write-Probe";
  const MAX_PROBE_BYTES = 1024 * 1024;
  const VERIFY_DELAY_MS = 750;
  ${extractFunction("encodeUtf8")}
  ${extractFunction("decodeUtf8")}
  ${extractFunction("bytesEqual")}
  ${extractFunction("makeProbeError")}
  ${extractFunction("validateProbeFilename")}
  ${extractFunction("parseDisposableProbe")}
  ${extractFunction("createNextProbeBytes")}
  ${extractFunction("readHandleSnapshot")}
  ${extractFunction("requestWritePermission")}
  ${extractFunction("writeAndVerify")}
  return {
    encodeUtf8, bytesEqual, validateProbeFilename, parseDisposableProbe,
    createNextProbeBytes, requestWritePermission, writeAndVerify
  };
`)();

assert.throws(
  () => core.validateProbeFilename("DocCCC-data.json"),
  (error) => error.code === "PRODUCTION_FILE",
  "正式資料檔名必須在取得內容或寫入前被拒絕"
);
assert.throws(
  () => core.validateProbeFilename("other.json"),
  (error) => error.code === "WRONG_FILENAME",
  "其他 JSON 也不得被測試頁誤寫"
);
assert.equal(core.validateProbeFilename("DocCCC-ftp-write-test.json"), true, "只允許固定的可丟棄測試檔名");

const initialBytes = core.encodeUtf8(`${JSON.stringify({
  app: "DocCCC-FTP-Write-Probe",
  disposable: true,
  probe: { sequence: 0 }
}, null, 2)}\n`);
assert.equal(core.parseDisposableProbe(initialBytes).disposable, true, "正確標記的測試檔可安全載入");
assert.throws(
  () => core.parseDisposableProbe(core.encodeUtf8('{"app":"DocCCC","data":{}}')),
  (error) => error.code === "NOT_DISPOSABLE",
  "即使改名，正式 DocCCC 備份內容也不得被當成可丟棄測試檔"
);

function mockHandle(startBytes) {
  let storedBytes = new Uint8Array(startBytes);
  let createWritableCount = 0;
  let permissionCount = 0;
  return {
    name: "DocCCC-ftp-write-test.json",
    get storedBytes() { return new Uint8Array(storedBytes); },
    get createWritableCount() { return createWritableCount; },
    get permissionCount() { return permissionCount; },
    async requestPermission(options) {
      permissionCount += 1;
      assert.deepEqual(options, { mode: "readwrite" });
      return "granted";
    },
    async getFile() {
      const snapshot = new Uint8Array(storedBytes);
      return {
        size: snapshot.byteLength,
        lastModified: 123,
        async arrayBuffer() {
          return snapshot.buffer.slice(snapshot.byteOffset, snapshot.byteOffset + snapshot.byteLength);
        }
      };
    },
    async createWritable() {
      createWritableCount += 1;
      let pending = null;
      return {
        async write(bytes) { pending = new Uint8Array(bytes); },
        async close() { storedBytes = new Uint8Array(pending); },
        async abort() { pending = null; }
      };
    },
    replace(bytes) { storedBytes = new Uint8Array(bytes); }
  };
}

const noWait = async () => {};
const handle = mockHandle(initialBytes);
assert.equal(await core.requestWritePermission(handle), "granted", "明確點擊流程應要求 readwrite 權限");
const firstBytes = core.createNextProbeBytes(initialBytes, 1, "2026-08-14T00:00:00.000Z", "first");
const firstResult = await core.writeAndVerify(handle, initialBytes, firstBytes, noWait);
assert.equal(handle.createWritableCount, 1, "第一次存檔應建立一次寫入串流");
assert.equal(core.bytesEqual(firstResult.delayed.bytes, firstBytes), true, "第一次存檔的延遲讀回應逐位元組一致");

const secondBytes = core.createNextProbeBytes(firstBytes, 2, "2026-08-14T00:01:00.000Z", "second");
const secondResult = await core.writeAndVerify(handle, firstBytes, secondBytes, noWait);
assert.equal(handle.createWritableCount, 2, "同一個檔案控制代碼應可直接執行第二次存檔");
assert.equal(core.bytesEqual(secondResult.delayed.bytes, secondBytes), true, "第二次存檔也應逐位元組讀回一致");

const conflictHandle = mockHandle(initialBytes);
conflictHandle.replace(firstBytes);
await assert.rejects(
  core.writeAndVerify(conflictHandle, initialBytes, secondBytes, noWait),
  (error) => error.code === "CONFLICT",
  "別的電腦改過檔案時必須停止覆寫"
);
assert.equal(conflictHandle.createWritableCount, 0, "衝突應在開啟寫入串流之前被攔截");

const delayedCorruptionHandle = mockHandle(initialBytes);
await assert.rejects(
  core.writeAndVerify(delayedCorruptionHandle, initialBytes, firstBytes, async () => {
    delayedCorruptionHandle.replace(core.encodeUtf8("corrupted"));
  }),
  (error) => error.code === "VERIFY_FAILED",
  "遠端檔案在延遲讀回時不一致不得誤報成功"
);

console.log("PASS: isolated FTP write probe safety and write logic verified");
