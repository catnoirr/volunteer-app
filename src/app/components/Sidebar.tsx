'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaHome, FaCalendar, FaComments, FaUserInjured, FaHandsHelping, FaSignOutAlt } from 'react-icons/fa';
import { auth } from '../../lib/firebaseConfig';
import { signOut } from 'firebase/auth';
import Cookies from 'js-cookie';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebaseConfig';

export default function Sidebar() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null); // State to hold user's email

  useEffect(() => {
    if (!loading && !user) {
      router.push('/'); // Redirect to login if not authenticated
    } else if (user) {
      fetchUserData(user.uid); // Use user.uid to fetch data
    }
  }, [user, loading, router]);

  const fetchUserData = async (userId: string) => {
    try {
      console.log("Fetching user data for User ID:", userId);
      const userDocRef = doc(db, 'volunteers', userId); // Use the user's UID as the document ID
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("Fetched user data:", userData);
        setUserName(userData.name);
        setUserEmail(userData.email); // Assuming you have an 'email' field in Firestore
      } else {
        console.error("No document found with the specified ID:", userId);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Cookies.remove('authToken');
      router.push('/');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="relative flex flex-col justify-between">
      {/* Icons-only bar on smaller screens */}
      <div className="flex justify-around py-4 bg-white shadow-md md:hidden rounded-3xl mt-4 border">
        <button onClick={() => router.push('/dashboard')} className="text-blue-600">
          <FaHome size={24} />
        </button>
        <button onClick={() => router.push('/patients')} className="text-blue-600">
          <FaUserInjured size={24} />
        </button>
        <button onClick={() => router.push('/volunteers')} className="text-blue-600">
          <FaHandsHelping size={24} />
        </button>
        <button onClick={() => router.push('/admin')} className="text-blue-600 hidden md:block">
          <FaCalendar size={24} />
        </button>
        <button onClick={() => router.push('/chat')} className="text-blue-600">
          <FaComments size={24} />
        </button>
        <button onClick={handleLogout} className="text-blue-600">
          <FaSignOutAlt size={24} />
        </button>
      </div>

      {/* Full Sidebar for larger screens */}
      <div className="hidden md:flex flex-col w-64 bg-white p-6 shadow-2xl rounded-3xl m-5">
      <div className="flex items-center mb-4">
  <FaUserInjured className="text-blue-600 text-5xl" />
  <div className="ml-4">
    <span className="block text-xl font-bold text-gray-800">{userName || 'User Name'}</span>
    <span className="block text-sm text-gray-600">{userEmail || 'user@example.com'}</span>
  </div>
</div>

        {/* Displaying User Email directly below User Name */}
        

        <div>
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center w-full text-gray-700 hover:text-blue-600 py-3 rounded-lg transition-colors duration-200"
          >
            <FaHome className="mr-3 text-blue-600" />
            <span className="text-lg font-medium">Dashboard</span>
          </button>
        </div>

        <div className="mt-10">
          <h3 className="text-gray-500 uppercase text-xs font-semibold mb-3">Apps</h3>
          <div
            className="flex items-center py-2 text-gray-700 hover:text-blue-600 cursor-pointer rounded-lg transition-colors duration-200"
            onClick={() => router.push('/patients')}
          >
            <FaUserInjured className="mr-3 text-blue-600" />
            <span className="text-lg font-medium">Patients</span>
          </div>
          <div
            className="flex items-center py-2 text-gray-700 hover:text-blue-600 cursor-pointer rounded-lg transition-colors duration-200"
            onClick={() => router.push('/volunteers')}
          >
            <FaHandsHelping className="mr-3 text-blue-600" />
            <span className="text-lg font-medium">Volunteers</span>
          </div>
          <div
            className="flex items-center py-2 text-gray-700 hover:text-blue-600 cursor-pointer rounded-lg transition-colors duration-200"
            onClick={() => router.push('/chat')}
          >
            <FaComments className="mr-3 text-blue-600" />
            <span className="text-lg font-medium">Chat</span>
          </div>
        </div>

        <div className="md:mt-32">
          <button
            onClick={handleLogout}
            className="flex items-center w-full text-gray-700 hover:text-blue-600 py-3 rounded-lg transition-colors duration-200"
          >
            <FaSignOutAlt className="mr-3 text-blue-600" />
            <span className="text-lg font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
