import { useEffect, useMemo, useState } from 'react'
import SudokuBoard from './components/SudokuBoard'
import Controls from './components/Controls'
import Modal from './components/Modal'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function useDeviceId() {
  const [id, setId] = useState('')
  useEffect(() => {
    let d = localStorage.getItem('device_id')
    if (!d) {
      d = crypto.randomUUID()
      localStorage.setItem('device_id', d)
    }
    setId(d)
  }, [])
  return id
}

function formatTime(sec) {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':')
}

function App() {
  const deviceId = useDeviceId()
  const [loading, setLoading] = useState(false)
  const [difficulty, setDifficulty] = useState('easy')
  const [game, setGame] = useState(null)
  const [selected, setSelected] = useState(null)
  const [noteMode, setNoteMode] = useState(false)
  const [timer, setTimer] = useState(0)
  const [winOpen, setWinOpen] = useState(false)

  useEffect(() => {
    if (!deviceId) return
    // load existing
    fetch(`${API}/api/game/${deviceId}`).then(r => r.json()).then(data => {
      if (data.status === 'ok') {
        setGame(data.gamestate)
        setTimer(data.gamestate.elapsed_seconds || 0)
      }
    })
  }, [deviceId])

  useEffect(() => {
    if (!game || game.is_completed) return
    const id = setInterval(() => {
      setTimer(t => {
        const nx = t + 1
        fetch(`${API}/api/timer`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ device_id: deviceId, elapsed_seconds: nx })})
        return nx
      })
    }, 1000)
    return () => clearInterval(id)
  }, [game, deviceId])

  useEffect(() => {
    if (game && game.is_completed) {
      setWinOpen(true)
    } else {
      setWinOpen(false)
    }
  }, [game])

  const startNew = async () => {
    if (!deviceId) return
    setLoading(true)
    const res = await fetch(`${API}/api/new-game`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ device_id: deviceId, difficulty })})
    const data = await res.json()
    if (data.status === 'ok') {
      setGame(data.gamestate)
      setTimer(0)
      setSelected(null)
    }
    setLoading(false)
  }

  const onSelect = (r, c) => {
    setSelected([r, c])
  }

  const makeMove = async (val, note=false) => {
    if (!game || !selected) return
    const [r, c] = selected
    const res = await fetch(`${API}/api/move`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ device_id: deviceId, row: r, col: c, value: val, note_mode: note })})
    const data = await res.json()
    if (data.status === 'ok') {
      setGame(data.gamestate)
    }
  }

  const onNumber = (n) => makeMove(n, noteMode)
  const onErase = () => makeMove(0, false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-5xl mx-auto p-6">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Sudoku</h1>
            <p className="text-sm text-slate-300">Zorluk: 
              <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="ml-2 bg-slate-800 border border-slate-700 rounded px-2 py-1">
                <option value="easy">Kolay</option>
                <option value="medium">Orta</option>
                <option value="hard">Zor</option>
              </select>
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-xs text-slate-400">Süre</div>
              <div className="font-mono text-lg">{formatTime(timer)}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-400">Hata</div>
              <div className="font-mono text-lg">{game?.mistakes || 0}</div>
            </div>
            <button onClick={startNew} disabled={loading} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50">Yeni Oyun</button>
          </div>
        </header>

        <div className="grid md:grid-cols-[1fr_auto] gap-6 items-start">
          <div className="flex items-center justify-center">
            {game ? (
              <SudokuBoard grid={game.current} fixed={game.fixed} notes={game.notes} selected={selected} onSelect={onSelect} />
            ) : (
              <div className="text-slate-300">Başlamak için Yeni Oyun'a basın</div>
            )}
          </div>
          <div className="md:sticky md:top-6">
            <Controls onNumber={onNumber} onErase={onErase} noteMode={noteMode} setNoteMode={setNoteMode} mistakes={game?.mistakes || 0} onNewGame={startNew} />
          </div>
        </div>

        <footer className="mt-8 text-center text-slate-400 text-sm">MVP • Gerçek zamanlı hata kontrolü, not modu ve sayaç içerir</footer>
      </div>

      <Modal open={winOpen} onClose={() => setWinOpen(false)} title="Tebrikler!">
        <p>Bulmacayı {formatTime(timer)} sürede tamamladınız.</p>
        <div className="mt-4 flex gap-2 justify-end">
          <button onClick={() => setWinOpen(false)} className="px-3 py-2 rounded bg-slate-200 text-slate-900">Kapat</button>
          <button onClick={() => { setWinOpen(false); startNew(); }} className="px-3 py-2 rounded bg-blue-600 text-white">Yeni Oyun</button>
        </div>
      </Modal>
    </div>
  )
}

export default App
