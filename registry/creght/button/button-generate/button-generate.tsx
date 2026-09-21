"use client"

import {
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type MouseEvent,
} from "react"
import { Sparkles } from "lucide-react"
import { twMerge } from "tailwind-merge"

const LETTER_DELAYS = [
  "[transition-delay:0ms]",
  "[transition-delay:28ms]",
  "[transition-delay:56ms]",
  "[transition-delay:84ms]",
  "[transition-delay:112ms]",
  "[transition-delay:140ms]",
  "[transition-delay:168ms]",
  "[transition-delay:196ms]",
  "[transition-delay:224ms]",
  "[transition-delay:252ms]",
  "[transition-delay:280ms]",
  "[transition-delay:308ms]",
] as const

export type ButtonGenerateProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  generating?: boolean
  generatingLabel?: string
  idleLabel?: string
  minimumGeneratingTime?: number
  onGenerate?: () => void | Promise<void>
  onGenerateError?: (error: unknown) => void
}

function AnimatedLabel({
  active,
  className,
  inactiveClassName,
  text,
}: {
  active: boolean
  className: string
  inactiveClassName: string
  text: string
}) {
  return (
    <span className={twMerge("flex justify-center", className)}>
      {Array.from(text).map((letter, index) => (
        <span
          key={`${letter}-${index}`}
          className={twMerge(
            "inline-block whitespace-pre transition-[transform,opacity,filter] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
            LETTER_DELAYS[Math.min(index, LETTER_DELAYS.length - 1)],
            active
              ? "translate-y-0 opacity-100 blur-0"
              : twMerge(inactiveClassName, "opacity-0 blur-[2px]"),
          )}
        >
          {letter}
        </span>
      ))}
    </span>
  )
}

export function ButtonGenerate({
  className,
  disabled,
  generating,
  generatingLabel = "Generating",
  idleLabel = "Generate",
  minimumGeneratingTime = 1400,
  onClick,
  onGenerate,
  onGenerateError,
  type = "button",
  ...props
}: ButtonGenerateProps) {
  const [internalGenerating, setInternalGenerating] = useState(false)
  const runId = useRef(0)
  const isControlled = generating !== undefined
  const isGenerating = generating ?? internalGenerating

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (event.defaultPrevented || isGenerating) return

    const currentRun = ++runId.current
    if (!isControlled) setInternalGenerating(true)

    try {
      await Promise.all([
        Promise.resolve(onGenerate?.()),
        new Promise((resolve) =>
          window.setTimeout(resolve, Math.max(0, minimumGeneratingTime)),
        ),
      ])
    } catch (error) {
      onGenerateError?.(error)
    } finally {
      if (!isControlled && currentRun === runId.current) {
        setInternalGenerating(false)
      }
    }
  }

  return (
    <button
      {...props}
      type={type}
      disabled={disabled}
      aria-disabled={disabled || isGenerating}
      aria-busy={isGenerating}
      data-state={isGenerating ? "generating" : "idle"}
      data-testid="generate-button"
      onClick={handleClick}
      className={twMerge(
        "group relative isolate inline-flex h-[78px] w-[320px] max-w-full flex-none cursor-pointer items-center justify-center gap-4 overflow-hidden rounded-full border border-white/30 bg-[linear-gradient(180deg,rgba(41,47,56,0.96)_0%,rgba(13,17,23,0.98)_52%,rgba(7,13,20,0.99)_100%)] px-7 font-sans text-[23px] font-medium leading-none tracking-[-0.025em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.34),inset_0_-2px_0_rgba(1,8,15,0.98),0_0_0_1px_rgba(165,181,201,0.13),0_3px_9px_rgba(92,106,124,0.42),0_14px_30px_rgba(0,50,100,0.22)] transition-[transform,filter,box-shadow] duration-200 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_0_rgba(1,8,15,0.98),0_0_0_1px_rgba(173,204,239,0.24),0_5px_14px_rgba(105,130,166,0.46),0_16px_34px_rgba(0,66,130,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:translate-y-0 active:scale-[0.985] disabled:cursor-wait disabled:opacity-90 disabled:hover:translate-y-0 motion-reduce:transition-none",
        isGenerating && "cursor-wait hover:translate-y-0 hover:brightness-100",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[3px] z-0 rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(112,122,136,0.2)_0%,rgba(15,20,27,0.08)_42%,rgba(2,9,16,0.46)_100%)] shadow-[inset_0_1px_5px_rgba(255,255,255,0.12),inset_0_-4px_7px_rgba(0,0,0,0.55)]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[1px] z-[1] rounded-full border-b border-sky-300/60 shadow-[0_4px_7px_rgba(62,157,255,0.24)]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-3px] left-[8%] right-[8%] z-[1] h-3 rounded-full bg-sky-400/35 blur-[6px]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-1px] w-full h-full lefy-0 z-[2]  rounded-full  shadow-[0_0_7px_2px_rgba(90,175,255,0.62)]"
        style={{background:"radial-gradient(84% 33% at 50% 97.9%, rgba(227, 227, 227, 0.8) 0%, #5aafff9e 25%, rgb(0, 0, 0) 52.4106%)"}}
      />
      <span
        aria-hidden="true"
        className={twMerge(
          "relative z-10 grid size-9 shrink-0 place-items-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          isGenerating ? "rotate-[135deg] scale-90" : "rotate-0 scale-100",
        )}
      >
        <Sparkles
          className={twMerge(
            "size-8 stroke-[2.1] drop-shadow-[0_0_5px_rgba(225,244,255,0.92)]",
            isGenerating &&
              "animate-spin [animation-duration:1.8s] motion-reduce:animate-none",
          )}
        />
      </span>

      <span aria-hidden="true" className="relative z-10 grid min-w-[178px] overflow-hidden">
        <AnimatedLabel
          active={!isGenerating}
          className="[grid-area:1/1]"
          inactiveClassName="-translate-y-2.5"
          text={idleLabel}
        />
        <AnimatedLabel
          active={isGenerating}
          className="[grid-area:1/1]"
          inactiveClassName="translate-y-2.5"
          text={generatingLabel}
        />
      </span>
      <span className="sr-only" aria-live="polite">
        {isGenerating ? generatingLabel : idleLabel}
      </span>
    </button>
  )
}

export default ButtonGenerate
