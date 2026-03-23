const { YoutubeTranscript } = require('youtube-transcript');

async function testTranscript() {
  const videoId = 'poZtdyC24P4';
  const languages = ['id', 'id-ID', 'in', 'en'];
  
  for (const lang of languages) {
    try {
      console.log(`Trying lang: '${lang}'...`);
      const transcript = await YoutubeTranscript.fetchTranscript(videoId, { lang });
      process.stdout.write(`SUCCESS with '${lang}'! Length: ${transcript.length}\n`);
      return;
    } catch (e) {
      process.stdout.write(`FAILED with '${lang}': ${e.message}\n`);
    }
  }
}

testTranscript();
