const { GoogleGenAI } = require("@google/genai");
const fs = require('fs').promises;
const path = require('path');

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// Agricultural system instruction for specialized farming assistance
const AGRICULTURAL_SYSTEM_INSTRUCTION = `You are Kripson, an advanced AI agricultural assistant designed to help farmers, agricultural professionals, and anyone interested in farming and agriculture. Your expertise includes:

🌱 CORE EXPERTISE:
- Crop identification, cultivation, and management
- Plant disease diagnosis and treatment recommendations
- Pest identification and integrated pest management (IPM)
- Soil health assessment and fertilization guidance
- Weather-based farming advice and seasonal planning
- Sustainable farming practices and organic methods
- Agricultural technology and modern farming techniques
- Livestock management and animal husbandry
- Farm equipment and machinery guidance
- Post-harvest handling and storage solutions

🎯 RESPONSE GUIDELINES:
- Provide practical, actionable advice that farmers can implement
- Include specific recommendations with quantities, timing, and methods when relevant
- Consider regional variations and adapt advice accordingly
- Prioritize sustainable and environmentally-friendly solutions
- Mention safety precautions when dealing with chemicals or equipment
- Suggest cost-effective solutions for small and medium farmers
- Include preventive measures alongside curative solutions
- Reference scientific principles while keeping language accessible

📸 IMAGE ANALYSIS EXPERTISE:
When analyzing agricultural images, focus on:
- Crop identification and growth stage assessment
- Disease symptoms and severity evaluation
- Pest identification and damage assessment
- Nutrient deficiency signs and soil condition indicators
- Weed identification and management strategies
- Equipment condition and operational issues
- Weather damage assessment and recovery advice

🚜 COMMUNICATION STYLE:
- Be encouraging and supportive to farmers
- Use clear, practical language avoiding unnecessary jargon
- Provide step-by-step instructions when appropriate
- Include approximate costs or time requirements when helpful
- Offer alternative solutions for different resource levels
- Always prioritize farmer safety and environmental protection

Remember: You're helping people who feed the world. Your advice should be accurate, practical, and empowering for agricultural success.`;

// Helper function to convert image to base64 and get MIME type
async function fileToGenerativePart(imagePath, mimeType) {
    const imageData = await fs.readFile(imagePath);
    return {
        inlineData: {
            data: imageData.toString('base64'),
            mimeType
        }
    };
}

// Helper function to convert base64 image data to generative part
function base64ToGenerativePart(base64Data, mimeType) {
    return {
        inlineData: {
            data: base64Data,
            mimeType
        }
    };
}

// Generate response for text-only messages
async function generateResponse(chatHistory){
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        systemInstruction: AGRICULTURAL_SYSTEM_INSTRUCTION,
        contents: chatHistory
    });
    return response.text;
}

// Generate response for messages with images
async function generateResponseWithImage(text, imageData, mimeType, chatHistory = []){
    try {
        // Create the image part
        const imagePart = base64ToGenerativePart(imageData, mimeType);
        
        // Create the prompt with context
        const prompt = text || "What can you tell me about this image? Please provide a detailed analysis.";
        
        // Include chat history context if available
        let contextPrompt = prompt;
        if (chatHistory.length > 0) {
            const lastFewMessages = chatHistory.slice(-4); // Get last 4 messages for context
            const context = lastFewMessages.map(msg => 
                `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.parts[0]?.text || ''}`
            ).join('\n');
            contextPrompt = `Based on our previous conversation:\n${context}\n\nNow, regarding this image: ${prompt}`;
        }
        
        // Use the same API structure as your working text function
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            systemInstruction: AGRICULTURAL_SYSTEM_INSTRUCTION,
            contents: [{
                role: "user",
                parts: [
                    { text: contextPrompt },
                    imagePart
                ]
            }]
        });
        
        return response.text;
    } catch (error) {
        console.error('Error generating response with image:', error);
        throw new Error(`Failed to analyze image: ${error.message}`);
    }
}

// Generate response for image file path
async function generateResponseWithImageFile(text, imagePath, chatHistory = []){
    try {
        // Determine MIME type based on file extension
        const ext = path.extname(imagePath).toLowerCase();
        let mimeType;
        switch (ext) {
            case '.jpg':
            case '.jpeg':
                mimeType = 'image/jpeg';
                break;
            case '.png':
                mimeType = 'image/png';
                break;
            case '.gif':
                mimeType = 'image/gif';
                break;
            case '.webp':
                mimeType = 'image/webp';
                break;
            default:
                throw new Error('Unsupported image format. Please use JPG, PNG, GIF, or WebP.');
        }
        
        const imagePart = await fileToGenerativePart(imagePath, mimeType);
        const prompt = text || "What can you tell me about this image? Please provide a detailed analysis.";
        
        // Use the same API structure as your working text function
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            systemInstruction: AGRICULTURAL_SYSTEM_INSTRUCTION,
            contents: [{
                role: "user",
                parts: [
                    { text: prompt },
                    imagePart
                ]
            }]
        });
        
        return response.text;
    } catch (error) {
        console.error('Error generating response with image file:', error);
        throw new Error(`Failed to analyze image: ${error.message}`);
    }
}

module.exports = { 
    generateResponse, 
    generateResponseWithImage, 
    generateResponseWithImageFile 
};
