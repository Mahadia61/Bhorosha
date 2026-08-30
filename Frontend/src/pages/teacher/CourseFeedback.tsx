import { useState } from 'react'
import { useApp } from '../../context'
import {
  Card, Button, StarDisplay, AnonBadge, TagPill, RatingBreakdown,
  EmptyState, SearchBar, SelectField, Modal, Textarea,
  IconBook, IconFlag, IconThumbUp
} from '../../components/ui'

function ReviewCard({ anon }: { anon: boolean }) {
  const [flagOpen, setFlagOpen] = useState(false)
  return (
    <>
      <Modal open={flagOpen} onClose={() => setFlagOpen(false)} title="Flag for Admin Review">
        <div className="space-y-4">
          <p className="text-sm text-fg-muted">Flagging this review will send it to the moderation queue. You cannot remove or edit student reviews.</p>
          <Textarea label="Reason for flagging" placeholder="Describe why this review violates community guidelines…" rows={3} />
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setFlagOpen(false)} className="flex-1">Cancel</Button>
            <Button variant="danger" onClick={() => setFlagOpen(false)} className="flex-1">Flag review</Button>
          </div>
        </div>
      </Modal>
      <Card className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {anon
              ? <AnonBadge />
              : <span className="text-sm font-medium text-fg">Student Name</span>
            }
            <span className="text-xs text-fg-muted">· 2 weeks ago</span>
          </div>
          <StarDisplay value={4} showText={false} />
        </div>
        {/* Criteria breakdown */}
        <div className="grid grid-cols-3 gap-x-4 gap-y-1 mb-3 text-xs text-fg-muted">
          {['Teaching Quality', 'Workload', 'Grading Fairness'].map(c => (
            <div key={c} className="flex justify-between">
              <span>{c}</span>
              <span className="text-fg font-medium">—</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          <TagPill label="Well-structured" />
          <TagPill label="Clear Explanations" />
        </div>
        <p className="text-sm text-fg-muted leading-relaxed mb-4">
          Placeholder review content. Real student feedback will appear here once students submit reviews for this course.
        </p>
        <div className="flex items-center gap-4 pt-2 border-t border-line text-xs text-fg-muted">
          <span className="flex items-center gap-1"><IconThumbUp className="w-3.5 h-3.5" />0 found helpful</span>
          <button
            onClick={() => setFlagOpen(true)}
            className="flex items-center gap-1 hover:text-danger transition-colors ml-auto"
          >
            <IconFlag className="w-3.5 h-3.5" />
            Flag for admin
          </button>
          <button className="px-2.5 py-1 rounded-lg bg-line/50 hover:bg-line text-fg-muted text-xs transition-colors">
            Acknowledge
          </button>
        </div>
      </Card>
    </>
  )
}

export default function CourseFeedback() {
  const { navigate } = useApp()
  const [course, setCourse] = useState('all')
  const [query, setQuery] = useState('')

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-fg">Student Feedback</h1>
          <p className="text-sm text-fg-muted">View reviews for your courses. Anonymous authorship is always preserved.</p>
        </div>
        <Button onClick={() => navigate('teacher-dashboard')} variant="outline" size="sm">← Dashboard</Button>
      </div>

      {/* Note about anonymity */}
      <div className="flex items-start gap-3 p-4 bg-anon-tint rounded-xl border border-anon/20 mb-6">
        <span className="text-lg flex-shrink-0">🔒</span>
        <div>
          <p className="text-sm font-semibold text-anon">Anonymous authorship is protected</p>
          <p className="text-xs text-anon/80 mt-0.5">The identity of students who chose to post anonymously is never revealed — not even to you or to administrators. Anonymous reviews are marked accordingly.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="space-y-5">
          <Card className="p-5">
            <h3 className="font-semibold font-heading text-fg text-sm mb-3">Overall Rating</h3>
            <div className="text-3xl font-bold font-heading text-fg mb-1">—</div>
            <StarDisplay value={0} />
            <p className="text-xs text-fg-muted mt-1">across 0 reviews</p>
          </Card>
          <Card className="p-5">
            <h3 className="font-semibold font-heading text-fg text-sm mb-3">Rating Breakdown</h3>
            <RatingBreakdown counts={[0, 0, 0, 0, 0]} />
          </Card>
          <Card className="p-5">
            <h3 className="font-semibold font-heading text-fg text-sm mb-3">Filter</h3>
            <SelectField label="Course" value={course} onChange={e => setCourse(e.target.value)}>
              <option value="all">All my courses</option>
              <option>Course Name (CSE-XXX)</option>
            </SelectField>
          </Card>
        </div>

        {/* Reviews list */}
        <div className="lg:col-span-2 space-y-4">
          <SearchBar placeholder="Search reviews…" value={query} onChange={setQuery} />
          <ReviewCard anon={true} />
          <ReviewCard anon={false} />
          <ReviewCard anon={true} />
          <EmptyState
            icon={<IconBook className="w-7 h-7" />}
            title="No more reviews"
            description="Student reviews for your courses will appear here. Encourage students to share feedback."
          />
        </div>
      </div>
    </div>
  )
}
