const https = require('https');
const fs = require('fs');
const apiKey = 'AIzaSyAjk6ZBoe3YKAPidMt-HC3T9-9cErQOmkE';
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    let names = "";
    for (const m of json.models) {
      names += m.name + "\n";
    }
    fs.writeFileSync('final_models.txt', names);
    console.log("DONE");
  });
});
