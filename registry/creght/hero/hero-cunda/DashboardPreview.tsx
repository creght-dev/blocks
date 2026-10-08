import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  CircleDashed,
  CreditCard,
  ChevronDown,
  LayoutDashboard,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Settings2,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react"

const workspaceItems = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Analytics", icon: BarChart3, active: false },
  { label: "Customers", icon: Users, active: false },
  { label: "Transactions", icon: CreditCard, active: false },
  { label: "Messages", icon: MessageSquare, active: false },
]

const metrics = [
  { label: "Active users", value: "34.9K", delta: "+12%", icon: Users, positive: true },
  { label: "Net income", value: "$193,000", delta: "+35%", icon: Wallet, positive: true },
  { label: "Total return", value: "$32,000", delta: "−2.4%", icon: Activity, positive: false },
]

const revenueBars = [
  "h-10",
  "h-16",
  "h-12",
  "h-20",
  "h-14",
  "h-24",
  "h-18",
  "h-28",
  "h-20",
  "h-32",
  "h-24",
  "h-36",
]

const transactions = [
  { name: "Premium T-Shirt", date: "Sep 21, 2026", amount: "$2,450", mark: "P" },
  { name: "Studio subscription", date: "Sep 20, 2026", amount: "$890", mark: "S" },
  { name: "Quarterly services", date: "Sep 19, 2026", amount: "$4,200", mark: "Q" },
]

