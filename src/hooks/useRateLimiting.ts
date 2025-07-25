
import { useState, useCallback } from 'react';

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
}

interface RateLimitState {
  attempts: number;
  firstAttempt: number;
  blockedUntil: number;
}

const defaultConfig: RateLimitConfig = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
  blockDurationMs: 30 * 60 * 1000, // 30 minutes
};

export const useRateLimiting = (key: string, config: Partial<RateLimitConfig> = {}) => {
  const finalConfig = { ...defaultConfig, ...config };
  const storageKey = `rate_limit_${key}`;

  const getState = useCallback((): RateLimitState => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) return { attempts: 0, firstAttempt: 0, blockedUntil: 0 };
      return JSON.parse(stored);
    } catch {
      return { attempts: 0, firstAttempt: 0, blockedUntil: 0 };
    }
  }, [storageKey]);

  const setState = useCallback((state: RateLimitState) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // Ignore storage errors
    }
  }, [storageKey]);

  const [state, setStateInternal] = useState<RateLimitState>(getState);

  const updateState = useCallback((newState: RateLimitState) => {
    setStateInternal(newState);
    setState(newState);
  }, [setState]);

  const isBlocked = useCallback((): boolean => {
    const now = Date.now();
    const currentState = getState();
    
    // Check if still blocked
    if (currentState.blockedUntil > now) {
      return true;
    }
    
    // Reset if block period has passed
    if (currentState.blockedUntil > 0 && currentState.blockedUntil <= now) {
      const resetState = { attempts: 0, firstAttempt: 0, blockedUntil: 0 };
      updateState(resetState);
      return false;
    }
    
    return false;
  }, [getState, updateState]);

  const checkLimit = useCallback((): { allowed: boolean; remainingAttempts: number; resetTime?: number } => {
    const now = Date.now();
    const currentState = getState();
    
    // Check if blocked
    if (currentState.blockedUntil > now) {
      return { 
        allowed: false, 
        remainingAttempts: 0, 
        resetTime: currentState.blockedUntil 
      };
    }
    
    // Reset if window has passed
    if (currentState.firstAttempt > 0 && (now - currentState.firstAttempt) > finalConfig.windowMs) {
      const resetState = { attempts: 0, firstAttempt: 0, blockedUntil: 0 };
      updateState(resetState);
      return { 
        allowed: true, 
        remainingAttempts: finalConfig.maxAttempts - 1 
      };
    }
    
    // Check if under limit
    if (currentState.attempts < finalConfig.maxAttempts) {
      return { 
        allowed: true, 
        remainingAttempts: finalConfig.maxAttempts - currentState.attempts - 1 
      };
    }
    
    // Over limit - block
    const newState = {
      ...currentState,
      blockedUntil: now + finalConfig.blockDurationMs
    };
    updateState(newState);
    
    return { 
      allowed: false, 
      remainingAttempts: 0, 
      resetTime: newState.blockedUntil 
    };
  }, [getState, updateState, finalConfig]);

  const recordAttempt = useCallback((): void => {
    const now = Date.now();
    const currentState = getState();
    
    // Don't record if blocked
    if (currentState.blockedUntil > now) {
      return;
    }
    
    // Start new window if needed
    if (currentState.attempts === 0) {
      updateState({
        attempts: 1,
        firstAttempt: now,
        blockedUntil: 0
      });
    } else {
      updateState({
        ...currentState,
        attempts: currentState.attempts + 1
      });
    }
  }, [getState, updateState]);

  const reset = useCallback((): void => {
    const resetState = { attempts: 0, firstAttempt: 0, blockedUntil: 0 };
    updateState(resetState);
  }, [updateState]);

  const getBlockedTimeRemaining = useCallback((): number => {
    const now = Date.now();
    const currentState = getState();
    
    if (currentState.blockedUntil <= now) return 0;
    return currentState.blockedUntil - now;
  }, [getState]);

  return {
    isBlocked: isBlocked(),
    checkLimit,
    recordAttempt,
    reset,
    getBlockedTimeRemaining,
    remainingAttempts: finalConfig.maxAttempts - state.attempts
  };
};
