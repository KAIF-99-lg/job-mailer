import { useEffect, useRef, useState } from 'react'
import API_URL from '../api'
import { motion } from 'framer-motion'
import { Mail, TrendingUp, CheckCircle, XCircle, RefreshCw, Clock, ArrowRight, Loader2 } from 'lucide-react'

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const duration = 1200
    const steps = 40
    const step = target / steps
    let current = 0
    ref.current = setInterval(() => {
      current += step
      if (current >= target) {
        setCount(target)
        clearInterval(ref.current!)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(ref.current!)
  }, [target])

  return <span>{count}{suffix}</span>
}

interface DashboardStats {
  totalEmails: number
  todayEmails: number
  successPercentage: number
  failedCount: number
  successCount: number
  recentActivity: {
    _id: string
    companyName: string
    role: string
    hrEmail: string
    status: 'success' | 'failed'
    sentAt: string
  }[]
}

const statusConfig = {
  success: { label: 'Sent', color: '#22C55E', bg: '#F0FDF4' },
  failed: { label: 'Failed', color: '#EF4444', bg: '#FEF2F2' },
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} minute${mins > 1 ? 's' : ''} ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`
  return `${Math.floor(hrs / 24)} day${Math.floor(hrs / 24) > 1 ? 's' : ''} ago`
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/history/dashboard`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setStats(data.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const cards = stats
    ? [
        { label: 'Total Emails', value: stats.totalEmails, suffix: '', icon: Mail, color: '#2563EB', bg: '#EFF6FF' },
        { label: "Today's Emails", value: stats.todayEmails, suffix: '', icon: TrendingUp, color: '#7C3AED', bg: '#F5F3FF' },
        { label: 'Success Rate', value: stats.successPercentage, suffix: '%', icon: CheckCircle, color: '#22C55E', bg: '#F0FDF4' },
        { label: 'Failed Emails', value: stats.failedCount, suffix: '', icon: XCircle, color: '#EF4444', bg: '#FEF2F2' },
      ]
    : []

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <Loader2 size={24} className="animate-spin text-[var(--color-muted-foreground)]" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      {/* Hero card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6"
      >
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]" style={{
          backgroundImage: 'radial-gradient(circle at 80% 50%, #2563EB 0%, transparent 60%)',
        }} />
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <p className="text-[13px] font-medium text-[var(--color-muted-foreground)] mb-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <h1 className="text-[22px] font-semibold tracking-tight text-[var(--color-foreground)]">
              Welcome back 👋
            </h1>
            <p className="mt-1.5 text-[14px] text-[var(--color-muted-foreground)] max-w-md leading-relaxed">
              {stats && stats.totalEmails > 0
                ? `You've sent ${stats.totalEmails} applications with a ${stats.successPercentage}% success rate.`
                : 'Start sending professional job applications today.'}
            </p>
            <button className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2563EB] text-white text-[13px] font-medium hover:bg-[#1D4ED8] transition-colors">
              Send Applications <ArrowRight size={13} />
            </button>
          </div>
          <div className="hidden md:block shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-[var(--color-accent)] flex items-center justify-center">
              <Mail size={32} className="text-[#2563EB] dark:text-[#93C5FD]" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Analytics cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.label}
              variants={itemVariants}
              whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
              transition={{ duration: 0.2 }}
              className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4 cursor-default"
            >
              <div className="flex items-start justify-between mb-3">
                <p className="text-[12px] font-medium text-[var(--color-muted-foreground)]">{card.label}</p>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: card.bg }}>
                  <Icon size={14} style={{ color: card.color }} strokeWidth={2} />
                </div>
              </div>
              <p className="text-[26px] font-semibold tracking-tight text-[var(--color-foreground)]">
                <AnimatedCounter target={card.value} suffix={card.suffix} />
              </p>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Recent Activity */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
          <h2 className="text-[13px] font-semibold text-[var(--color-foreground)]">Recent Activity</h2>
        </div>
        {stats && stats.recentActivity.length > 0 ? (
          <div className="divide-y divide-[var(--color-border)]">
            {stats.recentActivity.map((item, i) => {
              const cfg = statusConfig[item.status]
              const initials = item.companyName ? item.companyName.charAt(0).toUpperCase() : '?'
              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                  className="flex items-center gap-3.5 px-5 py-3.5 hover:bg-[var(--color-muted)] transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shrink-0 bg-[#2563EB]">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-[13px] font-medium text-[var(--color-foreground)] truncate">
                        {item.companyName || 'Unknown Company'}
                      </p>
                      <span className="text-[var(--color-muted-foreground)]">·</span>
                      <p className="text-[12px] text-[var(--color-muted-foreground)] truncate">{item.role}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Clock size={10} className="text-[var(--color-muted-foreground)]" />
                      <p className="text-[11px] text-[var(--color-muted-foreground)]">{timeAgo(item.sentAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className="px-2 py-0.5 rounded-full text-[10.5px] font-medium"
                      style={{ backgroundColor: cfg.bg, color: cfg.color }}
                    >
                      {cfg.label}
                    </span>
                    {item.status === 'failed' && (
                      <button className="flex items-center gap-1 text-[11px] text-[#2563EB] dark:text-[#93C5FD] font-medium hover:underline">
                        <RefreshCw size={11} /> Retry
                      </button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="py-16 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-muted)] flex items-center justify-center mb-3">
              <Mail size={20} className="text-[var(--color-muted-foreground)]" />
            </div>
            <p className="text-[14px] font-medium text-[var(--color-foreground)]">No activity yet</p>
            <p className="text-[12.5px] text-[var(--color-muted-foreground)] mt-1">Send your first application to see activity here</p>
          </div>
        )}
      </div>
    </div>
  )
}
