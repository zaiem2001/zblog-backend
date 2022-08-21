export const rejectIf = (condition: Boolean, message: string): void => {
  if (condition) {
    throw new Error(message);
  }
};
