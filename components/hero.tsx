"use client";

import { HeroContent } from "@/components/sub/hero-content";
import Video from "next-video";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Particles } from "@/components/ui/sparkles";

export const Hero = () => {
  return (
    <section className="relative flex items-center justify-center min-h-screen w-full overflow-hidden">
      {/* Background Elements */}
      <Particles
        className="absolute inset-0 z-0"
        quantity={100}
        ease={80}
        color="#858585"
        refresh
      />


        {/* <Image
          src={require("@/assets/eclipse.svg")}
          alt=""
          fill
          className="blur-lg opacity-60 object-cover top-[10rem] scale-125"
          priority
        /> */}
      <div className="absolute inset-0 z-0">
        <Image
          src={require("@/assets/eclipse.svg")}
          alt=""
          fill
          className="blur-lg opacity-60 object-cover top-[10rem] scale-125"
          priority
        />
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20" />

        {/* Animated particles */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full"
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Main Heading with Stagger Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <motion.h1
            className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-tight lg:leading-[1.1]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Unlock Seamless{" "}
            <motion.span
              className="block bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Space-Biology Research
            </motion.span>
          </motion.h1>
        </motion.div>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-12 max-w-4xl leading-relaxed"
        >
          The Advanced Knowledge Engine for Space Biology Science, powered by{" "}
          <span className="text-blue-400 font-semibold">
            NASA Open Science Data System
          </span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link href="/sign-in">
            <Button
              size="lg"
              className="font-semibold text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
            >
              Explore Now
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button
              variant="outline"
              size="lg"
              className="font-semibold text-lg px-8 py-6 border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              Learn More
            </Button>
          </Link>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute bottom-[-1rem] left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center text-blue-400"
          >
            <span className="text-sm mb-2">Scroll to explore</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </div>

      {/* Additional decorative elements */}
      <div className="absolute top-1/4 left-10 w-4 h-4 bg-blue-400 rounded-full opacity-60 blur-sm" />
      <div className="absolute bottom-1/4 right-20 w-6 h-6 bg-purple-400 rounded-full opacity-40 blur-sm" />
      <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-cyan-400 rounded-full opacity-50 blur-sm" />
    </section>
  );
};
