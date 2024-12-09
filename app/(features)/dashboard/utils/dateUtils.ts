export const formatDate = (date: Date | string) => {
  try {
    return new Date(date).toLocaleDateString();
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(date);
  }
};
