"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge'
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// ============================================================================
// TYPES
// ============================================================================

interface TestimonialVideoItem {
    id: string;
    name: string;
    role: string;
    thumbnail: string;
    videoUrl: string;
    badge: string;
}

interface TestimonialVideoProps {
    className?: string;
}

// ============================================================================
// DATA
// ============================================================================

const TESTIMONIALS: TestimonialVideoItem[] = [
    {
        id: '1',
        name: "David Chen",
        role: "Product Lead at TechFlow",
        thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1100&fit=crop&q=80",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        badge: "CUSTOMER STORY"
    },
    {
        id: '2',
        name: "Maria Rodriguez",
        role: "VP of Design at CreativeLab",
        thumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=1100&fit=crop&q=80",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        badge: "CUSTOMER STORY"
    },
    {
        id: '3',
        name: "Amelia Brynn",
        role: "Strategy Lead at Forerunner™",
        thumbnail: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&h=1100&fit=crop&q=80",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        badge: "CUSTOMER STORY"
    },
    {
        id: '4',
        name: "Sarah Mitchell",
        role: "CMO at BrandWorks",
        thumbnail: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=1100&fit=crop&q=80",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        badge: "CUSTOMER STORY"
    }
];

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const animatedContentVariants = {
    hidden: {
        opacity: 0,
        y: 40,
        filter: 'blur(10px)'
    },
    visible: (customDelay: number = 0) => ({
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
            duration: 0.8,
            delay: customDelay,
            ease: [0.4, 0, 0.2, 1] as const,
        }
    })
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function TestimonialVideo({ className }: TestimonialVideoProps) {
    const [activeVideo, setActiveVideo] = useState<string | null>(null);
    const carouselRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (carouselRef.current) {
            const { current } = carouselRef;
            const scrollAmount = 420;
            current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Lock scroll when modal is open
    useEffect(() => {
        if (activeVideo) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [activeVideo]);

    return (
        <>
            {/* Google Fonts */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap" rel="stylesheet" />

            <section className={cn("w-full bg-[#1a1a1a] py-[120px] px-6 md:px-10 min-h-screen selection:bg-white selection:text-black overflow-hidden", className)} style={{ fontFamily: "'Geist', sans-serif" }}>
                <div className="max-w-[1600px] mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8">
                        <div className="max-w-[800px]">
                            <motion.span
                                variants={animatedContentVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                className="inline-block text-[11px] font-bold uppercase tracking-[2px] text-[#888] mb-6"
                            >
                                TESTIMONIALS
                            </motion.span>
                            <motion.h1
                                variants={animatedContentVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                custom={0.1}
                                className="text-4xl md:text-[56px] font-normal leading-[1.2] md:leading-[1.3] text-white tracking-[-1.5px]"
                            >
                                We've helped teams rethink their offers, their structure, and their story.
                            </motion.h1>
                        </div>

                        <motion.div
                            variants={animatedContentVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            custom={0.2}
                            className="flex gap-4 shrink-0"
                        >
                            <button
                                onClick={() => scroll('left')}
                                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </motion.div>
                    </div>

                    {/* Carousel Container */}
                    <div className="relative">
                        <div
                            ref={carouselRef}
                            className="flex gap-5 overflow-x-auto scrollbar-hide pb-8"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {TESTIMONIALS.map((testimonial, idx) => (
                                <motion.div
                                    key={testimonial.id}
                                    variants={animatedContentVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    custom={0.2 + idx * 0.1}
                                    onClick={() => setActiveVideo(testimonial.videoUrl)}
                                    className="relative flex-none w-[320px] md:w-[400px] h-[450px] md:h-[550px] rounded-2xl overflow-hidden cursor-pointer group"
                                >
                                    {/* Thumbnail */}
                                    <img
                                        src={testimonial.thumbnail}
                                        alt={testimonial.name}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />

                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-[2]" />

                                    {/* Badge */}
                                    <div className="absolute top-6 left-6 z-[3] px-4 py-2 rounded-full bg-white/15 backdrop-blur-xl border border-white/20 text-[11px] font-bold text-white tracking-wider">
                                        {testimonial.badge}
                                    </div>

                                    {/* Info */}
                                    <div className="absolute bottom-0 left-0 right-0 p-8 z-[3]">
                                        <h3 className="text-xl md:text-[22px] font-semibold text-white mb-1.5">
                                            {testimonial.name}
                                        </h3>
                                        <p className="text-sm md:text-[15px] text-white/80">
                                            {testimonial.role}
                                        </p>
                                    </div>

                                    {/* Play Icon */}
                                    <div className="absolute inset-0 flex items-center justify-center z-[3]">
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            className="w-[70px] h-[70px] bg-white/95 rounded-full flex items-center justify-center shadow-2xl transition-colors group-hover:bg-white"
                                        >
                                            <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[18px] border-l-[#1a1a1a] border-b-[12px] border-b-transparent ml-1" />
                                        </motion.div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Video Modal */}
                <AnimatePresence>
                    {activeVideo && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-6 md:p-10 backdrop-blur-sm"
                            onClick={() => setActiveVideo(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, filter: 'blur(10px)' }}
                                animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                                exit={{ scale: 0.9, opacity: 0, filter: 'blur(10px)' }}
                                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                                className="relative w-full max-w-[1100px] aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Close Button */}
                                <button
                                    onClick={() => setActiveVideo(null)}
                                    className="absolute -top-14 right-0 w-11 h-11 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-md z-[101]"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <video
                                    autoPlay
                                    controls
                                    className="w-full h-full object-cover"
                                    src={activeVideo}
                                />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
            </section>
        </>
    );
}

export default TestimonialVideo;