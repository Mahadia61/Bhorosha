import { useState } from 'react'
import { useApp } from '../../context'
import { Card, Button, StatusChip, AnonBadge, StarDisplay, EmptyState, Tabs, IconBook, IconMessage, IconEdit, IconTrash } from '../../components/ui'

function ReviewItem({ status }: { status: 'pending' | 'approved' | 'rejected' }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-sm font-semibold text-fg truncate">Course Name</span>
            <span className="text-xs text-fg-muted">CSE-XXX</span>
            <AnonBadge />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <StarDisplay value={4} showText={false} />
            <span className="text-xs text-fg-muted">· Submitted 2 weeks ago</span>
          </div>
          <p className="text-sm text-fg-muted leading-relaxed line-clamp-2">
            Review preview text appears here. This is a placeholder showing how submitted review content will look in the list view. Real content will be much more detailed.
          </p>
          {status === 'rejected' && (
            <p className="text-xs text-danger mt-2 bg-danger/10 px-2.5 py-1.5 rounded-lg">
              Rejected: Content violates community guidelines. Please revise before resubmitting.
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <StatusChip status={status} />
          <div className="flex gap-1">
            <button className="p-1.5 rounded-lg hover:bg-line/40 text-fg-muted hover:text-brand transition-colors"><IconEdit /></button>
            <button className="p-1.5 rounded-lg hover:bg-line/40 text-fg-muted hover:text-danger transition-colors"><IconTrash /></button>
          </div>
        </div>
      </div>
    </Card>
  )
}

function QuestionItem({ status }: { status: 'answered' | 'unanswered' }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-sm font-semibold text-fg">Course Name</span>
            <AnonBadge />
          </div>
          <p className="text-sm text-fg-muted mb-2">Sample question: what is the attendance policy for this course?</p>
          <span className="text-xs text-fg-muted">Asked 5 days ago</span>
          {status === 'answered' && (
            <div className="bg-accent-tint rounded-xl p-3 mt-3">
              <p className="text-xs font-semibold text-fg mb-0.5">Professor replied:</p>
              <p className="text-sm text-fg-muted">Attendance is mandatory for at least 75% of all classes. This is a placeholder answer from the professor.</p>
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <StatusChip status={status} />
          <button className="p-1.5 rounded-lg hover:bg-line/40 text-fg-muted hover:text-danger transition-colors"><IconTrash /></button>
        </div>
      </div>
    </Card>
  )
}

export default function MyReviews() {
  const { navigate } = useApp()
  const [tab, setTab] = useState('My Reviews')

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-fg">My Activity</h1>
          <p className="text-sm text-fg-muted">Track your submitted reviews and questions</p>
        </div>
        <Button onClick={() => navigate('student-dashboard')} variant="outline" size="sm">Browse courses</Button>
      </div>

      <Tabs tabs={['My Reviews', 'My Questions']} active={tab} onChange={setTab} />

      {tab === 'My Reviews' && (
        <div className="space-y-3">
          {/* Status summary */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: 'Approved', value: 0, color: 'text-accent' },
              { label: 'Pending', value: 0, color: 'text-warning' },
              { label: 'Rejected', value: 0, color: 'text-danger' },
            ].map(s => (
              <Card key={s.label} className="p-3 text-center">
                <p className={`text-2xl font-bold font-heading ${s.color}`}>{s.value}</p>
                <p className="text-xs text-fg-muted">{s.label}</p>
              </Card>
            ))}
          </div>
          <ReviewItem status="approved" />
          <ReviewItem status="pending" />
          <ReviewItem status="rejected" />
          <EmptyState
            icon={<IconBook className="w-7 h-7" />}
            title="No more reviews"
            description="You haven't submitted any more reviews yet. Start by browsing courses."
            action={<Button size="sm" onClick={() => navigate('student-dashboard')}>Browse courses</Button>}
          />
        </div>
      )}

      {tab === 'My Questions' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { label: 'Answered', value: 0, color: 'text-accent' },
              { label: 'Unanswered', value: 0, color: 'text-fg-muted' },
            ].map(s => (
              <Card key={s.label} className="p-3 text-center">
                <p className={`text-2xl font-bold font-heading ${s.color}`}>{s.value}</p>
                <p className="text-xs text-fg-muted">{s.label}</p>
              </Card>
            ))}
          </div>
          <QuestionItem status="answered" />
          <QuestionItem status="unanswered" />
          <EmptyState
            icon={<IconMessage className="w-7 h-7" />}
            title="No questions yet"
            description="Ask questions from any course page. Professors will answer directly."
            action={<Button size="sm" onClick={() => navigate('student-dashboard')}>Browse courses</Button>}
          />
        </div>
      )}
    </div>
  )
}
