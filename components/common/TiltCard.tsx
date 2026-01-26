"use client";

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
    tiltAmount?: number;
    scale?: number;
    perspective?: number;
    glare?: boolean;
}

/**
 * TiltCard Component
 * 
 * A card that tilts in 3D based on mouse position.
 * Modern effect used by Apple, Stripe, and premium sites.
 * Built with Framer Motion - no extra dependencies needed.
 */
export default function TiltCard({ 
    children, 
    className,
    tiltAmount = 10,
    scale = 1.02,
    perspective = 1000,
    glare = true
}: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Motion values for mouse position
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Spring physics for smooth animation
    const springConfig = { stiffness: 300, damping: 30 };
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [tiltAmount, -tiltAmount]), springConfig);
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-tiltAmount, tiltAmount]), springConfig);
    
    // Glare position
    const glareX = useSpring(useTransform(x, [-0.5, 0.5], [0, 100]), springConfig);
    const glareY = useSpring(useTransform(y, [-0.5, 0.5], [0, 100]), springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Normalize to -0.5 to 0.5
        const normalizedX = (e.clientX - centerX) / rect.width;
        const normalizedY = (e.clientY - centerY) / rect.height;

        x.set(normalizedX);
        y.set(normalizedY);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            className={cn("relative", className)}
            style={{
                perspective,
                transformStyle: "preserve-3d"
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            whileHover={{ scale }}
        >
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d"
                }}
                className="relative w-full h-full"
            >
                {children}
                
                {/* Glare effect */}
                {glare && (
                    <motion.div
                        className="absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden"
                        style={{
                            opacity: isHovered ? 0.15 : 0,
                            background: `radial-gradient(circle at ${glareX.get()}% ${glareY.get()}%, white 0%, transparent 50%)`
                        }}
                        animate={{
                            opacity: isHovered ? 0.15 : 0
                        }}
                        transition={{ duration: 0.2 }}
                    />
                )}
            </motion.div>
        </motion.div>
    );
}
