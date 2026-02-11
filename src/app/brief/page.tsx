'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Header from '@/components/layout/Header';
import { StoryATLWordmark } from '@/components/ui/StoryATLWordmark';
import { phases } from '@/data/phases';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] as const },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const techStack = [
  { layer: 'Frontend', tools: 'Next.js, TypeScript, shadcn/ui, Tailwind CSS, Framer Motion, Vercel AI SDK v6' },
  { layer: 'Mapping', tools: 'Mapbox GL JS, Mapbox Geocoding API' },
  { layer: 'Capture', tools: 'getUserMedia, MediaRecorder, Web Audio API, react-webcam' },
  { layer: 'Motion Tracking', tools: 'MediaPipe (pose/hand landmarks)' },
  { layer: 'Auth', tools: 'Better Auth' },
  { layer: 'API', tools: 'Next.js Route Handlers, tRPC' },
  { layer: 'Background Jobs', tools: 'Inngest' },
  { layer: 'Hosting', tools: 'Vercel' },
  { layer: 'Database', tools: 'Neon Postgres, Drizzle ORM' },
  { layer: 'Media Storage', tools: 'Cloudflare R2, CDN with signed URLs' },
  { layer: 'Transcription', tools: 'Whisper' },
  { layer: 'Generation', tools: 'Anthropic API' },
  { layer: 'Video Output', tools: 'Remotion and ffmpeg' },
  { layer: 'Projection', tools: 'MadMapper' },
  { layer: 'Observability', tools: 'Sentry, PostHog' },
];

const prompts = [
  'Tell a story that could only happen in Atlanta.',
  'Describe a place you return to, and why.',
  'Who helped you feel at home here?',
  'What\u2019s changed, and what has stayed the same?',
];

const communityModels = [
  {
    title: 'Designer-built template packs',
    bullets: [
      'A local graphic or motion designer creates visual templates for story cards rendered with Remotion',
      'Printable posters and cards with QR codes linking to full stories',
    ],
  },
  {
    title: 'Neighborhood timeline walks',
    bullets: [
      'Curated by Fulton County librarians or local historians',
      'Interactive map walk, web exhibit page, and event playlist',
      'A walk through Sweet Auburn from 1978 to 1999, linking community milestones to personal accounts',
    ],
  },
  {
    title: 'Youth media workshops',
    bullets: [
      'Students interview family members, local figures, and influencers using the interview kit',
      'Themed collections like "First jobs," "Songs we grew up with," "A place I feel safe."',
      'Stories presented at a community screening night',
    ],
  },
  {
    title: 'Gesture story portal',
    bullets: [
      'A movement artist builds gesture navigation for large-screen installations',
      'Visitors browse the story map using motion capture controls\u2009\u2026\u2009or by dancing',
    ],
  },
];

const engagementPhases = [
  { phase: 'Engagement Phase 0', desc: 'PAFL and partners identify 3\u20135 community partners. Recruit first 10\u201320 storytellers.' },
  { phase: 'Engagement Phase 1', desc: 'Pilot with small group. One \u201cstory drive\u201d week of concentrated capture.' },
  { phase: 'Summer Engagement', desc: 'Collect (booths at events + web), steward (review tags), publish (featured stories), listen (feedback), patch (iteration).' },
];

const briefSections = [
  { id: 'overview', label: 'Overview' },
  { id: 'why-atlanta', label: 'Why Atlanta' },
  { id: 'platform', label: 'Platform' },
  { id: 'deployment', label: 'ATL DTN' },
  { id: 'community', label: 'Community' },
  { id: 'technology', label: 'Technology' },
  { id: 'privacy', label: 'Privacy' },
  { id: 'track-record', label: 'Track Record' },
] as const;

type BriefSectionId = (typeof briefSections)[number]['id'];

function SectionHeading({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <motion.h2
      id={id}
      className="mb-5 font-display text-fluid-xl font-bold text-text-primary
                 border-b-2 border-accent/30 pb-2 sm:mb-6"
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] as const }}
    >
      {children}
    </motion.h2>
  );
}

function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="text-fluid-base leading-relaxed text-text-secondary [&>p]:mb-4 [&>p:last-child]:mb-0">
      {children}
    </div>
  );
}

function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-brand border border-[var(--color-card-border)]
                  bg-[var(--color-card-bg)] p-4 sm:p-5 ${className}`}
    >
      {children}
    </div>
  );
}

function NavPill({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="rounded-full border border-accent/40 px-3 py-1 text-xs font-medium
                 text-accent transition-all hover:bg-accent hover:text-text-inverse sm:text-sm"
    >
      {label}
    </a>
  );
}

function SideNavLink({
  href,
  label,
  isActive,
  onClick,
}: {
  href: string;
  label: string;
  isActive?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      aria-current={isActive ? 'true' : undefined}
      className={`group flex items-center justify-between rounded-brand-sm px-3 py-2
                  text-sm font-medium transition-colors
                  ${isActive ? 'bg-[var(--color-surface-alt)] text-text-primary' : 'text-text-secondary hover:bg-[var(--color-surface-alt)] hover:text-text-primary'}`}
    >
      <span>{label}</span>
      <span
        className={`h-1.5 w-1.5 rounded-full bg-accent/40 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        aria-hidden="true"
      />
    </a>
  );
}

