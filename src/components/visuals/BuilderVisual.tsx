'use client';

import { motion } from 'framer-motion';
import { EASE_ATL } from '@/lib/animations';
import { BRAND } from '@/lib/colors';

const NODE_COLORS = [BRAND.gold, BRAND.canopy, BRAND.brick, BRAND.routeBlue, BRAND.magenta, BRAND.neon];

// Generate deterministic nodes for the generative art
const nodes = Array.from({ length: 18 }, (_, i) => {
  const x = 50 + ((i * 73 + 31) % 260);
  const y = 50 + ((i * 47 + 19) % 260);
  // Every 3rd node (0,3,6,9,12,15) gets large movement; every 3rd+1 (1,4,7,10,13,16) gets moderate
  const movement: 'large' | 'moderate' | 'none' =
    i % 3 === 0 ? 'large' : i % 3 === 1 ? 'moderate' : 'none';
  // Deterministic drift offsets based on index
  const angle1 = ((i * 67 + 11) % 360) * (Math.PI / 180);
  const angle2 = ((i * 113 + 43) % 360) * (Math.PI / 180);
  const range = movement === 'large' ? 45 : movement === 'moderate' ? 22 : 0;
  return {
    x, y, r: 3 + (i % 4) * 2, delay: i * 0.08, movement,
    // Waypoints for wandering (clamped to viewBox)
    cx: [x, Math.max(35, Math.min(325, x + Math.cos(angle1) * range)),
             Math.max(35, Math.min(325, x + Math.cos(angle2) * range * 0.7)), x],
    cy: [y, Math.max(35, Math.min(325, y + Math.sin(angle1) * range)),
             Math.max(35, Math.min(325, y + Math.sin(angle2) * range * 0.7)), y],
    moveDuration: movement === 'large' ? 6 + (i % 4) : 8 + (i % 3),
  };
});

// Connect some nodes
const connections = [
  [0, 3], [1, 5], [2, 7], [3, 8], [4, 9],
  [5, 10], [6, 11], [7, 12], [8, 13], [9, 14],
  [10, 15], [11, 16], [12, 17], [0, 6], [3, 12],
];

export default function BuilderVisual() {
  return (
    <div className="relative flex h-full w-full items-center justify-center p-4 lg:p-8">
      <svg className="h-full w-full" viewBox="0 0 360 360" fill="none">
        {/* Connections */}
        {connections.map(([a, b], i) => (
          <motion.line
            key={`line-${i}`}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            stroke={NODE_COLORS[a % NODE_COLORS.length]}
            strokeWidth="0.8"
            opacity="0.15"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.15 }}
            transition={{
              delay: 0.5 + i * 0.06,
              duration: 0.8,
              ease: EASE_ATL,
            }}
          />
        ))}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <motion.circle
            key={`node-${i}`}
            cx={node.x}
            cy={node.y}
            r={node.r}
            fill={NODE_COLORS[i % NODE_COLORS.length]}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: [0.2, 0.5, 0.2],
              ...(node.movement !== 'none' && {
                cx: node.cx,
                cy: node.cy,
              }),
            }}
            transition={{
              scale: { delay: node.delay + 0.3, duration: 0.4, ease: EASE_ATL },
              opacity: {
                delay: node.delay + 0.7,
                duration: 3,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              },
              ...(node.movement !== 'none' && {
                cx: {
                  delay: node.delay + 0.5,
                  duration: node.moveDuration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
                cy: {
                  delay: node.delay + 0.5,
                  duration: node.moveDuration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }),
            }}
          />
        ))}
      </svg>
    </div>
  );
}
