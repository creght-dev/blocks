import {
  Braces,
  Check,
  Cloud,
  Code2,
  Database,
  FormInput,
  Globe2,
  HardDriveUpload,
  Layers3,
  Lock,
  Rocket,
  ServerCog,
  ShieldCheck,
  SquareTerminal,
  Table2,
  Workflow,
  Zap,
} from "lucide-react"

const backendCapabilities = [
  { label: "Backend functions", icon: Workflow },
  { label: "JSON data tables", icon: Table2 },
  { label: "CMS & dynamic pages", icon: Database },
  { label: "Forms & uploads", icon: FormInput },
]

const collectionRows = [
  { name: "Customer stories", type: "Dynamic pages", entries: "24", status: "Published" },
  { name: "Templates", type: "Collection", entries: "128", status: "Synced" },
  { name: "Resources", type: "Collection", entries: "36", status: "Published" },
]

const cliCommands = [
  { command: "creght pull", result: "Site files pulled to ./creght-site" },
  { command: "creght sync", result: "Watching local changes" },
  { command: "creght publish", result: "Production deployment is live" },
]

function BackendVisual() {
  return (
    <div className="relative min-h-[500px] overflow-hidden bg-[#080c14] p-4 sm:p-7 lg:min-h-[560px] lg:p-10">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(48,112,255,0.18),transparent_34%)]"
        aria-hidden="true"
      />
      <div className="relative h-full overflow-hidden rounded-2xl border border-[#23345a] bg-[#080b11] shadow-[0_28px_90px_rgba(18,67,174,0.2)]">
        <div className="flex h-12 items-center gap-2 border-b border-white/10 px-4">
          <span className="size-2 rounded-full bg-white/18" />
          <span className="size-2 rounded-full bg-white/12" />
          <span className="size-2 rounded-full bg-white/8" />
          <span className="ml-3 text-[10px] font-medium text-white/38">creght / project / data</span>
          <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] text-[#84e0b8]">
            <span className="size-1.5 rounded-full bg-[#4fd09b] shadow-[0_0_10px_rgba(79,208,155,0.8)]" />
            Connected
          </span>
        </div>

        <div className="grid min-h-[405px] grid-cols-[74px_1fr] sm:grid-cols-[156px_1fr]">
          <aside className="border-r border-white/10 p-3 sm:p-4" aria-label="Backend navigation preview">
            <div className="flex h-9 items-center gap-2 rounded-lg bg-[#356cff]/12 px-2 text-[#91b1ff] sm:px-3">
              <Database size={15} />
              <span className="hidden text-[11px] font-medium sm:inline">Collections</span>
            </div>
            <div className="mt-2 flex h-9 items-center gap-2 px-2 text-white/30 sm:px-3">
              <Workflow size={15} />
              <span className="hidden text-[11px] sm:inline">Functions</span>
            </div>
            <div className="mt-2 flex h-9 items-center gap-2 px-2 text-white/30 sm:px-3">
              <Table2 size={15} />
              <span className="hidden text-[11px] sm:inline">Data tables</span>
            </div>
            <div className="mt-2 flex h-9 items-center gap-2 px-2 text-white/30 sm:px-3">
              <FormInput size={15} />
              <span className="hidden text-[11px] sm:inline">Form entries</span>
            </div>
            <div className="mt-2 flex h-9 items-center gap-2 px-2 text-white/30 sm:px-3">
              <HardDriveUpload size={15} />
              <span className="hidden text-[11px] sm:inline">Assets</span>
            </div>
          </aside>

          <div className="min-w-0 p-4 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[9px] font-semibold tracking-[0.16em] text-[#729cff]">MANAGED BACKEND</span>
                <h4 className="mt-2 text-base font-medium text-white/90 sm:text-lg">Content collections</h4>
              </div>
              <span className="hidden items-center gap-1.5 rounded-lg border border-[#3868c7]/45 bg-[#17336b]/25 px-3 py-2 text-[10px] font-medium text-[#a8c2ff] sm:inline-flex">
                <Zap size={12} /> Live data
              </span>
            </div>

            <div className="mt-6 overflow-hidden rounded-xl border border-white/10">
              <div className="grid grid-cols-[1.4fr_0.9fr_52px] border-b border-white/10 bg-white/[0.025] px-3 py-2.5 text-[8px] font-medium uppercase tracking-[0.08em] text-white/26 sm:grid-cols-[1.4fr_1fr_60px_80px] sm:px-4">
                <span>Name</span>
                <span>Type</span>
                <span>Items</span>
                <span className="hidden sm:block">Status</span>
              </div>
              {collectionRows.map((row) => (
                <div
                  className="grid min-h-16 grid-cols-[1.4fr_0.9fr_52px] items-center border-b border-white/[0.07] px-3 text-[10px] last:border-b-0 sm:grid-cols-[1.4fr_1fr_60px_80px] sm:px-4 sm:text-[11px]"
                  key={row.name}
                >
                  <span className="flex min-w-0 items-center gap-2 font-medium text-white/72">
                    <span className="grid size-7 shrink-0 place-items-center rounded-md border border-[#31528d]/60 bg-[#152441] text-[#78a2fb]">
                      <Layers3 size={13} />
                    </span>
                    <span className="truncate">{row.name}</span>
                  </span>
                  <span className="truncate text-white/34">{row.type}</span>
                  <span className="font-mono text-white/48">{row.entries}</span>
                  <span className="hidden items-center gap-1.5 text-[#72d6aa] sm:flex">
                    <Check size={11} />
                    {row.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.025] p-3 sm:p-4">
                <div className="flex items-center gap-2 text-[10px] text-white/40">
                  <Workflow size={13} className="text-[#7ca5ff]" /> Backend functions
                </div>
                <div className="mt-3 truncate font-mono text-[9px] text-white/62 sm:text-[10px]">POST /func/contact</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.025] p-3 sm:p-4">
                <div className="flex items-center gap-2 text-[10px] text-white/40">
                  <ServerCog size={13} className="text-[#7ca5ff]" /> Server rendering
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-[9px] text-[#72d6aa] sm:text-[10px]">
                  <span className="size-1.5 rounded-full bg-[#4fd09b]" /> Ready
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CliVisual() {
  return (
    <div className="relative min-h-[440px] overflow-hidden bg-[#05070b] p-4 sm:p-8 lg:p-10">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_90%,rgba(55,105,255,0.17),transparent_44%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-[650px] overflow-hidden rounded-2xl border border-[#263454] bg-[#05070a] shadow-[0_28px_80px_rgba(0,0,0,0.45)]">
        <div className="flex h-12 items-center border-b border-white/10 px-4">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="size-2 rounded-full bg-[#ff6a63]/70" />
            <span className="size-2 rounded-full bg-[#f5bd4f]/70" />
            <span className="size-2 rounded-full bg-[#4dcc70]/70" />
          </div>
          <span className="mx-auto pr-10 font-mono text-[10px] text-white/30">~/projects/creght-site</span>
        </div>
        <div className="min-h-[330px] space-y-7 p-5 font-mono text-[11px] sm:p-7 sm:text-xs">
          {cliCommands.map((item, index) => (
            <div key={item.command}>
              <p className="flex items-center gap-2 text-white/78">
                <span className="text-[#75a0ff]">$</span>
                <span>{item.command}</span>
                {index === 1 && (
                  <span className="h-4 w-1.5 animate-pulse bg-[#6f9cff] motion-reduce:animate-none" aria-hidden="true" />
                )}
              </p>
              <p className="mt-2 flex items-center gap-2 pl-4 text-[10px] text-white/30 sm:text-[11px]">
                <Check size={12} className="text-[#56c997]" />
                {item.result}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PublishingVisual() {
  const steps = [
    { label: "Preview", icon: Cloud },
    { label: "Build", icon: Braces },
    { label: "Live", icon: Globe2 },
  ]

  return (
    <div className="mt-8 rounded-xl border border-white/10 bg-[#070a10] p-4 sm:p-5">
      <div className="grid grid-cols-[1fr_24px_1fr_24px_1fr] items-center">
        {steps.map(({ label, icon: Icon }, index) => (
          <div className="contents" key={label}>
            <div className="flex min-w-0 flex-col items-center gap-2 rounded-lg border border-[#284778]/65 bg-[#101a2d] px-2 py-4 text-[#8eb1ff]">
              <Icon size={17} />
              <span className="text-[9px] font-medium text-white/55 sm:text-[10px]">{label}</span>
            </div>
            {index < steps.length - 1 && <span className="h-px bg-[#315a9e]" aria-hidden="true" />}
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[9px] text-white/32 sm:text-[10px]">
        <span className="flex items-center gap-1.5">
          <ShieldCheck size={12} className="text-[#68c99d]" /> SSL active
        </span>
        <span className="flex items-center gap-1.5">
          <Globe2 size={12} className="text-[#7ca5ff]" /> Global CDN
        </span>
        <span className="flex items-center gap-1.5">
          <Rocket size={12} className="text-[#c393ff]" /> Instant rollback
        </span>
      </div>
    </div>
  )
}

function CodeVisual() {
  return (
    <div className="mt-8 overflow-hidden rounded-xl border border-white/10 bg-[#07090e] font-mono text-[10px] sm:text-[11px]">
      <div className="flex h-10 items-center gap-2 border-b border-white/10 px-4 text-white/30">
        <Code2 size={13} className="text-[#8eacff]" />
        CustomerStories.tsx
      </div>
      <div className="overflow-x-auto p-4 leading-6 text-white/46 sm:p-5">
        <div>
          <span className="text-[#bb86fc]">export async function</span>{" "}
          <span className="text-[#d2a8ff]">getServerSideProps</span>() {"{"}
        </div>
        <div className="mt-2 pl-4">
          <span className="text-[#bb86fc]">const</span> stories = <span className="text-[#d2a8ff]">await</span>{" "}
          <span className="text-[#8ab4f8]">content.list</span>(
          <span className="text-[#81c995]">&quot;stories&quot;</span>)
        </div>
        <div className="pl-4">
          <span className="text-[#bb86fc]">return</span> {"{ props: { stories } }"}
        </div>
        <div>{"}"}</div>
      </div>
    </div>
  )
}

export default function Features02({ className }: { className?: string }) {
  return (
    <section
      id="features"
      className={`w-full border-b border-white/10 bg-[#040506] py-28 text-white sm:py-36 ${className ?? ""}`}
      aria-labelledby="features-02-title"
    >
      <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-8">
        <header className="max-w-[940px]">
          <p className="mb-5 flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-white/40">
            <Lock size={14} /> CORE CAPABILITIES
          </p>
          <h2 id="features-02-title" className="text-[42px] leading-[0.98] tracking-normal sm:text-[58px] lg:text-[78px]">
            Beyond the canvas,
            <span className="block text-white/34">the whole website stack.</span>
          </h2>
          <p className="mt-7 max-w-[730px] text-base leading-7 text-white/50">
            Creght brings managed backend services, local developer workflows, extensible React code, and production
            publishing into one connected platform.
          </p>
        </header>

        <div className="mt-16 overflow-hidden rounded-[24px] border border-white/10 bg-[#080a0e] shadow-[0_40px_140px_rgba(20,61,145,0.12)] sm:mt-20">
          <article className="grid border-b border-white/10 lg:grid-cols-[0.78fr_1.22fr]">
            <div className="flex flex-col justify-center p-7 sm:p-10 lg:min-h-[560px] lg:p-12">
              <span className="text-[11px] font-medium text-[#78a2ff]">01 / MANAGED BACKEND</span>
              <h3 className="mt-6 max-w-[440px] text-[32px] leading-[1.04] tracking-normal sm:text-[40px] lg:text-[48px]">
                Your backend, built in.
              </h3>
              <p className="mt-5 max-w-[430px] text-[15px] leading-7 text-white/46">
                Run backend functions, store application data, model structured content, and collect form submissions
                without assembling a separate backend stack.
              </p>
              <div className="mt-9 grid grid-cols-2 gap-x-5 gap-y-4">
                {backendCapabilities.map(({ label, icon: Icon }) => (
                  <span className="flex items-center gap-2 text-[11px] text-white/58 sm:text-xs" key={label}>
                    <Icon size={14} className="shrink-0 text-[#7fa7ff]" />
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <BackendVisual />
          </article>

          <article className="grid border-b border-white/10 lg:grid-cols-[1.22fr_0.78fr]">
            <CliVisual />
            <div className="flex flex-col justify-center border-t border-white/10 p-7 sm:p-10 lg:min-h-[440px] lg:border-l lg:border-t-0 lg:p-12">
              <span className="flex items-center gap-2 text-[11px] font-medium text-[#78a2ff]">
                <SquareTerminal size={14} /> 02 / CREGHT CLI
              </span>
              <h3 className="mt-6 max-w-[390px] text-[32px] leading-[1.04] tracking-normal sm:text-[40px] lg:text-[48px]">
                Work locally. Stay connected.
              </h3>
              <p className="mt-5 max-w-[420px] text-[15px] leading-7 text-white/46">
                Pull the site into your preferred editor, sync changes in real time, manage assets and data, then preview
                or publish from the terminal.
              </p>
              <div className="mt-8 flex flex-wrap gap-2 font-mono text-[10px] text-white/46">
                {["pull", "push", "sync", "preview", "publish"].map((command) => (
                  <span className="rounded-md border border-white/10 bg-white/[0.035] px-2.5 py-1.5" key={command}>
                    {command}
                  </span>
                ))}
              </div>
            </div>
          </article>

          <div className="grid lg:grid-cols-2">
            <article className="border-b border-white/10 p-7 sm:p-10 lg:min-h-[470px] lg:border-b-0 lg:border-r lg:p-12">
              <span className="text-[11px] font-medium text-[#78a2ff]">03 / PRODUCTION PUBLISHING</span>
              <h3 className="mt-6 text-[30px] leading-[1.06] tracking-normal sm:text-[36px] lg:text-[42px]">
                From preview to production.
              </h3>
              <p className="mt-4 max-w-[480px] text-[15px] leading-7 text-white/46">
                Ship with custom domains, managed SSL, global delivery, SEO metadata, and versioned publishing already
                connected.
              </p>
              <PublishingVisual />
            </article>

            <article className="p-7 sm:p-10 lg:min-h-[470px] lg:p-12">
              <span className="text-[11px] font-medium text-[#78a2ff]">04 / EXTENSIBLE SITE CODE</span>
              <h3 className="mt-6 text-[30px] leading-[1.06] tracking-normal sm:text-[36px] lg:text-[42px]">
                Visual when you want it. Code when you need it.
              </h3>
              <p className="mt-4 max-w-[500px] text-[15px] leading-7 text-white/46">
                Extend every project with React components, typed content models, server-rendered data, and custom
                integrations.
              </p>
              <CodeVisual />
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
