const https = require('https');
const apiKey = 'AIzaSyAjk6ZBoe3YKAPidMt-HC3T9-9cErQOmkE';
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.models) {
        console.log("AVAILABLE MODELS:");
        json.models.forEach(m => {
          console.log(`- ${m.name}`);
        });
      } else {
        console.log("Response:", data);
      }
    } catch (e) {
      console.log("Error parsing response:", e.message);
      console.log("Raw data:", data);
    }
  });
}).on('error', (err) => {
  console.log("HTTPS error:", err.message);
});
