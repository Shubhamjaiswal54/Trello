import DotField from '@/components/DotField.jsx';
import NavBar from '@/components/Navbar.jsx';

// DotField is a JS component without TypeScript typings — cast to any for now
// const DotFieldAny = DotField as any;
const DotFieldAny: React.ComponentType<any> = DotField;
const Home = () => {
  return (
    <>
      <NavBar />
      <div style={{ position: 'fixed', inset: 0 }}>
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
          gradientFrom="#A855F7"
          gradientTo="#B497CF"
          glowColor="#120F17"
        />
      </div>

      <div>Hey there , welcome to <span className='hero-title'>Trello</span></div>

    </>


  )
}

export default Home