"use client";
import { useState, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig"; // Adjust the import path as necessary
import { useRouter } from "next/navigation";

const Login = () => {
  const auth = getAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Authenticate user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if user is a volunteer by querying the 'users' collection
      const q = query(
        collection(db, "users"),
        where("uid", "==", user.uid),
        where("role", "==", "volunteer")
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // User has "volunteer" role, redirect to dashboard
        router.push("/dashboard");
      } else {
        // User does not have volunteer role
        setErrorMessage("Access denied. Only volunteers can log in.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 mt-10 h-full bg-gradient-to-r from-blue-50 to-white rounded-lg shadow-xl">
      <h2 className="text-3xl font-semibold mb-6 text-center text-blue-600">
        Volunteer Login
      </h2>
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
          {errorMessage}
        </div>
      )}
      <form onSubmit={handleLogin} className="space-y-5">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 rounded-lg transition duration-200 shadow-md ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"} text-white flex items-center justify-center`}
        >
          {loading ? (
            <div className="flex items-center">
              <div className="spinner mr-2"></div>
              <span>Logging In...</span>
            </div>
          ) : (
            "Log In"
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;
