
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthWrapper";
import { createOrganization } from "@/utils/createOrganization";

export function useAuthFlow() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [orgLoading, setOrgLoading] = useState(false);
  const [error, setError] = useState("");

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: signInError } = await signIn(email, password);
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }
    toast({ title: "Welcome back!", description: "You have been signed in successfully." });

    setTimeout(async () => {
      try {
        const { data: { session }} = await supabase.auth.getSession();
        if (session?.user) {
          const { data: isAdmin } = await supabase.rpc("get_current_user_admin_status");
          if (isAdmin) {
            navigate("/admin");
            setLoading(false); return;
          }
          const { data: orgData } = await supabase
            .from("organization_users")
            .select("organization_id, role, organizations(slug)")
            .eq("user_id", session.user.id)
            .single();
          if (orgData?.organization_id) {
            const orgSlug = (orgData.organizations as any)?.slug;
            navigate(orgSlug ? `/admin/${orgSlug}` : "/");
          } else {
            navigate("/create-organization");
          }
        } else {
          navigate("/");
        }
      } catch (err) {
        console.error("Redirect error after sign-in:", err);
        navigate("/");
      }
      setLoading(false);
    }, 500);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: signUpError } = await signUp(email, password);
    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }
    toast({
      title: "Account created!",
      description: "Please check your email to verify your account. After verification, you'll be prompted to create your organization.",
    });
    setLoading(false);
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    orgLoading,
    error,
    setError,
    handleSignIn,
    handleSignUp,
  };
}