export function DashboardPreview() {
  return (
    <div className="cunda-dashboard mx-auto w-full max-w-[1120px] overflow-hidden rounded-[20px] border border-white/20 bg-[#0e1117] text-white shadow-[0_36px_100px_rgba(7,17,43,.42)]">
      <div className="flex h-12 items-center justify-between gap-3 border-b border-white/[0.09] px-3.5 sm:h-[54px] sm:px-5">
        <div className="flex min-w-0 items-center gap-2.5">
          <CircleDashed size={19} className="shrink-0 text-white" />
          <span className="hidden text-[12px] font-semibold sm:block">Cunda.</span>
          <span className="mx-1 hidden h-4 w-px bg-white/15 sm:block" />
          <span className="truncate text-[10px] text-white/45 sm:text-[11px]">
            Workspace / Overview
          </span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="hidden items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-[9px] text-white/55 sm:flex">
            <Search size={11} />
            Search anything...
          </span>
          <button
            className="grid size-7 place-items-center rounded-lg border border-white/10 text-white/60"
            aria-label="Notifications"
            type="button"
          >
            <Bell size={13} />
          </button>
          <button
            className="grid size-7 place-items-center rounded-lg bg-[#e8f1ff] text-[#1c4fa8]"
            aria-label="Create new item"
            type="button"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
      <div className="grid min-h-[430px] grid-cols-1 md:grid-cols-[145px_minmax(0,1fr)] xl:grid-cols-[168px_minmax(0,1fr)_218px]">
        <aside className="hidden border-r border-white/[0.08] bg-[#11151c] p-3 md:block">
          <div className="mb-5 flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.025] px-2.5 py-2">
            <span className="grid size-6 place-items-center rounded-md bg-[#e8f1ff] text-[10px] font-bold text-[#1c4fa8]">
              C
            </span>
            <span className="text-[10px] text-white/72">Cunda Studio</span>
            <ChevronDown size={12} className="ml-auto text-white/35" />
          </div>
          <p className="mb-2 px-2 text-[8px] font-semibold uppercase tracking-[.16em] text-white/30">
            Workspace
          </p>
          <div className="space-y-1">
            {workspaceItems.map(({ label, icon: Icon, active }) => (
              <div
                key={label}
                className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[10px] ${active ? "bg-[#142b55] text-[#c5d8ff]" : "text-white/45"}`}
              >
                <Icon size={13} />
                {label}
              </div>
            ))}
          </div>
          <div className="mt-7 border-t border-white/[0.08] pt-4">
            <p className="mb-2 px-2 text-[8px] font-semibold uppercase tracking-[.16em] text-white/30">
              Manage
            </p>
            <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[10px] text-white/45">
              <Settings2 size={13} />
              Settings
            </div>
          </div>
        </aside>
        <main className="min-w-0 p-3.5 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[9px] text-[#78a2ff]">Tuesday, September 22, 2026</p>
              <h3 className="mt-1 text-[17px] font-medium tracking-[-.035em] sm:text-[20px]">
                Good morning, Alex
              </h3>
              <p className="mt-1 text-[9px] text-white/38 sm:text-[10px]">
                Here’s what’s happening with your business.
              </p>
            </div>
            <button
              type="button"
              className="hidden items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-2 text-[9px] text-white/55 sm:flex"
            >
              Last 30 days <ChevronDown size={11} />
            </button>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-5 sm:gap-3">
            {metrics.map(({ label, value, delta, icon: Icon, positive }) => (
              <article
                key={label}
                className="rounded-xl border border-white/[0.09] bg-[#151a21] p-2.5 sm:p-3.5"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="truncate text-[8px] text-white/48 sm:text-[9px]">{label}</span>
                  <Icon size={12} className="shrink-0 text-[#78a2ff]" />
                </div>
                <p className="mt-2 truncate text-[15px] font-medium tracking-[-.04em] sm:text-[21px]">
                  {value}
                </p>
                <span
                  className={`mt-1 inline-flex items-center gap-1 text-[8px] ${positive ? "text-[#7da4ff]" : "text-[#e48686]"}`}
                >
                  {positive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                  {delta} <span className="hidden text-white/30 sm:inline">vs last month</span>
                </span>
              </article>
            ))}
          </div>
          <div className="mt-3 grid gap-3 lg:grid-cols-[1.2fr_.8fr]">
            <article className="rounded-xl border border-white/[0.09] bg-[#151a21] p-3.5 sm:p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-medium text-white/80">Revenue overview</p>
                  <p className="mt-1 text-[8px] text-white/35">Income and expenses over time</p>
                </div>
                <MoreHorizontal size={15} className="text-white/40" />
              </div>
              <div className="mt-3 flex h-[104px] items-end gap-1.5 border-b border-white/[0.08] px-1 sm:gap-2">
                {revenueBars.map((height, index) => (
                  <div key={index} className="flex h-full flex-1 items-end">
                    <span
                      className={`block w-full rounded-t-[3px] ${height} ${index > 8 ? "bg-[#5a8cff]" : "bg-[#294f91]"} opacity-90`}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-between text-[7px] text-white/30">
                <span>Jan</span>
                <span>Mar</span>
                <span>May</span>
                <span>Jul</span>
                <span>Sep</span>
                <span>Nov</span>
              </div>
            </article>
            <article className="rounded-xl border border-white/[0.09] bg-[#151a21] p-3.5 sm:p-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-medium text-white/80">Project progress</p>
                <MoreHorizontal size={15} className="text-white/40" />
              </div>
              <div className="mt-4 space-y-3">
                {[
                  ["Website redesign", "78%", "w-[78%]"],
                  ["Q3 campaign", "56%", "w-[56%]"],
                  ["New product launch", "34%", "w-[34%]"],
                ].map(([name, pct, width]) => (
                  <div key={name}>
                    <div className="mb-1.5 flex justify-between text-[8px]">
                      <span className="text-white/58">{name}</span>
                      <span className="text-white/35">{pct}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.08]">
                      <div className={`h-full rounded-full bg-[#5a8cff] ${width}`} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2 border-t border-white/[0.08] pt-3 text-[8px] text-white/35">
                <span className="flex -space-x-1.5">
                  <i className="size-4 rounded-full border border-[#151a21] bg-[#7798ef]" />
                  <i className="size-4 rounded-full border border-[#151a21] bg-[#9fc4ff]" />
                  <i className="size-4 rounded-full border border-[#151a21] bg-[#5d7ed8]" />
                </span>{" "}
                8 team members
              </div>
            </article>
          </div>
        </main>
        <aside className="hidden border-l border-white/[0.08] bg-[#11151c] p-3.5 xl:block">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-medium text-white/80">Recent activity</p>
            <MoreHorizontal size={14} className="text-white/35" />
          </div>
          <div className="mt-4 space-y-3.5">
            {transactions.map((item) => (
              <div key={item.name} className="flex gap-2.5">
                <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#162a4e] text-[9px] font-semibold text-[#b4caff]">
                  {item.mark}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[9px] text-white/72">{item.name}</p>
                  <p className="mt-1 text-[8px] text-white/32">{item.date}</p>
                  <p className="mt-1 text-[9px] text-white/60">{item.amount}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-[#315eaa]/45 bg-[#112548] p-3">
            <div className="flex items-center gap-1.5 text-[#b7cbff]">
              <Sparkles size={12} />
              <span className="text-[9px] font-medium">Cunda insight</span>
            </div>
            <p className="mt-2 text-[8px] leading-4 text-white/48">
              Project costs are trending 8% under budget this month.
            </p>
          </div>
        </aside>
      </div>
      <div className="flex items-center justify-between border-t border-white/[0.08] px-3.5 py-2 text-[8px] text-white/32 sm:px-5">
        <span className="flex items-center gap-1.5">
          <i className="size-1.5 rounded-full bg-[#5a8cff]" />
          Workspace is up to date
        </span>
        <span>Demo workspace · sample data</span>
      </div>
    </div>
  )
}
