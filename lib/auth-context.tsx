import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from 'react';
import { Platform } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  initializeApp,
  getApp,
} from '@react-native-firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  signInWithCredential,
  GoogleAuthProvider,
  updateProfile as updateUserProfile,
  type User,
  type UserCredential,
} from '@react-native-firebase/auth';

// Context type
type AuthContextType = {
  user: User | null;
  isGuest: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signUp: (email: string, password: string, displayName: string) => Promise<UserCredential>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<UserCredential | null>;
  updateProfile: (data: { displayName?: string; photoURL?: string }) => Promise<void>;
  continueAsGuest: () => void;
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Firebase initialization
const initFirebaseApp = () => {
  try {
    getApp();
  } catch {
    const firebaseConfig = {
      apiKey: Platform.OS === 'ios'
        ? process.env.EXPO_PUBLIC_FIREBASE_API_KEY_IOS
        : process.env.EXPO_PUBLIC_FIREBASE_API_KEY_ANDROID,
      appId: Platform.OS === 'ios'
        ? process.env.EXPO_PUBLIC_FIREBASE_APP_ID_IOS
        : process.env.EXPO_PUBLIC_FIREBASE_APP_ID_ANDROID,
      projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
      storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    };
    initializeApp(firebaseConfig);
  }
};

// Google Sign-In setup
const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });
};

// Provider component
export function AuthProvider({ children }: { readonly children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initFirebaseApp();
    configureGoogleSignIn();
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsGuest(!currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const continueAsGuest = () => {
    setUser(null);
    setIsGuest(true);
    setLoading(false);
  };

  const signIn = async (email: string, password: string) => {
    setIsGuest(false);
    return signInWithEmailAndPassword(getAuth(), email, password);
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    setIsGuest(false);
    const auth = getAuth();
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    if (credential.user) {
      await updateUserProfile(credential.user, { displayName });
    }
    return credential;
  };

  const signOut = async () => {
    if (isGuest) {
      setIsGuest(false);
      return Promise.resolve();
    }
    return firebaseSignOut(getAuth());
  };

  const resetPassword = async (email: string) => {
    return sendPasswordResetEmail(getAuth(), email);
  };

    const signInWithGoogle = async () => {
      try {
        setIsGuest(false);
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        const userInfo = await GoogleSignin.signIn();
        const { idToken } = await GoogleSignin.getTokens();

        if (!idToken) throw new Error('Missing Google ID Token');

        const googleCredential = GoogleAuthProvider.credential(idToken);
        const auth = getAuth();
        const result = await signInWithCredential(auth, googleCredential);
        return result;
      } catch (error: any) {
        console.error('Google Sign-In Error:', error.code, error.message, error);
        return null;
      }
    };


  const updateProfile = async (data: { displayName?: string; photoURL?: string }) => {
    if (user) {
      await updateUserProfile(user, data);
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
    continueAsGuest,
  }), [user, isGuest, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
