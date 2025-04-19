"use client"

import { motion, AnimatePresence } from "framer-motion"
import SideBar from "../DashBoardSideBar/SideBar"

export function ResponsiveMenu({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: "-100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "-100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed inset-0 z-50 sm:hidden"
        >
          <SideBar isMobile={true} onClose={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
