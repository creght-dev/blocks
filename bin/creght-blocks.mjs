#!/usr/bin/env node

import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const require = createRequire(import.meta.url)
const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const packageJson = JSON.parse(readFileSync(path.join(packageRoot, 'package.json'), 'utf8'))
const registry = JSON.parse(readFileSync(path.join(packageRoot, 'registry.json'), 'utf8'))
const availableItems = new Set(registry.items.map((item) => item.name))
const defaultRegistryBaseUrl =
  `https://unpkg.com/${packageJson.name}@${packageJson.version}/public/r`

function usage() {
  console.log(`Creght Blocks installer

Usage:
  npx @creght/creght-blocks add <item...> [shadcn options]

Examples:
  npx @creght/creght-blocks add hero-01
  npx @creght/creght-blocks add hero-lodestar --yes

Environment:
  CREGHT_BLOCKS_REGISTRY_BASE_URL  Optional public registry base URL override
`)
}

function fail(message) {
  console.error(`creght-blocks: ${message}`)
  process.exitCode = 1
}

function parseArguments(argv) {
  if (argv.length === 0 || argv.includes('--help') || argv.includes('-h')) {
    return { help: true, items: [], shadcnArgs: [] }
  }
  if (argv[0] !== 'add') throw new Error(`unknown command "${argv[0]}"`)

  const separator = argv.indexOf('--')
  const commandArgs = separator === -1 ? argv.slice(1) : argv.slice(1, separator)
  const explicitShadcnArgs = separator === -1 ? [] : argv.slice(separator + 1)
  const firstOption = commandArgs.findIndex((argument) => argument.startsWith('-'))
  const itemArgs = firstOption === -1 ? commandArgs : commandArgs.slice(0, firstOption)
  const inferredShadcnArgs = firstOption === -1 ? [] : commandArgs.slice(firstOption)

  if (itemArgs.length === 0) throw new Error('at least one item is required')
  const items = [...new Set(itemArgs)]
  for (const item of items) {
    if (!availableItems.has(item)) throw new Error(`unknown item "${item}"`)
  }

  return { help: false, items, shadcnArgs: [...inferredShadcnArgs, ...explicitShadcnArgs] }
}

function registryBaseUrl() {
  const configured = process.env.CREGHT_BLOCKS_REGISTRY_BASE_URL?.trim()
  const baseUrl = (configured || defaultRegistryBaseUrl).replace(/\/$/, '')
  if (!/^https:\/\//.test(baseUrl) && !/^http:\/\/localhost(?::\d+)?(?:\/|$)/.test(baseUrl)) {
    throw new Error('registry base URL must use HTTPS')
  }
  return baseUrl
}

function main() {
  let parsed
  try {
    parsed = parseArguments(process.argv.slice(2))
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error))
    usage()
    return
  }
  if (parsed.help) {
    usage()
    return
  }

  const baseUrl = registryBaseUrl()
  const itemUrls = parsed.items.map((item) => `${baseUrl}/${encodeURIComponent(item)}.json`)
  const shadcnEntry = require.resolve('shadcn')
  const result = spawnSync(
    process.execPath,
    [shadcnEntry, 'add', ...itemUrls, ...parsed.shadcnArgs],
    {
      cwd: process.cwd(),
      env: process.env,
      stdio: 'inherit',
    },
  )
  if (result.error) throw result.error
  if (result.status !== 0) process.exitCode = result.status ?? 1
}

try {
  main()
} catch (error) {
  fail(error instanceof Error ? error.message : String(error))
}
