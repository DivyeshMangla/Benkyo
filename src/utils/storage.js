const isTauri = '__TAURI_INTERNALS__' in window;

export async function loadItem(key) {
  if (isTauri) {
    const { invoke } = await import('@tauri-apps/api/core');
    const raw = await invoke('load_data', { key });
    return raw && raw !== 'null' ? JSON.parse(raw) : null;
  }
  // Fallback — plain browser
  const raw = window.localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}

export async function saveItem(key, value) {
  if (isTauri) {
    const { invoke } = await import('@tauri-apps/api/core');
    await invoke('save_data', { key, data: JSON.stringify(value) });
    return;
  }
  window.localStorage.setItem(key, JSON.stringify(value));
}
