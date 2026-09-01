import { useEffect, useState } from 'react'
import { api } from '../../api'
import { useApp } from '../../context'
import { Button, Card, EmptyState, IconShield, PageHeader } from '../../components/ui'

type Report = { _id: string; reason: string; createdAt: string; review?: { text: string; anonymous: boolean; course?: { code: string; title: string } } }

export default function AdminModeration() {
  const { token } = useApp()
  const [reports, setReports] = useState<Report[]>([])
  const [error, setError] = useState('')
  const load = () => token && api<{ reports: Report[] }>('/reports', {}, token).then(data => setReports(data.reports)).catch(value => setError(value instanceof Error ? value.message : 'Unable to load reports'))
  useEffect(() => { load() }, [token])
  const setStatus = (id: string, status: 'resolved' | 'dismissed') => token && api(`/reports/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }, token).then(load).catch(value => setError(value instanceof Error ? value.message : 'Unable to update report'))

  return <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
    <PageHeader title="Reported Content" description="Live moderation queue" />
    {error && <p role="alert" className="text-sm text-danger mb-4">{error}</p>}
    <div className="space-y-4">{reports.map(report => <Card key={report._id} className="p-4"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-fg">{report.review?.course ? `${report.review.course.code} · ${report.review.course.title}` : 'Deleted review'}</p><p className="text-xs text-danger mt-1">Report reason: {report.reason}</p><p className="text-sm text-fg-muted mt-3">{report.review?.text ?? 'The review is no longer available.'}</p></div><div className="flex gap-2"><Button size="sm" variant="secondary" onClick={() => setStatus(report._id, 'resolved')}>Resolve</Button><Button size="sm" variant="outline" onClick={() => setStatus(report._id, 'dismissed')}>Dismiss</Button></div></div></Card>)}{!reports.length && <EmptyState icon={<IconShield className="w-7 h-7" />} title="Queue is clear" description="No reports need moderation." />}</div>
  </div>
}
