
import { useOrganization } from "@/context/OrganizationContext";

// Expanded PLAN_FEATURE_MATRIX
const PLAN_FEATURE_MATRIX = {
  starter: {
    maxResponses: 1000,
    questionTypes: ["star", "nps"],
    customBranding: false,
    multiUser: false,
    analytics: false,
    export: false,
    modules: {
      analytics: true,
      questions: true,
      settings: true,
      customerInsights: false,
      sentiment: false,
      performance: false,
      members: false,
      feedback: false,
    }
  },
  pro: {
    maxResponses: 10000,
    questionTypes: ["star", "nps", "likert", "single-choice", "multi-choice", "text"],
    customBranding: true,
    multiUser: true,
    analytics: true,
    export: true,
    modules: {
      analytics: true,
      questions: true,
      settings: true,
      customerInsights: true,
      sentiment: true,
      performance: false,
      members: true,
      feedback: true,
    }
  },
  enterprise: {
    maxResponses: null,
    questionTypes: ["star", "nps", "likert", "single-choice", "multi-choice", "text"],
    customBranding: true,
    multiUser: true,
    analytics: true,
    export: true,
    modules: {
      analytics: true,
      questions: true,
      settings: true,
      customerInsights: true,
      sentiment: true,
      performance: true,
      members: true,
      feedback: true,
    }
  }
};

export const useFeatureGate = () => {
  const { organization } = useOrganization();

  // Defensive logging
  if (typeof window !== "undefined") {
    console.groupCollapsed(
      "%c[useFeatureGate] ORG DEBUG",
      "background: #222; color: #bada55"
    );
    console.log("organization:", organization);
    console.log("organization.plan_type:", organization?.plan_type);
    console.log("organization.features_config:", organization?.features_config);
  }

  let plan: "starter" | "pro" | "enterprise" = "starter";
  if (
    organization &&
    (organization.plan_type === "starter" ||
      organization.plan_type === "pro" ||
      organization.plan_type === "enterprise")
  ) {
    plan = organization.plan_type;
  } else if (organization && organization.plan_type) {
    console.warn("[useFeatureGate] Unknown plan_type: ", organization.plan_type, "Falling back to 'starter'");
  }

  if (typeof window !== "undefined") {
    console.log("Resolved plan:", plan);
    console.log("PLAN_FEATURE_MATRIX (plan):", PLAN_FEATURE_MATRIX[plan]);
    console.groupEnd();
  }

  function hasFeature(feature: keyof typeof PLAN_FEATURE_MATRIX["starter"]) {
    if (!organization) {
      if (typeof window !== "undefined") console.warn("hasFeature called but organization is null");
      return false;
    }
    if (organization.features_config && organization.features_config[feature] !== undefined) {
      return organization.features_config[feature];
    }
    return PLAN_FEATURE_MATRIX[plan][feature];
  }

  function allowedQuestionTypes(): string[] {
    if (!organization) return PLAN_FEATURE_MATRIX.starter.questionTypes;
    if (organization.features_config && organization.features_config["questionTypes"]) {
      return organization.features_config["questionTypes"];
    }
    return PLAN_FEATURE_MATRIX[plan].questionTypes;
  }

  function responseLimit(): number | null {
    if (!organization) return PLAN_FEATURE_MATRIX.starter.maxResponses;
    if (organization.features_config && organization.features_config["maxResponses"] !== undefined) {
      return organization.features_config["maxResponses"];
    }
    return PLAN_FEATURE_MATRIX[plan].maxResponses;
  }

  function hasModuleAccess(module: keyof typeof PLAN_FEATURE_MATRIX["starter"]["modules"]): boolean {
    if (typeof window !== "undefined") {
      console.log("[hasModuleAccess] ---", {
        plan,
        module,
        moduleKeys: Object.keys(PLAN_FEATURE_MATRIX[plan].modules),
        planModules: PLAN_FEATURE_MATRIX[plan].modules,
        features_config: organization?.features_config,
        orgPlanType: organization?.plan_type
      });
    }
    if (!organization) {
      if (typeof window !== "undefined") console.warn("hasModuleAccess fallback to starter for module:", module);
      return PLAN_FEATURE_MATRIX.starter.modules[module];
    }
    if (
      organization.features_config &&
      typeof organization.features_config === "object" &&
      organization.features_config["modules"] &&
      typeof organization.features_config["modules"] === "object" &&
      typeof organization.features_config["modules"][module] === "boolean"
    ) {
      if (typeof window !== "undefined")
        console.log("[hasModuleAccess] Override hit for", module, ":", organization.features_config["modules"][module]);
      return organization.features_config["modules"][module];
    }

    if (typeof window !== "undefined")
      console.log("[hasModuleAccess] PLAN fallback for", module, ":", PLAN_FEATURE_MATRIX[plan].modules[module]);
    return PLAN_FEATURE_MATRIX[plan].modules[module];
  }

  return {
    hasFeature,
    allowedQuestionTypes,
    responseLimit,
    plan,
    hasModuleAccess,
  };
};
