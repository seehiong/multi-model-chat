# Local Models Setup Guide

This guide will help you set up local LLMs to work with the Multi-Model Chat application.

## Supported Local Model Types

### 1. Ollama Models

[Ollama](https://ollama.ai/) is the easiest way to run local LLMs.

#### Setup:
1. Install Ollama from https://ollama.ai/
2. Pull a model: `ollama pull llama2`
3. Start Ollama: `ollama serve`
4. In the app settings, add a local model:
   - **Name**: Local LLaMA 2
   - **Model Type**: Ollama
   - **Endpoint**: `http://localhost:11434/api/generate`
   - **Enable**: Check the box

#### Popular Ollama Models:
- `llama2` - Meta's LLaMA 2
- `mistral` - Mistral AI's model
- `codellama` - Code-focused LLaMA
- `llama2:7b` - Smaller, faster version
- `llama2:13b` - Larger, more capable version

### 2. OpenAI-Compatible APIs

Any API that follows OpenAI's chat completions format.

#### Examples:
- **LM Studio**: `http://localhost:1234/v1/chat/completions`
- **Ollama with OpenAI compatibility**: `http://localhost:11434/v1/chat/completions`
- **LocalAI**: `http://localhost:8080/v1/chat/completions`

#### Setup:
1. In the app settings, add a local model:
   - **Name**: Your Model Name
   - **Model Type**: OpenAI Compatible
   - **Endpoint**: Your API endpoint
   - **API Key**: (if required)
   - **Enable**: Check the box

### 3. Custom APIs

For any other API format, you can use the "Custom" type and modify the code as needed.

## Testing Your Setup

1. Go to **Settings** → **Local Models** tab
2. Use the **Local Model Test** component to test your connections
3. Enter a test message and click "Test Local Models"
4. Check the results for success/error messages

## Troubleshooting

### Common Issues:

1. **Connection Refused**: Make sure your local model server is running
2. **CORS Errors**: Some local servers don't support CORS - you may need to use a proxy
3. **Model Not Found**: Check that the model name matches exactly what your server expects
4. **Timeout**: Increase the timeout in the code if your models are slow

### Debug Tips:

1. Check the browser console for detailed error messages
2. Use the test component to isolate issues
3. Verify your endpoint URL is correct
4. Test your API directly with curl or Postman

## Example curl Commands

### Ollama:
```bash
curl -X POST http://localhost:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama2",
    "prompt": "Hello, how are you?",
    "stream": false
  }'
```

### OpenAI Compatible:
```bash
curl -X POST http://localhost:1234/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "local-model",
    "messages": [{"role": "user", "content": "Hello, how are you?"}],
    "max_tokens": 1000,
    "temperature": 0.7
  }'
```

## Performance Tips

1. **Use smaller models** for faster responses
2. **Enable GPU acceleration** if available
3. **Adjust temperature and max_tokens** for your use case
4. **Consider model quantization** for better performance

## Security Notes

- Local models run on your machine - no data leaves your system
- API keys for local models are stored in browser localStorage
- Consider using environment variables for production deployments
