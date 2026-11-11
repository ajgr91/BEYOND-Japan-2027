'use client';

import { useCallback, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import '../components/page-motion.css';

type Destination = HTMLElement | number;
export function usePageMotion() {
  const scroll = useRef<Lenis | null>(null);
  const scrollTo = useCallback((target: Destination) => {
    const header = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 78;
    const isChapter = typeof target !== 'number' && target.matches('.chapter');
    const offset = typeof target === 'number' ? 0 : -(header + (isChapter && innerWidth <= 760 ? innerHeight * .44 : 0) + (target.id === 'mapa' ? 0 : 24));
    const destination = typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY + offset;
    if (scroll.current) scroll.current.scrollTo(destination, { duration: 1.3, lerp: 0 });
    else window.scrollTo({ top: destination, behavior: 'instant' });
  }, []);
  const stopScroll = useCallback(() => scroll.current?.stop(), []);
  const startScroll = useCallback(() => scroll.current?.start(), []);

  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true, lerp: .085, anchors: false, respectReducedMotion: true, prevent: node => !!node.closest('[data-lenis-prevent]') });
    scroll.current = lenis;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const root = document.documentElement;
    const motionPreference = () => root.classList.toggle('motion-enabled', !reduced.matches);
    motionPreference(); reduced.addEventListener('change', motionPreference);
    const reveal = document.querySelectorAll<HTMLElement>('.prologue h2,.journey-heading h2,.section-title h2,.notebook-banner h2,.practical h2,.ending h2,.highlight-card,.atlas-map');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-revealed'); observer.unobserve(entry.target); } });
    }, { threshold: .12, rootMargin: '0px 0px -5% 0px' });
    reveal.forEach((element, i) => {
      element.dataset.reveal = element.matches('.highlight-card') ? 'card' : element.matches('.atlas-map') ? 'atlas' : 'text';
      if (element.matches('.highlight-card')) element.style.setProperty('--reveal-delay', `${(i % 3) * 110}ms`);
      observer.observe(element);
    });
    const banner = document.querySelector<HTMLElement>('.ending');
    const bannerVisual = banner?.querySelector<HTMLElement>('.ending-visual');
    const updateBanner = () => {
      if (!banner || !bannerVisual || reduced.matches) return;
      const box = banner.getBoundingClientRect();
      if (box.bottom < 0 || box.top > innerHeight) return;
      const progress = (box.top + box.height / 2 - innerHeight / 2) / (innerHeight + box.height);
      bannerVisual.style.setProperty('--parallax-y', `${Math.max(-42, Math.min(42, progress * 85))}px`);
    };
    const bannerObserver = new IntersectionObserver(entries => banner?.classList.toggle('banner-visible', entries[0].isIntersecting));
    if (banner) bannerObserver.observe(banner);
    lenis.on('scroll', updateBanner); addEventListener('resize', updateBanner); updateBanner();
    const onAnchor = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor || anchor.closest('dialog')) return;
      const hash = anchor.getAttribute('href') ?? '#';
      const target = hash === '#' ? 0 : document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target === null) return;
      event.preventDefault(); history.pushState(null, '', hash); scrollTo(target);
    };
    document.addEventListener('click', onAnchor);
    // A direct /#mapa visit receives the same header offset as an internal jump.
    let initialFrame = 0, disposed = false;
    const initialHash = location.hash;
    const alignInitialHash = () => {
      void document.fonts.ready.then(() => {
        if (disposed || location.hash !== initialHash || !initialHash || initialHash === '#') return;
        initialFrame = requestAnimationFrame(() => {
          const target = document.getElementById(decodeURIComponent(initialHash.slice(1)));
          lenis.resize();
          if (target) lenis.scrollTo(target.getBoundingClientRect().top + window.scrollY - (document.querySelector('.site-header')?.getBoundingClientRect().height ?? 78) - (target.id === 'mapa' ? 0 : 24), { immediate: true });
        });
      });
    };
    if (document.readyState === 'complete') alignInitialHash();
    else addEventListener('load', alignInitialHash, { once: true });
    return () => {
      disposed = true; removeEventListener('load', alignInitialHash); cancelAnimationFrame(initialFrame); observer.disconnect(); bannerObserver.disconnect(); lenis.destroy(); scroll.current = null;
      document.removeEventListener('click', onAnchor); removeEventListener('resize', updateBanner);
      reduced.removeEventListener('change', motionPreference); root.classList.remove('motion-enabled');
    };
  }, [scrollTo]);
  return { scrollTo, stopScroll, startScroll };
}
