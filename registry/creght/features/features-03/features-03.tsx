import { useRef, useState, type WheelEvent } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  BadgeCheck,
  Building2,
  Code2,
  PanelsTopLeft,
  Ship,
  ShoppingBag,
  Sparkles,
  type LucideIcon,
} from "lucide-react"

type FeatureItem = {
  id: string
  label: string
  eyebrow: string
  title: string
  description: string
  icon: LucideIcon
  image: string
  imagePosition?: string
  backdrop: string
}

const featureItems: FeatureItem[] = [
  {
    id: "editorial",
    label: "Editorial",
    eyebrow: "PERSONAL STORIES",
    title: "Make every point of view feel cinematic.",
    description: "Shape thoughtful portfolios, journals, and personal sites around your strongest visual narrative.",
    icon: Sparkles,
    image:
      "https://fsu.creght.com/site/2083536173505974272/1787295541535__showcase_infinite_canvas_generated_initial_blue.webp",
    backdrop:
      "bg-[radial-gradient(circle_at_18%_44%,rgba(78,92,126,0.42),transparent_30%),radial-gradient(circle_at_76%_24%,rgba(71,112,126,0.3),transparent_34%),linear-gradient(135deg,#090b12_0%,#141824_50%,#0b0d13_100%)]",
  },
  {
    id: "brand",
    label: "Brand sites",
    eyebrow: "BRAND EXPERIENCES",
    title: "Turn a bold identity into a memorable world.",
    description: "Pair expressive art direction with clear storytelling for launches, campaigns, and brand moments.",
    icon: BadgeCheck,
    image:
      "https://fsu.creght.com/site/2083536173505974272/1787295541998__showcase_3d_05.jpg",
    backdrop:
      "bg-[radial-gradient(circle_at_22%_45%,rgba(112,76,154,0.4),transparent_32%),radial-gradient(circle_at_78%_24%,rgba(195,104,85,0.28),transparent_35%),linear-gradient(135deg,#100b17_0%,#21172a_52%,#0c0b10_100%)]",
  },
  {
    id: "corporate",
    label: "Company",
    eyebrow: "COMPANY WEBSITES",
    title: "Build trust before the first conversation.",
    description: "Present your team, work, and expertise through an editorial experience designed for credibility.",
    icon: Building2,
    image:
      "https://fsu.creght.com/site/2083536173505974272/1787295543209__showcase_3d_03.jpg",
    backdrop:
      "bg-[radial-gradient(circle_at_18%_45%,rgba(48,66,96,0.5),transparent_34%),radial-gradient(circle_at_76%_28%,rgba(200,158,76,0.2),transparent_33%),linear-gradient(135deg,#08111f_0%,#182339_54%,#090d16_100%)]",
  },
  {
    id: "global",
    label: "Global",
    eyebrow: "GLOBAL LAUNCHES",
    title: "Speak clearly to audiences everywhere.",
    description: "Create focused multilingual experiences that carry your story confidently across markets.",
    icon: Ship,
    image:
      "https://fsu.creght.com/site/2083536173505974272/1787295543663__showcase_3d_08.jpg",
    backdrop:
      "bg-[radial-gradient(circle_at_21%_42%,rgba(42,125,136,0.38),transparent_32%),radial-gradient(circle_at_78%_31%,rgba(199,88,48,0.24),transparent_34%),linear-gradient(135deg,#071117_0%,#142931_50%,#0b0d10_100%)]",
  },
  {
    id: "commerce",
    label: "Commerce",
    eyebrow: "COMMERCE EXPERIENCES",
    title: "Give every product room to be desired.",
    description: "Blend tactile imagery, considered details, and frictionless discovery into a modern storefront.",
    icon: ShoppingBag,
    image:
      "https://fsu.creght.com/site/2083536173505974272/1787295543104__showcase_3d_01.jpg",
    imagePosition: "object-center",
    backdrop:
      "bg-[radial-gradient(circle_at_20%_46%,rgba(186,112,62,0.38),transparent_31%),radial-gradient(circle_at_78%_26%,rgba(229,184,114,0.22),transparent_34%),linear-gradient(135deg,#130d0b_0%,#271815_52%,#0d0c0b_100%)]",
  },
  {
    id: "tools",
    label: "Digital tools",
    eyebrow: "DIGITAL PRODUCTS",
    title: "Make powerful software feel effortless.",
    description: "Explain complex products with simple flows, sharp hierarchy, and just enough personality.",
    icon: Code2,
    image:
      "https://fsu.creght.com/site/2083536173505974272/1787295545390__showcase_3d_02.jpg",
    backdrop:
      "bg-[radial-gradient(circle_at_20%_44%,rgba(41,133,119,0.38),transparent_31%),radial-gradient(circle_at_78%_26%,rgba(70,97,145,0.26),transparent_34%),linear-gradient(135deg,#061114_0%,#112526_52%,#080d11_100%)]",
  },
  {
    id: "platforms",
    label: "Platforms",
    eyebrow: "CONNECTED PLATFORMS",
    title: "Bring every workflow into one clear view.",
    description: "Design focused dashboards and internal platforms that help teams move with confidence.",
    icon: PanelsTopLeft,
    image:
      "https://fsu.creght.com/site/2083536173505974272/1787295543005__showcase_3d_07.jpeg",
    backdrop:
      "bg-[radial-gradient(circle_at_20%_44%,rgba(55,91,142,0.4),transparent_33%),radial-gradient(circle_at_78%_25%,rgba(91,118,151,0.24),transparent_34%),linear-gradient(135deg,#08101b_0%,#14233b_52%,#080b10_100%)]",
  },
]

