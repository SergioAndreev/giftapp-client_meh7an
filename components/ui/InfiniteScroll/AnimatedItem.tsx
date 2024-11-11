import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedItemProps {
  index: number;
  totalItems: number;
  children: ReactNode;
}

export const AnimatedItem = ({
  index,
  totalItems,
  children,
}: AnimatedItemProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{
      delay: totalItems - index < 10 ? (index % 10) * 0.03 : 0,
    }}
  >
    {children}
  </motion.div>
);
