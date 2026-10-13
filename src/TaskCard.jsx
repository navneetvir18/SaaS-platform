import { ChevronLeft, ChevronRight, Trash2, CheckCircle2, Circle } from 'lucide-react'

const PRIORITY_STYLES = {
  Low: 'bg-emerald-500/15 text-emerald-300',
  Medium: 'bg-amber-500/15 text-amber-300',
  High: 'bg-rose-500/15 text-rose-300',
}

export default function TaskCard({ task, columnIndex, columnCount, onMove, onToggle, onPriority, onDelete }) {
  const done = task.status === 'done'

  return (
    <article className="group rounded-xl border border-zinc-800 bg-zinc-900 p-3 shadow-sm transition-colors hover:border-zinc-700">
      <div className="flex items-start gap-2">
        <button
          onClick={onToggle}
          aria-label={done ? 'Mark as not done' : 'Mark as done'}
          className={done ? 'mt-0.5 text-indigo-400' : 'mt-0.5 text-zinc-500 hover:text-indigo-400'}
        >
          {done ? <CheckCircle2 size={18} /> : <Circle size={18} />}
        </button>
        <h3 className={`flex-1 text-sm font-medium ${done ? 'text-zinc-500 line-through' : 'text-zinc-100'}`}>
          {task.title}
        </h3>
        <button
          onClick={onDelete}
          aria-label="Delete task"
          className="rounded p-1 text-zinc-500 hover:bg-rose-500/10 hover:text-rose-400"
        >
          <Trash2 size={15} />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <select
          value={task.priority}
          onChange={(e) => onPriority(e.target.value)}
          aria-label="Priority"
          className={`cursor-pointer rounded-full border-0 px-2 py-1 text-xs font-medium outline-none ${PRIORITY_STYLES[task.priority]}`}
        >
          {['Low', 'Medium', 'High'].map((p) => (
            <option key={p} value={p} className="bg-zinc-900 text-zinc-100">
              {p}
            </option>
          ))}
        </select>

        <div className="flex gap-1">
          <button
            onClick={() => onMove(-1)}
            disabled={columnIndex === 0}
            aria-label="Move back"
            className="rounded p-1 text-zinc-400 hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => onMove(1)}
            disabled={columnIndex === columnCount - 1}
            aria-label="Move forward"
            className="rounded p-1 text-zinc-400 hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </article>
  )
}
