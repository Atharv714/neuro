import { auth } from "./firebase-config"; // Import Firebase authentication instance from your config
import { onAuthStateChanged } from "firebase/auth";

/**
 * Gets the currently signed-in user from Firebase Authentication.
 * @param {function} callback - Function to call with the user object or null if no user is signed in.
 */
export const getCurrentUser = (callback) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, call the callback with the user object
      callback(user);
    } else {
      // No user is signed in, call the callback with null
      callback(null);
    }
  });
};
