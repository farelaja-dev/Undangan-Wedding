import { useEffect, useRef, useState } from 'react';

export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return reduced;
}

export function Reveal({ children, className = '', delay = 0, direction = 'up', as: Tag = 'div' }) {
  const element = useRef(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const node = element.current;
    if (reduced || !('IntersectionObserver' in window)) { node.classList.add('is-visible'); return; }
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { node.classList.add('is-visible'); observer.unobserve(node); }
    }, { threshold: 0.12, rootMargin: '0px 0px -28px 0px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced]);
  return <Tag ref={element} className={`reveal reveal-${direction} ${className}`} style={{ '--reveal-delay': `${delay}ms` }}>{children}</Tag>;
}

export function Floral({ className = '' }) {
  return <div className={`floral ${className}`} aria-hidden="true"><img src="/decor/floral-bouquet.png" alt="" draggable="false" /></div>;
}

export function Ornament({ className = '' }) {
  return <svg className={`ornament ${className}`} viewBox="0 0 240 38" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth=".8"><path d="M7 19h71c20 0 26-15 42-15s22 15 42 15h71M65 19c15 0 25 16 39 10s10-20 16-25c6 5 2 19 16 25s24-10 39-10M96 19c0-9-11-14-15-7s7 17 16 12M144 19c0-9 11-14 15-7s-7 17-16 12"/><path d="m120 12 6 7-6 7-6-7 6-7Z"/><circle cx="7" cy="19" r="2"/><circle cx="233" cy="19" r="2"/></g></svg>;
}

export function Petals({ active = true }) {
  const canvas = useRef(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const node = canvas.current;
    const ctx = node.getContext('2d');
    if (!ctx || reduced || !active) return;
    let frame, previous = 0, width, height;
    const particles = Array.from({ length: window.innerWidth < 768 ? 25 : 46 }, () => ({ x: Math.random(), y: Math.random(), size: 1 + Math.random() * 4, speed: 0.012 + Math.random() * 0.02, phase: Math.random() * Math.PI * 2, petal: Math.random() > 0.65, opacity: 0.16 + Math.random() * 0.4 }));
    function resize() { width = window.innerWidth; height = window.innerHeight; const dpr = Math.min(window.devicePixelRatio || 1, 1.5); node.width = width * dpr; node.height = height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    function draw(time) {
      const delta = Math.min((time - previous) / 1000 || 0, 0.06); previous = time; ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.y += delta * p.speed; if (p.y > 1.05) { p.y = -0.05; p.x = Math.random(); }
        ctx.save(); ctx.translate(p.x * width + Math.sin(time / 4000 + p.phase) * 28, p.y * height); ctx.rotate(time / 4000 + p.phase);
        ctx.globalAlpha = p.opacity * (0.65 + Math.sin(time / 1800 + p.phase) * 0.35); ctx.fillStyle = p.petal ? '#f5ead5' : '#e8d3a7'; ctx.beginPath();
        if (p.petal) ctx.ellipse(0, 0, p.size * 1.5, p.size * .6, 0, 0, Math.PI * 2);
        else { ctx.shadowColor = '#f6dfa5'; ctx.shadowBlur = 7; ctx.arc(0, 0, p.size / 3, 0, Math.PI * 2); }
        ctx.fill(); ctx.restore();
      }); frame = requestAnimationFrame(draw);
    }
    function visibility() { cancelAnimationFrame(frame); if (!document.hidden) { previous = 0; frame = requestAnimationFrame(draw); } }
    resize(); frame = requestAnimationFrame(draw); window.addEventListener('resize', resize); document.addEventListener('visibilitychange', visibility);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); document.removeEventListener('visibilitychange', visibility); ctx.clearRect(0, 0, width, height); };
  }, [active, reduced]);
  return <canvas className="petals-canvas" ref={canvas} aria-hidden="true" />;
}
