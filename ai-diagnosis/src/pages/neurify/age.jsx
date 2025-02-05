import { useState } from "react";
import { db } from "../../firebase-config"; // Firebase Firestore instance
import { getAuth } from "firebase/auth"; // Import Firebase authentication

const AskAgeModal = ({ onSubmit }) => {
  const [age, setAge] = useState("");
  const auth = getAuth(); // Initialize Firebase auth

  const handleSubmit = () => {
    const userId = auth.currentUser.uid; // Get current user's ID

    // Save age to Firestore
    db.collection("users").doc(userId).set({ age }, { merge: true });
    onSubmit(age); // Pass age back to parent
  };

  return (
    <div>
      <h2>Welcome! Please enter your age:</h2>
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default AskAgeModal;
