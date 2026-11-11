'use client';

import { useCallback, useEffect, useRef } from 'react';

type Options = { open: boolean; onClosed: () => void; stopScroll: () => void; startScroll: () => void };
export function useAnimatedDrawer({ open, onClosed, stopScroll, startScroll }: Options) {
  const modal = useRef<HTMLDialogElement>(null);
  const animations = useRef<Animation[]>([]);
  const closing = useRef(false);
  const generation = useRef(0);
  const afterClose = useRef(onClosed);
  afterClose.current = onClosed;
  const cancelAnimations = useCallback(() => {
    animations.current.forEach(animation => animation.cancel());
    animations.current = [];
  }, []);

  useEffect(() => {
    const dialog = modal.current;
    if (!dialog) return;
    if (!open) {
      generation.current++;
      cancelAnimations();
      if (dialog.open) dialog.close();
      closing.current = false;
      startScroll();
      return;
    }
    if (dialog.open) return;
    const request = ++generation.current;
    closing.current = false;
    cancelAnimations();
    stopScroll();
    // Focus is assigned in the final layout before any visual translation.
    // Otherwise showModal() may horizontally scroll an offscreen close button into view.
    dialog.showModal();
    dialog.scrollLeft = 0;
    const sheet = dialog.querySelector<HTMLElement>('.drawer-container')!;
    const veil = dialog.querySelector<HTMLElement>('.drawer-veil')!;
    sheet.scrollLeft = 0;
    dialog.dataset.state = 'opening';
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      dialog.dataset.state = 'open';
      return;
    }
    animations.current = [
      veil.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 420, easing: 'ease-out', fill: 'backwards' }),
      sheet.animate([{ transform: 'translate3d(100%,0,0)' }, { transform: 'translate3d(0,0,0)' }], {
        duration: 620, delay: 45, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards',
      }),
    ];
    void Promise.allSettled(animations.current.map(animation => animation.finished)).then(() => {
      if (generation.current === request && dialog.open) dialog.dataset.state = 'open';
    });
  }, [open, stopScroll, startScroll, cancelAnimations]);

  const close = useCallback(() => {
    const dialog = modal.current;
    if (!dialog?.open || closing.current) return;
    closing.current = true;
    const request = ++generation.current;
    const sheet = dialog.querySelector<HTMLElement>('.drawer-container')!;
    const veil = dialog.querySelector<HTMLElement>('.drawer-veil')!;
    // Start from the visible position even if the user closes during entry.
    const fromTransform = getComputedStyle(sheet).transform;
    const fromOpacity = getComputedStyle(veil).opacity;
    cancelAnimations();
    dialog.dataset.state = 'closing';
    const finish = () => {
      if (generation.current !== request) return;
      dialog.close();
      cancelAnimations();
      dialog.dataset.state = 'closed';
      closing.current = false;
      startScroll();
      afterClose.current();
    };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { finish(); return; }
    animations.current = [
      sheet.animate([{ transform: fromTransform }, { transform: 'translate3d(100%,0,0)' }], {
        duration: 340, easing: 'cubic-bezier(.4,0,.6,1)', fill: 'forwards',
      }),
      veil.animate([{ opacity: fromOpacity }, { opacity: 0 }], { duration: 300, delay: 75, easing: 'ease-in', fill: 'forwards' }),
    ];
    void Promise.allSettled(animations.current.map(animation => animation.finished)).then(finish);
  }, [cancelAnimations, startScroll]);

  useEffect(() => () => { generation.current++; cancelAnimations(); }, [cancelAnimations]);
  return { modal, close };
}
