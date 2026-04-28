const isTauri = typeof window !== 'undefined' && window.__TAURI_INTERNALS__ !== undefined;

export default function Titlebar() {
  if (!isTauri) return null;

  const handleMinimize = async () => {
    const { getCurrentWindow } = await import('@tauri-apps/api/window');
    await getCurrentWindow().minimize();
  };

  const handleMaximize = async () => {
    const { getCurrentWindow } = await import('@tauri-apps/api/window');
    await getCurrentWindow().toggleMaximize();
  };

  const handleClose = async () => {
    const { getCurrentWindow } = await import('@tauri-apps/api/window');
    await getCurrentWindow().close();
  };

  return (
    <div className="relative flex items-center h-10 select-none bg-[#070908] border-b border-white/5 shrink-0 sticky top-0 z-[100]">
      <div data-tauri-drag-region className="absolute inset-0" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-sm font-medium text-slate-400 font-[Pacifico] tracking-wider opacity-70">Benkyo</span>
      </div>

      <div className="ml-auto flex space-x-2 z-10 px-4 relative">
        <button
          onClick={handleMinimize}
          className="w-3 h-3 rounded-full bg-[#FFBD2E] hover:bg-[#FFBD2E]/80 transition-colors border border-black/10 focus:outline-none cursor-pointer"
          aria-label="Minimize"
        />
        <button
          onClick={handleMaximize}
          className="w-3 h-3 rounded-full bg-[#27C93F] hover:bg-[#27C93F]/80 transition-colors border border-black/10 focus:outline-none cursor-pointer"
          aria-label="Maximize"
        />
        <button
          onClick={handleClose}
          className="w-3 h-3 rounded-full bg-[#FF5F56] hover:bg-[#FF5F56]/80 transition-colors border border-black/10 focus:outline-none cursor-pointer"
          aria-label="Close"
        />
      </div>
    </div>
  );
}