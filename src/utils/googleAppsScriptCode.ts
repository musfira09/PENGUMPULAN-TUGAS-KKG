export const GOOGLE_APPS_SCRIPT_TEMPLATE = `/**
 * ====================================================================
 * SKRIP GOOGLE APPS SCRIPT - PENGUMPULAN TUGAS KKG SD
 * Wilayah I Kecamatan Bontotiro, Kab. Bulukumba
 * Akun Admin: pakamril55@gmail.com
 * ====================================================================
 * 
 * PETUNJUK PEMASANGAN:
 * 1. Buat Google Spreadsheet baru di akun pakamril55@gmail.com
 *    Beri nama misalnya: "DATA PENGUMPULAN TUGAS KKG SD WILAYAH I"
 * 2. Klik menu "Ekstensi" (Extensions) > "Apps Script"
 * 3. Hapus semua kode default di editor, lalu TEMPEL seluruh kode ini.
 * 4. Klik ikon Disket (Simpan) di bagian atas.
 * 5. Klik tombol biru "Terapkan" (Deploy) > "Penerapan Baru" (New deployment).
 * 6. Pilih jenis: "Aplikasi Web" (Web app).
 * 7. Pada pengaturan:
 *    - Deskripsi: API Pengumpulan Tugas KKG SD
 *    - Jalankan sebagai (Execute as): Saya (pakamril55@gmail.com)
 *    - Siapa yang memiliki akses (Who has access): "Siapa saja" (Anyone)
 *      *PENTING: Pilih "Siapa saja" agar guru dapat mengirim tanpa login berbelit.
 * 8. Klik "Terapkan" (Deploy), berikan izin (Review Permissions > Akun Google > Advanced > Buka... > Allow).
 * 9. Salin URL Aplikasi Web yang berakhiran "/exec", lalu masukkan ke aplikasi web ini.
 */

const SHEET_NAME = "DATA PENGUMPULAN";

function setupSheetIfNeeded(ss) {
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  
  // Periksa apakah baris judul sudah ada
  if (sheet.getLastRow() === 0) {
    const headers = [
      "No",
      "Timestamp",
      "Nama Guru",
      "Nama Sekolah",
      "Tanggal Pelaksanaan KKG",
      "Materi KKG",
      "Link Tugas",
      "Keterangan",
      "Status"
    ];
    
    sheet.appendRow(headers);
    
    // Format Header agar rapi dan profesional
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#1e3a8a"); // Biru tua
    headerRange.setFontColor("#ffffff"); // Teks putih
    headerRange.setFontWeight("bold");
    headerRange.setHorizontalAlignment("center");
    headerRange.setVerticalAlignment("middle");
    sheet.setRowHeight(1, 38);
    sheet.setFrozenRows(1);
    
    // Border tipis
    headerRange.setBorder(true, true, true, true, true, true, "#0f172a", SpreadsheetApp.BorderStyle.SOLID);
  }
  
  return sheet;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  // Kunci eksekusi selama maksimal 15 detik agar tidak ada bentrok nomor baris jika guru mengirim bersamaan
  try {
    lock.waitLock(15000);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Server sedang sibuk, silakan coba beberapa detik lagi."
    })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = setupSheetIfNeeded(ss);
    
    let data;
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        data = e.parameter;
      }
    } else {
      data = e.parameter;
    }

    if (!data.nama || !data.sekolah || !data.materi || !data.linkTugas) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Kolom wajib belum lengkap. Pastikan Nama, Sekolah, Materi, dan Link Tugas telah terisi."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Nomor urut otomatis (baris terakhir saat ini)
    const lastRow = sheet.getLastRow();
    const no = lastRow; // karena baris 1 adalah header

    // Format Timestamp waktu Indonesia (WITA / GMT+8 - Sulawesi Selatan)
    const now = new Date();
    const formattedTimestamp = Utilities.formatDate(now, "GMT+8", "dd/MM/yyyy HH:mm:ss");

    // Tanggal KKG
    let formattedTanggalKkg = data.tanggalKkg || Utilities.formatDate(now, "GMT+8", "dd/MM/yyyy");
    
    // Jika format input adalah YYYY-MM-DD dari browser date input, ubah jadi dd/MM/yyyy
    if (formattedTanggalKkg.indexOf("-") > -1) {
      const parts = formattedTanggalKkg.split("-");
      if (parts.length === 3) {
        formattedTanggalKkg = parts[2] + "/" + parts[1] + "/" + parts[0];
      }
    }

    const cleanLink = (data.linkTugas || "").trim();
    const formulaLink = '=HYPERLINK("' + cleanLink + '"; "' + cleanLink + '")';
    const keterangan = (data.keterangan || "").trim() || "-";
    const status = "Terkumpul";

    // Masukkan baris baru secara terpisah: 1 Guru = 1 Baris, 1 Informasi = 1 Kolom
    const newRow = [
      no,
      formattedTimestamp,
      data.nama.trim(),
      data.sekolah.trim(),
      formattedTanggalKkg,
      data.materi.trim(),
      formulaLink,
      keterangan,
      status
    ];

    sheet.appendRow(newRow);

    const insertedRowIdx = sheet.getLastRow();
    const rowRange = sheet.getRange(insertedRowIdx, 1, 1, newRow.length);
    rowRange.setVerticalAlignment("middle");

    // Center alignment untuk kolom No, Tanggal, dan Status
    sheet.getRange(insertedRowIdx, 1).setHorizontalAlignment("center");
    sheet.getRange(insertedRowIdx, 2).setHorizontalAlignment("center");
    sheet.getRange(insertedRowIdx, 5).setHorizontalAlignment("center");
    sheet.getRange(insertedRowIdx, 9).setHorizontalAlignment("center");
    
    // Status warna hijau lembut
    sheet.getRange(insertedRowIdx, 9).setBackground("#dcfce7").setFontColor("#15803d").setFontWeight("bold");

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Data pengumpulan tugas Anda telah berhasil tersimpan.",
      data: {
        no: no,
        nama: data.nama.trim(),
        sekolah: data.sekolah.trim(),
        tanggalKkg: formattedTanggalKkg,
        materi: data.materi.trim(),
        timestamp: formattedTimestamp
      }
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Terjadi kesalahan pada Google Spreadsheet: " + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "active",
    application: "Pengumpulan Tugas KKG SD Wilayah I Kecamatan Bontotiro",
    admin: "pakamril55@gmail.com",
    sheetTarget: SHEET_NAME,
    message: "Layanan Google Apps Script aktif dan siap menerima kiriman formulir tugas."
  })).setMimeType(ContentService.MimeType.JSON);
}

// Fungsi pengujian langsung dari editor Apps Script (Opsional)
function testInput() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  setupSheetIfNeeded(ss);
  Logger.log("Sheet siap menerima data!");
}
`;
