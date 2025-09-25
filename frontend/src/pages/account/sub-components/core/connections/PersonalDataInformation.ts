type InformationKey = "NONE" | "USAGE_ONLY" | "FULL";

const personalDataInformations: Record<
  InformationKey,
  { title: string; description: string }
> = {
  "NONE": {
    title: "No Access",
    description:
      "This service has no access to your data and cannot be used with your account.",
  },
  "USAGE_ONLY": {
    title: "Basic Access",
    description:
      "This service can only access essential authentication data needed to verify your identity and maintain your session.",
  },
  "FULL": {
    title: "Full Access",
    description:
      "This service has access to all data you've authorized it to use.",
  },
};

export type { InformationKey };
export default personalDataInformations;