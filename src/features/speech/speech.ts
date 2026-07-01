export type SpeakOptions = {
  rate?: number
  lang?: string
}

export function canSpeak(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function speak(text: string, options: SpeakOptions = {}): void {
  if (!canSpeak() || !text.trim()) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = options.lang ?? 'en-US'
  utterance.rate = options.rate ?? 1
  window.speechSynthesis.speak(utterance)
}

export function stopSpeaking(): void {
  if (!canSpeak()) return
  window.speechSynthesis.cancel()
}
