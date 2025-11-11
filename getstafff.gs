function doGet(e) {
  // === CONFIGURATION ===
  const SPREADSHEET_ID = "1AbxJn9_1SGR_3UF31DBvnKG1IbntZvSUKWo-MEqHt2k";
  const SHEET_ID = 1513580828; // GID of the target sheet
  const TARGET_COLUMNS = ["Hcf", "Staff Name and Designation"]; // columns to extract

  // === OPEN SHEET BY ID ===
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheets().find(s => s.getSheetId() === SHEET_ID);

  if (!sheet) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: "Sheet not found with given GID" })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  // === READ DATA ===
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) {
    return ContentService.createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // === Extract headers ===
  const headers = data.shift();

  // Map target columns to their indexes
  const colIndexes = TARGET_COLUMNS.map(col => headers.indexOf(col)).filter(i => i !== -1);

  if (colIndexes.length === 0) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: "Target columns not found" })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  // === Convert to JSON using only selected columns ===
  const filteredData = data.map(row => {
    const record = {};
    colIndexes.forEach((i, idx) => record[TARGET_COLUMNS[idx]] = row[i]);
    return record;
  });

  // === RETURN JSON RESPONSE ===
  return ContentService
    .createTextOutput(JSON.stringify(filteredData))
    .setMimeType(ContentService.MimeType.JSON);
}
