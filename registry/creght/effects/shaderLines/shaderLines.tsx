import { ShaderLinesCanvas, type ShaderLinesCanvasProps } from "./ShaderLinesCanvas"

export type ShaderLinesEffectProps = ShaderLinesCanvasProps

export function ShaderLinesEffect({
  className = "",
  ...props
}: ShaderLinesEffectProps) {
  return (
    <section className={`relative min-h-screen w-full overflow-hidden bg-black ${className}`}>
      <div className="absolute inset-0">
        <ShaderLinesCanvas {...props} />
      </div>
    </section>
  )
}

export default ShaderLinesEffect
