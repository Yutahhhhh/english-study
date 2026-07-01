import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { BookOpen, GraduationCap, NotebookPen, SpellCheck2, Settings } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/courses', label: 'コース', icon: BookOpen },
  { to: '/vocabulary', label: '単語帳', icon: NotebookPen },
  { to: '/grammar', label: '文法帳', icon: SpellCheck2 },
  { to: '/settings', label: '設定', icon: Settings },
]

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-slate-50 dark:bg-slate-950">
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3">
          <span className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-sm">
            <GraduationCap size={18} />
          </span>
          <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
            English Study
          </span>
        </div>
      </header>

      <main className="flex-1 pb-24">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-slate-200/80 bg-white/90 backdrop-blur-md pb-[env(safe-area-inset-bottom)] dark:border-slate-800/80 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-3xl justify-around px-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `group flex flex-1 flex-col items-center gap-0.5 py-2.5 text-center text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex size-9 items-center justify-center rounded-xl transition-colors ${
                      isActive ? 'bg-indigo-50 dark:bg-indigo-500/15' : ''
                    }`}
                  >
                    <item.icon size={19} />
                  </span>
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
