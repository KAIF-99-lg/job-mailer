import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, RefreshCw, Eye, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'

interface HistoryEntry {
  _id: string
  companyName: string
  role: string
  hrEmail: string
  subject: string
  status: 'success' | 'failed'
  sentAt: string
  retryCount: number
  errorMessage?: string
}

const statusConfig = {
  success: { label: 'Sent', color: '#22C55E', bg: '#F0FDF4' },
  failed: { label: 'Failed', color: '#EF4444', bg: '#FEF2F2' },
}

const PAGE_SIZE = 8

export default function History() {
  const [records, setRecords] = useState<HistoryEntry[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'failed'>('all')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [retrying, setRetrying] = useState<string | null>(null)

  const fetchHistory = () => {
    setLoading(true)
    const params = new URLSearchParams({
      page: String(page),
      limit: String(PAGE_SIZE),
      ...(search && { search }),
      ...(filterStatus !== 'all' && { status: filterStatus }),
    })
    fetch(`/api/history?${params}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setRecords(data.data.records)
          setTotal(data.data.total)
          setTotalPages(data.data.totalPages)
        }
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchHistory()
  }, [page, filterStatus])

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchHistory() }, 400)
    return () => clearTimeout(t)
  }, [search])

  const handleRetry = async (id: string) => {
    setRetrying(id)
    await fetch(`/api/history/retry/${id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    setRetrying(null)
    fetchHistory()
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/history/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    fetchHistory()
  }

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-start justify-between mb-5 gap-4 flex-wrap">
        <div>
          <h1 className="text-[18px] font-semibold text-[var(--color-foreground)] tracking-tight">History</h1>
          <p className="text-[13px] text-[var(--color-muted-foreground)] mt-0.5">All sent job applications and their statuses</p>
        </div>
      </div>

      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl overflow-hidden mb-4">
        {/* Filters */}
        <div className="px-4 py-3 flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)]" />
            <input
              type="text"
              placeholder="Search by company, role, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8 pl-8 pr-3 text-[12.5px] bg-[var(--color-muted)] border border-[var(--color-border)] rounded-lg text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <Filter size={12} className="text-[var(--color-muted-foreground)]" />
            {(['all', 'success', 'failed'] as const).map((s) => (
              <button
                key={s}
                onClick={() => { setFilterStatus(s); setPage(1) }}
                className={`px-3 py-1 rounded-full text-[11px] font-medium capitalize transition-colors ${
                  filterStatus === s
                    ? 'bg-[#2563EB] text-white'
                    : 'bg-[var(--color-muted)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'
                }`}
              >
                {s === 'success' ? 'Sent' : s === 'all' ? `All (${total})` : 'Failed'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <Loader2 size={20} className="animate-spin text-[var(--color-muted-foreground)]" />
          </div>
        ) : records.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-t border-[var(--color-border)] bg-[var(--color-muted)]/50">
                    {['Company', 'Role', 'Recipient', 'Date', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-4 py-2.5 text-[11px] font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {records.map((row, i) => {
                    const cfg = statusConfig[row.status]
                    return (
                      <motion.tr
                        key={row._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className="hover:bg-[var(--color-muted)]/40 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <span className="text-[13px] font-medium text-[var(--color-foreground)]">
                            {row.companyName || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[12.5px] text-[var(--color-muted-foreground)]">{row.role}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[12px] font-mono text-[var(--color-muted-foreground)]">{row.hrEmail}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[12px] text-[var(--color-muted-foreground)]">
                            {new Date(row.sentAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="inline-flex px-2 py-0.5 rounded-full text-[10.5px] font-semibold"
                            style={{ backgroundColor: cfg.bg, color: cfg.color }}
                          >
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {row.status === 'failed' && (
                              <button
                                onClick={() => handleRetry(row._id)}
                                disabled={retrying === row._id}
                                className="flex items-center gap-1 text-[11px] text-[#EF4444] hover:text-red-700 font-medium transition-colors disabled:opacity-50"
                              >
                                {retrying === row._id
                                  ? <Loader2 size={11} className="animate-spin" />
                                  : <RefreshCw size={11} />
                                } Retry
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(row._id)}
                              className="flex items-center gap-1 text-[11px] text-[var(--color-muted-foreground)] hover:text-[#EF4444] transition-colors"
                            >
                              <Eye size={12} /> Delete
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-4 py-3 border-t border-[var(--color-border)] flex items-center justify-between">
              <p className="text-[12px] text-[var(--color-muted-foreground)]">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-md text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-muted)] disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-7 h-7 rounded-md text-[12px] font-medium transition-colors ${
                      page === i + 1
                        ? 'bg-[#2563EB] text-white'
                        : 'text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-md text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-muted)] disabled:opacity-30 transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="py-16 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-muted)] flex items-center justify-center mb-3">
              <Search size={20} className="text-[var(--color-muted-foreground)]" />
            </div>
            <p className="text-[14px] font-medium text-[var(--color-foreground)]">No results found</p>
            <p className="text-[12.5px] text-[var(--color-muted-foreground)] mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
