import type {FileValue, Rule, ValidationContext} from 'sanity'

/** Accepted MIME types / extensions for hero, parallax, and case media fields. */
export const VIDEO_OR_GIF_ACCEPT =
  'video/mp4,video/webm,video/quicktime,image/gif,.mp4,.webm,.m4v,.mov,.gif'

export const videoOrGifFileOptions = {
  accept: VIDEO_OR_GIF_ACCEPT,
} as const

/** Photos + video/GIF for circular media slots (e.g. Conteúdos) */
export const IMAGE_OR_VIDEO_ACCEPT = `${VIDEO_OR_GIF_ACCEPT},image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp`

export const imageOrVideoFileOptions = {
  accept: IMAGE_OR_VIDEO_ACCEPT,
} as const

const UNPLAYABLE_EXTENSIONS = ['mov', 'avi', 'mkv', 'wmv', 'flv', 'mpg', 'mpeg']

/**
 * The `accept` option only filters the file dialog — drag-and-drop and already
 * linked assets slip past it, so re-check the stored asset on publish.
 */
export function webPlayableVideo(rule: Rule): Rule {
  return rule.custom(async (value: unknown, context: ValidationContext) => {
    const ref = (value as FileValue | undefined)?.asset?._ref
    if (!ref) return true

    try {
      const asset = await context
        .getClient({apiVersion: '2024-10-01'})
        .fetch<{extension?: string} | null>('*[_id == $id][0]{extension}', {id: ref})

      const extension = asset?.extension?.toLowerCase()
      if (extension && UNPLAYABLE_EXTENSIONS.includes(extension)) {
        return `Os navegadores não reproduzem ficheiros .${extension}. Exporte o vídeo em MP4 (H.264) e volte a carregá-lo.`
      }
    } catch {
      // Asset not yet indexed during upload — allow it through
    }

    return true
  })
}
