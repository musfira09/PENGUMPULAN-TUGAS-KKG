import React from 'react';
import { KkgLogo } from './KkgLogo';
import { ShieldCheck, MapPin } from 'lucide-react';
import { WILAYAH_NAME, APP_TITLE } from '../utils/constants';

interface HeaderProps {
  onOpenAdmin: () => void;
  isConfigured: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAdmin, isConfigured }) => {
  return (
    <header className="relative bg-gradient-to-b from-[#0a1b3d] via-[#0f2557] to-[#1e3a8a] text-white pt-6 pb-14 px-4 shadow-lg overflow-hidden border-b-4 border-orange-500">
      {/* Subtle decorative circles in background */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-1/2 -left-20 w-52 h-52 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-xl mx-auto">
        {/* Top bar with location tag & admin settings toggle */}
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-orange-200 border border-white/10">
            <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <span>Kec. Bontotiro, Kab. Bulukumba</span>
          </div>

          <button
            onClick={onOpenAdmin}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-slate-200 hover:text-white border border-white/15 cursor-pointer"
            title="Pengaturan Google Spreadsheet Admin"
          >
            <span className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>Info Admin</span>
          </button>
        </div>

        {/* Main Header Content */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3 transition-transform hover:scale-105 duration-200">
            <div className="absolute -inset-1.5 bg-orange-400/30 rounded-full blur-sm" />
            <div className="relative p-1 bg-white rounded-full shadow-lg ring-2 ring-orange-500">
              <KkgLogo size={88} className="w-20 h-20 sm:w-22 sm:h-22" />
            </div>
          </div>

          <div className="inline-block px-3 py-0.5 mb-1.5 bg-orange-500 text-white font-extrabold text-[11px] sm:text-xs tracking-wider rounded-md uppercase shadow-sm">
            {WILAYAH_NAME}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1.5 drop-shadow-sm">
            {APP_TITLE}
          </h1>

          <p className="text-xs sm:text-sm text-blue-100/90 max-w-md font-medium leading-relaxed">
            Portal resmi penyetoran tugas kegiatan KKG Guru Sekolah Dasar Wilayah I Kecamatan Bontotiro
          </p>

          <div className="mt-3 flex items-center gap-2 text-[11px] text-blue-200/80 bg-blue-900/40 px-3 py-1 rounded-full border border-blue-400/20">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Tersimpan otomatis ke Google Spreadsheet Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};
