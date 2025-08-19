export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  model?: string;
  timestamp: Date;
  isLoading?: boolean;
  error?: string;
}

export interface ModelConfig {
  id: string;
  name: string;
  provider: string;
  description: string;
  maxTokens: number;
  costPer1kTokens: number;
  type: 'remote' | 'local';
  endpoint?: string;
  apiKey?: string;
  isEnabled?: boolean;
}

export interface LocalModelConfig {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  apiKey?: string;
  maxTokens: number;
  temperature: number;
  isEnabled: boolean;
  modelType: 'ollama' | 'openai-compatible' | 'custom';
}

export interface AppSettings {
  openRouterApiKey: string;
  localModels: LocalModelConfig[];
  defaultModels: string[];
  maxTokens: number;
  temperature: number;
  theme: 'light' | 'dark' | 'auto';
  autoSave: boolean;
  localModelTimeout: number;
  remoteModelTimeout: number;
}

export interface ModelResponse {
  model: string;
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  error?: string;
}

export interface ChatRequest {
  message: string;
  models: string[];
  maxTokens?: number;
  temperature?: number;
}

export interface ChatResponse {
  responses: ModelResponse[];
  timestamp: Date;
}

export interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  max_tokens?: number;
  temperature?: number;
  stream?: boolean;
}

export interface OpenRouterResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

