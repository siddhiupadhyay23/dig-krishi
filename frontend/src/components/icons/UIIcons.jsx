import React from 'react';

// User/Profile icon
export const UserIcon = ({ className = "icon", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,6A2,2 0 0,0 10,8A2,2 0 0,0 12,10A2,2 0 0,0 14,8A2,2 0 0,0 12,6M12,13C14.67,13 20,14.33 20,17V20H4V17C4,14.33 9.33,13 12,13M12,14.9C9.03,14.9 5.9,16.36 5.9,17V18.1H18.1V17C18.1,16.36 14.97,14.9 12,14.9Z"/>
  </svg>
);

// Settings/Gear icon
export const SettingsIcon = ({ className = "icon", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10M10,22C9.75,22 9.54,21.82 9.5,21.58L9.13,18.93C8.5,18.68 7.96,18.34 7.44,17.94L4.95,18.95C4.73,19.03 4.46,18.95 4.34,18.73L2.34,15.27C2.22,15.05 2.27,14.78 2.46,14.63L4.57,12.98C4.53,12.66 4.5,12.33 4.5,12C4.5,11.67 4.53,11.34 4.57,11.02L2.46,9.37C2.27,9.22 2.22,8.95 2.34,8.73L4.34,5.27C4.46,5.05 4.73,4.96 4.95,5.05L7.44,6.05C7.96,5.66 8.5,5.32 9.13,5.07L9.5,2.42C9.54,2.18 9.75,2 10,2H14C14.25,2 14.46,2.18 14.5,2.42L14.87,5.07C15.5,5.32 16.04,5.66 16.56,6.05L19.05,5.05C19.27,4.96 19.54,5.05 19.66,5.27L21.66,8.73C21.78,8.95 21.73,9.22 21.54,9.37L19.43,11.02C19.47,11.34 19.5,11.67 19.5,12C19.5,12.33 19.47,12.66 19.43,12.98L21.54,14.63C21.73,14.78 21.78,15.05 21.66,15.27L19.66,18.73C19.54,18.95 19.27,19.03 19.05,18.95L16.56,17.94C16.04,18.34 15.5,18.68 14.87,18.93L14.5,21.58C14.46,21.82 14.25,22 14,22H10M11.25,4L10.88,6.61C9.68,6.86 8.62,7.5 7.85,8.39L5.44,7.35L4.69,8.65L6.8,10.2C6.4,11.37 6.4,12.64 6.8,13.8L4.68,15.36L5.43,16.64L7.86,15.62C8.63,16.5 9.68,17.14 10.87,17.38L11.24,20H12.76L13.13,17.39C14.32,17.14 15.37,16.5 16.14,15.62L18.57,16.64L19.32,15.36L17.2,13.81C17.6,12.64 17.6,11.37 17.2,10.2L19.31,8.65L18.56,7.35L16.15,8.39C15.38,7.5 14.32,6.86 13.12,6.62L12.75,4H11.25Z"/>
  </svg>
);

// Edit/Pen icon
export const EditIcon = ({ className = "icon", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"/>
  </svg>
);

// Save icon
export const SaveIcon = ({ className = "icon", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z"/>
  </svg>
);

// Cancel/Close icon
export const CancelIcon = ({ className = "icon", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
  </svg>
);

// Success/Check icon
export const CheckIcon = ({ className = "icon", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
  </svg>
);

// Warning/Alert icon
export const WarningIcon = ({ className = "icon", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
  </svg>
);

// Error icon
export const ErrorIcon = ({ className = "icon", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z"/>
  </svg>
);

// Info icon
export const InfoIcon = ({ className = "icon", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
  </svg>
);

// Help/Support icon
export const HelpIcon = ({ className = "icon", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M15.07,11.25L14.17,12.17C13.45,12.89 13,13.5 13,15H11V14.5C11,13.39 11.45,12.39 12.17,11.67L13.41,10.41C13.78,10.05 14,9.55 14,9C14,7.89 13.1,7 12,7A2,2 0 0,0 10,9H8A4,4 0 0,1 12,5A4,4 0 0,1 16,9C16,9.88 15.64,10.67 15.07,11.25M13,19H11V17H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z"/>
  </svg>
);

// Government building icon
export const GovernmentIcon = ({ className = "icon", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M6,20V14H10V20H6M2,21V9L12,4L22,9V21H2M4,19H8V11H4V19M10,19H14V11H10V19M16,19H20V11H16V19Z"/>
  </svg>
);

// Document/File icon
export const DocumentIcon = ({ className = "icon", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
  </svg>
);

// Camera icon
export const CameraIcon = ({ className = "icon", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M4,5H7L9,3H15L17,5H20A2,2 0 0,1 22,7V19A2,2 0 0,1 20,21H4A2,2 0 0,1 2,19V7A2,2 0 0,1 4,5M4,7V19H20V7H16.83L15,5H9L7.17,7H4M12,8A5,5 0 0,1 17,13A5,5 0 0,1 12,18A5,5 0 0,1 7,13A5,5 0 0,1 12,8M12,10A3,3 0 0,0 9,13A3,3 0 0,0 12,16A3,3 0 0,0 15,13A3,3 0 0,0 12,10Z"/>
  </svg>
);

// Delete/Trash icon
export const DeleteIcon = ({ className = "icon", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
  </svg>
);

// Add/Plus icon
export const AddIcon = ({ className = "icon", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
  </svg>
);

// Calendar icon
export const CalendarIcon = ({ className = "icon", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z"/>
  </svg>
);

// Location/Map icon
export const LocationIcon = ({ className = "icon", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"/>
  </svg>
);

// Loading/Hourglass icon
export const LoadingIcon = ({ className = "icon", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M6,2V8H6V8L10,12L6,16V16H6V22H18V16H18V16L14,12L18,8V8H18V2H6M16,16.5V20H8V16.5L12,12.5L16,16.5M12,11.5L8,7.5V4H16V7.5L12,11.5Z"/>
  </svg>
);

// Celebration/Party icon
export const CelebrationIcon = ({ className = "icon", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M2,16.1A5,5 0 0,1 5.9,20.1A5,5 0 0,1 1.9,16.1A5,5 0 0,1 5.9,12.1A5,5 0 0,1 9.9,16.1A5,5 0 0,1 5.9,20.1M15.9,12.1A3,3 0 0,1 18.9,15.1A3,3 0 0,1 15.9,18.1A3,3 0 0,1 12.9,15.1A3,3 0 0,1 15.9,12.1M11.5,7.1C11.5,8.76 10.16,10.1 8.5,10.1C6.84,10.1 5.5,8.76 5.5,7.1C5.5,5.44 6.84,4.1 8.5,4.1C10.16,4.1 11.5,5.44 11.5,7.1M13.5,2.1C13.5,3.2 12.6,4.1 11.5,4.1C10.4,4.1 9.5,3.2 9.5,2.1C9.5,1 10.4,0.1 11.5,0.1C12.6,0.1 13.5,1 13.5,2.1M22,12.1C22,13.76 20.66,15.1 19,15.1C17.34,15.1 16,13.76 16,12.1C16,10.44 17.34,9.1 19,9.1C20.66,9.1 22,10.44 22,12.1Z"/>
  </svg>
);

// Rocket/Launch icon
export const RocketIcon = ({ className = "icon", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M2.81,14.12L5.64,11.29L8.17,10.79C6.36,6.81 7.62,2.05 12.14,0.08C16.74,-2.05 22.05,0.37 22.05,5.44C22.05,7.69 21.09,9.5 19.88,11.29C20.84,12.25 20.84,13.75 19.88,14.71C18.92,15.67 17.42,15.67 16.46,14.71C14.67,15.92 12.86,16.88 10.61,16.88C5.54,16.88 3.12,11.57 5.25,6.97C7.22,2.45 11.98,1.19 15.96,2.26L15.46,4.79L18.29,7.62L14.37,11.54L7.9,18.01C7.4,18.51 6.60,18.51 6.10,18.01C5.6,17.51 5.6,16.71 6.10,16.21L8.54,13.77L2.81,14.12M16.77,9.75A1.25,1.25 0 0,0 18.02,8.5A1.25,1.25 0 0,0 16.77,7.25A1.25,1.25 0 0,0 15.52,8.5A1.25,1.25 0 0,0 16.77,9.75Z"/>
  </svg>
);
