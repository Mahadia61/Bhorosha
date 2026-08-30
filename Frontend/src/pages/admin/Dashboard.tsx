import { useApp } from '../../context'
import { Card, KpiCard, Button, IconUsers, IconBook, IconBarChart, IconAlertTriangle, IconMessage, IconShield } from '../../components/ui'

function ActivityItem({ icon, text, time }: { icon: string; text: string; time: string }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <span className="text-xl flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-fg">{text}</p>
        <p className="text-xs text-fg-muted">{time}</p>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { navigate } = useApp()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-heading text-fg mb-0.5">Admin Dashboard</h1>
          <p className="text-sm text-fg-muted">Platform overview and management</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-danger/10 text-danger text-sm font-semibold">
          <IconShield className="w-4 h-4" />
          Admin View
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <KpiCard label="Total Users" value="0" sub="students + teachers" icon={<IconUsers />} color="brand" />
        <KpiCard label="Total Courses" value="0" sub="across all departments" icon={<IconBook />} color="accent" />
        <KpiCard label="Total Reviews" value="0" sub="submitted" icon={<IconBarChart />} color="anon" />
        <KpiCard label="Total Questions" value="0" sub="asked by students" icon={<IconMessage />} color="brand" />
        <KpiCard label="Flagged Content" value="0" sub="awaiting moderation" icon={<IconAlertTriangle />} color="warning" />
        <KpiCard label="Anonymous Posts" value="0" sub="privacy protected" icon={<IconShield />} color="anon" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <div className="space-y-3">
          <h2 className="font-semibold font-heading text-fg">Quick Actions</h2>
          {[
            { label: 'Manage Users', icon: '👥', view: 'admin-users' as const, color: 'bg-brand-tint text-brand' },
            { label: 'Add Course', icon: '📚', view: 'admin-courses' as const, color: 'bg-accent-tint text-accent' },
            { label: 'Review Queue', icon: '🛡️', view: 'admin-moderation' as const, color: 'bg-warning/15 text-warning' },
            { label: 'Analytics', icon: '📊', view: 'admin-analytics' as const, color: 'bg-anon-tint text-anon' },
          ].map(a => (
            <button
              key={a.label}
              onClick={() => navigate(a.view)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${a.color} text-left hover:opacity-80 transition-opacity`}
            >
              <span className="text-xl">{a.icon}</span>
              <span className="font-semibold text-sm">{a.label}</span>
            </button>
          ))}
        </div>

        {/* Recent activity */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-line">
              <h2 className="font-semibold font-heading text-fg">Recent Activity</h2>
              <span className="text-xs text-fg-muted">Live feed</span>
            </div>
            <div className="px-5 divide-y divide-line">
              <ActivityItem icon="🎓" text="New student account registered" time="Just now" />
              <ActivityItem icon="⭐" text="Review submitted for Course Name (pending moderation)" time="2 minutes ago" />
              <ActivityItem icon="💬" text="Question asked on Course Name" time="15 minutes ago" />
              <ActivityItem icon="🚩" text="Review flagged for inappropriate content" time="1 hour ago" />
              <ActivityItem icon="👨‍🏫" text="Teacher profile updated" time="3 hours ago" />
            </div>
            <div className="px-5 py-3 border-t border-line text-center">
              <p className="text-xs text-fg-muted">Activity data populates as users interact with the platform</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Platform usage bar chart placeholder */}
      <Card className="mt-6 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold font-heading text-fg">Review Volume</h2>
          <select className="text-xs border border-line rounded-lg px-2 py-1 bg-surface text-fg-muted outline-none">
            <option>Last 6 months</option>
            <option>Last year</option>
          </select>
        </div>
        <div className="h-40 flex items-end gap-2 border-b border-line pb-3">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => (
            <div key={m} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-brand/20 rounded-t-sm" style={{ height: `${Math.max(8, (i + 1) * 12)}px` }} />
              <span className="text-xs text-fg-muted">{m}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-fg-muted text-center mt-2">Bar heights are illustrative placeholders. Real data will populate from activity.</p>
      </Card>
    </div>
  )
}
