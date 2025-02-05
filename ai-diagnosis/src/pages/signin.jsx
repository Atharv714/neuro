import React, { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { app } from "../firebase-config"; // Make sure 'auth' is initialized properly
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { RocketIcon } from "@radix-ui/react-icons";
import { FcGoogle } from "react-icons/fc";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"; // Import your Alert component


export const description =
  "A login form with email and password. There's an option to login with Google and a link to sign up if you don't have an account.";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState(null); // State for alert message
  const [alertType, setAlertType] = useState(""); // State for alert type (success or failure)

  const auth = getAuth(app); // Initialize Firebase Auth
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate(); // Add navigate hook

  provider.addScope("https://www.googleapis.com/auth/fitness.activity.read");
  // Handle email/password sign-in
  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const idToken = userCredential.user.accessToken;
        fetch("http://127.0.0.1:5000/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.name) {
              setAlertMessage(`Welcome ${data.name}!`); // Display user's name
            } else {
              setAlertMessage("Sign-in successful!");
            }
            setAlertType("success");
          })
          .catch((error) => {
            setAlertMessage("An error occurred: " + error.message);
            setAlertType("error");
          });
      })
      .catch((error) => {
        setAlertMessage("Sign-in failed: " + error.message);
        setAlertType("error");
      });
  };


  // Handle Google sign-in
  const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // Retrieve the access token
        const accessToken = result._tokenResponse.oauthAccessToken;

        // Send the access token to the Flask backend
        fetch("http://127.0.0.1:5000/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ accessToken }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.name) {
              setAlertMessage(
                `Google sign-in successful! Welcome ${data.name}`
              );
            } else {
              setAlertMessage("Google sign-in successful!");
            }
            setAlertType("success");
          })
          .catch((error) => {
            setAlertMessage("An error occurred: " + error.message);
            setAlertType("error");
          });
      })
      .catch((error) => {
        setAlertMessage("Google sign-in failed: " + error.message);
        setAlertType("error");
      });
  };


  return (
    <div className="absolute inset-0 flex justify-center items-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-carmen">Welcome Back</CardTitle>
          <CardDescription className="font-varelaround">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Display alert based on alertMessage and alertType */}
          {alertMessage && (
            <Alert
              className={
                alertType === "success" ? "bg-green-100" : "bg-red-100"
              }
            >
              <RocketIcon className="h-4 w-4" />
              <AlertTitle>
                {alertType === "success" ? "Success!" : "Error!"}
              </AlertTitle>
              <AlertDescription>{alertMessage}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 mt-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="font-carmen">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="atharv@neuro.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="font-varelaround"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password" className="font-carmen">
                  Password
                </Label>
                <Link
                  to="/forgot-password"
                  className="ml-auto inline-block text-sm underline font-varelaround"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full font-carmen"
              onClick={handleSignIn}
            >
              Login
            </Button>
            <Button
              variant="outline"
              className="w-full font-carmen"
              onClick={handleGoogleSignIn}
            >
              <FcGoogle className="mr-2 h-4 w-4" />
              Login with Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm font-varelaround">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="underline font-varelaround">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
