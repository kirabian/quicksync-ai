const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');

async function testTranslation() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const keyMatch = env.match(/NEXT_PUBLIC_GEMINI_API_KEY=(.+)/);
  const apiKey = keyMatch ? keyMatch[1].trim() : '';

  const genAI = new GoogleGenerativeAI(apiKey);
  // Verified string from our previous discovery
  const modelId = "gemini-3.1-flash-lite-preview";
  console.log(`Testing model: ${modelId}`);
  
  const model = genAI.getGenerativeModel({ model: modelId });
  
  try {
    const result = await model.generateContent("Translate 'Hello World' to Indonesian");
    console.log("SUCCESS:", result.response.text());
  } catch (error) {
    console.error("FAILED:", error.message);
  }
}

testTranslation();
