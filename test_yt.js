const { YoutubeTranscript } = require('youtube-transcript');

async function testTranscript() {
  const url = 'https://youtu.be/poZtdyC24P4';
  try {
    console.log("Fetching transcript for:", url);
    const transcript = await YoutubeTranscript.fetchTranscript(url);
    console.log("SUCCESS! Transcript length:", transcript.length);
    console.log("Sample text:", transcript[0].text);
  } catch (error) {
    console.error("FAILED standard fetch:", error.message);
    
    try {
      console.log("Trying with lang: 'id'...");
      const transcript = await YoutubeTranscript.fetchTranscript(url, { lang: 'id' });
      console.log("SUCCESS with 'id'!");
    } catch (e2) {
      console.error("FAILED with 'id':", e2.message);
      
      try {
        console.log("Trying with lang: 'en'...");
        const transcript = await YoutubeTranscript.fetchTranscript(url, { lang: 'en' });
        console.log("SUCCESS with 'en'!");
      } catch (e3) {
        console.error("FAILED with 'en':", e3.message);
      }
    }
  }
}

testTranscript();
