"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, easeInOut, easeOut, easeIn } from "framer-motion";
import ThankYouPage from "@/component/ThankYou";
import { Suspense } from "react";
import "@/styles/form.css";
const images = [
  "/r4.jpg",
  "/s2-co2py.jpg",
  "/r2.jpg",
  "/r3.jpg",
];

// Entry/Exit transitions
const transitions = [
  {
    initial: { opacity: 0, scale: 1.05 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
    transition: { duration: 1.2, ease: easeInOut },
  },
  {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
    transition: { duration: 1.2, ease: easeInOut },
  },
  {
    initial: { opacity: 0, filter: "blur(15px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    exit: { opacity: 0, filter: "blur(15px)" },
    transition: { duration: 1.3, ease: easeOut },
  },
  {
    initial: { opacity: 0, scale: 1.02, rotate: -2 },
    animate: { opacity: 1, scale: 1, rotate: 0 },
    exit: { opacity: 0, scale: 1.02, rotate: 2 },
    transition: { duration: 1.2, ease: easeIn },
  },
];

// Alive background motions — smaller movement so no edges show
const aliveMotions = [
  { scale: [1, 1.03, 1], backgroundPosition: ["center", "center 5%", "center"] },
  { scale: [1, 1.02, 1], rotate: [0, 0.5, 0] },
  { scale: [1, 1.03, 1], backgroundPosition: ["center", "center -5%", "center"] },
  { scale: [1, 1.02, 1], rotate: [0, -0.5, 0] },
];

export default function ThankYou() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const animation = transitions[currentImage % transitions.length];
  const alive = aliveMotions[currentImage % aliveMotions.length];

  return (
    <div className="main-form-container">
      {/* Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImage}
          className="main-form-img-container"
        >
          <motion.div
            initial={animation.initial}
            animate={animation.animate}
            exit={animation.exit}
            transition={animation.transition}
            className="sub-main-form-img-container"
            style={{
              backgroundImage: `url(${images[currentImage]})`,
            }}
          >
            {/* Alive effect */}
            <motion.div
              className="absolute inset-0"
              animate={alive}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: easeInOut,
              }}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Overlay */}
      <div className="overlay" />

      {/* Form */}
      <div className="container">
        <Suspense fallback={<div>Loading...</div>}>
        <ThankYouPage/></Suspense>
      </div>
    </div>
  );
}
