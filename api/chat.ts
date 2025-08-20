import { ChatRequest, ChatResponse, ModelResponse, OpenRouterRequest, OpenRouterResponse } from '../src/types';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

interface OpenRouterError {
  error: {
    message: string;
    type: string;
    code: string;
  };
}

interface VercelRequest {
  method: string;
  body: any;
  query: Record<string, string | string[]>;
  headers: Record<string, string>;
}

interface VercelResponse {
  status: (code: number) => VercelResponse;
  json: (data: any) => void;
  send: (data: any) => void;
  end: () => void;
  setHeader: (name: string, value: string) => void;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, models, maxTokens = 1000, temperature = 0.7 }: ChatRequest = req.body;

    if (!message || !models || models.length === 0) {
      return res.status(400).json({ 
        error: 'Message and models are required' 
      });
    }

    if (!OPENROUTER_API_KEY) {
      return res.status(500).json({ 
        error: 'OpenRouter API key not configured' 
      });
    }

    // Create concurrent requests to all selected models
    const modelPromises = models.map(async (modelId): Promise<ModelResponse> => {
      const openRouterRequest: OpenRouterRequest = {
        model: modelId,
        messages: [
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: maxTokens,
        temperature: temperature,
        stream: false
      };

      try {
        const response = await fetch(OPENROUTER_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'HTTP-Referer': process.env.VERCEL_URL || 'http://localhost:3000',
            'X-Title': 'Multi-Model Chat App'
          },
          body: JSON.stringify(openRouterRequest),
          signal: AbortSignal.timeout(30000) // 30 second timeout
        });

        if (!response.ok) {
          const errorData: OpenRouterError = await response.json();
          throw new Error(errorData.error?.message || `HTTP ${response.status}`);
        }

        const data: OpenRouterResponse = await response.json();
        
        return {
          model: modelId,
          content: data.choices[0]?.message?.content || 'No response content',
          usage: data.usage
        };
      } catch (error) {
        console.error(`Error querying model ${modelId}:`, error);
        return {
          model: modelId,
          content: '',
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
      }
    });

    // Wait for all model responses
    const responses = await Promise.allSettled(modelPromises);
    
    // Process results
    const modelResponses: ModelResponse[] = responses.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          model: models[index],
          content: '',
          error: result.reason?.message || 'Request failed'
        };
      }
    });

    const chatResponse: ChatResponse = {
      responses: modelResponses,
      timestamp: new Date()
    };

    res.status(200).json(chatResponse);
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}


