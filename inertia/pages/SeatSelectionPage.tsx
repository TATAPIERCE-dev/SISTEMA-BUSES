import React, { useState, useEffect, useRef } from "react";
import { Head, router, usePage, Link } from "@inertiajs/react";
import {
  Timer,
  Check,
  ChevronRight,
  TrendingUp,
  UserCheck,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
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

interface Seat {
  number: string;
  type: "Salón Cama" | "Salón Cama Light" | "ESC";
  price: number;
  status: "available" | "light-available" | "selected" | "occupied" | "locked";
  level: 1 | 2;
}

export default function SeatSelectionPage() {
  // Access authenticated user shared from AdonisJS backend
  const { props } = usePage<{
    user?: {
      fullName: string | null;
      email: string;
      documentType?: string | null;
      documentNumber?: string | null;
      phoneNumber?: string | null;
      gender?: string | null;
      emergencyPhone?: string | null;
    };
  }>();
  const { user } = props;

  const trip = {
    id: "1",
    departureTime: "08:30",
    arrivalTime: "10:20",
    duration: "1h 50m",
    originTerminal: "Terminal Alameda",
    destTerminal: "Terminal Valparaíso",
    operator: "Tur Bus",
    seatType: "Salón Cama",
    price: 8000,
    isDirect: true,
  };
  const searchParams = {
    origin: "Santiago",
    destination: "Valparaíso",
    date: new Date().toISOString().split("T")[0],
  };

  const [activeLevel, setActiveLevel] = useState<1 | 2>(2);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const timerRef = useRef<any>(null);

  // Checkout mode toggles for guests and logged-in profiles
  const [checkoutMode, setCheckoutMode] = useState<"guest" | "login">("guest");
  const [buyingForSelf, setBuyingForSelf] = useState(true);

  // Expanded Passenger details state variables
  const [fullName, setFullName] = useState("");
  const [documentType, setDocumentType] = useState("RUT");
  const [documentNumber, setDocumentNumber] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+569");
  const [gender, setGender] = useState("Masculino");
  const [emergencyPhone, setEmergencyPhone] = useState("");

  const [clientErrors, setClientErrors] = useState<{
    fullName?: string;
    email?: string;
    documentNumber?: string;
    phone?: string;
    emergencyPhone?: string;
  }>({});

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [ticketCode, setTicketCode] = useState("");

  // Prefill values automatically if the passenger is logged in and buying for themselves
  useEffect(() => {
    if (user) {
      if (buyingForSelf) {
        setFullName(user.fullName || "");
        setEmail(user.email || "");
        setDocumentType(user.documentType || "RUT");
        setDocumentNumber(user.documentNumber || "");
        setPhone(user.phoneNumber || "");
        setGender(user.gender || "Masculino");
        setEmergencyPhone(user.emergencyPhone || "");
      } else {
        setFullName("");
        setEmail("");
        setDocumentType("RUT");
        setDocumentNumber("");
        setPhone("");
        setGender("Masculino");
        setEmergencyPhone("");
      }
      setClientErrors({});
    }
  }, [user, buyingForSelf]);

  // Live validator for SeatSelectionPage fields
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
        if (documentType === "RUT") {
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

      if (field === "phone") {
        if (value.length !== 12) {
          next.phone = "Debe tener exactamente 8 dígitos tras el +569.";
        } else {
          delete next.phone;
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

  const handlePhoneChange = (field: "phone" | "emergencyPhone", value: string) => {
    const setter = field === "phone" ? setPhone : setEmergencyPhone;
    const isEmergency = field === "emergencyPhone";

    // Allow empty for optional emergency contact
    if (
      isEmergency &&
      (value === "" || value === "+" || value === "+5" || value === "+56" || value === "+569")
    ) {
      setter("");
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

    setter(formatted);
    validateField(field, formatted);
  };

  const [seats, setSeats] = useState<Seat[]>([
    { number: "3", type: "Salón Cama", price: 15750, status: "occupied", level: 2 },
    { number: "ESC", type: "ESC", price: 0, status: "occupied", level: 2 },
    { number: "10", type: "Salón Cama", price: 15750, status: "occupied", level: 2 },
    { number: "13", type: "Salón Cama", price: 15750, status: "occupied", level: 2 },
    { number: "16", type: "Salón Cama", price: 15750, status: "occupied", level: 2 },
    { number: "19", type: "Salón Cama", price: 15750, status: "occupied", level: 2 },
    { number: "22", type: "Salón Cama", price: 15750, status: "occupied", level: 2 },
    { number: "25", type: "Salón Cama", price: 15750, status: "occupied", level: 2 },
    { number: "28", type: "Salón Cama", price: 15750, status: "occupied", level: 2 },
    { number: "31", type: "Salón Cama", price: 15750, status: "occupied", level: 2 },
    { number: "2", type: "Salón Cama", price: 15750, status: "occupied", level: 2 },
    { number: "5", type: "Salón Cama", price: 15750, status: "occupied", level: 2 },
    { number: "7", type: "Salón Cama", price: 15750, status: "occupied", level: 2 },
    { number: "9", type: "Salón Cama", price: 15750, status: "occupied", level: 2 },
    { number: "12", type: "Salón Cama", price: 15750, status: "available", level: 2 },
    { number: "15", type: "Salón Cama", price: 15750, status: "available", level: 2 },
    { number: "18", type: "Salón Cama", price: 15750, status: "occupied", level: 2 },
    { number: "21", type: "Salón Cama Light", price: 14700, status: "light-available", level: 2 },
    { number: "24", type: "Salón Cama", price: 15750, status: "occupied", level: 2 },
    { number: "27", type: "Salón Cama Light", price: 14700, status: "light-available", level: 2 },
    { number: "30", type: "Salón Cama", price: 15750, status: "available", level: 2 },
    { number: "1", type: "Salón Cama", price: 15750, status: "occupied", level: 2 },
    { number: "4", type: "Salón Cama", price: 15750, status: "available", level: 2 },
    { number: "6", type: "Salón Cama", price: 15750, status: "occupied", level: 2 },
    { number: "8", type: "Salón Cama", price: 15750, status: "occupied", level: 2 },
    { number: "11", type: "Salón Cama", price: 15750, status: "available", level: 2 },
    { number: "14", type: "Salón Cama", price: 15750, status: "occupied", level: 2 },
    { number: "17", type: "Salón Cama", price: 15750, status: "occupied", level: 2 },
    { number: "20", type: "Salón Cama", price: 15750, status: "occupied", level: 2 },
    { number: "23", type: "Salón Cama", price: 15750, status: "occupied", level: 2 },
    { number: "26", type: "Salón Cama", price: 15750, status: "occupied", level: 2 },
    { number: "29", type: "Salón Cama", price: 15750, status: "occupied", level: 2 },
    { number: "34", type: "Salón Cama", price: 15750, status: "occupied", level: 1 },
    { number: "37", type: "Salón Cama", price: 15750, status: "occupied", level: 1 },
    { number: "40", type: "Salón Cama", price: 15750, status: "occupied", level: 1 },
    { number: "43", type: "Salón Cama", price: 15750, status: "occupied", level: 1 },
    { number: "33", type: "Salón Cama", price: 15750, status: "occupied", level: 1 },
    { number: "36", type: "Salón Cama", price: 15750, status: "occupied", level: 1 },
    { number: "39", type: "Salón Cama", price: 15750, status: "occupied", level: 1 },
    { number: "42", type: "Salón Cama", price: 15750, status: "occupied", level: 1 },
    { number: "32", type: "Salón Cama", price: 15750, status: "occupied", level: 1 },
    { number: "35", type: "Salón Cama", price: 15750, status: "occupied", level: 1 },
    { number: "38", type: "Salón Cama", price: 15750, status: "available", level: 1 },
    { number: "41", type: "Salón Cama", price: 15750, status: "occupied", level: 1 },
  ]);

  const selectedSeats = seats.filter((s) => s.status === "selected");

  const handleToggleSeat = (seatNumber: string, level: 1 | 2) => {
    setSeats((prevSeats) =>
      prevSeats.map((seat) => {
        if (seat.number === seatNumber && seat.level === level) {
          if (seat.status === "selected") {
            const originalStatus =
              seat.type === "Salón Cama Light" ? "light-available" : "available";
            return { ...seat, status: originalStatus };
          } else if (seat.status === "available" || seat.status === "light-available") {
            return { ...seat, status: "selected" };
          }
        }
        return seat;
      }),
    );
  };

  useEffect(() => {
    if (selectedSeats.length > 0) {
      if (timeLeft === null) {
        setTimeLeft(600);
      }
    } else {
      setTimeLeft(null);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [selectedSeats.length, timeLeft]);

  useEffect(() => {
    if (timeLeft !== null) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime !== null && prevTime > 0) {
            return prevTime - 1;
          } else {
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            timerRef.current = null;
            return 0;
          }
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const subtotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all passenger fields before checkout completes
    const errs: typeof clientErrors = {};
    if (fullName.trim().length < 3) {
      errs.fullName = "El nombre debe tener al menos 3 caracteres.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "El correo electrónico no es válido.";
    }
    if (documentType === "RUT") {
      if (!validateRut(documentNumber)) {
        errs.documentNumber =
          "El RUT no es válido. Formato requerido: 11111111-1 (sin puntos y con guion).";
      }
    } else {
      if (!/^[A-Za-z]{2}\d{6}$/.test(documentNumber)) {
        errs.documentNumber = "El pasaporte debe tener el formato AB123456 (2 letras y 6 números).";
      }
    }
    if (phone.length !== 12) {
      errs.phone = "Debe tener exactamente 8 dígitos tras el +569.";
    }
    if (emergencyPhone && emergencyPhone.length !== 12) {
      errs.emergencyPhone = "Debe tener exactamente 8 dígitos tras el +569.";
    }

    setClientErrors(errs);
    if (Object.keys(errs).length > 0) {
      return;
    }

    const rand = Math.floor(100000 + Math.random() * 900000);
    setTicketCode(`TE-${rand}`);
    setIsSuccessModalOpen(true);
  };

  const handleCloseSuccess = () => {
    setIsSuccessModalOpen(false);
    router.visit("/");
  };

  const level2Seats = seats.filter((s) => s.level === 2);
  const level1Seats = seats.filter((s) => s.level === 1);
  const level2Row1 = level2Seats.slice(0, 11);
  const level2Row2 = level2Seats.slice(11, 22);
  const level2Row3 = level2Seats.slice(22, 33);
  const level1Row1 = level1Seats.slice(0, 4);
  const level1Row2 = level1Seats.slice(4, 8);
  const level1Row3 = level1Seats.slice(8, 12);

  const renderSeatButton = (seat: Seat) => {
    const isEsc = seat.type === "ESC";
    const buttonClass = cn(
      "w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold seat-btn",
      isEsc && "bg-gray-200 text-gray-400 border border-gray-300 text-xs cursor-default",
      seat.status === "occupied" &&
        !isEsc &&
        "bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed opacity-60",
      seat.status === "available" &&
        "bg-white border-2 border-gray-300 text-gray-600 hover:border-blue-600 hover:shadow-sm",
      seat.status === "light-available" &&
        "bg-white border-2 border-blue-300 text-blue-500 hover:border-blue-600 hover:shadow-sm",
      seat.status === "selected" && "bg-blue-600 text-white border-2 border-blue-600 shadow-sm",
    );
    return (
      <button
        key={`${seat.level}-${seat.number}`}
        type="button"
        disabled={isEsc || seat.status === "occupied"}
        onClick={() => handleToggleSeat(seat.number, seat.level)}
        className={buttonClass}
      >
        {seat.number}
      </button>
    );
  };

  return (
    <>
      <Head title="Seleccionar Asientos" />
      <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans antialiased">
        <Header isSeatsPage />
        <div className="bg-gray-100 border-b border-gray-200 sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
            <h1 className="text-lg font-bold text-gray-900">
              {searchParams.origin} <ArrowRight className="w-4 h-4 inline text-blue-600" />{" "}
              {searchParams.destination}
            </h1>
            <p className="text-sm text-gray-500">
              {trip.departureTime} - {trip.arrivalTime} ({trip.duration}) • {trip.operator}
            </p>
          </div>
        </div>

        <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-8 py-8 grid grid-cols-1 xl:grid-cols-12 gap-8">
          <section className="xl:col-span-8 flex flex-col items-center gap-6">
            <Card className="p-6 md:p-8 w-full">
              <div className="flex justify-center mb-8">
                <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-100">
                  <button
                    type="button"
                    onClick={() => setActiveLevel(1)}
                    className={cn(
                      "px-8 py-2.5 rounded-md font-bold text-sm transition-all",
                      activeLevel === 1
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-500 hover:text-blue-600",
                    )}
                  >
                    Piso 1
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveLevel(2)}
                    className={cn(
                      "px-8 py-2.5 rounded-md font-bold text-sm transition-all",
                      activeLevel === 2
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-500 hover:text-blue-600",
                    )}
                  >
                    Piso 2
                  </button>
                </div>
              </div>

              <div
                className={cn(
                  "w-full overflow-x-auto pb-4",
                  activeLevel === 2 ? "block" : "hidden",
                )}
              >
                <div className="min-w-[600px] border border-gray-200 rounded-xl p-6 flex flex-col gap-4 bg-gray-50">
                  <div className="flex gap-3 justify-between">
                    {level2Row1.map(renderSeatButton)}
                  </div>
                  <div className="w-full h-8 border-t border-b border-gray-200 flex items-center justify-center text-xs tracking-widest text-gray-400 font-bold uppercase bg-gray-100 rounded">
                    Pasillo
                  </div>
                  <div className="flex gap-3 justify-between">
                    {level2Row2.map(renderSeatButton)}
                  </div>
                  <div className="flex gap-3 justify-between mt-2">
                    {level2Row3.map(renderSeatButton)}
                  </div>
                </div>
              </div>

              <div
                className={cn(
                  "w-full overflow-x-auto pb-4",
                  activeLevel === 1 ? "block" : "hidden",
                )}
              >
                <div className="min-w-[300px] max-w-[400px] mx-auto border border-gray-200 rounded-xl p-6 flex flex-col gap-4 bg-gray-50">
                  <div className="flex gap-3 justify-between">
                    {level1Row1.map(renderSeatButton)}
                  </div>
                  <div className="w-full h-8 border-t border-b border-gray-200 flex items-center justify-center text-xs tracking-widest text-gray-400 font-bold uppercase bg-gray-100 rounded">
                    Pasillo
                  </div>
                  <div className="flex gap-3 justify-between">
                    {level1Row2.map(renderSeatButton)}
                  </div>
                  <div className="flex gap-3 justify-between mt-2">
                    {level1Row3.map(renderSeatButton)}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-6 mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg border-2 border-gray-300 bg-white"></div>
                  <span className="text-xs font-bold text-gray-700">Salón Cama $15.750</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg border-2 border-blue-300 bg-white"></div>
                  <span className="text-xs font-bold text-gray-700">Light $14.700</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 border-2 border-blue-600"></div>
                  <span className="text-xs font-bold text-gray-700">Seleccionado</span>
                </div>
                <div className="flex items-center gap-2 opacity-60">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 border-2 border-gray-200"></div>
                  <span className="text-xs font-bold text-gray-700">Ocupado</span>
                </div>
              </div>
            </Card>
          </section>

          <section className="xl:col-span-4 mt-8 xl:mt-0">
            <div className="sticky top-[140px] flex flex-col gap-6">
              {timeLeft !== null && (
                <div className="bg-amber-50 text-amber-800 p-4 rounded-xl flex items-center gap-3 border border-amber-200">
                  <Timer className="w-6 h-6 text-amber-600 shrink-0" />
                  <div>
                    <p className="text-sm font-bold">
                      Reserva por <span className="font-mono">{formatTime(timeLeft)}</span>
                    </p>
                    <p className="text-xs opacity-90">Completa antes de que expire</p>
                  </div>
                </div>
              )}

              <Card>
                <CardHeader className="border-b border-gray-200 pb-4">
                  <CardTitle className="text-lg font-bold text-gray-900 flex items-center justify-between">
                    <span>Resumen</span>
                    {selectedSeats.length > 0 && (
                      <span className="text-xs font-bold bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                        {selectedSeats.length} asiento{selectedSeats.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {selectedSeats.length === 0 ? (
                    <div className="text-center py-12">
                      <TrendingUp className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">Selecciona un asiento para comenzar</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6">
                      <ul className="space-y-3 border-b border-gray-200 pb-4">
                        {selectedSeats.map((seat) => (
                          <li
                            key={`${seat.level}-${seat.number}`}
                            className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                                {seat.number}
                              </div>
                              <div>
                                <span className="text-sm font-bold text-gray-900">{seat.type}</span>
                                <span className="text-[10px] text-gray-500 block">
                                  Piso {seat.level}
                                </span>
                              </div>
                            </div>
                            <span className="text-sm font-bold text-gray-900">
                              ${seat.price.toLocaleString("es-CL")}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <span className="text-lg font-black text-gray-900">Total</span>
                        <span className="text-lg text-blue-600 font-black">
                          ${subtotal.toLocaleString("es-CL")}
                        </span>
                      </div>
                      <div className="space-y-4 border-t border-gray-200 pt-6">
                        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                          <UserCheck className="w-4 h-4 text-blue-600" />
                          <span>Datos del Pasajero</span>
                        </h3>

                        {/* Guest vs Login selection tabs (visible if guest) */}
                        {!user && (
                          <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-lg border border-gray-200 mb-2">
                            <button
                              type="button"
                              onClick={() => {
                                setCheckoutMode("guest");
                                setFullName("");
                                setEmail("");
                                setDocumentType("RUT");
                                setDocumentNumber("");
                                setPhone("+569");
                                setGender("Masculino");
                                setEmergencyPhone("");
                                setClientErrors({});
                              }}
                              className={cn(
                                "py-2.5 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                                checkoutMode === "guest"
                                  ? "bg-white text-blue-600 shadow-sm"
                                  : "text-gray-500 hover:text-blue-600",
                              )}
                            >
                              <span className="material-symbols-outlined text-sm">person</span>
                              <span>Comprar como Invitado</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setCheckoutMode("login");
                                setClientErrors({});
                              }}
                              className={cn(
                                "py-2.5 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                                checkoutMode === "login"
                                  ? "bg-white text-blue-600 shadow-sm"
                                  : "text-gray-500 hover:text-blue-600",
                              )}
                            >
                              <span className="material-symbols-outlined text-sm">login</span>
                              <span>Iniciar Sesión</span>
                            </button>
                          </div>
                        )}

                        {/* Active user status and self vs other selection tabs */}
                        {user && (
                          <div className="space-y-3 mb-2">
                            <div className="flex items-center justify-between bg-green-50 border border-green-200 px-3 py-2.5 rounded-xl text-xs text-green-800 font-bold">
                              <span className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-base animate-pulse">
                                  check_circle
                                </span>
                                <span>Sesión iniciada</span>
                              </span>
                              <span className="text-[10px] text-green-700 truncate max-w-[150px]">
                                {user.fullName || user.email}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-lg border border-gray-200">
                              <button
                                type="button"
                                onClick={() => {
                                  setBuyingForSelf(true);
                                }}
                                className={cn(
                                  "py-2.5 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                                  buyingForSelf
                                    ? "bg-white text-blue-600 shadow-sm"
                                    : "text-gray-500 hover:text-blue-600",
                                )}
                              >
                                <span className="material-symbols-outlined text-sm">face</span>
                                <span>Comprar para mí</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setBuyingForSelf(false);
                                }}
                                className={cn(
                                  "py-2.5 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                                  !buyingForSelf
                                    ? "bg-white text-blue-600 shadow-sm"
                                    : "text-gray-500 hover:text-blue-600",
                                )}
                              >
                                <span className="material-symbols-outlined text-sm">group</span>
                                <span>Para otra persona</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Passenger Details Form or Login Card */}
                        {!user && checkoutMode === "login" ? (
                          <div className="p-5 bg-blue-50/50 border border-blue-200/60 rounded-xl text-center flex flex-col items-center gap-3 animate-fadeIn">
                            <span className="material-symbols-outlined text-3xl text-blue-600">
                              account_circle
                            </span>
                            <h4 className="text-xs font-black text-gray-900 tracking-tight">
                              ¿Tienes una cuenta TravelEase?
                            </h4>
                            <p className="text-[10px] text-gray-500 leading-relaxed max-w-[220px]">
                              Inicia sesión para autocompletar tus datos automáticamente y acceder a
                              todos tus pasajes comprados.
                            </p>
                            <Link
                              href={`/login?redirectTo=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname + window.location.search : "")}`}
                              className="mt-1 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors text-center inline-block shadow-sm cursor-pointer"
                            >
                              Ingresar a mi cuenta
                            </Link>
                          </div>
                        ) : (
                          <form onSubmit={handleSubmitBooking} className="space-y-4 animate-fadeIn">
                            {/* Nombre */}
                            <div className="flex flex-col gap-1.5">
                              <Label htmlFor="fullName" className="text-gray-700 text-xs font-bold">
                                Nombre
                              </Label>
                              <div className="relative">
                                <Input
                                  id="fullName"
                                  placeholder="Juan Pérez"
                                  value={fullName}
                                  onChange={(e) => {
                                    setFullName(e.target.value);
                                    validateField("fullName", e.target.value);
                                  }}
                                  required
                                  disabled={!!(user && buyingForSelf)}
                                  className={cn(
                                    "pr-10 font-medium",
                                    user &&
                                      buyingForSelf &&
                                      "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed",
                                  )}
                                />
                                {fullName && !clientErrors.fullName && (
                                  <span className="material-symbols-outlined text-green-500 absolute right-3 top-1/2 -translate-y-1/2 text-lg font-black animate-scaleUp">
                                    check_circle
                                  </span>
                                )}
                              </div>
                              {clientErrors.fullName && (
                                <p className="text-[10px] text-error font-bold mt-0.5 px-1 animate-scaleUp">
                                  {clientErrors.fullName}
                                </p>
                              )}
                            </div>

                            {/* Tipo de documento */}
                            <div className="flex flex-col gap-1.5">
                              <Label
                                htmlFor="documentType"
                                className="text-gray-700 text-xs font-bold"
                              >
                                Tipo de Documento
                              </Label>
                              <select
                                id="documentType"
                                value={documentType}
                                onChange={(e) => {
                                  setDocumentType(e.target.value);
                                  setDocumentNumber("");
                                  setClientErrors((prev) => {
                                    const next = { ...prev };
                                    delete next.documentNumber;
                                    return next;
                                  });
                                }}
                                disabled={!!(user && buyingForSelf)}
                                className={cn(
                                  "w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-semibold",
                                  user &&
                                    buyingForSelf &&
                                    "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed",
                                )}
                              >
                                <option value="RUT">RUT</option>
                                <option value="Pasaporte">Pasaporte</option>
                              </select>
                            </div>

                            {/* Número de documento */}
                            <div className="flex flex-col gap-1.5">
                              <Label
                                htmlFor="documentNumber"
                                className="text-gray-700 text-xs font-bold"
                              >
                                Número de Documento
                              </Label>
                              <div className="relative">
                                <Input
                                  id="documentNumber"
                                  placeholder={
                                    documentType === "RUT" ? "11111111-1" : "Número de Pasaporte"
                                  }
                                  value={documentNumber}
                                  onChange={(e) => {
                                    const val =
                                      documentType === "Pasaporte"
                                        ? e.target.value.toUpperCase()
                                        : e.target.value;
                                    setDocumentNumber(val);
                                    validateField("documentNumber", val);
                                  }}
                                  maxLength={documentType === "Pasaporte" ? 8 : 10}
                                  required
                                  disabled={!!(user && buyingForSelf)}
                                  className={cn(
                                    "pr-10 font-medium",
                                    user &&
                                      buyingForSelf &&
                                      "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed",
                                  )}
                                />
                                {documentNumber && !clientErrors.documentNumber && (
                                  <span className="material-symbols-outlined text-green-500 absolute right-3 top-1/2 -translate-y-1/2 text-lg font-black animate-scaleUp">
                                    check_circle
                                  </span>
                                )}
                              </div>
                              {clientErrors.documentNumber && (
                                <p className="text-[10px] text-error font-bold mt-0.5 px-1 animate-scaleUp">
                                  {clientErrors.documentNumber}
                                </p>
                              )}
                            </div>

                            {/* Email */}
                            <div className="flex flex-col gap-1.5">
                              <Label htmlFor="email" className="text-gray-700 text-xs font-bold">
                                Email
                              </Label>
                              <div className="relative">
                                <Input
                                  id="email"
                                  type="email"
                                  placeholder="juan@email.com"
                                  value={email}
                                  onChange={(e) => {
                                    setEmail(e.target.value);
                                    validateField("email", e.target.value);
                                  }}
                                  required
                                  disabled={!!(user && buyingForSelf)}
                                  className={cn(
                                    "pr-10 font-medium",
                                    user &&
                                      buyingForSelf &&
                                      "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed",
                                  )}
                                />
                                {email && !clientErrors.email && (
                                  <span className="material-symbols-outlined text-green-500 absolute right-3 top-1/2 -translate-y-1/2 text-lg font-black animate-scaleUp">
                                    check_circle
                                  </span>
                                )}
                              </div>
                              {clientErrors.email && (
                                <p className="text-[10px] text-error font-bold mt-0.5 px-1 animate-scaleUp">
                                  {clientErrors.email}
                                </p>
                              )}
                            </div>

                            {/* Teléfono */}
                            <div className="flex flex-col gap-1.5">
                              <Label htmlFor="phone" className="text-gray-700 text-xs font-bold">
                                Teléfono
                              </Label>
                              <div className="relative flex items-center">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm select-none pointer-events-none">
                                  🇨🇱
                                </span>
                                <Input
                                  id="phone"
                                  type="tel"
                                  placeholder="ej: +56911111111"
                                  value={phone}
                                  onChange={(e) => {
                                    handlePhoneChange("phone", e.target.value);
                                  }}
                                  onFocus={() => {
                                    if (!phone) {
                                      setPhone("+569");
                                    }
                                  }}
                                  required
                                  className="pl-9 pr-10 font-medium"
                                />
                                {phone && !clientErrors.phone && (
                                  <span className="material-symbols-outlined text-green-500 absolute right-3 top-1/2 -translate-y-1/2 text-lg font-black animate-scaleUp">
                                    check_circle
                                  </span>
                                )}
                              </div>
                              {clientErrors.phone && (
                                <p className="text-[10px] text-error font-bold mt-0.5 px-1 animate-scaleUp">
                                  {clientErrors.phone}
                                </p>
                              )}
                            </div>

                            {/* Género */}
                            <div className="flex flex-col gap-1.5">
                              <Label htmlFor="gender" className="text-gray-700 text-xs font-bold">
                                Género
                              </Label>
                              <select
                                id="gender"
                                value={gender}
                                onChange={(e) => {
                                  setGender(e.target.value);
                                }}
                                disabled={!!(user && buyingForSelf)}
                                className={cn(
                                  "w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-semibold",
                                  user &&
                                    buyingForSelf &&
                                    "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed",
                                )}
                              >
                                <option value="Masculino">Masculino</option>
                                <option value="Femenino">Femenino</option>
                                <option value="Otro">Otro</option>
                                <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                              </select>
                            </div>

                            {/* Contacto de Emergencia */}
                            <div className="flex flex-col gap-1.5">
                              <div className="flex justify-between items-center">
                                <Label
                                  htmlFor="emergencyPhone"
                                  className="text-gray-700 text-xs font-bold"
                                >
                                  Teléfono de Emergencia
                                </Label>
                                <span className="text-[10px] text-gray-400 font-bold">
                                  Opcional
                                </span>
                              </div>
                              <div className="relative flex items-center">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm select-none pointer-events-none">
                                  🇨🇱
                                </span>
                                <Input
                                  id="emergencyPhone"
                                  type="tel"
                                  placeholder="ej: +56911111111"
                                  value={emergencyPhone}
                                  onChange={(e) => {
                                    handlePhoneChange("emergencyPhone", e.target.value);
                                  }}
                                  onFocus={() => {
                                    if (!emergencyPhone) {
                                      setEmergencyPhone("+569");
                                    }
                                  }}
                                  className="pl-9 pr-10 font-medium"
                                />
                                {emergencyPhone && !clientErrors.emergencyPhone && (
                                  <span className="material-symbols-outlined text-green-500 absolute right-3 top-1/2 -translate-y-1/2 text-lg font-black animate-scaleUp">
                                    check_circle
                                  </span>
                                )}
                              </div>
                              {clientErrors.emergencyPhone && (
                                <p className="text-[10px] text-error font-bold mt-0.5 px-1 animate-scaleUp">
                                  {clientErrors.emergencyPhone}
                                </p>
                              )}
                              {!emergencyPhone && (
                                <div className="mt-1.5 p-3.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-[10px] flex gap-2 animate-scaleUp">
                                  <span className="material-symbols-outlined text-amber-600 shrink-0 select-none text-base">
                                    warning
                                  </span>
                                  <div className="space-y-0.5 font-semibold leading-relaxed">
                                    <p className="font-bold">⚠️ Riesgo de seguridad</p>
                                    <p className="opacity-90">
                                      Si dejas este campo vacío, no podremos contactar a tus
                                      familiares de forma inmediata en caso de imprevistos o
                                      accidente en la ruta.
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>

                            <Button
                              type="submit"
                              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-sm cursor-pointer mt-4"
                            >
                              <CreditCard className="w-5 h-5" />
                              <span>Proceder al Pago</span>
                              <ChevronRight className="w-5 h-5" />
                            </Button>
                          </form>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>
        </main>

        {isSuccessModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-lg">
              <CardHeader className="bg-blue-600 text-white p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg font-bold text-white">¡Reserva Completada!</CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="bg-gray-100 p-4 rounded-xl flex items-center justify-between border border-gray-200">
                  <span className="text-xs font-bold text-gray-500">Código</span>
                  <span className="text-base font-bold text-blue-600 font-mono">{ticketCode}</span>
                </div>
                <div className="space-y-2 text-sm border-b border-gray-200 pb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Pasajero:</span>
                    <span className="font-bold">{fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email:</span>
                    <span className="font-bold break-all">{email}</span>
                  </div>
                </div>
                <Button
                  onClick={handleCloseSuccess}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Entendido
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
        <Footer />
      </div>
    </>
  );
}
