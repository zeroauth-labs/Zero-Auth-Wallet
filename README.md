# Zero Auth

Zero Auth is a privacy-first authentication wallet app built with React Native and Expo. It allows users to verify attributes (like age or student status) using zero-knowledge proofs without revealing sensitive personal information.

## Features

- **Privacy First**: No PII stored on servers.
- **Zero Knowledge**: Concepts based on zk-SNARKs (Mocked UI for now).
- **Offline Capable**: Credentials stored locally.
- **Modern UI**: Tokyo Night aesthetic with glassmorphism and smooth animations.

## Tech Stack

- **Framework**: React Native (Expo SDK 50+)
- **Language**: TypeScript
- **Styling**: NativeWind v4 (Tailwind CSS)
- **State Management**: Zustand
- **Navigation**: Expo Router (File-based)
- **Icons**: Lucide React Native

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npx expo start
   ```

3. **Run on Device/Simulator**
   - Press `a` for Android Emulator
   - Press `i` for iOS Simulator
   - Scan the QR code with Expo Go on your physical device

## Project Structure

- `app/`: Application screens and navigation (Expo Router).
  - `(tabs)/`: Main bottom tab navigation.
- `components/`: Reusable UI components.
- `store/`: Zustand stores for application state (Mock Data).
- `constants/`: Theme and configuration constants.
- `lib/`: Utility functions.

## Future Roadmap

- [ ] Integrate `snarkjs` for actual ZK proof generation.
- [ ] Implement QR code scanning logic with `expo-camera`.
- [ ] Encrypted local storage for credentials.
