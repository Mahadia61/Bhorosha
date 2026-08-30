import { useState } from 'react'
import { Card, Button, SearchBar, SelectField, Modal, TextField, Textarea, EmptyState, PageHeader, IconBook, IconEdit, IconTrash, IconPlus } from '../../components/ui'

const DEPARTMENTS = ['CSE', 'EEE', 'ME', 'MIE', 'MME', 'PME', 'Civil', 'WRE', 'Biomedical', 'ETE', 'Architecture', 'URP']

interface Course {
  id: number
  name: string
  code: string
  dept: string
  credits: number
  teacher: string
  desc: string
}

const DEMO_COURSES: Course[] = [
  { id: 1, name: 'Data Structures & Algorithms', code: 'CSE-201', dept: 'CSE', credits: 3, teacher: 'Professor Name', desc: 'Fundamental algorithms and data structures.' },
  { id: 2, name: 'Digital Electronics', code: 'EEE-101', dept: 'EEE', credits: 3, teacher: 'Professor Name', desc: 'Introduction to digital circuit design.' },
  { id: 3, name: 'Thermodynamics', code: 'ME-301', dept: 'ME', credits: 3, teacher: 'Professor Name', desc: 'Classical thermodynamics for mechanical systems.' },
]

const EMPTY_FORM = { name: '', code: '', dept: 'CSE', credits: '3', teacher: '', desc: '' }

function CourseRow({ course, onEdit, onDelete }: { course: Course; onEdit: (c: Course) => void; onDelete: (c: Course) => void }) {
  return (
    <tr className="hover:bg-brand-tint/20 transition-colors">
      <td className="px-4 py-3">
        <p className="text-sm font-semibold text-fg">{course.name}</p>
        <p className="text-xs text-fg-muted">{course.desc}</p>
      </td>
      <td className="px-4 py-3">
        <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-brand-tint text-brand">{course.code}</span>
      </td>
      <td className="px-4 py-3 text-sm text-fg-muted">{course.dept}</td>
      <td className="px-4 py-3 text-sm text-fg-muted">{course.credits}</td>
      <td className="px-4 py-3 text-sm text-fg-muted">{course.teacher}</td>
      <td className="px-4 py-3">
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(course)}
            className="p-1.5 rounded-lg hover:bg-brand-tint text-fg-muted hover:text-brand transition-colors"
          >
            <IconEdit />
          </button>
          <button
            onClick={() => onDelete(course)}
            className="p-1.5 rounded-lg hover:bg-danger/10 text-fg-muted hover:text-danger transition-colors"
          >
            <IconTrash />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>(DEMO_COURSES)
  const [query, setQuery] = useState('')
  const [deptFilter, setDeptFilter] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [editCourse, setEditCourse] = useState<Course | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null)

  const openAdd = () => { setEditCourse(null); setForm(EMPTY_FORM); setModalOpen(true) }
  const openEdit = (c: Course) => { setEditCourse(c); setForm({ name: c.name, code: c.code, dept: c.dept, credits: String(c.credits), teacher: c.teacher, desc: c.desc }); setModalOpen(true) }

  const handleSave = () => {
    if (editCourse) {
      setCourses(cs => cs.map(c => c.id === editCourse.id ? { ...c, ...form, credits: Number(form.credits) } : c))
    } else {
      setCourses(cs => [...cs, { id: Date.now(), ...form, credits: Number(form.credits) }])
    }
    setModalOpen(false)
  }

  const handleDelete = () => {
    if (deleteTarget) setCourses(cs => cs.filter(c => c.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const filtered = courses.filter(c =>
    (deptFilter === 'All' || c.dept === deptFilter) &&
    (c.name.toLowerCase().includes(query.toLowerCase()) || c.code.toLowerCase().includes(query.toLowerCase()))
  )

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Add/Edit modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editCourse ? 'Edit Course' : 'Add Course'} width="max-w-xl">
        <div className="space-y-4">
          <TextField label="Course name" placeholder="e.g. Data Structures & Algorithms" value={form.name} onChange={set('name')} />
          <div className="grid grid-cols-2 gap-3">
            <TextField label="Course code" placeholder="e.g. CSE-201" value={form.code} onChange={set('code')} />
            <TextField label="Credit hours" type="number" placeholder="3" value={form.credits} onChange={set('credits')} />
          </div>
          <SelectField label="Department" value={form.dept} onChange={set('dept')}>
            {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
          </SelectField>
          <TextField label="Assigned teacher" placeholder="Select or type professor name" value={form.teacher} onChange={set('teacher')} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-fg">Short description</label>
            <textarea
              placeholder="Brief description of the course content…"
              rows={3}
              value={form.desc}
              onChange={set('desc')}
              className="w-full rounded-lg border border-line px-3 py-2.5 text-sm bg-surface text-fg resize-none outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <Button variant="outline" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleSave} className="flex-1" disabled={!form.name || !form.code}>{editCourse ? 'Save changes' : 'Add course'}</Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Course">
        <div className="space-y-4">
          <p className="text-sm text-fg-muted">Are you sure you want to delete <strong className="text-fg">{deleteTarget?.name}</strong>? This will also remove all associated reviews and questions. This action cannot be undone.</p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setDeleteTarget(null)} className="flex-1">Cancel</Button>
            <Button variant="danger" onClick={handleDelete} className="flex-1">Delete permanently</Button>
          </div>
        </div>
      </Modal>

      <PageHeader
        title="Course Management"
        description="Add and manage courses that students can review"
        actions={
          <Button onClick={openAdd}>
            <IconPlus />
            Add Course
          </Button>
        }
      />

      {/* Dept summary */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['All', ...DEPARTMENTS].map(d => (
          <button
            key={d}
            onClick={() => setDeptFilter(d)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${deptFilter === d ? 'bg-brand text-white' : 'bg-surface border border-line text-fg-muted hover:text-fg'}`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1">
          <SearchBar placeholder="Search courses by name or code…" value={query} onChange={setQuery} />
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line bg-bg">
                <th className="px-4 py-3 text-xs font-semibold text-fg-muted uppercase tracking-wide">Course</th>
                <th className="px-4 py-3 text-xs font-semibold text-fg-muted uppercase tracking-wide">Code</th>
                <th className="px-4 py-3 text-xs font-semibold text-fg-muted uppercase tracking-wide">Dept</th>
                <th className="px-4 py-3 text-xs font-semibold text-fg-muted uppercase tracking-wide">Credits</th>
                <th className="px-4 py-3 text-xs font-semibold text-fg-muted uppercase tracking-wide">Teacher</th>
                <th className="px-4 py-3 text-xs font-semibold text-fg-muted uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map(c => <CourseRow key={c.id} course={c} onEdit={openEdit} onDelete={setDeleteTarget} />)}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <EmptyState
            icon={<IconBook className="w-7 h-7" />}
            title="No courses found"
            description={query ? 'No courses match your search.' : 'No courses added yet. Add the first course to get started.'}
            action={<Button size="sm" onClick={openAdd}><IconPlus className="w-3.5 h-3.5" />Add course</Button>}
          />
        )}
      </Card>
    </div>
  )
}
