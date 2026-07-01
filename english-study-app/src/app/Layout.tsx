import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { BookOpen, NotebookPen, SpellCheck2, Settings } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/courses', label: 'コース', icon: BookOpen },
  { to: '/vocabulary', label: '単語帳', icon: NotebookPen },
  { to: '/grammar', label: '文法帳', icon: SpellCheck2 },
  { to: '/settings', label: '設定', icon: Settings },
]

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-slate-50">
      <main className="flex-1 pb-20">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto flex max-w-3xl justify-around">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center gap-0.5 py-2.5 text-center text-xs font-medium ${
                  isActive ? 'text-blue-700' : 'text-slate-500'
                }`
              }
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
