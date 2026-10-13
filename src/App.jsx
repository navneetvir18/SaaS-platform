import { useState } from 'react'
import { Menu } from 'lucide-react'
import useLocalStorage from './hooks/useLocalStorage.js'
import Sidebar from './Sidebar.jsx'
import KanbanBoard from './KanbanBoard.jsx'

const SEED_WORKSPACES = [
  { id: 'ws-eng', name: 'Engineering Team', slug: 'engineering' },
  { id: 'ws-mkt', name: 'Marketing Hub', slug: 'marketing' },
]

const SEED_TASKS = [
  { id: 't1', workspaceId: 'ws-eng', title: 'Set up CI pipeline for staging', priority: 'High', status: 'todo' },
  { id: 't2', workspaceId: 'ws-eng', title: 'Migrate auth to OAuth 2.1', priority: 'High', status: 'in-progress' },
  { id: 't3', workspaceId: 'ws-eng', title: 'Write API rate-limit docs', priority: 'Low', status: 'todo' },
  { id: 't4', workspaceId: 'ws-eng', title: 'Fix flaky checkout test', priority: 'Medium', status: 'done' },
  { id: 't5', workspaceId: 'ws-mkt', title: 'Draft Q4 launch announcement', priority: 'High', status: 'in-progress' },
  { id: 't6', workspaceId: 'ws-mkt', title: 'Schedule newsletter for Friday', priority: 'Medium', status: 'todo' },
  { id: 't7', workspaceId: 'ws-mkt', title: 'Refresh landing page hero copy', priority: 'Low', status: 'done' },
]

const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'workspace'

export default function App() {
  const [workspaces, setWorkspaces] = useLocalStorage('kanban:workspaces', SEED_WORKSPACES)
  const [tasks, setTasks] = useLocalStorage('kanban:tasks', SEED_TASKS)
  const [activeId, setActiveId] = useLocalStorage('kanban:active', SEED_WORKSPACES[0].id)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const active = workspaces.find((w) => w.id === activeId) ?? workspaces[0]
  const workspaceTasks = tasks.filter((t) => t.workspaceId === active?.id)

  const createWorkspace = (name) => {
    const base = slugify(name)
    let slug = base
    let n = 2
    while (workspaces.some((w) => w.slug === slug)) slug = `${base}-${n++}`
    const ws = { id: `ws-${crypto.randomUUID()}`, name: name.trim(), slug }
    setWorkspaces((prev) => [...prev, ws])
    setActiveId(ws.id)
    setSidebarOpen(false)
  }

  const addTask = ({ title, priority }) =>
    setTasks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), workspaceId: active.id, title: title.trim(), priority, status: 'todo' },
    ])

  const updateTask = (id, changes) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...changes } : t)))

  const deleteTask = (id) => setTasks((prev) => prev.filter((t) => t.id !== id))

  if (!active) return null

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <Sidebar
        workspaces={workspaces}
        tasks={tasks}
        activeId={active.id}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelect={(id) => {
          setActiveId(id)
          setSidebarOpen(false)
        }}
        onCreate={createWorkspace}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-zinc-800 px-4 py-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            className="rounded-md p-2 text-zinc-300 hover:bg-zinc-800"
          >
            <Menu  size={20} />
          </button>
          <span className="truncate font-semibold">{active.name}</span>
        </header>

        <KanbanBoard
          workspace={active}
          tasks={workspaceTasks}
          onAdd={addTask}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />
      </div>
    </div>
  )
}
