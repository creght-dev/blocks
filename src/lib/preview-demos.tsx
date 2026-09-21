import {
  createElement,
  lazy,
  Suspense,
  type ElementType,
  type ReactNode,
} from "react"

import registryData from "@/registry.catalog.json"

const DevWizaButtonConfigurator = import.meta.env.DEV
  ? lazy(async () => {
      const module = await import("@/src/components/WizaButtonConfigurator")
      return { default: module.WizaButtonConfigurator }
    })
  : null

type RegistryFile = {
  path: string
}

type RegistryItem = {
  name: string
  categories?: string[]
  files?: RegistryFile[]
}

type ModuleRecord = Record<string, unknown>

function isRenderableComponent(candidate: unknown): candidate is ElementType {
  return (
    typeof candidate === "function" ||
    (typeof candidate === "object" && candidate !== null && "$$typeof" in candidate)
  )
}

const registryModules = import.meta.glob("../../registry/creght/*/*/*.{ts,tsx}", {
  eager: true,
}) as Record<string, ModuleRecord>

function getComponentFromModule(moduleRecord: ModuleRecord, itemName: string) {
  const fromDefault = moduleRecord.default
  if (isRenderableComponent(fromDefault)) {
    return fromDefault
  }

  const fromName = moduleRecord[itemName]
  if (isRenderableComponent(fromName)) {
    return fromName
  }

  const firstComponent = Object.values(moduleRecord).find(isRenderableComponent)
  if (firstComponent) {
    return firstComponent
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

    if (item.name === "button-wiza" && DevWizaButtonConfigurator) {
      result[item.name] = createElement(
        Suspense,
        {
          fallback: createElement("div", {
            className: "min-h-dvh bg-black",
          }),
        },
        createElement(DevWizaButtonConfigurator),
      )
      return result
    }

    const component = createElement(Component)
    if (item.name === "button-glass") {
      result[item.name] = createElement(
        "div",
        { className: "glass-button-preview-stage" },
        component,
      )
      return result
    }

    result[item.name] = item.categories?.includes("button")
      ? createElement(
          "div",
          {
            className: `flex min-h-dvh items-center justify-center p-8 ${
              item.name === "button-galaxy"
                ? "bg-[#0a0609]"
                : item.name === "button-generate"
                  ? "bg-black"
                  : item.name === "button-gradient-border"
                    ? "bg-[#050505]"
                    : item.name === "button-wiza"
                      ? "bg-black"
                      : "bg-[#080c0f]"
            }`,
          },
          component,
        )
      : component
    return result
  },
  {} as Record<string, ReactNode>
)
