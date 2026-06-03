import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-auto w-full py-12 px-4 md:px-8">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-6 md:gap-0">
        <div className="text-lg font-bold text-gray-900">TravelEase</div>
        <nav className="flex flex-wrap justify-center gap-6">
          <a className="text-sm text-gray-500 hover:underline cursor-pointer">
            Términos del Servicio
          </a>
          <a className="text-sm text-gray-500 hover:underline cursor-pointer">
            Política de Privacidad
          </a>
          <a className="text-sm text-gray-500 hover:underline cursor-pointer">Socios Comerciales</a>
          <a className="text-sm text-gray-500 hover:underline cursor-pointer">Centro de Soporte</a>
        </nav>
        <div className="text-sm text-gray-500">© 2024 TravelEase Global</div>
      </div>
    </footer>
  );
};
