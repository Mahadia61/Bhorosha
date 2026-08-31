import { useState, useEffect } from 'react'
import { useApp } from '../../context'
import { censorProfanity } from '../../utils/profanity'
import {
  Card, Button, StarDisplay, StarRating, TagPill, AnonBadge, Toggle,
  RatingBreakdown, Modal, Textarea, Tabs, EmptyState, Avatar,
  IconThumbUp, IconFlag, IconBook, IconMessage
} from '../../components/ui'

const CRITERIA = ['Teaching Quality', 'Workload', 'Grading Fairness', 'Course Structure', 'Availability']
const TAGS = ['Well-structured', 'Heavy Workload', 'Fair Grading', 'Engaging', 'Clear Explanations', 'Research Focused', 'Good Notes', 'Hard Exams']

function timeAgo(value: string) {
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60000))
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

function ReviewCard({ review }: { review: { anonymous: boolean; text: string; ratings: Record<string, number>; tags: string[]; createdAt: string } }) {
  const average = Object.values(review.ratings).reduce((sum, rating) => sum + rating, 0) / Object.values(review.ratings).length
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          {review.anonymous ? <AnonBadge /> : (
            <>
              <Avatar name="S U" size="sm" />
              <span className="text-sm font-medium text-fg">Student Name</span>
            </>
          )}
          <span className="text-xs text-fg-muted">· {timeAgo(review.createdAt)}</span>
        </div>
        <StarDisplay value={average} showText={false} />
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {review.tags.map(tag => <TagPill key={tag} label={tag} />)}
      </div>
      <p className="text-sm text-fg-muted leading-relaxed mb-4">
        {review.text}
      </p>
      <div className="flex items-center gap-4 text-xs text-fg-muted">
        <button className="flex items-center gap-1 hover:text-accent transition-colors">
          <IconThumbUp className="w-3.5 h-3.5" />
          Helpful (0)
        </button>
        <button className="flex items-center gap-1 hover:text-danger transition-colors">
          <IconFlag className="w-3.5 h-3.5" />
          Report
        </button>
      </div>
    </Card>
  )
}

function WriteReviewModal({ open, onClose, onSubmitted }: { open: boolean; onClose: () => void; onSubmitted: (review: { anonymous: boolean; text: string; ratings: Record<string, number>; tags: string[] }) => void }) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [ratings, setRatings] = useState<Record<string, number>>(Object.fromEntries(CRITERIA.map(c => [c, 0])))
  const [text, setText] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [anon, setAnon] = useState(true)
  const [loading, setLoading] = useState(false)
  const toggleTag = (t: string) => setSelectedTags(s => s.includes(t) ? s.filter(x => x !== t) : [...s, t])

  const handleSubmit = () => {
    const nextErrors: Record<string, string> = {}
    if (Object.values(ratings).some(rating => rating === 0)) nextErrors.ratings = 'Rate every criterion before submitting.'
    if (!text.trim()) nextErrors.text = 'Write a review before submitting.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    setLoading(true)
    setTimeout(() => {
      onSubmitted({ anonymous: anon, text: censorProfanity(text.trim()), ratings, tags: selectedTags })
      setLoading(false)
      setText('')
      onClose()
    }, 1200)
  }

  return (
    <Modal open={open} onClose={onClose} title="Write a Review" width="max-w-2xl">
      <div className="space-y-5">
        {/* Criteria ratings */}
        <div>
          <p className="text-sm font-medium text-fg mb-3">Rate each criterion</p>
          <div className="space-y-2.5">
            {CRITERIA.map(c => (
              <div key={c} className="flex items-center justify-between gap-4">
                <span className="text-sm text-fg-muted w-36">{c}</span>
                <StarRating value={ratings[c]} onRate={v => setRatings(r => ({ ...r, [c]: v }))} />
                <span className="text-xs text-fg-muted w-8 text-right">{ratings[c] > 0 ? `${ratings[c]}/5` : '—'}</span>
              </div>
            ))}
          </div>
          {errors.ratings && <p className="text-xs text-danger mt-2">{errors.ratings}</p>}
        </div>

        {/* Tags */}
        <div>
          <p className="text-sm font-medium text-fg mb-2">Tags <span className="text-fg-muted font-normal">(select all that apply)</span></p>
          <div className="flex flex-wrap gap-2">
            {TAGS.map(t => (
              <TagPill key={t} label={t} selected={selectedTags.includes(t)} onClick={() => toggleTag(t)} />
            ))}
          </div>
        </div>

        {/* Text */}
        <Textarea
          label="Your review"
          placeholder="Share your experience with this course. Be honest and constructive."
          rows={4}
          value={text}
          onChange={e => setText(e.target.value)}
          error={errors.text}
        />

        {/* Anonymity toggle */}
        <div className="bg-anon-tint rounded-xl p-4">
          <Toggle
            checked={anon}
            onChange={setAnon}
            label="Post anonymously"
            hint="Your name will be hidden from everyone, including professors and admins. Only the system knows who wrote each review for moderation purposes."
          />
        </div>

        <div className="flex gap-3 pt-1">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={handleSubmit} loading={loading} className="flex-1">Submit Review</Button>
        </div>
      </div>
    </Modal>
  )
}

