import { useState } from 'react'
import { useApp } from '../../context'
import {
  Card, Button, TagPill, StarDisplay, Avatar, EmptyState, SearchBar,
  IconBook, IconMessage, IconFilter, SelectField
} from '../../components/ui'

const DEPARTMENTS = ['All', 'CSE', 'EEE', 'ME', 'MIE', 'MME', 'PME', 'Civil', 'WRE', 'Biomedical', 'ETE']
const TAGS = ['Well-structured', 'Heavy Workload', 'Fair Grading', 'Engaging', 'Clear Explanations', 'Research Focused']

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
          <EmptyState
              icon={<IconBook className="w-7 h-7" />}
              title="No courses available"
              description="Courses added by an administrator will appear here."
              action={<Button variant="secondary" onClick={() => setShowFilters(true)}>Browse with filters</Button>}
            />
      ) : (
          <EmptyState
            icon={<IconMessage className="w-7 h-7" />}
            title="No professor profiles yet"
            description="Professor profiles appear automatically when teachers join the platform."
          />
      )}
    </div>
  )
}
