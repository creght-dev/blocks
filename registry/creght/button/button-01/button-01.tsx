import type { ButtonHTMLAttributes, ReactNode } from "react"
import { Sparkles } from "lucide-react"
import { twMerge } from "tailwind-merge"

export type Button01Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode
}

export function Button01({
  children = "Publish",
  className,
  icon = <Sparkles aria-hidden="true" className="size-7 shrink-0 stroke-[2.1]" />,
  type = "button",
  ...props
}: Button01Props) {
  return (
    <button
      type={type}
      className={twMerge(
        "inline-flex h-[74px] min-w-[186px] cursor-pointer items-center justify-center gap-3 rounded-full border border-[#639af0] bg-[radial-gradient(circle_at_72%_-20%,rgba(112,172,255,0.16),transparent_48%),linear-gradient(105deg,#394f7d_0%,#17458f_48%,#0d4db5_100%)] px-10 text-xl font-semibold leading-none tracking-[-0.025em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),inset_0_-1px_0_rgba(0,29,86,0.72),0_0_0_1px_rgba(27,99,238,0.24),0_8px_22px_rgba(0,0,0,0.5),0_0_16px_rgba(15,85,205,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-1px_0_rgba(0,29,86,0.62),0_0_0_1px_rgba(83,150,255,0.44),0_12px_28px_rgba(0,0,0,0.52),0_0_24px_rgba(36,111,244,0.24)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080c0f] active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
}

export default Button01
