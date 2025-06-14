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
  const plan = organization?.plan_type || "starter"; // fallback to starter

  // This allows forced override via features_config if present
  function hasFeature(feature: keyof typeof PLAN_FEATURE_MATRIX["starter"]) {
    if (!organization) return false;

    // Check override in features_config
    if (organization.features_config && organization.features_config[feature] !== undefined) {
      return organization.features_config[feature];
    }

    return PLAN_FEATURE_MATRIX[plan][feature];
  }

  function allowedQuestionTypes(): string[] {
    if (!organization) return PLAN_FEATURE_MATRIX.starter.questionTypes;
    // Check override in features_config
    if (organization.features_config && organization.features_config["questionTypes"]) {
      return organization.features_config["questionTypes"];
    }
    return PLAN_FEATURE_MATRIX[plan].questionTypes;
  }

  function responseLimit(): number | null {
    if (!organization) return PLAN_FEATURE_MATRIX.starter.maxResponses;
    // Check override for usage
    if (organization.features_config && organization.features_config["maxResponses"] !== undefined) {
      return organization.features_config["maxResponses"];
    }
    return PLAN_FEATURE_MATRIX[plan].maxResponses;
  }

  function hasModuleAccess(module: keyof typeof PLAN_FEATURE_MATRIX["starter"]["modules"]): boolean {
    if (!organization) return PLAN_FEATURE_MATRIX.starter.modules[module];
    if (
      organization.features_config &&
      organization.features_config["modules"] &&
      typeof organization.features_config["modules"][module] === "boolean"
    ) {
      return organization.features_config["modules"][module];
    }
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
