# Setting Up Ollama for HealthConnect AI

This guide will help you set up Ollama as the AI backend for your HealthConnect application.

## Installing Ollama

1. **Download Ollama**:
   - Visit [Ollama.ai](https://ollama.ai/download) and download the installer for your operating system
   - Available for Windows, macOS, and Linux

2. **Install Ollama**:
   - Run the installer and follow the prompts
   - After installation, Ollama will run as a local service on port 11434

## Pulling Models

After installing Ollama, you need to pull a language model to use with the application:

1. **Open a terminal/command prompt**

2. **Pull a model** (choose one of the following):
   ```
   ollama pull llama2        # Good general purpose model, 7B parameters
   ollama pull mistral       # Strong performance, 7B parameters
   ollama pull llama2:13b    # Larger, more capable model (needs more RAM)
   ollama pull neural-chat   # Optimized for dialogue
   ollama pull medllama2     # Specialized for medical content
   ```

3. **Verify the model is working**:
   ```
   ollama run llama2 "Hello, I'm a healthcare assistant"
   ```

## Configuration

1. Make sure your `.env` file has the following settings:
   ```
   AI_PROVIDER=ollama
   OLLAMA_URL=http://localhost:11434/api/generate
   ```

2. Update the model name in `controllers/AIController.js` if you pulled a different model

## System Requirements

- **Minimum**: 8GB RAM, modern CPU with 4+ cores
- **Recommended**: 16GB RAM, modern CPU with 6+ cores
- **For larger models**: 32GB RAM or more

## Troubleshooting

- **Ollama server not responding**: Make sure the Ollama service is running
- **Out of memory errors**: Try a smaller model or increase your system's RAM
- **Slow responses**: Larger models will be slower on less powerful hardware

## Further Information

- Full documentation: [Ollama Docs](https://github.com/ollama/ollama/blob/main/README.md)
- API Reference: [Ollama API](https://github.com/ollama/ollama/blob/main/docs/api.md)
