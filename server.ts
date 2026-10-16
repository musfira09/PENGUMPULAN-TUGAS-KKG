import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Ensure data folder and config/submission files exist
const DATA_DIR = path.resolve(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const CONFIG_FILE = path.join(DATA_DIR, 'config.json');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');

interface ServerConfig {
  googleAppsScriptUrl: string;
  adminEmail: string;
}

interface SubmissionItem {
  id: string;
  no: number;
  timestamp: string;
  nama: string;
  sekolah: string;
  tanggalKkg: string;
  materi: string;
  linkTugas: string;
  keterangan: string;
  status: 'Terkumpul';
  syncedToSheets: boolean;
  sheetsError?: string;
}

function loadConfig(): ServerConfig {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading config file:', err);
  }
  return {
    googleAppsScriptUrl: process.env.GOOGLE_APPS_SCRIPT_URL || '',
    adminEmail: process.env.ADMIN_EMAIL || 'pakamril55@gmail.com'
  };
}

function saveConfig(config: ServerConfig) {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving config file:', err);
  }
}

function loadSubmissions(): SubmissionItem[] {
  try {
    if (fs.existsSync(SUBMISSIONS_FILE)) {
      const raw = fs.readFileSync(SUBMISSIONS_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading submissions:', err);
  }
  return [];
}

function saveSubmissions(items: SubmissionItem[]) {
  try {
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving submissions:', err);
  }
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ================= API ENDPOINTS =================

// 1. Get current config
app.get('/api/config', (_req: Request, res: Response) => {
  const config = loadConfig();
  const submissions = loadSubmissions();
  const pendingCount = submissions.filter(s => !s.syncedToSheets).length;

  res.json({
    status: 'success',
    googleAppsScriptUrl: config.googleAppsScriptUrl,
    isConfigured: Boolean(config.googleAppsScriptUrl && config.googleAppsScriptUrl.trim().length > 0),
    adminEmail: config.adminEmail,
    totalSubmissions: submissions.length,
    pendingSyncCount: pendingCount
  });
});

// 2. Update config (for Admin setting Apps Script Web App URL)
app.post('/api/config', (req: Request, res: Response) => {
  const { googleAppsScriptUrl, adminEmail } = req.body;
  const current = loadConfig();

  if (typeof googleAppsScriptUrl === 'string') {
    current.googleAppsScriptUrl = googleAppsScriptUrl.trim();
  }
  if (typeof adminEmail === 'string' && adminEmail.trim()) {
    current.adminEmail = adminEmail.trim();
  }

  saveConfig(current);
  res.json({
    status: 'success',
    message: 'Pengaturan berhasil disimpan.',
    config: current
  });
});

// 3. Submit form (The core endpoint)
app.post('/api/submit', async (req: Request, res: Response) => {
  try {
    const { nama, sekolah, tanggalKkg, materi, linkTugas, keterangan } = req.body;

    // Strict validation
    if (!nama || !sekolah || !tanggalKkg || !materi || !linkTugas) {
      return res.status(400).json({
        status: 'error',
        message: 'Mohon lengkapi semua kolom wajib (Nama, Sekolah, Tanggal KKG, Materi, dan Link Tugas).'
      });
    }

    // Link URL validation
    const trimmedLink = linkTugas.trim();
    if (!trimmedLink.startsWith('http://') && !trimmedLink.startsWith('https://')) {
      return res.status(400).json({
        status: 'error',
        message: 'Format link tidak valid. Link harus diawali dengan https:// atau http://'
      });
    }

    const config = loadConfig();
    const submissions = loadSubmissions();
    const newNo = submissions.length + 1;

    // Date & Timestamp formatting in WITA (GMT+8)
    const now = new Date();
    // Format timestamp: dd/MM/yyyy HH:mm
    const dateFormatted = new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Makassar',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(now).replace(/\./g, ':');

    // Tanggal KKG format for spreadsheet (dd/MM/yyyy)
    let formattedTanggalKkg = tanggalKkg;
    if (tanggalKkg.includes('-')) {
      const parts = tanggalKkg.split('-');
      if (parts.length === 3) {
        formattedTanggalKkg = `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    }

    const newRecord: SubmissionItem = {
      id: 'TGS-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
      no: newNo,
      timestamp: dateFormatted,
      nama: nama.trim(),
      sekolah: sekolah.trim(),
      tanggalKkg: formattedTanggalKkg,
      materi: materi.trim(),
      linkTugas: trimmedLink,
      keterangan: (keterangan || '').trim() || '-',
      status: 'Terkumpul',
      syncedToSheets: false
    };

    let sheetsErrorMsg = '';

    // If Google Apps Script URL is configured, forward immediately
    if (config.googleAppsScriptUrl && config.googleAppsScriptUrl.trim().startsWith('http')) {
      try {
        const payload = {
          no: newNo,
          nama: newRecord.nama,
          sekolah: newRecord.sekolah,
          tanggalKkg: newRecord.tanggalKkg,
          materi: newRecord.materi,
          linkTugas: newRecord.linkTugas,
          keterangan: newRecord.keterangan
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

        const response = await fetch(config.googleAppsScriptUrl.trim(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload),
          redirect: 'follow',
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          newRecord.syncedToSheets = true;
        } else {
          sheetsErrorMsg = `HTTP ${response.status}: ${response.statusText}`;
          newRecord.sheetsError = sheetsErrorMsg;
        }
      } catch (err: any) {
        console.error('Forward to Google Apps Script failed:', err);
        sheetsErrorMsg = err?.message || 'Gagal menghubungi Google Apps Script';
        newRecord.sheetsError = sheetsErrorMsg;
      }
    } else {
      // Not yet configured; saved securely in server storage
      newRecord.sheetsError = 'URL Google Apps Script belum disetel oleh admin';
    }

    submissions.push(newRecord);
    saveSubmissions(submissions);

    return res.json({
      status: 'success',
      message: 'Data pengumpulan tugas Anda telah berhasil tersimpan.',
      data: {
        id: newRecord.id,
        no: newRecord.no,
        nama: newRecord.nama,
        sekolah: newRecord.sekolah,
        tanggalKkg: newRecord.tanggalKkg,
        materi: newRecord.materi,
        linkTugas: newRecord.linkTugas,
        timestamp: newRecord.timestamp,
        syncedToSheets: newRecord.syncedToSheets,
        notice: newRecord.syncedToSheets
          ? 'Tersimpan langsung di Google Spreadsheet Admin.'
          : 'Tersimpan aman di server lokal dan siap disinkronkan ke Spreadsheet.'
      }
    });
  } catch (error: any) {
    console.error('Error handling submission:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Pengiriman gagal. Periksa koneksi internet Anda dan coba kembali.'
    });
  }
});

// 4. Batch sync pending submissions to Google Sheets
app.post('/api/sync', async (_req: Request, res: Response) => {
  const config = loadConfig();
  if (!config.googleAppsScriptUrl) {
    return res.status(400).json({
      status: 'error',
      message: 'URL Google Apps Script belum dikonfigurasi.'
    });
  }

  const submissions = loadSubmissions();
  const pending = submissions.filter(s => !s.syncedToSheets);

  if (pending.length === 0) {
    return res.json({
      status: 'success',
      message: 'Semua data tugas sudah tersinkron ke Google Sheets.',
      syncedCount: 0
    });
  }

  let syncedCount = 0;
  for (const item of pending) {
    try {
      const payload = {
        no: item.no,
        nama: item.nama,
        sekolah: item.sekolah,
        tanggalKkg: item.tanggalKkg,
        materi: item.materi,
        linkTugas: item.linkTugas,
        keterangan: item.keterangan
      };

      const resp = await fetch(config.googleAppsScriptUrl.trim(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        redirect: 'follow'
      });

      if (resp.ok) {
        item.syncedToSheets = true;
        delete item.sheetsError;
        syncedCount++;
      }
    } catch (err) {
      console.error(`Sync failed for item ${item.id}:`, err);
    }
  }

  saveSubmissions(submissions);

  return res.json({
    status: 'success',
    message: `Berhasil menyinkronkan ${syncedCount} dari ${pending.length} data tugas ke Google Spreadsheet.`,
    syncedCount,
    remainingPending: pending.length - syncedCount
  });
});

// 5. Read recent submissions list (Admin only)
app.get('/api/submissions', (_req: Request, res: Response) => {
  const submissions = loadSubmissions();
  res.json({
    status: 'success',
    count: submissions.length,
    submissions: submissions.slice(-50).reverse() // Latest 50
  });
});

// ================= VITE DEV OR PRODUCTION STATIC SERVE =================
async function startServer() {
  if (!isProduction) {
    // Dynamic import for Vite dev middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve built static files from dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server KKG SD Wilayah I Bontotiro running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
