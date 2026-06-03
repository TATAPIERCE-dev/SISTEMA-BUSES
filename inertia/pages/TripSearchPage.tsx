import React, { useState, useMemo } from "react";
import { Head, Link } from "@inertiajs/react";
import { MapPin, Calendar, ArrowLeftRight, Search, Bus, ArrowRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export interface Trip {
  id: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  originTerminal: string;
  destTerminal: string;
  operator: string;
  seatType: string;
  price: number;
  isDirect: boolean;
  origen: string;
  destino: string;
}

const SEED_TRIPS: Trip[] = [
  {
    id: "1",
    departureTime: "08:00",
    arrivalTime: "09:45",
    duration: "1h 45m",
    originTerminal: "Terminal Alameda",
    destTerminal: "Terminal Valparaíso",
    operator: "Tur Bus",
    seatType: "Salón Cama",
    price: 8000,
    isDirect: true,
    origen: "Santiago",
    destino: "Valparaíso",
  },
  {
    id: "2",
    departureTime: "10:30",
    arrivalTime: "12:15",
    duration: "1h 45m",
    originTerminal: "Terminal Alameda",
    destTerminal: "Terminal Valparaíso",
    operator: "Pullman Bus",
    seatType: "Salón Cama Light",
    price: 9500,
    isDirect: true,
    origen: "Santiago",
    destino: "Valparaíso",
  },
  {
    id: "3",
    departureTime: "14:00",
    arrivalTime: "18:30",
    duration: "4h 30m",
    originTerminal: "Terminal Alameda",
    destTerminal: "Terminal Collao",
    operator: "EME Bus",
    seatType: "Salón Cama",
    price: 25000,
    isDirect: true,
    origen: "Santiago",
    destino: "Concepción",
  },
  {
    id: "4",
    departureTime: "06:00",
    arrivalTime: "11:00",
    duration: "5h 00m",
    originTerminal: "Terminal Sur",
    destTerminal: "Terminal La Serena",
    operator: "Tur Bus",
    seatType: "Salón Cama Light",
    price: 15000,
    isDirect: true,
    origen: "Santiago",
    destino: "La Serena",
  },
  {
    id: "5",
    departureTime: "22:00",
    arrivalTime: "06:00",
    duration: "8h 00m",
    originTerminal: "Terminal Alameda",
    destTerminal: "Terminal Antofagasta",
    operator: "Pullman Bus",
    seatType: "Salón Cama",
    price: 60000,
    isDirect: true,
    origen: "Santiago",
    destino: "Antofagasta",
  },
  {
    id: "6",
    departureTime: "16:00",
    arrivalTime: "17:30",
    duration: "1h 30m",
    originTerminal: "Terminal Rancagua",
    destTerminal: "Terminal Alameda",
    operator: "EME Bus",
    seatType: "ESC",
    price: 4000,
    isDirect: true,
    origen: "Rancagua",
    destino: "Santiago",
  },
];

export default function TripSearchPage() {
  const getQueryParam = (name: string, defaultValue: string) => {
    if (typeof window === "undefined") {
      return defaultValue;
    }
    const params = new URLSearchParams(window.location.search);
    return params.get(name) || defaultValue;
  };

  const initialOrigen = getQueryParam("origen", "Santiago");
  const initialDestino = getQueryParam("destino", "Valparaíso");
  const initialFecha = getQueryParam("fecha", new Date().toISOString().split("T")[0]);

  const [originInput, setOriginInput] = useState(initialOrigen);
  const [destinationInput, setDestinationInput] = useState(initialDestino);
  const [dateInput, setDateInput] = useState(initialFecha);
  const [searchParams, setSearchParams] = useState({
    origen: initialOrigen,
    destino: initialDestino,
    fecha: initialFecha,
  });
  const [operators, setOperators] = useState<string[]>(["Tur Bus", "Pullman Bus", "EME Bus"]);
  const [seatTypes, setSeatTypes] = useState<string[]>(["Salón Cama", "Salón Cama Light", "ESC"]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ origen: originInput, destino: destinationInput, fecha: dateInput });
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("origen", originInput);
      url.searchParams.set("destino", destinationInput);
      url.searchParams.set("fecha", dateInput);
      window.history.pushState({}, "", url.toString());
    }
  };

  const handleSwap = () => {
    setOriginInput(destinationInput);
    setDestinationInput(originInput);
  };

  const handleOperatorToggle = (op: string) => {
    setOperators(
      operators.includes(op) ? operators.filter((item) => item !== op) : [...operators, op],
    );
  };

  const handleSeatTypeToggle = (type: string) => {
    setSeatTypes(
      seatTypes.includes(type) ? seatTypes.filter((item) => item !== type) : [...seatTypes, type],
    );
  };

  const handleClearFilters = () => {
    setOperators(["Tur Bus", "Pullman Bus", "EME Bus"]);
    setSeatTypes(["Salón Cama", "Salón Cama Light", "ESC"]);
  };

  const filteredTrips = useMemo(() => {
    return SEED_TRIPS.filter((trip) => {
      const matchesOperator = operators.includes(trip.operator);
      const matchesSeatType = seatTypes.includes(trip.seatType);
      return matchesOperator && matchesSeatType;
    });
  }, [operators, seatTypes]);

  return (
    <>
      <Head title="Buscar Viajes - TravelEase" />
      <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans antialiased">
        <Header />
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 md:p-6">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
              <div className="w-full md:w-1/3 flex flex-col gap-1.5">
                <Label htmlFor="origin" className="text-sm font-medium text-gray-600">
                  Origen
                </Label>
                <div className="relative w-full">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="origin"
                    value={originInput}
                    onChange={(e) => setOriginInput(e.target.value)}
                    placeholder="Ciudad de origen"
                    className="pl-10 pr-4"
                    required
                  />
                </div>
              </div>
              <div className="hidden md:flex items-center justify-center mb-1">
                <button
                  type="button"
                  onClick={handleSwap}
                  aria-label="Intercambiar"
                  className="w-11 h-11 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-blue-600 transition-all duration-200 hover:rotate-180"
                >
                  <ArrowLeftRight className="w-5 h-5" />
                </button>
              </div>
              <div className="w-full md:w-1/3 flex flex-col gap-1.5">
                <Label htmlFor="destination" className="text-sm font-medium text-gray-600">
                  Destino
                </Label>
                <div className="relative w-full">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="destination"
                    value={destinationInput}
                    onChange={(e) => setDestinationInput(e.target.value)}
                    placeholder="Ciudad de destino"
                    className="pl-10 pr-4"
                    required
                  />
                </div>
              </div>
              <div className="w-full md:w-1/4 flex flex-col gap-1.5">
                <Label htmlFor="date" className="text-sm font-medium text-gray-600">
                  Fecha
                </Label>
                <div className="relative w-full">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="date"
                    type="date"
                    value={dateInput}
                    onChange={(e) => setDateInput(e.target.value)}
                    className="pl-10 pr-4"
                    required
                  />
                </div>
              </div>
              <div className="w-full md:w-auto mt-4 md:mt-0">
                <Button
                  type="submit"
                  className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Search className="w-5 h-5" />
                  <span>Buscar</span>
                </Button>
              </div>
            </form>
          </section>

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="w-full lg:w-1/4 flex flex-col gap-6">
              <Card className="p-6 bg-white border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Filter className="w-5 h-5 text-blue-600" />
                    <span>Filtros</span>
                  </h2>
                  <button
                    onClick={handleClearFilters}
                    className="text-sm text-blue-600 hover:underline font-semibold"
                  >
                    Limpiar
                  </button>
                </div>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-sm font-semibold text-gray-900">Operador</h3>
                    <div className="flex flex-col gap-2.5">
                      {["Tur Bus", "Pullman Bus", "EME Bus"].map((op) => (
                        <label
                          key={op}
                          className="flex items-center gap-3 cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={operators.includes(op)}
                            onChange={() => handleOperatorToggle(op)}
                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 font-medium">{op}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex flex-col gap-3">
                    <h3 className="text-sm font-semibold text-gray-900">Tipo de Asiento</h3>
                    <div className="flex flex-col gap-2.5">
                      {["Salón Cama", "Salón Cama Light", "ESC"].map((type) => (
                        <label
                          key={type}
                          className="flex items-center gap-3 cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={seatTypes.includes(type)}
                            onChange={() => handleSeatTypeToggle(type)}
                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 font-medium">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </aside>

            <section className="w-full lg:w-3/4 flex flex-col gap-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-2">
                <div>
                  <h1 className="text-xl font-bold text-gray-900 hidden md:block">
                    Resultados: {searchParams.origen} → {searchParams.destino}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(searchParams.fecha + "T00:00:00").toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <span className="text-sm font-semibold text-blue-600 px-3 py-1 bg-blue-50 rounded-full">
                  {filteredTrips.length} {filteredTrips.length === 1 ? "viaje" : "viajes"}
                </span>
              </div>

              <div className="flex flex-col gap-4">
                {filteredTrips.length > 0 ? (
                  filteredTrips.map((trip) => (
                    <Card
                      key={trip.id}
                      className="overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 border border-gray-200 bg-white"
                    >
                      <div className="p-6 flex flex-col md:flex-row gap-6 items-center">
                        <div className="flex-grow w-full flex items-center justify-between md:justify-start gap-4 md:gap-8">
                          <div className="flex flex-col">
                            <span className="text-lg font-bold text-gray-900">
                              {trip.departureTime}
                            </span>
                            <span className="text-xs text-gray-500 font-medium">
                              {trip.originTerminal}
                            </span>
                          </div>
                          <div className="flex flex-col items-center flex-grow max-w-[150px]">
                            <span className="text-xs text-gray-500 mb-1 font-semibold">
                              {trip.duration}
                            </span>
                            <div className="w-full flex items-center">
                              <div className="w-2.5 h-2.5 rounded-full border-2 border-gray-300"></div>
                              <div className="flex-grow border-t-2 border-dashed border-gray-300"></div>
                              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-sm"></div>
                            </div>
                            {trip.isDirect && (
                              <span className="text-xs text-blue-600 font-bold mt-1">Directo</span>
                            )}
                          </div>
                          <div className="flex flex-col text-right md:text-left">
                            <span className="text-lg font-bold text-gray-900">
                              {trip.arrivalTime}
                            </span>
                            <span className="text-xs text-gray-500 font-medium">
                              {trip.destTerminal}
                            </span>
                          </div>
                        </div>
                        <div className="w-full md:w-auto flex flex-col items-end gap-4 border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6">
                          <div className="flex items-center gap-2.5 self-start md:self-end">
                            <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                              <Bus className="w-4 h-4" />
                            </div>
                            <span className="text-sm text-gray-900 font-semibold">
                              {trip.operator}
                            </span>
                            <span className="text-xs text-gray-500 font-medium ml-1 px-2 py-0.5 bg-gray-100 rounded-full">
                              {trip.seatType}
                            </span>
                          </div>
                          <div className="text-right w-full flex justify-between md:flex-col items-center md:items-end">
                            <Link
                              href={`/seats?tripId=${trip.id}`}
                              className="mt-2 md:mt-3 inline-flex items-center justify-center gap-1.5 text-xs h-9 px-4 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold transition-all duration-200 cursor-pointer"
                            >
                              <span>Elegir Asientos</span>
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm flex flex-col items-center justify-center gap-4 animate-scaleUp">
                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-2">
                      <Bus className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900">
                      No hay pasajes según tus filtros seleccionados
                    </h3>
                    <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
                      Prueba marcar alguna opción de operador o tipo de asiento en la barra lateral
                      para volver a ver los viajes disponibles.
                    </p>
                    <Button
                      onClick={handleClearFilters}
                      className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-sm transition-colors cursor-pointer"
                    >
                      Limpiar Filtros
                    </Button>
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
