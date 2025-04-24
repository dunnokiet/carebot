import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert,
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
import { doc, getDoc, setDoc } from "@react-native-firebase/firestore";
import { useAuth } from "~/lib/authContext";
import { db } from "~/components/streaks/camera";

export default function StreakTrackerScreen() {
  const [recentActivity, setRecentActivity] = useState<boolean[]>(
    Array(7).fill(false),
  );
  const {
    reps = "0",
    current_streak = "0",
    longest_streak = "0",
  } = useLocalSearchParams();
  const { user } = useAuth();

  const [currentLevel, setCurrentLevel] = useState<"easy" | "medium" | "hard">(
    "medium",
  );
  const levelGoals = {
    easy: 5,
    medium: 10,
    hard: 20,
  };

  const goal = levelGoals[currentLevel];
  const [fadeAnim] = useState(new Animated.Value(1));
  const [repsCount, setRepsCount] = useState(
    parseInt(Array.isArray(reps) ? reps[0] : reps),
  );

  const [currentStreak, setCurrentStreak] = useState(
    parseInt(
      Array.isArray(current_streak) ? current_streak[0] : current_streak,
    ) || 0,
  );
  const [longestStreak, setLongestStreak] = useState(
    parseInt(
      Array.isArray(longest_streak) ? longest_streak[0] : longest_streak,
    ) || 0,
  );
  const [todayCompleted, setTodayCompleted] = useState(false);
  const [lastCompletionDate, setLastCompletionDate] = useState<Date | null>(
    null,
  );

  // Fetch user streak data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.uid) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists) {
            const data = userSnap.data();

            // Get difficulty level preference
            if (data?.selected_level) {
              setCurrentLevel(data.selected_level);
            }

            // Get current reps from Firestore
            if (data?.current_reps !== undefined) {
              setRepsCount(data.current_reps);
            }

            // Get streak information
            if (data && data.current_streak !== undefined) {
              setCurrentStreak(data.current_streak);
            }

            if (data && data.longest_streak !== undefined) {
              setLongestStreak(data.longest_streak);
            }

            if (data?.todayCompleted !== undefined) {
              setTodayCompleted(data.todayCompleted);
            }

            // Store last completion date
            if (data?.last_completed) {
              setLastCompletionDate(new Date(data.last_completed));

              // Check if we've already completed today's challenge
              const lastCompletedDate = new Date(data.last_completed);
              const today = new Date();

              if (isSameDay(lastCompletedDate, today) && data.todayCompleted) {
                setTodayCompleted(true);
              } else if (!isSameDay(lastCompletedDate, today)) {
                // Reset reps count if it's a new day
                if (data.current_reps > 0) {
                  await setDoc(
                    userRef,
                    {
                      current_reps: 0,
                      todayCompleted: false,
                    },
                    { merge: true },
                  );
                  setRepsCount(0);
                }
              }

              // Check for broken streak (more than 1 day missed)
              const daysBetween = Math.floor(
                (today.getTime() - lastCompletedDate.getTime()) /
                  (1000 * 60 * 60 * 24),
              );
              if (daysBetween > 1 && data.current_streak > 0) {
                // Reset streak if more than one day passed
                await setDoc(
                  userRef,
                  {
                    current_streak: 0,
                  },
                  { merge: true },
                );
                setCurrentStreak(0);
              }
            }
            if (data?.activityHistory && Array.isArray(data.activityHistory)) {
              setRecentActivity(data.activityHistory);
            }
            console.log("data", data);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  // Helper function to check if two dates are the same day
  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // Check if today's challenge is already completed
  useEffect(() => {
    const checkTodayCompletion = () => {
      if (lastCompletionDate) {
        const today = new Date();
        if (isSameDay(lastCompletionDate, today) && todayCompleted) {
          // Challenge already completed today
          return true;
        }
      }
      return false;
    };

    const isCompleted = checkTodayCompletion();
    setTodayCompleted(isCompleted || repsCount >= levelGoals[currentLevel]);
  }, [lastCompletionDate, repsCount, currentLevel]);

  // Update initial reps count from params and check if goal is met
  useEffect(() => {
    if (reps) {
      const newRepsCount = parseInt(Array.isArray(reps) ? reps[0] : reps);
      if (!isNaN(newRepsCount)) {
        setRepsCount(newRepsCount);
        const completed = newRepsCount >= levelGoals[currentLevel];

        // Check if this is a new completion
        if (completed && !todayCompleted) {
          updateStreakAfterWorkout(newRepsCount);
        }
      }
    }
  }, [reps]);

  // Update streak status when reps or level changes
  useEffect(() => {
    // Update activity display
    const newActivity = [...recentActivity];
    // Only update today's activity in the array
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // In recentActivity, index 0 is Monday, so we need to convert
    const activityIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert 0-6 (Sun-Sat) to 0-6 (Mon-Sun)
    newActivity[activityIndex] = todayCompleted;

    setRecentActivity(newActivity);
  }, [todayCompleted]);

  const updateStreakAfterWorkout = async (completedReps: number) => {
    if (completedReps >= levelGoals[currentLevel]) {
      const today = new Date();
      // Calculate the correct index in the activity array for today
      const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const activityIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to 0 = Monday, 6 = Sunday

      if (!todayCompleted) {
        const newStreak = currentStreak + 1;
        setCurrentStreak(newStreak);
        setTodayCompleted(true);

        const newLongest = Math.max(newStreak, longestStreak);
        setLongestStreak(newLongest);

        // Update recentActivity - mark today as completed
        const newActivity = [...recentActivity];
        newActivity[activityIndex] = true;
        setRecentActivity(newActivity);

        // Save to Firestore
        if (user && user.uid) {
          try {
            const userRef = doc(db, "users", user.uid);
            const now = new Date();
            setLastCompletionDate(now);

            await setDoc(
              userRef,
              {
                current_streak: newStreak,
                longest_streak: newLongest,
                last_completed: now.toISOString(),
                activityHistory: newActivity,
                todayCompleted: true,
                current_reps: completedReps,
              },
              { merge: true },
            );
            console.log("Updated user streak data in Firestore");
          } catch (error) {
            console.error("Error updating user data:", error);
          }
        }
      }
    }
  };

  const handleResetCount = async () => {
    if (todayCompleted) {
      // Cannot reset if challenge is already completed for today
      Alert.alert(
        "Challenge Already Completed",
        "You've already completed today's challenge! You can start a new challenge tomorrow.",
        [{ text: "OK" }],
      );
      return;
    }

    // Animate the transition
    Animated.timing(fadeAnim, {
      toValue: 0.5,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setRepsCount(0);

      // Fade back in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    // Persist to Firestore
    if (user && user.uid) {
      try {
        const userRef = doc(db, "users", user.uid);
        await setDoc(
          userRef,
          {
            current_reps: 0,
          },
          { merge: true },
        );
        console.log("Reset count persisted to Firestore");
      } catch (error) {
        console.error("Error updating reset data:", error);
      }
    }
  };

  const handleOpenCamera = () => {
    // Check if challenge is already completed for today
    const today = new Date();
    if (
      lastCompletionDate &&
      isSameDay(lastCompletionDate, today) &&
      todayCompleted
    ) {
      Alert.alert(
        "Challenge Already Completed",
        "You've already completed today's challenge! You can start a new challenge tomorrow.",
        [{ text: "OK" }],
      );
      return;
    }

    router.push({
      pathname: "./camera",
      params: {
        challengeLevel: currentLevel,
        current_streak: currentStreak.toString(),
        longest_streak: longestStreak.toString(),
        current_reps: repsCount.toString(),
      },
    });
  };

  const handleLevelChange = async (level: "easy" | "medium" | "hard") => {
    if (todayCompleted) {
      // Cannot change level if challenge is already completed for today
      Alert.alert(
        "Challenge Already Completed",
        "You've already completed today's challenge! You can change the difficulty level tomorrow.",
        [{ text: "OK" }],
      );
      return;
    }

    // Animate the transition
    Animated.timing(fadeAnim, {
      toValue: 0.5,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setCurrentLevel(level);

      // Fade back in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    // Save selected level to Firestore
    if (user && user.uid) {
      try {
        const userRef = doc(db, "users", user.uid);
        await setDoc(
          userRef,
          {
            selected_level: level,
          },
          { merge: true },
        );
      } catch (error) {
        console.error("Error saving level preference:", error);
      }
    }
  };

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 1-6 = Monday-Saturday
  const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1;
  const daysSoFar = daysFromMonday + 1;

  // Calculate completed days by checking indices 0 to daysSoFar-1
  const completedDays = recentActivity
    .slice(0, daysSoFar)
    .filter((day) => day).length;

  const mostRecentMonday = new Date(today);
  mostRecentMonday.setDate(today.getDate() - daysFromMonday);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(mostRecentMonday);
    date.setDate(mostRecentMonday.getDate() + i);

    const isToday = date.toDateString() === today.toDateString();
    const isPast = date < today || isToday;

    // Calculate the accurate day index for the activity array
    // In our activity array: Monday=0, Sunday=6
    const dayIndex = i; // i is 0-6 for Mon-Sun already

    let completed = false;
    if (isPast && recentActivity && recentActivity.length > 0) {
      completed = recentActivity[dayIndex];
    }

    return {
      date,
      dayName: dayNames[i],
      dayNumber: date.getDate(),
      completed,
      isToday,
    };
  });

  const weeklyPercentage = Math.round((completedDays / 7) * 100);

  return (
    <ScrollView style={styles.container}>
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Daily Streak</Text>
            <Text style={styles.description}>
              {currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)}{" "}
              level • Goal: {goal} reps
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
              <Text style={[styles.statNumber, { color: "#F59E0B" }]}>
                {" "}
                {currentStreak}
              </Text>
            </View>
            <Text style={styles.statLabel}>Current</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <View style={styles.statValue}>
              <Award width={20} height={20} color="#10B981" />
              <Text style={[styles.statNumber, { color: "#10B981" }]}>
                {" "}
                {longestStreak}
              </Text>
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
            <Text style={styles.weeklyCount}>{completedDays}/7 days</Text>
          </View>
          <View style={styles.progressContainer}>
            <Animated.View
              style={[styles.progressBar, { width: `${weeklyPercentage}%` }]}
            />
          </View>
        </View>

        <View style={styles.activityContainer}>
          <Text style={styles.sectionTitle}>Daily Activity</Text>
          <View style={styles.daysContainer}>
            {weekDays.map((day, index) => (
              <View key={index} style={styles.dayItem}>
                <Text style={[styles.dayName, day.isToday && styles.todayText]}>
                  {day.dayName}
                </Text>
                <View
                  style={[
                    styles.dayCircle,
                    day.completed
                      ? styles.completedDay
                      : day.isToday
                        ? styles.dayCircle
                        : styles.missedDay,
                  ]}
                >
                  {day.completed ? (
                    <CheckCircle width={16} height={16} color="#10B981" />
                  ) : (
                    <Text
                      style={[
                        styles.dayNumber,
                        day.isToday && styles.dayNumber,
                      ]}
                    >
                      {day.dayNumber}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        <Animated.View
          style={[
            styles.completionInfo,
            todayCompleted ? styles.completedInfo : null,
            {
              transform: [
                {
                  scale: fadeAnim.interpolate({
                    inputRange: [0.5, 1],
                    outputRange: [0.95, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.completionText}>
            {todayCompleted
              ? `Today's challenge completed! (${repsCount}/${goal} reps)`
              : `Today's progress: ${repsCount}/${goal} reps`}
          </Text>
          {todayCompleted && (
            <Text style={styles.nextChallengeText}>
              Come back tomorrow for your next challenge!
            </Text>
          )}
        </Animated.View>

        <View style={styles.levelSelectContainer}>
          <Text style={styles.levelSelectTitle}>Difficulty Level:</Text>
          <View style={styles.levelButtons}>
            <TouchableOpacity
              style={[
                styles.levelButton,
                currentLevel === "easy" && styles.selectedLevelButton,
                todayCompleted && styles.disabledButton,
              ]}
              onPress={() => handleLevelChange("easy")}
              disabled={todayCompleted}
            >
              <Text
                style={[
                  styles.levelButtonText,
                  currentLevel === "easy" && styles.selectedLevelText,
                  todayCompleted && styles.disabledButtonText,
                ]}
              >
                Easy
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.levelButton,
                currentLevel === "medium" && styles.selectedLevelButton,
                todayCompleted && styles.disabledButton,
              ]}
              onPress={() => handleLevelChange("medium")}
              disabled={todayCompleted}
            >
              <Text
                style={[
                  styles.levelButtonText,
                  currentLevel === "medium" && styles.selectedLevelText,
                  todayCompleted && styles.disabledButtonText,
                ]}
              >
                Medium
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.levelButton,
                currentLevel === "hard" && styles.selectedLevelButton,
                todayCompleted && styles.disabledButton,
              ]}
              onPress={() => handleLevelChange("hard")}
              disabled={todayCompleted}
            >
              <Text
                style={[
                  styles.levelButtonText,
                  currentLevel === "hard" && styles.selectedLevelText,
                  todayCompleted && styles.disabledButtonText,
                ]}
              >
                Hard
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {!todayCompleted ? (
          <TouchableOpacity
            style={[styles.cameraButton]}
            onPress={handleOpenCamera}
          >
            <Camera width={20} height={20} color="#fff" />
            <Text style={styles.cameraButtonText}>
              Track Workout with Camera
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.completedButton]} disabled={true}>
            <CheckCircle width={20} height={20} color="#fff" />
            <Text style={styles.cameraButtonText}>Challenge Completed</Text>
          </TouchableOpacity>
        )}

        {!todayCompleted && (
          <TouchableOpacity
            style={[styles.button, styles.resetButton]}
            onPress={handleResetCount}
          >
            <RefreshCw width={20} height={20} color="#fff" />
            <Text style={styles.buttonText}>Reset Count</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
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
  todayText: {
    fontWeight: "bold",
    color: "#3B82F6",
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
  completedInfo: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
  },
  completionText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  nextChallengeText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
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
  disabledButton: {
    backgroundColor: "#e0e0e0",
    borderColor: "#d0d0d0",
    opacity: 0.7,
  },
  levelButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  selectedLevelText: {
    color: "#fff",
  },
  disabledButtonText: {
    color: "#999",
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
  completedButton: {
    backgroundColor: "#10B981",
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
