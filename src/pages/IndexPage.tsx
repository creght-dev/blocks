import registryData from "@/registry.json"

type RegistryItem = {
  name: string
  title: string
  cover?: string
  categories?: string[]
}

type TickerRow = {
  direction: "up" | "down"
  items: RegistryItem[]
  className: string
  cardClassNames: string[]
  speedClassName: string
}

const heroItems = (registryData.items as RegistryItem[]).filter(
  (item) => item.cover && item.categories?.includes("hero")
)

const TICKER_ROW_COUNT = 3
const MIN_TICKER_ITEMS = 8

function distributeItems(items: RegistryItem[], groupCount: number) {
  const groups = Array.from({ length: groupCount }, () => [] as RegistryItem[])
  items.forEach((item, index) => {
    groups[index % groupCount].push(item)
  })
  return groups.map((group) => (group.length ? group : items))
}

function repeatItems(items: RegistryItem[], minCount: number) {
  if (!items.length) return []
  const repeatCount = Math.ceil(minCount / items.length)
  return Array.from({ length: repeatCount }).flatMap(() => items)
}

const heroGroups = distributeItems(heroItems, TICKER_ROW_COUNT)

const tickerRows: TickerRow[] = [
  {
    direction: "up",
    items: heroGroups[0] ?? heroItems,
    className: "-translate-y-[8vh]",
    cardClassNames: ["opacity-90", "", "", "opacity-90"],
    speedClassName: "ticker-speed-slow",
  },
  {
    direction: "down",
    items: heroGroups[1] ?? heroItems,
    className: "translate-y-[4vh]",
    cardClassNames: ["", "", "", "opacity-90"],
    speedClassName: "ticker-speed-medium",
  },
  {
    direction: "up",
    items: heroGroups[2] ?? heroItems,
    className: "-translate-y-[2vh]",
    cardClassNames: ["", "", "opacity-90", ""],
    speedClassName: "ticker-speed-fast",
  },
]

function HeroTickerRow({ row, index }: { row: TickerRow; index: number }) {
  const baseItems = repeatItems(row.items, MIN_TICKER_ITEMS)
  const duplicatedItems = [...baseItems, ...baseItems]
  const directionClassName =
    row.direction === "down" ? "ticker-row-down" : "ticker-row-up"

  return (
    <section
      aria-label={`Hero screenshot ticker ${index + 1}`}
      className={`ticker-row pointer-events-auto ${directionClassName} ${row.speedClassName} ${row.className}`}
    >
      <div className="ticker-track flex h-max flex-col items-center gap-4 px-2 sm:gap-5 md:gap-7">
        {duplicatedItems.map((item, itemIndex) => (
          <a
            key={`${item.name}-${itemIndex}`}
            href={`/blocks/${item.name}`}
            className={`group block w-[62vw] max-w-[500px] min-w-[240px] overflow-hidden outline-none ring-white/0 transition duration-300 hover:z-10 hover:scale-[1.035] hover:ring-2 focus-visible:z-10 focus-visible:scale-[1.035] focus-visible:ring-2 sm:w-[38vw] lg:w-[29vw] ${row.cardClassNames[itemIndex % row.cardClassNames.length]}`}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={item.cover}
                alt={`${item.title} screenshot`}
                loading={itemIndex < baseItems.length ? "eager" : "lazy"}
                className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-[1.04]"
              />
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}

export function IndexPage() {
  return (
    <main className="relative h-dvh overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.12),transparent_34%),linear-gradient(180deg,rgba(0,0,0,0.2),#000_76%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-36 bg-gradient-to-b from-black via-black/86 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-36 bg-gradient-to-t from-black via-black/82 to-transparent" />

      <header className="absolute inset-x-0 top-0 z-30 flex justify-end px-5 py-5 sm:px-8 lg:px-12">
        <a
          href="/"
          className="hidden rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-medium text-white/82 backdrop-blur transition hover:border-white/24 hover:bg-white/14 hover:text-white sm:inline-flex"
        >
          View Library
        </a>
      </header>

      <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 w-[150vw] -translate-x-1/2 -translate-y-1/2 rotate-[45deg] scale-[1.12]">
        <div className="flex h-[160vh] w-full items-center justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-5">
          {tickerRows.map((row, index) => (
            <HeroTickerRow key={`${row.direction}-${index}`} row={row} index={index} />
          ))}
        </div>
      </div>
    </main>
  )
}
