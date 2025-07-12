
/**
 * User Invitation Service Implementation
 * Now uses separated invitation edge functions
 */

import { supabase } from '@/integrations/supabase/client';
import {
  createError,
  createErrorResponse,
  createSuccessResponse,
  ERROR_CODES,
  handleUnknownError,
  logError,
  type ApiResponse,
} from '@/utils/errorHandler';
import {
  validateObject,
  VALIDATION_RULES,
} from '@/utils/validation';
import { logger } from '@/utils/logger';
import type {
  IUserInvitationService,
  InviteUserRequest,
  InviteUserResult,
  CancelInvitationRequest,
  ResendInvitationRequest,
} from '@/domain/interfaces/IUserInvitationService';

export class UserInvitationService implements IUserInvitationService {
  private validateInvitationRequest(request: InviteUserRequest) {
    const requestRecord: Record<string, unknown> = {
      organizationId: request.organizationId,
      role: request.role,
      email: request.email,
      enhancedRole: request.enhancedRole,
    };

    const validation = validateObject(requestRecord, {
      organizationId: [
        VALIDATION_RULES.required('Organization ID'),
        VALIDATION_RULES.uuid('Organization ID'),
      ],
      role: [
        VALIDATION_RULES.required('Role'),
        VALIDATION_RULES.length(1, 50, 'Role'),
      ],
    });

    return validation;
  }

  private processSupabaseResponse(data: unknown, error: unknown): ApiResponse<InviteUserResult> {
    if (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      if (errorMessage.includes('NetworkError') || errorMessage.includes('Failed to fetch')) {
        const appError = createError(
          ERROR_CODES.SYSTEM_NETWORK_ERROR,
          'Network connection failed. Please check your internet connection.',
          'high'
        );
        logError('Network error in invitation service', { originalError: errorMessage });
        return createErrorResponse(appError);
      }
      
      if (errorMessage.includes('FunctionsError')) {
        const message = typeof data === 'object' && data !== null && 'error' in data
          ? String(data.error)
          : 'Service temporarily unavailable. Please try again.';
        
        const appError = createError(
          ERROR_CODES.SYSTEM_DATABASE_ERROR,
          message,
          'high'
        );
        logError('Database error in invitation service', { originalError: errorMessage });
        return createErrorResponse(appError);
      }
      
      const unknownError = handleUnknownError(error, 'Failed to process invitation');
      logError('Unknown error in invitation process');
      return createErrorResponse(unknownError);
    }

    if (!data) {
      const appError = createError(
        ERROR_CODES.SYSTEM_UNKNOWN_ERROR,
        'No response received from invitation service',
        'high'
      );
      logError('No data received from invitation service');
      return createErrorResponse(appError);
    }

    if (typeof data === 'object' && data !== null && 'success' in data) {
      const response = data as InviteUserResult;
      
      if (response.success === false) {
        const errorCode = response.message?.includes('already exists') 
          ? ERROR_CODES.BUSINESS_USER_ALREADY_EXISTS
          : ERROR_CODES.BUSINESS_ORGANIZATION_NOT_FOUND;
        
        const appError = createError(
          errorCode,
          response.message || 'Invitation failed',
          'medium'
        );
        logError('Business logic error in invitation', { response });
        return createErrorResponse(appError);
      }

      return createSuccessResponse(response);
    }

    return createSuccessResponse({
      success: true,
      message: 'Invitation processed successfully',
      type: 'invitation_sent',
    } as InviteUserResult);
  }

  async inviteUser(request: InviteUserRequest): Promise<ApiResponse<InviteUserResult>> {
    logger.info('UserInvitationService: Processing invitation request', {
      email: request.email,
      organizationId: request.organizationId,
      role: request.role,
    });

    const validation = this.validateInvitationRequest(request);
    if (!validation.isValid) {
      const firstError = validation.errors[0];
      logError('Validation failed for invitation request', { ...request });
      return createErrorResponse(firstError);
    }

    try {
      // Use the new separated invitation edge function
      const { data, error } = await supabase.functions.invoke('invite-user-to-organization', {
        body: {
          email: request.email,
          organizationId: request.organizationId,
          role: request.role,
          enhancedRole: request.enhancedRole || request.role,
        },
      });

      logger.debug('UserInvitationService: Received response from invitation function', {
        hasData: !!data,
        hasError: !!error,
      });

      return this.processSupabaseResponse(data, error);

    } catch (error: unknown) {
      const handledError = handleUnknownError(
        error,
        'Failed to send invitation. Please try again.'
      );
      logError('Exception in invitation service', { ...request });
      return createErrorResponse(handledError);
    }
  }

  async cancelInvitation(request: CancelInvitationRequest): Promise<ApiResponse<void>> {
    logger.info('UserInvitationService: Cancelling invitation', {
      invitationId: request.invitationId,
    });

    const requestRecord: Record<string, unknown> = {
      invitationId: request.invitationId,
    };

    const validation = validateObject(requestRecord, {
      invitationId: [
        VALIDATION_RULES.required('Invitation ID'),
        VALIDATION_RULES.uuid('Invitation ID'),
      ],
    });

    if (!validation.isValid) {
      const firstError = validation.errors[0];
      logError('Validation failed for cancel invitation', { ...request });
      return createErrorResponse(firstError);
    }

    try {
      const { error } = await supabase
        .from('user_invitations')
        .update({ status: 'cancelled' })
        .eq('id', request.invitationId);

      if (error) {
        const appError = createError(
          ERROR_CODES.SYSTEM_DATABASE_ERROR,
          'Failed to cancel invitation',
          'medium',
          { supabaseError: error }
        );
        logError('Database error cancelling invitation', { ...request });
        return createErrorResponse(appError);
      }

      logger.info('UserInvitationService: Invitation cancelled successfully', {
        invitationId: request.invitationId,
      });
      return createSuccessResponse(undefined);

    } catch (error: unknown) {
      const handledError = handleUnknownError(error, 'Failed to cancel invitation');
      logError('Exception cancelling invitation', { ...request });
      return createErrorResponse(handledError);
    }
  }

  async resendInvitation(request: ResendInvitationRequest): Promise<ApiResponse<InviteUserResult>> {
    logger.info('UserInvitationService: Resending invitation', {
      invitationId: request.invitationId,
    });

    // Implementation placeholder - would need to fetch invitation details and resend
    const appError = createError(
      ERROR_CODES.SYSTEM_UNKNOWN_ERROR,
      'Resend invitation feature not yet implemented',
      'low'
    );
    return createErrorResponse(appError);
  }
}

export const userInvitationService = new UserInvitationService();
