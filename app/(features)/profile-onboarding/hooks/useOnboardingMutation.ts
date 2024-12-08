import { useMutation } from '@tanstack/react-query';
import { saveOnboardingData } from '@profile-onboarding/actions/onboardingServerActions';
import type { OnboardingData } from '@profile-onboarding/actions/onboardingServerActions';
import { useToast } from '@/app/hooks/use-toast';
import { useRouter } from 'next/navigation';

export function useOnboardingMutation() {
  const { toast } = useToast();
  const router = useRouter();

  return useMutation({
    mutationKey: ['saveOnboarding'],
    mutationFn: async (data: OnboardingData) => {
      const result = await saveOnboardingData(data);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      toast({
        title: 'Profile Complete!',
        description: 'Welcome to BookBuddy. Redirecting to your dashboard...',
      });
      router.push('/dashboard');
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to complete profile setup. Please try again.',
        variant: 'destructive',
      });
    },
  });
}
