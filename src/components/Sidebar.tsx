import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Send,
  FileText,
  History,
  Settings,
  Mail,
  ChevronRight,
  Kanban,
} from 'lucide-react'

type Page = 'dashboard' | 'send' | 'templates' | 'history' | 'settings' | 'projects'

interface SidebarProps {
  currentPage: Page
  onNavigate: (page: Page) => void
  collapsed: boolean
}

const navItems = [
  { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'send' as Page, label: 'Send Application', icon: Send },
  { id: 'templates' as Page, label: 'Templates', icon: FileText },
  { id: 'history' as Page, label: 'History', icon: History },
  { id: 'projects' as Page, label: 'Projects', icon: Kanban },
  { id: 'settings' as Page, label: 'Settings', icon: Settings },
]

export default function Sidebar({ currentPage, onNavigate, collapsed }: SidebarProps) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 220 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="h-full flex flex-col border-r border-[var(--color-border)] bg-[var(--color-sidebar)] overflow-hidden shrink-0"
      style={{ backgroundColor: 'var(--color-sidebar)' }}
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-[var(--color-border)] shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-[#2563EB] flex items-center justify-center shrink-0">
            <Mail size={14} className="text-white" strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-semibold text-[13.5px] tracking-tight text-[var(--color-foreground)] truncate"
            >
              JobMailer AI
            </motion.span>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = currentPage === item.id
          const Icon = item.icon
          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              whileHover={{ x: active ? 0 : 2 }}
              transition={{ duration: 0.15 }}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors duration-150 cursor-pointer group relative ${
                active
                  ? 'bg-[var(--color-sidebar-active)] text-[var(--color-sidebar-active-foreground)] font-medium'
                  : 'text-[var(--color-sidebar-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]'
              }`}
            >
              <Icon
                size={16}
                strokeWidth={active ? 2.2 : 1.8}
                className="shrink-0"
              />
              {!collapsed && (
                <span className="truncate text-[13px]">{item.label}</span>
              )}
              {!collapsed && active && (
                <ChevronRight size={13} className="ml-auto opacity-60" />
              )}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  {item.label}
                </div>
              )}
            </motion.button>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-4 border-t border-[var(--color-border)] pt-3">
        {!collapsed && (
          <div className="px-2.5 py-2 rounded-md bg-[var(--color-accent)] border border-blue-100 dark:border-blue-900/30">
            <p className="text-[11px] font-medium text-[#2563EB] dark:text-[#93C5FD]">JobMailer AI</p>
            <p className="text-[10.5px] text-[var(--color-muted-foreground)] mt-0.5">Send smarter, get hired faster</p>
          </div>
        )}
      </div>
    </motion.aside>
  )
}
