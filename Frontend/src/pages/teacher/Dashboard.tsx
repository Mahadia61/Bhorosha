import { useApp } from '../../context'
import { Card, Button, StarDisplay, KpiCard, EmptyState, IconBook, IconMessage, IconTrendingUp, IconBarChart } from '../../components/ui'

function CourseRow({ onClick }: { onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between gap-4 p-4 rounded-xl hover:bg-brand-tint/30 cursor-pointer transition-colors group"
    >
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-fg text-sm group-hover:text-brand transition-colors truncate">Course Name</h4>
        <p className="text-xs text-fg-muted">CSE-XXX · Semester — · 3 Credits</p>
      </div>
      <div className="text-right flex-shrink-0">
        <StarDisplay value={0} showText={false} />
        <p className="text-xs text-fg-muted mt-0.5">0 reviews · 0 questions</p>
      </div>
    </div>
  )
}

export default function TeacherDashboard() {
  const { navigate } = useApp()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-heading text-fg mb-0.5">Teaching Dashboard</h1>
        <p className="text-sm text-fg-muted">Overview of your courses and student feedback</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard label="Overall Avg. Rating" value="—" sub="across all courses" icon={<IconBarChart />} color="brand" />
        <KpiCard label="Total Reviews" value="0" sub="from students" icon={<IconBook />} color="accent" />
        <KpiCard label="Pending Questions" value="0" sub="awaiting your answer" icon={<IconMessage />} color="warning" />
        <KpiCard label="Trending Tag" value="—" sub="most common feedback" icon={<IconTrendingUp />} color="anon" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* My Courses */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-line">
              <h2 className="font-semibold font-heading text-fg">My Courses</h2>
              <Button size="sm" variant="secondary" onClick={() => navigate('teacher-course-feedback')}>View all feedback</Button>
            </div>
            <div className="px-2 py-2 divide-y divide-line">
              <CourseRow onClick={() => navigate('teacher-course-feedback')} />
              <CourseRow onClick={() => navigate('teacher-course-feedback')} />
              <CourseRow onClick={() => navigate('teacher-course-feedback')} />
            </div>
            <div className="px-5 py-3 border-t border-line">
              <EmptyState
                title="No more courses assigned"
                description="Contact your administrator to have courses assigned to your profile."
              />
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Trending Tags */}
          <Card className="p-5">
            <h3 className="font-semibold font-heading text-fg text-sm mb-3">Top Feedback Tags</h3>
            <div className="space-y-2">
              {['Well-structured', 'Clear Explanations', 'Fair Grading', 'Heavy Workload'].map((tag, i) => (
                <div key={tag} className="flex items-center justify-between">
                  <span className="text-sm text-fg-muted">{tag}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 rounded-full bg-brand" style={{ width: `${Math.max(20, 80 - i * 15)}px` }} />
                    <span className="text-xs text-fg-muted w-4 text-right">0</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-fg-muted text-center mt-3">No data yet — tags will appear as reviews come in</p>
          </Card>

          {/* Recent Questions */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold font-heading text-fg text-sm">Pending Questions</h3>
              <Button size="sm" variant="ghost" onClick={() => navigate('teacher-qa')}>View all</Button>
            </div>
            <EmptyState
              title="No pending questions"
              description="Student questions from your courses will appear here."
            />
          </Card>
        </div>
      </div>

      {/* Rating trend placeholder */}
      <Card className="mt-6 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold font-heading text-fg">Rating Trend</h2>
          <span className="text-xs text-fg-muted">By semester</span>
        </div>
        <div className="h-40 flex items-end gap-3 border-b border-line pb-3">
          {['S1', 'S2', 'S3', 'S4', 'S5', 'S6'].map(s => (
            <div key={s} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-line rounded-t-sm" style={{ height: '100%', minHeight: 4, opacity: 0.3 }} />
              <span className="text-xs text-fg-muted">{s}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-fg-muted text-center mt-2">Trend data will appear after students submit reviews each semester</p>
      </Card>
    </div>
  )
}
