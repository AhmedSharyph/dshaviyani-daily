// ======= CONFIG =======
const FACILITY_SHEETS = {
"2201": "1FEU6rVz-mM6z_TvqAkhBTVmEWdroGxRfwsJfBj6zZ4c", // Sh. Kanditheemu HC
"2202": "1ERbM5qjBZN6Jqr3s4rFGscxpMcegsd0x3UBIW-_VIQo", // Sh. Noomaraa HC
"2203": "1xtXPkgwPy0Atq7x2QasCRPvrCkoB4V--qCmt47r5tGo", // Sh. Goidhoo HC
"2204": "1EbqHJ14ECGgPopOE0c2BszLKzs-6DxGDEK2isqpxlGY", // Sh. Feydhoo HC
"2205": "131Ek50SuSpXC3xBOrn3OkagxlaJGK_7XvEjLJalLX0Y", // Sh. Feevaku HC
"2206": "1-WFi4Jv4vzvigmicHsLBsCf5Nyq8zbZxehQbB9oL2SE", // Sh. Bilehfahi HC
"2207": "1EVKsFq_Xmdds6w4E_B1rJsHUxcfWOf9BuQV_-oS_ckc", // Sh. Foakaidhoo HC
"2208": "1dibK9KXAKXLMeaaYUHUhN0HqI_C_UDmNteAsZq4cJg8", // Sh. Narudhoo HC
"2210": "1upSTXbiOj5L8FJ3Vvqy0fGZRJngm8wLRZzgvE6iKJBQ", // Sh. Maroshi HC
"2211": "1K0Dpc28gcReuT-veaEIX22-RMFra8gLcw5a_QMKCPzA", // Sh. Lhaimagu HC
"2213": "182H7TGWZbVwHG5KbyahbRNxvgA4mjDZGQNHxU75443s", // Sh. Komandoo HC
"2214": "1B9GHsYOf3UxlSm5aswUXGWjIhPLJhtPUgfSEYDohnzs", // Sh. Maaungoodhoo HC
"2215": "1TdwSIpZG-336jZbX03DpEn_p1KkoKFbnJZMz2jddDo4", // Sh. Atoll Hospital
"2216": "1-k5VPzHZrKYZ6hS8obHSg80BU9zgHda0YdJeYtoKUKY" // Sh. Milandhoo HC
};


/**
 * Handles form submission (POST)
 */
function doPost(e) {
  try {
    if (!e.parameter) throw new Error("No form data received");
    
    const data = e.parameter;
    const code = data.facility_code;

    if (!code || !FACILITY_SHEETS[code]) {
      return ContentService.createTextOutput("❌ Invalid facility code");
    }

    const ss = SpreadsheetApp.openById(FACILITY_SHEETS[code]);
    let sheet = ss.getSheetByName("Data");
    if (!sheet) sheet = ss.insertSheet("Data");

    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      const headers = ["timestamp", ...Object.keys(data)];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }

    // Fetch headers from row 1
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const reportDateIndex = headers.indexOf("report_date") + 1; // 1-based

    // Safe duplicate check
    const numRows = sheet.getLastRow() - 1; // exclude header
    let existingDates = [];
    if (numRows > 0) {
      existingDates = sheet.getRange(2, reportDateIndex, numRows, 1).getValues().flat();
    }

    if (existingDates.includes(data.report_date)) {
      return ContentService.createTextOutput("❌ Duplicate report_date not allowed");
    }

    // Timestamp
    const now = new Date();
    const pad = n => n.toString().padStart(2, '0');
    const formattedTimestamp = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

    // Map data to headers
    const row = headers.map(h => h === "timestamp" ? formattedTimestamp : (data[h] || ""));
    sheet.appendRow(row);

    return ContentService.createTextOutput("✅ Data added successfully");

  } catch (err) {
    return ContentService.createTextOutput("❌ Error: " + err.message);
  }
}

