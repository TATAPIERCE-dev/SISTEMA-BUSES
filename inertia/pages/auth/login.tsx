import React, { useState, useRef } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import { Header } from "@/components/layout/Header";

export default function Login() {
  // Extract redirectTo query parameter for seamless routing return
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const redirectTo = params ? params.get("redirectTo") || "" : "";

  const { data, setData, post, processing, errors } = useForm({
    email: "",
    password: "",
    remember: false,
    redirectTo: redirectTo,
  });

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  // Subtle parallax effect on mouse move (only for desktop sizes)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (imageRef.current && window.innerWidth > 1024) {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 12;
      const y = (clientY / window.innerHeight - 0.5) * 12;
      imageRef.current.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
    }
  };

  const handleMouseLeave = () => {
    if (imageRef.current) {
      imageRef.current.style.transform = "translate(0px, 0px) scale(1.05)";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (processing) {
      return;
    }
    post("/login");
  };

  return (
    <>
      <Head title="TravelEase - Iniciar Sesión" />
      <Header />
      <div
        className="bg-background text-on-background min-h-screen flex items-center justify-center p-0 md:p-6 overflow-hidden font-sans"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <main className="w-full max-w-[1400px] h-screen md:h-[921px] bg-surface-container-lowest flex rounded-none md:rounded-xl overflow-hidden shadow-[0_4_20_rgba(11,28,48,0.08)]">
          {/* Left Side: Chilean Landscape Background */}
          <section className="hidden lg:flex lg:w-3/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
            <img
              ref={imageRef}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out scale-[1.05]"
              alt="Luxury bus on scenic Chilean road"
              src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=85"
            />
            <div className="absolute bottom-12 left-12 z-20 text-white max-w-md animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-black mb-4 text-white leading-tight tracking-tight">
                Descubre Chile con TravelEase
              </h1>
              <p className="text-lg text-white/90 font-light">
                Tu viaje soñado comienza aquí. Confort, puntualidad y las mejores rutas del sur del
                mundo.
              </p>
            </div>
            {/* Branding Overlay */}
            <div className="absolute top-12 left-12 z-20 flex items-center gap-2">
              <span
                className="material-symbols-outlined text-white text-4xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                directions_bus
              </span>
              <span className="text-2xl font-black text-white tracking-tight">TravelEase</span>
            </div>
          </section>

          {/* Right Side: Login Form */}
          <section className="w-full lg:w-2/5 flex flex-col justify-center items-center px-6 md:px-12 bg-surface-container-lowest">
            <div className="w-full max-w-[400px] flex flex-col h-full justify-between py-10">
              {/* Mobile Branding */}
              <div className="lg:hidden flex items-center gap-2 mb-10 justify-center">
                <span
                  className="material-symbols-outlined text-primary text-3xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  directions_bus
                </span>
                <span className="text-2xl font-black text-primary tracking-tight">TravelEase</span>
              </div>

              <div className="my-auto space-y-8">
                <header className="text-center lg:text-left">
                  <h2 className="text-3xl font-bold text-on-surface mb-2 tracking-tight">
                    Bienvenido de nuevo
                  </h2>
                  <p className="text-base text-on-surface-variant font-normal">
                    Ingresa tus credenciales para acceder a tu cuenta.
                  </p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Validation feedback */}
                  {errors.email && (
                    <div className="p-4 bg-error-container text-on-error-container rounded-lg text-sm font-medium border border-error/10 animate-scaleUp">
                      {errors.email}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-on-surface" htmlFor="email">
                      Correo electrónico
                    </label>
                    <div className="relative">
                      <span
                        className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                          emailFocused ? "text-primary" : "text-outline"
                        }`}
                      >
                        mail
                      </span>
                      <input
                        className="w-full pl-10 pr-4 py-3 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface text-base font-normal placeholder:text-outline-variant transition-all outline-none"
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        onFocus={() => setEmailFocused(true)}
                        onBlur={() => setEmailFocused(false)}
                        required
                        disabled={processing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label
                        className="block text-sm font-semibold text-on-surface"
                        htmlFor="password"
                      >
                        Contraseña
                      </label>
                      <a
                        className="text-xs font-semibold text-primary hover:underline transition-all"
                        href="#"
                      >
                        ¿Olvidaste tu contraseña?
                      </a>
                    </div>
                    <div className="relative">
                      <span
                        className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                          passwordFocused ? "text-primary" : "text-outline"
                        }`}
                      >
                        lock
                      </span>
                      <input
                        className="w-full pl-10 pr-4 py-3 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface text-base font-normal placeholder:text-outline-variant transition-all outline-none"
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        onFocus={() => setPasswordFocused(true)}
                        onBlur={() => setPasswordFocused(false)}
                        required
                        disabled={processing}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary transition-all cursor-pointer"
                      id="remember"
                      type="checkbox"
                      checked={data.remember}
                      onChange={(e) => setData("remember", e.target.checked)}
                      disabled={processing}
                    />
                    <label
                      className="text-sm text-on-surface-variant font-medium cursor-pointer"
                      htmlFor="remember"
                    >
                      Recordarme en este dispositivo
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-primary text-white font-semibold text-sm rounded-lg hover:bg-primary-container active:scale-[0.98] transition-all flex justify-center items-center gap-2 shadow-sm disabled:opacity-75 disabled:pointer-events-none"
                    disabled={processing}
                  >
                    <span>{processing ? "Ingresando..." : "Ingresar"}</span>
                    {!processing && (
                      <span className="material-symbols-outlined text-xl">arrow_forward</span>
                    )}
                  </button>
                </form>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-outline-variant"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-surface-container-lowest px-2 text-xs font-semibold text-outline">
                      O continuar con
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-2 py-3 border border-outline-variant rounded-lg hover:bg-surface-container-low transition-all active:scale-[0.98] cursor-pointer">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      ></path>
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      ></path>
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.25.81-.59z"
                        fill="#FBBC05"
                      ></path>
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      ></path>
                    </svg>
                    <span className="text-sm font-semibold text-on-surface">Google</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 py-3 border border-outline-variant rounded-lg hover:bg-surface-container-low transition-all active:scale-[0.98] cursor-pointer">
                    <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                    </svg>
                    <span className="text-sm font-semibold text-on-surface">Facebook</span>
                  </button>
                </div>
              </div>

              <footer className="mt-8 text-center flex flex-col gap-6">
                <p className="text-sm font-normal text-on-surface-variant">
                  ¿No tienes una cuenta?{" "}
                  <Link className="text-primary font-bold hover:underline ml-1" href="/signup">
                    Regístrate
                  </Link>
                </p>
                <p className="text-xs font-semibold text-outline-variant">
                  © 2026 TravelEase. Todos los derechos reservados.
                </p>
              </footer>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
