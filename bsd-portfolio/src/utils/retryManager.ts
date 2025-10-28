// Retry Manager for API calls with exponential backoff
export class RetryManager {
  private static retryCounts: Map<string, number> = new Map();
  private static fallbackStates: Map<string, boolean> = new Map();
  
  // Maximum number of retries before giving up
  private static readonly MAX_RETRIES = 3;
  
  // Base delay between retries (in milliseconds)
  private static readonly BASE_DELAY = 1000;
  
  // Maximum delay between retries (in milliseconds)
  private static readonly MAX_DELAY = 10000;
  
  /**
   * Check if we should retry an API call
   * @param key Unique identifier for the API call (e.g., 'projects', 'skills')
   * @returns true if we should retry, false if we should use fallback
   */
  static shouldRetry(key: string): boolean {
    const retryCount = this.retryCounts.get(key) || 0;
    const isInFallbackMode = this.fallbackStates.get(key) || false;
    
    // If already in fallback mode, don't retry
    if (isInFallbackMode) {
      return false;
    }
    
    // If we've exceeded max retries, don't retry
    if (retryCount >= this.MAX_RETRIES) {
      this.fallbackStates.set(key, true);
      return false;
    }
    
    return true;
  }
  
  /**
   * Record a failed API call attempt
   * @param key Unique identifier for the API call
   */
  static recordFailure(key: string): void {
    const currentCount = this.retryCounts.get(key) || 0;
    this.retryCounts.set(key, currentCount + 1);
    
    console.log(`🔄 Retry attempt ${currentCount + 1}/${this.MAX_RETRIES} for ${key}`);
  }
  
  /**
   * Record a successful API call and reset retry count
   * @param key Unique identifier for the API call
   */
  static recordSuccess(key: string): void {
    this.retryCounts.delete(key);
    this.fallbackStates.delete(key);
    console.log(`✅ API call successful for ${key}, reset retry count`);
  }
  
  /**
   * Get the delay for the next retry attempt
   * @param key Unique identifier for the API call
   * @returns Delay in milliseconds
   */
  static getRetryDelay(key: string): number {
    const retryCount = this.retryCounts.get(key) || 0;
    
    // Exponential backoff with jitter
    const exponentialDelay = this.BASE_DELAY * Math.pow(2, retryCount - 1);
    const jitter = Math.random() * 1000; // Add up to 1 second of jitter
    const delay = Math.min(exponentialDelay + jitter, this.MAX_DELAY);
    
    return Math.floor(delay);
  }
  
  /**
   * Check if we're currently in fallback mode for a given key
   * @param key Unique identifier for the API call
   * @returns true if in fallback mode
   */
  static isInFallbackMode(key: string): boolean {
    return this.fallbackStates.get(key) || false;
  }
  
  /**
   * Force reset retry state for a given key (useful for manual retry)
   * @param key Unique identifier for the API call
   */
  static resetRetryState(key: string): void {
    this.retryCounts.delete(key);
    this.fallbackStates.delete(key);
    console.log(`🔄 Reset retry state for ${key}`);
  }
  
  /**
   * Get current retry count for a given key
   * @param key Unique identifier for the API call
   * @returns Current retry count
   */
  static getRetryCount(key: string): number {
    return this.retryCounts.get(key) || 0;
  }
  
  /**
   * Get all retry states (for debugging)
   * @returns Object containing all retry states
   */
  static getRetryStates(): Record<string, { retryCount: number; isInFallbackMode: boolean }> {
    const states: Record<string, { retryCount: number; isInFallbackMode: boolean }> = {};
    
    // Convert Map keys to array to avoid iteration issues
    const retryKeys = Array.from(this.retryCounts.keys());
    for (const key of retryKeys) {
      states[key] = {
        retryCount: this.retryCounts.get(key) || 0,
        isInFallbackMode: this.fallbackStates.get(key) || false
      };
    }
    
    const fallbackKeys = Array.from(this.fallbackStates.keys());
    for (const key of fallbackKeys) {
      if (!states[key]) {
        states[key] = {
          retryCount: 0,
          isInFallbackMode: this.fallbackStates.get(key) || false
        };
      }
    }
    
    return states;
  }
}
