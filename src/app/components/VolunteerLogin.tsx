"use client";

import { useEffect, useState } from "react";
import { auth } from "../../lib/firebaseConfig";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const db = getFirestore();

export default function VolunteerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // Start in loading state
  const router = useRouter();
  const [user] = useAuthState(auth); // Access current auth state

  useEffect(() => {
    if (user) {
      // If user is already authenticated, redirect to dashboard
      router.push('/dashboard');
    } else {
      // If no user, stop loading to show the login page
      setLoading(false);
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      const userId = userCredential.user.uid;

      // Retrieve the user's role and verification status
      const userDoc = await getDoc(doc(db, 'volunteers', userId));
      const userData = userDoc.data();

      if (userData?.role === 'volunteer' && userData?.verified) {
        Cookies.set('authToken', token, { expires: 1, secure: true, sameSite: 'Strict' });
        router.push('/dashboard');
      } else if (userData?.role === 'volunteer' && !userData?.verified) {
        setError('Please wait for admin verification.');
        auth.signOut();
      } else {
        setError('Access denied. Volunteers only.');
        auth.signOut();
      }

      setLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = getFriendlyErrorMessage(error);
        setError(errorMessage);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      setLoading(false);
    }
  };

  function getFriendlyErrorMessage(error: Error): string {
    if ("code" in error) {
      const firebaseError = error as { code: string };
      switch (firebaseError.code) {
        case "auth/invalid-credential":
          return "Invalid credentials. Please check your email and password.";
        case "auth/user-not-found":
          return "User not found. Please check your email and try again.";
        case "auth/wrong-password":
          return "Incorrect password. Please try again.";
        case "auth/too-many-requests":
          return "Too many attempts. Please try again later.";
        default:
          return "Login failed. Please try again.";
      }
    }
    return "An error occurred. Please try again.";
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen bg-gradient-to-br from-purple-900 to-indigo-700">
  <svg
    className="animate-spin h-5 w-5 text-white mr-2"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
    ></path>
  </svg>
  <p className="text-white text-xl">Loading...</p>
</div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 to-indigo-700 p-6 w-full">
      <div
        className={`bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-10 w-full max-w-md transform transition duration-500 hover:scale-105`}
      >
        <h2 className="text-4xl font-extrabold text-center text-white tracking-wide mb-4">
          {showForgotPassword ? 'Reset Password' : 'Volunteers Login'}
        </h2>

        {error && <p className="text-red-400 text-center font-semibold mb-4">{error}</p>}

        {showForgotPassword ? (
          <ForgotPasswordForm onClose={() => setShowForgotPassword(false)} />
        ) : (
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
        )}

        {!showForgotPassword && (
          <p className="text-center mt-4 text-purple-200">
            <button
              onClick={() => setShowForgotPassword(true)}
              className="hover:underline transition"
            >
              Forgot Password?
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

// ForgotPasswordForm Component
function ForgotPasswordForm({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      await sendPasswordResetEmail(auth, email);
      setVerificationSent(true);
      setMessage('Password reset email sent! Check your inbox.');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || 'Failed to send reset email. Try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="mt-6 bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-lg">
      {verificationSent ? (
        <div className="space-y-4 text-center text-white">
          <p className="text-green-400 font-semibold">{message}</p>
          <button
            onClick={onClose}
            className="w-full py-3 mt-4 bg-purple-500 text-white rounded-lg font-semibold shadow-md hover:bg-purple-600 transition"
          >
            Back to Login
          </button>
        </div>
      ) : (
        <>
          <h3 className="text-xl font-bold text-white">Reset Your Password</h3>
          {error && <p className="text-red-400 mt-2">{error}</p>}
          <form onSubmit={handlePasswordReset} className="space-y-4 mt-4">
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
            <button
              type="submit"
              className="w-full py-3 bg-purple-500 text-white rounded-lg font-semibold shadow-lg hover:bg-purple-600 transform transition duration-300"
            >
              Send Reset Email
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 mt-2 bg-gray-400 text-gray-800 rounded-lg font-semibold shadow-md hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </form>
        </>
      )}
    </div>
  );
}
