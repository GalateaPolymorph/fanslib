export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  context: string,
  onError?: (error: Error) => void
): Promise<T | null> => {
  try {
    return await operation();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`${context}:`, errorMessage);
    onError?.(error instanceof Error ? error : new Error(errorMessage));
    return null;
  }
};

export const createErrorHandler = (context: string) => 
  <T>(operation: () => Promise<T>, onError?: (error: Error) => void) =>
    withErrorHandling(operation, context, onError);