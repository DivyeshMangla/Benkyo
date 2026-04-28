export default function Sidebar({ activeView, onNavigate, onReset }) {
  const items = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'subjects', label: 'Subjects' },
  ];

  return (
    <aside className="border-b border-[#1d2a24] bg-[#0b0f0d] px-4 py-4 md:sticky md:top-0 md:flex md:h-screen md:w-64 md:flex-col md:border-b-0 md:border-r md:px-5">
      <div className="font-logo text-4xl text-teal-300">Benkyo</div>

      <nav className="mt-5 flex gap-2 md:block md:space-y-2" aria-label="Primary navigation">
        {items.map((item) => {
          const isActive = activeView === item.id;

          return (
            <button
              className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                isActive ? 'bg-teal-400/10 text-teal-200' : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
              }`}
              key={item.id}
              onClick={() => onNavigate(item.id)}
              type="button"
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      <button
        className="mt-4 w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-rose-500/10 hover:text-rose-400 md:mt-auto"
        onClick={onReset}
        type="button"
      >
        Reset all data
      </button>
    </aside>
  );
}
