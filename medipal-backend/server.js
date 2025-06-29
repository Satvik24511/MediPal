const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config(); // Load environment variables from .env file

// Set up Express app
const app = express();
const port = 3002;

// Middleware
app.use(cors()); // Allows your React Native app to connect to this server
app.use(express.json({ limit: '50mb' })); // Allow large JSON bodies for base64 images

// Get your API key from the .env file
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error("Error: GEMINI_API_KEY is not set. Please create a .env file and add your key.");
    process.exit(1);
}

// Initialize the Generative AI client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

// Helper function to create an image part for the Gemini prompt
function base64ToGenerativePart(base64Image, mimeType) {
    return {
        inlineData: {
            data: base64Image,
            mimeType
        },
    };
}

// OCR Endpoint using Gemini
app.post('/ocr', async (req, res) => {
    try {
        const base64Image = req.body.image;

        if (!base64Image) {
            return res.status(400).send({ error: 'No image data provided.' });
        }

        // Gemini Vision API requires a prompt with both text and image parts
        const prompt = "Extract all readable text from this image. Return only the extracted text, formatted as a simple string without any extra commentary or Markdown formatting.";
        const mimeType = 'image/jpeg'; // Assuming image is jpeg. You could send this from the client.

        const imagePart = base64ToGenerativePart(base64Image, mimeType);

        console.log('Sending image to Gemini for text extraction...');

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();

        console.log('Text extracted by Gemini:', text);
        res.status(200).json({ text: text });

    } catch (error) {
        console.error('Error during Gemini OCR processing:', error);
        res.status(500).send({ error: `Failed to process image with Gemini API: ${error.message}` });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`OCR backend server listening at http://localhost:${port}`);
});