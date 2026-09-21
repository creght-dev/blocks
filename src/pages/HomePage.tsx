import { useEffect, useMemo, useRef, useState } from "react"
import { Copy, ExternalLink } from "lucide-react"
import { useNavigate } from "react-router-dom"

import registryData from "@/registry.catalog.json"
import { demos } from "@/src/lib/preview-demos"

type RegistryItem = {
  name: string
  title: string
  description?: string
  cover?: string
  categories?: string[]
}

const PAGE_SIZE = 6
const CATEGORY_ORDER = ["hero", "features", "background", "effects", "showcase", "footer"]
const CATEGORY_LABELS: Record<string, string> = {
  background: "Background 背景",
  button: "按钮",
  showcase: "Showcase 展示",
}

function getCategoryLabel(category: string) {
  return CATEGORY_LABELS[category] ?? category
}

function sortCategories(categories: string[]) {
  return [...categories].sort((a, b) => {
    const aRank = CATEGORY_ORDER.indexOf(a)
    const bRank = CATEGORY_ORDER.indexOf(b)
    const aOrder = aRank === -1 ? CATEGORY_ORDER.length : aRank
    const bOrder = bRank === -1 ? CATEGORY_ORDER.length : bRank
    if (aOrder !== bOrder) return aOrder - bOrder
    return a.localeCompare(b)
  })
}

function getJsonUrl(slug: string) {
  return `https://unpkg.com/@creght/creght-blocks@latest/public/r/${slug}.json`
}

function getInstallPrompt(slug: string) {
  return `Please help me install "${getJsonUrl(slug)}"`
}

