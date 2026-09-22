import { rm } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptsDir = dirname(fileURLToPath(import.meta.url))
const projectDir = resolve(scriptsDir, '..')
const distDir = resolve(projectDir, 'dist')

if (dirname(distDir) !== projectDir) {
  throw new Error(`Répertoire de build inattendu : ${distDir}`)
}

await rm(distDir, { recursive: true, force: true })
