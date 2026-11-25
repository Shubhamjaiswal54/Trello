import type { ComponentType } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import DotField from '@/components/DotField'
import TextType from '@/components/TextType'
import SpotlightCard from '@/components/SpotlightCard'
import BrandMark from '@/components/BrandMark'
import { buttonVariants } from '@/components/ui/button'
import { hasValidSession } from '@/lib/auth'
import { cn } from '@/lib/utils'

// DotField is a JS React Bits component without type declarations.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Dots = DotField as ComponentType<any>

const steps = [
  { label: 'Capture', accent: '#5b7ea3', copy: 'Drop a thought in before it slips away.' },
  { label: 'Sort', accent: '#d3944a', copy: 'Drag it into wherever it actually belongs.' },
  { label: 'Ship', accent: '#7a9b74', copy: 'Move it to done. Watch the board clear.' },
]

const floatingCards = [
  { text: 'reply to client', rotate: -6, left: '2%', accent: '#5b7ea3' },
  { text: 'fix the login bug', rotate: 4, left: '34%', accent: '#d3944a' },
  { text: 'ship v2', rotate: -2, left: '66%', accent: '#7a9b74' },
]

const Home = () => {
  const signedIn = hasValidSession()

  return (
    <>
      <div className="fixed inset-0 z-0 bg-background" aria-hidden="true">
        <Dots
          dotRadius={1.5}
          dotSpacing={14}
          bulgeStrength={67}
          glowRadius={160}
          sparkle={false}
          waveAmplitude={0}
          cursorRadius={500}
          cursorForce={0.1}
          bulgeOnly
          gradientFrom="#5b7ea3"
          gradientTo="#d1495b"
          glowColor="#12151b"
        />
      </div>

      <header className="fixed inset-x-0 top-4 z-50 px-4">
        <nav className="mx-auto flex h-14 max-w-4xl items-center justify-between rounded-full border bg-card/80 px-4 pl-5 shadow-lg shadow-black/30 backdrop-blur-md">
          <BrandMark />
          {signedIn ? (
            <Link to="/organizations" className={cn(buttonVariants({ size: 'lg' }), 'rounded-full px-4')}>
              Open dashboard
              <ArrowRight />
            </Link>
          ) : (
            <div className="flex items-center gap-1">
              <Link to="/user/login" className={cn(buttonVariants({ variant: 'ghost', size: 'lg' }), 'rounded-full')}>
                Sign in
              </Link>
              <Link to="/user/register" className={cn(buttonVariants({ size: 'lg' }), 'rounded-full px-4')}>
                Get started
              </Link>
            </div>
          )}
        </nav>
      </header>

      <main className="relative z-10 min-h-screen">
        <section className="flex min-h-screen flex-col items-center justify-center px-6 pt-20">
          <span className="mb-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            A board for what's actually on your plate
          </span>

          <h1 className="mb-6 max-w-2xl text-center text-4xl font-semibold tracking-tight md:text-6xl">
            Pin your work where it can't hide.
          </h1>

          <TextType
            text={['hey, welcome.', 'pin what matters.', 'drag it into done.']}
            typingSpeed={75}
            pauseDuration={1500}
            showCursor
            cursorCharacter="_"
            deletingSpeed={50}
            cursorBlinkDuration={0.5}
            className="mb-10 font-mono text-lg text-muted-foreground"
          />

          <div className="flex items-center gap-3">
            <Link
              to={signedIn ? '/organizations' : '/user/register'}
              className={cn(buttonVariants({ size: 'lg' }), 'h-11 px-6 text-base shadow-lg shadow-primary/20')}
            >
              {signedIn ? 'Go to your boards' : 'Create a free account'}
              <ArrowRight />
            </Link>
            {!signedIn && (
              <Link to="/user/login" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'h-11 px-6 text-base')}>
                Sign in
              </Link>
            )}
          </div>

          <div className="pointer-events-none relative mt-16 h-24 w-full max-w-md" aria-hidden="true">
            {floatingCards.map((card, i) => (
              <div
                key={card.text}
                className="absolute top-0 w-40 rounded-[3px] bg-paper px-3 py-2.5 text-xs text-paper-foreground shadow-[0_6px_16px_rgba(0,0,0,0.3)] animate-in fade-in-0 slide-in-from-bottom-4 fill-mode-both"
                style={{ left: card.left, rotate: `${card.rotate}deg`, animationDelay: `${300 + i * 150}ms`, animationDuration: '600ms' }}
              >
                <span className="absolute left-2 top-2 size-1.5 rounded-full" style={{ backgroundColor: card.accent }} />
                <span className="block pl-3 font-medium">{card.text}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 pb-24">
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, i) => (
              <SpotlightCard
                key={step.label}
                className="rounded-xl p-6"
                spotlightColor={step.accent}
                intensity={0.4}
                style={{ '--spotlight-card-surface': 'var(--card)', borderTop: `2px solid ${step.accent}` } as React.CSSProperties}
              >
                <span className="font-mono text-xs uppercase tracking-wider" style={{ color: step.accent }}>
                  {String(i + 1).padStart(2, '0')} · {step.label}
                </span>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.copy}</p>
              </SpotlightCard>
            ))}
          </div>
        </section>

        <footer className="px-6 pb-10 text-center font-mono text-xs uppercase tracking-wider text-muted-foreground/70">
          Corkboard — nothing gets lost twice
        </footer>
      </main>
    </>
  )
}

export default Home
