// Modern Color Palette for Professional Portfolio
export const darkBlack = "#0F0F23"; // Deep navy for backgrounds
export const lightBlack = "#1A1A2E"; // Slightly lighter navy
export const grey = "#EAEAEA"; // Light grey for text
export const lighterBlue = "#00D2FF"; // Bright cyan for highlights
export const anotherBlue = "#3A7BD5"; // Professional blue for accents

// Additional modern colors
export const white = "#FFFFFF";
export const primaryGradient =
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
export const accentGradient =
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)";
export const successGradient =
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)";
export const cardBackground = "rgba(255, 255, 255, 0.1)";
export const cardBackgroundHover = "rgba(255, 255, 255, 0.15)";
export const textPrimary = "#FFFFFF";
export const textSecondary = "#B8BCC8";
export const textAccent = "#00D2FF";
export const shadowLight = "0 8px 32px 0 rgba(31, 38, 135, 0.37)";
export const shadowHeavy =
  "0 15px 35px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07)";
export const glassmorphism = "rgba(255, 255, 255, 0.1)";
export const glassmorphismBorder = "rgba(255, 255, 255, 0.18)";

// Additional theme colors
export const primaryBlue = "#007bff";
export const successGreen = "#28a745";
export const warningYellow = "#ffc107";
export const dangerRed = "#dc3545";

// Color type definitions
export interface ThemeColors {
  darkBlack: string;
  lightBlack: string;
  grey: string;
  lighterBlue: string;
  anotherBlue: string;
}

export const themeColors: ThemeColors = {
  darkBlack,
  lightBlack,
  grey,
  lighterBlue,
  anotherBlue,
};
