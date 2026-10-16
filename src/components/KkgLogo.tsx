import React from 'react';

interface KkgLogoProps {
  className?: string;
  size?: number;
}

export const KkgLogo: React.FC<KkgLogoProps> = ({ className = 'w-16 h-16', size = 120 }) => {
  return (
    <svg
      viewBox="0 0 500 500"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Logo KKG SD Wilayah I Kecamatan Bontotiro"
    >
      <defs>
        {/* Curved text path for top header */}
        <path
          id="topTextCurve"
          d="M 60,250 A 190,190 0 1,1 440,250"
          fill="none"
        />
        {/* Curved text path for bottom banner */}
        <path
          id="bottomTextCurve"
          d="M 100,380 A 190,190 0 0,0 400,380"
          fill="none"
        />
        {/* Gradient for flames and accents */}
        <linearGradient id="torchGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
        <linearGradient id="blueWingGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
      </defs>

      {/* Outer White Base Circle */}
      <circle cx="250" cy="250" r="240" fill="#ffffff" />

      {/* Outer Border with Navy Blue and Bottom Orange Arc */}
      <circle cx="250" cy="250" r="235" fill="none" stroke="#1d4ed8" strokeWidth="14" />
      <path
        d="M 45,300 A 235,235 0 0,0 455,300 A 235,235 0 0,1 45,300"
        fill="#f97316"
      />
      {/* Secondary accent inner ring */}
      <circle cx="250" cy="250" r="222" fill="none" stroke="#e2e8f0" strokeWidth="2" />

      {/* Top Arc Text: KELOMPOK KERJA GURU SEKOLAH DASAR */}
      <text
        fill="#1e3a8a"
        fontWeight="800"
        fontSize="21"
        letterSpacing="2.5"
        style={{ textTransform: 'uppercase', fontFamily: "'Plus Jakarta Sans', Arial, sans-serif" }}
      >
        <textPath href="#topTextCurve" startOffset="50%" textAnchor="middle">
          KELOMPOK KERJA GURU SEKOLAH DASAR
        </textPath>
      </text>

      {/* Left and Right 5-pointed decorative stars */}
      <g fill="#1e3a8a" stroke="#1e3a8a" strokeWidth="1">
        <polygon points="65,285 70,298 83,298 72,307 76,320 65,311 54,320 58,307 47,298 60,298" transform="scale(0.8) translate(15, 60)" />
        <polygon points="65,285 70,298 83,298 72,307 76,320 65,311 54,320 58,307 47,298 60,298" transform="scale(0.8) translate(530, 60)" />
      </g>

      {/* Background open pages outline subtle glow */}
      <path
        d="M 170,140 Q 250,165 330,140 L 345,300 Q 250,335 155,300 Z"
        fill="#fef3c7"
        opacity="0.35"
      />

      {/* Center Arch Title: KKG SD */}
      <g transform="translate(0, -5)">
        <text
          x="250"
          y="155"
          textAnchor="middle"
          fill="#f59e0b"
          stroke="#b45309"
          strokeWidth="3.5"
          fontWeight="900"
          fontSize="46"
          letterSpacing="4"
          style={{ fontFamily: "'Plus Jakarta Sans', Impact, sans-serif" }}
        >
          KKG SD
        </text>
      </g>

      {/* Sparkles / Twinkles above book figure */}
      <polygon points="275,175 277,180 282,182 277,184 275,189 273,184 268,182 273,180" fill="#94a3b8" />
      <polygon points="315,182 316,185 319,186 316,187 315,190 314,187 311,186 314,185" fill="#94a3b8" />

      {/* Stylized Figure: Golden Sun Head */}
      <circle cx="250" cy="205" r="16" fill="#f59e0b" />

      {/* Dynamic Figure Torso / Wings */}
      {/* Right blue wing */}
      <path
        d="M 255,225 C 275,235 295,210 300,185 C 295,215 275,250 255,260 Z"
        fill="url(#blueWingGrad)"
      />
      {/* Right orange flame */}
      <path
        d="M 252,240 C 270,250 285,235 285,220 C 280,240 265,262 250,270 Z"
        fill="url(#torchGrad)"
      />
      {/* Left blue wing */}
      <path
        d="M 245,225 C 225,235 205,210 200,185 C 205,215 225,250 245,260 Z"
        fill="url(#blueWingGrad)"
      />

      {/* Center Open Book Pages (Blue and Cyan Layers) */}
      {/* Left Page Outer Dark Blue */}
      <path
        d="M 250,295 C 205,285 160,290 145,295 L 180,245 C 198,245 228,245 250,255 Z"
        fill="#1e40af"
      />
      {/* Right Page Outer Dark Blue */}
      <path
        d="M 250,295 C 295,285 340,290 355,295 L 320,245 C 302,245 272,245 250,255 Z"
        fill="#1e40af"
      />
      {/* Left Page Inner Sky Blue */}
      <path
        d="M 250,285 C 215,275 180,280 165,285 L 195,250 C 210,250 230,250 250,260 Z"
        fill="#38bdf8"
      />
      {/* Right Page Inner Sky Blue */}
      <path
        d="M 250,285 C 285,275 320,280 335,285 L 305,250 C 290,250 270,250 250,260 Z"
        fill="#38bdf8"
      />

      {/* Book Spine Center notch */}
      <path d="M 250,250 L 250,298" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />

      {/* Cupping Caring Hands at the bottom (Orange) */}
      {/* Left hand */}
      <path
        d="M 250,370 C 215,355 175,325 160,305 C 175,315 210,335 240,325 C 210,340 180,330 170,320 C 190,345 225,365 250,370 Z"
        fill="#ea580c"
      />
      {/* Right hand */}
      <path
        d="M 250,370 C 285,355 325,325 340,305 C 325,315 290,335 260,325 C 290,340 320,330 330,320 C 310,345 275,365 250,370 Z"
        fill="#ea580c"
      />
      {/* Soft warm inner glow */}
      <ellipse cx="250" cy="335" rx="55" ry="12" fill="#fed7aa" opacity="0.6" />

      {/* Sub-text: WILAYAH I */}
      <text
        x="250"
        y="405"
        textAnchor="middle"
        fill="#1e3a8a"
        fontWeight="900"
        fontSize="30"
        letterSpacing="3"
        style={{ fontFamily: "'Plus Jakarta Sans', Arial, sans-serif" }}
      >
        WILAYAH I
      </text>

      {/* Bottom Ribbon / Arc: KECAMATAN BONTOTIRO */}
      <text
        fill="#1e3a8a"
        fontWeight="800"
        fontSize="24"
        letterSpacing="2"
        style={{ textTransform: 'uppercase', fontFamily: "'Plus Jakarta Sans', Arial, sans-serif" }}
      >
        <textPath href="#bottomTextCurve" startOffset="50%" textAnchor="middle">
          KECAMATAN BONTOTIRO
        </textPath>
      </text>
    </svg>
  );
};
