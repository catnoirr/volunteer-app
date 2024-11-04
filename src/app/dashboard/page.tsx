// pages/index.js
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import TaskList from '../components/Tasklist';

export default function HomePage() {
  return (
    <div className="flex bg-gray-200 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-5 space-y-4">
          <TaskList />
        </main>
      </div>
    </div>
  );
}
