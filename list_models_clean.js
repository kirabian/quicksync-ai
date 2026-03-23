const https = require('https');
const apiKey = 'AIzaSyAjk6ZBoe3YKAPidMt-HC3T9-9cErQOmkE';
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    for (const m of json.models) {
      if (m.name.includes('gemini')) {
        process.stdout.write(m.name + '\n');
      }
    }
  });
});
