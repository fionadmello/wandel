export interface JobOption {
  name: string;
  description: string;
}

export interface VariationConfig {
  name: string;
  anchor: string;
  nonNegotiable: string;
  minimumVersion: string;
  fullVersion: string;
}

export interface SetupDraft {
  whyStatement: string;
  qualities: string[];
  reminders: string[];
}
