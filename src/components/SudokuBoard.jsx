import React from 'react'

function SudokuBoard({ grid, fixed, notes, selected, onSelect }) {
  const isBold = (i) => (i % 3 === 0 && i !== 0)

  return (
    <div className="grid grid-cols-9 gap-0 border-4 border-slate-700 rounded-lg overflow-hidden select-none">
      {grid.map((row, r) => (
        row.map((val, c) => {
          const sel = selected && selected[0] === r && selected[1] === c
          const inBlock = sel && true
          const showVal = val !== 0
          const sameNumber = selected && grid[selected[0]][selected[1]] !== 0 && grid[selected[0]][selected[1]] === val
          const cellNotes = notes?.[r]?.[c] || []
          return (
            <button
              key={`${r}-${c}`}
              onClick={() => onSelect(r, c)}
              className={[
                'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center',
                'bg-white text-slate-800',
                sel ? 'bg-blue-100 ring-2 ring-blue-400' : '',
                sameNumber && !sel ? 'bg-blue-50' : '',
                'relative',
                (c % 3 === 0) ? 'border-l-2 border-slate-700' : 'border-l border-slate-300',
                (r % 3 === 0) ? 'border-t-2 border-slate-700' : 'border-t border-slate-300',
                (c === 8) ? 'border-r-2 border-slate-700' : '',
                (r === 8) ? 'border-b-2 border-slate-700' : '',
              ].join(' ')}
            >
              {showVal ? (
                <span className={`font-bold ${fixed?.[r]?.[c] ? 'text-slate-900' : 'text-blue-700'}`}>{val}</span>
              ) : (
                <div className="grid grid-cols-3 gap-0.5 w-full h-full p-1">
                  {[1,2,3,4,5,6,7,8,9].map(n => (
                    <div key={n} className={`text-[8px] sm:text-[9px] md:text-[10px] leading-none text-slate-500 flex items-center justify-center ${cellNotes.includes(n) ? 'opacity-100' : 'opacity-30'}`}>{n}</div>
                  ))}
                </div>
              )}
            </button>
          )
        })
      ))}
    </div>
  )
}

export default SudokuBoard
