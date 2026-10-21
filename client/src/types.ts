export type Urgency = "low" | "medium" | "high" | "unknown";

export interface TriageResult {
    urgency?: Urgency;
    category?: string;
}