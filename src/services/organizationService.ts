
import { supabase } from '@/integrations/supabase/client';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  is_active: boolean;
  plan_type?: string;
  trial_ends_at?: string;
  billing_email?: string;
  max_responses?: number;
  created_by_user_id?: string;
  settings?: any;
  created_at: string;
  updated_at: string;
}

export interface CreateOrganizationData {
  name: string;
  slug: string;
  domain?: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  plan_type?: string;
  trial_ends_at?: string;
  billing_email?: string;
  max_responses?: number;
  created_by_user_id?: string;
  settings?: any;
}

export const getOrganizationBySlug = async (slug: string): Promise<Organization | null> => {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('Error fetching organization by slug:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching organization:', error);
    return null;
  }
};

export const getOrganizationByDomain = async (domain: string): Promise<Organization | null> => {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('domain', domain)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('Error fetching organization by domain:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching organization:', error);
    return null;
  }
};

export const getAllOrganizations = async (): Promise<Organization[]> => {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching organizations:', error);
      // Return empty array instead of throwing to prevent UI crashes
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return [];
  }
};

export const createOrganization = async (orgData: CreateOrganizationData): Promise<Organization | null> => {
  try {
    // Get current user ID for created_by_user_id
    const { data: { user } } = await supabase.auth.getUser();
    
    const organizationToCreate = {
      ...orgData,
      created_by_user_id: user?.id || orgData.created_by_user_id,
      is_active: true,
      primary_color: orgData.primary_color || '#007ACE',
      secondary_color: orgData.secondary_color || '#073763',
      plan_type: orgData.plan_type || 'free',
      max_responses: orgData.max_responses || 100
    };

    const { data, error } = await supabase
      .from('organizations')
      .insert(organizationToCreate)
      .select()
      .single();

    if (error) {
      console.error('Error creating organization:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error creating organization:', error);
    return null;
  }
};

export const updateOrganization = async (id: string, updates: Partial<Organization>): Promise<Organization | null> => {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating organization:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error updating organization:', error);
    return null;
  }
};
