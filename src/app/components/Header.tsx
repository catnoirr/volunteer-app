// components/Header.tsx
"use client";
import { useState, useEffect } from "react";
import {FaUserInjured, FaSignOutAlt } from "react-icons/fa";
import { auth, db } from "../../lib/firebaseConfig"; // Import Firebase auth and Firestore
import { useAuthState } from "react-firebase-hooks/auth"; // Firebase hook for auth
import { doc, getDoc } from "firebase/firestore"; // Firestore methods
import { signOut } from "firebase/auth"; // Firebase signOut method
import { useRouter } from "next/navigation"; // For navigation

export default function Header() {
  const [user] = useAuthState(auth); // Get the authenticated user
  const [userName, setUserName] = useState(""); // State to store the user's name from Firestore
  const [currentDate, setCurrentDate] = useState(""); // State for the current date
  const router = useRouter();

  // Fetch the user details from Firestore
  useEffect(() => {
    if (user) {
      const fetchUserName = async () => {
        try {
          const userDocRef = doc(db, "volunteers", user.uid); // Reference to the user's document in the "volunteers" collection
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(userData.name || "User Name"); // Set the user's name, or fallback to 'User Name'
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserName();
    }
  }, [user]); // Run this effect when the user changes

  // Set the current date
  useEffect(() => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    };
    setCurrentDate(date.toLocaleDateString(undefined, options));
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/"); // Redirect to the main page after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <header className="flex items-center justify-between p-5 bg-white shadow-md rounded-3xl">
      {/* Display Authenticated User Details */}
      <div className="flex items-center ml-4">
        <FaUserInjured className="text-blue-600 text-3xl" />
        <div className="ml-3">
          <span className="block text-lg font-bold text-gray-800">
            Hi! {userName || "User Name"}
          </span>
          <span className="block text-sm text-gray-600">
            {user?.email || "user@example.com"}
          </span>
        </div>
      </div>

      {/* Search Bar */}
      {/* <input
        type="text"
        placeholder="Search"
        className="px-4 py-2 border rounded-lg w-1/3"
      /> */}

      {/* Current Date and Logout */}
      <div className="sm:flex items-center space-x-4 hidden ">
        {/* Display Current Date */}
        <p>{currentDate}</p>

        {/* Logout Button */}
        <button onClick={handleLogout} className="p-2 rounded-lg border">
          <FaSignOutAlt />
        </button>
      </div>
    </header>
  );
}
