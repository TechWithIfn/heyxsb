export function getEnglishName(entity) {
  if (!entity) return ''
  return (
    entity.name_en || entity.englishName || entity.nameEnglish || entity.name || entity.title || ''
  )
}

export function getEnglishShortName(entity) {
  if (!entity) return ''
  return entity.shortName_en || entity.shortName || entity.short || entity.short_name || ''
}

export default { getEnglishName, getEnglishShortName }
