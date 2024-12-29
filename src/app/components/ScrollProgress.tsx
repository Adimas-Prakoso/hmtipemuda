'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <>
      {/* Right scrollbar - moves down */}
      <motion.div
        className="fixed right-0 top-0 bottom-0 w-1 bg-blue-100/20"
        style={{
          originY: 0
        }}
      >
        <motion.div
          className="w-full h-full bg-blue-500"
          style={{
            scaleY,
            originY: 0,
            filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))'
          }}
        />
      </motion.div>

      {/* Left scrollbar - moves up */}
      <motion.div
        className="fixed left-0 top-0 bottom-0 w-1 bg-blue-100/20"
        style={{
          originY: 1
        }}
      >
        <motion.div
          className="w-full h-full bg-blue-500"
          style={{
            scaleY,
            originY: 1,
            filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))'
          }}
        />
      </motion.div>
    </>
  )
}
