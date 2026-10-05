import React, { useState, useRef } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import { Header } from "@/components/layout/Header";

// Check Chilean RUT checksum and format
function validateRut(rut: string): boolean {
  if (!/^\d{7,8}-[\dKk]$/.test(rut)) {
    return false;
  }

  const cleanRut = rut.replace(/[^0-9kK]/g, "");
  const body = cleanRut.slice(0, -1);
  const dv = cleanRut.slice(-1).toUpperCase();

  let sum = 0;
  let mul = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body.charAt(i), 10) * mul;
    mul = mul === 7 ? 2 : mul + 1;
  }

  const res = sum % 11;
  const computedDv = res === 1 ? "K" : res === 0 ? "0" : (11 - res).toString();

  return dv === computedDv;
}

export default function Signup() {
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const redirectTo = params ? params.get("redirectTo") || "" : "";

  const { data, setData, post, processing, errors } = useForm({
    fullName: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    documentType: "RUT",
    documentNumber: "",
    phoneNumber: "+569", // Prefilled with +569
    gender: "Masculino",
    emergencyPhone: "",
    redirectTo: redirectTo,
  });

  const [clientErrors, setClientErrors] = useState<{
    fullName?: string;
    email?: string;
    documentNumber?: string;
    phoneNumber?: string;
    emergencyPhone?: string;
  }>({});

  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [docNumberFocused, setDocNumberFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [emergencyFocused, setEmergencyFocused] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);

  // Live validator for fields
  const validateField = (field: string, value: string) => {
    setClientErrors((prev) => {
      const next = { ...prev };

      if (field === "fullName") {
        if (value.trim().length < 3) {
          next.fullName = "El nombre debe tener al menos 3 caracteres.";
        } else {
          delete next.fullName;
        }
      }

      if (field === "email") {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          next.email = "El correo electrónico no es válido.";
        } else {
          delete next.email;
        }
      }

      if (field === "documentNumber") {
        if (data.documentType === "RUT") {
          if (!validateRut(value)) {
            next.documentNumber =
              "El RUT no es válido. Formato requerido: 11111111-1 (sin puntos y con guion).";
          } else {
            delete next.documentNumber;
          }
        } else {
          if (!/^[A-Za-z]{2}\d{6}$/.test(value)) {
            next.documentNumber =
              "El pasaporte debe tener el formato AB123456 (2 letras y 6 números).";
          } else {
            delete next.documentNumber;
          }
        }
      }

      if (field === "phoneNumber") {
        if (value.length !== 12) {
          next.phoneNumber = "Debe tener exactamente 8 dígitos tras el +569.";
        } else {
          delete next.phoneNumber;
        }
      }

      if (field === "emergencyPhone") {
        if (value && value.length !== 12) {
          next.emergencyPhone = "Debe tener exactamente 8 dígitos tras el +569.";
        } else {
          delete next.emergencyPhone;
        }
      }

      return next;
    });
  };

  const handlePhoneChange = (field: "phoneNumber" | "emergencyPhone", value: string) => {
    const isEmergency = field === "emergencyPhone";

    // Allow empty for optional emergency contact
    if (
      isEmergency &&
      (value === "" || value === "+" || value === "+5" || value === "+56" || value === "+569")
    ) {
      setData(field, "");
      setClientErrors((prev) => {
        const next = { ...prev };
        delete next.emergencyPhone;
        return next;
      });
      return;
    }

    let formatted = value;
    if (!value.startsWith("+569")) {
      const numbers = value.replace(/\D/g, "");
      if (numbers.startsWith("569")) {
        formatted = `+569${numbers.slice(3).slice(0, 8)}`;
      } else {
        formatted = `+569${numbers.slice(0, 8)}`;
      }
    } else {
      const suffix = value.slice(4).replace(/\D/g, "").slice(0, 8);
      formatted = `+569${suffix}`;
    }

    setData(field, formatted);
    validateField(field, formatted);
  };

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

    // Execute validation on all fields before submitting
    const errs: typeof clientErrors = {};
    if (data.fullName.trim().length < 3) {
      errs.fullName = "El nombre debe tener al menos 3 caracteres.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errs.email = "El correo electrónico no es válido.";
    }
    if (data.documentType === "RUT") {
      if (!validateRut(data.documentNumber)) {
        errs.documentNumber =
          "El RUT no es válido. Formato requerido: 11111111-1 (sin puntos y con guion).";
      }
    } else {
      if (!/^[A-Za-z]{2}\d{6}$/.test(data.documentNumber)) {
        errs.documentNumber = "El pasaporte debe tener el formato AB123456 (2 letras y 6 números).";
      }
    }
    if (data.phoneNumber.length !== 12) {
      errs.phoneNumber = "Debe tener exactamente 8 dígitos tras el +569.";
    }
    if (data.emergencyPhone && data.emergencyPhone.length !== 12) {
      errs.emergencyPhone = "Debe tener exactamente 8 dígitos tras el +569.";
    }

    setClientErrors(errs);
    if (Object.keys(errs).length > 0) {
      return;
    }

    if (processing) {
      return;
    }
    post("/signup");
  };

  return (
    <>
      <Head title="TravelEase - Crear Cuenta" />
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
              alt="Scenic Patagonia landscape with high-end transport"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCb0W95JLr-OngASQEhiXJl894gQDw65K5Lou5-_5sIKHUHMs_u-tSmCfiZAJIS6mdd_-0EF8Vb3AfnlE1rUuOEFeZ4Z2LbJtcEVN9PsrYCRJrhI1Ekp-GGDt8Wbuv2_-GUp0F4DMQ-AS3L4kOA_wEEYpxdUGbJFnjn5J55J_8LDn5DsCLHvREjZFvdrKu3RvbdxT9xb8emmxzEN80Ar3nI6227XApLtErTL7gv1ljpXtVU20pZFL2gzVOsW-J3upKZh-QKdFhdmce_"
            />
            <div className="absolute bottom-12 left-12 z-20 text-white max-w-md animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-black mb-4 text-white leading-tight tracking-tight">
                Viaja Inteligente con TravelEase
              </h1>
              <p className="text-lg text-white/90 font-light">
                Regístrate hoy para acumular millas, recibir ofertas personalizadas y autocompletar
                todas tus reservas al instante.
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

          {/* Right Side: Signup Form */}
          <section className="w-full lg:w-2/5 flex flex-col justify-center items-center px-6 md:px-12 bg-surface-container-lowest overflow-y-auto">
            <div className="w-full max-w-[400px] flex flex-col h-full justify-between py-6">
              {/* Mobile Branding */}
              <div className="lg:hidden flex items-center gap-2 mb-6 justify-center">
                <span
                  className="material-symbols-outlined text-primary text-3xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  directions_bus
                </span>
                <span className="text-2xl font-black text-primary tracking-tight">TravelEase</span>
              </div>

              <div className="my-auto space-y-5">
                <header className="text-center lg:text-left">
                  <h2 className="text-2xl font-black text-on-surface mb-1 tracking-tight">
                    Crear mi cuenta
                  </h2>
                  <p className="text-xs text-on-surface-variant font-bold">
                    Regístrate con tus datos de forma manual
                  </p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {/* General / Validation Error feedback */}
                  {errors.email && (
                    <div className="p-3 bg-error-container text-on-error-container rounded-xl text-xs font-bold border border-error/15 animate-scaleUp">
                      {errors.email}
                    </div>
                  )}

                  {/* Nombre completo */}
                  <div className="space-y-1">
                    <label
                      className="block text-[11px] font-bold text-on-surface px-1"
                      htmlFor="fullName"
                    >
                      Tu nombre
                    </label>
                    <div className="relative">
                      <span
                        className={`material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 text-base ${
                          nameFocused ? "text-primary" : "text-outline"
                        }`}
                      >
                        person
                      </span>
                      <input
                        className="w-full pl-10 pr-10 py-3 bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary/20 text-on-surface text-xs font-semibold placeholder:text-outline-variant transition-all outline-none"
                        id="fullName"
                        type="text"
                        placeholder="Tu nombre completo"
                        value={data.fullName}
                        onChange={(e) => {
                          setData("fullName", e.target.value);
                          validateField("fullName", e.target.value);
                        }}
                        onFocus={() => {
                          setNameFocused(true);
                        }}
                        onBlur={() => {
                          setNameFocused(false);
                        }}
                        required
                        disabled={processing}
                      />
                      {data.fullName && !clientErrors.fullName && (
                        <span className="material-symbols-outlined text-green-500 absolute right-3.5 top-1/2 -translate-y-1/2 text-lg font-black animate-scaleUp">
                          check_circle
                        </span>
                      )}
                    </div>
                    {clientErrors.fullName && (
                      <p className="text-[10px] text-error font-bold mt-1 px-3.5 animate-scaleUp">
                        {clientErrors.fullName}
                      </p>
                    )}
                  </div>

                  {/* RUT o Pasaporte Dropdown */}
                  <div className="space-y-1">
                    <label
                      className="block text-[11px] font-bold text-on-surface px-1"
                      htmlFor="documentType"
                    >
                      Tipo de documento
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-base">
                        badge
                      </span>
                      <select
                        className="w-full pl-10 pr-10 py-3 bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary/20 text-on-surface text-xs font-bold transition-all outline-none appearance-none cursor-pointer"
                        id="documentType"
                        value={data.documentType}
                        onChange={(e) => {
                          setData({
                            ...data,
                            documentType: e.target.value,
                            documentNumber: "",
                          });
                          setClientErrors((prev) => {
                            const next = { ...prev };
                            delete next.documentNumber;
                            return next;
                          });
                        }}
                        disabled={processing}
                      >
                        <option value="RUT">RUT</option>
                        <option value="Pasaporte">Pasaporte</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none">
                        expand_more
                      </span>
                    </div>
                  </div>

                  {/* Número de documento */}
                  <div className="space-y-1">
                    <label
                      className="block text-[11px] font-bold text-on-surface px-1"
                      htmlFor="documentNumber"
                    >
                      RUT o Pasaporte
                    </label>
                    <div className="relative">
                      <span
                        className={`material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 text-base ${
                          docNumberFocused ? "text-primary" : "text-outline"
                        }`}
                      >
                        fingerprint
                      </span>
                      <input
                        className="w-full pl-10 pr-10 py-3 bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary/20 text-on-surface text-xs font-semibold placeholder:text-outline-variant transition-all outline-none"
                        id="documentNumber"
                        type="text"
                        placeholder={
                          data.documentType === "RUT" ? "11111111-1" : "Número de Pasaporte"
                        }
                        value={data.documentNumber}
                        onChange={(e) => {
                          const val =
                            data.documentType === "Pasaporte"
                              ? e.target.value.toUpperCase()
                              : e.target.value;
                          setData("documentNumber", val);
                          validateField("documentNumber", val);
                        }}
                        onFocus={() => {
                          setDocNumberFocused(true);
                        }}
                        onBlur={() => {
                          setDocNumberFocused(false);
                        }}
                        maxLength={data.documentType === "Pasaporte" ? 8 : 10}
                        required
                        disabled={processing}
                      />
                      {data.documentNumber && !clientErrors.documentNumber && (
                        <span className="material-symbols-outlined text-green-500 absolute right-3.5 top-1/2 -translate-y-1/2 text-lg font-black animate-scaleUp">
                          check_circle
                        </span>
                      )}
                    </div>
                    {clientErrors.documentNumber && (
                      <p className="text-[10px] text-error font-bold mt-1 px-3.5 animate-scaleUp">
                        {clientErrors.documentNumber}
                      </p>
                    )}
                  </div>

                  {/* Correo electrónico */}
                  <div className="space-y-1">
                    <label
                      className="block text-[11px] font-bold text-on-surface px-1"
                      htmlFor="email"
                    >
                      Tu correo electrónico
                    </label>
                    <div className="relative">
                      <span
                        className={`material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 text-base ${
                          emailFocused ? "text-primary" : "text-outline"
                        }`}
                      >
                        mail
                      </span>
                      <input
                        className="w-full pl-10 pr-10 py-3 bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary/20 text-on-surface text-xs font-semibold placeholder:text-outline-variant transition-all outline-none"
                        id="email"
                        type="email"
                        placeholder="tu@correo.com"
                        value={data.email}
                        onChange={(e) => {
                          setData("email", e.target.value);
                          validateField("email", e.target.value);
                        }}
                        onFocus={() => {
                          setEmailFocused(true);
                        }}
                        onBlur={() => {
                          setEmailFocused(false);
                        }}
                        required
                        disabled={processing}
                      />
                      {data.email && !clientErrors.email && !errors.email && (
                        <span className="material-symbols-outlined text-green-500 absolute right-3.5 top-1/2 -translate-y-1/2 text-lg font-black animate-scaleUp">
                          check_circle
                        </span>
                      )}
                    </div>
                    {clientErrors.email && (
                      <p className="text-[10px] text-error font-bold mt-1 px-3.5 animate-scaleUp">
                        {clientErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Número telefónico */}
                  <div className="space-y-1">
                    <label
                      className="block text-[11px] font-bold text-on-surface px-1"
                      htmlFor="phoneNumber"
                    >
                      Tu número telefónico
                    </label>
                    <div className="relative">
                      <span
                        className={`material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 text-base ${
                          phoneFocused ? "text-primary" : "text-outline"
                        }`}
                      >
                        call
                      </span>
                      <span className="absolute left-[38px] top-1/2 -translate-y-1/2 text-xs select-none pointer-events-none">
                        🇨🇱
                      </span>
                      <input
                        className="w-full pl-[62px] pr-10 py-3 bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary/20 text-on-surface text-xs font-semibold placeholder:text-outline-variant transition-all outline-none"
                        id="phoneNumber"
                        type="tel"
                        value={data.phoneNumber}
                        onChange={(e) => {
                          handlePhoneChange("phoneNumber", e.target.value);
                        }}
                        onFocus={() => {
                          setPhoneFocused(true);
                        }}
                        onBlur={() => {
                          setPhoneFocused(false);
                        }}
                        required
                        disabled={processing}
                      />
                      {data.phoneNumber && !clientErrors.phoneNumber && (
                        <span className="material-symbols-outlined text-green-500 absolute right-3.5 top-1/2 -translate-y-1/2 text-lg font-black animate-scaleUp">
                          check_circle
                        </span>
                      )}
                    </div>
                    {clientErrors.phoneNumber && (
                      <p className="text-[10px] text-error font-bold mt-1 px-3.5 animate-scaleUp">
                        {clientErrors.phoneNumber}
                      </p>
                    )}
                  </div>

                  {/* Género */}
                  <div className="space-y-1">
                    <label
                      className="block text-[11px] font-bold text-on-surface px-1"
                      htmlFor="gender"
                    >
                      Tu género
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-base">
                        wc
                      </span>
                      <select
                        className="w-full pl-10 pr-10 py-3 bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary/20 text-on-surface text-xs font-bold transition-all outline-none appearance-none cursor-pointer"
                        id="gender"
                        value={data.gender}
                        onChange={(e) => {
                          setData("gender", e.target.value);
                        }}
                        disabled={processing}
                      >
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Otro">Otro</option>
                        <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none">
                        expand_more
                      </span>
                    </div>
                  </div>

                  {/* Número de emergencia (Opcional pero advirtiendo riesgos) */}
                  <div className="space-y-1">
                    <label
                      className="block text-[11px] font-bold text-on-surface px-1 flex justify-between"
                      htmlFor="emergencyPhone"
                    >
                      <span>Contacto de emergencia</span>
                      <span className="text-[10px] text-gray-400 font-medium">Opcional</span>
                    </label>
                    <div className="relative">
                      <span
                        className={`material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 text-base ${
                          emergencyFocused ? "text-primary" : "text-outline"
                        }`}
                      >
                        contact_emergency
                      </span>
                      <span className="absolute left-[38px] top-1/2 -translate-y-1/2 text-xs select-none pointer-events-none">
                        🇨🇱
                      </span>
                      <input
                        className="w-full pl-[62px] pr-10 py-3 bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary/20 text-on-surface text-xs font-semibold placeholder:text-outline-variant transition-all outline-none"
                        id="emergencyPhone"
                        type="tel"
                        placeholder="ej: +56911111111"
                        value={data.emergencyPhone}
                        onChange={(e) => {
                          handlePhoneChange("emergencyPhone", e.target.value);
                        }}
                        onFocus={() => {
                          setEmergencyFocused(true);
                          if (!data.emergencyPhone) {
                            setData("emergencyPhone", "+569");
                          }
                        }}
                        onBlur={() => {
                          setEmergencyFocused(false);
                        }}
                        disabled={processing}
                      />
                      {data.emergencyPhone && !clientErrors.emergencyPhone && (
                        <span className="material-symbols-outlined text-green-500 absolute right-3.5 top-1/2 -translate-y-1/2 text-lg font-black animate-scaleUp">
                          check_circle
                        </span>
                      )}
                    </div>
                    {clientErrors.emergencyPhone && (
                      <p className="text-[10px] text-error font-bold mt-1 px-3.5 animate-scaleUp">
                        {clientErrors.emergencyPhone}
                      </p>
                    )}
                    {/* Safety risk warning if emergency contact is empty */}
                    {!data.emergencyPhone && (
                      <div className="mt-1.5 p-3.5 bg-amber-50 border border-amber-200/80 text-amber-800 rounded-2xl text-[10px] flex gap-2 animate-scaleUp">
                        <span className="material-symbols-outlined text-amber-600 shrink-0 select-none text-base">
                          warning
                        </span>
                        <div className="space-y-0.5">
                          <p className="font-bold">⚠️ Riesgo de seguridad</p>
                          <p className="opacity-95 leading-relaxed font-semibold">
                            Si dejas este campo vacío, no contaremos con una vía inmediata para
                            contactar a tu familia en caso de accidente o urgencia médica durante el
                            viaje.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Contraseña */}
                  <div className="space-y-1">
                    <label
                      className="block text-[11px] font-bold text-on-surface px-1"
                      htmlFor="password"
                    >
                      Tu contraseña
                    </label>
                    <div className="relative">
                      <span
                        className={`material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 text-base ${
                          passwordFocused ? "text-primary" : "text-outline"
                        }`}
                      >
                        lock
                      </span>
                      <input
                        className="w-full pl-10 pr-10 py-3 bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary/20 text-on-surface text-xs font-semibold placeholder:text-outline-variant transition-all outline-none"
                        id="password"
                        type="password"
                        placeholder="Mínimo 8 caracteres"
                        value={data.password}
                        onChange={(e) => {
                          setData("password", e.target.value);
                        }}
                        onFocus={() => {
                          setPasswordFocused(true);
                        }}
                        onBlur={() => {
                          setPasswordFocused(false);
                        }}
                        required
                        disabled={processing}
                      />
                    </div>
                    {errors.password && (
                      <p className="text-[10px] text-error font-bold mt-1 px-2">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirmar contraseña */}
                  <div className="space-y-1">
                    <label
                      className="block text-[11px] font-bold text-on-surface px-1"
                      htmlFor="passwordConfirmation"
                    >
                      Confirmar contraseña
                    </label>
                    <div className="relative">
                      <span
                        className={`material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 text-base ${
                          confirmPasswordFocused ? "text-primary" : "text-outline"
                        }`}
                      >
                        lock_reset
                      </span>
                      <input
                        className="w-full pl-10 pr-10 py-3 bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary/20 text-on-surface text-xs font-semibold placeholder:text-outline-variant transition-all outline-none"
                        id="passwordConfirmation"
                        type="password"
                        placeholder="Repite tu contraseña"
                        value={data.passwordConfirmation}
                        onChange={(e) => {
                          setData("passwordConfirmation", e.target.value);
                        }}
                        onFocus={() => {
                          setConfirmPasswordFocused(true);
                        }}
                        onBlur={() => {
                          setConfirmPasswordFocused(false);
                        }}
                        required
                        disabled={processing}
                      />
                    </div>
                    {errors.passwordConfirmation && (
                      <p className="text-[10px] text-error font-bold mt-1 px-2">
                        {errors.passwordConfirmation}
                      </p>
                    )}
                  </div>

                  {/* Términos */}
                  <div className="flex items-start gap-2 pt-1">
                    <input
                      className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary transition-all cursor-pointer mt-0.5"
                      id="terms"
                      type="checkbox"
                      required
                      disabled={processing}
                    />
                    <label
                      className="text-[11px] text-on-surface-variant font-medium cursor-pointer leading-normal"
                      htmlFor="terms"
                    >
                      Acepto los{" "}
                      <a href="#" className="text-primary font-bold hover:underline">
                        Términos
                      </a>{" "}
                      y la{" "}
                      <a href="#" className="text-primary font-bold hover:underline">
                        Privacidad
                      </a>
                      .
                    </label>
                  </div>

                  {/* Botón enviar */}
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-primary text-white font-semibold text-xs rounded-full hover:bg-primary-container active:scale-[0.98] transition-all flex justify-center items-center gap-2 shadow-sm disabled:opacity-75 disabled:pointer-events-none mt-2 cursor-pointer"
                    disabled={processing}
                  >
                    <span>{processing ? "Registrando..." : "Crear mi cuenta"}</span>
                    {!processing && (
                      <span className="material-symbols-outlined text-xl">arrow_forward</span>
                    )}
                  </button>
                </form>
              </div>

              {/* Login Redirection */}
              <footer className="mt-6 text-center flex flex-col gap-4">
                <p className="text-xs font-normal text-on-surface-variant">
                  ¿Ya tienes una cuenta?{" "}
                  <Link
                    className="text-primary font-bold hover:underline ml-1 cursor-pointer"
                    href={`/login?redirectTo=${encodeURIComponent(redirectTo)}`}
                  >
                    Inicia sesión
                  </Link>
                </p>
                <p className="text-[10px] font-semibold text-outline-variant">
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
