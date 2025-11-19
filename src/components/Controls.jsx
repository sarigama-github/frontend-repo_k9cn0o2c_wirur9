import React from 'react'

function Controls({ onNumber, onErase, noteMode, setNoteMode, mistakes, onNewGame }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-9 gap-2">
        {[1,2,3,4,5,6,7,8,9].map(n => (
          <button key={n} onClick={() => onNumber(n)} className="py-3 rounded-lg bg-slate-800 text-white hover:bg-slate-700 active:scale-95 transition text-lg font-semibold">
            {n}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onErase} className="flex-1 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 active:scale-95 transition">Sil</button>
        <button onClick={() => setNoteMode(!noteMode)} className={`flex-1 py-2 rounded-lg ${noteMode ? 'bg-blue-500' : 'bg-slate-700'} text-white hover:opacity-90 active:scale-95 transition`}>
          Not Modu {noteMode ? 'Açık' : 'Kapalı'}
        </button>
      </div>
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>Hatalar: <b>{mistakes}</b></span>
        <button onClick={onNewGame} className="text-blue-600 hover:underline">Yeni Oyun</button>
      </div>
    </div>
  )
}

export default Controls
