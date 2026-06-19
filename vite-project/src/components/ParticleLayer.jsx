import { useMemo } from 'react';
import './ParticleLayer.css';

export default function ParticleLayer({ kind = 'dust', count = 24 }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 6,
      duration: 4 + Math.random() * 5,
      scale: 0.5 + Math.random() * 0.9,
    }));
  }, [count]);

  return (
    <div className={`particle-layer particle-layer--${kind}`} aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `scale(${p.scale})`,
          }}
        />
      ))}
    </div>
  );
}
