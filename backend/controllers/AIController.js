const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Add new options for AI providers
const AI_PROVIDER = process.env.AI_PROVIDER || 'fallback'; // Options: 'openai', 'huggingface', 'ollama', 'fallback'

const generateAIResponse = async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, message: 'Invalid messages format' });
    }
    
    // Get the last user message for simpler API integrations
    const userMessage = messages.find(m => m.role === 'user')?.content || '';
    
    // Choose which AI service to use based on environment variable
    switch(AI_PROVIDER) {
      case 'openai':
        return await handleOpenAI(req, res, messages);
      case 'huggingface':
        return await handleHuggingFace(req, res, userMessage);
      case 'ollama':
        return await handleOllama(req, res, userMessage);
      default:
        return fallbackResponse(req, res);
    }
  } catch (error) {
    console.error('AI service error:', error.response?.data || error.message);
    return fallbackResponse(req, res);
  }
};

// Original OpenAI handler
const handleOpenAI = async (req, res, messages) => {
  // Check if OpenAI API key is configured
  if (!OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not configured in environment variables');
    return fallbackResponse(req, res);
  }
  
  // Add healthcare context to the system message if not present
  if (!messages.some(m => m.role === 'system')) {
    messages.unshift({
      role: 'system',
      content: 'You are a helpful healthcare assistant that provides information about health concerns and recommends appropriate healthcare professionals.'
    });
  }
  
  const response = await axios.post(
    OPENAI_API_URL,
    {
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 300,
      temperature: 0.7
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      }
    }
  );
  
  const message = response.data.choices[0].message.content;
  
  return res.status(200).json({
    success: true,
    message
  });
};

// Hugging Face Inference API integration
const handleHuggingFace = async (req, res, userMessage) => {
  const HF_API_KEY = process.env.HUGGINGFACE_API_KEY; // Free tier available
  
  if (!HF_API_KEY) {
    console.error('HUGGINGFACE_API_KEY is not configured');
    return fallbackResponse(req, res);
  }
  
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/google/flan-t5-xxl', // Free model suitable for Q&A
      { inputs: `Answer this health-related question: ${userMessage}` },
      {
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return res.status(200).json({
      success: true,
      message: response.data[0].generated_text,
      provider: 'huggingface'
    });
  } catch (error) {
    console.error('Hugging Face API error:', error);
    return fallbackResponse(req, res);
  }
};

// Enhanced Ollama handler for better performance
const handleOllama = async (req, res, userMessage) => {
  try {
    // Get Ollama URL from environment variables with fallback
    const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434/api/generate';
    
    // Get latest user message
    const userContent = req.body.messages.find(m => m.role === 'user')?.content || userMessage;
    
    // Construct a more comprehensive prompt with context
    const healthContext = 'You are a healthcare assistant helping patients find the right professionals for their needs. ' +
                         'Provide helpful, accurate information about health conditions. ' + 
                         'If you detect mental health issues, suggest a Therapist. ' +
                         'If you detect physical injuries or medical care needs, suggest a Home Nurse.';
                         
    console.log('Sending request to Ollama:', OLLAMA_URL);
    
    const response = await axios.post(OLLAMA_URL, {
      model: "llama2", // You can also try "mistral" or other models you have pulled
      prompt: `${healthContext} 
      
      User question: ${userContent}
      
      Please provide a helpful response:`,
      stream: false,
      options: {
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 500
      }
    });
    
    if (response.data && response.data.response) {
      return res.status(200).json({
        success: true,
        message: response.data.response,
        provider: 'ollama'
      });
    } else {
      console.warn('Unexpected Ollama response structure:', response.data);
      return fallbackResponse(req, res);
    }
  } catch (error) {
    console.error('Ollama error:', error.message);
    if (error.response) {
      console.error('Ollama API response:', error.response.data);
    }
    return fallbackResponse(req, res);
  }
};

// Enhanced fallback response with more healthcare patterns
const fallbackResponse = (req, res) => {
  const userMessage = req.body.messages.find(m => m.role === 'user')?.content || '';
  const lowercaseMsg = userMessage.toLowerCase();
  
  // Create pattern matching for common health concerns
  let responseMessage = "I'm here to help with your health concerns. Could you tell me more about your symptoms or what kind of healthcare professional you're looking for?";
  
  if (lowercaseMsg.includes('depress') || lowercaseMsg.includes('anxiety') || 
      lowercaseMsg.includes('stress') || lowercaseMsg.includes('sad') || 
      lowercaseMsg.includes('worried') || lowercaseMsg.includes('therapy')) {
    responseMessage = "It sounds like you might be experiencing symptoms related to mental health. Speaking with a therapist or psychologist could be helpful. Would you like me to suggest some mental health professionals?";
  } 
  else if (lowercaseMsg.includes('wound') || lowercaseMsg.includes('injury') ||
          lowercaseMsg.includes('pain') || lowercaseMsg.includes('hurt') || 
          lowercaseMsg.includes('bandage') || lowercaseMsg.includes('nurse')) {
    responseMessage = "For physical injuries, wound care, or general medical assistance, a home nurse or healthcare provider would be appropriate. Would you like me to help you find one?";
  }
  else if (lowercaseMsg.includes('headache') || lowercaseMsg.includes('migraine')) {
    responseMessage = "Headaches can have many causes. For recurring or severe headaches, consulting with a neurologist may be helpful. Would you like more information about managing headaches?";
  }
  else if (lowercaseMsg.includes('sleep') || lowercaseMsg.includes('insomnia')) {
    responseMessage = "Sleep issues can significantly impact your health. A sleep specialist or therapist specializing in sleep disorders could help. Would you like me to suggest some professionals?";
  }
  
  return res.status(200).json({
    success: true,
    message: responseMessage,
    isFromFallback: true
  });
};

module.exports = { generateAIResponse };
