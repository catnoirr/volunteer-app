// components/TaskList.js
import { FaEye, FaCheck } from 'react-icons/fa';

export default function TaskList() {
  return (
    <div className="p-5 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Last Tasks</h2>
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">117 total, proceed to resolve them</p>
        <div className="flex space-x-6">
          <div className="text-center">
            <span className="block text-3xl font-bold text-green-500">94</span>
            <span className="text-gray-500">Done</span>
          </div>
          <div className="text-center">
            <span className="block text-3xl font-bold text-blue-500">23</span>
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
          <tr className="border-t hover:bg-gray-50">
            <td className="py-3 px-4">Client Onboarding - Circle</td>
            <td className="py-3 px-4">Samanta J.</td>
            <td className="py-3 px-4">
              <span className="text-blue-500 font-semibold">In Progress</span>
            </td>
            <td className="py-3 px-4 text-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <FaEye />
              </button>
              <button className="text-green-500 hover:text-green-700">
                <FaCheck />
              </button>
            </td>
          </tr>
          <tr className="border-t hover:bg-gray-50">
            <td className="py-3 px-4">Meeting with Webflow & Notion</td>
            <td className="py-3 px-4">Bob P.</td>
            <td className="py-3 px-4">
              <span className="text-green-500 font-semibold">Done</span>
            </td>
            <td className="py-3 px-4 text-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <FaEye />
              </button>
              <button className="text-green-500 hover:text-green-700">
                <FaCheck />
              </button>
            </td>
          </tr>
          <tr className="border-t hover:bg-gray-50">
            <td className="py-3 px-4">First Handoff with Engineers</td>
            <td className="py-3 px-4">Kate O.</td>
            <td className="py-3 px-4">
              <span className="text-blue-500 font-semibold">In Progress</span>
            </td>
            <td className="py-3 px-4 text-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <FaEye />
              </button>
              <button className="text-green-500 hover:text-green-700">
                <FaCheck />
              </button>
            </td>
          </tr>
          <tr className="border-t hover:bg-gray-50">
            <td className="py-3 px-4">Client Drafting (2) with Lawrence</td>
            <td className="py-3 px-4">Jack F.</td>
            <td className="py-3 px-4">
              <span className="text-blue-500 font-semibold">In Progress</span>
            </td>
            <td className="py-3 px-4 text-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <FaEye />
              </button>
              <button className="text-green-500 hover:text-green-700">
                <FaCheck />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
