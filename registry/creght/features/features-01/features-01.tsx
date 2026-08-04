import React from "react";
import { motion } from "framer-motion";
import { Zap, TrendingUp, Brain, Globe } from "lucide-react";

export default function Benefit01Velara({ className }: { className?: string }) {
    return (
        <section className={"bg-black py-32 px-6 flex flex-col items-center relative overflow-hidden " + (className || "")}>

            {/* ENHANCED CENTRAL LIGHT EFFECT */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#A855F7]/15 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-white/5 rounded-full blur-[60px] pointer-events-none" />

            {/* Animated Diffusion Layer */}
            <motion.div
                animate={{
                    scale: [1, 1.5],
                    opacity: [0.2, 0]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity as number,
                    ease: "easeOut" as const
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[80px] pointer-events-none"
            />

            {/* BACKGROUND GRID PATTERN */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />

            {/* HEADING */}
            <div className="text-center mb-16 px-4 relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-white font-display text-4xl md:text-[52px] font-[800] leading-tight tracking-tight max-w-2xl mx-auto"
                >
                    The Key Benefits AI<br />for Your Business
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-4 text-white/50 text-base md:text-[16px] max-w-[480px] mx-auto leading-relaxed"
                >
                    Our all-in-one platform simplifies your workflow so you can focus on what really matters growing your business.
                </motion.p>
            </div>

            {/* FEATURE GRID */}
            <div className="relative w-full max-w-[940px] mx-auto mt-16 px-4">

                {/* DIVIDER LINES (Cross) with Fading Edges */}
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-y-1/2 hidden md:block" />
                <div className="absolute left-1/2 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent -translate-x-1/2 hidden md:block" />

                <div className="grid grid-cols-1 md:grid-cols-2 relative z-10">

                    {/* CELL 1: Save Time & Effort */}
                    <div className="p-12 md:p-[80px] text-center border-b border-white/10 md:border-b-0 relative group">
                        <div className="flex flex-col items-center relative z-10">
                            <div className="w-16 h-16 bg-[#13121F] rounded-2xl border border-white/10 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:border-purple-500/50 shadow-xl">
                                <Zap className="w-8 h-8 text-white stroke-[1.5]" />
                            </div>
                            <h3 className="text-white text-lg md:text-[22px] font-bold mt-8 tracking-tight">Save Time &amp; Effort</h3>
                            <p className="text-white/40 text-[15px] max-w-[260px] mx-auto mt-4 leading-relaxed font-light">
                                Automate repetitive tasks and streamline workflows so your team can focus on high-impact work.
                            </p>
                        </div>
                    </div>

                    {/* CELL 2: Boost Productivity */}
                    <div className="p-12 md:p-[80px] text-center border-b border-white/10 md:border-b-0 md:border-l border-white/10 relative group">
                        <div className="flex flex-col items-center relative z-10">
                            <div className="w-16 h-16 bg-[#13121F] rounded-2xl border border-white/10 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:border-purple-500/50 shadow-xl">
                                <TrendingUp className="w-8 h-8 text-white stroke-[1.5]" />
                            </div>
                            <h3 className="text-white text-lg md:text-[22px] font-bold mt-8 tracking-tight">Boost Productivity</h3>
                            <p className="text-white/40 text-[15px] max-w-[260px] mx-auto mt-4 leading-relaxed font-light">
                                Simplify complex processes, reduce manual input, and keep everyone aligned.
                            </p>
                        </div>
                    </div>

                    {/* CELL 3: Make Smarter Decisions */}
                    <div className="p-12 md:p-[80px] text-center border-b border-white/10 md:border-b-0 md:border-t border-white/10 relative group">
                        <div className="flex flex-col items-center relative z-10">
                            <div className="w-16 h-16 bg-[#13121F] rounded-2xl border border-white/10 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:border-purple-500/50 shadow-xl">
                                <Brain className="w-8 h-8 text-white stroke-[1.5]" />
                            </div>
                            <h3 className="text-white text-lg md:text-[22px] font-bold mt-8 tracking-tight">Make Smarter Decisions</h3>
                            <p className="text-white/40 text-[15px] max-w-[260px] mx-auto mt-4 leading-relaxed font-light">
                                Access real-time data, insights, and analytics to guide your strategy with confidence.
                            </p>
                        </div>
                    </div>

                    {/* CELL 4: Work From Anywhere */}
                    <div className="p-12 md:p-[80px] text-center md:border-l border-white/10 md:border-t border-white/10 relative group">
                        <div className="flex flex-col items-center relative z-10">
                            <div className="w-16 h-16 bg-[#13121F] rounded-2xl border border-white/10 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:border-purple-500/50 shadow-xl">
                                <Globe className="w-8 h-8 text-white stroke-[1.5]" />
                            </div>
                            <h3 className="text-white text-lg md:text-[22px] font-bold mt-8 tracking-tight">Work From Anywhere</h3>
                            <p className="text-white/40 text-[15px] max-w-[260px] mx-auto mt-4 leading-relaxed font-light">
                                Cloud-based access means your team can stay productive no matter where they are.
                            </p>
                        </div>
                    </div>

                </div>

                {/* CENTER GLOWING NODE */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center z-20 pointer-events-none">
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "backOut" as const }}
                        className="relative w-[150px] h-[150px] flex items-center justify-center"
                    >
                        <div className="absolute inset-0 rounded-full bg-purple-500/10 blur-xl animate-pulse" />
                        <div className="absolute inset-4 rounded-full border border-purple-500/20" />
                        <div className="absolute inset-8 rounded-full border border-purple-500/30" />

                        <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-800 flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.6)] border border-white/30 z-10">
                            <div className="w-10 h-10 rounded-full border-2 border-white/20 flex items-center justify-center overflow-hidden">
                                <motion.svg
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 10, repeat: Infinity as number, ease: "linear" as const }}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="w-6 h-6 text-white"
                                >
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                                    <path d="M12 2C12 2 15 7 15 12C15 17 12 22 12 22" stroke="currentColor" strokeWidth="1" />
                                    <path d="M12 2C12 2 9 7 9 12C9 17 12 22 12 22" stroke="currentColor" strokeWidth="1" />
                                    <path d="M2 12H22" stroke="currentColor" strokeWidth="1" />
                                </motion.svg>
                            </div>
                        </div>

                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity as number, ease: "linear" as const }}
                            className="absolute inset-0 rounded-full border border-purple-500/40 border-t-transparent border-r-transparent"
                        />
                    </motion.div>
                </div>

            </div>

        </section>
    );
}