function AskQuestionModal({ open, onClose, onSubmitted }: { open: boolean; onClose: () => void; onSubmitted: (question: { anonymous: boolean; text: string }) => void }) {
  const [text, setText] = useState('')
  const [anon, setAnon] = useState(true)
  const [loading, setLoading] = useState(false)

  const handleSubmit = () => {
    if (!text.trim()) return
    setLoading(true)
    setTimeout(() => {
      onSubmitted({ anonymous: anon, text: censorProfanity(text.trim()) })
      setLoading(false)
      setText('')
      onClose()
    }, 1200)
  }

  return (
    <Modal open={open} onClose={onClose} title="Ask a Question">
      <div className="space-y-4">
        <Textarea
          label="Your question"
          placeholder="Ask something about this course — grades, syllabus, workload, etc."
          rows={4}
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <div className="bg-anon-tint rounded-xl p-4">
          <Toggle checked={anon} onChange={setAnon} label="Ask anonymously" hint="Your identity will be hidden from the professor and other students." />
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={handleSubmit} loading={loading} disabled={!text.trim()} className="flex-1">Submit Question</Button>
        </div>
      </div>
    </Modal>
  )
}

export default function CourseDetail() {
  const { navigate, navParams, studentReviews, addStudentReview, studentQuestions, addStudentQuestion } = useApp()
  const [tab, setTab] = useState('Reviews')
  const [reviewOpen, setReviewOpen] = useState(false)
  const [questionOpen, setQuestionOpen] = useState(false)
  const courseReviews = studentReviews.filter(review => review.course === 'CSE-XXX')
  const courseQuestions = studentQuestions.filter(question => question.course === 'CSE-XXX')

  useEffect(() => {
    if (navParams?.tab === 'Write Review') setReviewOpen(true)
    if (navParams?.tab === 'Q&A') setTab('Q&A')
  }, [navParams])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <WriteReviewModal open={reviewOpen} onClose={() => setReviewOpen(false)} onSubmitted={review => addStudentReview({ ...review, course: 'CSE-XXX' })} />
      <AskQuestionModal open={questionOpen} onClose={() => setQuestionOpen(false)} onSubmitted={question => addStudentQuestion({ ...question, course: 'CSE-XXX' })} />

      {/* Breadcrumb */}
      <button onClick={() => navigate('student-dashboard')} className="text-sm text-brand font-medium hover:underline mb-5 block">← Back to Browse</button>

      {/* Course Header */}
      <div className="bg-surface rounded-2xl border border-line p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-brand bg-brand-tint px-2 py-0.5 rounded-md">CSE</span>
              <span className="text-xs text-fg-muted">CSE-XXX · 3 Credits · Semester —</span>
            </div>
            <h1 className="text-2xl font-bold font-heading text-fg mb-1">Course Name</h1>
            <p className="text-sm text-fg-muted mb-3">Taught by <span className="text-brand font-medium cursor-pointer hover:underline">Professor Name</span></p>
            <div className="flex flex-wrap gap-1.5">
              {['Tag', 'Tag', 'Tag'].map((t, i) => <TagPill key={i} label={t} />)}
            </div>
          </div>
          <div className="text-center sm:text-right flex-shrink-0">
            <div className="text-4xl font-bold font-heading text-fg mb-1">—</div>
            <StarDisplay value={0} />
            <p className="text-xs text-fg-muted mt-1">{courseReviews.length} reviews</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="space-y-5">
          <Card className="p-5">
            <h3 className="font-semibold font-heading text-fg text-sm mb-3">Rating Breakdown</h3>
            <RatingBreakdown counts={[0, 0, 0, 0, 0]} />
          </Card>
          <Card className="p-5">
            <h3 className="font-semibold font-heading text-fg text-sm mb-3">By Criteria</h3>
            <div className="space-y-2">
              {CRITERIA.map(c => (
                <div key={c} className="flex items-center justify-between">
                  <span className="text-xs text-fg-muted">{c}</span>
                  <span className="text-xs font-semibold text-fg">—</span>
                </div>
              ))}
            </div>
          </Card>
          <div className="space-y-2">
            <Button className="w-full" onClick={() => setReviewOpen(true)}>Write a Review</Button>
            <Button className="w-full" variant="outline" onClick={() => setQuestionOpen(true)}>Ask a Question</Button>
          </div>
        </div>

        {/* Main */}
        <div className="lg:col-span-2">
          <Tabs tabs={['Reviews', 'Course & Professor Q&A']} active={tab === 'Q&A' ? 'Course & Professor Q&A' : tab} onChange={nextTab => setTab(nextTab === 'Course & Professor Q&A' ? 'Q&A' : nextTab)} />
          {tab === 'Reviews' && (
            <div className="space-y-4">
              {courseReviews.map(review => <ReviewCard key={review.id} review={review} />)}
              {courseReviews.length === 0 && <EmptyState
                icon={<IconBook className="w-7 h-7" />}
                title="No more reviews"
                description="Be the first to share detailed feedback for this course."
                action={<Button size="sm" onClick={() => setReviewOpen(true)}>Write the first review</Button>}
              />}
            </div>
          )}
          {tab === 'Q&A' && (
            <div className="space-y-4">
              <div className="bg-surface border border-line rounded-xl p-4">
                <Textarea placeholder="Ask something about this course…" rows={2} />
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-fg-muted">Replies come directly from your professor</span>
                  <Button size="sm" onClick={() => setQuestionOpen(true)}>Ask</Button>
                </div>
              </div>
              {courseQuestions.map(question => (
                <Card className="p-4" key={question.id}>
                  <div className="flex items-center gap-2 mb-2">
                    {question.anonymous ? <AnonBadge /> : <span className="text-xs font-medium text-fg">Student</span>}
                    <span className="text-xs text-fg-muted">· {timeAgo(question.createdAt)}</span>
                  </div>
                  <p className="text-sm font-medium text-fg">{question.text}</p>
                </Card>
              ))}
              {courseQuestions.length === 0 && <EmptyState
                icon={<IconMessage className="w-7 h-7" />}
                title="No questions yet"
                description="Be the first to ask a question about this course."
              />}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
