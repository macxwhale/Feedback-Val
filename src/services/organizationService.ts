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
  feedback_header_title?: string;
  feedback_header_subtitle?: string;
  welcome_screen_title?: string;
  welcome_screen_description?: string;
  thank_you_title?: string;
  thank_you_message?: string;
  custom_css?: any;
  flow_configuration?: any;
  created_at: string;
  updated_at: string;
}

export interface OrganizationAsset {
  id: string;
  organization_id: string;
  asset_type: string;
  asset_url: string;
  asset_name?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface OrganizationTheme {
  id: string;
  organization_id: string;
  theme_name: string;
  is_active: boolean;
  colors: any;
  typography?: any;
  spacing?: any;
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

export const getOrganizationAssets = async (organizationId: string): Promise<OrganizationAsset[]> => {
  try {
    const { data, error } = await supabase
      .from('organization_assets')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .order('display_order')
      .order('created_at');

    if (error) {
      console.error('Error fetching organization assets:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching organization assets:', error);
    return [];
  }
};

export const getOrganizationTheme = async (organizationId: string): Promise<OrganizationTheme | null> => {
  try {
    const { data, error } = await supabase
      .from('organization_themes')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching organization theme:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching organization theme:', error);
    return null;
  }
};

export const getOrganizationConfig = async (slug: string) => {
  try {
    const { data, error } = await supabase.rpc('get_organization_config', {
      org_slug: slug
    });

    if (error) {
      console.error('Error fetching organization config:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching organization config:', error);
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
