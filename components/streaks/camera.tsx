import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Button,
} from "react-native";
import {
  MediapipeCamera,
  RunningMode,
  usePoseDetection,
  KnownPoseLandmarks,
  KnownPoseLandmarkConnections,
} from "react-native-mediapipe";
import {
  useCameraDevice,
  useCameraPermission,
  Camera,
} from "react-native-vision-camera";
import * as FileSystem from "expo-file-system";
import { Skia, Canvas, Path, vec, SkPoint } from "@shopify/react-native-skia";
import { useRouter } from "expo-router"; // For navigation
import { useAuth } from "~/lib/authContext";
import { useLocalSearchParams } from "expo-router";
import firestore, {
  doc,
  getDoc,
  setDoc,
} from "@react-native-firebase/firestore"; // ✅

export const db = firestore();

export default function MediaPipeCam() {
  const router = useRouter();
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("front");

  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);
  const [modelPath, setModelPath] = useState<string | null>(null);
  const [isModelReady, setIsModelReady] = useState(false);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const { challengeLevel = "easy", current_reps = "0" } =
    useLocalSearchParams();

  // Debug log to see what params we're receiving
  console.log("Camera received params:", { challengeLevel, current_reps });

  const repsGoal =
    challengeLevel === "easy" ? 5 : challengeLevel === "medium" ? 10 : 20;

  const [connections, setConnections] = useState<SkPoint[]>([]);
  const [wasDown, setWasDown] = useState(false);
  const [isCounting, setIsCounting] = useState(false);
  const [count, setCount] = useState(0); // Initialize with 0
  const [countdown, setCountdown] = useState<number | null>(null); // Countdown state

  // Update count from navigation params when they change
  useEffect(() => {
    if (current_reps) {
      const parsedCount = parseInt(current_reps as string);
      if (!isNaN(parsedCount)) {
        console.log("Updating count from params:", parsedCount);
        setCount(parsedCount);
      }
    }
  }, [current_reps]);

  const onResults = useCallback(
    (results: any, vc: any) => {
      if (!isCounting || results.results?.[0]?.landmarks?.[0]?.length === 0)
        return;

      const frameDims = vc.getFrameDims(results);
      const pts = results.results?.[0]?.landmarks?.[0] ?? [];
      const newLines: SkPoint[] = [];

      for (const [a, b] of KnownPoseLandmarkConnections) {
        const pt1 = vc.convertPoint(frameDims, pts[a]);
        const pt2 = vc.convertPoint(frameDims, pts[b]);
        newLines.push(vec(pt1.x, pt1.y));
        newLines.push(vec(pt2.x, pt2.y));
      }

      setConnections(newLines);

      if (isCounting) {
        const leftKnee = KnownPoseLandmarks.leftKnee;
        const rightKnee = KnownPoseLandmarks.rightKnee;
        const leftHip = KnownPoseLandmarks.leftHip;
        const rightHip = KnownPoseLandmarks.rightHip;

        if (leftKnee && rightKnee && leftHip && rightHip) {
          const avgKneeY = (pts[leftKnee].y + pts[rightKnee].y) / 2;
          const avgHipY = (pts[leftHip].y + pts[rightHip].y) / 2;
          const down = avgHipY > avgKneeY + 0.1;

          if (down && !wasDown) {
            setWasDown(true);
          } else if (!down && wasDown) {
            setWasDown(false);
            setCount((prev) => prev + 1);
          }
        }
      }
    },
    [wasDown, isCounting],
  );

  const validModelPath = isModelReady && modelPath ? modelPath : "";
  const poseDetection = usePoseDetection(
    {
      onResults,
      onError: (error) => console.error("Pose detection error:", error),
    },
    RunningMode.LIVE_STREAM,
    validModelPath,
  );

  useEffect(() => {
    const checkAndRequestPermission = async () => {
      let status = await Camera.getCameraPermissionStatus();
      if (status !== "authorized") {
        await requestPermission();
        status = await Camera.getCameraPermissionStatus();
      }
      setPermissionStatus(status);
    };
    checkAndRequestPermission();
  }, []);

  useEffect(() => {
    if (permissionStatus === "authorized" || permissionStatus === "granted") {
      const loadModel = async () => {
        try {
          const modelUrl =
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/latest/pose_landmarker_full.task";
          const destPath =
            FileSystem.cacheDirectory + "pose_landmarker_full.task";

          const fileInfo = await FileSystem.getInfoAsync(destPath);
          if (fileInfo.exists) {
            setModelPath(fileInfo.uri.replace("file://", ""));
            setIsModelReady(true);
          } else {
            const downloadResult = await FileSystem.downloadAsync(
              modelUrl,
              destPath,
            );
            setModelPath(downloadResult.uri.replace("file://", ""));
            setIsModelReady(true);
          }
        } catch (err) {
          console.error("❌ Model download error:", err);
          setIsModelReady(false);
        } finally {
          setLoading(false);
        }
      };

      loadModel();
    }
  }, [permissionStatus]);

  const isReady =
    loading ||
    (permissionStatus !== "authorized" && permissionStatus !== "granted") ||
    !device ||
    !isModelReady ||
    !modelPath ||
    !poseDetection;

  const renderOverlay = () => {
    if (!isCounting) return null; // Hide overlay if not counting

    const path = Skia.Path.Make();
    for (let i = 0; i < connections.length; i += 2) {
      const p1 = connections[i];
      const p2 = connections[i + 1];
      path.moveTo(p1.x, p1.y);
      path.lineTo(p2.x, p2.y);
    }
    return (
      <Canvas style={StyleSheet.absoluteFill}>
        <Path path={path} color="cyan" style="stroke" strokeWidth={4} />
      </Canvas>
    );
  };

  const handleStart = () => {
    let count = 5;
    setCountdown(count);

    const interval = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count === 0) {
        clearInterval(interval);
        setCountdown(null);
        setIsCounting(true);
      }
    }, 1000);
  };

  const handleStop = () => {
    setIsCounting(false);
  };

  const handleEnd = async () => {
    setIsCounting(false);

    if (!user || !user.uid) {
      console.log("User is not authenticated or UID is missing");
      router.push({
        pathname: "/streaks",
        params: { reps: count.toString() },
      });
      return;
    }

    console.log(`Completed ${count}/${repsGoal} reps`);

    if (count >= repsGoal && user) {
      const userRef = doc(db, "users", user.uid);

      try {
        const userSnap = await getDoc(userRef);
        let updatedCurrentStreak = 1;
        let updatedLongestStreak = 1;

        if (!userSnap.exists) {
          // Create new user document if it doesn't exist
          await setDoc(userRef, {
            current_streak: updatedCurrentStreak,
            longest_streak: updatedLongestStreak,
            last_completed: new Date().toISOString(),
            current_reps: count,
            todayCompleted: true,
          });
          console.log("✅ Created new user streaks data.");
        } else {
          const data = userSnap.data();
          updatedCurrentStreak = (data?.current_streak || 0) + 1;
          updatedLongestStreak = Math.max(
            updatedCurrentStreak,
            data?.longest_streak ?? 0,
          );

          await setDoc(
            userRef,
            {
              current_streak: updatedCurrentStreak,
              longest_streak: updatedLongestStreak,
              last_completed: new Date().toISOString(),
              current_reps: count,
              todayCompleted: true,
            },
            { merge: true },
          );
          console.log("✅ Updated existing user streaks data.");
        }

        // Use the defined variables for navigation
        router.replace({
          pathname: "/streaks",
          params: {
            reps: count.toString(),
            current_streak: updatedCurrentStreak.toString(),
            longest_streak: updatedLongestStreak.toString(),
          },
        });
      } catch (error) {
        console.error("❌ Error fetching or updating user data:", error);
        // Still navigate even if there's an error
        router.replace({
          pathname: "/streaks",
          params: { reps: count.toString() },
        });
      }
    } else {
      // Navigate with current count even if goal not reached
      router.replace({
        pathname: "/streaks",
        params: { reps: count.toString() },
      });
    }
  };

  if (isReady) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="white" />
        <Text style={styles.text}>⏳ Loading camera and model...</Text>
        <Text style={styles.text}>📷 Permission: {permissionStatus}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MediapipeCamera
        style={styles.box}
        device={device}
        solution={poseDetection}
        resizeMode="cover"
      />
      {renderOverlay()}
      <Text style={styles.counterText}>🔢 Reps: {count}</Text>

      {countdown !== null && (
        <Text style={styles.countdownText}>⏳ Starting in {countdown}...</Text>
      )}

      <View style={styles.buttons}>
        {!isCounting && countdown === null && (
          <Button title="▶️ Start" onPress={handleStart} />
        )}
        {isCounting && <Button title="⏸ Stop" onPress={handleStop} />}
        <Button title="🏁 End" color="red" onPress={handleEnd} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },
  box: {
    flex: 1,
    width: "100%",
  },
  counterText: {
    position: "absolute",
    top: 40,
    left: 20,
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  countdownText: {
    position: "absolute",
    top: 80,
    fontSize: 32,
    color: "yellow",
    fontWeight: "bold",
  },
  buttons: {
    position: "absolute",
    bottom: 40,
    flexDirection: "row",
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
