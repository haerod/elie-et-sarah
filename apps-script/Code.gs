// Google Apps Script bound to the RSVP spreadsheet.
// Receives the RSVP form as JSON and appends one row per submission.

const SHEET_NAME = "RSVP";
const COLUMNS = [
  "date", "name", "email", "attending", "adults", "children",
  "guests", "diet", "brunch", "tipi", "message", "lang",
];

function doPost(e) {
  const data = JSON.parse(e.postData.contents);

  // Honeypot filled: silently drop bot submissions.
  if (data.website) return json({ ok: true });

  if (!data.name || !data.attending) return json({ ok: false, error: "missing name or attending" });

  const sheet = getSheet();
  const row = COLUMNS.map(col => (col === "date" ? new Date() : data[col] ?? ""));
  sheet.appendRow(row);
  return json({ ok: true });
}

function getSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow(COLUMNS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
