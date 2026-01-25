# Zero Auth Wallet
# The Mobile App part of the Zero Auth Project
Zero Auth is a privacy-first authentication wallet app built with React Native and Expo. It allows users to verify attributes (like age or student status) using zero-knowledge proofs without revealing sensitive personal information.

## Features

- **Privacy First**: No PII stored on servers.
- **Zero Knowledge**: Concepts based on zk-SNARKs (Mocked UI for now).
- **Offline Capable**: Credentials stored locally.
- **Modern UI**: Tokyo Night aesthetic with glassmorphism and smooth animations.

## V0.0.3 Features (Refinements)

- **Enhanced Verification**: "Reddish" themed alerts for critical actions like revocation.
- **Improved UX**: Auto-formatting for Date of Birth inputs (`DD/MM/YYYY`).
- **Notifications**: System-wide notification center accessible via dashboard.
- **Strict Logic**: Single credential per type enforcement.
- **Refined Navigation**: Restored clear labels to the bottom tab bar.

## Tech Stack

- **Framework**: React Native (Expo SDK 50+)
- **Language**: TypeScript
- **Styling**: NativeWind v4 (Tailwind CSS)
- **State Management**: Zustand
- **Navigation**: Expo Router (File-based)
- **Icons**: Lucide React Native

## Getting Started (Run with Expo Go)

This project is designed to be run using the **Expo Go** app for the easiest experience.

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npx expo start
   ```
   *Note: If you have issues, try `npx expo start --tunnel`*

3. **Scan & Run**
   - Download **Expo Go** on your Android or iOS device from the App Store/Play Store.
   - Scan the QR code shown in your terminal.
   - The app will bundle and launch on your phone!

## Project Structure

- `app/`: Application screens and navigation (Expo Router).
  - `(tabs)/`: Main bottom tab navigation.
- `components/`: Reusable UI components.
- `store/`: Zustand stores for application state (Mock Data).
- `constants/`: Theme and configuration constants.
- `lib/`: Utility functions.

## Future Roadmap

- [ ] **Phase 1 (Backend)**: Node.js Verifier to issue "Challenges".
- [ ] **Phase 2 (Crypto)**: Implement key generation & signing on mobile.
- [ ] **Phase 3 (ZK)**: Integrate `snarkjs` for actual Zero-Knowledge Proofs.
