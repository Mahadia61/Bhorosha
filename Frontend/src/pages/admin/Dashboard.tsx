import { useEffect, useState } from 'react'
import { api } from '../../api'
import { useApp } from '../../context'
import { Button, IconAlertTriangle, IconBarChart, IconBook, IconMessage, IconShield, IconUsers, KpiCard } from '../../components/ui'

type Metrics = { users: number; courses: number; reviews: number; questions: number; pendingReports: number; anonymousPosts: number }
export default function AdminDashboard() {
  const { navigate, token } = useApp(); const [metrics, setMetrics] = useState<Metrics | null>(null); const [error, setError] = useState('')
  useEffect(() => { if (token) api<{ metrics: Metrics }>('/admin/analytics', {}, token).then(data => setMetrics(data.metrics)).catch(value => setError(value instanceof Error ? value.message : 'Unable to load dashboard')) }, [token])
  const cards = [{ label: 'Total Users', key: 'users', icon: <IconUsers />, color: 'brand' }, { label: 'Total Courses', key: 'courses', icon: <IconBook />, color: 'accent' }, { label: 'Total Reviews', key: 'reviews', icon: <IconBarChart />, color: 'anon' }, { label: 'Total Questions', key: 'questions', icon: <IconMessage />, color: 'brand' }, { label: 'Flagged Content', key: 'pendingReports', icon: <IconAlertTriangle />, color: 'warning' }, { label: 'Anonymous Posts', key: 'anonymousPosts', icon: <IconShield />, color: 'anon' }] as const
  return <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8"><h1 className="text-2xl font-bold font-heading text-fg mb-1">Admin Dashboard</h1><p className="text-sm text-fg-muted mb-8">Live platform overview</p>{error && <p role="alert" className="text-sm text-danger mb-4">{error}</p>}<div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">{cards.map(card => <KpiCard key={card.key} label={card.label} value={metrics?.[card.key] ?? '—'} icon={card.icon} color={card.color} />)}</div><div className="flex flex-wrap gap-3"><Button onClick={() => navigate('admin-users')}>Manage Users</Button><Button variant="secondary" onClick={() => navigate('admin-courses')}>Manage Courses</Button><Button variant="outline" onClick={() => navigate('admin-moderation')}>Review Queue</Button><Button variant="outline" onClick={() => navigate('admin-analytics')}>Analytics</Button></div></div>
}
