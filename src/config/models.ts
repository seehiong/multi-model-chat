import { ModelConfig, LocalModelConfig } from '../types';

export const AVAILABLE_MODELS: ModelConfig[] = [
  {
    id: 'x-ai/grok-4.3',
    name: 'Grok 4.3',
    provider: 'xAI',
    description: 'xAI\'s frontier reasoning model with a 1 million token context window, optimized for complex multi-step tasks, agentic workflows, and deep reasoning.',
    maxTokens: 1000000,
    costPer1kTokens: 0.00125,
    type: 'remote'
  },
  {
    id: 'openai/gpt-oss-120b',
    name: 'GPT-OSS 120B',
    provider: 'OpenAI',
    description: 'gpt-oss-120b is an open-weight, 117B-parameter Mixture-of-Experts (MoE) language model from OpenAI designed for high-reasoning, agentic, and general-purpose production use cases.',
    maxTokens: 131000,
    costPer1kTokens: 0.00028,
    type: 'remote'
  },
  {
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4.1 Mini',
    provider: 'OpenAI',
    description: 'OpenAI\'s fast, lightweight model designed for high-efficiency and cost-effective text and image processing.',
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
    description: 'Mistral\'s high-performance code generation model, specializing in low-latency, fill-in-the-middle (FIM), code correction, and test generation.',
    maxTokens: 256000,
    costPer1kTokens: 0.0009,
    type: 'remote'
  },
  {
    id: 'meta-llama/llama-3.3-70b-instruct',
    name: 'LLaMA 3.3 70B',
    provider: 'Meta',
    description: 'Meta\'s state-of-the-art Llama 3.3 70B Instruct model, featuring high-quality reasoning, instruction following, coding, and multilingual support with a 128k context window.',
    maxTokens: 128000,
    costPer1kTokens: 0.0003,
    type: 'remote'
  },
  {
    id: 'google/gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'Google',
    description: 'Google\'s Gemini 2.5 Flash model, a fast and lightweight model optimized for high-frequency reasoning, coding, math, and multimodal tasks with a 1 million token context window.',
    maxTokens: 1048576,
    costPer1kTokens: 0.0003,
    type: 'remote'
  },
  {
    id: 'nvidia/nemotron-3-ultra-550b-a55b:free',
    name: 'Nemotron 3 Ultra (Free)',
    provider: 'Nvidia',
    description: 'NVIDIA\'s frontier reasoning and orchestration model featuring a hybrid Transformer-Mamba MoE architecture, built for multi-step reasoning, coding, and complex workflows.',
    maxTokens: 1000000,
    costPer1kTokens: 0.0,
    type: 'remote'
  },
  {
    id: 'google/gemma-4-31b-it:free',
    name: 'Gemma 4 31B (Free)',
    provider: 'Google',
    description: 'Google DeepMind\'s dense multimodal model with 30.7B parameters, featuring configurable reasoning/thinking, native function calling, and multilingual support.',
    maxTokens: 262144,
    costPer1kTokens: 0.0,
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

