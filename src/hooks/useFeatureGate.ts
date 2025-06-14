
import { useOrganization } from "@/context/OrganizationContext";

// Map features to availability per plan
const PLAN_FEATURE_MATRIX = {
  starter: {
    maxResponses: 1000,
    questionTypes: ["star", "nps"],
    customBranding: false,
    multiUser: false,
    analytics: false,
    export: false,
  },
  pro: {
    maxResponses: 10000,
    questionTypes: ["star", "nps", "likert", "single-choice", "multi-choice", "text"],
    customBranding: true,
    multiUser: true,
    analytics: true,
    export: true,
  },
  enterprise: {
    maxResponses: null, // unlimited
    questionTypes: ["star", "nps", "likert", "single-choice", "multi-choice", "text"],
    customBranding: true,
    multiUser: true,
    analytics: true,
    export: true,
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

  return {
    hasFeature,
    allowedQuestionTypes,
    responseLimit,
    plan,
  };
};
