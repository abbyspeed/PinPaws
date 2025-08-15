import { Html, useProgress } from '@react-three/drei';
import { useEffect, useState } from 'react';

export default function Loader() {
  const { progress } = useProgress();
  const [stableProgress, setStableProgress] = useState(0);
  
  useEffect(() => {
    setStableProgress(progress);
  }, [progress]);
  
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
          {Math.round(stableProgress)}%
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