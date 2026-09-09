import { useEffect, useState } from 'react'
import { api } from '../../api'
import { useApp } from '../../context'
import { Button, Card, EmptyState, PageHeader, SearchBar, Modal, TextField, SelectField } from '../../components/ui'

type User = { _id: string; name: string; email: string; role: 'student' | 'teacher' | 'admin'; department?: string; active: boolean; accountStatus?: 'unclaimed' | 'claimed'; createdAt: string }
export default function AdminUsers() {
  const { token } = useApp(); const [users, setUsers] = useState<User[]>([]); const [query, setQuery] = useState(''); const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', department: 'CSE' })
  const createTeacher = async (event: React.FormEvent) => {
    event.preventDefault(); if (!token) return
    setSaving(true); setError('')
    try {
      await api('/admin/professors', { method: 'POST', body: JSON.stringify(form) }, token)
      setOpen(false); setForm({ name: '', email: '', department: 'CSE' }); load()
    } catch (error) { setError(error instanceof Error ? error.message : 'Unable to create teacher profile') }
    finally { setSaving(false) }
  }
  const load = () => token && api<{ users: User[] }>('/admin/users', {}, token).then(data => setUsers(data.users)).catch(value => setError(value instanceof Error ? value.message : 'Unable to load users'))
  useEffect(() => { load() }, [token])
  const updateStatus = (user: User) => token && api(`/admin/users/${user._id}`, { method: 'PATCH', body: JSON.stringify({ active: !user.active }) }, token).then(() => { load() }).catch(value => setError(value instanceof Error ? value.message : 'Unable to update user'))
  const filtered = users.filter(user => `${user.name} ${user.email} ${user.department ?? ''}`.toLowerCase().includes(query.toLowerCase()))
  return <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8"><PageHeader title="User Management" description="Manage accounts and teacher profiles" actions={<Button onClick={() => { setError(''); setOpen(true) }}>Add teacher profile</Button>} /><Modal open={open} onClose={() => setOpen(false)} title="Add teacher profile"><form className="space-y-4" onSubmit={createTeacher}><p className="text-sm text-fg-muted">Students can review this teacher immediately. The teacher can claim this profile by registering and verifying the same email.</p><TextField required label="Teacher name" value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} /><TextField required type="email" label="CUET email" placeholder="name@cuet.ac.bd" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} /><SelectField label="Department" value={form.department} onChange={event => setForm({ ...form, department: event.target.value })}>{['CIVIL', 'EEE', 'ME', 'CSE', 'MIE', 'MME', 'PME', 'WRE', 'BME', 'ETE'].map(department => <option key={department}>{department}</option>)}</SelectField>{error && <p role="alert" className="text-sm text-danger">{error}</p>}<Button type="submit" loading={saving}>Create profile</Button></form></Modal><SearchBar placeholder="Search name, email, or department…" value={query} onChange={setQuery} /><div className="grid grid-cols-3 gap-3 my-6"><Card className="p-3 text-center"><p className="text-xl font-bold">{users.length}</p><p className="text-xs text-fg-muted">Total users</p></Card><Card className="p-3 text-center"><p className="text-xl font-bold">{users.filter(user => user.role === 'student').length}</p><p className="text-xs text-fg-muted">Students</p></Card><Card className="p-3 text-center"><p className="text-xl font-bold">{users.filter(user => user.role === 'teacher').length}</p><p className="text-xs text-fg-muted">Teachers</p></Card></div>{error && <p role="alert" className="text-sm text-danger mb-4">{error}</p>}<Card className="overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-bg text-fg-muted"><tr><th className="p-3">User</th><th className="p-3">Role</th><th className="p-3">Department</th><th className="p-3">Status</th><th className="p-3">Action</th></tr></thead><tbody>{filtered.map(user => <tr key={user._id} className="border-t border-line"><td className="p-3"><p className="font-medium">{user.name}</p><p className="text-xs text-fg-muted">{user.email}</p></td><td className="p-3 capitalize">{user.role}</td><td className="p-3">{user.department ?? '—'}</td><td className="p-3">{!user.active ? 'Suspended' : user.accountStatus === 'unclaimed' ? 'Not yet claimed' : 'Active'}</td><td className="p-3"><Button size="sm" variant={user.active ? 'danger' : 'secondary'} onClick={() => updateStatus(user)} disabled={user.role === 'admin'}>{user.active ? 'Suspend' : 'Activate'}</Button></td></tr>)}</tbody></table></div>{!filtered.length && <EmptyState title="No users found" />}</Card></div>
}
