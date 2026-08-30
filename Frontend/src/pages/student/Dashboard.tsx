import { useState } from 'react'
import { useApp } from '../../context'
import {
  Card, Button, TagPill, StarDisplay, Avatar, EmptyState, SearchBar,
  IconBook, IconMessage, IconFilter, SelectField
} from '../../components/ui'

const DEPARTMENTS = ['All', 'CSE', 'EEE', 'ME', 'MIE', 'MME', 'PME', 'Civil', 'WRE', 'Biomedical', 'ETE']
const TAGS = ['Well-structured', 'Heavy Workload', 'Fair Grading', 'Engaging', 'Clear Explanations', 'Research Focused']

function CourseCard({ onClick }: { onClick: () => void }) {
  return (
    <Card onClick={onClick} className="p-4">
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-semibold text-brand bg-brand-tint px-2 py-0.5 rounded-md">CSE</span>
        <StarDisplay value={0} showText={false} />
      </div>
      <h4 className="font-semibold text-fg text-sm mb-0.5">Course Name</h4>
      <p className="text-xs text-fg-muted mb-3">CSE-XXX · 3 Credits · Semester —</p>
      <div className="flex flex-wrap gap-1.5 mb-3">
        <TagPill label="Tag" />
        <TagPill label="Tag" />
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-fg-muted">0 reviews</p>
        <Button size="sm" variant="secondary" onClick={e => { e.stopPropagation() }}>Write review</Button>
      </div>
    </Card>
  )
}

function ProfCard({ onClick }: { onClick: () => void }) {
  return (
    <Card onClick={onClick} className="p-4">
      <div className="flex items-center gap-3 mb-3">
        <Avatar name="P N" size="md" />
        <div className="min-w-0">
          <h4 className="font-semibold text-fg text-sm truncate">Professor Name</h4>
          <p className="text-xs text-fg-muted">Department · Title</p>
        </div>
      </div>
      <StarDisplay value={0} />
      <div className="flex flex-wrap gap-1.5 mt-2">
        <TagPill label="Tag" />
      </div>
      <p className="text-xs text-fg-muted mt-2">0 reviews · teaches 0 courses</p>
    </Card>
  )
}

export default function StudentDashboard() {
  const { navigate } = useApp()
  const [query, setQuery] = useState('')
  const [dept, setDept] = useState('All')
  const [tab, setTab] = useState<'courses' | 'professors'>('courses')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const toggleTag = (t: string) => setSelectedTags(s => s.includes(t) ? s.filter(x => x !== t) : [...s, t])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-heading text-fg mb-1">Discover Courses & Professors</h1>
        <p className="text-sm text-fg-muted">Browse honest reviews from your peers at CUET</p>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'My Reviews', icon: '⭐', view: 'student-my-reviews' as const, color: 'bg-brand-tint text-brand' },
          { label: 'My Questions', icon: '💬', view: 'student-my-reviews' as const, color: 'bg-accent-tint text-accent' },
          { label: 'Profile', icon: '👤', view: 'student-profile' as const, color: 'bg-anon-tint text-anon' },
          { label: 'Course Detail', icon: '📚', view: 'student-course-detail' as const, color: 'bg-warning/15 text-warning' },
        ].map(item => (
          <button
            key={item.label}
            onClick={() => navigate(item.view)}
            className={`${item.color} rounded-xl p-4 text-left hover:opacity-80 transition-opacity`}
          >
            <div className="text-2xl mb-1">{item.icon}</div>
            <p className="text-sm font-semibold">{item.label}</p>
          </button>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="mb-5">
        <div className="flex gap-2 mb-3">
          <div className="flex-1">
            <SearchBar
              placeholder="Search courses, professors, departments…"
              value={query}
              onChange={setQuery}
            />
          </div>
          <Button variant="outline" onClick={() => setShowFilters(v => !v)}>
            <IconFilter />
            Filters
          </Button>
        </div>
        {showFilters && (
          <Card className="p-4 space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <SelectField label="Department" value={dept} onChange={e => setDept(e.target.value)}>
                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
              </SelectField>
              <SelectField label="Semester">
                <option>All semesters</option>
                {[1,2,3,4,5,6,7,8].map(s => <option key={s}>Semester {s}</option>)}
              </SelectField>
              <SelectField label="Min. rating">
                <option>Any rating</option>
                {[4,3,2,1].map(r => <option key={r}>{r}+ stars</option>)}
              </SelectField>
            </div>
            <div>
              <p className="text-xs font-medium text-fg mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {TAGS.map(t => (
                  <TagPill
                    key={t}
                    label={t}
                    selected={selectedTags.includes(t)}
                    onClick={() => toggleTag(t)}
                  />
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-line mb-6">
        {(['courses', 'professors'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${tab === t ? 'text-brand border-brand' : 'text-fg-muted border-transparent hover:text-fg'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Grid */}
      {tab === 'courses' ? (
        query || dept !== 'All' || selectedTags.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }, (_, i) => (
              <CourseCard key={i} onClick={() => navigate('student-course-detail')} />
            ))}
          </div>
        ) : (
          <div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {Array.from({ length: 3 }, (_, i) => (
                <CourseCard key={i} onClick={() => navigate('student-course-detail')} />
              ))}
            </div>
            <EmptyState
              icon={<IconBook className="w-7 h-7" />}
              title="No more courses yet"
              description="Courses are added by administrators. Check back as the platform grows."
              action={<Button variant="secondary" onClick={() => setShowFilters(true)}>Browse with filters</Button>}
            />
          </div>
        )
      ) : (
        <div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {Array.from({ length: 3 }, (_, i) => (
              <ProfCard key={i} onClick={() => navigate('student-course-detail')} />
            ))}
          </div>
          <EmptyState
            icon={<IconMessage className="w-7 h-7" />}
            title="No professor profiles yet"
            description="Professor profiles appear automatically when teachers join the platform."
          />
        </div>
      )}
    </div>
  )
}
