import { useState } from 'react'
import { Layers, Plus, X, Check } from 'lucide-react'

export default function Sidebar({ workspaces, tasks, activeId, open, onClose, onSelect, onCreate }) {
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onCreate(name)
    setName('')
    setCreating(false)
  }

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={onClose} aria-hidden="true" />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-zinc-800 bg-zinc-900 transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2 font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600">
              <Layers size={16} />
            </span>
            Workspaces
          </div>
          <button onClick={onClose} aria-label="Close sidebar" className="rounded-md p-1 text-zinc-400 hover:bg-zinc-800 lg:hidden">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-2">
          {workspaces.map((ws) => {
            const count = tasks.filter((t) => t.workspaceId === ws.id).length
            const isActive = ws.id === activeId
            return (
              <button
                key={ws.id}
                onClick={() => onSelect(ws.id)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  isActive ? 'bg-indigo-500/15 text-indigo-300' : 'text-zinc-300 hover:bg-zinc-800'
                }`}
              >
                <span className="truncate">{ws.name}</span>
                <span className="ml-2 rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">{count}</span>
              </button>
            )
          })}
        </nav>

        <div className="border-t border-zinc-800 p-3">
          {creating ? (
            <form onSubmit={submit} className="flex items-center gap-2">
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Workspace name"
                className="min-w-0 flex-1 rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-sm outline-none focus:border-indigo-500"
              />
              <button type="submit" aria-label="Create workspace" className="rounded-md bg-indigo-600 p-1.5 hover:bg-indigo-500">
                <Check size={16} />
              </button>
              <button type="button" onClick={() => setCreating(false)} aria-label="Cancel" className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-800">
                <X size={16} />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setCreating(true)}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-700 py-2 text-sm text-zinc-300 hover:border-indigo-500 hover:text-indigo-300"
            >
              <Plus size={16} /> New workspace
            </button>
          )}
        </div>
      </aside>
    </>
  )
}
