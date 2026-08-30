import { useState } from 'react'
import { useApp } from '../../context'
import { Card, Button, AnonBadge, StarDisplay, StatusChip, Modal, Textarea, EmptyState, Tabs, PageHeader, IconShield, IconLock } from '../../components/ui'

interface ContentItem {
  id: number
  type: 'review' | 'question' | 'report'
  course: string
  anon: boolean
  preview: string
  submittedAt: string
  status: 'pending' | 'approved' | 'rejected'
  rating?: number
  reportReason?: string
}

const DEMO_ITEMS: ContentItem[] = [
  { id: 1, type: 'review', course: 'CSE-201', anon: true, preview: 'This course was very challenging but the professor explained concepts well. I would recommend it to anyone interested in algorithms.', submittedAt: '2 hours ago', status: 'pending', rating: 4 },
  { id: 2, type: 'review', course: 'EEE-101', anon: false, preview: 'The exams were unfairly difficult and the grading was inconsistent. I expected more from this course.', submittedAt: '5 hours ago', status: 'pending', rating: 2 },
  { id: 3, type: 'question', course: 'ME-301', anon: true, preview: 'When will the semester project guidelines be published? Can we form groups of more than 3?', submittedAt: '1 day ago', status: 'pending' },
  { id: 4, type: 'report', course: 'CSE-201', anon: false, preview: 'This review contains personally identifiable information about another student.', submittedAt: '3 hours ago', status: 'pending', reportReason: 'Privacy violation' },
]

function ContentRow({ item, onAction }: { item: ContentItem; onAction: (item: ContentItem, action: 'approve' | 'reject' | 'escalate') => void }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`px-2 py-0.5 rounded-md text-xs font-semibold capitalize ${
              item.type === 'review' ? 'bg-brand-tint text-brand' :
              item.type === 'question' ? 'bg-accent-tint text-accent' :
              'bg-danger/15 text-danger'
            }`}>
              {item.type}
            </span>
            <span className="text-xs font-medium text-fg">{item.course}</span>
            {item.anon
              ? <AnonBadge />
              : <span className="text-xs text-fg-muted">Named author</span>
            }
            {/* Admin identity lock — always shows "Anonymous" for anon posts */}
            {item.anon && (
              <span className="inline-flex items-center gap-1 text-xs text-fg-muted">
                <IconLock className="w-2.5 h-2.5" />
                Identity: <span className="font-medium text-fg-muted">Anonymous</span>
              </span>
            )}
            <span className="text-xs text-fg-muted ml-auto">{item.submittedAt}</span>
          </div>
          {item.type === 'review' && item.rating && (
            <div className="mb-2"><StarDisplay value={item.rating} showText={false} /></div>
          )}
          {item.reportReason && (
            <div className="mb-2 px-2.5 py-1.5 bg-danger/10 rounded-lg">
              <span className="text-xs text-danger font-semibold">Report reason: </span>
              <span className="text-xs text-danger">{item.reportReason}</span>
            </div>
          )}
          <p className="text-sm text-fg-muted leading-relaxed line-clamp-3">{item.preview}</p>
        </div>
        <div className="flex flex-col gap-2 flex-shrink-0">
          <Button size="sm" variant="secondary" onClick={() => onAction(item, 'approve')}>Approve</Button>
          <Button size="sm" variant="danger" onClick={() => onAction(item, 'reject')}>Reject</Button>
          {item.type === 'report' && (
            <Button size="sm" variant="outline" onClick={() => onAction(item, 'escalate')}>Escalate</Button>
          )}
        </div>
      </div>
    </Card>
  )
}

export default function AdminModeration() {
  const { moderationReports, removeModerationReport } = useApp()
  const [tab, setTab] = useState('Pending Reviews')
  const [rejectTarget, setRejectTarget] = useState<ContentItem | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [items, setItems] = useState<ContentItem[]>(DEMO_ITEMS)

  const handleAction = (item: ContentItem, action: 'approve' | 'reject' | 'escalate') => {
    if (action === 'reject') { setRejectTarget(item); return }
    if (moderationReports.some(report => report.id === item.id)) {
      removeModerationReport(item.id)
      return
    }
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: action === 'approve' ? 'approved' : 'rejected' } : i))
  }

  const handleReject = () => {
    if (rejectTarget) {
      if (moderationReports.some(report => report.id === rejectTarget.id)) removeModerationReport(rejectTarget.id)
      else setItems(prev => prev.map(i => i.id === rejectTarget.id ? { ...i, status: 'rejected' } : i))
    }
    setRejectTarget(null)
    setRejectReason('')
  }

  const reviewItems = items.filter(i => i.type === 'review' && i.status === 'pending')
  const questionItems = items.filter(i => i.type === 'question' && i.status === 'pending')
  const reportItems = [
    ...items.filter(i => i.type === 'report' && i.status === 'pending'),
    ...moderationReports.map(report => ({
      id: report.id,
      type: 'report' as const,
      course: report.course,
      anon: report.anon,
      preview: report.preview,
      submittedAt: 'Just now',
      status: 'pending' as const,
      reportReason: report.reason,
    })),
  ]

  const tabs = [
    `Pending Reviews (${reviewItems.length})`,
    `Pending Questions (${questionItems.length})`,
    `Reported Content (${reportItems.length})`,
  ]
  const activeItems = tab.startsWith('Pending Reviews') ? reviewItems : tab.startsWith('Pending Questions') ? questionItems : reportItems

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Reject modal */}
      <Modal open={!!rejectTarget} onClose={() => setRejectTarget(null)} title="Reject Content">
        <div className="space-y-4">
          <p className="text-sm text-fg-muted">Provide a reason for rejection. This reason will be visible to the content author.</p>
          <Textarea
            label="Rejection reason"
            placeholder="e.g. Content contains inappropriate language or violates community guidelines…"
            rows={3}
            value={rejectReason}
            onChange={e => setRejectReason(e.target.value)}
          />
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setRejectTarget(null)} className="flex-1">Cancel</Button>
            <Button variant="danger" onClick={handleReject} className="flex-1" disabled={!rejectReason.trim()}>Reject content</Button>
          </div>
        </div>
      </Modal>

      <PageHeader title="Content Moderation" description="Review and moderate user-submitted content" />

      {/* Admin anonymity notice */}
      <div className="flex items-start gap-3 p-4 bg-anon-tint rounded-xl border border-anon/20 mb-6">
        <IconLock className="w-4 h-4 text-anon flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-anon">Admin cannot see anonymous identities</p>
          <p className="text-xs text-anon/80 mt-0.5">Even as an administrator, you cannot view the real identity of users who posted anonymously. The identity field will always show "Anonymous" with a lock indicator for such content.</p>
        </div>
      </div>

      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      <div className="space-y-4">
        {activeItems.map(item => (
          <ContentRow key={item.id} item={item} onAction={handleAction} />
        ))}
        {activeItems.length === 0 && (
          <EmptyState
            icon={<IconShield className="w-7 h-7" />}
            title="Queue is clear"
            description="No content awaiting moderation in this category."
          />
        )}
      </div>
    </div>
  )
}
