// pages/index.js
import Sidebar from '../components/Sidebar'; // Ensure this path is correct
import Header from '../components/Header'; // Ensure this path is correct
import TaskList from '../components/Tasklist'; // Ensure this path is correct

export default function HomePage() {
  return (
    <div className="flex flex-col lg:flex-row bg-gray-200 min-h-screen">
      <Sidebar  />
      <div className="flex-1 flex flex-col  ">
       
        <main className="p-5 space-y-4">
        <Header />
          <TaskList />
        </main>
      </div>
    </div>
  );
}
