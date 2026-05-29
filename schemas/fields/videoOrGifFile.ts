/** Accepted MIME types / extensions for hero, parallax, and case media fields */
export const VIDEO_OR_GIF_ACCEPT =
  'video/*,image/gif,.gif,.mp4,.mov,.webm,.m4v,video/mp4,video/quicktime'

export const videoOrGifFileOptions = {
  accept: VIDEO_OR_GIF_ACCEPT,
} as const

/** Photos + video/GIF for circular media slots (e.g. Conteúdos) */
export const IMAGE_OR_VIDEO_ACCEPT = `${VIDEO_OR_GIF_ACCEPT},image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp`

export const imageOrVideoFileOptions = {
  accept: IMAGE_OR_VIDEO_ACCEPT,
} as const
