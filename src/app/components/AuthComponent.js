// AuthComponent.js
"use client"
import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from '../../lib/firebaseConfig'; // Adjust this import based on your project structure
import { useRouter } from 'next/navigation';

const AuthComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter(); // Initialize useRouter

  const handleSignup = async () => {
    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Set user role to "volunteer" in Firestore
      await setDoc(doc(db, "users", user.uid), {
        role: "volunteer",
        email: user.email,
      });

      alert("Signup successful! You can now log in.");
    } catch (error) {
      setError(error.message);
      console.error("Error signing up:", error);
    }
  };

  const handleLogin = async () => {
    const auth = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === "volunteer") {
          alert("Login successful as volunteer!");
          router.push('/dashboard'); // Redirect to the dashboard
        } else {
          console.error("You do not have permission to log in as a volunteer.");
          await auth.signOut();
          alert("You do not have permission to log in as a volunteer.");
        }
      } else {
        console.error("No such user document!");
      }
    } catch (error) {
      setError(error.message);
      console.error("Error logging in:", error);
    }
  };

  return (
    <div>
      <h2>{isLogin ? "Login" : "Signup"}</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={isLogin ? handleLogin : handleSignup}>
        {isLogin ? "Login" : "Sign Up"}
      </button>
      <p>{error}</p>
      <button onClick={() => setIsLogin(!isLogin)}>
        Switch to {isLogin ? "Signup" : "Login"}
      </button>
    </div>
  );
};

export default AuthComponent;