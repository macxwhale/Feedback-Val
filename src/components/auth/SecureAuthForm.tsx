
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/components/auth/AuthWrapper';
import { useSecurityMonitoring } from '@/hooks/useSecurityMonitoring';
import { useRateLimiting } from '@/hooks/useRateLimiting';
import { validatePassword, getPasswordStrength, getPasswordStrengthColor } from '@/utils/passwordValidation';
import { sanitizeInput, sanitizeEmail } from '@/utils/inputSanitization';
import { Eye, EyeOff, Shield, AlertTriangle } from 'lucide-react';

interface SecureAuthFormProps {
  mode: 'signin' | 'signup';
  onModeChange: (mode: 'signin' | 'signup') => void;
}

export const SecureAuthForm: React.FC<SecureAuthFormProps> = ({ mode, onModeChange }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn, signUp } = useAuth();
  const { logFailedLogin, logSuccessfulLogin, logSuspiciousActivity } = useSecurityMonitoring();
  const rateLimiter = useRateLimiting(`auth_${mode}`, { maxAttempts: 5, windowMs: 15 * 60 * 1000 });

  const passwordValidation = mode === 'signup' ? validatePassword(password) : null;
  const passwordStrength = passwordValidation ? getPasswordStrength(passwordValidation.score) : '';
  const passwordStrengthColor = passwordValidation ? getPasswordStrengthColor(passwordValidation.score) : '';

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check rate limiting
    const limitCheck = rateLimiter.checkLimit();
    if (!limitCheck.allowed) {
      const remainingTime = Math.ceil((limitCheck.resetTime! - Date.now()) / 1000 / 60);
      setError(`Too many attempts. Please try again in ${remainingTime} minutes.`);
      logSuspiciousActivity(`Rate limit exceeded for ${mode}`, undefined);
      return;
    }

    try {
      // Validate and sanitize inputs
      const sanitizedEmail = sanitizeEmail(email);
      const sanitizedPassword = sanitizeInput(password);

      if (mode === 'signup') {
        // Validate password strength
        if (!passwordValidation?.isValid) {
          setError(passwordValidation?.errors[0] || 'Password does not meet requirements');
          return;
        }

        // Confirm password match
        if (sanitizedPassword !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }
      }

      setLoading(true);
      rateLimiter.recordAttempt();

      let result;
      if (mode === 'signin') {
        result = await signIn(sanitizedEmail, sanitizedPassword);
      } else {
        result = await signUp(sanitizedEmail, sanitizedPassword);
      }

      if (result.error) {
        setError(result.error.message || 'Authentication failed');
        logFailedLogin(sanitizedEmail, result.error.message || 'Unknown error');
      } else {
        logSuccessfulLogin(sanitizedEmail);
        rateLimiter.reset();
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      logFailedLogin(email, err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [email, password, confirmPassword, mode, signIn, signUp, rateLimiter, passwordValidation, logFailedLogin, logSuccessfulLogin, logSuspiciousActivity]);

  const blockedTimeRemaining = rateLimiter.getBlockedTimeRemaining();
  const isBlocked = rateLimiter.isBlocked;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center mb-6">
        <Shield className="h-6 w-6 mr-2 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">
          {mode === 'signin' ? 'Sign In' : 'Create Account'}
        </h2>
      </div>

      {isBlocked && (
        <Alert className="mb-4 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            Account temporarily locked due to multiple failed attempts. 
            Please try again in {Math.ceil(blockedTimeRemaining / 1000 / 60)} minutes.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={loading || isBlocked}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative mt-1">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading || isBlocked}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              disabled={loading || isBlocked}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {mode === 'signup' && password && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Password Strength:</span>
              <span className={`text-sm font-medium ${passwordStrengthColor}`}>
                {passwordStrength}
              </span>
            </div>
            <Progress 
              value={(passwordValidation?.score || 0) * 20} 
              className="h-2"
            />
            {passwordValidation?.errors.length > 0 && (
              <ul className="mt-2 text-sm text-red-600">
                {passwordValidation.errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {mode === 'signup' && (
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              disabled={loading || isBlocked}
              className="mt-1"
            />
          </div>
        )}

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={loading || isBlocked}
        >
          {loading ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => onModeChange(mode === 'signin' ? 'signup' : 'signin')}
            className="text-blue-600 hover:text-blue-800 text-sm"
            disabled={loading || isBlocked}
          >
            {mode === 'signin' 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"
            }
          </button>
        </div>
      </form>

      <div className="mt-6 text-xs text-gray-500">
        <p>🔒 This form is protected by advanced security measures including:</p>
        <ul className="mt-2 space-y-1">
          <li>• Rate limiting to prevent brute force attacks</li>
          <li>• Input sanitization and validation</li>
          <li>• Password strength requirements</li>
          <li>• Security event logging</li>
        </ul>
      </div>
    </div>
  );
};
