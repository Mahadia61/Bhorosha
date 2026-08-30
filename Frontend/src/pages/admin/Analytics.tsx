import { Card, PageHeader, KpiCard, IconBarChart, IconUsers, IconBook, IconShield } from '../../components/ui'

const DEPARTMENTS = ['CSE', 'EEE', 'ME', 'MIE', 'MME', 'Civil', 'WRE', 'Biomedical', 'ETE', 'Architecture']

export default function AdminAnalytics() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <PageHeader title="Platform Analytics" description="Aggregate data about platform usage and content" />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard label="Review Volume" value="0" sub="all time" icon={<IconBarChart />} color="brand" />
        <KpiCard label="Anonymous Rate" value="—%" sub="of all posts" icon={<IconShield />} color="anon" />
        <KpiCard label="Avg. Platform Rating" value="—" sub="all courses" icon={<IconBook />} color="accent" />
        <KpiCard label="Active Users" value="0" sub="last 30 days" icon={<IconUsers />} color="warning" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Review volume over time */}
        <Card className="p-5">
          <h2 className="font-semibold font-heading text-fg mb-4">Review Volume Over Time</h2>
          <div className="h-36 flex items-end gap-2 border-b border-line pb-2">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'].map((m, i) => (
              <div key={m} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-brand/30 rounded-t-sm" style={{ height: `${Math.max(4, (i + 1) * 10)}px` }} />
                <span className="text-xs text-fg-muted">{m}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-fg-muted text-center mt-2">Placeholder — real data will reflect actual submissions</p>
        </Card>

        {/* Anonymous vs Named */}
        <Card className="p-5">
          <h2 className="font-semibold font-heading text-fg mb-4">Anonymous vs. Named Posts</h2>
          <div className="flex items-center justify-center h-36">
            <div className="text-center">
              <div className="w-28 h-28 rounded-full border-8 border-anon/30 flex items-center justify-center mx-auto mb-2">
                <span className="text-xs text-fg-muted text-center leading-tight">No data<br/>yet</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-6 text-xs text-fg-muted">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-anon inline-block" />Anonymous: 0</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-brand inline-block" />Named: 0</span>
          </div>
        </Card>
      </div>

      {/* Top departments */}
      <Card className="p-5 mb-6">
        <h2 className="font-semibold font-heading text-fg mb-4">Department Breakdown</h2>
        <div className="space-y-3">
          {DEPARTMENTS.map(dept => (
            <div key={dept} className="flex items-center gap-3">
              <span className="text-sm text-fg-muted w-28">{dept}</span>
              <div className="flex-1 h-2 bg-line rounded-full overflow-hidden">
                <div className="h-full bg-brand/40 rounded-full w-0" />
              </div>
              <span className="text-xs text-fg-muted w-12 text-right">0 reviews</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-fg-muted text-center mt-3">Bars will populate as reviews are submitted across departments</p>
      </Card>

      {/* Top + Bottom courses */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h2 className="font-semibold font-heading text-fg mb-4">Top Rated Courses</h2>
          <div className="space-y-3 text-sm text-fg-muted text-center py-6">
            <p>No rating data yet</p>
            <p className="text-xs">Courses will appear here once students submit reviews</p>
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="font-semibold font-heading text-fg mb-4">Lowest Rated Courses</h2>
          <div className="space-y-3 text-sm text-fg-muted text-center py-6">
            <p>No rating data yet</p>
            <p className="text-xs">Courses will appear here once students submit reviews</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
