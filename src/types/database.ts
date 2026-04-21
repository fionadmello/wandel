export interface Database {
  public: {
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
    Tables: {
      profiles: {
        Row: {
          id: string;
          why_statement: string | null;
          reminder_index: number;
          reminder_last_rotated: string | null;
          setup_complete: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          why_statement?: string | null;
          reminder_index?: number;
          reminder_last_rotated?: string | null;
          setup_complete?: boolean;
        };
        Update: {
          why_statement?: string | null;
          reminder_index?: number;
          reminder_last_rotated?: string | null;
          setup_complete?: boolean;
        };
        Relationships: [];
      };
      profile_qualities: {
        Row: {
          id: string;
          user_id: string;
          value: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          value: string;
          sort_order?: number;
        };
        Update: {
          value?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      profile_reminders: {
        Row: {
          id: string;
          user_id: string;
          value: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          value: string;
          sort_order?: number;
        };
        Update: {
          value?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      habits: {
        Row: {
          id: string;
          user_id: string;
          category: "break" | "build";
          name: string;
          is_active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category: "break" | "build";
          name: string;
          is_active?: boolean;
          sort_order?: number;
        };
        Update: {
          name?: string;
          is_active?: boolean;
          sort_order?: number;
        };
        Relationships: [];
      };
      habit_configs: {
        Row: {
          id: string;
          habit_id: string;
          key: string;
          value: string;
          sub_type: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          habit_id: string;
          key: string;
          value: string;
          sub_type?: string | null;
          sort_order?: number;
        };
        Update: {
          key?: string;
          value?: string;
          sub_type?: string | null;
          sort_order?: number;
        };
        Relationships: [];
      };
      engine_marks: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          timer_completed: boolean;
          confirmed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          timer_completed?: boolean;
          confirmed_at: string;
        };
        Update: {
          timer_completed?: boolean;
          confirmed_at?: string;
        };
        Relationships: [];
      };
      break_observations: {
        Row: {
          id: string;
          habit_id: string;
          user_id: string;
          context: string | null;
          urge_intensity: number | null;
          aftermath: string | null;
          logged_at: string;
        };
        Insert: {
          id?: string;
          habit_id: string;
          user_id: string;
          context?: string | null;
          urge_intensity?: number | null;
          aftermath?: string | null;
          logged_at?: string;
        };
        Update: {
          context?: string | null;
          urge_intensity?: number | null;
          aftermath?: string | null;
        };
        Relationships: [];
      };
      break_observation_emotions: {
        Row: {
          id: string;
          observation_id: string;
          value: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          observation_id: string;
          value: string;
        };
        Update: {
          value?: string;
        };
        Relationships: [];
      };
      build_observations: {
        Row: {
          id: string;
          habit_id: string;
          user_id: string;
          date: string;
          sub_type: string | null;
          mark_type: "circle" | "dot" | "half";
          mark_label: string;
          note: string | null;
          logged_at: string;
        };
        Insert: {
          id?: string;
          habit_id: string;
          user_id: string;
          date: string;
          sub_type?: string | null;
          mark_type: "circle" | "dot" | "half";
          mark_label: string;
          note?: string | null;
          logged_at?: string;
        };
        Update: {
          sub_type?: string | null;
          mark_type?: "circle" | "dot" | "half";
          mark_label?: string;
          note?: string | null;
        };
        Relationships: [];
      };
    };
  };
}

// Convenience row types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
export type ProfileQuality =
  Database["public"]["Tables"]["profile_qualities"]["Row"];
export type ProfileReminder =
  Database["public"]["Tables"]["profile_reminders"]["Row"];
export type Habit = Database["public"]["Tables"]["habits"]["Row"];
export type HabitConfig = Database["public"]["Tables"]["habit_configs"]["Row"];
export type EngineMark = Database["public"]["Tables"]["engine_marks"]["Row"];
export type BreakObservation =
  Database["public"]["Tables"]["break_observations"]["Row"];
export type BreakObservationEmotion =
  Database["public"]["Tables"]["break_observation_emotions"]["Row"];
export type BuildObservation =
  Database["public"]["Tables"]["build_observations"]["Row"];

// App-level types
export type HabitCategory = "break" | "build";

export type MarkType = "circle" | "dot" | "half";

export interface HabitWithConfigs extends Habit {
  configs: HabitConfig[];
}

export interface BreakObservationWithEmotions extends BreakObservation {
  emotions: BreakObservationEmotion[];
}
