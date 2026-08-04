
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const AboutUs02Raisedup = () => {
    return (
        <section id="about-us-02" className="bg-white py-20 md:py-32 overflow-hidden font-inter">
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600&display=swap" rel="stylesheet" crossOrigin="anonymous" />

            <div className="max-w-[1280px] mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-16 lg:gap-24 items-center">
                    {/* Left Column: Image with Torn Paper Effect */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" as const }}
                        className="relative w-full flex justify-center lg:justify-start"
                    >
                        <div className="relative w-full max-w-[558px] h-[489px] overflow-hidden">
                            {/* SVG Mask for Torn Paper Effect */}
                            <svg width="0" height="0" className="absolute">
                                <defs>
                                    <clipPath id="torn-paper-mask" clipPathUnits="objectBoundingBox">
                                        <path d="M0.02,0.05 C0.05,0.03 0.08,0.06 0.12,0.04 C0.15,0.02 0.18,0.07 0.22,0.05 C0.25,0.03 0.28,0.08 0.32,0.06 C0.35,0.04 0.38,0.09 0.42,0.07 C0.45,0.05 0.48,0.1 0.52,0.08 C0.55,0.06 0.58,0.11 0.62,0.09 C0.65,0.07 0.68,0.12 0.72,0.1 C0.75,0.08 0.78,0.13 0.82,0.11 C0.85,0.09 0.88,0.14 0.92,0.12 C0.95,0.1 0.98,0.15 1,0.13 L0.98,0.25 C1,0.3 0.97,0.35 0.99,0.4 C1,0.45 0.97,0.5 0.99,0.55 C1,0.6 0.97,0.65 0.99,0.7 C1,0.75 0.97,0.8 0.99,0.85 L0.95,0.95 C0.92,0.93 0.88,0.98 0.85,0.96 C0.82,0.94 0.78,0.99 0.75,0.97 C0.72,0.95 0.68,1 0.65,0.98 C0.62,0.96 0.58,1 0.55,0.98 C0.52,0.96 0.48,1 0.45,0.98 C0.42,0.96 0.38,1 0.35,0.98 C0.32,0.96 0.28,1 0.25,0.98 C0.22,0.96 0.18,1 0.15,0.98 C0.12,0.96 0.08,1 0.05,0.98 L0.02,0.9 C0,0.85 0.03,0.8 0.01,0.75 C0,0.7 0.03,0.65 0.01,0.6 C0,0.55 0.03,0.5 0.01,0.45 C0,0.4 0.03,0.35 0.01,0.3 L0.02,0.05 Z" />
                                    </clipPath>
                                </defs>
                            </svg>

                            {/* Image with the clip path applied */}
                            <img
                                src="https://pub-2df60d97ace544a68c00aa294c98f8e5.r2.dev/Sumon/about%2002.png"
                                alt="Volunteers distributing canned food"
                                className="w-full h-full object-cover scale-110"
                                style={{ clipPath: "url(#torn-paper-mask)" }}
                                referrerPolicy="no-referrer"
                            />
                        </div>
                    </motion.div>

                    {/* Right Column: Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" as const, delay: 0.2 }}
                        className="flex flex-col"
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center self-start px-[18px] py-[8px] gap-[6px] rounded-[999px] border border-[#EFF5F3] bg-white mb-[20px]">
                            <span className="text-[14px] font-normal text-[#244D3C] leading-[20px] font-inter">Who we are</span>
                        </div>

                        {/* Heading */}
                        <h2 className="text-[42px] font-medium text-[#121212] leading-[50px] mb-[11px] tracking-[-0.84px] font-bricolage">
                            We serve with empathy and care.
                        </h2>

                        {/* Description */}
                        <p className="text-[16px] font-normal text-[#444] leading-[24px] tracking-[-0.16px] mb-[40px] self-stretch font-inter">
                            Founded with a mission to make a meaningful difference, we work closely with local communities, volunteers, and partners to address critical social challenges such as poverty, education, healthcare, and disaster relief. Through compassion.
                        </p>

                        {/* CTA Button */}
                        <button className="group relative inline-flex items-center self-start bg-[#1a4332] text-white pl-8 pr-3 py-3 rounded-full font-medium transition-all hover:bg-[#143528] mb-20 shadow-lg shadow-emerald-900/10 cursor-pointer">
                            <span className="mr-4">More About us</span>
                            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#4ade80] text-[#1a4332] transition-transform group-hover:scale-110">
                                <ArrowRight size={20} strokeWidth={2.5} />
                            </span>
                        </button>

                        {/* Statistics Row */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-10 sm:gap-0 pt-10 border-t border-gray-200/60">
                            {/* Stat 1 */}
                            <div className="flex-1">
                                <span className="block text-[60px] font-medium text-[#121212] leading-[64px] tracking-[-2.4px] font-bricolage mb-2 tabular-nums">87%</span>
                                <span className="text-[16px] font-normal text-[#444] leading-[24px] tracking-[-0.16px] font-inter">Strong leadership</span>
                            </div>

                            {/* Vertical Divider */}
                            <div className="hidden sm:block w-px h-16 border-r border-[#A7D784] mx-10"></div>

                            {/* Stat 2 */}
                            <div className="flex-1">
                                <span className="block text-[60px] font-medium text-[#121212] leading-[64px] tracking-[-2.4px] font-bricolage mb-2 tabular-nums">120+</span>
                                <span className="text-[16px] font-normal text-[#444] leading-[24px] tracking-[-0.16px] font-inter">Active Volunteer</span>
                            </div>

                            {/* Vertical Divider */}
                            <div className="hidden sm:block w-px h-16 border-r border-[#A7D784] mx-10"></div>

                            {/* Stat 3 */}
                            <div className="flex-1">
                                <span className="block text-[60px] font-medium text-[#121212] leading-[64px] tracking-[-2.4px] font-bricolage mb-2 tabular-nums">65%</span>
                                <span className="text-[16px] font-normal text-[#444] leading-[24px] tracking-[-0.16px] font-inter">Youths Engaged</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs02Raisedup;