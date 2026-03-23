const https = require('https');
const fs = require('fs');
const apiKey = 'AIzaSyAjk6ZBoe3YKAPidMt-HC3T9-9cErQOmkE';
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('models_list.json', data);
    console.log("DONE");
  });
});
