import { useEffect, useState } from 'react';
import { getCountdownParts } from '../utils/calculations.js';

export default function Countdown({ examDate, compact = false }) {
  const [now, setNow] = useState(() => new Date());
  const countdown = getCountdownParts(examDate, now);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const itemClass = compact
    ? 'min-w-14 rounded-lg border border-[#233028] bg-[#0d120f] px-3 py-2 text-center shadow-sm'
    : 'rounded-xl border border-[#233028] bg-[#0d120f] px-4 py-3 text-center';

  return (
    <div
      className="flex gap-2"
      aria-label={`${countdown.days} days, ${countdown.hours} hours, ${countdown.minutes} minutes, ${countdown.seconds} seconds left`}
    >
      {[
        ['Days', countdown.days],
        ['Hours', countdown.hours],
        ['Minutes', countdown.minutes],
        ['Seconds', countdown.seconds],
      ].map(([label, value]) => (
        <div className={itemClass} key={label}>
          <div className="text-lg font-semibold text-slate-100">{value}</div>
          <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</div>
        </div>
      ))}
    </div>
  );
}
