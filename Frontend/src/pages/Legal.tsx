import { useApp } from '../context'
import { Card, Button, IconChevronDown } from '../components/ui'
import { TERMS_SECTIONS, PRIVACY_SECTIONS, LEGAL_UPDATED, type LegalSection } from '../content/legal'
import type { View } from '../types'

const DASHBOARD_BY_ROLE: Record<string, View> = {
  student: 'student-dashboard',
  teacher: 'teacher-dashboard',
  admin: 'admin-dashboard',
}

function LegalLayout({ title, sections }: { title: string; sections: LegalSection[] }) {
  const { navigate, role } = useApp()
  const backTarget: View = DASHBOARD_BY_ROLE[role] ?? 'landing'

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <button
          onClick={() => navigate(backTarget)}
          className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg font-medium mb-6 transition-colors"
        >
          <IconChevronDown className="w-3.5 h-3.5 rotate-90" />
          Back
        </button>
        <h1 className="text-3xl font-bold font-heading text-fg mb-1">{title}</h1>
        <p className="text-xs text-fg-muted mb-8">{LEGAL_UPDATED}</p>
        <Card className="p-6 sm:p-8">
          <div className="space-y-7">
            {sections.map(section => (
              <div key={section.heading}>
                <h2 className="font-semibold font-heading text-fg mb-2">{section.heading}</h2>
                <div className="space-y-2">
                  {section.body.map((p, i) => (
                    <p key={i} className="text-sm text-fg-muted leading-relaxed">{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
        {role === 'guest' && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <Button onClick={() => navigate('role-select')}>Create account</Button>
            <Button onClick={() => navigate('login')} variant="outline">Log in</Button>
          </div>
        )}
      </div>
    </div>
  )
}

export function Terms() {
  return <LegalLayout title="Terms of Service" sections={TERMS_SECTIONS} />
}

export function Privacy() {
  return <LegalLayout title="Privacy Policy" sections={PRIVACY_SECTIONS} />
}
