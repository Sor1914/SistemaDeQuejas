export function FlagIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6 3a1 1 0 0 0-1 1v16h2v-5h7.382l.724 1.447A1 1 0 0 0 16 17h2a1 1 0 0 0 .894-1.447l-2-4A1 1 0 0 0 15 11H7V4a1 1 0 0 0-1-1Z"/>
    </svg>
  );
}

export function SpinnerDots(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 120" {...props}>
      <g>
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30) * Math.PI / 180;
          const cx = 60 + 34 * Math.cos(angle);
          const cy = 60 + 34 * Math.sin(angle);
          const opacity = (i + 1) / 12;
          return <circle key={i} cx={cx} cy={cy} r="6" fill="currentColor" opacity={opacity} />;
        })}
      </g>
    </svg>
  );
}

export function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="m9 16.2l-3.5-3.5L4 14.2l5 5l12-12l-1.5-1.5z"/>
    </svg>
  );
}
