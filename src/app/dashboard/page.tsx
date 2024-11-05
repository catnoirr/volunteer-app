// pages/index.js
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth"; // Firebase auth hook
import { auth } from "../../lib/firebaseConfig"; // Import Firebase auth configuration
import Sidebar from "../components/Sidebar"; // Ensure this path is correct
import Header from "../components/Header"; // Ensure this path is correct
import TaskList from "../components/Tasklist"; // Ensure this path is correct

export default function HomePage() {
  const [user] = useAuthState(auth); // Get the authenticated user
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/"); // Redirect to the main page if not logged in
    }
  }, [user, router]); // Run effect when `user` or `router` changes

  // If user is not authenticated, you could also return null or a loading indicator here
  if (!user) return null;

  return (
    <div className="flex flex-col lg:flex-row bg-gray-200 min-h-screen">
      {/* <div className='fixed'><Sidebar  /></div> */}
      <div className="flex-1 flex flex-col">
        <main className="p-5 space-y-4">
          <Header />
          <TaskList />
        </main>
      </div>
    </div>
  );
}
