
import { useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { responseTimeService } from '@/services/responseTimeService';

export const useSessionManagement = () => {
  const sessionId = useRef<string>(uuidv4());

  const startNewSession = () => {
    if (sessionId.current) {
      responseTimeService.clearSession(sessionId.current);
    }
    sessionId.current = uuidv4();
    responseTimeService.startSession(sessionId.current);
  };

  const startQuestionTiming = (questionId: string) => {
    responseTimeService.startQuestion(sessionId.current, questionId);
  };

  const endSession = () => {
    responseTimeService.endSession(sessionId.current);
    return responseTimeService.getSessionTime(sessionId.current);
  };

  const clearSession = () => {
    if (sessionId.current) {
      responseTimeService.clearSession(sessionId.current);
    }
  };

  return {
    sessionId: sessionId.current,
    startNewSession,
    startQuestionTiming,
    endSession,
    clearSession
  };
};
