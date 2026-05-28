import { copyFileSync, cpSync, mkdirSync } from 'node:fs'

mkdirSync('public/content', { recursive: true })
cpSync('src/content', 'public/content', { recursive: true })
copyFileSync('src/content/changelog.json', 'public/content/changelog.json')
