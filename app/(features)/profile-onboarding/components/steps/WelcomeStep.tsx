import { motion } from 'framer-motion';
import { BookOpen, Target, Clock } from 'lucide-react';
import { containerVariants, itemVariants } from '../_animations';
import { STEPS } from '../../constants';

export const WelcomeStep = () => (
  <div data-testid={`step-content-${STEPS[0]}`}>
    <motion.div variants={containerVariants} className="text-center space-y-6">
      <motion.h1 variants={itemVariants} className="text-4xl font-bold">
        Welcome to BookBuddy
      </motion.h1>
      <motion.p variants={itemVariants} className="text-xl text-gray-600">
        {`Let's personalize your reading experience`}
      </motion.p>
      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {[
          {
            icon: BookOpen,
            title: 'Discover Books',
            description: 'Get personalized recommendations',
          },
          {
            icon: Target,
            title: 'Track Goals',
            description: 'Set and achieve your reading goals',
          },
          {
            icon: Clock,
            title: 'Build Habits',
            description: 'Develop consistent reading habits',
          },
        ].map((feature, index) => (
          <motion.div key={index} variants={itemVariants} className="p-6 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
            <feature.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  </div>
);
