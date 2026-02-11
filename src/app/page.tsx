'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import VisualContainer from '@/components/visuals/VisualContainer';
import ChatThread from '@/components/chat/ChatThread';

export default function Home() {
  return (
    <>
      <Header />

      {/* Main two-column layout */}
      <main className="relative mx-auto flex w-full max-w-container flex-1 min-h-0">
        {/* Visual column (left) — sticky */}
        <div className="hidden w-[45%] lg:block">
          <div className="h-full">
            <VisualContainer />
          </div>
        </div>

        {/* Chat column (right) — scrolls */}
        <div className="w-full lg:w-[55%] h-full overflow-y-auto scrollbar-hide">
          <ChatThread />
          <Footer />
        </div>
      </main>
    </>
  );
}