export default function BriefPage() {
  const scrollRootRef = useRef<HTMLElement | null>(null);

  const sectionIds = useMemo(() => briefSections.map((s) => s.id), []);
  const [openMvpModels, setOpenMvpModels] = useState<Set<number>>(new Set());

  const toggleMvpModel = useCallback((i: number) => {
    setOpenMvpModels((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }, []);

  const [activeSection, setActiveSection] = useState<BriefSectionId>('overview');

  const scrollToSection = useCallback((id: BriefSectionId) => {
    const root = scrollRootRef.current;
    const target = document.getElementById(id);
    if (!root || !target) return;

    // Scroll within the page's scroll container (not the window) for consistent, polished positioning.
    const rootRect = root.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const top = targetRect.top - rootRect.top + root.scrollTop - 12; // small visual breathing room

    root.scrollTo({ top, behavior: 'smooth' });

    // Keep the hash in sync for sharing / refresh without adding history entries.
    if (window.location.hash !== `#${id}`) {
      window.history.replaceState(null, '', `#${id}`);
    }
  }, []);

  const onNavClick = useCallback(
    (id: BriefSectionId) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      setActiveSection(id);
      scrollToSection(id);
    },
    [scrollToSection],
  );

  useEffect(() => {
    // If the page loads with a hash, gently scroll to it inside the scroll container.
    const raw = window.location.hash.replace('#', '');
    const id = (sectionIds.includes(raw as BriefSectionId) ? raw : null) as BriefSectionId | null;
    if (!id) return;
    setActiveSection(id);

    // Wait a frame or two for layout/motion to settle.
    requestAnimationFrame(() => requestAnimationFrame(() => scrollToSection(id)));
  }, [scrollToSection, sectionIds]);

  useEffect(() => {
    const root = scrollRootRef.current;
    if (!root) return;

    const observed = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (observed.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;

        // Pick the section closest to the top of the scroll container.
        visible.sort((a, b) => (a.boundingClientRect.top ?? 0) - (b.boundingClientRect.top ?? 0));
        const next = visible[0]?.target?.id as BriefSectionId | undefined;
        if (next && sectionIds.includes(next)) {
          setActiveSection((prev) => (prev === next ? prev : next));
        }
      },
      {
        root,
        threshold: [0.12, 0.2, 0.35],
        rootMargin: '-20% 0px -70% 0px',
      },
    );

    observed.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds]);

  return (
    <>
      <Header />
      <main ref={scrollRootRef} className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        <div className="mx-auto w-full max-w-container px-4 py-10 sm:px-6 sm:py-16 md:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12">
            {/* Left nav (desktop) */}
            <aside className="hidden lg:block">
              <div className="sticky top-6">
                <p className="mb-2 text-xs font-medium uppercase tracking-widest text-text-secondary/70">
                  On this page
                </p>
                <nav className="rounded-brand border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-2">
                  {briefSections.map((s) => (
                    <SideNavLink
                      key={s.id}
                      href={`#${s.id}`}
                      label={s.label}
                      isActive={activeSection === s.id}
                      onClick={onNavClick(s.id)}
                    />
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main content */}
            <div className="min-w-0">
              {/* ─── Hero ─── */}
              <section className="relative -mx-4 overflow-hidden bg-[var(--color-surface-alt)] px-4 py-12 sm:-mx-6 sm:px-6 sm:py-20 md:-mx-8 md:px-8">
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.035]"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 20% 30%, var(--color-accent) 0%, transparent 50%), radial-gradient(circle at 80% 70%, var(--color-secondary) 0%, transparent 50%)',
                  }}
                />
                <div className="relative max-w-narrow">
                  <motion.div initial="hidden" animate="visible" variants={stagger}>
                    <motion.p
                      variants={fadeUp}
                      custom={0}
                      className="mb-3 font-mono text-fluid-xs font-medium uppercase tracking-widest text-accent"
                    >
                      2026 Public Art Futures Lab &middot; Artist-in-Residence
                    </motion.p>
                    <motion.h1
                      variants={fadeUp}
                      custom={1}
                      className="mb-4 font-display text-fluid-4xl font-bold text-text-primary leading-[1.05]"
                    >
                      <StoryATLWordmark />
                    </motion.h1>
                    <motion.p
                      variants={fadeUp}
                      custom={2}
                      className="mb-2 text-fluid-lg font-medium text-text-primary/80"
                    >
                      Community Storytelling Platform
                    </motion.p>
                    <motion.p
                      variants={fadeUp}
                      custom={3}
                      className="mb-0 text-fluid-base text-text-secondary"
                    >
                      Atlanta Downtown (ATL DTN) Residency &mdash; Projection Based
                      <br />
                      <span className="text-text-primary/70">James McKay &nbsp;|&nbsp; Atlanta, GA</span>
                    </motion.p>
                  </motion.div>
                </div>
              </section>

              {/* Mobile section jump (keeps sidebar as the primary nav) */}
              <div className="mt-6 lg:hidden">
                <p className="mb-2 text-xs font-medium uppercase tracking-widest text-text-secondary/70">
                  Jump to section
                </p>
                <div className="flex flex-wrap gap-2">
                  {briefSections.map((s) => (
                    <NavPill key={s.id} href={`#${s.id}`} label={s.label} onClick={onNavClick(s.id)} />
                  ))}
                </div>
              </div>

              {/* ─── Content ─── */}
              <div className="max-w-narrow pt-10 sm:pt-16">

          {/* 1. Project Overview */}
          <section className="mb-12 sm:mb-16" id="overview">
            <SectionHeading>1. Project Overview</SectionHeading>
            <Prose>
              <p>
                <StoryATLWordmark /> is a platform where Atlanta residents record, preserve, and explore stories about
                community, place, and their lives in the city. Personal memories, family histories, everyday routines,
                local change, local lore. People contribute through in-person booths at events or through a web app
                anywhere. Every story enters a structured repository with transcripts, location data, and tags. A
                lightweight knowledge base connects stories to landmarks, neighborhoods, corridors, and key dates.
              </p>
              <p>
                From that archive, the system generates new outputs. Story cards on top of animations. Audio documentary pages. Curated map walks. Projection-mapped visuals. Every output links back to its source stories with attribution, timecoded excerpts, and traceable citations. Consent, privacy, and visibility controls are built into every step.
              </p>
              <p>
                The primary output for ATL DTN is screens and projection-mapped installations using generative visuals drawn from the story archive. The MAP Rover serves double duty as a mobile story booth and a projection surface for downtown public spaces. An augmented reality layer lets people point a phone at a downtown location and see stories from that place. Atlanta residents, workers, and visitors see their stories reflected back on the surfaces they walk past every day.
              </p>
            </Prose>
          </section>

          {/* 2. Why Atlanta, Why Now */}
          <section className="mb-12 sm:mb-16" id="why-atlanta">
            <SectionHeading>2. Why Atlanta, Why Now</SectionHeading>
            <Prose>
              <p>
                Atlanta is rich in history, culture, and community. Our public spaces reflect that vibrancy. The stories are already there. They live in conversations on Peachtree, dinner crowds in East Atlanta Village, taking friends to the Beltline, along the Chattahoochee, in the barbershops, churches, and parks. They circulate, shift, and then might disappear because there is no system to hold them.
              </p>
              <p>
                <StoryATLWordmark /> makes that vibrancy visible. Not as a mural or a sculpture, but as infrastructure
                that collects, preserves, and resurfaces community knowledge in the spaces where people already are.
                Downtown plazas. Building facades. The MAP Rover parked at a community event. The stories get captured,
                transcribed, tagged to their locations, and projected back onto downtown surfaces the same day.
              </p>
              <p>
                The corridors tell you where the knowledge moves. Peachtree Street is one long argument about what
                &ldquo;Atlanta&rdquo; means. Sweet Auburn, Vine City, Summerhill, Old Fourth Ward: each has a version of
                its own history that no single archive holds. The BeltLine now connects communities that used to be
                separated by rail infrastructure. <StoryATLWordmark /> gives those stories a persistent, findable home
                and a way to show up in the physical spaces where they happened.
              </p>
              <p>
                This is not decoration added afterward. It is part of the public space that reflects and grows with the people who use it.
              </p>
            </Prose>
          </section>

          {/* 3. The Platform */}
          <section className="mb-12 sm:mb-16" id="platform">
            <SectionHeading>3. The Platform</SectionHeading>

            {/* 3.1 Story Capture */}
            <div className="mb-8">
              <h3 className="mb-3 font-display text-fluid-lg font-bold text-text-primary">
                3.1 Story Capture: Booths and Web App
              </h3>
              <Prose>
                <p>
                  Atlanta residents record stories through physical booths at the Public Arts Futures Lab, event booths, or a web app at home. Both use the same capture pipeline and feed the same repository.
                </p>
              </Prose>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Card>
                  <p className="mb-2.5 text-sm font-bold text-text-primary">Booth Flow</p>
                  <ul className="space-y-1.5 text-sm leading-relaxed text-text-secondary list-none">
                    <li className="flex items-baseline gap-1.5"><span className="text-accent" aria-hidden="true">&rarr;</span> Start</li>
                    <li className="flex items-baseline gap-1.5"><span className="text-accent" aria-hidden="true">&rarr;</span> Consent</li>
                    <li className="flex items-baseline gap-1.5"><span className="text-accent" aria-hidden="true">&rarr;</span> Record</li>
                    <li className="flex items-baseline gap-1.5"><span className="text-accent" aria-hidden="true">&rarr;</span> Title/Tags</li>
                    <li className="flex items-baseline gap-1.5"><span className="text-accent" aria-hidden="true">&rarr;</span> Location</li>
                    <li className="flex items-baseline gap-1.5"><span className="text-accent" aria-hidden="true">&rarr;</span> Visibility</li>
                    <li className="flex items-baseline gap-1.5"><span className="text-accent" aria-hidden="true">&rarr;</span> Submit</li>
                  </ul>
                </Card>
                <Card>
                  <p className="mb-2.5 text-sm font-bold text-text-primary">Capture Modes</p>
                  <ul className="space-y-1.5 pl-4 text-sm leading-relaxed text-text-secondary list-disc list-outside [&>li]:pl-0.5">
                    <li>In PAFL Booth</li>
                    <li>Using web app</li>
                    <li>Video (1&ndash;5 min)</li>
                    <li>Audio-only</li>
                    <li>Photo with caption</li>
                    <li>Interview mode for recording someone else</li>
                  </ul>
                </Card>
                <Card>
                  <p className="mb-2.5 text-sm font-bold text-text-primary">Interview Kit</p>
                  <ul className="space-y-1.5 pl-4 text-sm leading-relaxed text-text-secondary list-disc list-outside [&>li]:pl-0.5">
                    <li>Gentle prompts</li>
                    <li>&ldquo;Told by&rdquo; attribution</li>
                    <li>Optional timer and question cards</li>
                    <li>Built for a grandchild interviewing a grandparent</li>
                  </ul>
                </Card>
                <Card>
                  <p className="mb-2.5 text-sm font-bold text-text-primary">Design Principles</p>
                  <ul className="space-y-1.5 pl-4 text-sm leading-relaxed text-text-secondary list-disc list-outside [&>li]:pl-0.5">
                    <li>Multilingual prompts (via Whisper)</li>
                    <li>Simple and large UI targets</li>
                    <li>Captioning</li>
                    <li>Headset support</li>
                    <li>Consent-first throughout</li>
                  </ul>
                </Card>
              </div>

              {/* Prompts */}
              <div className="mt-5">
                <p className="mb-2 text-sm font-bold text-text-primary">Prompt examples</p>
                <div className="flex flex-col gap-2">
                  {prompts.map((p, i) => (
                    <motion.div
                      key={i}
                      className="rounded-brand-sm border-l-[3px] border-l-accent bg-[var(--color-card-bg)]
                                 px-4 py-2.5 text-sm italic text-text-secondary"
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08, duration: 0.35, ease: [0.2, 0.8, 0.2, 1] as const }}
                    >
                      &ldquo;{p}&rdquo;
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3.2 Repository */}
            <div className="mb-8">
              <h3 className="mb-3 font-display text-fluid-lg font-bold text-text-primary">
                3.2 Story Repository and Knowledge Base
              </h3>
              <Prose>
                <p>
                  <strong>Repository:</strong> structured storage for media files, transcripts, tags, and geolinks. Every story has a transcript with segment-level timecodes for citation.
                </p>
                <p>
                  <strong>Knowledge base:</strong> wiki-style pages for landmarks, institutions, neighborhood names, key dates, and context notes. These pages make stories discoverable without editorializing them.
                </p>
                <p>
                  <strong>Steward role:</strong> a small team handles tagging consistency, map placement, sensitive content escalation, and takedown requests. The goal is harm reduction and findability, not editorial approval of voices.
                </p>
              </Prose>
            </div>

            {/* 3.3 Geomapping */}
            <div className="mb-8">
              <h3 className="mb-3 font-display text-fluid-lg font-bold text-text-primary">
                3.3 Geomapping and Location Tagging
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Card>
                  <p className="mb-1 text-sm font-bold text-text-primary">Precision levels</p>
                  <p className="text-sm text-text-secondary">Exact (pin at precise point), approximate (randomized radius), neighborhood-only (area tag, no pin), hidden (searchable but not mapped).</p>
                </Card>
                <Card>
                  <p className="mb-1 text-sm font-bold text-text-primary">Privacy defaults</p>
                  <p className="text-sm text-text-secondary">Public stories get approximate precision unless the contributor chooses exact. Minors and sensitive topics default to moderated or hidden.</p>
                </Card>
                <Card>
                  <p className="mb-1 text-sm font-bold text-text-primary">Tag model</p>
                  <p className="text-sm text-text-secondary">Place tags (neighborhoods, landmarks, corridors), theme tags (work, migration, food, school, music), time tags (decade or year range).</p>
                </Card>
                <Card>
                  <p className="mb-1 text-sm font-bold text-text-primary">Curation tools</p>
                  <p className="text-sm text-text-secondary">Stewards can suggest improved map placement or tags without altering the story itself. Contributors approve or decline.</p>
                </Card>
              </div>
            </div>

            {/* 3.4 Story Generator */}
            <div className="mb-8">
              <h3 className="mb-3 font-display text-fluid-lg font-bold text-text-primary">
                3.4 Story Generator
              </h3>
              <Prose>
                <p>
                  Tools for turning existing stories into new formats. Source links, attribution, and location context stay intact.
                </p>
              </Prose>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Card>
                  <p className="mb-1 text-sm font-bold text-text-primary">Template mode</p>
                  <p className="text-sm text-text-secondary">Captioned story card video (Remotion), audio documentary web page (player, transcript, photos, map pin), map walk playlist (curated route).</p>
                </Card>
                <Card>
                  <p className="mb-1 text-sm font-bold text-text-primary">Prompt mode</p>
                  <p className="text-sm text-text-secondary">User describes what they want. The system produces structured output and cites which story segments were used.</p>
                </Card>
              </div>
              <Card className="mt-3">
                <p className="mb-1 text-sm font-bold text-text-primary">Citation guardrails</p>
                <p className="text-sm text-text-secondary">
                  Every generated output links back to the original story page. Transcript excerpts are traceable by timecode. No voice cloning or impersonation. Summarization is labeled as such. The Anthropic API handles generation. It does not replace human voices or editorial judgment.
                </p>
              </Card>
            </div>

            {/* 3.5 Interactive Map */}
            <div className="mb-8">
              <h3 className="mb-3 font-display text-fluid-lg font-bold text-text-primary">
                3.5 Interactive Map
              </h3>
              <Prose>
                <p>
                  <strong>Web and large-screen modes.</strong> Pins and clusters, place search, filters by theme, decade, format, and neighborhood. Curated walks for mobile browsing and event display.
                </p>
                <p>
                  <strong>Event display:</strong> featured loop on autoplay, browse mode with touch-first navigation, projection mapping via MadMapper. Two projection modes: pre-rendered Remotion loops (reliable) and live interactive display routed into MadMapper (advanced, for installations with gesture navigation).
                </p>
                <p>
                  <strong>Downtown activation:</strong> interactive map projected during downtown activations. Passersby browse stories on the touchscreen while the Rover is stationed at events and public spaces.
                </p>
              </Prose>
            </div>

            {/* 3.6 Generative Projection */}
            <div>
              <h3 className="mb-3 font-display text-fluid-lg font-bold text-text-primary">
                3.6 Generative Projection Layer
              </h3>
              <Prose>
                <p>
                  Live visuals drawn from transcript excerpts, place tags, and themes. Video, photography, typography, shapes, and collage projected in real time via MadMapper. Displayed excerpts include attribution. QR codes link back to source stories so viewers can discover full recordings and the storytelling repo.
                </p>
                <p>
                  The layer runs two ways: as pre-rendered loops for reliable event display, or as a live interactive installation where gesture input or touch controls shift the content in real time.
                </p>
              </Prose>
            </div>
          </section>

          {/* 4. ATL DTN Deployment */}
          <section className="mb-12 sm:mb-16" id="deployment">
            <SectionHeading>4. ATL DTN Deployment</SectionHeading>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-6">
              <Card>
                <p className="mb-1 text-sm font-bold text-accent">4.1 Generative Projection</p>
                <p className="text-sm text-text-secondary">
                  Live or pre-rendered visuals from the story archive, projected onto downtown surfaces via MadMapper. New stories enter through booth capture or the web app. The generative layer pulls from the live archive. The projection content grows as the community contributes. Capture, transcribe, and project within one event cycle.
                </p>
              </Card>
              <Card>
                <p className="mb-1 text-sm font-bold text-accent">4.2 MAP Rover Integration</p>
                <p className="text-sm text-text-secondary">
                  The Rover serves as both a mobile story booth and a projection surface. Capture and projection from the same vehicle. The Surface Hub handles interactive map browsing during the day; it switches to projection output for evening installations. One vehicle, two modes, same archive.
                </p>
              </Card>
              <Card>
                <p className="mb-1 text-sm font-bold text-accent">4.3 Augmented Reality Layer</p>
                <p className="text-sm text-text-secondary">
                  The interactive map doubles as a phone-based AR layer. Point a phone at a downtown location, see stories from that place overlaid on the screen. Same geomapping data, rendered through Mapbox.
                </p>
              </Card>
              <Card>
                <p className="mb-1 text-sm font-bold text-accent">4.4 Gesture Navigation</p>
                <p className="text-sm text-text-secondary">
                  For large-screen installations, MediaPipe tracks hand and body landmarks for hands-free browsing. Open palm to select. Swipe to advance. Step closer to zoom into a neighborhood cluster.
                </p>
              </Card>
            </div>

            <Card className="border-l-4 border-l-accent">
              <p className="mb-1 text-sm font-bold text-text-primary">4.5 Demo Deliverable</p>
              <p className="text-sm text-text-secondary">
                A working capture-to-projection pipeline for public demonstration. A complete vertical slice: booth or web capture, stories transcribed and tagged, generative visuals projected that same day or evening.
              </p>
            </Card>
          </section>

          {/* 5. Community Engagement */}
          <section className="mb-12 sm:mb-16" id="community">
            <SectionHeading>5. Community Engagement</SectionHeading>

            {/* Who Contributes */}
            <div className="mb-8">
              <h3 className="mb-3 font-display text-fluid-lg font-bold text-text-primary">
                Who Contributes
              </h3>
              <div className="flex flex-col gap-3">
                <Card>
                  <p className="text-sm text-text-secondary">
                    <strong className="text-text-primary">Atlanta residents and families</strong> are the primary storytellers. They record through booths, the web app, and interview kit sessions.
                  </p>
                </Card>
                <Card>
                  <p className="text-sm text-text-secondary">
                    <strong className="text-text-primary">Local figures</strong> like longtime community members, educators, organizers, faith leaders, and business ownersare asked to contribute.
                  </p>
                </Card>
                <Card>
                  <p className="text-sm text-text-secondary">
                    <strong className="text-text-primary">Commissioned artists and designers</strong> build specific outputs from the archive.
                  </p>
                </Card>
              </div>
            </div>

            {/* Engagement Model */}
            <div className="mb-8">
              <h3 className="mb-3 font-display text-fluid-lg font-bold text-text-primary">
                Atlanta-Focused Engagement
              </h3>
              <Prose>
                <p>
                  Pop-up story capture at Atlanta events and public spaces. Recording Booths at community gatherings, festivals, farmers markets, and public programming. People walk up, record a story, and see it projected on a nearby surface that same evening. The feedback loop is immediate: contribute a story, watch it become part of the downtown landscape.
                </p>
                <p>
                  <strong>Agentic Community Hours</strong> at the Futures Lab studio at Underground Atlanta. Recurring open sessions where creators, artists, and local business owners bring a workflow problem or project idea. Creative Context helps them scope it, pick tools, and start building. Participants leave with working prototypes and configured tools.
                </p>
              </Prose>
            </div>

            {/* Community Contribution Models */}
            <div className="mb-8">
              <h3 className="mb-3 font-display text-fluid-lg font-bold text-text-primary">
                Community Contribution Models
              </h3>
              <motion.div
                className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={stagger}
              >
                {communityModels.map((m, i) => (
                  <motion.div key={i} variants={fadeUp} custom={i} className="sm:h-full">
                    <Card className="h-full min-h-[11.5rem] flex flex-col">
                      <p className="mb-2.5 text-sm font-bold text-accent">{m.title}</p>
                      <div className="space-y-1.5 text-sm leading-relaxed text-text-secondary">
                        {m.bullets.map((b, j) => (
                          <p key={j}>{b}</p>
                        ))}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Phased Engagement */}
            <div className="mb-8">
              <h3 className="mb-3 font-display text-fluid-lg font-bold text-text-primary">
                Phased Engagement
              </h3>
              <div className="flex flex-col gap-3">
                {engagementPhases.map((ep, i) => (
                  <Card key={i} className="border-l-[3px] border-l-accent">
                    <p className="mb-1 text-sm font-bold text-text-primary">{ep.phase}</p>
                    <p className="text-sm text-text-secondary">{ep.desc}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Who Does What */}
            <div>
              <h3 className="mb-3 font-display text-fluid-lg font-bold text-text-primary">
                Who Does What
              </h3>
              <Prose>
                <p>
                  PAFL and community partners support relationships, event logistics, communications, and additional volunteers. Creative Context builds the technology, runs the system, and maintains the pipeline.
                </p>
              </Prose>
            </div>
          </section>

          {/* 6. Technology Approach */}
          <section className="mb-12 sm:mb-16" id="technology">
            <SectionHeading>6. Technology Approach</SectionHeading>

            {/* 6.1 How Tech Fits */}
            <div className="mb-8">
              <h3 className="mb-3 font-display text-fluid-lg font-bold text-text-primary">
                6.1 How Technology Fits
              </h3>
              <Prose>
                <p>
                  The platform runs on Next.js with TypeScript. Mapbox handles mapping and geocoding. Remotion generates video outputs. MadMapper handles projection mapping. MediaPipe provides gesture tracking. Whisper handles transcription so every story becomes searchable, citable, and captionable. The Anthropic API generates structured outputs with citation guardrails.
                </p>
                <p>
                  The AI components are operational tooling. Whisper converts speech to text so stories can be found, excerpted, and attributed by timecode. Anthropic and other APIs produce story cards, documentary pages, and walk descriptions from existing recordings. It cites its sources. It does not replace human voices. It does not make editorial decisions.
                </p>
              </Prose>
            </div>

            {/* 6.2 Equipment */}
            <div className="mb-8">
              <h3 className="mb-3 font-display text-fluid-lg font-bold text-text-primary">
                6.2 Equipment Requested
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Card>
                  <p className="mb-2.5 text-sm font-bold text-text-primary">Creative Context requests</p>
                  <ul className="space-y-1.5 pl-4 text-sm leading-relaxed text-text-secondary list-disc list-outside [&>li]:pl-0.5">
                    <li>Mac minis</li>
                    <li>Cameras and microphones for booth capture</li>
                    <li>Software licenses</li>
                    <li>LLM and API fees and subscriptions</li>
                  </ul>
                </Card>
                <Card>
                  <p className="mb-2 text-sm font-bold text-text-primary">From PAFL inventory</p>
                  <ul className="text-sm text-text-secondary space-y-1">
                    <li>Epson Home Cinema 880 + Optoma GT1090HDR projectors</li>
                    <li>Gaming PC for rendering and MadMapper</li>
                    <li>Microsoft Surface Hub 55&quot; for interactive display</li>
                    <li>Azure Kinect DK for depth sensing / gesture</li>
                    <li>Ultra Leap 3Di for hand tracking</li>
                    <li>Portable speaker + microphone for booth audio</li>
                  </ul>
                </Card>
              </div>
            </div>

            {/* 6.3 Build Plan */}
            <div className="mb-8">
              <h3 className="mb-3 font-display text-fluid-lg font-bold text-text-primary">
                6.3 18-Week Build Plan
              </h3>
              <div className="flex flex-col gap-3">
                {phases.map((phase) => (
                  <motion.div
                    key={phase.number}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: phase.number * 0.05, duration: 0.35, ease: [0.2, 0.8, 0.2, 1] as const }}
                  >
                    <Card className="border-l-4 border-l-accent">
                      <div className="flex items-baseline justify-between">
                        <h4 className="font-display text-sm font-bold text-text-primary">
                          Phase {phase.number}: {phase.title}
                        </h4>
                        {phase.weeks ? (
                          <span className="text-xs font-medium text-accent">{phase.weeks}</span>
                        ) : null}
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                        {phase.description}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 6.4 Budget */}
            <div className="mb-8">
              <h3 className="mb-3 font-display text-fluid-lg font-bold text-text-primary">
                6.4 Budget Note
              </h3>
              <Prose>
                <p>
                  Stipend ($5K) covers: mac mini(s), camera(s), webcam(s), and microphone(s), cloud hosting and API costs (Vercel, R2, Whisper, Anthropic, etc), event materials (signage, printed QR cards, booth construction), domain and infrastructure, travel to partner sites.
                </p>
              </Prose>
            </div>

            {/* Tech Stack Table */}
            <div>
              <h3 className="mb-3 font-display text-fluid-lg font-bold text-text-primary">
                Full Tech Stack
              </h3>
              <div className="overflow-x-auto rounded-brand border border-[var(--color-card-border)]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-card-border)] bg-[var(--color-surface-alt)]">
                      <th className="px-4 py-2.5 text-left font-bold text-text-primary">Layer</th>
                      <th className="px-4 py-2.5 text-left font-bold text-text-primary">Tools</th>
                    </tr>
                  </thead>
                  <tbody>
                    {techStack.map((row, i) => (
                      <tr
                        key={i}
                        className={`border-b border-[var(--color-card-border)] last:border-b-0
                                    ${i % 2 === 0 ? 'bg-[var(--color-card-bg)]' : 'bg-[var(--color-surface-alt)]/50'}`}
                      >
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-accent">{row.layer}</td>
                        <td className="px-4 py-2 text-text-secondary">{row.tools}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* 7. Privacy, Consent, and Attribution */}
          <section className="mb-12 sm:mb-16" id="privacy">
            <SectionHeading>7. Privacy, Consent, and Attribution</SectionHeading>
            <Prose>
              <p>
                Identity runs through Better Auth. Public attribution defaults to first name only. Invited contributors can opt into &ldquo;verified storyteller&rdquo; tags with identity known internally but display controlled by the contributor.
              </p>
            </Prose>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Card>
                <p className="mb-2.5 text-sm font-bold text-text-primary">Visibility controls per story</p>
                <ul className="space-y-1.5 pl-4 text-sm leading-relaxed text-text-secondary list-disc list-outside [&>li]:pl-0.5">
                  <li>Public (library and map)</li>
                  <li>Limited (events and playlists only)</li>
                  <li>Private (saved to account, optional share-by-link)</li>
                </ul>
              </Card>
              <Card>
                <p className="mb-2.5 text-sm font-bold text-text-primary">Location precision</p>
                <ul className="space-y-1.5 pl-4 text-sm leading-relaxed text-text-secondary list-disc list-outside [&>li]:pl-0.5">
                  <li>Independent of story visibility</li>
                  <li>Exact, approximate, neighborhood-only, or hidden</li>
                  <li>A story can be public with hidden location</li>
                </ul>
              </Card>
              <Card>
                <p className="mb-2.5 text-sm font-bold text-text-primary">Minors and school-based capture</p>
                <ul className="space-y-1.5 pl-4 text-sm leading-relaxed text-text-secondary list-disc list-outside [&>li]:pl-0.5">
                  <li>Guardian consent required</li>
                  <li>Limited visibility by default</li>
                  <li>Conservative location and attribution marking</li>
                </ul>
              </Card>
              <Card>
                <p className="mb-2.5 text-sm font-bold text-text-primary">Sensitive content</p>
                <ul className="space-y-1.5 pl-4 text-sm leading-relaxed text-text-secondary list-disc list-outside [&>li]:pl-0.5">
                  <li>Reporting and takedown workflow</li>
                  <li>Stewards escalate. They do not make unilateral decisions</li>
                </ul>
              </Card>
            </div>
            <Card className="mt-3 border-l-4 border-l-accent">
              <p className="mb-1 text-sm font-bold text-text-primary">Generation guardrails</p>
              <p className="text-sm text-text-secondary">
                Every output links to its source stories. Transcript excerpts are traceable by timecode. No voice cloning. No image cloning. No impersonation. Summarization is labeled as summarization.
              </p>
            </Card>
          </section>

          {/* 8. Track Record */}
          <section className="mb-12 sm:mb-16" id="track-record">
            <SectionHeading>8. Track Record</SectionHeading>
            <Prose>
              <p>
                I have been producing brand and network content for two decades. Making films and television, managing budgets, delivering work on contracted deadlines. The scale has ranged from small branded pieces on my own to multi-month productions with large teams across multiple locations across the globe.
              </p>
              <p>
                Scope management is my job. Every production has the same constraints: time, money, people, locations, equipment. The work always ships.
              </p>
              <p>
                I&rsquo;ve been creating and building working systems using LLMs from Claude, ChatGPT, and Gemini along with custom toolchains. Working software that real people can use. Full-stack technical capability across the tools listed in this application.
              </p>
              <p>
                I love Atlanta. I grew up here. Atlanta taught me how to be an artist.
              </p>
              <p>
                The creative technology through-line is simple. Each wave of technology enables new work. The medium changes. The creation stays the same: turn creative ideas into something real, tangible, and executable.
              </p>
            </Prose>
          </section>

          {/* Appendix: MVP Data Model */}
          <section className="mb-12 sm:mb-16">
            <SectionHeading>Appendix A: MVP Data Model</SectionHeading>
            <div className="flex flex-col gap-2">
              {[
                { name: 'users', bullets: ['auth ID', 'roles', 'verified storyteller flag'] },
                { name: 'stories', bullets: ['title', 'type', 'first name display', 'visibility', 'timestamps'] },
                { name: 'story_media', bullets: ['URLs', 'duration', 'MIME types', 'derivative references'] },
                { name: 'transcripts', bullets: ['full text', 'segments with timecodes'] },
                { name: 'places', bullets: ['name', 'coordinates', 'neighborhood'] },
                { name: 'story_locations', bullets: ['coordinates', 'precision mode', 'neighborhood', 'hidden/approximate flags'] },
                { name: 'story_places', bullets: ['story-to-place links', 'confidence', 'manual overrides'] },
                { name: 'tags', bullets: ['theme', 'place', 'time tags'] },
                { name: 'story_tags', bullets: ['join table'] },
                { name: 'wiki_entries', bullets: ['place or global context', 'content', 'citations'] },
                { name: 'playlists/walks', bullets: ['curated sets for map and events'] },
                { name: 'generations', bullets: ['prompt version', 'inputs', 'outputs', 'source references', 'render assets'] },
                { name: 'reports/takedowns', bullets: ['story ID', 'reason', 'status'] },
              ].map((model, i) => (
                <div
                  key={i}
                  className="rounded-brand-sm border border-[var(--color-card-border)] bg-[var(--color-card-bg)] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleMvpModel(i)}
                    className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left transition-colors hover:bg-[var(--color-surface-alt)]"
                    aria-expanded={openMvpModels.has(i)}
                  >
                    <code className="font-mono text-xs font-bold text-accent whitespace-nowrap">{model.name}</code>
                    <svg
                      className={`h-4 w-4 shrink-0 text-text-secondary transition-transform ${openMvpModels.has(i) ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openMvpModels.has(i) && (
                    <div className="border-t border-[var(--color-card-border)] px-3 py-2">
                      <ul className="space-y-0.5 pl-4 text-xs text-text-secondary list-disc list-outside">
                        {model.bullets.map((b, j) => (
                          <li key={j}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Appendix: Community Contribution Examples */}
          <section>
            <SectionHeading>Appendix C: Community Contribution Examples</SectionHeading>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { title: 'Designer-built template packs', detail: 'Remotion story cards, printable QR posters' },
                { title: 'Neighborhood timeline walks', detail: 'Librarian/historian-curated map routes and web exhibits' },
                { title: 'Youth media workshops', detail: 'Student interview projects using interview kit' },
                { title: 'Gesture story portal', detail: 'MediaPipe-driven hands-free navigation for installations' },
              ].map((item, i) => (
                <Card key={i}>
                  <p className="mb-1 text-sm font-bold text-text-primary">{item.title}</p>
                  <p className="text-sm text-text-secondary">{item.detail}</p>
                </Card>
              ))}
            </div>
          </section>

              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
