import { Html, useProgress } from '@react-three/drei';

export default function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{
        color: 'black',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
      }}>
        <div>
          {Math.round(progress)}%
        </div>
        <div style={{
          fontSize: '1.2rem'
        }}>
          Loading...
        </div>
      </div>
    </Html>
  );
}