export const easeOut = [0.22, 1, 0.36, 1]

export const pageTransition = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.35, ease: easeOut },
}

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
}

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: easeOut },
  },
}

export const sidebarItem = {
  hidden: { opacity: 0, x: -16 },
  show: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.04, duration: 0.3, ease: easeOut },
  }),
}

export const shake = {
  x: [0, -10, 10, -8, 8, -4, 4, 0],
  transition: { duration: 0.5 },
}

export const correctPulse = {
  scale: [1, 1.04, 1, 1.02, 1],
  transition: { duration: 0.6, ease: easeOut },
}

export const navbarDrop = {
  initial: { y: -56, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.45, ease: easeOut },
}
