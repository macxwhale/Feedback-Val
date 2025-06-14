
import React from "react";
import { OrganizationSettingsTab } from '../../OrganizationSettingsTab';

interface SettingsTabProps {
  organization: any;
}
export const SettingsTab: React.FC<SettingsTabProps> = ({ organization }) =>
  <OrganizationSettingsTab organization={organization} />;
