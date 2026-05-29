let splashHasFinished = false
const listeners = new Set<() => void>()

export function getSplashHasFinished(): boolean {
  return splashHasFinished
}

export function markSplashFinished(): void {
  if (splashHasFinished) return
  splashHasFinished = true
  listeners.forEach((listener) => listener())
}

export function onSplashFinished(listener: () => void): () => void {
  if (splashHasFinished) {
    listener()
    return () => {}
  }
  listeners.add(listener)
  return () => listeners.delete(listener)
}
