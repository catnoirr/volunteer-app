// pages/index.js
"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../lib/firebaseConfig";
import Header from "../components/Header";
import TaskList from "../components/Tasklist";

export default function HomePage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const pathname = usePathname(); // Get the current path
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (user && pathname === "/") {
        // Redirect to dashboard if the user is authenticated and on the main page
        router.push("/dashboard");
      } else if (!user && !isRedirecting) {
        // Redirect to the main page if the user is not authenticated
        setIsRedirecting(true);
        router.push("/");
      }
    }
  }, [user, loading, router, pathname, isRedirecting]);

  if (loading || isRedirecting) return null;

  return (
    <div className="flex flex-col lg:flex-row bg-gray-200 min-h-screen">
      <div className="flex-1 flex flex-col">
        <main className="p-5 space-y-4">
          <Header />
          <TaskList />
        </main>
      </div>
    </div>
  );
}
