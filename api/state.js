import { google } from "googleapis";

const SHEET_NAME = "State";

const DEFAULT_STATE = {
  assignments: [
    { id: "date-report", title: "데이트 보고서 제출", dueDate: "2026-08-01T22:00" },
  ],
  submission: {
    locked: false,
    attempt: 1,
    files: [],
    memo: "",
    lastModified: null,
  },
  notices: [],
};

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n");
  if (!email || !key) {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_PRIVATE_KEY 환경변수가 설정되지 않았습니다.",
    );
  }
  return new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

async function getSheetsClient() {
  const auth = getAuth();
  await auth.authorize();
  return google.sheets({ version: "v4", auth });
}

function getSheetId() {
  const id = process.env.GOOGLE_SHEET_ID;
  if (!id) throw new Error("GOOGLE_SHEET_ID 환경변수가 설정되지 않았습니다.");
  return id;
}

// user_id 행을 찾아 { rowNumber, data } 반환. 없으면 rowNumber: null.
async function readRow(sheets, userId) {
  const spreadsheetId = getSheetId();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${SHEET_NAME}!A2:B1000`,
  });
  const rows = res.data.values || [];
  const idx = rows.findIndex((r) => r[0] === userId);
  if (idx === -1) return { rowNumber: null, data: DEFAULT_STATE };
  try {
    const parsed = JSON.parse(rows[idx][1] || "{}");
    return {
      rowNumber: idx + 2,
      data: {
        assignments: parsed.assignments && parsed.assignments.length
          ? parsed.assignments
          : DEFAULT_STATE.assignments,
        submission: { ...DEFAULT_STATE.submission, ...(parsed.submission || {}) },
        notices: parsed.notices || [],
      },
    };
  } catch {
    return { rowNumber: idx + 2, data: DEFAULT_STATE };
  }
}

async function writeRow(sheets, userId, data, rowNumber) {
  const spreadsheetId = getSheetId();
  const values = [[userId, JSON.stringify(data)]];
  if (rowNumber) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${SHEET_NAME}!A${rowNumber}:B${rowNumber}`,
      valueInputOption: "RAW",
      requestBody: { values },
    });
  } else {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${SHEET_NAME}!A:B`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values },
    });
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    const sheets = await getSheetsClient();

    if (req.method === "GET") {
      const userId = req.query.user;
      if (!userId) {
        res.status(400).json({ error: "user 쿼리 파라미터가 필요합니다." });
        return;
      }
      const { data } = await readRow(sheets, userId);
      res.status(200).json(data);
      return;
    }

    if (req.method === "POST") {
      const body =
        typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
      const { user, data } = body;
      if (!user || !data) {
        res.status(400).json({ error: "user, data가 필요합니다." });
        return;
      }
      const { rowNumber } = await readRow(sheets, user);
      await writeRow(sheets, user, data, rowNumber);
      res.status(200).json(data);
      return;
    }

    res.status(405).json({ error: "허용되지 않은 메서드입니다." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String((err && err.message) || err) });
  }
};