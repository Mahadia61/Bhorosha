import { useEffect, useState } from 'react'
import { api } from '../../api'
import { useApp } from '../../context'
import { Card, Button, AnonBadge, StatusChip, Modal, Textarea, EmptyState, Tabs, IconMessage } from '../../components/ui'

type Question = { _id: string; anonymous: boolean; text: string; createdAt: string; course?: { code: string; title: string }; answer?: { text: string; answeredAt: string }; source: 'course' | 'professor' }
export default function TeacherQA() {
  const { token } = useApp()
  const [questions, setQuestions] = useState<Question[]>([])
  const [tab, setTab] = useState('Unanswered')
  const [selected, setSelected] = useState<Question | null>(null)
  const [answer, setAnswer] = useState('')
  const load = () => {
    if (!token) return
    Promise.all([api<{ questions: Omit<Question, 'source'>[] }>('/questions/teacher', {}, token), api<{ questions: Omit<Question, 'source'>[] }>('/professors/me/questions', {}, token)])
      .then(([courseData, professorData]) => setQuestions([...courseData.questions.map(question => ({ ...question, source: 'course' as const })), ...professorData.questions.map(question => ({ ...question, source: 'professor' as const }))].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())))
      .catch(() => {})
  }
  useEffect(() => { load() }, [token])
  const current = questions.filter(question => tab === 'Answered' ? question.answer : !question.answer)
  const submit = () => {
    if (!token || !selected || !answer.trim()) return
    const path = selected.source === 'course' ? `/questions/${selected._id}/answer` : `/professors/questions/${selected._id}/answer`
    api<{ question: Question }>(path, { method: 'POST', body: JSON.stringify({ text: answer }) }, token).then(() => { setSelected(null); setAnswer(''); load() }).catch(() => {})
  }
  return <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8"><Modal open={!!selected} onClose={() => setSelected(null)} title="Answer Question"><Textarea label="Your answer" value={answer} onChange={e => setAnswer(e.target.value)} rows={4} /><div className="flex gap-3 mt-4"><Button variant="outline" onClick={() => setSelected(null)} className="flex-1">Cancel</Button><Button onClick={submit} disabled={!answer.trim()} className="flex-1">Post answer</Button></div></Modal><h1 className="text-2xl font-bold font-heading text-fg">Q&A Management</h1><p className="text-sm text-fg-muted mb-6">Answer questions about your courses and your professor profile.</p><Tabs tabs={['Unanswered', 'Answered']} active={tab} onChange={setTab} /><div className="space-y-4 mt-4">{current.map(question => <Card key={`${question.source}-${question._id}`} className="p-4"><div className="flex justify-between gap-3 mb-2"><div className="flex items-center gap-2">{question.anonymous ? <AnonBadge /> : <span className="text-sm">Student</span>}<span className="text-xs text-fg-muted">{question.source === 'course' ? question.course?.code : 'Professor Q&A'}</span></div><StatusChip status={question.answer ? 'answered' : 'unanswered'} /></div><p className="text-sm text-fg">{question.text}</p>{question.answer ? <div className="bg-accent-tint rounded-xl p-3 mt-3 text-sm">{question.answer.text}</div> : <Button size="sm" className="mt-3" onClick={() => setSelected(question)}>Answer</Button>}</Card>)}{current.length === 0 && <EmptyState icon={<IconMessage className="w-7 h-7" />} title={`No ${tab.toLowerCase()} questions`} description="Questions submitted by students will appear here." />}</div></div>
}
