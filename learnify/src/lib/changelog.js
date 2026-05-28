import changelogData from '../content/changelog.json'

/** @typedef {{ version: string, date: string, type: 'major'|'minor'|'patch', changes: string[] }} ChangelogEntry */

/** @type {ChangelogEntry[]} */
export const changelogEntries = [...changelogData].sort(
  (a, b) => new Date(b.date) - new Date(a.date),
)

export function getLatestVersion() {
  return changelogEntries[0]?.version ?? '0.0.0'
}

export function getVersionBadgeClass(type) {
  switch (type) {
    case 'major':
      return 'bg-[#04AA6D] text-white dark:bg-green-600'
    case 'minor':
      return 'bg-blue-600 text-white dark:bg-blue-500'
    case 'patch':
    default:
      return 'bg-slate-500 text-white dark:bg-slate-600'
  }
}