export function HomePage() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState("all")
  const [query, setQuery] = useState("")
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const items = useMemo(
    () => (registryData.items as RegistryItem[]).filter((item) => demos[item.name]),
    []
  )

  const categories = useMemo(() => {
    const list = new Set<string>()
    for (const item of items) {
      for (const category of item.categories ?? []) {
        list.add(category)
      }
    }
    return ["all", ...sortCategories(Array.from(list))]
  }, [items])

  const categoryCountMap = useMemo(() => {
    const map = new Map<string, number>()
    map.set("all", items.length)
    for (const item of items) {
      for (const category of item.categories ?? []) {
        map.set(category, (map.get(category) ?? 0) + 1)
      }
    }
    return map
  }, [items])

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return items.filter((item) => {
      const inCategory =
        activeCategory === "all" || (item.categories ?? []).includes(activeCategory)
      if (!inCategory) return false
      if (!normalizedQuery) return true
      const haystack = `${item.name} ${item.title} ${item.description ?? ""}`.toLowerCase()
      return haystack.includes(normalizedQuery)
    })
  }, [activeCategory, items, query])
  const sectionTitle = activeCategory === "all" ? "All Components" : getCategoryLabel(activeCategory)

  const visibleItems = filteredItems.slice(0, visibleCount)
  const hasMore = visibleCount < filteredItems.length
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [activeCategory, query])

  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries[0]
        if (!hit?.isIntersecting) return
        setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredItems.length))
      },
      { rootMargin: "240px 0px 240px 0px" }
    )
    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [filteredItems.length, hasMore])

  useEffect(() => {
    if (!copiedSlug) return
    const timer = window.setTimeout(() => setCopiedSlug(null), 1800)
    return () => window.clearTimeout(timer)
  }, [copiedSlug])

  const copyPromptToClipboard = async (item: RegistryItem) => {
    const prompt = getInstallPrompt(item.name)
    try {
      await navigator.clipboard.writeText(prompt)
      setCopiedSlug(item.name)
    } catch {
      const textarea = document.createElement("textarea")
      textarea.value = prompt
      textarea.setAttribute("readonly", "")
      textarea.style.position = "fixed"
      textarea.style.opacity = "0"
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopiedSlug(item.name)
    }
  }

  return (
    <div className="min-h-dvh">
      <div className="w-full flex max-w-[1500px]  bg-[#f8f8f9]">
        <aside className="w-full border-zinc-200/80 bg-[#f1f1f3] p-4 md:sticky md:top-0 md:h-dvh md:w-[260px] md:self-start md:overflow-y-auto md:border-r">
          <div className="mb-10 flex items-center gap-2">
            <img
              src="https://fsu.creght.com/site/2083536173505974272/1785726413863__creght_logo.svg"
              alt="Creght Build"
              className="h-8"
            />
          </div>

          <div className="mb-3">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search"
              className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none ring-indigo-500 transition focus:border-indigo-400 focus:ring-2"
            />
          </div>

          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`mb-3 flex w-full items-center justify-between rounded-xl border px-3 py-2 text-sm transition ${activeCategory === "all"
              ? "border-indigo-500 bg-indigo-50 text-indigo-700"
              : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
              }`}
          >
            <span>All Components</span>
            <span className="text-xs text-zinc-500">{String(items.length).padStart(2, "0")}</span>
          </button>

          <div className="space-y-1">
            {categories
              .filter((category) => category !== "all")
              .map((category) => {
                const isActive = activeCategory === category
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`flex w-full items-center justify-between rounded-lg border px-2.5 py-2 text-left text-sm transition ${isActive
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-transparent text-zinc-600 hover:bg-white/70 hover:text-zinc-900"
                      }`}
                  >
                    <span className="line-clamp-1">{getCategoryLabel(category)}</span>
                    <span className={`text-xs ${isActive ? "text-indigo-500" : "text-zinc-500"}`}>
                      {String(categoryCountMap.get(category) ?? 0).padStart(2, "0")}
                    </span>
                  </button>
                )
              })}
          </div>
        </aside>

        <section className="min-w-0 flex-1 p-4 md:p-6">


          <h1 className="mb-4 text-3xl font-semibold tracking-tight text-zinc-900">{sectionTitle}</h1>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visibleItems.map((item) => (
              <article
                  key={item.name}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/blocks/${item.name}`)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      navigate(`/blocks/${item.name}`)
                    }
                  }}
                  className="group cursor-pointer overflow-hidden rounded-2xl border border-zinc-200/80 bg-white text-left shadow-[0_8px_30px_-18px_rgba(15,23,42,0.45)] transition hover:-translate-y-1 hover:shadow-[0_24px_40px_-20px_rgba(79,70,229,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-zinc-900">
                    <img
                      src={item.cover ?? "https://fsu.creght.com/site/2083536173505974272/1786356116545__creght_blocks_logo.svg"}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-zinc-950/0 transition group-hover:bg-zinc-950/45" />
                    <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          void copyPromptToClipboard(item)
                        }}
                        className="pointer-events-auto inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/95 px-3 py-1.5 text-xs font-medium text-zinc-800 shadow-sm transition hover:bg-white"
                      >
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                        {copiedSlug === item.name ? "Copied" : "Copy prompt"}
                      </button>
                      <a
                        href={`/preview/${item.name}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(event) => {
                          event.stopPropagation()
                        }}
                        className="pointer-events-auto inline-flex items-center gap-1.5 rounded-lg border border-indigo-300/80 bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-indigo-500"
                      >
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        Open preview
                      </a>
                    </div>
                  </div>
                </article>
            ))}
          </div>

          {!filteredItems.length ? (
            <div className="mt-4 rounded-2xl border border-dashed border-zinc-300 bg-white/70 p-8 text-center text-sm text-zinc-500">
              No matching sections found. Try a different category or search term.
            </div>
          ) : null}

          <div ref={sentinelRef} className="h-8" />
          {hasMore ? (
            <p className="pb-1 text-center text-xs text-zinc-500">Loading more...</p>
          ) : filteredItems.length > PAGE_SIZE ? (
            <p className="pb-1 text-center text-xs text-zinc-500">All items shown</p>
          ) : null}
        </section>
      </div>

    </div>
  )
}
