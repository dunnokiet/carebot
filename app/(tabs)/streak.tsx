import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Calendar, CheckCircle, Award, Flame } from "lucide-react-native";

export default function StreakTrackerScreen() {
  const [currentStreak, setCurrentStreak] = useState(5);
  const [longestStreak, setLongestStreak] = useState(12);
  const [todayCompleted, setTodayCompleted] = useState(false);

  const [recentActivity, setRecentActivity] = useState([
    true,
    true,
    true,
    true,
    true,
    false,
    false,
  ]);

  const handleCompleteToday = () => {
    if (!todayCompleted) {
      setTodayCompleted(true);
      setCurrentStreak(currentStreak + 1);

      if (currentStreak + 1 > longestStreak) {
        setLongestStreak(currentStreak + 1);
      }

      setRecentActivity([true, ...recentActivity.slice(0, 6)]);
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
    (recentActivity.filter((day) => day).length / 7) * 100,
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Daily Streak</Text>
            <Text style={styles.description}>Keep your streak going!</Text>
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
            <Text style={styles.weeklyCount}>
              {recentActivity.filter((day) => day).length}/7 days
            </Text>
          </View>
          <View style={styles.progressContainer}>
            <View
              style={[styles.progressBar, { width: `${weeklyPercentage}%` }]}
            />
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

        <TouchableOpacity
          style={[styles.button, todayCompleted ? styles.buttonDisabled : null]}
          onPress={handleCompleteToday}
          disabled={todayCompleted}
        >
          <Text style={styles.buttonText}>
            {todayCompleted ? "Completed Today ✓" : "Complete Today's Task"}
          </Text>
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
  button: {
    backgroundColor: "#3B82F6",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#93C5FD",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
