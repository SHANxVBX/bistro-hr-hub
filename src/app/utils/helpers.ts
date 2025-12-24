// Utility functions for the app

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  
  if (hour < 12) {
    return 'Good Morning';
  } else if (hour < 17) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
};

export const getGreetingEmoji = (): string => {
  const hour = new Date().getHours();
  
  if (hour < 12) {
    return '☀️';
  } else if (hour < 17) {
    return '🌤️';
  } else {
    return '🌙';
  }
};
