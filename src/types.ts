export interface SubmissionFormData {
  nama: string;
  sekolah: string;
  tanggalKkg: string; // ISO date string (YYYY-MM-DD) or Indonesian format
  materi: string;
  linkTugas: string;
  keterangan?: string;
}

export interface SubmissionRecord extends SubmissionFormData {
  id: string;
  no?: number;
  timestamp: string; // formatted e.g. "16/10/2026 21:50:00"
  status: 'Terkumpul';
  syncedToSheets: boolean;
  sheetsError?: string;
}

export interface AppConfig {
  googleAppsScriptUrl: string;
  adminEmail: string;
  lastUpdated?: string;
}
