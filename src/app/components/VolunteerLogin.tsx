"use client";

import { useState, useEffect } from "react";
import { auth } from "../../lib/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import Cookies from "js-cookie";
import { useAuthState } from "react-firebase-hooks/auth";

const db = getFirestore();

export default function VolunteerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [user] = useAuthState(auth); 
  const router = useRouter();

  useEffect(() => {
    // Check if the user is already logged in
    if (user) {
      setLoading(true);
      checkUserVerification(user.uid);
    } else {
      setLoading(false);
      setIsLoggedIn(false);
    }
  }, [user]);

  const checkUserVerification = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'volunteers', userId));
      const userData = userDoc.data();

      if (userData?.role === 'volunteer' && userData?.verified) {
        // Verified user, proceed to dashboard
        router.push('/dashboard');
        setIsLoggedIn(true);
      } else if (userData?.role === 'volunteer' && !userData?.verified) {
        setError('Please wait for admin verification.');
        auth.signOut(); // Log the user out
      } else {
        setError('Volunteers only. Access denied.');
        auth.signOut(); // Log the user out
      }
    } catch (error) {
      console.error("Error checking user verification:", error);
      setError('An error occurred while verifying user.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      const userId = userCredential.user.uid;

      // Check user verification status after login
      checkUserVerification(userId);

      // Store the token in cookies if verified
      Cookies.set('authToken', token, { expires: 1, secure: true, sameSite: 'Strict' });
    } catch (error) {
      setError('Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  // If loading or user is logged in, we show the loader or dashboard
  if (loading) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen bg-gradient-to-br from-purple-900 to-indigo-700">
        <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"></path>
        </svg>
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  // Show the login form if the user is not logged in
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 to-indigo-700 p-6 w-full">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-10 w-full max-w-md transform transition duration-500 hover:scale-105">
        <h2 className="text-4xl font-extrabold text-center text-white tracking-wide mb-4">
          Volunteer Login
        </h2>

        {error && <p className="text-red-400 text-center font-semibold mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-white font-semibold mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-white rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-white rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 bg-purple-500 text-white rounded-lg font-semibold text-lg shadow-lg hover:bg-purple-600 transform transition duration-300"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
