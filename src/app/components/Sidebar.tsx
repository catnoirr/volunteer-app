// components/Sidebar.js
import { FaBell, FaRegListAlt, FaCheckCircle, FaComments } from 'react-icons/fa';

export default function Sidebar() {
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
    </div>
  );
}
