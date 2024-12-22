import React from 'react';
import { Highlighter } from 'lucide-react';
import { motion } from 'framer-motion';

interface HighlightStatsProps {
  highlightsThisMonth: number;
}

export const HighlightStats = ({ highlightsThisMonth }: HighlightStatsProps) => {
  return (
    <div className="pt-6 relative">
      <div className="pb-2 text-gray-400">
        <Highlighter className="w-5 h-5" />
      </div>
      <p className="text-sm font-medium text-gray-600">Highlights This Month</p>
      <p className="font-semibold">{highlightsThisMonth} highlights</p>

      <motion.p
        className="text-xs text-gray-500 mt-1"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.8 }}
      >
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 1 }}></motion.span>
      </motion.p>
    </div>
  );
};

export default HighlightStats;
