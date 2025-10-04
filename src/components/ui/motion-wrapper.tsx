"use client";

import { motion, MotionProps } from "framer-motion";
import { ReactNode } from "react";

interface MotionWrapperProps extends MotionProps {
  children: ReactNode;
  className?: string;
  type?:
    | "fade"
    | "slide-up"
    | "slide-down"
    | "slide-left"
    | "slide-right"
    | "scale"
    | "fade-up"
    | "fade-down"
    | "spring-up"
    | "bounce-in"
    | "fade-scale"
    | "slide-fade-up"
    | "gentle-bounce";
  duration?: number;
  delay?: number;
  staggerChildren?: number;
  useViewport?: boolean;
}

const animations = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  "slide-up": {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
  "slide-down": {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
  },
  "slide-left": {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
  },
  "slide-right": {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
  },
  "fade-up": {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  },
  "fade-down": {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
  },
  "spring-up": {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
  },
  "bounce-in": {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
  },
  "fade-scale": {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
  },
  "slide-fade-up": {
    initial: { opacity: 0, y: 15, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
  },
  "gentle-bounce": {
    initial: { opacity: 0, y: 20, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
  },
};

const MotionWrapper = ({
  children,
  className,
  type = "fade",
  duration = 0.5,
  delay = 0,
  staggerChildren,
  useViewport = false,
  ...props
}: MotionWrapperProps) => {
  const getTransition = () => {
    const baseTransition = { duration, delay };

    if (type === "spring-up") {
      return {
        ...baseTransition,
        type: "spring",
        stiffness: 260,
        damping: 20,
      };
    }

    if (type === "bounce-in") {
      return {
        ...baseTransition,
        type: "spring",
        stiffness: 400,
        damping: 25,
      };
    }

    if (type === "gentle-bounce") {
      return {
        ...baseTransition,
        type: "spring",
        stiffness: 300,
        damping: 30,
      };
    }

    if (type === "fade-scale" || type === "slide-fade-up") {
      return {
        ...baseTransition,
        ease: [0.6, -0.05, 0.01, 0.99],
      };
    }

    if (staggerChildren) {
      return {
        ...baseTransition,
        staggerChildren,
      };
    }

    return baseTransition;
  };

  // If useViewport is true, use whileInView instead of animate
  const motionProps = useViewport
    ? {
        initial: animations[type].initial,
        whileInView: animations[type].animate,
        viewport: { once: true, margin: "-100px" },
        transition: getTransition(),
      }
    : {
        initial: animations[type].initial,
        animate: animations[type].animate,
        transition: getTransition(),
      };

  return (
    <motion.div className={className} {...motionProps} {...props}>
      {children}
    </motion.div>
  );
};

export default MotionWrapper;
