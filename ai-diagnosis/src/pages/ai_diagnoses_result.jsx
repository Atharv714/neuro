import React, { useEffect, useState } from "react";
import { auth } from "../firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import ReactMarkdown from "react-markdown";
import "./css/ai_diagnoses_result.css";

const AiDiagnosesResult = () => {
  const [user] = useAuthState(auth);
  const [diagnosisData, setDiagnosisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = user?.uid;

  useEffect(() => {
    const fetchDiagnosisData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/get_diagnosis_result?user_id=${userId}`
        );
        const data = await response.json();
        if (response.ok) {
          setDiagnosisData(data);
        } else {
          console.error("Error fetching diagnosis data:", data.error);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
    }
    };

    if (userId) {
      fetchDiagnosisData();
    }
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!diagnosisData) {
    return <div>No diagnosis data found.</div>;
  }

  // Helper function to split text into bullet points while preserving markdown for formatted text
  const formatWithBulletPoints = (text) => {
    return text.split("\n").map((line, index) => {
      const isMarkdown = line.startsWith("##") || line.includes("**");
      if (isMarkdown) {
        // If it's markdown, render it without bullet points
        return <ReactMarkdown key={index}>{line}</ReactMarkdown>;
      } else {
        // Otherwise, render it as a bullet point
        return <li key={index}>{line.trim()}</li>;
      }
    });
  };

  return (
    <div className="diagnosis-result-container">
      <h2 className="font-carmen">AI Diagnosis Result</h2>

      <div className="diagnosis-section">
        <h3 className="text-green-500 font-carmen">Notes</h3>
        <ul className="font-varelaround">
          {formatWithBulletPoints(diagnosisData.notes)}
        </ul>
      </div>

      <div className="diagnosis-section">
        <h3 className="text-green-500 font-carmen">Report</h3>
        <ul>{formatWithBulletPoints(diagnosisData.report)}</ul>
      </div>

      <div className="diagnosis-section">
        <h3 className="text-green-500 font-carmen">Clinical Evaluation</h3>
        <ul className="">
          {formatWithBulletPoints(diagnosisData.clinical)}
        </ul>
      </div>

      <div className="diagnosis-section">
        <h3 className="text-green-500 font-carmen">Referrals & Tests</h3>
        <ul className="">
          {formatWithBulletPoints(diagnosisData.referrals)}
        </ul>
      </div>
    </div>
  );
};

export default AiDiagnosesResult;
