// components/Sidebar.tsx
"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaBell, FaRegListAlt, FaCheckCircle, FaComments, FaSignOutAlt } from 'react-icons/fa';
import { auth } from "../../lib/firebaseConfig"; // Adjust the import path as necessary
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function Sidebar() {
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        router.push('/'); // Redirect to login page if not authenticated
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/'); // Redirect to the main page after logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Optionally show a loading state
  }

  return (
    <div className="w-64 h-screen bg-gray-100 p-5 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-6">NGO</h1>
        <nav className="space-y-2">
          <a href="#" className="flex items-center space-x-3 p-2 rounded-lg bg-blue-500 text-white">
            <FaRegListAlt /> <span>Task List</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-2 rounded-lg">
            <FaCheckCircle /> <span>Completed</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-2 rounded-lg">
            <FaBell /> <span>Notification</span>
            <span className="ml-auto text-sm bg-green-200 text-green-800 rounded-full px-2">2</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-2 rounded-lg">
            <FaComments /> <span>Chat</span>
          </a>
        </nav>
      </div>
      <div className="flex items-center space-x-3 mt-10">
        <img src="/volunteer.jpg" alt="Profile" className="w-10 h-10 rounded-full" />
        <div>
          <p className="text-sm font-semibold">Emily Jonson</p>
          <p className="text-xs text-gray-500">jonson@bress.com</p>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center space-x-2 p-2 mt-4 rounded-lg hover:bg-red-500 text-red-700"
      >
        <FaSignOutAlt />
        <span>Logout</span>
      </button>
    </div>
  );
}
