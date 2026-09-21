import { useEffect, useState } from "react"
import { ArrowLeft, Check, Copy, ExternalLink } from "lucide-react"
import { Link, useParams } from "react-router-dom"

import registryData from "@/registry.catalog.json"
import { PreviewDeviceSwitcher, type PreviewDevice } from "@/src/components/PreviewDeviceSwitcher"
import { PreviewFrame } from "@/src/components/PreviewFrame"
import { demos } from "@/src/lib/preview-demos"

type RegistryItem = {
  name: string
  title: string
  description?: string
  cover?: string
  categories?: string[]
  dependencies?: string[]
  files?: Array<{ path: string; type: string }>
}

function getJsonUrl(slug: string) {
  return `https://unpkg.com/@creght/creght-blocks@latest/public/r/${slug}.json`
}

function getInstallPrompt(slug: string) {
  return `Please help me install "${getJsonUrl(slug)}"`
}

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value)
  } catch {
    const textarea = document.createElement("textarea")
    textarea.value = value
    textarea.setAttribute("readonly", "")
    textarea.style.position = "fixed"
    textarea.style.opacity = "0"
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand("copy")
    document.body.removeChild(textarea)
  }
}

export function BlockDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>("desktop")
  const [copied, setCopied] = useState(false)
  const item = (registryData.items as RegistryItem[]).find(
    (entry) => entry.name === slug && Boolean(demos[entry.name])
  )

  useEffect(() => {
    if (!item) return
    document.title = `${item.title} — Creght Blocks`
    return () => {
      document.title = "Creght Block Registry"
    }
  }, [item])

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 1800)
    return () => window.clearTimeout(timer)
  }, [copied])

  if (!item || !slug) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[#f8f8f9] px-6 text-zinc-900">
        <div className="max-w-md text-center">
          <p className="text-sm font-medium text-indigo-600">404</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Section not found</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            This section may have been moved, renamed, or is not available for preview yet.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to library
          </Link>
        </div>
      </main>
    )
  }

  const installPrompt = getInstallPrompt(item.name)

  const handleCopyPrompt = async () => {
    await copyText(installPrompt)
    setCopied(true)
  }

  return (
    <div className="min-h-dvh bg-[#f8f8f9] font-sans text-zinc-900 antialiased">
      <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-[#f8f8f9]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between gap-4 px-4 md:px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg text-sm font-medium text-zinc-600 transition hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All components
          </Link>
          <img
            src="https://fsu.creght.com/site/2083536173505974272/1785726413863__creght_logo.svg"
            alt="Creght Build"
            className="h-7"
          />
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-4 py-8 md:px-6 md:py-12">
        <section className="grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="min-w-0">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {item.categories?.map((category) => (
                <span
                  key={category}
                  className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium capitalize text-zinc-600"
                >
                  {category}
                </span>
              ))}
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                Free
              </span>
            </div>
            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-zinc-950 md:text-5xl">
              {item.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
              {item.description ?? "A production-ready section for your next Creght project."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 lg:justify-end">
            <button
              type="button"
              onClick={() => void handleCopyPrompt()}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500"
            >
              {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
              {copied ? "Prompt copied" : "Copy install prompt"}
            </button>
            <a
              href={`/preview/${item.name}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50"
            >
              Full preview
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)]">
          <div className="flex min-h-14 flex-wrap items-center justify-between gap-3 border-b border-zinc-200 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-zinc-900">Live preview</p>
              <p className="text-xs text-zinc-500">Switch devices to check the responsive layout.</p>
            </div>
            <PreviewDeviceSwitcher value={previewDevice} onChange={setPreviewDevice} />
          </div>
          <div className="h-[68vh] min-h-[520px] bg-zinc-100 p-3 sm:p-5 md:min-h-[620px]">
            <PreviewFrame slug={item.name} device={previewDevice} />
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 md:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Install prompt</p>
            <div className="mt-4 flex items-start gap-3 rounded-xl bg-zinc-950 p-4 text-zinc-100">
              <code className="min-w-0 flex-1 break-all text-xs leading-6 sm:text-sm">{installPrompt}</code>
              <button
                type="button"
                onClick={() => void handleCopyPrompt()}
                aria-label="Copy install prompt"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/15 text-zinc-300 transition hover:bg-white/10 hover:text-white"
              >
                {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
              </button>
            </div>
            <p className="mt-3 text-xs leading-5 text-zinc-500">
              Paste this prompt into your coding agent to add the section and its dependencies to your project.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 md:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Details</p>
            <dl className="mt-4 space-y-4 text-sm">
              <div className="flex items-start justify-between gap-4 border-b border-zinc-100 pb-4">
                <dt className="text-zinc-500">Slug</dt>
                <dd className="text-right font-medium text-zinc-900">{item.name}</dd>
              </div>
              <div className="flex items-start justify-between gap-4 border-b border-zinc-100 pb-4">
                <dt className="text-zinc-500">Files</dt>
                <dd className="text-right font-medium text-zinc-900">{item.files?.length ?? 0}</dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-zinc-500">Dependencies</dt>
                <dd className="max-w-[65%] text-right font-medium text-zinc-900">
                  {item.dependencies?.length ? item.dependencies.join(", ") : "None"}
                </dd>
              </div>
            </dl>
          </div>
        </section>
      </main>
    </div>
  )
}
