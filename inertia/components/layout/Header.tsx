import React from "react";
import { router, usePage, Link } from "@inertiajs/react";
import { ArrowLeft, HelpCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  isSeatsPage?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isSeatsPage = false }) => {
  const { props, url } = usePage<{ user?: { fullName: string | null; email: string } }>();
  const { user } = props;

  const getInitials = () => {
    if (!user) {
      return "";
    }
    if (user.fullName) {
      const parts = user.fullName.split(" ");
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return parts[0].slice(0, 2).toUpperCase();
    }
    return user.email.slice(0, 2).toUpperCase();
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    router.post("/logout");
  };

  const isHomeActive = !url || url === "/" || url === "";
  const isBookingsActive = url ? url.startsWith("/bookings") : false;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 w-full sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-4 md:px-8 h-20 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 md:gap-8">
          {isSeatsPage && (
            <Link
              href="/"
              aria-label="Volver atrás"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center text-blue-600 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          )}

          <Link
            href="/"
            className="text-2xl font-black text-blue-600 tracking-tight cursor-pointer hover:opacity-90 transition-opacity"
          >
            TravelEase
          </Link>

          {!isSeatsPage && (
            <nav className="hidden md:flex gap-8 items-center">
              <Link
                href="/"
                className={`text-base cursor-pointer transition-all duration-200 font-semibold ${
                  isHomeActive
                    ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                    : "text-gray-500 hover:text-blue-600"
                }`}
              >
                Inicio
              </Link>
              <Link
                href="/bookings"
                className={`text-base cursor-pointer transition-all duration-200 font-semibold ${
                  isBookingsActive
                    ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                    : "text-gray-500 hover:text-blue-600"
                }`}
              >
                Mis Reservas
              </Link>
              <Link
                href="/help"
                className={`text-base cursor-pointer transition-all duration-200 font-semibold ${
                  url === "/help"
                    ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                    : "text-gray-500 hover:text-blue-600"
                }`}
              >
                Ayuda
              </Link>
            </nav>
          )}
        </div>

        {isSeatsPage ? (
          <>
            <div className="hidden md:flex items-center gap-2 animate-fadeIn">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <span className="text-sm text-blue-600 font-bold">Selección</span>
              </div>
              <div className="w-8 h-px bg-gray-200"></div>
              <div className="flex items-center gap-2 opacity-60">
                <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <span className="text-sm text-gray-500 font-medium">Datos</span>
              </div>
              <div className="w-8 h-px bg-gray-200"></div>
              <div className="flex items-center gap-2 opacity-60">
                <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <span className="text-sm text-gray-500 font-medium">Pago</span>
              </div>
            </div>
            <div>
              <Link href="/help" target="_blank" rel="noopener noreferrer">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 font-semibold hover:underline flex items-center gap-1.5"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Ayuda</span>
                </Button>
              </Link>
            </div>
          </>
        ) : user ? (
          <div className="flex items-center gap-4 animate-fadeIn">
            <Link
              href="/bookings"
              className={`text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                isBookingsActive ? "text-blue-600" : "text-gray-500 hover:text-blue-600"
              }`}
            >
              <span className="material-symbols-outlined text-xl">confirmation_number</span>
              <span className="hidden sm:inline">Mis Reservas</span>
            </Link>
            <div className="w-px h-6 bg-gray-200"></div>
            <div className="flex items-center gap-2 md:gap-3">
              <div
                title={user.fullName || user.email}
                className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 text-blue-600 font-black text-xs flex items-center justify-center select-none cursor-pointer"
              >
                {getInitials()}
              </div>
              <span className="text-sm font-bold text-gray-700 hidden md:inline max-w-[120px] truncate select-none">
                {user.fullName || user.email.split("@")[0]}
              </span>
              <button
                onClick={handleLogout}
                title="Cerrar Sesión"
                className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-600 transition-all active:scale-95 cursor-pointer flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-xl">logout</span>
              </button>
            </div>
          </div>
        ) : (
          <Link
            href="/login"
            className="text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1.5 font-bold animate-fadeIn h-9 px-4 rounded-md text-xs hover:bg-gray-100 transition-all duration-200 cursor-pointer"
          >
            <User className="w-4 h-4" />
            <span>Ingresar</span>
          </Link>
        )}
      </div>
    </header>
  );
};
