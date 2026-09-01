import { useEffect, useState } from 'react'
import { api } from '../../api'
import { useApp } from '../../context'
import { Avatar, Button, Card, EmptyState, IconBook, IconFilter, IconMessage, Modal, SearchBar, SelectField, StarDisplay, Textarea } from '../../components/ui'

type Course = { _id: string; code: string; title: string; credits: number; semester?: string; department: string; teacher?: { _id: string; name: string; department: string } }
type Professor = { _id: string; name: string; department: string }
type ProfessorReview = { _id: string; text: string; rating: number; createdAt: string }
type ProfessorQuestion = { _id: string; text: string; answer?: { text?: string; teacher?: { name: string } } }

export default function StudentDashboard() {
  const { navigate, token } = useApp()
  const [tab, setTab] = useState<'courses' | 'professors'>('courses')
  const [query, setQuery] = useState('')
  const [courses, setCourses] = useState<Course[]>([])
  const [professors, setProfessors] = useState<Professor[]>([])
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null)
  const [professorReviews, setProfessorReviews] = useState<ProfessorReview[]>([])
  const [professorQuestions, setProfessorQuestions] = useState<ProfessorQuestion[]>([])
  const [professorReviewText, setProfessorReviewText] = useState('')
  const [professorRating, setProfessorRating] = useState('5')
  const [professorQuestionText, setProfessorQuestionText] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [semester, setSemester] = useState('all')
  const [credits, setCredits] = useState('all')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return
    Promise.all([api<{ courses: Course[] }>('/courses', {}, token), api<{ professors: Professor[] }>('/admin/professors', {}, token)])
      .then(([courseData, professorData]) => { setCourses(courseData.courses); setProfessors(professorData.professors) })
      .catch(value => setError(value instanceof Error ? value.message : 'Unable to load courses'))
  }, [token])

  useEffect(() => {
    if (!token || !selectedProfessor) return
    api<{ reviews: ProfessorReview[]; questions: ProfessorQuestion[] }>(`/professors/${selectedProfessor._id}/feedback`, {}, token)
      .then(data => { setProfessorReviews(data.reviews); setProfessorQuestions(data.questions) })
      .catch(value => setError(value instanceof Error ? value.message : 'Unable to load professor feedback'))
  }, [token, selectedProfessor])

  const visibleCourses = courses.filter(course =>
    `${course.code} ${course.title} ${course.teacher?.name ?? ''}`.toLowerCase().includes(query.toLowerCase())
    && (semester === 'all' || course.semester === semester)
    && (credits === 'all' || course.credits === Number(credits))
  )
  const visibleProfessors = professors.filter(professor => professor.name.toLowerCase().includes(query.toLowerCase()))
  const professorCourses = selectedProfessor ? courses.filter(course => course.teacher?._id === selectedProfessor._id) : []
  const semesterOptions = [...new Set(courses.map(course => course.semester).filter((value): value is string => Boolean(value)))].sort()
  const reloadProfessorFeedback = () => selectedProfessor && token && api<{ reviews: ProfessorReview[]; questions: ProfessorQuestion[] }>(`/professors/${selectedProfessor._id}/feedback`, {}, token).then(data => { setProfessorReviews(data.reviews); setProfessorQuestions(data.questions) })
  const submitProfessorReview = () => selectedProfessor && token && api(`/professors/${selectedProfessor._id}/reviews`, { method: 'POST', body: JSON.stringify({ text: professorReviewText, rating: Number(professorRating), anonymous: true }) }, token).then(() => { setProfessorReviewText(''); reloadProfessorFeedback() }).catch(value => setError(value instanceof Error ? value.message : 'Unable to submit professor review'))
  const submitProfessorQuestion = () => selectedProfessor && token && api(`/professors/${selectedProfessor._id}/questions`, { method: 'POST', body: JSON.stringify({ text: professorQuestionText, anonymous: true }) }, token).then(() => { setProfessorQuestionText(''); reloadProfessorFeedback() }).catch(value => setError(value instanceof Error ? value.message : 'Unable to submit professor question'))

  return <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
    <h1 className="text-2xl font-bold font-heading text-fg mb-1">Discover Courses & Professors</h1>
    <p className="text-sm text-fg-muted mb-6">Your department’s courses, professor profiles, reviews, and Q&A.</p>
    <div className="flex gap-2">
      <div className="flex-1"><SearchBar placeholder={tab === 'courses' ? 'Search courses…' : 'Search professors…'} value={query} onChange={setQuery} /></div>
      {tab === 'courses' && <Button variant="outline" onClick={() => setShowFilters(value => !value)}><IconFilter /> Filters</Button>}
    </div>
    {tab === 'courses' && showFilters && <Card className="p-4 mt-3"><div className="grid sm:grid-cols-2 gap-4"><SelectField label="Semester" value={semester} onChange={event => setSemester(event.target.value)}><option value="all">All semesters</option>{semesterOptions.map(value => <option key={value} value={value}>{value}</option>)}</SelectField><SelectField label="Credit hours" value={credits} onChange={event => setCredits(event.target.value)}><option value="all">All credit hours</option>{[1, 2, 3, 4, 5, 6].map(value => <option key={value} value={value}>{value} credits</option>)}</SelectField></div><p className="text-xs text-fg-muted mt-3">Your department is automatically applied from your CUET student ID.</p></Card>}
    <div className="flex gap-1 border-b border-line my-6">{(['courses', 'professors'] as const).map(item => <button key={item} onClick={() => setTab(item)} className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 -mb-px ${tab === item ? 'text-brand border-brand' : 'text-fg-muted border-transparent'}`}>{item}</button>)}</div>
    {error && <p role="alert" className="text-sm text-danger mb-4">{error}</p>}
    {tab === 'courses' ? <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{visibleCourses.map(course => <Card key={course._id} onClick={() => navigate('student-course-detail', { courseId: course._id })} className="p-5"><p className="text-xs font-semibold text-brand">{course.code}</p><h2 className="font-semibold text-fg mt-1">{course.title}</h2><p className="text-sm text-fg-muted mt-2">{course.teacher?.name ?? 'Teacher not assigned'} · {course.credits} credits</p>{course.semester && <p className="text-xs text-fg-muted mt-1">{course.semester}</p>}</Card>)}{!visibleCourses.length && <div className="md:col-span-2 lg:col-span-3"><EmptyState icon={<IconBook className="w-7 h-7" />} title="No courses found" description="Try another search or filter." /></div>}</div> : <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{visibleProfessors.map(professor => <Card key={professor._id} onClick={() => setSelectedProfessor(professor)} className="p-5"><div className="flex gap-3"><Avatar name={professor.name} /><div><h2 className="font-semibold text-fg">{professor.name}</h2><p className="text-sm text-fg-muted">{professor.department}</p><p className="text-xs text-brand mt-2">View assigned courses →</p></div></div></Card>)}{!visibleProfessors.length && <div className="md:col-span-2 lg:col-span-3"><EmptyState icon={<IconMessage className="w-7 h-7" />} title="No professors found" description="Professor records added by the administrator appear here." /></div>}</div>}
    <Modal open={!!selectedProfessor} onClose={() => setSelectedProfessor(null)} title={selectedProfessor?.name ?? 'Professor'} width="max-w-3xl"><p className="text-sm text-fg-muted mb-4">{selectedProfessor?.department}</p><section className="mb-6"><h2 className="font-semibold mb-2">Assigned Courses</h2><div className="space-y-2">{professorCourses.map(course => <Card key={course._id} onClick={() => { setSelectedProfessor(null); navigate('student-course-detail', { courseId: course._id }) }} className="p-3"><p className="font-medium text-sm">{course.code} · {course.title}</p><p className="text-xs text-fg-muted">{course.credits} credits {course.semester ? `· ${course.semester}` : ''}</p></Card>)}{!professorCourses.length && <p className="text-sm text-fg-muted">No assigned courses yet.</p>}</div></section><div className="grid md:grid-cols-2 gap-6"><section><h2 className="font-semibold mb-2">Professor Reviews</h2><SelectField label="Rating" value={professorRating} onChange={event => setProfessorRating(event.target.value)}>{[5, 4, 3, 2, 1].map(value => <option key={value} value={value}>{value} star{value === 1 ? '' : 's'}</option>)}</SelectField><Textarea label="Write an anonymous professor review" value={professorReviewText} onChange={event => setProfessorReviewText(event.target.value)} /><Button className="mt-2" size="sm" disabled={!professorReviewText.trim()} onClick={submitProfessorReview}>Post review</Button><div className="space-y-2 mt-4">{professorReviews.map(review => <Card key={review._id} className="p-3"><StarDisplay value={review.rating} /><p className="text-sm text-fg-muted mt-1">{review.text}</p></Card>)}{!professorReviews.length && <p className="text-sm text-fg-muted">No professor reviews yet.</p>}</div></section><section><h2 className="font-semibold mb-2">Professor Q&A</h2><Textarea label="Ask an anonymous question" value={professorQuestionText} onChange={event => setProfessorQuestionText(event.target.value)} /><Button className="mt-2" size="sm" disabled={!professorQuestionText.trim()} onClick={submitProfessorQuestion}>Post question</Button><div className="space-y-2 mt-4">{professorQuestions.map(question => <Card key={question._id} className="p-3"><p className="text-sm">{question.text}</p>{question.answer?.text ? <p className="text-sm text-fg-muted mt-2"><strong>{question.answer.teacher?.name ?? 'Professor'}:</strong> {question.answer.text}</p> : <p className="text-xs text-fg-muted mt-2">Awaiting an answer</p>}</Card>)}{!professorQuestions.length && <p className="text-sm text-fg-muted">No professor questions yet.</p>}</div></section></div><Button className="w-full mt-5" variant="outline" onClick={() => setSelectedProfessor(null)}>Close</Button></Modal>
  </div>
}
