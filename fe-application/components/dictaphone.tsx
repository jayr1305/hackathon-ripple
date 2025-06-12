import React, { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Mic, MicOff, Volume2 } from "lucide-react"

const Dictaphone = ({ onTranscript, disabled }: { onTranscript: (transcript: string) => void, disabled: boolean }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript && !listening) {
      onTranscript(transcript);
    }
  }, [transcript, listening, onTranscript]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div>
      {/* <p>Microphone: {listening ? 'on' : 'off'}</p> */}
      <button onClick={() => listening ? SpeechRecognition.stopListening() : SpeechRecognition.startListening()} disabled={disabled}>
        {listening ? <Volume2 /> : <Mic />}
      </button>
      {/* <button onClick={resetTranscript} disabled={disabled}>Reset</button> */}
      {/* <p>{transcript}</p> */}
    </div>
  );
};
export default Dictaphone;