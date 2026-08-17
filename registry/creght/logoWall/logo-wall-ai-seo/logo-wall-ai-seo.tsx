export type LogoWallAiSeoProps = {
  className?: string
}

type LogoItem = {
  name: string
  iconSrc?: string
  iconClassName?: string
  contentClassName?: string
  wordmarkClassName: string
}

const acmeIcon =
  "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 xmlns:xlink=%22http://www.w3.org/1999/xlink%22 viewBox=%220 0 26 26%22><g id=%22ss8720569938_1%22><path d=%22M 0 0 L 26 0 L 26 26 L 0 26 Z%22 fill=%22transparent%22></path><path d=%22M 13 6.5 L 13 0 L 26 6.5 L 26 19.5 L 13 26 L 13 19.5 L 0 26 L 0 19.5 L 13 13 L 0 6.5 L 0 0 Z M 13 6.5 L 13 19.5 L 26 13 Z%22 fill=%22rgb(255, 255, 255)%22></path></g></svg>"

const quantumIcon =
  "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 xmlns:xlink=%22http://www.w3.org/1999/xlink%22 viewBox=%220 0 26 26%22><g id=%22ss10693930646_1%22><path d=%22M 0 0 L 26 0 L 26 26 L 0 26 Z%22 fill=%22transparent%22></path><path d=%22M 13 26 C 12.142 26 11.352 25.786 10.63 25.357 C 9.931 24.951 9.366 24.398 8.938 23.698 C 8.531 22.976 8.328 22.186 8.328 21.328 C 8.328 20.245 8.576 19.342 9.073 18.62 C 9.57 17.898 10.337 17.051 11.375 16.081 C 12.142 15.381 12.526 14.715 12.526 14.083 L 12.526 13.474 L 11.917 13.474 C 11.217 13.474 10.258 14.174 9.039 15.573 C 7.843 16.972 6.387 17.672 4.672 17.672 C 3.814 17.672 3.024 17.469 2.302 17.063 C 1.602 16.634 1.038 16.069 0.609 15.37 C 0.203 14.648 0 13.858 0 13 C 0 12.142 0.203 11.364 0.609 10.664 C 1.038 9.942 1.602 9.378 2.302 8.971 C 3.024 8.542 3.814 8.328 4.672 8.328 C 6.365 8.328 7.809 9.017 9.005 10.393 C 10.201 11.77 11.172 12.458 11.917 12.458 L 12.526 12.458 L 12.526 11.917 C 12.526 11.285 12.142 10.619 11.375 9.919 L 10.596 9.208 C 10.032 8.689 9.513 8.069 9.039 7.346 C 8.565 6.602 8.328 5.71 8.328 4.672 C 8.328 3.814 8.531 3.036 8.938 2.336 C 9.366 1.614 9.931 1.049 10.63 0.643 C 11.353 0.214 12.143 0 13 0 C 13.858 0 14.636 0.214 15.336 0.643 C 16.058 1.072 16.622 1.636 17.029 2.336 C 17.457 3.036 17.672 3.814 17.672 4.672 C 17.672 6.365 16.983 7.809 15.607 9.005 C 14.23 10.201 13.542 11.172 13.542 11.917 L 13.542 12.458 L 14.083 12.458 C 14.851 12.458 15.821 11.77 16.995 10.393 C 18.146 9.017 19.59 8.328 21.328 8.328 C 22.186 8.328 22.964 8.543 23.664 8.971 C 24.386 9.378 24.951 9.931 25.357 10.63 C 25.786 11.33 26 12.12 26 13 C 26 13.858 25.786 14.648 25.357 15.37 C 24.951 16.069 24.386 16.634 23.664 17.063 C 22.964 17.469 22.186 17.672 21.328 17.672 C 20.267 17.672 19.353 17.412 18.586 16.893 C 17.841 16.374 17.006 15.618 16.081 14.625 C 15.381 13.858 14.715 13.474 14.083 13.474 L 13.542 13.474 L 13.542 14.083 C 13.542 14.918 14.23 15.889 15.607 16.995 C 16.983 18.101 17.672 19.545 17.672 21.328 C 17.672 22.186 17.457 22.976 17.029 23.698 C 16.622 24.398 16.069 24.951 15.37 25.357 C 14.67 25.786 13.88 26 13 26 Z%22 fill=%22rgb(255, 255, 255)%22></path></g></svg>"

const echoValleyIcon =
  "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 xmlns:xlink=%22http://www.w3.org/1999/xlink%22 viewBox=%220 0 22 22%22><g id=%22ss11864283288_1%22><path d=%22M 0 0 L 22 0 L 22 22 L 0 22 Z%22 fill=%22transparent%22></path><path d=%22M 11.043 10.104 C 10.587 4.448 5.852 0 0.079 0 C 0.079 5.747 4.485 10.464 10.104 10.957 C 4.448 11.413 0 16.148 0 21.921 C 5.747 21.921 10.464 17.515 10.957 11.896 C 11.413 17.552 16.148 22 21.921 22 C 21.921 16.253 17.515 11.536 11.896 11.043 C 17.552 10.587 22 5.852 22 0.079 C 16.253 0.079 11.536 4.485 11.043 10.104 Z M 11 11 L 11 11 L 11 11 L 11 11 L 11 11 Z%22 fill=%22rgb(255, 255, 255)%22></path></g></svg>"

const apexIcon =
  "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 xmlns:xlink=%22http://www.w3.org/1999/xlink%22 viewBox=%220 0 24 24%22><g transform=%22translate(0 0)%22 id=%22ss11783445416_1%22><path d=%22M 0 0 L 24 0 L 24 24 L 0 24 Z%22 fill=%22transparent%22></path><path d=%22M 12 20.849 C 2.924 28.433 -4.433 21.076 3.151 12 C -4.433 2.924 2.924 -4.433 12 3.151 C 21.075 -4.433 28.433 2.924 20.849 12 C 28.433 21.069 21.075 28.433 12 20.849 Z%22 fill=%22rgb(255, 255, 255)%22></path></g></svg>"

