import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'

import { Globe as GlobeCanvas } from './Globe'

const headlineWords = 'Redefining the Future of'.split(' ')

export function HeroGlobe() {
    return <section
        id="hero"
        className="relative min-h-screen flex flex-col items-center bg-black overflow-hidden pt-32"
    >
        {/* Background radial glow */}
        <div className="absolute w-full bottom-0 md:-bottom-1/4 z-0 flex items-center justify-center pointer-events-none  md:opacity-100">
            <div
                className="w-[1024px] aspect-1/1 absolute"
                style={{
                    background: 'radial-gradient(50% 50% at 50% 50%, #ff6900 0%, rgba(0, 0, 0, 0) 100%)',
                }}
            ></div>
            <div className="w-full max-w-[800px] aspect-square relative">
                <GlobeCanvas
                    className="absolute inset-0"
                    maxWidth={1200}
                    baseColor="#4F2713" // Match site orange
                    glowColor="#FFBD96"
                    markerColor="#ffffff"
                    speed={0.01}
                    phi={0}
                    theta={0.3}
                    dark={1}
                    diffuse={1.2}
                />
            </div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.1)_0%,transparent_70%)] pointer-events-none z-0" />
        <div
            className="bottom-0 absolute h-[200px] w-full"
            style={{ background: 'linear-gradient(#0000 0%, #000 100%)' }}
        ></div>

        <div className="relative z-10 max-w-5xl w-full px-6 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-[0.2em] text-orange-500 uppercase mb-8">
                    <span className="w-1 h-1 rounded-full bg-orange-500 animate-ping" />
                    Global Strategic Partnerships
                </div>

                <h1 className="text-5xl md:text-8xl font-medium tracking-tight text-white mb-8 font-serif leading-[1.05] flex flex-wrap justify-center gap-x-[0.2em]">
                    {'Redefining the Future of'.split(' ').map((word, i) => (
                        <motion.span
                            key={i}
                            initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            transition={{
                                duration: 1,
                                delay: i * 0.1,
                                ease: [0.21, 0.45, 0.32, 0.9],
                            }}
                        >
                            {word}
                        </motion.span>
                    ))}
                    <motion.span
                        initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{
                            duration: 1,
                            delay: 4 * 0.1,
                            ease: [0.21, 0.45, 0.32, 0.9],
                        }}
                        className="italic"
                    >
                        Digital Commerce
                    </motion.span>
                </h1>

                <p className="text-white text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed font-light">
                    Experience the next generation of e-commerce collaboration. We provide the tools,
                    training, and global network to scale your vision.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-12">
                    <a
                        href="#journey"
                        className="px-10 py-3 bg-white text-black rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                    >
                        Talk to us
                    </a>
                    <a
                        href="#markets"
                        className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group font-medium"
                    >
                        Learn More
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>
            </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
        >
            <motion.a
                href="#markets"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="flex flex-col items-center gap-2 group"
            >
                <span className="text-[10px] font-bold tracking-[0.3em] text-white/80 uppercase group-hover:text-orange-500 transition-colors">
                    Scroll
                </span>
                <ChevronDown
                    className="text-white/80 group-hover:text-orange-500 transition-colors"
                    size={24}
                    strokeWidth={1.5}
                />
            </motion.a>
        </motion.div>
    </section>
}

export default HeroGlobe
