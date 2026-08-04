import type { ButtonHTMLAttributes } from "react"
import { twMerge } from "tailwind-merge"

export type ButtonGalaxyProps = ButtonHTMLAttributes<HTMLButtonElement>

const PARTICLES = [
  ["left-[5%] top-[58%]", "size-1", "delay-0"],
  ["left-[9%] top-[38%]", "size-0.5", "delay-150"],
  ["left-[14%] top-[70%]", "size-1.5", "delay-300"],
  ["left-[19%] top-[48%]", "size-0.5", "delay-500"],
  ["left-[24%] top-[76%]", "size-1", "delay-700"],
  ["left-[29%] top-[31%]", "size-0.5", "delay-1000"],
  ["left-[34%] top-[63%]", "size-1.5", "delay-200"],
  ["left-[39%] top-[82%]", "size-0.5", "delay-700"],
  ["left-[44%] top-[42%]", "size-1", "delay-500"],
  ["left-[49%] top-[71%]", "size-0.5", "delay-1000"],
  ["left-[54%] top-[28%]", "size-1", "delay-300"],
  ["left-[59%] top-[58%]", "size-1.5", "delay-150"],
  ["left-[64%] top-[79%]", "size-0.5", "delay-500"],
  ["left-[69%] top-[39%]", "size-1", "delay-700"],
  ["left-[74%] top-[68%]", "size-0.5", "delay-1000"],
  ["left-[79%] top-[51%]", "size-1.5", "delay-300"],
  ["left-[84%] top-[78%]", "size-1", "delay-150"],
  ["left-[89%] top-[35%]", "size-0.5", "delay-700"],
  ["left-[94%] top-[61%]", "size-1", "delay-500"],
] as const

export function ButtonGalaxy({
  children = "Generate",
  className,
  type = "button",
  ...props
}: ButtonGalaxyProps) {
  return (
    <button
      type={type}
      className={twMerge(
        "group relative isolate inline-flex h-[138px] w-[432px] max-w-full cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#7e85b5] p-[2px] shadow-[0_0_1px_rgba(255,255,255,0.2),0_2px_8px_rgba(63,63,232,0.25),0_16px_55px_-14px_rgba(63,63,232,0.45)] transition duration-500 ease-out hover:-translate-y-0.5 hover:shadow-[0_0_1px_rgba(255,255,255,0.45),0_2px_10px_rgba(112,126,255,0.55),0_20px_70px_-8px_rgba(63,63,232,0.72)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a9b1ff] focus-visible:ring-offset-4 focus-visible:ring-offset-[#080609] active:translate-y-0 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <span className="absolute inset-[2px] overflow-hidden rounded-full bg-[#0a0609] shadow-[inset_0_0_2px_3px_rgba(0,0,0,0.45),inset_0_0_4px_8px_rgba(89,98,201,0.25)]">
        <span className="absolute inset-0 bg-[radial-gradient(75%_130%_at_50%_112%,rgba(93,91,245,0.48)_0%,rgba(31,26,105,0.16)_37%,rgba(10,6,9,0)_69%)] opacity-35 transition-opacity duration-700 group-hover:opacity-100 group-focus-visible:opacity-100" />
        <span className="absolute -bottom-[125%] left-1/2 h-[205%] w-[92%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(circle,rgba(78,125,255,0.58)_0%,rgba(47,58,199,0.2)_35%,transparent_68%)] opacity-0 blur-xl transition-all duration-700 group-hover:-bottom-[105%] group-hover:opacity-100 group-focus-visible:-bottom-[105%] group-focus-visible:opacity-100" />
        <span className="absolute inset-x-[9%] bottom-[-60%] h-[88%] rounded-[50%] border-t border-[#9ba8ff]/0 shadow-[0_-18px_45px_rgba(55,94,255,0)] transition-all duration-700 group-hover:border-[#9ba8ff]/55 group-hover:shadow-[0_-18px_45px_rgba(55,94,255,0.42)] group-focus-visible:border-[#9ba8ff]/55 group-focus-visible:shadow-[0_-18px_45px_rgba(55,94,255,0.42)]" />

        <span className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
          {PARTICLES.map(([position, size, delay]) => (
            <span
              key={position}
              className={twMerge(
                "absolute animate-pulse rounded-full bg-[#eef2ff] shadow-[0_0_7px_2px_rgba(136,163,255,0.8)]",
                position,
                size,
                delay,
              )}
            />
          ))}
        </span>

        <span className="absolute -left-[16%] bottom-[15%] h-px w-[58%] -rotate-[12deg] bg-gradient-to-r from-transparent via-[#a7b8ff]/70 to-transparent opacity-0 blur-[0.5px] transition-all delay-150 duration-700 group-hover:left-[4%] group-hover:opacity-70 group-focus-visible:left-[4%] group-focus-visible:opacity-70" />
        <span className="absolute -right-[18%] bottom-[29%] h-px w-[48%] rotate-[9deg] bg-gradient-to-r from-transparent via-[#728cff]/65 to-transparent opacity-0 blur-[0.5px] transition-all delay-300 duration-700 group-hover:right-[3%] group-hover:opacity-60 group-focus-visible:right-[3%] group-focus-visible:opacity-60" />
      </span>

      <span className="relative z-10 bg-[linear-gradient(0deg,#9699a8_20%,#fff_42%)] bg-clip-text text-[clamp(2rem,5vw,3.5rem)] font-medium leading-none tracking-[-0.01em] text-transparent drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]">
        {children}
      </span>
    </button>
  )
}

export default ButtonGalaxy