const celestialIcon =
  "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 xmlns:xlink=%22http://www.w3.org/1999/xlink%22 viewBox=%220 0 24 24%22><g id=%22ss10849698354_1%22><path d=%22M 0 0 L 24 0 L 24 24 L 0 24 Z%22 fill=%22transparent%22></path><path d=%22M 12 12 C 12 12 13.5 7.983 13.5 5.143 C 13.5 2.302 12.828 0 12 0 C 11.172 0 10.5 2.303 10.5 5.143 C 10.5 7.983 12 12 12 12 Z M 12 12 C 12 12 13.78 15.901 15.788 17.909 C 17.796 19.918 19.899 21.071 20.485 20.485 C 21.071 19.899 19.918 17.796 17.909 15.788 C 15.901 13.78 12 12 12 12 Z M 12 12 C 12 12 16.017 10.5 18.857 10.5 C 21.697 10.5 24 11.172 24 12 C 24 12.828 21.697 13.5 18.857 13.5 C 16.017 13.5 12 12 12 12 Z M 12 12 C 12 12 8.099 13.78 6.091 15.788 C 4.082 17.796 2.929 19.899 3.515 20.485 C 4.101 21.071 6.204 19.918 8.212 17.909 C 10.22 15.901 12 12 12 12 Z M 12 12 C 12.003 12.009 13.5 16.02 13.5 18.857 C 13.5 21.697 12.828 24 12 24 C 11.172 24 10.5 21.697 10.5 18.857 C 10.5 16.017 12 12 12 12 Z M 12 12 C 12 12 7.983 10.5 5.143 10.5 C 2.302 10.5 0 11.172 0 12 C 0 12.828 2.303 13.5 5.143 13.5 C 7.983 13.5 12 12 12 12 Z M 12 12 C 12 12 15.901 10.22 17.909 8.212 C 19.918 6.204 21.071 4.101 20.485 3.515 C 19.899 2.929 17.796 4.082 15.788 6.091 C 13.78 8.099 12 12 12 12 Z M 8.212 6.091 C 10.22 8.099 12 12 12 12 C 12 12 8.099 10.22 6.091 8.212 C 4.082 6.204 2.929 4.1 3.515 3.515 C 4.101 2.929 6.204 4.082 8.212 6.091 Z%22 fill=%22rgb(255, 255, 255)%22></path></g></svg>"

const logoItems: LogoItem[] = [
  {
    name: "Acme Corp",
    iconSrc: acmeIcon,
    iconClassName: "size-[26px]",
    contentClassName: "gap-2",
    wordmarkClassName: "font-bold tracking-[-0.02em]",
  },
  {
    name: "PULSE",
    wordmarkClassName: "font-bold tracking-[-0.055em]",
  },
  {
    name: "Quantum",
    iconSrc: quantumIcon,
    iconClassName: "size-[26px]",
    wordmarkClassName: "font-bold tracking-[-0.025em]",
  },
  {
    name: "Echo Valley",
    iconSrc: echoValleyIcon,
    iconClassName: "size-[22px]",
    wordmarkClassName: "font-bold tracking-[-0.035em]",
  },
  {
    name: "Outside",
    wordmarkClassName: "font-extrabold tracking-[-0.04em]",
  },
  {
    name: "APEX",
    iconSrc: apexIcon,
    iconClassName: "size-6",
    wordmarkClassName: "font-extrabold tracking-[-0.035em]",
  },
  {
    name: "Celestial",
    iconSrc: celestialIcon,
    iconClassName: "size-6",
    wordmarkClassName: "font-normal tracking-[-0.035em]",
  },
  {
    name: "2TWICE",
    wordmarkClassName: "font-medium tracking-[-0.035em]",
  },
]

export default function LogoWallAiSeo({ className = "" }: LogoWallAiSeoProps) {
  return (
    <section
      aria-labelledby="ai-seo-logo-wall-title"
      className={`flex w-full flex-col items-center gap-10 overflow-hidden bg-black px-5 py-20 text-white min-[810px]:px-10 min-[810px]:py-10 ${className}`}
    >
      <h2
        id="ai-seo-logo-wall-title"
        className="max-w-[540px] text-center text-[16px] font-normal leading-6 tracking-[-0.01em] text-white/70"
      >
        Trusted by the world’s most innovative teams
      </h2>

      <div className="grid w-full max-w-[940px] grid-cols-2 gap-[10px] min-[810px]:grid-cols-4">
        {logoItems.map(
          ({
            name,
            iconSrc,
            iconClassName = "",
            contentClassName = "gap-1.5",
            wordmarkClassName,
          }) => (
            <div
              key={name}
              className="flex min-h-[90px] items-center justify-center overflow-hidden rounded-[10px] border border-white/15 bg-[linear-gradient(225deg,rgba(0,0,0,0.3)_0%,#000_100%)] px-5 min-[810px]:px-10"
            >
              <div
                className={`flex w-max items-center justify-center ${contentClassName}`}
              >
                {iconSrc ? (
                  <img
                    aria-hidden="true"
                    src={iconSrc}
                    alt=""
                    className={`shrink-0 object-contain ${iconClassName}`}
                  />
                ) : null}
                <span
                  className={`whitespace-nowrap text-[16px] leading-none text-white ${wordmarkClassName}`}
                >
                  {name}
                </span>
              </div>
            </div>
          ),
        )}
      </div>
    </section>
  )
}
