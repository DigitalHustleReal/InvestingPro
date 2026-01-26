"use client";

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * ScrollProgressBar Component
 * 
 * A thin progress bar at the top of the page that shows scroll progress.
 * Modern UI pattern used by Stripe, Linear, and other premium sites.
 */
export default function ScrollProgressBar() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 origin-left z-[100]"
            style={{ scaleX }}
        />
    );
}
