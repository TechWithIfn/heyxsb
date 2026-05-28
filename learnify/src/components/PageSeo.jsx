import { Helmet } from 'react-helmet-async'
import { SITE_NAME } from '../lib/seo'

/**
 * @param {object} props
 * @param {string} props.title - Full document title
 * @param {string} props.description
 * @param {string} [props.canonical]
 * @param {string} [props.keywords]
 * @param {string} [props.ogType]
 * @param {object} [props.jsonLd]
 */
export function PageSeo({
  title,
  description,
  canonical,
  keywords,
  ogType = 'website',
  jsonLd,
}) {
  const url = canonical ?? (typeof window !== 'undefined' ? window.location.href : '')

  return (
    <Helmet>
      <html lang="en" />
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {canonical && <link rel="canonical" href={canonical} />}

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      <meta name="robots" content="index, follow" />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  )
}
