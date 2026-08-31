import { useState, useEffect } from 'react'
import { useApp, type StudentQuestion, type StudentReview } from '../../context'
import { Card, Button, StatusChip, AnonBadge, StarDisplay, EmptyState, Tabs, IconBook, IconMessage } from '../../components/ui'

function timeAgo(value: string) {
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60000))
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

function ReviewItem({ review }: { review: StudentReview }) {
  const ratings = Object.values(review.ratings)
  const average = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
  return <Card className="p-4"><div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-1 flex-wrap"><span className="text-sm font-semibold text-fg truncate">{review.course}</span>{review.anonymous && <AnonBadge />}</div><div className="flex items-center gap-2 mb-2"><StarDisplay value={average} showText={false} /><span className="text-xs text-fg-muted">· Submitted {timeAgo(review.createdAt)}</span></div><p className="text-sm text-fg-muted leading-relaxed line-clamp-2">{review.text}</p></div></Card>
}

function QuestionItem({ question }: { question: StudentQuestion }) {
  return <Card className="p-4"><div className="flex items-start justify-between gap-3"><div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-1 flex-wrap"><span className="text-sm font-semibold text-fg">{question.course}</span>{question.anonymous && <AnonBadge />}</div><p className="text-sm text-fg-muted mb-2">{question.text}</p><span className="text-xs text-fg-muted">Asked {timeAgo(question.createdAt)}</span></div><StatusChip status="unanswered" /></div></Card>
}

export default function MyReviews() {
  const { navigate, navParams, studentReviews, studentQuestions } = useApp()
  const [tab, setTab] = useState(navParams?.tab ?? 'My Reviews')
  useEffect(() => { setTab(navParams?.tab ?? 'My Reviews') }, [navParams])

  return <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
    <div className="flex items-center justify-between mb-6"><div><h1 className="text-2xl font-bold font-heading text-fg">My Activity</h1><p className="text-sm text-fg-muted">Track your submitted reviews and questions</p></div><Button onClick={() => navigate('student-dashboard')} variant="outline" size="sm">Browse courses</Button></div>
    <Tabs tabs={['My Reviews', 'My Questions']} active={tab} onChange={setTab} />
    {tab === 'My Reviews' && <div className="space-y-3">{studentReviews.map(review => <ReviewItem key={review.id} review={review} />)}{studentReviews.length === 0 && <EmptyState icon={<IconBook className="w-7 h-7" />} title="No reviews yet" description="Your submitted reviews will appear here." action={<Button size="sm" onClick={() => navigate('student-dashboard')}>Browse courses</Button>} />}</div>}
    {tab === 'My Questions' && <div className="space-y-3">{studentQuestions.map(question => <QuestionItem key={question.id} question={question} />)}{studentQuestions.length === 0 && <EmptyState icon={<IconMessage className="w-7 h-7" />} title="No questions yet" description="Questions you ask from a course page will appear here." action={<Button size="sm" onClick={() => navigate('student-dashboard')}>Browse courses</Button>} />}</div>}
  </div>
}
