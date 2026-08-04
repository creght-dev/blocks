import { Link, useParams } from "react-router-dom"
import { SphereWallPreview } from "@/src/components/SphereWallPreview"
import { demos } from "@/src/lib/preview-demos"

export function PreviewPage() {
  const { slug } = useParams<{ slug: string }>()
  const body = slug ? demos[slug] : undefined

  if (!body) {
    return (
      <div className="px-6 py-10">
        <Link to="/" className="text-emerald-800 hover:underline">
          ← 返回目录
        </Link>
        <p className="mt-4 text-zinc-600">
          未找到预览条目{slug ? `：${slug}` : "。"}
        </p>
      </div>
    )
  }

  if (slug === "sphere-wall") {
    return <SphereWallPreview />
  }

  return <div className="min-h-dvh w-full">{body}</div>
}
