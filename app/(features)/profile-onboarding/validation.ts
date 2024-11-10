// Validate a specific step
import { OnboardingData } from './onboarding';

export const validateStep = (step: string, data: OnboardingData): boolean => {
  console.log('Validating step:', step); // Debug log
  switch (step) {
    case 'welcome':
      return true;
    case 'genres':
      const hasGenres = data.selectedGenres.length > 0;
      console.log('Genres validation:', hasGenres, data.selectedGenres); // Debug log
      return hasGenres;
    case 'goals':
      const hasGoal = data.selectedGoal !== null;
      console.log('Goals validation:', hasGoal, data.selectedGoal); // Debug log
      return hasGoal;
    case 'schedule':
      const hasTimes = data.selectedTimes.length > 0;
      console.log('Schedule validation:', hasTimes, data.selectedTimes); // Debug log
      return hasTimes;
    case 'complete':
      return true;
    default:
      return false;
  }
};

export const getValidationMessage = (step: string): string => {
  switch (step) {
    case 'genres':
      return 'Please select at least one genre before proceeding';
    case 'goals':
      return 'Please select a reading goal before proceeding';
    case 'schedule':
      return 'Please select at least one preferred reading time';
    default:
      return 'Please complete the current step before proceeding';
  }
};
