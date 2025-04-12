# Carebot

Carebot is a comprehensive health and wellness mobile application designed to help users track health habits, access quality health information, and receive personalized health guidance.

## Features

- **Health News**: Browse and read the latest health articles from trusted sources like Healthline
- **AI Health Assistant**: Chat with an AI-powered health assistant to answer questions and provide guidance
- **Streak Tracker**: Monitor and maintain your health habits through streak tracking
- **User Profile**: Personalized user experience with profile customization
- **Health Information**: Access to a wide range of health topics including nutrition, fitness, mental health, and chronic conditions

## Technologies

Carebot is built using modern mobile development technologies:

- **Expo & React Native**: For cross-platform mobile development
- **Firebase**: Authentication, data storage, and analytics
- **NativeWind**: Tailwind CSS for React Native styling
- **Expo Router**: For navigation within the application
- **AI/OpenAI Integration**: Powering the conversational health assistant
- **TypeScript**: For type-safe code
- **Bun**: Fast JavaScript runtime and package manager

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Bun (instead of npm/yarn)
- Expo CLI
- iOS Simulator or Android Emulator (optional for local testing)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/carebot.git
   cd carebot
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up environment variables:
   - Create a `.env` file based on `.env.example`
   - Configure Firebase credentials

4. Start the development server:
   ```bash
   bunx expo start
   ```

5. Run on your preferred platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan the QR code with Expo Go on your physical device

## Project Structure

- **app/**: Main application screens and navigation
  - **(tabs)/**: Tab-based navigation screens
  - **(auth)/**: Authentication-related screens
- **components/**: Reusable UI components
  - **ui/**: Basic UI elements (buttons, inputs, etc.)
  - **chatbot/**: Chat interface components
- **lib/**: Utilities, API integrations, and business logic
  - **data/**: Data models and static content
- **assets/**: Images, fonts, and other static resources
- **styles/**: Global styling configurations

## Key Features Explained

### Health News Feed

The news feed provides curated health articles from Healthline, covering various topics such as nutrition, fitness, mental health, and medical conditions. Users can browse through articles and read in-depth content on topics that interest them.

### AI Health Assistant

The integrated chat system allows users to ask health-related questions and receive evidence-based information. The AI assistant can provide guidance on nutrition, exercise, symptoms, and general wellness topics.

### Streak Tracker

To encourage healthy habit formation, the streak tracker allows users to:
- Set daily health goals
- Track their progress
- Maintain streaks of consistent healthy behaviors
- Visualize their health journey over time

### Authentication & User Profile

The application provides secure user authentication via Firebase, allowing users to create accounts, save preferences, and track their health journey across devices.

## Development

### Adding New Features

1. Create new components in the appropriate directory
2. Add screens to the router in `app/` directory
3. Update navigation if needed
4. Test on multiple device sizes

### Code Style

The project uses Prettier for code formatting and follows TypeScript best practices. Run linting before commits:

```bash
bun run lint
```

## Acknowledgements

- Healthline for health information
- Gemini/OpenAI for conversational AI capabilities
- Firebase for authentication and backend services
- Expo team for the development platform
