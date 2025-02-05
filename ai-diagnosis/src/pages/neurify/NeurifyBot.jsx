import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import axios from "axios";

function NeurifyBot() {
  const [age, setAge] = useState("");
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (!userDoc.exists()) {
          setIsFirstTime(true);
        } else {
          setAge(userDoc.data().age);
        }
      }
    };
    fetchUserData();
  }, []);

  const handleAgeSubmit = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      await setDoc(doc(db, "users", currentUser.uid), { age });
      setIsFirstTime(false);
    }
  };

  const handleRecord = async () => {
    if (!isRecording) {
      setIsRecording(true);
      try {
        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
        setMediaRecorder(recorder);
        let chunks = []; // Local chunks array for debugging

        recorder.ondataavailable = (event) => {
          console.log("ondataavailable called", event.data.size);
          if (event.data.size > 0) {
            chunks.push(event.data); // Use a local array for debugging
            setAudioChunks((prevChunks) => [...prevChunks, event.data]); // Update state with new chunk
          }
        };

        recorder.onstop = async () => {
          console.log(
            "Recording stopped. Total chunks captured:",
            chunks.length
          );
          if (chunks.length > 0) {
            const audioBlob = new Blob(chunks, { type: "audio/webm" });
            console.log("Audio blob size:", audioBlob.size);
            await sendAudioToBackend(audioBlob);
          } else {
            console.error("No audio data captured.");
          }
        };

        recorder.start();
        console.log("Recording started");
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    } else {
      setIsRecording(false);
      if (mediaRecorder) {
        mediaRecorder.stop(); // Stop recording
        console.log("Stopping recording");
      }
    }
  };



  // const sendAudioToBackend = async (audioBlob) => {
  //   const formData = new FormData();
  //   formData.append("file", audioBlob, "recording.webm");

  //   try {
  //     console.log("Sending audioBlob to backend:", audioBlob);
  //     const response = await axios.post(
  //       "http://127.0.0.1:5000/process_audio/",
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //         responseType: "blob",
  //       }
  //     );

  //     // Handle the response from the backend
  //     const audioUrl = window.URL.createObjectURL(
  //       new Blob([response.data], { type: "audio/wav" })
  //     );
  //     const audio = new Audio(audioUrl);
  //     audio.play();
  //   } catch (error) {
  //     console.error("Error uploading audio:", error);
  //   }
  // };

  const sendAudioToBackend = async (audioBlob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.webm");

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/process_audio/", // Update to match your FastAPI server address
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "json",
        }
      );

      // Handle the response from the backend
      console.log("Backend response:", response.data);
      const audioResponse = new Audio(response.data.audioUrl); // Assuming audio URL is in the response
      audioResponse.play();
    } catch (error) {
      console.error("Error uploading audio:", error);
    }
  };




  return (
    <div>
      {isFirstTime ? (
        <div>
          <h1>Welcome to Neurify!</h1>
          <input
            type="number"
            placeholder="Enter your age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          <button onClick={handleAgeSubmit}>Submit Age</button>
        </div>
      ) : (
        <div>
          <h1>Welcome back! Your age is {age}</h1>
          <button onClick={handleRecord}>
            {isRecording ? "Stop Recording" : "Record"}
          </button>
        </div>
      )}
    </div>
  );
}

export default NeurifyBot;
