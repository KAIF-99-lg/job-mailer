import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import SendApplication from './pages/SendApplication'
import Templates from './pages/Templates'
import History from './pages/History'
import Settings from './pages/Settings'
import Projects from './pages/Projects'
import { LayoutDashboard, Send, FileText, History as HistoryIcon, Settings as SettingsIcon } from 'lucide-react'

type Page = 'dashboard' | 'send' | 'templates' | 'history' | 'settings' | 'projects'
type Theme = 'light' | 'dark' | 'system'

function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return theme
}

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error' | 'info'; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])

  const colors = {
    success: 'bg-[#22C55E]',
    error: 'bg-[#EF4444]',
    info: 'bg-[#2563EB]',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl text-white text-[13px] font-medium shadow-lg ${colors[type]}`}
    >
      {message}
      <button onClick={onClose} className="opacity-70 hover:opacity-100 text-lg leading-none">×</button>
    </motion.div>
  )
}

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

export default function App() {
  const [page, setPage] = useState<Page>('dashboard')
  const [theme, setTheme] = useState<Theme>('system')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  useEffect(() => {
    const root = document.documentElement
    const resolved = resolveTheme(theme)
    if (resolved === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [theme])

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) setCollapsed(true)
      else { setCollapsed(false); setMobileOpen(false) }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard onNavigate={setPage} />
      case 'send': return <SendApplication />
      case 'templates': return <Templates />
      case 'history': return <History />
      case 'settings': return <Settings theme={theme} onThemeChange={setTheme} />
      case 'projects': return <Projects />
    }
  }

  const handleNavigate = (p: Page) => {
    setPage(p)
    setMobileOpen(false)
  }

  const bottomNav = [
    { id: 'dashboard' as Page, label: 'Home', icon: LayoutDashboard },
    { id: 'send' as Page, label: 'Send', icon: Send },
    { id: 'templates' as Page, label: 'Templates', icon: FileText },
    { id: 'history' as Page, label: 'History', icon: HistoryIcon },
    { id: 'settings' as Page, label: 'Settings', icon: SettingsIcon },
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-background)]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar — hidden on mobile unless mobileOpen */}
      <div className={`${
        isMobile
          ? `fixed inset-y-0 left-0 z-50 transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`
          : 'relative'
      }`}>
        <Sidebar currentPage={page} onNavigate={handleNavigate} collapsed={isMobile ? false : collapsed} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar
          theme={theme}
          onThemeChange={setTheme}
          sidebarCollapsed={collapsed}
          onToggleSidebar={() => isMobile ? setMobileOpen((o) => !o) : setCollapsed((c) => !c)}
        />

        <main className={`flex-1 overflow-y-auto bg-[var(--color-background)] ${isMobile ? 'pb-16' : ''}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="min-h-full"
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Mobile bottom nav */}
        {isMobile && (
          <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[var(--color-card)] border-t border-[var(--color-border)] flex items-center z-30">
            {bottomNav.map(({ id, label, icon: Icon }) => {
              const active = page === id
              return (
                <button
                  key={id}
                  onClick={() => handleNavigate(id)}
                  className="flex-1 flex flex-col items-center justify-center gap-1 py-2"
                >
                  <Icon size={20} strokeWidth={active ? 2.2 : 1.8} className={active ? 'text-[#2563EB]' : 'text-[var(--color-muted-foreground)]'} />
                  <span className={`text-[10px] font-medium ${active ? 'text-[#2563EB]' : 'text-[var(--color-muted-foreground)]'}`}>{label}</span>
                </button>
              )
            })}
          </nav>
        )}
      </div>

      <AnimatePresence>
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
