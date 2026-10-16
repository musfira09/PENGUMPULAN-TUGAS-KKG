export const DEFAULT_ADMIN_EMAIL = 'pakamril55@gmail.com';

export const WILAYAH_NAME = 'WILAYAH I KECAMATAN BONTOTIRO';
export const APP_TITLE = 'Pengumpulan Tugas KKG SD';

export const SUGGESTED_SCHOOLS = [
  'SDN 140 Kalerasang',
  'SDN 139 Kalumpang',
  'SDN 138 Bontotangnga',
  'SDN 141 Bonto Bira',
  'SDN 142 Pakalu',
  'SDN 143 Tamallangka',
  'SDN 144 Hila-Hila',
  'SDN 145 Batang',
  'SDN 146 Karampuang',
  'SDN 147 Lamanda',
  'SDN 148 Bonto Baji',
  'SDN 149 Bonto Marannu',
  'SDN 150 Bonto Bulaeng'
];

export const SUGGESTED_MATERI = [
  'DIGITALISASI PEMBELAJARAN',
  'PENYUSUNAN MODUL AJAR KURIKULUM MERDEKA',
  'PEMBELAJARAN BERDIFERENSIASI',
  'ASESMEN DIAGNOSTIK & FORMATIF',
  'PEMANFAATAN CANVA UNTUK MEDIA AJAR',
  'PENGELOLAAN KINERJA GURU DI PMM',
  'PENGUATAN LITERASI & NUMERASI SD',
  'PEMBUATAN MEDIA PEMBELAJARAN KREATIF',
  'PROJEK PENGUATAN PROFIL PELAJAR PANCASILA (P5)'
];

// Format date to Indonesian text: e.g. "16 Okt 2026"
export function formatIndonesianDateDisplay(dateStr: string): string {
  if (!dateStr) return '';
  try {
    // If input is YYYY-MM-DD
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const monthIdx = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      return `${day} ${months[monthIdx] || ''} ${year}`;
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

// Format date to spreadsheet format: dd/MM/yyyy
export function formatSpreadsheetDate(dateStr: string): string {
  if (!dateStr) return '';
  if (dateStr.includes('-')) {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  }
  return dateStr;
}

// Get current date string in YYYY-MM-DD for standard date input
export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
