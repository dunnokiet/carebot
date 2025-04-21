import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import firebase from '@react-native-firebase/app';
import { Platform } from 'react-native';



// Define the shape of our context
type AuthContextType = {
  user: FirebaseAuthTypes.User | null;
  isGuest: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<FirebaseAuthTypes.UserCredential>;
  signUp: (email: string, password: string, displayName: string) => Promise<FirebaseAuthTypes.UserCredential>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<FirebaseAuthTypes.UserCredential | null>;
  updateProfile: (data: { displayName?: string; photoURL?: string }) => Promise<void>;
  continueAsGuest: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { readonly children: ReactNode }) {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  // Initialize Firebase if it hasn't been initialized yet
  useEffect(() => {
    if (!firebase.apps.length) {
        const firebaseConfig = {
          apiKey:
            Platform.OS === 'ios'
              ? process.env.EXPO_PUBLIC_FIREBASE_API_KEY_IOS
              : process.env.EXPO_PUBLIC_FIREBASE_API_KEY_ANDROID,
          appId:
            Platform.OS === 'ios'
              ? process.env.EXPO_PUBLIC_FIREBASE_APP_ID_IOS
              : process.env.EXPO_PUBLIC_FIREBASE_APP_ID_ANDROID,
          projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
          authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
          databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
          storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        };
      
      firebase.initializeApp(firebaseConfig);
    }
  }, []);

  // Initialize GoogleSignin
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    });

  }, []);

  // Handle user state changes
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        setIsGuest(false);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  // Continue as guest function
  const continueAsGuest = () => {
    setIsGuest(true);
    setUser(null);
    setLoading(false);
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    setIsGuest(false);
    return await auth().signInWithEmailAndPassword(email, password);
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, displayName: string) => {
    setIsGuest(false);
    const credential = await auth().createUserWithEmailAndPassword(email, password);
    await credential.user.updateProfile({ displayName });
    return credential;
  };

  // Sign out
  const signOut = async () => {
    if (isGuest) {
      setIsGuest(false);
      return Promise.resolve();
    }
    return await auth().signOut();
  };

  // Reset password
  const resetPassword = async (email: string) => {
    await auth().sendPasswordResetEmail(email);
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setIsGuest(false);
      await GoogleSignin.hasPlayServices();
      
      await GoogleSignin.signIn();
      
      const { idToken } = await GoogleSignin.getTokens();
      
      if (!idToken) {
        throw new Error('No ID token present in Google Sign-In response');
      }

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      return await auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.error("Google sign in error:", error);
      return null;
    }
  };

  // Update user profile
  const updateProfile = async (data: { displayName?: string; photoURL?: string }) => {
    if (user) {
      await user.updateProfile(data);
    }
  };

  const value = useMemo(() => ({
    user,
    isGuest,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    signInWithGoogle,
    updateProfile,
    continueAsGuest
  }), [user, isGuest, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}