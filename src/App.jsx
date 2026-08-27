import React, { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import DocsPage from './pages/DocsPage';

function App() {
  /* Freeze BOTH animation clocks while the tab is hidden: CSS keyframes
     (via .tab-hidden) and SMIL timelines (via pauseAnimations). Browsers
     advance the two clocks differently in background tabs, so without
     this they drift out of sync — e.g. the combo board's packet dots
     would land in the wrong scene after a tab switch. */
  useEffect(() => {
    const onVisibility = () => {
      const hidden = document.hidden;
      document.documentElement.classList.toggle('tab-hidden', hidden);
      document.querySelectorAll('svg').forEach((svg) => {
        if (typeof svg.pauseAnimations !== 'function') return;
        if (hidden) { svg.pauseAnimations(); return; }
        // Only wake SMIL timelines that are near the viewport; offscreen
        // ones stay paused for the IntersectionObserver gates to manage.
        const r = svg.getBoundingClientRect();
        if (r.bottom > -160 && r.top < window.innerHeight + 160) svg.unpauseAnimations();
      });
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="docs" element={<DocsPage />} />
          <Route path="*" element={<LandingPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
