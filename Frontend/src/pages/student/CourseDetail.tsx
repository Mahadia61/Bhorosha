import { useApp } from '../../context'
import { Button, EmptyState, IconBook } from '../../components/ui'

export default function CourseDetail() {
  const { navigate } = useApp()
  return <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
    <button onClick={() => navigate('student-dashboard')} className="text-sm text-brand font-medium hover:underline mb-5 block">← Back to Browse</button>
    <EmptyState icon={<IconBook className="w-7 h-7" />} title="No course selected" description="Select a course from the live course list to view reviews or submit feedback." action={<Button onClick={() => navigate('student-dashboard')}>Browse courses</Button>} />
  </div>
}
