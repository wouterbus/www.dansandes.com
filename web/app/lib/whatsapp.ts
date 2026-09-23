export const WHATSAPP_NUMBER = '5511963247572'
/** @deprecated Prefer WHATSAPP_NUMBER */
export const WHATSAPP_PHONE = WHATSAPP_NUMBER

export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`
  const text = message?.trim()
  if (!text) return base
  return `${base}?text=${encodeURIComponent(text)}`
}

export function whatsappSiteMessage(userText: string): string {
  return `Olá! Vim pelo site da Sandes. Quero conversar sobre:\n\n${userText.trim()}`
}
