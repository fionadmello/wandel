export interface ExerciseConfig {
  name: string;
  anchor: string;
  nonNegotiable: string;
  minimumVersion: string;
  fullVersion: string;
}

export interface SetupDraft {
  whyStatement: string;
  qualities: string[];
  jobs: string[];
  exerciseTypes: ExerciseConfig[];
}
