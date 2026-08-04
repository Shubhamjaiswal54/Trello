// Home.tsx
import DotField from '@/components/DotField';
import NavBar from '@/components/Navbar';
import TextType from '@/components/TextType';
import { Link } from 'react-router';

const DotFieldAny: React.ComponentType<any> = DotField;

const steps = [
  { label: 'Capture', accent: '#5b7ea3', copy: 'Drop a thought in before it slips away.' },
  { label: 'Sort', accent: '#d3944a', copy: 'Drag it into wherever it actually belongs.' },
  { label: 'Ship', accent: '#7a9b74', copy: 'Move it to done. Watch the board clear.' },
];

const Home = () => {
  return (
    <>
      <NavBar />

      <div style={{ position: 'fixed', inset: 0, backgroundColor: '#1b2129' }}>
        <DotFieldAny
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

      <div className="relative min-h-screen text-[#eef1f5]">

        {/* hero */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6">

          <span className="mb-4 font-mono text-xs uppercase tracking-wider text-[#8b93a1]">
            A board for what's actually on your plate
          </span>

          <h1 className="text-4xl md:text-5xl font-semibold text-center max-w-2xl mb-6">
            Pin your work where it can't hide.
          </h1>

          <TextType
            text={["hey, welcome.", "pin what matters.", "drag it into done."]}
            typingSpeed={75}
            pauseDuration={1500}
            showCursor
            cursorCharacter="_"
            deletingSpeed={50}
            variableSpeedEnabled={false}
            variableSpeedMin={60}
            variableSpeedMax={120}
            cursorBlinkDuration={0.5}
            style={{
              fontSize: '1.125rem',
              fontFamily: 'monospace',
              color: '#8b93a1',
              marginBottom: '2.5rem',
            }}
          />

          <div className='  justify-around'>
            <Link
              to="/user/login"
              className="rounded-sm  bg-[#5b7ea3] px-6 py-3 text-sm font-medium text-[#101418] transition-opacity hover:opacity-90"
            >
              Longin
            </Link>


            <Link
              to="/user/register"
              className="rounded-sm  bg-[#5b7ea3] px-6 py-3 text-sm font-medium text-[#101418] transition-opacity hover:opacity-90"
            >
              Register
            </Link>
          </div>



          {/* floating index cards — small nod to the board itself */}
          <div className="relative mt-16 h-24 w-full max-w-md">
            {[
              { text: 'reply to client', rotate: -6, left: '5%', accent: '#5b7ea3' },
              { text: 'fix the login bug', rotate: 4, left: '35%', accent: '#d3944a' },
              { text: 'ship v2', rotate: -2, left: '65%', accent: '#7a9b74' },
            ].map((card) => (
              <div
                key={card.text}
                className="absolute top-0 w-40 rounded-[3px] bg-[#f7f2e7] px-3 py-2.5 text-xs text-[#23262b] shadow-[0_6px_16px_rgba(0,0,0,0.3)]"
                style={{ left: card.left, transform: `rotate(${card.rotate}deg)` }}
              >
                <span
                  className="absolute left-2 top-2 h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: card.accent }}
                />
                <span className="block pl-3">{card.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* how it works */}
        <section className="px-6 pb-24 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-4">
            {steps.map((step, i) => (
              <div
                key={step.label}
                className="rounded-md bg-[#232b36] p-5"
                style={{ borderTop: `2px solid ${step.accent}` }}
              >
                <span
                  className="font-mono text-xs uppercase tracking-wider"
                  style={{ color: step.accent }}
                >
                  {String(i + 1).padStart(2, '0')} · {step.label}
                </span>
                <p className="mt-2 text-sm text-[#c3c9d1]">{step.copy}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="px-6 pb-10 text-center text-xs text-[#6b7280] font-mono uppercase tracking-wider">
          Corkboard — nothing gets lost twice
        </footer>
      </div>
    </>
  );
};

export default Home;