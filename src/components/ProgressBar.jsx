export default function ProgressBar({ value = 0, size = 'md', tone = 'teal' }) {
  const safeValue = Math.min(100, Math.max(0, value));
  const height = size === 'sm' ? 'h-2' : 'h-3';
  const color = {
    teal: 'bg-teal-400',
    sky: 'bg-sky-400',
    amber: 'bg-amber-500',
  }[tone];

  return (
    <div className={`${height} w-full overflow-hidden rounded-full bg-[#202922]`} aria-hidden="true">
      <div className={`${height} rounded-full ${color}`} style={{ width: `${safeValue}%` }} />
    </div>
  );
}
