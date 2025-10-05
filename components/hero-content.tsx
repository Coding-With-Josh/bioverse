"use client"

import { SparklesIcon, RocketLaunchIcon } from "@heroicons/react/24/solid"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const slideInFromTop = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.2,
      duration: 0.5,
    },
  },
}

const slideInFromLeft = (delay: number) => ({
  hidden: { x: -100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      delay,
      duration: 0.5,
    },
  },
})

const slideInFromRight = (delay: number) => ({
  hidden: { x: 100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      delay,
      duration: 0.5,
    },
  },
})

export const HeroContent = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="flex flex-col lg:flex-row items-center justify-center px-4 md:px-20 mt-20 md:mt-32 w-full z-[20] gap-12"
    >
      <div className="h-full w-full flex flex-col gap-5 justify-center text-center lg:text-left max-w-2xl">
        <motion.div
          variants={slideInFromTop}
          className="inline-flex items-center gap-2 py-2 px-4 border border-primary/30 rounded-full bg-primary/5 backdrop-blur-sm mx-auto lg:mx-0 w-fit"
        >
          <SparklesIcon className="text-primary h-5 w-5" />
          <h2 className="text-sm font-medium text-primary">NASA Space Biology Knowledge Engine</h2>
        </motion.div>

        <motion.div variants={slideInFromLeft(0.5)} className="flex flex-col gap-6 mt-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
            Explore{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F9CF9] via-[#F97316] to-[#06B6D4]">
              600+ Studies
            </span>{" "}
            of Life in Space
          </h1>
        </motion.div>

        <motion.p variants={slideInFromLeft(0.8)} className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          Unlock decades of NASA space biology research. From microgravity effects on human health to cultivating life
          beyond Earth—discover insights that shape humanity's future in space.
        </motion.p>

        <motion.div
          variants={slideInFromLeft(1)}
          className="flex flex-col sm:flex-row gap-4 mt-4 justify-center lg:justify-start"
        >
          <Link href="/sign-in">
            <Button size="lg" className="cosmic-glow text-lg px-8 py-6 bg-primary hover:bg-primary/90 w-full sm:w-auto">
              <RocketLaunchIcon className="w-5 h-5 mr-2" />
              Start Exploring
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 w-full sm:w-auto bg-transparent">
              Learn More
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={slideInFromLeft(1.2)}
          className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-border/50"
        >
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary">600+</div>
            <div className="text-sm text-muted-foreground mt-1">Publications</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-accent">50+</div>
            <div className="text-sm text-muted-foreground mt-1">Years of Data</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-secondary">2</div>
            <div className="text-sm text-muted-foreground mt-1">AI Interfaces</div>
          </div>
        </motion.div>
      </div>

      <motion.div
        variants={slideInFromRight(0.8)}
        className="w-full lg:w-1/2 h-full flex justify-center items-center relative"
      >
        <div className="relative w-full max-w-[600px] aspect-square">
          {/* Animated space background */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 blur-3xl animate-pulse" />

         

          {/* Floating elements */}
          <motion.div
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="relative z-10 w-full h-full object-contain select-none top-[-12rem] scale-75 right-10"
          >
 {/* Placeholder for space imagery */}
          <Image
            src={require("@/assets/download.png")}
            alt="Space Biology Visualization"
            // className="relative z-10 w-full h-full object-contain select-none"
            draggable={false}
          />          </motion.div>
          <motion.div
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute top-10 right-10 w-16 h-16 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 flex items-center justify-center"
          >
            <SparklesIcon className="w-8 h-8 text-primary" />
          </motion.div>

          <motion.div
            animate={{
              y: [0, 20, 0],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute bottom-20 left-10 w-20 h-20 rounded-full bg-accent/20 backdrop-blur-sm border border-accent/30"
          />
        </div>
      </motion.div>
    </motion.div>
  )
}
