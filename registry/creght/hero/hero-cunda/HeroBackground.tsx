import SideRays from './SideRays'

export default function HeroBackground() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[1080px]"
        aria-hidden="true"
      >
        <SideRays
          speed={4}
          rayColor1="#eab308"
          rayColor2="#0079ff"
          intensity={3}
          spread={3}
          origin="top-right"
          tilt={-3}
          saturation={2}
          blend={1}
          falloff={1.5}
          opacity={1}
          className="[mask-image:linear-gradient(to_bottom,#000_0%,#000_58%,transparent_100%)]"
        />
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 top-16 -z-10 mx-auto h-[560px] max-w-[1400px] opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.09)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,#000_12%,transparent_72%)]"
        aria-hidden="true"
      />
    </>
  )
}
