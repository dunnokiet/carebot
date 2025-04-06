import Constants from "expo-constants";

export const generateAPIUrl = (relativePath: string): string => {
  const path = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;

  // Nếu đang ở môi trường development
  if (process.env.NODE_ENV === "development") {
    let origin = "http://localhost:8000"; // fallback mặc định

    // Nếu chạy từ Expo Go với experienceUrl, lấy IP thiết bị thay vì localhost
    if (Constants.experienceUrl) {
      const url = Constants.experienceUrl.replace("exp://", "http://");
      const matched = url.match(/^http:\/\/([\d.]+):\d+/);
      if (matched) {
        origin = `http://${matched[1]}:8000`;
      }
    }

    return origin + path;
  }

  // Ở production
  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    throw new Error("EXPO_PUBLIC_API_BASE_URL environment variable is not defined");
  }

  return baseUrl + path;
};
