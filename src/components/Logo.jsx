import React from 'react'

const Logo = ({ size = "md", showText = true }) => {
  const sizes = {
    sm: { container: 28, svg: 28, fontSize: "text-sm" },
    md: { container: 36, svg: 36, fontSize: "text-base" },
    lg: { container: 80, svg: 80, fontSize: "text-xl" },
  };

  const s = sizes[size];

  return (
    <div className="flex items-center gap-2">
      <svg
        width={s.svg}
        height={s.svg}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon
          points="18,2 32,10 32,26 18,34 4,26 4,10"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="1.5"
        />
        <rect
          x="9" y="9" width="18" height="18" rx="1.5"
          fill="none" stroke="#f59e0b" strokeWidth="1.2"
          transform="rotate(15, 18, 18)"
        />
        <rect
          x="9" y="9" width="18" height="18" rx="1.5"
          fill="none" stroke="#f59e0b" strokeWidth="0.5"
          opacity="0.25"
          transform="rotate(30, 18, 18)"
        />
        <text
          x="18" y="22"
          textAnchor="middle"
          fontFamily="'JetBrains Mono', 'Fira Code', monospace"
          fontSize="10" fontWeight="700"
          fill="#f59e0b"
        >
          JM
        </text>
      </svg>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-mono font-semibold text-white ${s.fontSize}`}>
            Portfolio
          </span>
          <span className="font-mono text-[10px] text-amber-500/60 tracking-[0.2em]">
            DEV
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
