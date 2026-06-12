import React from 'react'

export default function SkillBadge({ name, category, level }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/40 p-3 hover:bg-zinc-900/80 hover:border-zinc-700 transition-all">
      <span className="text-sm font-semibold text-zinc-100">{name}</span>
      <div className="flex items-center justify-between text-[11px] text-zinc-400">
        <span className="bg-zinc-800/60 px-1.5 py-0.5 rounded text-zinc-300">
          {category}
        </span>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${
                i < level
                  ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]'
                  : 'bg-zinc-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
