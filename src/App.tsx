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

type Page = 'dashboard' | 'send' | 'templates' | 'history' | 'settings' | 'projects'
type Theme = 'light' | 'dark' | 'system'

// Kaif's JWT token — valid for 1 year
const KAIF_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNjhmNzhiMDY0YzAxNGIzYTlmMjRhMyIsImlhdCI6MTc4NTI2NDI2NiwiZXhwIjoxODE2ODAwMjY2fQ.aFUn2LHtBJZM5rTpUgyUUjw1-r_fPSGRHYgoY6_rW1g'

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
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  // Auto-set token on load
  useEffect(() => {
    localStorage.setItem('token', KAIF_TOKEN)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const resolved = resolveTheme(theme)
    if (resolved === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [theme])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setCollapsed(true)
      else setCollapsed(false)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard />
      case 'send': return <SendApplication />
      case 'templates': return <Templates />
      case 'history': return <History />
      case 'settings': return <Settings theme={theme} onThemeChange={setTheme} />
      case 'projects': return <Projects />
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-background)]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Sidebar currentPage={page} onNavigate={setPage} collapsed={collapsed} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar
          theme={theme}
          onThemeChange={setTheme}
          sidebarCollapsed={collapsed}
          onToggleSidebar={() => setCollapsed((c) => !c)}
        />

        <main className="flex-1 overflow-y-auto bg-[var(--color-background)]">
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
      </div>

      <AnimatePresence>
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
