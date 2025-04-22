import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  Calendar,
  CheckCircle,
  Award,
  Flame,
  Camera,
  RefreshCw,
} from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { doc, getDoc, setDoc } from '@react-native-firebase/firestore';
import { useAuth } from "~/lib/auth-context";
import { db } from "~/components/streak/camera";

export default function StreakTrackerScreen() {
  const { reps = "0", current_streak = "0", longest_streak = "0" } = useLocalSearchParams();
  const { user, isGuest } = useAuth();

  const [currentLevel, setCurrentLevel] = useState("medium");
  const levelGoals = {
    easy: 5,
    medium: 10,
    hard: 20
  };

  const goal = levelGoals[currentLevel as keyof typeof levelGoals];
  const [repsCount, setRepsCount] = useState(parseInt(reps as string));

  const [currentStreak, setCurrentStreak] = useState(parseInt(current_streak as string) || 0);
  const [longestStreak, setLongestStreak] = useState(parseInt(longest_streak as string) || 0);
  const [todayCompleted, setTodayCompleted] = useState(false);

  const [recentActivity, setRecentActivity] = useState([
    false, // today - will be updated based on repsCount
    true,
    true,
    true,
    true,
    false,
    false,
  ]);

  // Fetch user streak data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.uid && !isGuest) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists ) {
            const data = userSnap.data();
            if (data.selected_level) {
              setCurrentLevel(data.selected_level);
            }

            // Get current reps from Firestore
            if (data.current_reps !== undefined) {
              setRepsCount(data.current_reps);
            }

            // Get streak information
            if (data.current_streak !== undefined) {
              setCurrentStreak(data.current_streak);
            }

            if (data.longest_streak !== undefined) {
              setLongestStreak(data.longest_streak);
            }

            if (data.todayCompleted !== undefined) {
              setTodayCompleted(data.todayCompleted);
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  // Update streak status when reps or level changes
  useEffect(() => {
    const completed = repsCount >= levelGoals[currentLevel as keyof typeof levelGoals];
    setTodayCompleted(completed);

    // Update recent activity
    setRecentActivity([completed, ...recentActivity.slice(0, 6)]);

    // Automatically update streak when coming back from camera with sufficient reps
    if (completed && parseInt(reps as string) > 0) {
      // Check if reps came from camera (means user just completed a workout)
      updateStreakAfterWorkout();
    }
  }, [repsCount, currentLevel]);

  // Update initial reps count from params
  useEffect(() => {
    if (reps) {
      setRepsCount(parseInt(reps as string));
    }
  }, [reps]);

  const updateStreakAfterWorkout = async () => {
    // Only update streak if reps are sufficient for the goal
    if (repsCount >= goal) {
      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);

      const newLongest = Math.max(newStreak, longestStreak);
      setLongestStreak(newLongest);

      // Update Firestore if user is logged in
      if (user && user.uid && !isGuest) {
        try {
          const userRef = doc(db, 'users', user.uid);
          await setDoc(userRef, {
            current_streak: newStreak,
            longest_streak: newLongest,
            last_completed: new Date().toISOString(),
          }, { merge: true });
          console.log('Updated user streak data in Firestore');
        } catch (error) {
          console.error('Error updating user data:', error);
        }
      }
    }
  };

const handleResetCount = async () => {
  setRepsCount(0);
  setTodayCompleted(false);
  setRecentActivity([false, ...recentActivity.slice(0, 6)]);

  // Persist to Firestore
  if (user && user.uid && !isGuest) {
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        current_reps: 0, // Add this field to track current reps
        todayCompleted: false
      }, { merge: true });
      console.log('Reset count persisted to Firestore');
    } catch (error) {
      console.error('Error updating reset data:', error);
    }
  }
};

  const handleOpenCamera = () => {
    router.push({
      pathname: "/camera",
      params: {
        challengeLevel: currentLevel,
        current_streak: currentStreak.toString(),
        longest_streak: longestStreak.toString(),
        current_reps: repsCount.toString() // Add current reps
      }
    });
  };

  const handleLevelChange = async (level: string) => {
    setCurrentLevel(level);
    setTodayCompleted(repsCount >= levelGoals[level as keyof typeof levelGoals]);

    // Save selected level to Firestore
    if (user && user.uid && !isGuest) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          selected_level: level
        }, { merge: true });
      } catch (error) {
        console.error('Error saving level preference:', error);
      }
    }
  };

  const today = new Date();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() - i);
    return {
      date: date,
      dayName: dayNames[date.getDay()],
      dayNumber: date.getDate(),
      completed: i === 0 ? todayCompleted : recentActivity[i],
    };
  }).reverse();

  const weeklyPercentage = Math.round(
    (recentActivity.filter((day) => day).length / 7) * 100
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Daily Streak</Text>
            <Text style={styles.description}>
              {currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)} level • Goal: {goal} reps
            </Text>
          </View>
          <TouchableOpacity style={styles.iconButton}>
            <Calendar width={20} height={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={styles.statValue}>
              <Flame width={20} height={20} color="#F59E0B" />
              <Text style={[styles.statNumber, { color: "#F59E0B" }]}> {currentStreak}</Text>
            </View>
            <Text style={styles.statLabel}>Current</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <View style={styles.statValue}>
              <Award width={20} height={20} color="#10B981" />
              <Text style={[styles.statNumber, { color: "#10B981" }]}> {longestStreak}</Text>
            </View>
            <Text style={styles.statLabel}>Best</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{weeklyPercentage}%</Text>
            <Text style={styles.statLabel}>Weekly</Text>
          </View>
        </View>

        <View style={styles.weeklyContainer}>
          <View style={styles.weeklyHeader}>
            <Text style={styles.sectionTitle}>This Week</Text>
            <Text style={styles.weeklyCount}>
              {recentActivity.filter((day) => day).length}/7 days
            </Text>
          </View>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${weeklyPercentage}%` }]} />
          </View>
        </View>

        <View style={styles.activityContainer}>
          <Text style={styles.sectionTitle}>Daily Activity</Text>
          <View style={styles.daysContainer}>
            {last7Days.map((day, index) => (
              <View key={index} style={styles.dayItem}>
                <Text style={styles.dayName}>{day.dayName}</Text>
                <View
                  style={[
                    styles.dayCircle,
                    day.completed ? styles.completedDay : styles.missedDay,
                  ]}
                >
                  {day.completed ? (
                    <CheckCircle width={16} height={16} color="#10B981" />
                  ) : (
                    <Text style={styles.dayNumber}>{day.dayNumber}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.completionInfo}>
          <Text style={styles.completionText}>
            {todayCompleted
              ? `Today's goal completed: ${repsCount}/${goal} reps ✓`
              : `Today's progress: ${repsCount}/${goal} reps`}
          </Text>
        </View>

        <View style={styles.levelSelectContainer}>
          <Text style={styles.levelSelectTitle}>Challenge Level:</Text>
          <View style={styles.levelButtons}>
            <TouchableOpacity
              style={[
                styles.levelButton,
                currentLevel === 'easy' && styles.selectedLevelButton
              ]}
              onPress={() => handleLevelChange('easy')}
            >
              <Text
                style={[
                  styles.levelButtonText,
                  currentLevel === 'easy' && styles.selectedLevelText
                ]}
              >
                Easy
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.levelButton,
                currentLevel === 'medium' && styles.selectedLevelButton
              ]}
              onPress={() => handleLevelChange('medium')}
            >
              <Text
                style={[
                  styles.levelButtonText,
                  currentLevel === 'medium' && styles.selectedLevelText
                ]}
              >
                Medium
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.levelButton,
                currentLevel === 'hard' && styles.selectedLevelButton
              ]}
              onPress={() => handleLevelChange('hard')}
            >
              <Text
                style={[
                  styles.levelButtonText,
                  currentLevel === 'hard' && styles.selectedLevelText
                ]}
              >
                Hard
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {!todayCompleted && (
          <TouchableOpacity
            style={[styles.cameraButton]}
            onPress={handleOpenCamera}
          >
            <Camera width={20} height={20} color="#fff" />
            <Text style={styles.cameraButtonText}>Track Workout with Camera</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, styles.resetButton]}
          onPress={handleResetCount}
        >
          <RefreshCw width={20} height={20} color="#fff" />
          <Text style={styles.buttonText}>Reset Count</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: "#e5e5e5",
  },
  weeklyContainer: {
    marginBottom: 24,
  },
  weeklyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  weeklyCount: {
    fontSize: 12,
    color: "#666",
  },
  progressContainer: {
    height: 8,
    backgroundColor: "#e5e5e5",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#10B981",
    borderRadius: 4,
  },
  activityContainer: {
    marginBottom: 24,
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  dayItem: {
    alignItems: "center",
  },
  dayName: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  completedDay: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
  },
  missedDay: {
    backgroundColor: "#f5f5f5",
  },
  dayNumber: {
    fontSize: 12,
    color: "#666",
  },
  completionInfo: {
    padding: 12,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  completionText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  levelSelectContainer: {
    marginBottom: 16,
  },
  levelSelectTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  levelButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  levelButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  selectedLevelButton: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  levelButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  selectedLevelText: {
    color: "#fff",
  },
  cameraButton: {
    backgroundColor: "#6366F1",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
  },
  cameraButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  button: {
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  resetButton: {
    backgroundColor: "#EF4444",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
});