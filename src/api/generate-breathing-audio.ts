export async function generateBreathingAudio(text: string, voiceId: string = 'Aria', modelId: string = 'eleven_multilingual_v2') {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  
  if (!apiKey) {
    throw new Error('ElevenLabs API key not configured');
  }

  // Mapeo de nombres de voces a IDs
  const voiceIdMap: { [key: string]: string } = {
    'Aria': '9BWtsMINqrJLrRacOk9x',
    'Roger': 'CwhRBWXzGAHq8TQ4Fs17',
    'Sarah': 'EXAVITQu4vr4xnSDxMaL',
    'Laura': 'FGY2WhTYpPnrIDTdsKH5',
    'Charlie': 'IKne3meq5aSn9XLyUdCD',
  };

  const actualVoiceId = voiceIdMap[voiceId] || voiceId;

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${actualVoiceId}`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify({
      text: text,
      model_id: modelId,
      voice_settings: {
        stability: 0.8,
        similarity_boost: 0.8,
        style: 0.2,
        use_speaker_boost: true
      }
    }),
  });

  if (!response.ok) {
    throw new Error(`ElevenLabs API error: ${response.status}`);
  }

  return response;
}