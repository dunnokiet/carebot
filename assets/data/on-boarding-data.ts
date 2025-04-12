export interface OnboardingItem {
  id: number;
  title_1: string;
  title_2: string;
  description: string;
  image: any;
}

const onboardingData: OnboardingItem[] = [
  {
    id: 1,
    title_1: "",
    title_2: "Your Personal Health Chatbot",
    description:
      "Ask health questions, get trusted answers anytime and anywhere with our AI chatbot",
    image: require("~/assets/images/intro/1.png"),
  },
  {
    id: 2,
    title_1: "Stay updated with",
    title_2: "Trusted Health News",
    description:
      "Get the latest health tips, medical updates, and wellness articles for you",
    image: require("~/assets/images/intro/2.png"),
  },
  {
    id: 3,
    title_1: "Stay on track with your",
    title_2: "Health Streak",
    description: "Motivate yourself with a  streak of healthy",
    image: require("~/assets/images/intro/3.png"),
  },
  {
    id: 4,
    title_1: "",
    title_2: "Allow access to continue",
    description: "We need your permission to use the following",
    image: require("~/assets/images/intro/4.png"),
  },
  {
    id: 5,
    title_1: "Welcome to ",
    title_2: "Carebot",
    description:
      "AI for ask health questions, track health streak , update news & more.",
    image: require("~/assets/images/intro/5.png"),
  },
];

export default onboardingData;
