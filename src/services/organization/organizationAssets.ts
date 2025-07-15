
import { supabase } from '@/integrations/supabase/client';
import type { OrganizationAsset } from './organizationTypes';

export const getOrganizationAssets = async (organizationId: string): Promise<OrganizationAsset[]> => {
  try {
    const { data, error } = await supabase
      .from('organization_assets')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .order('display_order', { ascending: true });

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

export const createOrganizationAsset = async (asset: Omit<OrganizationAsset, 'id' | 'created_at' | 'updated_at'>): Promise<OrganizationAsset | null> => {
  try {
    const { data, error } = await supabase
      .from('organization_assets')
      .insert(asset)
      .select()
      .single();

    if (error) {
      console.error('Error creating organization asset:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error creating organization asset:', error);
    return null;
  }
};

export const updateOrganizationAsset = async (id: string, updates: Partial<OrganizationAsset>): Promise<OrganizationAsset | null> => {
  try {
    const { data, error } = await supabase
      .from('organization_assets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating organization asset:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error updating organization asset:', error);
    return null;
  }
};

export const deleteOrganizationAsset = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('organization_assets')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      console.error('Error deleting organization asset:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting organization asset:', error);
    return false;
  }
};
