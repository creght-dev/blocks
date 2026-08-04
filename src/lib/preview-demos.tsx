import { createElement, type ComponentType, type ReactNode } from "react"

import registryData from "@/registry.json"

type RegistryFile = {
  path: string
}

type RegistryItem = {
  name: string
  categories?: string[]
  files?: RegistryFile[]
}

type ModuleRecord = Record<string, unknown>

const registryModules = import.meta.glob("../../registry/creght/*/*/*.{ts,tsx}", {
  eager: true,
}) as Record<string, ModuleRecord>

function getComponentFromModule(moduleRecord: ModuleRecord, itemName: string) {
  const fromDefault = moduleRecord.default
  if (typeof fromDefault === "function") {
    return fromDefault as ComponentType<object>
  }

  const fromName = moduleRecord[itemName]
  if (typeof fromName === "function") {
    return fromName as ComponentType<object>
  }

  const firstFunction = Object.values(moduleRecord).find(
    (candidate) => typeof candidate === "function"
  )
  if (typeof firstFunction === "function") {
    return firstFunction as ComponentType<object>
  }

  return null
}

function toGlobPath(registryPath: string) {
  return `../../${registryPath}`.replaceAll("\\", "/")
}

export const demos: Record<string, ReactNode> = (registryData.items as RegistryItem[]).reduce(
  (result, item) => {
    const entryFile = item.files?.find((file) =>
      file.path.endsWith(`/${item.name}.tsx`) || file.path.endsWith(`/${item.name}.ts`)
    ) ?? item.files?.[0]
    if (!entryFile) return result

    const moduleRecord = registryModules[toGlobPath(entryFile.path)]
    if (!moduleRecord) return result

    const Component = getComponentFromModule(moduleRecord, item.name)
    if (!Component) return result

    const component = createElement(Component)
    result[item.name] = item.categories?.includes("button")
      ? createElement(
          "div",
          { className: "flex min-h-dvh items-center justify-center bg-[#080c0f] p-8" },
          component,
        )
      : component
    return result
  },
  {} as Record<string, ReactNode>
)
