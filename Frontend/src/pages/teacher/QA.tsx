import { useState } from 'react'
import { useApp } from '../../context'
import { Card, Button, AnonBadge, StatusChip, Modal, Textarea, EmptyState, Tabs, Avatar, IconMessage } from '../../components/ui'

function QuestionCard({ answered, onAnswer }: { answered: boolean; onAnswer: () => void }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <AnonBadge />
          <span className="text-xs text-fg-muted">· Course Name (CSE-XXX) · 5 days ago</span>
        </div>
        <StatusChip status={answered ? 'answered' : 'unanswered'} />
      </div>
      <p className="text-sm font-medium text-fg mb-3">
        Sample question: What is the expected difficulty level of the final examination for this course?
      </p>
      {answered ? (
        <div className="bg-accent-tint rounded-xl p-3 mb-3">
          <div className="flex items-center gap-2 mb-1.5">
            <Avatar name="T A" size="sm" />
            <span className="text-xs font-semibold text-fg">You</span>
            <span className="text-xs text-fg-muted">· Answered 3 days ago</span>
          </div>
          <p className="text-sm text-fg-muted">The final exam will cover all topics from the semester. I recommend focusing on practical problem-solving. This is a placeholder answer showing how your replies appear.</p>
        </div>
      ) : (
        <Button size="sm" onClick={onAnswer}>Answer this question</Button>
      )}
    </Card>
  )
}

export default function TeacherQA() {
  const [tab, setTab] = useState('Unanswered')
  const [answerOpen, setAnswerOpen] = useState(false)
  const [answerText, setAnswerText] = useState('')

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Modal open={answerOpen} onClose={() => setAnswerOpen(false)} title="Answer Question">
        <div className="space-y-4">
          <div className="bg-brand-tint rounded-xl p-3">
            <p className="text-xs font-semibold text-brand mb-1">Student's question:</p>
            <p className="text-sm text-fg">What is the expected difficulty level of the final examination for this course?</p>
          </div>
          <Textarea
            label="Your answer"
            placeholder="Write a clear, helpful answer. Your name and title will be shown — teacher answers are never anonymous."
            rows={4}
            value={answerText}
            onChange={e => setAnswerText(e.target.value)}
          />
          <div className="flex items-center gap-2 text-xs text-fg-muted bg-line/30 px-3 py-2 rounded-lg">
            <Avatar name="T A" size="sm" />
            Your name and department will be shown alongside this answer.
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setAnswerOpen(false)} className="flex-1">Cancel</Button>
            <Button onClick={() => setAnswerOpen(false)} className="flex-1" disabled={!answerText.trim()}>Post answer</Button>
          </div>
        </div>
      </Modal>

      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-fg">Q&A Management</h1>
        <p className="text-sm text-fg-muted">Answer student questions from your courses</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold font-heading text-warning">0</p>
          <p className="text-xs text-fg-muted">Unanswered</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold font-heading text-accent">0</p>
          <p className="text-xs text-fg-muted">Answered</p>
        </Card>
      </div>

      <Tabs tabs={['Unanswered', 'Answered']} active={tab} onChange={setTab} />

      {tab === 'Unanswered' && (
        <div className="space-y-4">
          <QuestionCard answered={false} onAnswer={() => setAnswerOpen(true)} />
          <QuestionCard answered={false} onAnswer={() => setAnswerOpen(true)} />
          <EmptyState
            icon={<IconMessage className="w-7 h-7" />}
            title="All questions answered!"
            description="No pending questions from your students right now. Great work!"
          />
        </div>
      )}
      {tab === 'Answered' && (
        <div className="space-y-4">
          <QuestionCard answered={true} onAnswer={() => {}} />
          <EmptyState
            icon={<IconMessage className="w-7 h-7" />}
            title="No answered questions yet"
            description="Questions you've answered will appear here."
          />
        </div>
      )}
    </div>
  )
}
