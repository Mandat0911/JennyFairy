import React from 'react'
import {motion} from'framer-motion'

const FloatingShape = ({color, size, top, left, delay}) => {
  return (
    <motion.div className={`absolute rounded-full ${color} ${size} opacity-10 blur-xl`}
    style={{top, left, pointerEvents: "none" }}
    animate={{
      y: [0, -50, 0],
      x: [0, 50, 0],
      rotate: [0, 360],
    }}
    transition={{
      duration: 20,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "mirror",
      delay,
    }}
    aria-hidden="true"
    />
  )
}

export default FloatingShape