// components/TaskList.tsx
"use client"
import { FaEye, FaCheck } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db ,auth } from "../../lib/firebaseConfig"; // Adjust the import path as necessary
import { onAuthStateChanged } from 'firebase/auth';

// Define the structure of a Task
interface Task {
  id: string;
  name: string;
  admin: string;
  status: 'Done' | 'In Progress'; // Define possible statuses
  volunteerUID: string;
}

// Define the structure of a Volunteer
interface Volunteer {
  uid: string;
  requestedUsers: string[]; // Array of user UIDs
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userUID, setUserUID] = useState<string | null>(null);
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserUID(user.uid);

        // Fetch the volunteer data where requestedUsers contains the user's UID
        const volunteersQuery = query(
          collection(db, 'volunteers'),
          where('requestedUsers', 'array-contains', user.uid)
        );

        const volunteerSnapshot = await getDocs(volunteersQuery);
        const volunteerData = volunteerSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() })) as Volunteer[];

        if (volunteerData.length > 0) {
          setVolunteer(volunteerData[0]); // Assuming you want the first matching volunteer
          // Fetch tasks for the current volunteer
          const tasksQuery = query(
            collection(db, 'tasks'),
            where('volunteerUID', '==', volunteerData[0].uid)
          );

          const taskSnapshot = await getDocs(tasksQuery);
          const tasksData = taskSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Task[];
          setTasks(tasksData);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-5 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Last Tasks</h2>
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">{tasks.length} total, proceed to resolve them</p>
        <div className="flex space-x-6">
          <div className="text-center">
            <span className="block text-3xl font-bold text-green-500">
              {tasks.filter(task => task.status === 'Done').length}
            </span>
            <span className="text-gray-500">Done</span>
          </div>
          <div className="text-center">
            <span className="block text-3xl font-bold text-blue-500">
              {tasks.filter(task => task.status === 'In Progress').length}
            </span>
            <span className="text-gray-500">In Progress</span>
          </div>
        </div>
      </div>
      <table className="w-full border-t border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">Admin</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
            <th className="text-center py-3 px-4 font-medium text-gray-600">Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="border-t hover:bg-gray-50">
              <td className="py-3 px-4">{task.name}</td>
              <td className="py-3 px-4">{task.admin}</td>
              <td className="py-3 px-4">
                <span className={task.status === 'Done' ? 'text-green-500 font-semibold' : 'text-blue-500 font-semibold'}>
                  {task.status}
                </span>
              </td>
              <td className="py-3 px-4 text-center space-x-4">
                <button className="text-gray-500 hover:text-gray-700">
                  <FaEye />
                </button>
                {task.status !== 'Done' && (
                  <button className="text-green-500 hover:text-green-700">
                    <FaCheck />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
