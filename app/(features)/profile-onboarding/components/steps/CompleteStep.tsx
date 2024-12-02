import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { containerVariants, itemVariants } from '../_animations';

interface CompleteStepProps {
  onDashboardClick: () => void;
}

export const CompleteStep = ({ onDashboardClick }: CompleteStepProps) => (
  <motion.div variants={containerVariants} className="text-center space-y-6">
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 15,
      }}
      className="inline-block p-3 rounded-full bg-green-100 mb-6"
    >
      <CheckCircle2 className="w-16 h-16 text-green-600" />
    </motion.div>
    <motion.h2 variants={itemVariants} className="text-3xl font-bold">
      {`You're All Set!`}
    </motion.h2>
    <motion.p variants={itemVariants} className="text-xl text-gray-600">
      {`Your profile is complete and we're ready to start recommending books just for you.`}
    </motion.p>
    <Button onClick={onDashboardClick} className="mt-6">
      Take Me to My Dashboard
    </Button>
  </motion.div>
);
