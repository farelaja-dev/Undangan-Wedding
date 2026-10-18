// Frame-specific botanical engraving. It stays at the edges, outside the face area.
export default function PortraitOrnament() {
  const sprig = <g fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
    <path d="M34 383C8 352 11 313 22 271M16 342C7 328 5 310 8 295M19 314C31 301 35 286 34 274" />
    <g fill="#b9c5b9" fillOpacity=".65">
      <path d="M19 285C8 277 10 267 17 260c5 9 6 17 2 25Z" />
      <path d="M17 307c9-3 14-11 12-20-9 5-13 11-12 20Z" />
      <path d="M14 322C4 315 1 305 4 299c8 4 12 13 10 23Z" />
      <path d="M16 342c10-3 16-10 15-19-10 4-15 10-15 19Z" />
      <path d="M22 363c-12-3-18-11-17-20 10 3 17 10 17 20Z" />
      <path d="M29 375c7-7 9-16 4-23-6 8-8 16-4 23Z" />
    </g>
    <path d="M7 295 4 281M22 271l5-14M34 274l5-11" />
    <g fill="#f9f5e9"><ellipse cx="4" cy="278" rx="2.5" ry="4" /><ellipse cx="28" cy="254" rx="2.5" ry="4" /><ellipse cx="40" cy="260" rx="2.5" ry="4" /></g>
    <path d="M34 383c17 7 32 8 48 6" strokeOpacity=".6" />
  </g>;
  return <svg className="portrait-ornament" viewBox="0 0 320 400" preserveAspectRatio="none" aria-hidden="true">{sprig}<g transform="translate(320 0) scale(-1 1)">{sprig}</g><g fill="none" stroke="currentColor" strokeWidth="1"><path d="m154 390 6-5 6 5-6 5Z" /><path d="M140 390h-28m68 0h28" /></g></svg>;
}