const visibleOffsets = [-2, -1, 0, 1, 2]
const offsetY = [-196, -98, 0, 98, 196]

function getWrappedIndex(step: number) {
  return (step % featureItems.length + featureItems.length) % featureItems.length
}

export default function Features03({ className = "" }: { className?: string }) {
  const [activeStep, setActiveStep] = useState(2)
  const wheelLock = useRef<ReturnType<typeof setTimeout> | null>(null)
  const activeItem = featureItems[getWrappedIndex(activeStep)]

  const handleWheel = (event: WheelEvent<HTMLElement>) => {
    if (Math.abs(event.deltaY) < 18 || wheelLock.current) return
    setActiveStep((current) => current + (event.deltaY > 0 ? 1 : -1))
    wheelLock.current = setTimeout(() => {
      wheelLock.current = null
    }, 420)
  }

  return (
    <section
      className={`relative isolate min-h-dvh w-full overflow-hidden bg-[#090b10] text-white lg:min-h-[760px] ${className}`}
      aria-label="Website experience showcase"
      onWheel={handleWheel}
      onKeyDown={(event) => {
        if (event.key === "ArrowDown" || event.key === "ArrowRight") {
          event.preventDefault()
          setActiveStep((current) => current + 1)
        }
        if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
          event.preventDefault()
          setActiveStep((current) => current - 1)
        }
      }}
      tabIndex={0}
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={activeItem.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          className={`pointer-events-none absolute inset-0 ${activeItem.backdrop}`}
          aria-hidden="true"
        />
      </AnimatePresence>
      <div className="pointer-events-none absolute inset-0 bg-black/25" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:52px_52px] [mask-image:radial-gradient(circle_at_58%_50%,black,transparent_82%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[1440px] flex-col px-5 py-14 sm:px-8 lg:grid lg:min-h-[760px] lg:grid-cols-[330px_minmax(0,1fr)] lg:items-center lg:gap-8 lg:px-10 lg:py-10">
        <div className="mb-10 lg:hidden">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-white/42">EXPLORE BY FORMAT</p>
          <div className="mt-5 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {featureItems.map((item, index) => {
              const Icon = item.icon
              const isActive = getWrappedIndex(activeStep) === index
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setActiveStep(index)}
                  aria-pressed={isActive}
                  className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm transition ${
                    isActive
                      ? "border-white/24 bg-white/16 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_12px_32px_rgba(0,0,0,0.22)]"
                      : "border-white/10 bg-white/[0.055] text-white/48 hover:bg-white/10 hover:text-white/78"
                  }`}
                >
                  <Icon className="size-4" strokeWidth={1.8} aria-hidden="true" />
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="relative hidden h-[560px] lg:block" aria-label="Choose a website format">
          <p className="absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold tracking-[0.22em] text-white/28">
            SCROLL TO EXPLORE
          </p>
          {visibleOffsets.map((offset, index) => {
            const step = activeStep + offset
            const item = featureItems[getWrappedIndex(step)]
            const Icon = item.icon
            const distance = Math.abs(offset)
            const isActive = offset === 0

            return (
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                key={step}
              >
                <motion.button
                  type="button"
                  onClick={() => setActiveStep(step)}
                  initial={false}
                  animate={{
                    y: offsetY[index],
                    scale: isActive ? 1 : distance === 1 ? 0.92 : 0.68,
                    opacity: isActive ? 1 : distance === 1 ? 0.74 : 0.24,
                    filter: `blur(${isActive ? 0 : distance === 1 ? 0.6 : 5}px)`,
                  }}
                  transition={{ type: "spring", stiffness: 340, damping: 34, mass: 0.8 }}
                  aria-pressed={isActive}
                  className={`pointer-events-auto flex w-[272px] cursor-pointer items-center justify-center rounded-full border text-white backdrop-blur-xl ${
                    isActive
                      ? "h-[76px] gap-4 border-white/20 bg-[#4a4a4d]/90 px-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-8px_18px_rgba(0,0,0,0.16),0_14px_30px_rgba(0,0,0,0.34)] hover:bg-[#555558]/95"
                      : "h-[62px] gap-3 border-white/12 bg-[#464649]/80 px-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_10px_24px_rgba(0,0,0,0.25)] hover:bg-[#505053]/90"
                  }`}
                >
                  <Icon
                    className={isActive ? "size-7 text-white/84" : "size-5 text-white/44"}
                    strokeWidth={isActive ? 1.7 : 1.9}
                    aria-hidden="true"
                  />
                  <span className={`whitespace-nowrap leading-none ${isActive ? "text-2xl" : "text-lg font-semibold"}`}>
                    {item.label}
                  </span>
                </motion.button>
              </div>
            )
          })}
        </div>

        <div className="flex min-w-0 items-center justify-center lg:pl-2">
          <div className="relative aspect-[16/10] w-full max-w-[980px] overflow-hidden rounded-[26px] border border-white/12 bg-black/20 shadow-[0_35px_100px_rgba(0,0,0,0.45)]">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeItem.id}
                src={activeItem.image}
                alt=""
                initial={{ opacity: 0, filter: "blur(12px)", scale: 1.045 }}
                animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                exit={{ opacity: 0, filter: "blur(10px)", scale: 0.965 }}
                transition={{ duration: 0.58, ease: [0.23, 1, 0.32, 1] }}
                className={`absolute inset-0 h-full w-full object-cover ${activeItem.imagePosition ?? "object-center"}`}
              />
            </AnimatePresence>
            <div
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(6,8,13,0.68)_0%,rgba(6,8,13,0.16)_53%,rgba(6,8,13,0.04)_100%),linear-gradient(0deg,rgba(6,8,13,0.72)_0%,transparent_58%)]"
              aria-hidden="true"
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeItem.id}-copy`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.48, ease: [0.23, 1, 0.32, 1] }}
                className="absolute inset-x-0 bottom-0 max-w-[680px] p-6 sm:p-9 lg:p-12"
              >
                <p className="text-[10px] font-semibold tracking-[0.22em] text-white/58">{activeItem.eyebrow}</p>
                <h2 className="mt-4 max-w-[560px] text-[31px] font-medium leading-[1.02] tracking-[-0.035em] sm:text-[42px] lg:text-[54px]">
                  {activeItem.title}
                </h2>
                <p className="mt-4 hidden max-w-[520px] text-sm leading-6 text-white/58 sm:block">
                  {activeItem.description}
                </p>
              </motion.div>
            </AnimatePresence>
            <span className="absolute right-4 top-4 rounded-full border border-white/12 bg-black/25 px-3 py-1.5 text-[9px] font-medium tracking-[0.12em] text-white/52 backdrop-blur-md sm:right-6 sm:top-6">
              VISUAL / SHOWCASE
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
