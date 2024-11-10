'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { BookOpen, Target, BookMarked, ChevronRight, ChevronLeft, Clock, CheckCircle2 } from 'lucide-react';

const AnimatedProgress = ({ value }: { value: number }) => (
  <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden">
    <motion.div
      className="absolute left-0 top-0 bottom-0 bg-blue-600 rounded-full"
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{
        type: 'spring',
        stiffness: 50,
        damping: 15,
        mass: 1,
      }}
    />
    <motion.div
      className="absolute top-1/2 -translate-y-1/2 h-4 w-4 bg-blue-600 rounded-full border-2 border-white shadow-md"
      animate={{ left: `${value}%` }}
      transition={{
        type: 'spring',
        stiffness: 50,
        damping: 15,
        mass: 1,
      }}
    />
  </div>
);

const containerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

const ProfileOnboarding = () => {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [progress, setProgress] = useState(0);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [completedSteps, setCompletedSteps] = useState(['welcome']);

  const steps = ['welcome', 'genres', 'goals', 'schedule', 'complete'];

  const updateProgress = (step: string) => {
    const currentIndex = steps.indexOf(step);
    setProgress((currentIndex / (steps.length - 1)) * 100);
  };

  const handleStepClick = (step: string) => {
    const stepIndex = steps.indexOf(step);
    if (completedSteps.includes(step) || stepIndex === completedSteps.length) {
      setCurrentStep(step);
      updateProgress(step);
    }
  };

  const handleNext = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      setCurrentStep(nextStep);
      updateProgress(nextStep);
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
    }
  };

  const handleBack = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      const previousStep = steps[currentIndex - 1];
      setCurrentStep(previousStep);
      updateProgress(previousStep);
    }
  };

  const ProgressSteps = () => (
    <div className="flex justify-between px-2 mt-2">
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(step);
        const isCurrent = currentStep === step;
        const isClickable = isCompleted || index === completedSteps.length;

        return (
          <motion.button
            key={step}
            onClick={() => handleStepClick(step)}
            disabled={!isClickable}
            className={`flex flex-col items-center flex-1 cursor-pointer ${isClickable ? 'hover:opacity-80' : 'cursor-not-allowed opacity-50'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
              color: isCurrent ? 'rgb(37, 99, 235)' : isCompleted ? 'rgb(37, 99, 235)' : 'rgb(156, 163, 175)',
            }}
          >
            <div className="text-xs font-medium capitalize">{step}</div>
            <div className="text-xs">
              {index + 1}/{steps.length}
            </div>
            {isCompleted && !isCurrent && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-1">
                <CheckCircle2 className="w-3 h-3" />
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );

  const StepContent = () => {
    switch (currentStep) {
      case 'welcome':
        return (
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
        );

      case 'genres':
        return (
          <motion.div variants={containerVariants} className="space-y-6">
            <motion.h2 variants={itemVariants} className="text-3xl font-bold">
              What do you like to read?
            </motion.h2>
            <motion.p variants={itemVariants} className="text-gray-600">
              {`Select your favorite genres to help us recommend books you'll love`}
            </motion.p>
            <motion.div variants={containerVariants} className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['Fiction', 'Non-Fiction', 'Mystery', 'Science Fiction', 'Fantasy', 'Romance', 'Thriller', 'Biography', 'Self-Help'].map((genre) => (
                <motion.div key={genre} variants={itemVariants}>
                  <Button variant={selectedGenres.includes(genre) ? 'default' : 'outline'} className="w-full h-auto py-4 px-6 text-left justify-start" onClick={() => setSelectedGenres((prev: string[]) => (prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]))}>
                    <BookMarked className="w-5 h-5 mr-2" />
                    {genre}
                    {selectedGenres.includes(genre) && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
                        <CheckCircle2 className="h-5 w-5 text-white" />
                      </motion.div>
                    )}
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        );

      case 'goals':
        return (
          <motion.div variants={containerVariants} className="space-y-6">
            <motion.h2 variants={itemVariants} className="text-3xl font-bold">
              Set Your Reading Goals
            </motion.h2>
            <motion.p variants={itemVariants} className="text-gray-600">
              What would you like to achieve with your reading?
            </motion.p>
            <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  id: 'books',
                  title: 'Books per Month',
                  description: 'Set a target number of books to read each month',
                  icon: Target,
                },
                {
                  id: 'time',
                  title: 'Reading Time',
                  description: 'Set daily or weekly reading time goals',
                  icon: Clock,
                },
              ].map((goal) => (
                <motion.div key={goal.id} variants={itemVariants}>
                  <Button variant={selectedGoal === goal.id ? 'default' : 'outline'} className="w-full h-auto p-6 text-left" onClick={() => setSelectedGoal(goal.id)}>
                    <div className="flex items-center w-full">
                      <goal.icon className="w-6 h-6 mr-2" />
                      <div>
                        <div className="font-semibold">{goal.title}</div>
                        <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                      </div>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        );

      case 'schedule':
        return (
          <motion.div variants={containerVariants} className="space-y-6">
            <motion.h2 variants={itemVariants} className="text-3xl font-bold">
              Your Reading Schedule
            </motion.h2>
            <motion.p variants={itemVariants} className="text-gray-600">
              When do you prefer to read? This helps us send timely reminders.
            </motion.p>
            <motion.div variants={containerVariants} className="space-y-4">
              {[
                { id: 'morning', label: 'Morning (6AM - 12PM)', icon: '🌅' },
                { id: 'afternoon', label: 'Afternoon (12PM - 5PM)', icon: '☀️' },
                { id: 'evening', label: 'Evening (5PM - 10PM)', icon: '🌆' },
                { id: 'night', label: 'Night (10PM - 6AM)', icon: '🌙' },
              ].map((time) => (
                <motion.div key={time.id} variants={itemVariants}>
                  <Button variant={selectedTimes.includes(time.id) ? 'default' : 'outline'} className="w-full justify-start" onClick={() => setSelectedTimes((prev) => (prev.includes(time.id) ? prev.filter((t) => t !== time.id) : [...prev, time.id]))}>
                    <span className="mr-2">{time.icon}</span>
                    {time.label}
                    {selectedTimes.includes(time.id) && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
                        <CheckCircle2 className="h-5 w-5 text-white" />
                      </motion.div>
                    )}
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        );

      case 'complete':
        return (
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
            <Button className="mt-6">Take Me to My Dashboard</Button>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8 space-y-2">
          <AnimatedProgress value={progress} />
          <ProgressSteps />
        </div>

        <Card className="border-none shadow-lg">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              <motion.div key={currentStep} variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
                <StepContent />
                <div className="flex justify-between pt-6">
                  <Button variant="ghost" onClick={handleBack} disabled={currentStep === 'welcome'} className="flex items-center">
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button onClick={handleNext} disabled={currentStep === 'complete'} className="flex items-center">
                    {currentStep === 'schedule' ? 'Complete Profile' : 'Next'}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileOnboarding;
