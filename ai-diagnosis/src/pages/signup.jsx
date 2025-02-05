import React, { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { app, auth, db, storage } from "../firebase-config";
import { Link } from "react-router-dom";
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

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const idToken = userCredential.user.accessToken;
        // Send the token and name to your Flask backend
        fetch("http://127.0.0.1:5000/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            first_name: firstName,
            last_name: lastName,
          }), // Updated to send first_name and last_name
        })
          .then((response) => response.json())
          .then((data) => alert(data.message))
          .catch((error) => alert("An error occurred: " + error));
      })
      .catch((error) => alert("Sign-up failed: " + error.message));
  };

  const handleGoogleSignUp = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const idToken = result.user.accessToken;
        fetch("http://127.0.0.1:5000/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken }),
        })
          .then((response) => response.json())
          .then((data) => alert(data.message))
          .catch((error) => alert("An error occurred: " + error));
      })
      .catch((error) => alert("Google sign-up failed: " + error.message));
  };

  return (
    <div className="absolute inset-0 flex justify-center items-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl font-carmen">Sign Up</CardTitle>
          <CardDescription className="font-varelaround">
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name" className="font-carmen">
                  First name
                </Label>
                <Input
                  className="font-varelaround"
                  id="first-name"
                  placeholder="Eg: Rahul"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name" className="font-carmen">
                  Last name
                </Label>
                <Input
                  className="font-varelaround"
                  id="last-name"
                  placeholder="Eg: Sharma"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="font-carmen">
                Email
              </Label>
              <Input
                className="font-varelaround"
                id="email"
                type="email"
                placeholder="Eg: rahulsharma@neuro.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="font-carmen">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="font-varelaround"
              />
            </div>
            <Button onClick={handleSignUp} className="w-full font-varelaround">
              Create an account
            </Button>
            <Button
              onClick={handleGoogleSignUp}
              variant="outline"
              className="w-full font-varelaround"
            >
              <FcGoogle className="mr-2 h-4 w-4" />
              Sign up with Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm font-varelaround">
            Already have an account?{" "}
            <Link to="/signin" className="underline font-varelaround">
              {" "}
              {/* Use 'to' instead of 'href' */}
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpForm;
