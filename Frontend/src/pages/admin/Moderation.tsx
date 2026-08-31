import { useState } from 'react'
import { useApp } from '../../context'
import { Card, Button, AnonBadge, EmptyState, Modal, Textarea, PageHeader, IconShield, IconLock } from '../../components/ui'

interface ReportItem { id: number; course: string; anon: boolean; preview: string; reason: string; submittedAt: string }


function ReportRow({ report, onResolve, onDismiss }: { report: ReportItem; onResolve: () => void; onDismiss: () => void }) {
  return <Card className="p-4">
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-danger/15 text-danger">Reported review</span>
          <span className="text-xs font-medium text-fg">{report.course}</span>
          {report.anon ? <AnonBadge /> : <span className="text-xs text-fg-muted">Named author</span>}
          {report.anon && <span className="inline-flex items-center gap-1 text-xs text-fg-muted"><IconLock className="w-2.5 h-2.5" />Identity: Anonymous</span>}
          <span className="text-xs text-fg-muted ml-auto">{report.submittedAt}</span>
        </div>
        <div className="mb-2 px-2.5 py-1.5 bg-danger/10 rounded-lg"><span className="text-xs text-danger font-semibold">Report reason: </span><span className="text-xs text-danger">{report.reason}</span></div>
        <p className="text-sm text-fg-muted leading-relaxed line-clamp-3">{report.preview}</p>
      </div>
      <div className="flex flex-col gap-2 flex-shrink-0"><Button size="sm" variant="secondary" onClick={onResolve}>Resolve</Button><Button size="sm" variant="outline" onClick={onDismiss}>Dismiss</Button></div>
    </div>
  </Card>
}

export default function AdminModeration() {
  const { moderationReports, removeModerationReport } = useApp()
  const [demoReports, setDemoReports] = useState<ReportItem[]>([])
  const [dismissTarget, setDismissTarget] = useState<ReportItem | null>(null)
  const [note, setNote] = useState('')
  const reports = [...demoReports, ...moderationReports.map(report => ({ ...report, submittedAt: 'Just now' }))]
  const removeReport = (id: number) => moderationReports.some(report => report.id === id)
    ? removeModerationReport(id)
    : setDemoReports(current => current.filter(report => report.id !== id))
  const dismissReport = () => {
    if (!dismissTarget || !note.trim()) return
    removeReport(dismissTarget.id)
    setDismissTarget(null)
    setNote('')
  }

  return <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
    <Modal open={!!dismissTarget} onClose={() => setDismissTarget(null)} title="Dismiss Report">
      <div className="space-y-4"><p className="text-sm text-fg-muted">Record why this report does not require further action.</p><Textarea label="Internal note" rows={3} value={note} onChange={e => setNote(e.target.value)} /><div className="flex gap-3"><Button variant="outline" onClick={() => setDismissTarget(null)} className="flex-1">Cancel</Button><Button onClick={dismissReport} disabled={!note.trim()} className="flex-1">Dismiss report</Button></div></div>
    </Modal>
    <PageHeader title="Reported Content" description="Review reports submitted by students and teachers" />
    <div className="flex items-start gap-3 p-4 bg-anon-tint rounded-xl border border-anon/20 mb-6"><IconLock className="w-4 h-4 text-anon flex-shrink-0 mt-0.5" /><div><p className="text-sm font-semibold text-anon">Anonymous identities remain protected</p><p className="text-xs text-anon/80 mt-0.5">Reviews are published immediately with configured disrespectful words censored. This queue is only for reported content.</p></div></div>
    <div className="space-y-4">{reports.map(report => <ReportRow key={report.id} report={report} onResolve={() => removeReport(report.id)} onDismiss={() => setDismissTarget(report)} />)}{!reports.length && <EmptyState icon={<IconShield className="w-7 h-7" />} title="Queue is clear" description="No reported content needs attention right now." />}</div>
  </div>
}
