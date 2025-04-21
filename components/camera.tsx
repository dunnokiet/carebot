import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import {
  MediapipeCamera,
  RunningMode,
  usePoseDetection,
  KnownPoseLandmarkConnections,
  KnownPoseLandmarks,
  PoseLandmark,
} from 'react-native-mediapipe';
import { useCameraPermission } from 'react-native-vision-camera';
import {
  Canvas,
  vec,
  SkPoint,
  Line,
  Circle,
} from '@shopify/react-native-skia';
import { LogBox } from 'react-native';
import { router } from 'expo-router';

LogBox.ignoreLogs(['BaseViewCoordinator.constructor']);

export default function CameraScreen() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [connections, setConnections] = useState<SkPoint[]>([]);
  const [landmarkPoints, setLandmarkPoints] = useState<SkPoint[]>([]);
  const [count, setCount] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const [wasDown, setWasDown] = useState(false);

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission]);

  const onResults = (results: any, vc: any) => {
    const frameDims = vc.getFrameDims(results);
    const pts: PoseLandmark[] = results.results?.[0]?.landmarks?.[0] ?? [];
    if (pts.length === 0) return;

    const newLines: SkPoint[] = [];
    const pointVecs: SkPoint[] = [];

    for (const [a, b] of KnownPoseLandmarkConnections) {
      const pt1 = vc.convertPoint(frameDims, pts[a]);
      const pt2 = vc.convertPoint(frameDims, pts[b]);
      newLines.push(vec(pt1.x, pt1.y));
      newLines.push(vec(pt2.x, pt2.y));
    }

    for (let i = 0; i < pts.length; i++) {
      const p = vc.convertPoint(frameDims, pts[i]);
      pointVecs.push(vec(p.x, p.y));
    }

    setConnections(newLines);
    setLandmarkPoints(pointVecs);

    const getDistance = (a: PoseLandmark, b: PoseLandmark) => {
      return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
    };

    if (isCounting && count < 10) {
      const lh = pts[KnownPoseLandmarks.leftHip];
      const lk = pts[KnownPoseLandmarks.leftKnee];
      const la = pts[KnownPoseLandmarks.leftAnkle];
      const rh = pts[KnownPoseLandmarks.rightHip];
      const rk = pts[KnownPoseLandmarks.rightKnee];
      const ra = pts[KnownPoseLandmarks.rightAnkle];

      const leftThigh = getDistance(lh, lk);
      const leftShin = getDistance(lk, la);
      const rightThigh = getDistance(rh, rk);
      const rightShin = getDistance(rk, ra);

      const leftRatio = leftThigh / leftShin;
      const rightRatio = rightThigh / rightShin;

      const down = leftRatio < 0.8 && rightRatio < 0.8;

      if (down && !wasDown) {
        setWasDown(true);
      } else if (!down && wasDown) {
        setWasDown(false);
        setCount((prev) => {
          const next = prev + 1;
          if (next >= 10) {
            setIsCounting(false);
          }
          return next;
        });
      }
    }
  };

  const poseDetection = usePoseDetection(
    { onResults },
    RunningMode.LIVE_STREAM,
    'assets/pose_landmarker_full.task'
  );

  const handleGoBack = () => {
    router.back(); // Go back to the previous screen (Streak screen)
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>❌ No camera permission</Text>
        <Button title="Go Back" onPress={handleGoBack} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MediapipeCamera
        style={styles.box}
        solution={poseDetection}
        resizeMode="cover"
      />

      <Canvas style={styles.box}>
        {connections.map((_, index) => {
          if (index % 2 === 1) {
            const p1 = connections[index - 1];
            const p2 = connections[index];
            return (
              <Line
                key={index}
                p1={p1}
                p2={p2}
                color="red"
                strokeWidth={3}
              />
            );
          }
          return null;
        })}

        {/* Hiển thị 10 landmark đầu */}
        {landmarkPoints.slice(0, 10).map((point, index) => (
          <Circle
            key={`circle-${index}`}
            cx={point.x}
            cy={point.y}
            r={6}
            color="yellow"
          />
        ))}

        {/* Hông và đầu gối */}
        <Circle
          cx={landmarkPoints[KnownPoseLandmarks.leftKnee]?.x}
          cy={landmarkPoints[KnownPoseLandmarks.leftKnee]?.y}
          r={8}
          color="blue"
        />
        <Circle
          cx={landmarkPoints[KnownPoseLandmarks.rightKnee]?.x}
          cy={landmarkPoints[KnownPoseLandmarks.rightKnee]?.y}
          r={8}
          color="blue"
        />
        <Circle
          cx={landmarkPoints[KnownPoseLandmarks.leftHip]?.x}
          cy={landmarkPoints[KnownPoseLandmarks.leftHip]?.y}
          r={8}
          color="green"
        />
        <Circle
          cx={landmarkPoints[KnownPoseLandmarks.rightHip]?.x}
          cy={landmarkPoints[KnownPoseLandmarks.rightHip]?.y}
          r={8}
          color="green"
        />
      </Canvas>

      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <ArrowLeft color="white" size={24} />
      </TouchableOpacity>

      <View style={styles.overlay}>
        <Text style={styles.counter}>Squats: {count}</Text>
        <Button
          title={count >= 10 ? '✅ Done!' : isCounting ? 'Stop' : 'Start'}
          onPress={() => setIsCounting(!isCounting)}
          disabled={count >= 10}
        />
        {count >= 10 && (
          <Button
            title="Save and Return"
            onPress={handleGoBack}
            color="#10B981"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  text: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  box: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 10,
  },
  counter: {
    fontSize: 24,
    color: 'white',
    marginBottom: 10,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
});