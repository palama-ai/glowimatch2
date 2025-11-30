// Debug logging utility
export const debugLogger = {
  error: (context, error) => {
    console.error(`[${context}] Error:`, {
      message: error?.message,
      details: error?.details,
      hint: error?.hint,
      code: error?.code,
      stack: error?.stack,
    });
  },
  
  info: (context, data) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[${context}] Info:`, data);
    }
  }
};