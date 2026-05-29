export function isGifMedia(url?: string, mimeType?: string | null): boolean {
  if (mimeType === 'image/gif') return true
  if (!url) return false
  return /\.gif(\?|#|$)/i.test(url)
}

export function isVideoMedia(url?: string, mimeType?: string | null): boolean {
  if (mimeType?.startsWith('video/')) return true
  if (!url) return false
  return /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(url)
}

export function isLoopingMedia(url?: string, mimeType?: string | null): boolean {
  return isGifMedia(url, mimeType) || isVideoMedia(url, mimeType)
}
