
// Utility to call the Supabase Edge Function for organization creation
import { supabase } from "@/integrations/supabase/client";

interface CreateOrgInput {
  email: string;
  orgName: string;
  userId: string;
}

export async function createOrganization({ email, orgName, userId }: CreateOrgInput) {
  try {
    // Use Supabase client's .functions.invoke to call the edge function
    const { data, error } = await supabase.functions.invoke("create-organization", {
      body: { email, orgName, userId },
    });

    if (error) {
      throw new Error(error.message || "Edge function invocation failed");
    }
    if (!data?.success || !data.organization) {
      throw new Error(data?.error || "Unknown edge function error");
    }

    return data.organization;
  } catch (err: any) {
    throw new Error(err.message || "Organization creation failed");
  }
}
