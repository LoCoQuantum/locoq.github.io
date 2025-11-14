"use client";
import React, { useState, createContext, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FolderOpen, User } from "lucide-react";
import "./globals.css";

const UserRoleContext = createContext(null);

export const useUserRole = () => useContext(UserRoleContext);

export default function Layout({ children }) {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState('Basic'); // Default role

  const handleRoleChange = (e) => {
    setUserRole(e.target.value);
  };


  return (
    <html>
      <body>
        <UserRoleContext.Provider value={{ userRole, setUserRole }}>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#397891] to-slate-900">
            <style>{`
            .glass {
              background: rgba(255, 255, 255, 0.1);
              backdrop-filter: blur(10px);
              border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .glass-card {
              background: rgba(255, 255, 255, 0.05);
              backdrop-filter: blur(20px);
              border: 1px solid rgba(255, 255, 255, 0.1);
            }
          `}</style>

            <div className="flex">
              {/* Sidebar */}
              <aside className="w-20 h-screen fixed left-0 top-0 glass flex flex-col items-center py-8 gap-6">
                <Link href="/" className="mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                    <span className="text-white font-bold text-s">LoCoQ</span>
                  </div>
                </Link>

                <Link href="/" className={`w-12 h-12 rounded-lg flex items-center justify-center ${pathname === "/" ? "bg-white/20" : "hover:bg-white/10"}`}>
                  <Home className="w-6 h-6 text-white" />
                </Link>

                <Link href="/projects" className={`w-12 h-12 rounded-lg flex items-center justify-center ${pathname === "/projects" ? "bg-white/20" : "hover:bg-white/10"}`}>
                  <FolderOpen className="w-6 h-6 text-white" />
                </Link>

                <div className="mt-auto flex flex-col items-center gap-2 w-full px-3">
                  <User className="w-6 h-6 text-white" />
                  <select
                    value={userRole}
                    onChange={handleRoleChange}
                    className="w-full text-xs text-center glass text-white/80 rounded-md p-1 border-white/20 bg-transparent"
                  >
                    <option value="Basic" className="bg-slate-800">Basic</option>
                    <option value="Ultra" className="bg-slate-800">Ultra</option>
                  </select>
                </div>
              </aside>

              {/* Main content */}
              <main className="ml-20 flex-1">
                {children}
              </main>
            </div>
          </div>
        </UserRoleContext.Provider>
      </body>
    </html>
  );
}