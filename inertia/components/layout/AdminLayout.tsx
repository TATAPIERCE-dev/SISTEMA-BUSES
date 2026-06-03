import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
  onOpenRegisterModal?: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, onOpenRegisterModal }) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900 font-sans antialiased overflow-hidden">
      <aside className="h-screen w-64 fixed left-0 top-0 bg-white border-r border-gray-200 flex flex-col py-4 px-4 gap-2 z-[60] shrink-0 hidden lg:flex">
        <div className="mb-8 px-2 mt-4">
          <Link
            href="/"
            className="text-lg font-bold text-blue-600 flex items-center gap-2 cursor-pointer hover:opacity-90"
          >
            <span className="text-2xl">🚌</span>
            <span>Fleet Manager</span>
          </Link>
          <p className="text-xs text-gray-500 font-medium tracking-wide">Voyage Pro Systems</p>
        </div>

        <nav className="flex-1 flex flex-col gap-1.5">
          {[
            { label: "Home", icon: "🏠", path: "/" },
            { label: "Fleet", icon: "🚌", path: "/admin/fleet" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all cursor-pointer",
                item.path === "/admin/fleet"
                  ? "bg-blue-100 text-blue-700 font-bold"
                  : "text-gray-500 hover:bg-gray-100 hover:text-blue-600",
              )}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto border-t border-gray-200 pt-4 flex flex-col gap-1 mb-4">
          <button
            onClick={() => onOpenRegisterModal?.()}
            className="w-full mb-4 bg-blue-600 text-white px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-blue-700"
          >
            <span>➕</span>
            <span className="text-sm">Register New Bus</span>
          </button>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 text-gray-500 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            <span>🚪</span>
            <span className="text-sm">Sign Out</span>
          </Link>
        </div>
      </aside>

      <div className="flex-1 lg:ml-64 flex flex-col h-screen overflow-hidden">
        <header className="flex justify-between items-center w-full px-4 md:px-8 h-16 bg-white border-b border-gray-200 shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/fleet"
              className="text-lg font-bold text-blue-600 flex items-center gap-1.5 cursor-pointer hover:opacity-90"
            >
              <span className="text-2xl lg:hidden">🚌</span>
              <span>Voyage Pro</span>
            </Link>
            <nav className="hidden md:flex gap-6 ml-8">
              <Link
                href="/admin/fleet"
                className="text-sm cursor-pointer text-blue-600 border-b-2 border-blue-600 pb-1 font-bold"
              >
                Flota
              </Link>
              <Link
                href="/admin/configurator"
                className="text-sm cursor-pointer text-gray-500 hover:text-blue-600 pb-1 border-b-2 border-transparent"
              >
                Configurador
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden lg:block">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Buscar vehículo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-100 border border-gray-200 rounded-full pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <button
              onClick={() => alert("Sin notificaciones")}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative"
            >
              🔔<span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
            </button>
            <button
              onClick={() => alert("Admin: John Doe")}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
            >
              👤
            </button>
          </div>
        </header>
        <div className="flex-grow overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
