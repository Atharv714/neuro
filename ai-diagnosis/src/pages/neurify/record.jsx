import { useState } from "react";

const AudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => setAudioBlob(e.data);
    recorder.start();
    setMediaRecorder(recorder);
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    setRecording(false);
  };

  const sendAudio = async () => {
    if (audioBlob) {
      const formData = new FormData();
      formData.append("audio", audioBlob);

      // Send audio to the backend
      await fetch("/api/whisper-transcription", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Transcription:", data.transcription);
        });
    }
  };

  return (
    <div>
      <button onClick={startRecording} disabled={recording}>
        Record
      </button>
      <button onClick={stopRecording} disabled={!recording}>
        Stop
      </button>
      <button onClick={sendAudio} disabled={!audioBlob}>
        Send
      </button>
    </div>
  );
};
