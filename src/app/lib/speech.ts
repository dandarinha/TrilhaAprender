export function speak(text: string, opts: { rate?: number; pitch?: number } = {}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.toLowerCase());
    u.lang = 'pt-BR';
    u.rate = opts.rate ?? 1.0; 
    u.pitch = opts.pitch ?? 1.4;
    const voices = window.speechSynthesis.getVoices();
    const pt = voices.find(v => v.lang?.toLowerCase().startsWith('pt'));
    if (pt) u.voice = pt;
    window.speechSynthesis.speak(u);
  } catch {}
}

export function stopSpeaking() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try { window.speechSynthesis.cancel(); } catch {}
}
