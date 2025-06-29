// api/llmService.js

// Using the provided API key directly.
// In a production environment, it is highly recommended to manage API keys
// using environment variables and to NEVER commit them to version control.
const API_KEY = "AIzaSyCvMBc7rz3SHCWv1mMirz841Kmz4b7HXys"; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

/**
 * Helper function to make LLM API calls with robust parsing and error handling.
 * @param {string} prompt - The text prompt for the LLM.
 * @param {object} schema - The JSON schema for the expected response.
 * @returns {Promise<object|Array|null>} - Parsed JSON result or null on error/empty.
 */
export async function callLLMApi(prompt, schema) {
    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });

    const payload = {
        contents: chatHistory,
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: schema
        }
    };

    let rawResponseText = '';
    try {
        console.log('Using API Key (first few chars):', API_KEY ? API_KEY.substring(0, 5) + '...' : 'Not set');

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        rawResponseText = await response.text();
        console.log('Raw API response text (from LLM service):', rawResponseText);

        if (!response.ok) {
            let errorMessage = `LLM API Error: ${response.statusText}`;
            try {
                const errorJson = JSON.parse(rawResponseText);
                errorMessage = `LLM API Error: ${errorJson.error?.message || response.statusText}`;
                console.error('LLM API error response (parsed):', errorJson);
            } catch (e) {
                errorMessage = `LLM API Error: ${response.statusText} - Non-JSON error body: ${rawResponseText.substring(0, Math.min(rawResponseText.length, 200))}...`;
                console.error('LLM API error response (non-JSON):', rawResponseText);
            }
            throw new Error(errorMessage);
        }

        if (!rawResponseText.trim()) {
            console.warn('LLM API returned an empty response body. Returning null.');
            return null;
        }

        let result;
        try {
            result = JSON.parse(rawResponseText);
        } catch (parseError) {
            console.error('Failed to parse raw API response as JSON (top level structure). Returning null:', parseError);
            console.error('Raw response text that failed to parse:', rawResponseText);
            return null;
        }

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const jsonString = result.candidates[0].content.parts[0].text;
            const cleanedJsonString = jsonString.replace(/```json\n|\n```/g, '').trim();

            console.log('Cleaned JSON string from LLM content part (for inner parsing):', cleanedJsonString);

            try {
                const parsedResult = JSON.parse(cleanedJsonString);
                return parsedResult;
            } catch (parseError) {
                console.error('JSON parsing error of LLM content part (inner). Returning null:', parseError);
                console.error('String that failed to parse:', cleanedJsonString);
                return null;
            }
        } else {
            console.warn('LLM API response structure unexpected or empty (no candidates/content parts). Returning null:', result);
            return null;
        }
    } catch (error) {
        console.error('Overall network or API call error in callLLMApi:', error);
        throw error;
    }
}

/**
 * Main function using a SINGLE LLM query to get all drug interaction details at once.
 * @param {string[]} drugs - Array of drug names.
 * @returns {Promise<Array>} - Array of detailed interaction objects.
 */
export async function getInteractionsOverviewFromLLM(drugs) {
    const drugList = drugs.join(', ');
    const prompt = `Given the following drugs: ${drugList}.
Identify all significant Drug-Drug Interactions (DDIs).
For each DDI, provide:
1.  \`drug1\` and \`drug2\`: The names of the interacting drugs.
2.  \`interactionType\`: Describe the type of interaction (e.g., 'Pharmacodynamic', 'Pharmacokinetic').
3.  \`effect\`: A concise summary of the primary clinical effect or risk.
4.  \`riskLevel\`: Categorize the risk as 'High', 'Moderate', or 'Low'.

Return the response as a JSON array. Each object in the array MUST contain all four fields.
If no significant interactions are found, return an empty array \`[]\`.

Example interaction object:
\`\`\`json
{
  "drug1": "Warfarin",
  "drug2": "Ibuprofen",
  "interactionType": "Pharmacodynamic",
  "effect": "Increased risk of bleeding.",
  "riskLevel": "High"
}
\`\`\`
`;

    const schema = {
        type: "ARRAY",
        items: {
            type: "OBJECT",
            properties: {
                "drug1": { "type": "STRING" },
                "drug2": { "type": "STRING" },
                "interactionType": { "type": "STRING" },
                "effect": { "type": "STRING" },
                "riskLevel": { "type": "STRING", "enum": ["High", "Moderate", "Low"] }
            },
            "required": ["drug1", "drug2", "interactionType", "effect", "riskLevel"]
        }
    };
    
    // Call the single LLM API and return the result.
    const result = await callLLMApi(prompt, schema);
    
    // Return an empty array if the API call fails or returns null.
    return result || [];
}