
import { supabase } from '@/integrations/supabase/client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  confirmPassword: string;
}

export class AuthService {
  static async login(credentials: LoginCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw error;
    return data;
  }

  static async register(userData: RegisterData) {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });

    if (error) throw error;
    return data;
  }

  static async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  static async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  }

  static async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
}
