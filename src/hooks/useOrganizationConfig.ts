
import { useState, useEffect } from 'react';
import { useOrganizationContext } from '@/context/OrganizationContext';
import { getOrganizationAssets, getOrganizationTheme, OrganizationAsset, OrganizationTheme } from '@/services/organizationService';

export interface OrganizationConfig {
  assets: OrganizationAsset[];
  theme: OrganizationTheme | null;
  logoAsset: OrganizationAsset | null;
}

export const useOrganizationConfig = () => {
  const { organization } = useOrganizationContext();
  const [config, setConfig] = useState<OrganizationConfig>({
    assets: [],
    theme: null,
    logoAsset: null
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadConfig = async () => {
      if (!organization) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        const [assets, theme] = await Promise.all([
          getOrganizationAssets(organization.id),
          getOrganizationTheme(organization.id)
        ]);

        const logoAsset = assets.find(asset => asset.asset_type === 'logo') || null;

        setConfig({
          assets,
          theme,
          logoAsset
        });
      } catch (error) {
        console.error('Error loading organization config:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, [organization]);

  return {
    ...config,
    isLoading,
    organization,
    // Helper getters for common values
    colors: config.theme?.colors || {
      primary: organization?.primary_color || '#007ACE',
      secondary: organization?.secondary_color || '#073763'
    },
    flowConfig: organization?.flow_configuration || {},
    headerTitle: organization?.feedback_header_title || 'Customer Feedback',
    headerSubtitle: organization?.feedback_header_subtitle || 'We value your feedback',
    welcomeTitle: organization?.welcome_screen_title || 'Welcome',
    welcomeDescription: organization?.welcome_screen_description || 'Please share your feedback with us',
    thankYouTitle: organization?.thank_you_title || 'Thank You!',
    thankYouMessage: organization?.thank_you_message || 'Your feedback has been submitted successfully'
  };
};
