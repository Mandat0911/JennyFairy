import React from 'react'
import {motion} from'framer-motion'

const FloatingShape = ({color, size, top, left, delay}) => {
  return (
    <motion.div className={`absolute rounded-full ${color} ${size} opacity-20 blur-xl`}
    style={{top, left, pointerEvents: "none" }}
    animate={{y: ["0%", "100%", "0%"], x: ["0%", "100%", "0%"], rotate: [0, 360]}}
    transition={{
        duration: 20,
        ease: "linear",
        // times: [0, 0.5, 1],
        repeat: Infinity,
        delay: delay 
    }}
    aria-hidden="true"
    />
  )
}

export default FloatingShape