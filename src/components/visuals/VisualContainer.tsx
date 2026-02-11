'use client';

import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import { useStory } from '@/context/StoryContext';
import { exchanges } from '@/data/exchanges';
import { fadeScale } from '@/lib/animations';
import VisualMeta from './VisualMeta';

const WelcomeVisual = dynamic(() => import('./WelcomeVisual'), { ssr: false });
const ArchiveVisual = dynamic(() => import('./ArchiveVisual'), { ssr: false });
const VoicesVisual = dynamic(() => import('./VoicesVisual'), { ssr: false });
const BoothVisual = dynamic(() => import('./BoothVisual'), { ssr: false });
const ShieldVisual = dynamic(() => import('./ShieldVisual'), { ssr: false });
const MapVisual = dynamic(() => import('./MapVisual'), { ssr: false });
const NightVisual = dynamic(() => import('./NightVisual'), { ssr: false });
const BuilderVisual = dynamic(() => import('./BuilderVisual'), { ssr: false });
const PlanVisual = dynamic(() => import('./PlanVisual'), { ssr: false });
const VoiceLiveVisual = dynamic(() => import('./VoiceLiveVisual'), { ssr: false });

const visualComponents: Record<number, React.ComponentType> = {
  0: WelcomeVisual,
  1: ArchiveVisual,
  2: VoicesVisual,
  3: BoothVisual,
  4: ShieldVisual,
  5: MapVisual,
  6: NightVisual,
  7: BuilderVisual,
  8: PlanVisual,
  9: VoiceLiveVisual,
};

export default function VisualContainer() {
  const { state } = useStory();
  const { visualExchange } = state;
  const exchange = exchanges[visualExchange];
  const VisualComponent = visualComponents[visualExchange];

  return (
    <div className="relative flex h-full flex-col">
      {/* Meta info at top-left */}
      {exchange?.visualMeta && (
        <div className="px-4 pt-4 lg:px-6 lg:pt-6">
          <VisualMeta
            title={exchange.visualMeta.title}
            subtitle={exchange.visualMeta.subtitle}
            stat={exchange.visualMeta.stat}
          />
        </div>
      )}

      {/* Visual area */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={visualExchange}
            variants={fadeScale}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex h-full w-full items-center justify-center"
          >
            {VisualComponent && <VisualComponent />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
