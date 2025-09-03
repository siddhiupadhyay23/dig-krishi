import React from 'react';

// AI/Robot brain icon
export const AIIcon = ({ className = "icon", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z"/>
  </svg>
);

// Analytics/Chart icon
export const AnalyticsIcon = ({ className = "icon", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z"/>
  </svg>
);

// Trend up icon
export const TrendUpIcon = ({ className = "icon", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z"/>
  </svg>
);

// Trend down icon
export const TrendDownIcon = ({ className = "icon", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z"/>
  </svg>
);

// Prediction/Crystal ball icon
export const PredictionIcon = ({ className = "icon", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12,2A7,7 0 0,0 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1 0 0,0 9,18H15A1,1 0 0,0 16,17V14.74C17.81,13.47 19,11.38 19,9A7,7 0 0,0 12,2M9,21V20H15V21A1,1 0 0,1 14,22H10A1,1 0 0,1 9,21M12,4A5,5 0 0,1 17,9C17,10.64 16.05,12.04 14.67,12.67L14,13V15H10V13L9.33,12.67C7.95,12.04 7,10.64 7,9A5,5 0 0,1 12,4Z"/>
  </svg>
);

// Sensor/IoT device icon
export const SensorIcon = ({ className = "icon", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M21,9V7L15,5.5V6.5L12,5.5V8.5L15,7.5V9L12,10.5V13.5L15,12.5V14L12,15.5V18.5L15,17.5V19L21,17V15L18,16L18,14L21,13V11L18,12L18,10L21,9M9,9V7L3,5V7L6,8L6,10L3,9V11L6,12L6,14L3,13V15L9,17V15L12,16V13L9,14V12L12,11V8L9,9M12,20C10.9,20 10,19.1 10,18C10,16.9 10.9,16 12,16C13.1,16 14,16.9 14,18C14,19.1 13.1,20 12,20Z"/>
  </svg>
);

// Database/Storage icon
export const DatabaseIcon = ({ className = "icon", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12,3C7.58,3 4,4.79 4,7C4,9.21 7.58,11 12,11C16.42,11 20,9.21 20,7C20,4.79 16.42,3 12,3M4,9V12C4,14.21 7.58,16 12,16C16.42,16 20,14.21 20,12V9C20,11.21 16.42,13 12,13C7.58,13 4,11.21 4,9M4,14V17C4,19.21 7.58,21 12,21C16.42,21 20,19.21 20,17V14C20,16.21 16.42,18 12,18C7.58,18 4,16.21 4,14Z"/>
  </svg>
);

// Satellite icon
export const SatelliteIcon = ({ className = "icon", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M4.93,4.93C3.12,6.74 2,9.24 2,12S3.12,17.26 4.93,19.07L6.34,17.66C4.89,16.22 4,14.22 4,12S4.89,7.78 6.34,6.34L4.93,4.93M19.07,4.93L17.66,6.34C19.11,7.78 20,9.78 20,12S19.11,16.22 17.66,17.66L19.07,19.07C20.88,17.26 22,14.76 22,12S20.88,6.74 19.07,4.93M7.76,7.76C6.67,8.85 6,10.35 6,12S6.67,15.15 7.76,16.24L9.17,14.83C8.45,14.11 8,13.11 8,12S8.45,9.89 9.17,9.17L7.76,7.76M16.24,7.76L14.83,9.17C15.55,9.89 16,10.89 16,12S15.55,14.11 14.83,14.83L16.24,16.24C17.33,15.15 18,13.65 18,12S17.33,8.85 16.24,7.76M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10Z"/>
  </svg>
);

// Machine learning/Neural network icon
export const MLIcon = ({ className = "icon", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3L17.39,6L21.39,8L12,13L2.61,8L6.61,6L12,3M12,15L16.75,12.37L20.75,10.37L12,15L3.25,10.37L7.25,12.37L12,15Z"/>
  </svg>
);

// Internet/Network icon
export const NetworkIcon = ({ className = "icon", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M13,12H20V16H13M13,16H16L12,20L8,16H11V12H4V8H11V4H13V8H20V12H13V16Z"/>
  </svg>
);

// Money/Revenue icon
export const MoneyIcon = ({ className = "icon", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"/>
  </svg>
);

// Target/Goal icon
export const TargetIcon = ({ className = "icon", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10Z"/>
  </svg>
);

// Processing/Gear icon
export const ProcessingIcon = ({ className = "icon", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.98C19.47,12.66 19.5,12.34 19.5,12C19.5,11.66 19.47,11.34 19.43,11.02L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.65 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11.02C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.66 4.57,12.98L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.98Z"/>
  </svg>
);

// Innovation/Lightbulb icon
export const InnovationIcon = ({ className = "icon", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12,2A7,7 0 0,0 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1 0 0,0 9,18H15A1,1 0 0,0 16,17V14.74C17.81,13.47 19,11.38 19,9A7,7 0 0,0 12,2M9,21V20H15V21A1,1 0 0,1 14,22H10A1,1 0 0,1 9,21M12,4.75A4.25,4.25 0 0,1 16.25,9C16.25,10.32 15.64,11.5 14.69,12.31L14,12.81V16H10V12.81L9.31,12.31C8.36,11.5 7.75,10.32 7.75,9A4.25,4.25 0 0,1 12,4.75Z"/>
  </svg>
);
