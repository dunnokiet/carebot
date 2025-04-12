import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Key for storing onboarding status in AsyncStorage
const ONBOARDING_COMPLETE_KEY = '@carebot:onboarding_complete';

// Define the shape of our context
type OnboardingContextType = {
  hasSeenOnboarding: boolean;
  setHasSeenOnboarding: (value: boolean) => Promise<void>;
  loading: boolean;
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { readonly children: ReactNode }) {
  const [hasSeenOnboarding, setHasSeenOnboardingState] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Load the onboarding status from AsyncStorage on mount
  useEffect(() => {
    const loadOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY);
        setHasSeenOnboardingState(value === 'true');
      } catch (error) {
        console.error('Error loading onboarding status:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOnboardingStatus();
  }, []);

  // Function to update the onboarding status
  const setHasSeenOnboarding = async (value: boolean) => {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, value.toString());
      setHasSeenOnboardingState(value);
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        hasSeenOnboarding,
        setHasSeenOnboarding,
        loading,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

// Custom hook to use the onboarding context
export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}