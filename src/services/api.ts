import { ChatRequest, ChatResponse, ModelResponse, LocalModelConfig } from '../types';
import { SettingsService } from './settings';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export class ApiService {
  private static async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const isExternalUrl = endpoint.startsWith('http');
    const url = isExternalUrl ? endpoint : `${API_BASE_URL}${endpoint}`;

    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`HTTP error! status: ${response.status} on URL: ${url}, body: ${errorBody}`);
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorBody}`);
      }

      const text = await response.text();
      return text ? JSON.parse(text) : ({} as T);

    } catch (error) {
      console.error(`API request failed for URL: ${url}`, error);
      throw error;
    }
  }

  static async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    return this.makeRequest<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  static async queryModels(
    message: string,
    models: string[]
  ): Promise<ModelResponse[]> {
    // Use OpenRouter endpoint for remote models
    const openRouterEndpoint = "https://openrouter.ai/api/v1/chat/completions";
    const settings = SettingsService.getSettings();
    const apiKey = settings.openRouterApiKey;
    const timeout = settings.remoteModelTimeout || 30000;

    if (!apiKey) {
      console.error('OpenRouter API key is not set. Cannot query remote models.');
      // Return error responses for each model
      return models.map(model => ({
        model,
        content: '',
        error: 'OpenRouter API Key is missing in settings.'
      }));
    }

    const promises = models.map(async (model) => {
      try {
        // The 'data' is already the parsed JSON object from makeRequest
        const data = await ApiService.makeRequest<any>(openRouterEndpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: model,
            messages: [{ role: 'user', content: message }],
          }),
          signal: AbortSignal.timeout(timeout)
        });

        const content = data.choices?.[0]?.message?.content || 'No response content';

        return {
          model: model,
          content,
          usage: data.usage || {
            prompt_tokens: 0,
            completion_tokens: 0,
            total_tokens: 0
          }
        };
      } catch (error) {
        console.error(`Error querying model ${model} via OpenRouter:`, error);
        return {
          model: model,
          content: '',
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
      }
    });

    return Promise.all(promises);
  }

  // Fallback method for development/testing without serverless function
  static async mockQueryModels(
    message: string,
    models: string[]
  ): Promise<ModelResponse[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    return models.map(model => ({
      model,
      content: `This is a mock response from ${model} for: "${message}"\n\nThis would be the actual AI response in a real implementation. The model would process your question and provide a thoughtful answer based on its training data and capabilities.`,
      usage: {
        prompt_tokens: Math.floor(Math.random() * 100) + 50,
        completion_tokens: Math.floor(Math.random() * 200) + 100,
        total_tokens: Math.floor(Math.random() * 300) + 150,
      }
    }));
  }

  // Query local models
  static async queryLocalModels(
    message: string,
    localModels: LocalModelConfig[]
  ): Promise<ModelResponse[]> {
    const enabledModels = localModels.filter(model => model.isEnabled);

    if (enabledModels.length === 0) {
      console.log('No enabled local models found');
      return [];
    }

    console.log('Querying local models:', enabledModels.map(m => m.name));

    const promises = enabledModels.map(async (model) => {
      try {
        if (model.modelType === 'ollama') {

          let endpointToUse = model.endpoint;
          if (!endpointToUse.includes('/api/')) {
            endpointToUse = new URL('/api/chat', endpointToUse).href;
          }
          const isChatEndpoint = endpointToUse.includes('/api/chat');

          const response = await fetch(endpointToUse, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: model.name,
              ...(isChatEndpoint
                ? { messages: [{ role: 'user', content: message }] }
                : { prompt: message }
              ),
              stream: false,
              options: {
                temperature: model.temperature,
                num_predict: model.maxTokens
              }
            }),
            signal: AbortSignal.timeout(SettingsService.getSettings().localModelTimeout)
          });

          const data = await response.json();
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${data.error || 'Unknown Ollama error'}`);
          }

          const content = isChatEndpoint ? data.message?.content : data.response;

          return {
            model: model.id,
            content: content || 'No response content',
            usage: {
              prompt_tokens: data.prompt_eval_count || 0,
              completion_tokens: data.eval_count || 0,
              total_tokens: (data.prompt_eval_count || 0) + (data.eval_count || 0),
            }
          };

        } else {
          // OpenAI-compatible or custom
          const headers: Record<string, string> = { 'Content-Type': 'application/json' };
          if (model.apiKey) {
            headers['Authorization'] = `Bearer ${model.apiKey}`;
          }

          const response = await fetch(model.endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              model: model.name, // SERVER-FACING: Use name
              messages: [{ role: 'user', content: message }],
              max_tokens: model.maxTokens,
              temperature: model.temperature,
              stream: false
            }),
            signal: AbortSignal.timeout(SettingsService.getSettings().localModelTimeout)
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
          }

          const data = await response.json();
          console.log(`Response from ${model.name}:`, data);

          // Parse the OpenAI-compatible response structure
          const content = data.choices?.[0]?.message?.content || 'No response content';

          return {
            model: model.id,
            content,
            usage: data.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
          };
        }
      } catch (error) {
        console.error(`Error querying local model ${model.name}:`, error);
        return {
          model: model.id,
          content: '',
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
      }
    });

    return Promise.all(promises);
  }
}
