'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { voices } from '@/data/voices';
import { EASE_ATL } from '@/lib/animations';

const voiceIconPaths: Record<string, React.ReactNode> = {
  marcus: (
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
  ),
  linh: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
    </>
  ),
  deja: (
    <>
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" />
      <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14" />
    </>
  ),
  robert: (
    <>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </>
  ),
  aisha: (
    <>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </>
  ),
};

/** Orbital ring definitions: radius, strokeWidth, dashArray */
const RINGS = [
  { radius: 110, strokeWidth: 1.2, dashArray: 'none' },
  { radius: 180, strokeWidth: 1.0, dashArray: '6 4' },
  { radius: 250, strokeWidth: 0.8, dashArray: '3 5' },
] as const;

/** Voice distribution: how many voices go on each ring (outer to inner) */
const RING_DISTRIBUTION = [
  { ringIndex: 2, count: 2 }, // 2 voices on outer ring (radius 250)
  { ringIndex: 1, count: 2 }, // 2 voices on middle ring (radius 180)
  { ringIndex: 0, count: 1 }, // 1 voice on inner ring (radius 110)
] as const;

interface VoiceOrbit {
  id: string;
  name: string;
  color: string;
  radius: number;
  startAngle: number;
  direction: 1 | -1;
  angularSpeed: number; // radians per second
}

function OrbitingVoice({ voice, index }: { voice: VoiceOrbit; index: number }) {
  const groupRef = useRef<SVGGElement>(null);
  const angleRef = useRef(voice.startAngle);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 800 + index * 150);
    return () => clearTimeout(timer);
  }, [index]);

  const animate = useCallback((time: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const dt = (time - lastTimeRef.current) / 1000;
    lastTimeRef.current = time;

    angleRef.current += voice.angularSpeed * voice.direction * dt;

    const x = Math.cos(angleRef.current) * voice.radius;
    const y = Math.sin(angleRef.current) * voice.radius;

    if (groupRef.current) {
      groupRef.current.setAttribute('transform', `translate(${x}, ${y})`);
    }

    rafRef.current = requestAnimationFrame(animate);
  }, [voice.angularSpeed, voice.direction, voice.radius]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  return (
    <g
      ref={groupRef}
      transform={`translate(${Math.cos(voice.startAngle) * voice.radius}, ${Math.sin(voice.startAngle) * voice.radius})`}
      opacity={visible ? 1 : 0}
      style={{ transition: 'opacity 0.5s ease' }}
    >
      {/* Icon background circle */}
      <circle cx={0} cy={0} r="20" fill={voice.color} />

      {/* Icon SVG */}
      <svg
        x={-10}
        y={-10}
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {voiceIconPaths[voice.id]}
      </svg>

      {/* Name label */}
      <text
        x={0}
        y={36}
        fill="var(--color-text-secondary)"
        fontSize="16"
        fontFamily="var(--font-body)"
        fontWeight="500"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {voice.name}
      </text>
    </g>
  );
}

export default function VoicesVisual() {
  const [orbits, setOrbits] = useState<VoiceOrbit[]>([]);

  useEffect(() => {
    const shuffled = [...voices].sort(() => Math.random() - 0.5);
    let voiceIndex = 0;

    const mapped: VoiceOrbit[] = RING_DISTRIBUTION.flatMap(({ ringIndex, count }) => {
      const ring = RINGS[ringIndex];
      return Array.from({ length: count }, (_, i) => {
        const voice = shuffled[voiceIndex++];
        const baseAngle = (i / count) * Math.PI * 2;
        const jitter = (Math.random() - 0.5) * 0.8;
        const revolutionTime = 12 + Math.random() * 18; // 12-30s per revolution
        return {
          id: voice.id,
          name: voice.name,
          color: voice.color,
          radius: ring.radius,
          startAngle: baseAngle + jitter - Math.PI / 2,
          direction: (Math.random() > 0.5 ? 1 : -1) as 1 | -1,
          angularSpeed: (Math.PI * 2) / revolutionTime,
        };
      });
    });

    setOrbits(mapped);
  }, []);

  return (
    <div className="relative flex h-full w-full items-center justify-center p-4 lg:p-8">
      <svg className="h-full w-full overflow-visible" viewBox="-300 -300 600 600">
        {/* Concentric orbital rings (visible tracks) */}
        {RINGS.map((ring, i) => (
          <motion.circle
            key={ring.radius}
            cx="0"
            cy="0"
            r={ring.radius}
            fill="none"
            stroke="var(--color-orbital-ring)"
            strokeWidth={ring.strokeWidth}
            strokeDasharray={ring.dashArray}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.7 }}
            transition={{
              duration: 1.2,
              delay: i * 0.2,
              ease: EASE_ATL,
            }}
          />
        ))}

        {/* Center hub circle */}
        <motion.circle
          cx="0"
          cy="0"
          r="42"
          fill="var(--color-accent)"
          opacity="0.12"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE_ATL }}
        />
        <motion.circle
          cx="0"
          cy="0"
          r="6"
          fill="var(--color-accent)"
          opacity="0.35"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 0.5, ease: EASE_ATL }}
        />

        {/* Orbiting voice icons */}
        {orbits.map((voice, i) => (
          <OrbitingVoice key={voice.id} voice={voice} index={i} />
        ))}
      </svg>
    </div>
  );
}
