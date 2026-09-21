import { useRef, type PointerEvent } from "react"

const DEFAULT_IMAGES = [
  "https://fsu.creght.com/site/2083536173505974272/1787295543104__showcase_3d_01.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1787295545390__showcase_3d_02.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1787295543209__showcase_3d_03.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1787295542174__showcase_3d_04.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1787295541998__showcase_3d_05.jpg",
  "https://fsu.creght.com/site/2083536173505974272/1787295542000__showcase_3d_06.png",
  "https://fsu.creght.com/site/2083536173505974272/1787295543005__showcase_3d_07.jpeg",
  "https://fsu.creght.com/site/2083536173505974272/1787295543663__showcase_3d_08.jpg",
] as const

export type Showcase3DProps = {
  className?: string
  images?: readonly string[]
}

function BlurStack() {
  return (
    <div className="showcase-3d__blur-stack" aria-hidden="true">
      {Array.from({ length: 8 }, (_, index) => (
        <span key={index} />
      ))}
    </div>
  )
}

export function Showcase3D({
  className = "",
  images = DEFAULT_IMAGES,
}: Showcase3DProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef({
    active: false,
    lastX: 0,
    lastY: 0,
    pointerId: -1,
    rotationX: 0,
    rotationY: 0,
  })
  const resolvedImages = Array.from(
    { length: 8 },
    (_, index) => images[index] ?? DEFAULT_IMAGES[index],
  )

  const updatePointer = (event: PointerEvent<HTMLDivElement>) => {
    const stage = stageRef.current
    if (!stage) return

    const drag = dragRef.current
    if (drag.active && drag.pointerId === event.pointerId) {
      const deltaX = event.clientX - drag.lastX
      const deltaY = event.clientY - drag.lastY
      drag.lastX = event.clientX
      drag.lastY = event.clientY
      drag.rotationX = Math.max(-28, Math.min(28, drag.rotationX - deltaY * 0.24))
      drag.rotationY += deltaX * 0.42
      stage.style.setProperty("--showcase-drag-x", `${drag.rotationX}deg`)
      stage.style.setProperty("--showcase-drag-y", `${drag.rotationY}deg`)
      return
    }

    const bounds = stage.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / Math.max(bounds.width, 1) - 0.5
    const y = (event.clientY - bounds.top) / Math.max(bounds.height, 1) - 0.5
    stage.style.setProperty("--showcase-pointer-x", `${x * 14}deg`)
    stage.style.setProperty("--showcase-pointer-y", `${y * -10}deg`)
    stage.style.setProperty("--showcase-shift-x", `${x * 18}px`)
    stage.style.setProperty("--showcase-shift-y", `${y * 14}px`)
  }

  const resetPointer = () => {
    const stage = stageRef.current
    if (!stage || dragRef.current.active) return
    stage.style.setProperty("--showcase-pointer-x", "0deg")
    stage.style.setProperty("--showcase-pointer-y", "0deg")
    stage.style.setProperty("--showcase-shift-x", "0px")
    stage.style.setProperty("--showcase-shift-y", "0px")
  }

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return
    const stage = stageRef.current
    if (!stage) return
    const drag = dragRef.current
    drag.active = true
    drag.pointerId = event.pointerId
    drag.lastX = event.clientX
    drag.lastY = event.clientY
    stage.classList.add("is-dragging")
    stage.style.setProperty("--showcase-pointer-x", "0deg")
    stage.style.setProperty("--showcase-pointer-y", "0deg")
    stage.style.setProperty("--showcase-shift-x", "0px")
    stage.style.setProperty("--showcase-shift-y", "0px")
    event.currentTarget.setPointerCapture(event.pointerId)
    event.preventDefault()
  }

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    const stage = stageRef.current
    const drag = dragRef.current
    if (!stage || !drag.active || drag.pointerId !== event.pointerId) return
    drag.active = false
    drag.pointerId = -1
    stage.classList.remove("is-dragging")
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const resetRotation = () => {
    const stage = stageRef.current
    if (!stage) return
    dragRef.current.rotationX = 0
    dragRef.current.rotationY = 0
    stage.style.setProperty("--showcase-drag-x", "0deg")
    stage.style.setProperty("--showcase-drag-y", "0deg")
  }

  return (
    <section
      className={`showcase-3d ${className}`.trim()}
      aria-label="Interactive rotating 3D image showcase. Drag to rotate and double-click to reset."
    >
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <style>{SHOWCASE_3D_STYLES}</style>

      <div
        className="showcase-3d__main"
        onDoubleClick={resetRotation}
        onPointerCancel={endDrag}
        onPointerDown={startDrag}
        onPointerLeave={resetPointer}
        onPointerMove={updatePointer}
        onPointerUp={endDrag}
        ref={stageRef}
      >
        <div className="showcase-3d__responsive-scale">
          <div className="showcase-3d__visual">
            <div className="showcase-3d__mask">
              <div className="showcase-3d__scene">
                <div className="showcase-3d__gesture">
                  <div className="showcase-3d__orbit">
                    {resolvedImages.map((image, index) => (
                      <div className="showcase-3d__card" key={`${image}-${index}`}>
                        <div className="showcase-3d__card-face">
                          <img src={image} alt="" decoding="async" draggable={false} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <BlurStack />
          </div>
        </div>
      </div>
    </section>
  )
}

const SHOWCASE_3D_STYLES = `
  .showcase-3d,
  .showcase-3d * {
    box-sizing: border-box;
  }

  .showcase-3d {
    background: #050505;
    color: #fff;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    height: 100svh;
    isolation: isolate;
    min-height: 560px;
    overflow: hidden;
    position: relative;
    width: 100%;
  }

  .showcase-3d__main {
    --showcase-drag-x: 0deg;
    --showcase-drag-y: 0deg;
    --showcase-pointer-x: 0deg;
    --showcase-pointer-y: 0deg;
    --showcase-shift-x: 0px;
    --showcase-shift-y: 0px;
    align-items: center;
    cursor: grab;
    display: flex;
    height: 100%;
    justify-content: center;
    overflow: hidden;
    perspective: 1600px;
    touch-action: none;
    user-select: none;
    width: 100%;
  }

  .showcase-3d__main.is-dragging {
    cursor: grabbing;
  }

  .showcase-3d__responsive-scale {
    height: 522px;
    position: relative;
    transform: scale(1);
    transform-style: preserve-3d;
    width: 694px;
  }

  .showcase-3d__visual {
    height: 522px;
    position: relative;
    transform: translate3d(var(--showcase-shift-x), var(--showcase-shift-y), 0)
      rotateX(var(--showcase-pointer-y)) rotateY(var(--showcase-pointer-x));
    transform-style: preserve-3d;
    transition: transform .55s cubic-bezier(.2, .8, .2, 1);
    width: 694px;
  }

  .showcase-3d__mask {
    height: 100%;
    mask: linear-gradient(26deg, #000 48%, transparent 83%);
    position: relative;
    width: 100%;
  }

  .showcase-3d__scene {
    height: 522px;
    position: relative;
    transform: perspective(1200px) scale(.6) rotate(24deg) rotateX(-40deg) rotateY(-40deg);
    transform-style: preserve-3d;
    width: 694px;
  }

  .showcase-3d__orbit {
    animation: showcase-3d-orbit 24s linear infinite;
    height: 522px;
    position: relative;
    transform-style: preserve-3d;
    width: 694px;
  }

  .showcase-3d__gesture {
    height: 522px;
    position: relative;
    transform: rotateX(var(--showcase-drag-x)) rotateY(var(--showcase-drag-y));
    transform-style: preserve-3d;
    transition: transform .2s ease-out;
    width: 694px;
    will-change: transform;
  }

  .showcase-3d__main.is-dragging .showcase-3d__gesture {
    transition: none;
  }

  .showcase-3d__card {
    height: 552px;
    left: 355px;
    position: absolute;
    top: 50%;
    transform-origin: 0 50%;
    transform-style: preserve-3d;
    width: 350px;
  }

  .showcase-3d__card:nth-child(1) { transform: translateY(-50%) rotateY(0deg); }
  .showcase-3d__card:nth-child(2) { transform: translateY(-50%) rotateY(45deg); }
  .showcase-3d__card:nth-child(3) { transform: translateY(-50%) rotateY(90deg); }
  .showcase-3d__card:nth-child(4) { transform: translateY(-50%) rotateY(135deg); }
  .showcase-3d__card:nth-child(5) { transform: translateY(-50%) rotateY(180deg); }
  .showcase-3d__card:nth-child(6) { transform: translateY(-50%) rotateY(225deg); }
  .showcase-3d__card:nth-child(7) { transform: translateY(-50%) rotateY(270deg); }
  .showcase-3d__card:nth-child(8) { transform: translateY(-50%) rotateY(315deg); }

  .showcase-3d__card-face {
    border: 1px solid rgba(255, 255, 255, .2);
    border-radius: 20px;
    box-shadow: 0 22px 80px rgba(0, 0, 0, .55), inset 0 0 0 1px rgba(255, 255, 255, .03);
    height: 552px;
    overflow: hidden;
    position: relative;
    transform: rotateY(45deg);
    transform-style: preserve-3d;
    width: 330px;
  }

  .showcase-3d__card-face::after {
    background: linear-gradient(115deg, rgba(255,255,255,.16), transparent 24%, transparent 74%, rgba(255,255,255,.07));
    content: "";
    inset: 0;
    pointer-events: none;
    position: absolute;
  }

  .showcase-3d__card-face img {
    display: block;
    height: 100%;
    object-fit: cover;
    object-position: center;
    width: 100%;
  }

  .showcase-3d__blur-stack {
    height: 293px;
    pointer-events: none;
    position: absolute;
    right: 19px;
    top: 3px;
    transform: rotate(28deg);
    width: 532px;
    z-index: 4;
  }

  .showcase-3d__blur-stack span {
    inset: 0;
    position: absolute;
  }

  .showcase-3d__blur-stack span:nth-child(1) { backdrop-filter: blur(.15625px); mask-image: linear-gradient(to top, transparent 0%, #000 12.5%, #000 25%, transparent 37.5%); }
  .showcase-3d__blur-stack span:nth-child(2) { backdrop-filter: blur(.3125px); mask-image: linear-gradient(to top, transparent 12.5%, #000 25%, #000 37.5%, transparent 50%); }
  .showcase-3d__blur-stack span:nth-child(3) { backdrop-filter: blur(.625px); mask-image: linear-gradient(to top, transparent 25%, #000 37.5%, #000 50%, transparent 62.5%); }
  .showcase-3d__blur-stack span:nth-child(4) { backdrop-filter: blur(1.25px); mask-image: linear-gradient(to top, transparent 37.5%, #000 50%, #000 62.5%, transparent 75%); }
  .showcase-3d__blur-stack span:nth-child(5) { backdrop-filter: blur(2.5px); mask-image: linear-gradient(to top, transparent 50%, #000 62.5%, #000 75%, transparent 87.5%); }
  .showcase-3d__blur-stack span:nth-child(6) { backdrop-filter: blur(5px); mask-image: linear-gradient(to top, transparent 62.5%, #000 75%, #000 87.5%, transparent 100%); }
  .showcase-3d__blur-stack span:nth-child(7) { backdrop-filter: blur(10px); mask-image: linear-gradient(to top, transparent 75%, #000 87.5%, #000 100%); }
  .showcase-3d__blur-stack span:nth-child(8) { backdrop-filter: blur(20px); mask-image: linear-gradient(to top, transparent 87.5%, #000 100%); }

  @keyframes showcase-3d-orbit {
    from { transform: rotateY(0deg); }
    to { transform: rotateY(360deg); }
  }

  @media (min-width: 810px) and (max-width: 1199px) {
    .showcase-3d__responsive-scale {
      transform: scale(.8);
    }
  }

  @media (max-width: 809px) {
    .showcase-3d {
      min-height: 520px;
    }

    .showcase-3d__responsive-scale {
      transform: scale(.4);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .showcase-3d__orbit {
      animation-play-state: paused;
    }

    .showcase-3d__visual,
    .showcase-3d__gesture {
      transition: none;
    }
  }
`

export default Showcase3D
