import { useEffect, useState } from 'react'
import { useApp } from '../../context'
import { api } from '../../api'
import { AnonBadge, Button, Card, EmptyState, IconBook, IconMessage, StarDisplay, StatusChip, Tabs } from '../../components/ui'

type Review = { _id: string; course: { code: string; title: string }; anonymous: boolean; text: string; ratings: Record<string, number>; createdAt: string }
type Question = { _id: string; course: { code: string; title: string }; anonymous: boolean; text: string; answer?: { text?: string }; createdAt: string }

function timeAgo(value: string) {
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60000))
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`
  return `${Math.floor(minutes / 1440)}d ago`
}

export default function MyReviews() {
  const { navigate, navParams, token } = useApp()
  const [tab, setTab] = useState(navParams?.tab ?? 'My Reviews')
  const [reviews, setReviews] = useState<Review[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [error, setError] = useState('')

  useEffect(() => { setTab(navParams?.tab ?? 'My Reviews') }, [navParams])
  useEffect(() => {
    if (!token) return
    Promise.all([api<{ reviews: Review[] }>('/reviews/mine', {}, token), api<{ questions: Question[] }>('/questions/mine', {}, token)])
      .then(([reviewData, questionData]) => { setReviews(reviewData.reviews); setQuestions(questionData.questions) })
      .catch(value => setError(value instanceof Error ? value.message : 'Unable to load your activity'))
  }, [token])

  return <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
    <div className="flex items-center justify-between mb-6"><div><h1 className="text-2xl font-bold font-heading text-fg">My Activity</h1><p className="text-sm text-fg-muted">Your saved reviews and questions</p></div><Button onClick={() => navigate('student-dashboard')} variant="outline" size="sm">Browse courses</Button></div>
    <Tabs tabs={['My Reviews', 'My Questions']} active={tab} onChange={setTab} />
    {error && <p role="alert" className="text-sm text-danger mb-4">{error}</p>}
    {tab === 'My Reviews' && <div className="space-y-3">{reviews.map(review => { const values = Object.values(review.ratings); const average = values.reduce((sum, value) => sum + value, 0) / values.length; return <Card key={review._id} className="p-4"><div className="flex items-center gap-2 mb-1"><span className="text-sm font-semibold text-fg">{review.course.code} · {review.course.title}</span>{review.anonymous && <AnonBadge />}</div><div className="flex gap-2 mb-2"><StarDisplay value={average} showText={false} /><span className="text-xs text-fg-muted">Submitted {timeAgo(review.createdAt)}</span></div><p className="text-sm text-fg-muted">{review.text}</p></Card> })}{!reviews.length && <EmptyState icon={<IconBook className="w-7 h-7" />} title="No reviews yet" description="Reviews you submit are saved here." />}</div>}
    {tab === 'My Questions' && <div className="space-y-3">{questions.map(question => <Card key={question._id} className="p-4"><div className="flex items-start justify-between gap-3"><div><div className="flex gap-2 mb-1"><span className="text-sm font-semibold text-fg">{question.course.code} · {question.course.title}</span>{question.anonymous && <AnonBadge />}</div><p className="text-sm text-fg-muted">{question.text}</p><p className="text-xs text-fg-muted mt-2">Asked {timeAgo(question.createdAt)}</p>{question.answer?.text && <p className="text-sm text-fg mt-3"><strong>Answer:</strong> {question.answer.text}</p>}</div><StatusChip status={question.answer?.text ? 'answered' : 'unanswered'} /></div></Card>)}{!questions.length && <EmptyState icon={<IconMessage className="w-7 h-7" />} title="No questions yet" description="Questions you ask are saved here." />}</div>}
  </div>
}
