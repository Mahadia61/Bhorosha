import { useApp } from '../context'
import {
  Card,
  IconShield,
  IconLock,
  IconStar,
  IconMessage,
  IconBarChart,
  IconCheck,
  IconFlag,
} from '../components/ui'

// FLAG FOR DESIGN OWNER: this page is marketing copy only — it has no
// search bar or "top-rated courses" section, even though that appears in
// the product spec. This is a product/content decision, not a bug, so it
// hasn't been patched in here. Decide whether to add a search/ranking
// section to the landing page or keep it purely marketing-focused.

const DEPARTMENTS = ['CSE', 'EEE', 'ME', 'MIE', 'MME', 'PME', 'Civil', 'WRE', 'Biomedical', 'ETE']

const STEPS = [
  {
    n: '01',
    title: 'Verify with your CUET email',
    desc: 'Sign up in seconds using your official @cuet.ac.bd address. Only verified students and teachers can join.',
  },
  {
    n: '02',
    title: 'Rate & review, your way',
    desc: 'Share structured, multi-criteria feedback on courses and professors — anonymously if you choose.',
  },
  {
    n: '03',
    title: 'Discover what works',
    desc: 'Browse trusted, verified reviews and trend data to make better decisions about your courses.',
  },
]

const FEATURES = [
  { icon: IconLock, title: 'Anonymous by default', desc: 'Post reviews and questions anonymously. Your identity is never revealed — not even to administrators.' },
  { icon: IconStar, title: 'Multi-criteria ratings', desc: 'Rate Teaching Quality, Workload, and Grading Fairness independently for nuanced, actionable feedback.' },
  { icon: IconMessage, title: 'Direct Q&A', desc: 'Ask course questions and get answers straight from professors. Anonymous questioning is fully supported.' },
  { icon: IconShield, title: 'University-verified', desc: 'Only students and teachers with official CUET email addresses can create an account.' },
  { icon: IconFlag, title: 'Moderated content', desc: 'A dedicated admin team reviews every submission to keep the platform constructive and spam-free.' },
  { icon: IconBarChart, title: 'Trend analytics', desc: 'Teachers see aggregated rating trends over semesters. No individual-level data is ever exposed.' },
]

const TRUST_POINTS = [
  'No public browsing — feedback stays inside the CUET community',
  'Reviews are moderated before they ever go live',
  'You choose what stays anonymous, every time',
]

function FeatureCard({ icon: Icon, title, desc }: { icon: typeof IconStar; title: string; desc: string }) {
  return (
    <Card className="p-6">
      <div className="w-11 h-11 rounded-xl bg-brand-tint flex items-center justify-center text-brand mb-4">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="font-semibold font-heading text-fg mb-1.5">{title}</h3>
      <p className="text-sm text-fg-muted leading-relaxed">{desc}</p>
    </Card>
  )
}

export default function Landing() {
  const { navigate } = useApp()

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero — the single Get started / Log in pair lives in the sticky navbar above this */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 55% at 50% -10%, rgba(79,126,247,0.14), transparent)',
          }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-20 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-tint text-brand text-xs font-semibold mb-6">
            <IconShield className="w-3.5 h-3.5" />
            Privacy-first · Built exclusively for CUET
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading text-fg leading-tight tracking-tight mb-5">
            Honest feedback.<br />
            <span style={{ color: 'var(--brand)' }}>Better learning.</span>
          </h1>
          <p className="text-lg text-fg-muted max-w-xl mx-auto mb-12 leading-relaxed">
            Bhorosha is the privacy-preserving platform for CUET students and teachers to share
            candid course and professor feedback — anonymously when it matters.
          </p>

          {/* Trust points */}
          <div className="grid sm:grid-cols-3 gap-3 max-w-3xl mx-auto text-left">
            {TRUST_POINTS.map(point => (
              <div key={point} className="flex items-start gap-2.5 bg-surface border border-line rounded-xl px-4 py-3">
                <div className="w-5 h-5 rounded-full bg-brand-tint text-brand flex items-center justify-center flex-shrink-0 mt-0.5">
                  <IconCheck className="w-3 h-3" />
                </div>
                <p className="text-xs text-fg-muted leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-line bg-surface">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-fg mb-3">How Bhorosha works</h2>
            <p className="text-fg-muted text-sm max-w-md mx-auto">Three simple steps from sign-up to a smarter course decision.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-4">
            {STEPS.map((step, i) => (
              <div key={step.n} className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl font-bold font-heading text-brand/30">{step.n}</span>
                  {i < STEPS.length - 1 && (
                    <div className="hidden sm:block flex-1 h-px bg-line" />
                  )}
                </div>
                <h3 className="font-semibold font-heading text-fg mb-2">{step.title}</h3>
                <p className="text-sm text-fg-muted leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-fg mb-3">Built for trust</h2>
          <p className="text-fg-muted text-sm max-w-md mx-auto">Every design decision on Bhorosha protects your privacy while keeping feedback credible.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(f => (
            <FeatureCard key={f.title} icon={f.icon} title={f.title} desc={f.desc} />
          ))}
        </div>
      </section>

      {/* Departments (informational, non-interactive) */}
      <section className="border-t border-line bg-surface">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 text-center">
          <h2 className="text-xl font-bold font-heading text-fg mb-2">Every department, one platform</h2>
          <p className="text-sm text-fg-muted mb-7 max-w-md mx-auto">Bhorosha covers all CUET departments — log in to explore reviews for your own.</p>
          <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
            {DEPARTMENTS.map(d => (
              <span
                key={d}
                className="px-4 py-2 rounded-xl border border-line bg-bg text-sm font-medium text-fg-muted"
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer — links only; the single account CTA stays up in the navbar */}
      <footer className="border-t border-line bg-surface">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-line">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-brand flex items-center justify-center">
                <span className="text-white font-bold text-xs">B</span>
              </div>
              <span className="font-semibold text-sm font-heading text-fg">Bhorosha</span>
            </div>
            <nav className="flex items-center gap-5 text-sm text-fg-muted">
              <button onClick={() => navigate('terms')} className="hover:text-fg transition-colors">Terms</button>
              <button onClick={() => navigate('privacy')} className="hover:text-fg transition-colors">Privacy</button>
              <a href="mailto:support@bhorosha.cuet.ac.bd" className="hover:text-fg transition-colors">Contact</a>
            </nav>
          </div>
          <p className="text-xs text-fg-muted text-center pt-6">© 2024 Bhorosha · CUET · Privacy-preserving feedback platform</p>
        </div>
      </footer>
    </div>
  )
}
