import DotField from '@/components/DotField';
import NavBar from '@/components/Navbar';
import TextType from '@/components/TextType';
// import { User } from 'lucide-react';
import User from '@/page/user.tsx';


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

        <TextType

          text={["hey there", "welcome to Trello", "organize your tasks with ease!"]}
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
            position: 'absolute',
            top: '25%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '2rem',
            fontFamily: 'monospace',
            color: 'black',

          }}

        />
      </div>
    </>


  )
}

export default Home