export interface PromptTransformation {
  weak_prompt: string;
  intent: string;
  category: string;
  missing_information: string[];
  context_questions: string[];
  assumptions: string[];
  role: string;
  goal: string;
  audience: string;
  requirements: string[];
  constraints: string[];
  output_format: string;
  success_criteria: string[];
  improved_prompt: string;
}

export interface TransformPromptRequest {
  prompt: string;
}

export interface ValidationErrorItem {
  loc?: Array<string | number>;
  msg?: string;
  type?: string;
}

export interface ApiErrorResponse {
  detail?: string | ValidationErrorItem[];
}