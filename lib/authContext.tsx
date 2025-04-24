import { SplashScreen, useRouter } from "expo-router";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  FirebaseAuthTypes,
  GoogleAuthProvider,
  getAuth,
} from "@react-native-firebase/auth";
import {
  GoogleSignin,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";

SplashScreen.preventAutoHideAsync();

type AuthState = {
  user: FirebaseAuthTypes.User | null;
  initializing: boolean;
  signIn: () => void;
  signOut: () => void;
};

export const AuthContext = createContext<AuthState>({
  user: null,
  initializing: true,
  signIn: () => {},
  signOut: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: PropsWithChildren) {
  const router = useRouter();

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    if (initializing) return;

    if (user) {
      router.replace("/");
    } else {
      router.replace("/login");
    }
  }, [user, initializing]);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
    });
  }, []);

  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged((user) => {
      setUser(user);
      if (initializing) {
        setInitializing(false);
        SplashScreen.hideAsync();
      }
    });

    return unsubscribe;
  }, []);

  const signIn = async () => {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();

    if (isSuccessResponse(response)) {
      const { idToken } = response.data;
      const credential = GoogleAuthProvider.credential(idToken);
      await getAuth().signInWithCredential(credential);
    }
  };

  const signOut = async () => {
    await getAuth().signOut();
    await GoogleSignin.signOut();
  };

  if (initializing) return null;

  return (
    <AuthContext.Provider value={{ user, initializing, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
