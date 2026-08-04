import { useEffect, useState } from "react"

import { PREVIEW_DEVICE_WIDTH, type PreviewDevice } from "@/src/components/PreviewDeviceSwitcher"

type PreviewFrameProps = {
  slug: string
  device: PreviewDevice
}

export function PreviewFrame({ slug, device }: PreviewFrameProps) {
  const [loading, setLoading] = useState(true)
  const frameWidth = PREVIEW_DEVICE_WIDTH[device]
  const isDesktop = device === "desktop"

  useEffect(() => {
    setLoading(true)
  }, [slug])

  return (
    <div className="flex h-full min-h-0 w-full justify-center">
      <div
        className={`relative h-full min-h-0 overflow-hidden bg-white transition-[width] duration-300 ease-out ${isDesktop ? "w-full" : "rounded-xl border border-zinc-200 shadow-lg"
          }`}
        style={frameWidth ? { width: frameWidth, maxWidth: "100%" } : undefined}
      >
        {loading ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-50 text-sm text-zinc-500">
            加载预览…
          </div>
        ) : null}
        <iframe
          key={slug}
          title={`预览：${slug}`}
          src={`/preview/${slug}`}
          className="block h-full w-full border-0 bg-white"
          onLoad={() => setLoading(false)}
        />
      </div>
    </div>
  )
}
