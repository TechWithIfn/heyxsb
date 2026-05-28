export function getLessonShareUrl() {
  if (typeof window === 'undefined') return ''
  return window.location.href
}

export function buildShareText(lessonTitle) {
  const title = lessonTitle?.trim() || 'this lesson'
  return `Learning ${title} on LearnTheory!`
}

export function buildTwitterShareUrl(lessonTitle, url) {
  const text = `${buildShareText(lessonTitle)} ${url}`
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
}

export function buildWhatsAppShareUrl(lessonTitle, url) {
  const text = `${buildShareText(lessonTitle)} ${url}`
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}

export function buildLinkedInShareUrl(url) {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
}

export function canUseNativeShare() {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function'
}

export function prefersNativeShare() {
  if (!canUseNativeShare()) return false
  if (typeof window === 'undefined') return false
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const narrow = window.matchMedia('(max-width: 768px)').matches
  return coarse || narrow
}

export async function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return true
  }
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.left = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()
  const ok = document.execCommand('copy')
  document.body.removeChild(textarea)
  return ok
}

export async function shareLessonNative({ lessonTitle, url }) {
  const shareUrl = url || getLessonShareUrl()
  const text = buildShareText(lessonTitle)
  await navigator.share({
    title: `${lessonTitle} — LearnTheory`,
    text,
    url: shareUrl,
  })
}
