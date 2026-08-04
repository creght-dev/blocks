import { useEffect, useRef } from 'react'
import createGlobe from 'cobe'

type GlobeProps = {
    className?: string
    maxWidth?: number
    baseColor?: string
    glowColor?: string
    markerColor?: string
    speed?: number
    phi?: number
    theta?: number
    dark?: number
    diffuse?: number
}

type GlobeState = {
    width: number
    height: number
    phi: number
    theta: number
    dark: number
    diffuse: number
    mapSamples: number
    mapBrightness: number
    baseColor: [number, number, number]
    markerColor: [number, number, number]
    glowColor: [number, number, number]
    offset: [number, number]
    scale: number
    markers: { location: [number, number]; size: number }[]
    arcColor: [number, number, number]
    arcWidth: number
    arcHeight: number
    markerElevation: number
}

type GlobeInstance = {
    update?: (state: Partial<GlobeState>) => void
    destroy: () => void
}

const hexToRgb = (hex: string): [number, number, number] => {
    const safeHex = hex.replace('#', '')
    const normalized =
        safeHex.length === 3
            ? safeHex
                .split('')
                .map((char) => char + char)
                .join('')
            : safeHex

    const int = Number.parseInt(normalized, 16)
    if (Number.isNaN(int)) return [1, 1, 1]

    return [((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255]
}

export function Globe({
    className,
    maxWidth = 1200,
    baseColor = '#3a3a3a',
    glowColor = '#ffffff',
    markerColor = '#ff8c42',
    speed = 0.1,
    phi = 0,
    theta = 0.3,
    dark = 0.8,
    diffuse = 1.2,
}: GlobeProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const phiRef = useRef(phi)
    const sizeRef = useRef(maxWidth)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const size = Math.min(maxWidth, canvas.offsetWidth || maxWidth)
        sizeRef.current = size

        const globe = createGlobe(canvas, {
            devicePixelRatio: Math.min(window.devicePixelRatio, 2),
            width: size * 2,
            height: size * 2,
            phi,
            theta,
            dark,
            diffuse,
            mapSamples: 16000,
            mapBrightness: 6,
            baseColor: hexToRgb(baseColor),
            markerColor: hexToRgb(markerColor),
            glowColor: hexToRgb(glowColor),
            markers: [],
            offset: [0, 0],
            scale: 1,
            arcColor: hexToRgb(markerColor),
            arcWidth: 0.7,
            arcHeight: 0.25,
            markerElevation: 0.02,
            onRender: (state: Partial<GlobeState>) => {
                phiRef.current += speed
                state.phi = phiRef.current
                state.width = sizeRef.current * 2
                state.height = sizeRef.current * 2
                return state
            },
        } as Parameters<typeof createGlobe>[1] & {
            markers: GlobeState["markers"]
            onRender: (state: Partial<GlobeState>) => Partial<GlobeState>
        }) as GlobeInstance

        let frameId = 0
        const animate = () => {
            if (typeof globe.update !== 'function') return
            phiRef.current += speed
            globe.update({ phi: phiRef.current })
            frameId = window.requestAnimationFrame(animate)
        }
        if (typeof globe.update === 'function') {
            frameId = window.requestAnimationFrame(animate)
        }

        const observer = new ResizeObserver(() => {
            const nextSize = Math.min(maxWidth, canvas.offsetWidth || maxWidth)
            sizeRef.current = nextSize
            globe.update?.({
                width: nextSize * 2,
                height: nextSize * 2,
            })
        })
        observer.observe(canvas)

        return () => {
            window.cancelAnimationFrame(frameId)
            observer.disconnect()
            globe.destroy()
        }
    }, [baseColor, dark, diffuse, glowColor, markerColor, maxWidth, phi, speed, theta])

    return (
        <canvas
            ref={canvasRef}
            className={className}
            style={{ width: '100%', height: '100%', maxWidth, aspectRatio: '1 / 1' }}
        />
    )
}
