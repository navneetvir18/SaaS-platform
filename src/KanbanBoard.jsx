import { useState } from 'react'
import { Plus, Inbox } from 'lucide-react'
import TaskCard from './TaskCard.jsx'

const COLUMNS = [
  { id: 'todo', label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'done', label: 'Done' },
]

export default function KanbanBoard({ workspace, tasks, onAdd, onUpdate, onDelete }) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('Medium')

  const submit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    onAdd({ title, priority })
    setTitle('')
  }

  const move = (task, dir) => {
    const idx = COLUMNS.findIndex((c) => c.id === task.status)
    const next = COLUMNS[idx + dir]
    if (next) onUpdate(task.id, { status: next.id })
  }

  const toggle = (task) => onUpdate(task.id, { status: task.status === 'done' ? 'todo' : 'done' })

  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="border-b border-zinc-800 px-4 py-5 sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-semibold">{workspace.name}</h1>
          <span className="rounded-full bg-violet-500/15 px-2.5 py-0.5 text-xs font-medium text-violet-300">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </span>
          <code className="rounded-md bg-zinc-900 px-2 py-1 text-xs text-zinc-400">/workspace/{workspace.slug}</code>
        </div>

        <form onSubmit={submit} className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a task to To Do"
            className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-indigo-500"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            aria-label="Priority"
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-indigo-500"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500"
          >
            <Plus size={16} /> Add task
          </button>
        </form>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto p-4 sm:p-6 md:grid-cols-3">
        {COLUMNS.map((col, colIndex) => {
          const colTasks = tasks.filter((t) => t.status === col.id)
          return (
            <section key={col.id} className="flex flex-col rounded-2xl bg-zinc-900/50 p-3">
              <header className="mb-3 flex items-center justify-between px-1">
                <h2 className="text-sm font-semibold text-zinc-200">{col.label}</h2>
                <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">{colTasks.length}</span>
              </header>

              <div className="flex flex-1 flex-col gap-2">
                {colTasks.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-800 py-10 text-center text-sm text-zinc-500">
                    <Inbox size={22} />
                    {tasks.length === 0 ? 'No tasks yet. Add one above.' : `Nothing in ${col.label} right now.`}
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      columnIndex={colIndex}
                      columnCount={COLUMNS.length}
                      onMove={(dir) => move(task, dir)}
                      onToggle={() => toggle(task)}
                      onPriority={(p) => onUpdate(task.id, { priority: p })}
                      onDelete={() => onDelete(task.id)}
                    />
                  ))
                )}
              </div>
            </section>
          )
        })}
      </div>
    </main>
  )
}
