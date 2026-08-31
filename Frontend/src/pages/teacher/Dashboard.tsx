import { useEffect, useState } from 'react'
import { api } from '../../api'
import { useApp } from '../../context'
import { Card, Button, KpiCard, EmptyState, IconBook, IconMessage, IconTrendingUp, IconBarChart } from '../../components/ui'

type Course = { _id: string; code: string; title: string; credits: number }
type Stats = { totalReviews: number; pendingQuestions: number; average: number | null; tags: { name: string; count: number }[]; trend: { month: string; average: number; count: number }[] }

export default function TeacherDashboard() {
  const { navigate, token } = useApp()
  const [courses, setCourses] = useState<Course[]>([])
  const [stats, setStats] = useState<Stats>({ totalReviews: 0, pendingQuestions: 0, average: null, tags: [], trend: [] })
  useEffect(() => { if (!token) return; api<{ courses: Course[] }>('/courses', {}, token).then(({ courses }) => setCourses(courses)).catch(() => {}); api<{ stats: Stats }>('/reviews/teacher/stats', {}, token).then(({ stats }) => setStats(stats)).catch(() => {}) }, [token])
  return <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
    <div className="mb-8"><h1 className="text-2xl font-bold font-heading text-fg mb-0.5">Teaching Dashboard</h1><p className="text-sm text-fg-muted">Overview of your courses and student feedback</p></div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"><KpiCard label="Overall Avg. Rating" value={stats.average?.toFixed(1) ?? '—'} sub="across all courses" icon={<IconBarChart />} color="brand" /><KpiCard label="Total Reviews" value={String(stats.totalReviews)} sub="from students" icon={<IconBook />} color="accent" /><KpiCard label="Pending Questions" value={String(stats.pendingQuestions)} sub="awaiting your answer" icon={<IconMessage />} color="warning" /><KpiCard label="Trending Tag" value={stats.tags[0]?.name ?? '—'} sub="most common feedback" icon={<IconTrendingUp />} color="anon" /></div>
    <Card className="overflow-hidden"><div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-line"><h2 className="font-semibold font-heading text-fg">My Courses</h2><Button size="sm" variant="secondary" onClick={() => navigate('teacher-course-feedback')}>View feedback</Button></div>{courses.length ? <div className="divide-y divide-line">{courses.map(course => <button key={course._id} onClick={() => navigate('teacher-course-feedback')} className="w-full text-left p-4 hover:bg-brand-tint/30"><p className="font-semibold text-sm text-fg">{course.title}</p><p className="text-xs text-fg-muted">{course.code} · {course.credits} credits</p></button>)}</div> : <EmptyState title="No courses assigned" description="Courses assigned by an administrator will appear here." />}</Card>
    <Card className="mt-6 p-6"><h2 className="font-semibold font-heading text-fg mb-4">Rating Trend</h2><p className="text-xs text-fg-muted mb-3">By month and year</p>{stats.trend.length ? <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{stats.trend.map(point => <div key={point.month} className="rounded-lg bg-brand-tint p-3"><p className="text-sm font-semibold text-fg">{point.average.toFixed(1)} / 5</p><p className="text-xs text-fg-muted">{point.month} · {point.count} reviews</p></div>)}</div> : <EmptyState title="No trend data yet" description="Monthly trend data will appear after reviews are submitted." />}</Card>
  </div>
}
