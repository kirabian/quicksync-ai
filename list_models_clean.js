const fs = require('fs');
const apiKey = 'YOUR_API_KEY'; // I will replace this in the next step or use process.env

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY || '';
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    let output = "Available Models:\n";
    if (data.models) {
      data.models.forEach((m) => {
        output += `- ${m.name} (${m.supportedGenerationMethods.join(", ")})\n`;
      });
    } else {
      output += JSON.stringify(data, null, 2);
    }
    fs.writeFileSync('models_list_clean.txt', output);
    console.log("Saved to models_list_clean.txt");
  } catch (e) {
    fs.writeFileSync('models_list_clean.txt', "Error: " + e.message);
  }
}

listModels();
