import { supabase } from '@/integrations/supabase/client';
import type { Organization, OrganizationAsset, OrganizationTheme, CreateOrganizationData } from './organizationService.types';

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
  features_config?: any; // <-- ADDED
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
  features_config?: any; // <-- ADDED
}

export const getOrganizationBySlug = async (slug: string): Promise<Organization | null> => {
  try {
    console.log('getOrganizationBySlug - Fetching slug:', slug);
    
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('getOrganizationBySlug - Supabase error:', error);
      return null;
    }

    // If organization found, ensure logo URL is properly set
    if (data && data.logo_storage_path && !data.logo_url) {
      const { data: { publicUrl } } = supabase.storage
        .from('organization-logos')
        .getPublicUrl(data.logo_storage_path);
      
      // Update the organization with the public URL
      await supabase
        .from('organizations')
        .update({ logo_url: publicUrl })
        .eq('id', data.id);
      
      data.logo_url = publicUrl;
    }

    console.log('getOrganizationBySlug - Result:', data);
    return data;
  } catch (error) {
    console.error('getOrganizationBySlug - Network error:', error);
    
    // Return fallback data for police-sacco if network fails
    if (slug === 'police-sacco') {
      console.log('getOrganizationBySlug - Returning fallback police-sacco data');
      return {
        id: 'fallback-police-sacco',
        name: 'Kenya National Police DT SACCO',
        slug: 'police-sacco',
        primary_color: '#073763',
        secondary_color: '#007ACE',
        is_active: true,
        logo_url: '/lovable-uploads/367347fe-02da-4338-b8ba-91138293d303.png',
        feedback_header_title: 'Share Your Experience',
        feedback_header_subtitle: 'Help us serve you better with your valuable feedback',
        welcome_screen_title: 'Share Your Experience',
        welcome_screen_description: 'Help us serve you better with your valuable feedback. Your input helps us improve our services and better serve our community.',
        thank_you_title: 'Thank You for Your Feedback!',
        thank_you_message: 'Your valuable feedback has been received and will help us improve our services.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
    
    return null;
  }
};

export const getOrganizationByDomain = async (domain: string): Promise<Organization | null> => {
  try {
    console.log('getOrganizationByDomain - Fetching domain:', domain);
    
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('domain', domain)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('getOrganizationByDomain - Supabase error:', error);
      return null;
    }

    console.log('getOrganizationByDomain - Result:', data);
    return data;
  } catch (error) {
    console.error('getOrganizationByDomain - Network error:', error);
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

    // Accept plan_type only as supported enum, fallback to 'starter'
    let safePlanType: 'starter' | 'pro' | 'enterprise' = 'starter';
    if (orgData.plan_type === 'pro' || orgData.plan_type === 'enterprise') {
      safePlanType = orgData.plan_type;
    }

    const organizationToCreate = {
      ...orgData,
      created_by_user_id: user?.id || orgData.created_by_user_id,
      is_active: true,
      primary_color: orgData.primary_color || '#007ACE',
      secondary_color: orgData.secondary_color || '#073763',
      plan_type: safePlanType,
      max_responses: orgData.max_responses || 100,
      features_config: orgData.features_config || null,
      trial_ends_at: orgData.trial_ends_at || null,
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

    // Log in organization_audit_log (if table exists and user authenticated, best effort)
    if (data?.id && user?.id) {
      await supabase
        .from('organization_audit_log')
        .insert({
          organization_id: data.id,
          action: "create_organization",
          performed_by: user.id,
          new_value: data,
        });
    }

    return data;
  } catch (error) {
    console.error('Error creating organization:', error);
    return null;
  }
};

export const updateOrganization = async (id: string, updates: Partial<Organization>): Promise<Organization | null> => {
  try {
    // Fix: Explicitly type and filter plan_type BEFORE assign
    const { plan_type: unsafePlanType, ...rest } = updates;
    let safeUpdates: Partial<Omit<Organization, 'plan_type'>> & { plan_type?: 'starter' | 'pro' | 'enterprise' } = { ...rest };

    if (unsafePlanType !== undefined) {
      if (unsafePlanType === 'starter' || unsafePlanType === 'pro' || unsafePlanType === 'enterprise') {
        safeUpdates.plan_type = unsafePlanType;
      } else {
        safeUpdates.plan_type = 'starter';
      }
    }

    const { data, error } = await supabase
      .from('organizations')
      .update(safeUpdates)
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
