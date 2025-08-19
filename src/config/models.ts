import { ModelConfig, LocalModelConfig } from '../types';

export const AVAILABLE_MODELS: ModelConfig[] = [
  {
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4.1 Mini',
    provider: 'OpenAI',
    description: 'GPT-4o mini is OpenAI\'s newest model after GPT-4 Omni, supporting both text and image inputs with text outputs.',
    maxTokens: 128000,
    costPer1kTokens: 0.0006,
    type: 'remote'
  },
  {
    id: 'anthropic/claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'Anthropic',
    description: 'Claude 3 Haiku is Anthropic\'s fastest and most compact model for near-instant responsiveness. Quick and accurate targeted performance.',
    maxTokens: 200000,
    costPer1kTokens: 0.00125,
    type: 'remote'
  },
  {
    id: 'mistralai/codestral-2508',
    name: 'Mistral Codestral 2508',
    provider: 'Mistral AI',
    description: 'Mistral\'s cutting-edge language model for coding released end of July 2025. Codestral specializes in low-latency, high-frequency tasks such as fill-in-the-middle (FIM), code correction and test generation.',
    maxTokens: 256000,
    costPer1kTokens: 0.0009,
    type: 'remote'
  },
  {
    id: 'meta-llama/llama-3.1-405b-instruct',
    name: 'LLaMA 2 70B',
    provider: 'Meta',
    description: 'The highly anticipated 400B class of Llama3 is here! Clocking in at 128k context with impressive eval scores, the Meta AI team continues to push the frontier of open-source LLMs.',
    maxTokens: 32768,
    costPer1kTokens: 0.0008,
    type: 'remote'
  },
  {
    id: 'google/gemini-2.0-flash-001',
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    description: 'Gemini Flash 2.0 offers a significantly faster time to first token (TTFT) compared to Gemini Flash 1.5, while maintaining quality on par with larger models like Gemini Pro 1.5',
    maxTokens: 1048576,
    costPer1kTokens: 0.0004,
    type: 'remote'
  }
];

export const DEFAULT_LOCAL_MODELS: LocalModelConfig[] = [
  {
    id: 'local-ollama-llama2',
    name: 'Local LLaMA 2',
    description: 'LLaMA 2 model running locally via Ollama',
    endpoint: 'http://localhost:11434/api/generate',
    maxTokens: 4096,
    temperature: 0.7,
    isEnabled: false,
    modelType: 'ollama'
  },
  {
    id: 'local-ollama-mistral',
    name: 'Local Mistral',
    description: 'Mistral model running locally via Ollama',
    endpoint: 'http://localhost:11434/api/generate',
    maxTokens: 4096,
    temperature: 0.7,
    isEnabled: false,
    modelType: 'ollama'
  },
  {
    id: 'local-openai-compatible',
    name: 'Local OpenAI Compatible',
    description: 'Any OpenAI-compatible API endpoint',
    endpoint: 'http://localhost:8000/v1/chat/completions',
    maxTokens: 4096,
    temperature: 0.7,
    isEnabled: false,
    modelType: 'openai-compatible'
  }
];

export const getModelById = (id: string): ModelConfig | undefined => {
  return AVAILABLE_MODELS.find(model => model.id === id);
};

export const getLocalModelById = (id: string): LocalModelConfig | undefined => {
  return DEFAULT_LOCAL_MODELS.find(model => model.id === id);
};

export const getDefaultModels = (count: number = 3): ModelConfig[] => {
  return AVAILABLE_MODELS.slice(0, Math.min(count, AVAILABLE_MODELS.length));
};

export const getAllModels = (): (ModelConfig | LocalModelConfig)[] => {
  return [...AVAILABLE_MODELS, ...DEFAULT_LOCAL_MODELS];
};

