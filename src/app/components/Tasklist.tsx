"use client";
import { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from "../../lib/firebaseConfig"; // Adjust the import path as necessary
import { FaCheck, FaEye } from 'react-icons/fa'; // Import eye and check icons
import Modal from './Modal'; // Import the Modal component
import { auth } from '../../lib/firebaseConfig'; // Import auth to access current user
import { useAuthState } from 'react-firebase-hooks/auth'; // Import for user state

// Define the structure of a Request
interface Request {
  id: string; // Document ID in the requests collection
  name: string;
  email: string;
  status: string;
  details: string;
}

export default function VolunteerList() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [user] = useAuthState(auth); // Get current user

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user) return; // Exit if user is not logged in

      try {
        // Fetch the logged-in user's volunteer data
        const volunteerDocRef = doc(db, 'volunteers', user.uid);
        const volunteerDoc = await getDoc(volunteerDocRef);

        // Ensure the document exists
        if (!volunteerDoc.exists()) {
          throw new Error("Volunteer document not found.");
        }

        const volunteerData = volunteerDoc.data();
        const requestedUserIDs: string[] = volunteerData.requestedUsers || [];

        // Fetch requests for the requested user IDs
        const requestsData: Request[] = [];
        for (const userId of requestedUserIDs) {
          const requestDoc = await getDoc(doc(db, 'requests', userId));
          if (requestDoc.exists()) {
            const requestData = {
              id: requestDoc.id,
              ...requestDoc.data(),
            } as Request;
            requestsData.push(requestData);
          }
        }

        setRequests(requestsData);
      } catch (error) {
        console.error("Error fetching requests:", error);
        setErrorMessage("Failed to load request data.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests(); // Fetch requests on component mount or user change
  }, [user]); // Depend on user to re-fetch if user state changes

  const markAsCompleted = async (requestId: string) => {
    try {
      const requestDocRef = doc(db, 'requests', requestId);
      await updateDoc(requestDocRef, { status: 'Completed' });

      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === requestId ? { ...request, status: 'Completed' } : request
        )
      );
    } catch (error) {
      console.error("Error updating request status:", error);
      setErrorMessage("Failed to update request status.");
    }
  };

  const openModal = (request: Request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  return (
    <div className="p-5 bg-white shadow-lg rounded-3xl">
      <h2 className="text-2xl font-semibold mb-6">Your Volunteer Requests</h2>

      {loading ? (
        <p className="text-gray-600">Loading request information...</p>
      ) : errorMessage ? (
        <p className="text-red-500">{errorMessage}</p>
      ) : (
        <>
          {/* Table for larger screens */}
          <div className="hidden lg:block">
            <table className="w-full border-t border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4">{request.name}</td>
                    <td className="py-3 px-4">{request.email}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`${
                          request.status === 'Completed' ? 'text-green-500' : 'text-blue-500'
                        } font-semibold`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => openModal(request)}
                        className="text-gray-600 hover:text-gray-800"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      {request.status !== 'Completed' && (
                        <button
                          onClick={() => markAsCompleted(request.id)}
                          className="text-green-500 hover:text-green-700 ml-2"
                          title="Mark as Completed"
                        >
                          <FaCheck />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Grid for smaller screens */}
          <div className=" lg:hidden grid grid-cols-1 gap-4">
            {requests.map((request) => (
              <div key={request.id} className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100">
                <h3 className="font-semibold">{request.name}</h3>
                <p>Email: {request.email}</p>
                <p>Status: <span className={request.status === 'Completed' ? 'text-green-500' : 'text-blue-500'}>{request.status}</span></p>
                <div className="flex justify-between mt-2">
                  <button onClick={() => openModal(request)} className="text-white hover:text-gray-800 border p-2 rounded-lg bg-blue-400 ">
                     View Details
                  </button>
                  {request.status !== 'Completed' && (
                    <button onClick={() => markAsCompleted(request.id)} className="  hover:text-green-700 border p-3 rounded-lg bg-green-300">
                       Mark as Completed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Request Details">
        {selectedRequest && (
          <div>
            <p><strong>Name:</strong> {selectedRequest.name}</p>
            <p><strong>Email:</strong> {selectedRequest.email}</p>
            <p><strong>Status:</strong> {selectedRequest.status}</p>
            <p><strong>Details:</strong> {selectedRequest.details}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
