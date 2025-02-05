import React, { useState } from "react";
import axios from "axios";

const FitnessDashboard = () => {
  const [fitnessData, setFitnessData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Redirect the browser to the Flask backend for Google Fit OAuth
  const handleConnect = () => {
    window.location.href = "http://localhost:5001/authorize";
  };

  // Fetch the fitness data from the Flask backend
  const fetchFitnessData = async () => {
    try {
      setLoading(true);
      // Using withCredentials:true to ensure session cookies are sent along
      const response = await axios.get("http://localhost:5001/get_data", {
        withCredentials: true,
      });
      setFitnessData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching fitness data:", error);
      setLoading(false);
    }
  };

  // Helper to render steps data nicely
  const renderStepsData = () => {
    if (!fitnessData || !fitnessData.steps || !fitnessData.steps.bucket) {
      return <p>No steps data available.</p>;
    }
    return fitnessData.steps.bucket.map((bucket, idx) => {
      // Extract steps from the first data point (if available)
      let steps = 0;
      if (
        bucket.dataset &&
        bucket.dataset[0] &&
        bucket.dataset[0].point &&
        bucket.dataset[0].point[0] &&
        bucket.dataset[0].point[0].value &&
        bucket.dataset[0].point[0].value[0].intVal !== undefined
      ) {
        steps = bucket.dataset[0].point[0].value[0].intVal;
      }
      // Convert milliseconds to local date/time strings
      const startTime = new Date(parseInt(bucket.startTimeMillis));
      const endTime = new Date(parseInt(bucket.endTimeMillis));

      return (
        <div
          key={idx}
          style={{
            border: "1px solid #ccc",
            marginBottom: "10px",
            padding: "10px",
          }}
        >
          <h3>Steps Bucket {idx + 1}</h3>
          <p>
            <strong>Time Range:</strong> {startTime.toLocaleString()} -{" "}
            {endTime.toLocaleString()}
          </p>
          <p>
            <strong>Steps:</strong> {steps}
          </p>
        </div>
      );
    });
  };

  // Helper to render heart rate data nicely
  const renderHeartRateData = () => {
    if (
      !fitnessData ||
      !fitnessData.heart_rate ||
      !fitnessData.heart_rate.bucket
    ) {
      return <p>No heart rate data available.</p>;
    }
    return fitnessData.heart_rate.bucket.map((bucket, idx) => {
      let heartRates = [];
      // Extract all heart rate values from this bucket (if available)
      if (
        bucket.dataset &&
        bucket.dataset[0] &&
        bucket.dataset[0].point &&
        bucket.dataset[0].point.length > 0
      ) {
        heartRates = bucket.dataset[0].point
          .map((point) => point.value && point.value[0] && point.value[0].fpVal)
          .filter((val) => val !== undefined);
      }
      // Calculate the average heart rate if values exist
      const avgHeartRate =
        heartRates.length > 0
          ? heartRates.reduce((acc, curr) => acc + curr, 0) / heartRates.length
          : 0;
      const startTime = new Date(parseInt(bucket.startTimeMillis));
      const endTime = new Date(parseInt(bucket.endTimeMillis));

      return (
        <div
          key={idx}
          style={{
            border: "1px solid #ccc",
            marginBottom: "10px",
            padding: "10px",
          }}
        >
          <h3>Heart Rate Bucket {idx + 1}</h3>
          <p>
            <strong>Time Range:</strong> {startTime.toLocaleString()} -{" "}
            {endTime.toLocaleString()}
          </p>
          <p>
            <strong>Average Heart Rate:</strong> {avgHeartRate.toFixed(2)} bpm
          </p>
        </div>
      );
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Fitness Dashboard</h1>
      <button onClick={handleConnect} style={{ marginRight: "10px" }}>
        Connect to Google Fit
      </button>
      <button onClick={fetchFitnessData}>Fetch Fitness Data</button>
      {loading && <p>Loading...</p>}
      {fitnessData && (
        <div style={{ marginTop: "20px" }}>
          <h2>Steps Data</h2>
          {renderStepsData()}
          <h2>Heart Rate Data</h2>
          {renderHeartRateData()}
        </div>
      )}
    </div>
  );
};

export default FitnessDashboard;
