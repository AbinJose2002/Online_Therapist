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
    
    const userMessage = messages.find(m => m.role === 'user')?.content || '';
    if (!userMessage.trim()) {
      return res.status(400).json({ success: false, message: 'Empty user message' });
    }
    
    // Choose which AI service to use
    const AI_PROVIDER = process.env.AI_PROVIDER || 'fallback';
    console.log(`Using AI provider: ${AI_PROVIDER}`);
    
    switch(AI_PROVIDER.toLowerCase()) {
      case 'openai': return await handleOpenAI(req, res, messages);
      case 'huggingface': return await handleHuggingFace(req, res, userMessage);
      case 'ollama': return await handleOllama(req, res);
      default: return fallbackResponse(req, res);
    }
  } catch (error) {
    console.error('AI service error:', error.message);
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
const handleOllama = async (req, res) => {
  try {
    // Get Ollama URL from environment variables with fallback
    const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434/api/generate';
    
    // Get latest user message
    const userContent = req.body.messages.find(m => m.role === 'user')?.content || '';
    
    // Check if Ollama is available by making a simple request
    try {
      await axios.get(OLLAMA_URL.replace('/api/generate', '/api/version'), { timeout: 2000 });
    } catch (error) {
      console.error('Ollama service unavailable:', error.message);
      return fallbackResponse(req, res);
    }
    
    // Get available models (with fallback)
    let modelToUse = 'llama2'; // Default model
    try {
      const modelsResponse = await axios.get(OLLAMA_URL.replace('/api/generate', '/api/tags'), { timeout: 2000 });
      if (modelsResponse.data && modelsResponse.data.models && modelsResponse.data.models.length > 0) {
        // Prioritize medical-focused models if available
        const medicalModels = modelsResponse.data.models.filter(m => 
          m.name.toLowerCase().includes('med') || 
          m.name.toLowerCase().includes('health') || 
          m.name.toLowerCase().includes('clinical')
        );
        
        if (medicalModels.length > 0) {
          modelToUse = medicalModels[0].name;
        } else {
          // Otherwise use any available model, preferring smaller ones first
          modelToUse = modelsResponse.data.models[0].name;
        }
      }
    } catch (error) {
      console.warn('Could not fetch available models, using default:', error.message);
    }
    
    console.log(`Sending request to Ollama using model: ${modelToUse}`);
    
    const response = await axios.post(
      OLLAMA_URL, 
      {
        model: modelToUse,
        prompt: `You are a healthcare assistant helping patients find the right professionals for their needs.
        Be helpful, accurate, and compassionate when discussing health conditions.
        If mental health issues like anxiety, depression, or stress are mentioned, suggest a Therapist would be appropriate.
        If physical injuries, wounds, medical care needs, or elder care are mentioned, suggest a Home Nurse.
        
        User question: ${userContent}
        
        Please provide a helpful response:`,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          top_k: 40,
          max_tokens: 500
        }
      },
      { timeout: 10000 } // 10 second timeout
    );
    
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
    return fallbackResponse(req, res);
  }
};

// Enhanced fallback response with more comprehensive healthcare patterns
const fallbackResponse = (req, res) => {
  const userMessage = req.body.messages.find(m => m.role === 'user')?.content || '';
  const lowercaseMsg = userMessage.toLowerCase();
  
  // Enhanced pattern matching for common health concerns
  let responseMessage = "I'm here to help with your health concerns. Could you tell me more about your symptoms or what kind of healthcare professional you're looking for?";
  
  // Mental health patterns - Fix the regex syntax error
  if (
    /\b(depress(ed|ion)?|anxiet(y|ies)|stress(ed)?|sad(ness)?|worried|therapy|mental health|moods?|emotion|trauma|grief|ptsd|panic|ocd|adhd|bipolar|schizophrenia|insomnia|suicide|self-harm|phobia|disorder)\b/i.test(lowercaseMsg)
  ) {
    responseMessage = "Based on what you've shared, you might be experiencing symptoms related to mental health. Speaking with a qualified therapist could be very helpful for addressing these concerns. Our platform has licensed psychologists and therapists who specialize in various mental health areas. Would you like me to suggest some professionals who could help?";
  } 
  // Physical health & home care patterns - Fix the regex syntax error
  else if (
    /\b(wound|injur(y|ies)|pain|hurt|bandage|nurse|medication|medicine|blood pressure|diabetes|insulin|dressing|mobility|elder|senior|post-surgery|home care|caregiving|physical|rehabilitation|bath assistance|hygiene|wheelchair|walker|crutches|vital signs|oxygen|breathing|stroke|chronic|terminal|hospice|alzheimer|dementia|cancer)\b/i.test(lowercaseMsg)
  ) {
    responseMessage = "It sounds like you might need medical assistance or home care services. A qualified home nurse could provide the care and support you need for physical conditions, recovery, or ongoing medical assistance. Our platform connects patients with experienced home nursing professionals. Would you like me to help you find a suitable home nurse for your needs?";
  }
  // Sleep-related patterns
  else if (/\b(sleep|insomnia|nightmares|can't sleep|trouble sleeping|sleeping pills|sleep disorder|fatigue|tired|exhausted)\b/i.test(lowercaseMsg)) {
    responseMessage = "Sleep issues can significantly impact your overall health and well-being. Many of our therapists specialize in sleep disorders and can help you develop better sleep habits. Would you like me to recommend a sleep specialist or therapist who can help with these concerns?";
  }
  // Pain-related patterns 
  else if (/\b(headache|migraine|pain|chronic pain|back pain|neck pain|joint pain|arthritis)\b/i.test(lowercaseMsg)) {
    responseMessage = "I understand you're experiencing pain, which can be difficult to manage. Depending on your situation, you might benefit from a home nurse who can provide pain management techniques and care. Would you like information about healthcare professionals who specialize in pain management?";
  }
  // General health question pattern
  else if (/\b(how|what|when|should|need|doctor|health|medical|treatment|symptom|diagnosis|cure|remedy|medicine|prescription)\b/i.test(lowercaseMsg)) {
    responseMessage = "It sounds like you have a health-related question. While I can provide general information, connecting with a healthcare professional would be best for personalized advice. Based on your question, would you prefer to speak with a therapist for mental health concerns or a home nurse for physical health needs?";
  }
  
  return res.status(200).json({
    success: true,
    message: responseMessage,
    isFromFallback: true
  });
};

module.exports = { generateAIResponse };
