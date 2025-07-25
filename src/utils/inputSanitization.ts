
import DOMPurify from 'dompurify';

export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Remove potential XSS vectors
  const sanitized = DOMPurify.sanitize(input.trim(), {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
  
  return sanitized;
};

export const sanitizeEmail = (email: string): string => {
  if (!email) return '';
  
  // Basic email sanitization
  const sanitized = email.trim().toLowerCase();
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitized)) {
    throw new Error('Invalid email format');
  }
  
  return sanitized;
};

export const sanitizePhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  // Remove all non-numeric characters except + at the beginning
  const sanitized = phone.replace(/[^\d+]/g, '');
  
  // Validate phone format (basic)
  if (sanitized.length < 10 || sanitized.length > 15) {
    throw new Error('Invalid phone number format');
  }
  
  return sanitized;
};

export const sanitizeUrl = (url: string): string => {
  if (!url) return '';
  
  try {
    const urlObj = new URL(url);
    
    // Only allow HTTP and HTTPS protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      throw new Error('Invalid URL protocol');
    }
    
    return urlObj.toString();
  } catch (error) {
    throw new Error('Invalid URL format');
  }
};

export const validateRequired = (value: string, fieldName: string): void => {
  if (!value || value.trim().length === 0) {
    throw new Error(`${fieldName} is required`);
  }
};

export const validateLength = (value: string, min: number, max: number, fieldName: string): void => {
  if (value.length < min || value.length > max) {
    throw new Error(`${fieldName} must be between ${min} and ${max} characters`);
  }
};

export const validateAlphanumeric = (value: string, fieldName: string): void => {
  if (!/^[a-zA-Z0-9\s-_]+$/.test(value)) {
    throw new Error(`${fieldName} can only contain letters, numbers, spaces, hyphens, and underscores`);
  }
};

export const preventSqlInjection = (value: string): string => {
  // Remove SQL injection patterns
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
    /(\b(OR|AND)\s+\d+\s*=\s*\d+)/gi,
    /('|(\\|;|--|\/\*|\*\/))/gi
  ];
  
  let sanitized = value;
  sqlPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });
  
  return sanitized;
};
