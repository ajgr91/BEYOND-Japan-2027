'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import './background-music.css';

type Status = 'loading' | 'playing' | 'blocked' | 'paused' | 'error';
export default function BackgroundMusic() {
  const audio = useRef<HTMLAudioElement>(null);
  const wanted = useRef(true);
  const pending = useRef(false);
  const alive = useRef(false);
  const [status, setStatus] = useState<Status>('loading');
  const play = useCallback(() => {
    const element = audio.current;
    if (!element || !wanted.current || pending.current || !element.paused || element.error) return;
    pending.current = true;
    void element.play().catch((error: DOMException) => {
      if (!alive.current || !wanted.current || error.name === 'AbortError') return;
      setStatus(error.name === 'NotAllowedError' ? 'blocked' : 'error');
    }).finally(() => { pending.current = false; });
  }, []);

  useEffect(() => {
    alive.current = true;
    const element = audio.current;
    if (!element) return;
    element.autoplay = true;
    element.muted = false;
    element.volume = .25;
    const resume = (event: Event) => {
      if ((event.target as Element | null)?.closest('.music-toggle')) return;
      play();
    };
    // Attempt immediately and again when the MP3 has enough buffered data.
    element.addEventListener('canplay', play);
    element.addEventListener('canplaythrough', play);
    document.addEventListener('pointerdown', resume);
    document.addEventListener('keydown', resume);
    play();
    return () => {
      alive.current = false;
      element.removeEventListener('canplay', play);
      element.removeEventListener('canplaythrough', play);
      document.removeEventListener('pointerdown', resume);
      document.removeEventListener('keydown', resume);
      element.pause();
    };
  }, [play]);

  function toggle() {
    const element = audio.current;
    if (!element) return;
    if (!element.paused) {
      wanted.current = false; element.pause(); setStatus('paused');
    } else {
      wanted.current = true; setStatus('loading'); play();
    }
  }
  const playing = status === 'playing';
  const label = playing ? 'ON' : status === 'loading' ? 'CARGANDO' : status === 'blocked' ? 'ACTIVAR' : 'OFF';
  const message = status === 'error' ? 'Audio no disponible' : status === 'blocked' ? 'Pulsa para escuchar' : 'Naruto Main Theme';
  return <aside className="background-music" aria-label="Música de fondo">
    <audio ref={audio} src="/audio/naruto-main-theme.mp3" autoPlay loop preload="auto" muted={false}
      onPlaying={() => setStatus('playing')}
      onPause={() => { if (alive.current) setStatus(wanted.current ? 'blocked' : 'paused'); }}
      onError={() => setStatus('error')} />
    <button onClick={toggle} className="music-toggle" aria-pressed={playing} aria-label={playing ? 'Apagar música de fondo' : 'Activar música de fondo'} title={message} disabled={status === 'error'}>
      {playing ? <Volume2 size={15} /> : <VolumeX size={15} />}
      <span>MÚSICA <b>{label}</b></span>
      <i className={playing ? 'music-playing' : ''} aria-hidden="true"><em /><em /><em /></i>
    </button>
    {status === 'blocked' && <span className="music-hint">Pulsa para escuchar</span>}
    {status === 'error' && <span className="music-hint">Audio no disponible</span>}
  </aside>;
}
