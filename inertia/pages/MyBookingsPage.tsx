import { useState, useMemo } from "react";
import { Head, router, Link } from "@inertiajs/react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Calendar, Trash2, X, AlertTriangle } from "lucide-react";

export interface Booking {
  id: string;
  codigoReserva: string;
  estado: string; // "pendiente", "pagada", "cancelada", "expirada"
  uiState: string; // "Próximo", "Completado", "Cancelado"
  montoTotal: number;
  nombrePasajero: string;
  correoPasajero: string;
  telefonoPasajero: string | null;
  creadoEn: string;
  viaje: {
    id: string;
    fechaSalida: string;
    fechaLlegada: string | null;
    precio: number;
    estado: string;
    bus: {
      placa: string;
      modelo: string;
    } | null;
    ruta: {
      origen: { ciudad: string; terminal: string } | null;
      destino: { ciudad: string; terminal: string } | null;
    } | null;
  } | null;
  asientos: number[];
}

interface MyBookingsPageProps {
  reservas: Booking[];
}

const MyBookingsPage: React.FC<MyBookingsPageProps> = ({ reservas }) => {
  // Client-side filters
  const [selectedStates, setSelectedStates] = useState<string[]>(["Próximo"]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Modals state
  const [ticketModalBooking, setTicketModalBooking] = useState<Booking | null>(null);
  const [cancelModalBooking, setCancelModalBooking] = useState<Booking | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Toggle filter statuses
  const handleStateToggle = (status: string) => {
    setSelectedStates((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status],
    );
  };

  const handleClearFilters = () => {
    setSelectedStates(["Próximo", "Completado", "Cancelado"]);
    setFromDate("");
    setToDate("");
  };

  // Filter bookings based on selections
  const filteredBookings = useMemo(() => {
    return reservas.filter((booking) => {
      // 1. Status check
      if (selectedStates.length > 0 && !selectedStates.includes(booking.uiState)) {
        return false;
      }

      // 2. Date check
      if (booking.viaje?.fechaSalida) {
        const departureDateStr = booking.viaje.fechaSalida.split("T")[0];
        if (fromDate && departureDateStr < fromDate) {
          return false;
        }
        if (toDate && departureDateStr > toDate) {
          return false;
        }
      }

      return true;
    });
  }, [reservas, selectedStates, fromDate, toDate]);

  // Cancel reservation trigger
  const confirmCancel = () => {
    if (!cancelModalBooking) {
      return;
    }
    setCancellingId(cancelModalBooking.id);
    router.post(
      `/bookings/${cancelModalBooking.id}/cancel`,
      {},
      {
        onSuccess: () => {
          setCancelModalBooking(null);
          setCancellingId(null);
        },
        onError: () => {
          setCancellingId(null);
        },
      },
    );
  };

  // Format dates in Spanish
  const formatTripDate = (dateIso: string | undefined) => {
    if (!dateIso) {
      return "";
    }
    const date = new Date(dateIso);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTripTime = (dateIso: string | undefined) => {
    if (!dateIso) {
      return "";
    }
    const date = new Date(dateIso);
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      <Head title="Mis Reservas - TravelEase" />
      <div className="min-h-screen flex flex-col bg-background text-on-surface font-sans antialiased">
        <Header />

        <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-12 py-10">
          {/* Welcome Header */}
          <div className="mb-10 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-black text-on-surface mb-2 tracking-tight">
              Mis Reservas
            </h1>
            <p className="text-base text-on-surface-variant font-normal">
              Gestiona tus próximos viajes y revisa tu historial de rutas.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-1/4 flex flex-col gap-6 animate-scaleUp">
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Filtrar por
                  </h3>
                  {(selectedStates.length < 3 || fromDate || toDate) && (
                    <button
                      onClick={handleClearFilters}
                      className="text-xs text-primary font-semibold hover:underline"
                    >
                      Limpiar
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Status Filter */}
                  <div>
                    <span className="block text-sm font-semibold mb-3 text-on-surface">Estado</span>
                    <div className="flex flex-col gap-2.5">
                      {["Próximo", "Completado", "Cancelado"].map((status) => (
                        <label
                          key={status}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={selectedStates.includes(status)}
                            onChange={() => handleStateToggle(status)}
                            className="rounded border-outline-variant text-primary focus:ring-primary h-5 w-5 cursor-pointer"
                          />
                          <span
                            className={`text-sm font-medium transition-colors group-hover:text-on-surface ${
                              selectedStates.includes(status)
                                ? "text-primary font-bold"
                                : "text-on-surface-variant"
                            }`}
                          >
                            {status === "Próximo"
                              ? "Próximos"
                              : status === "Completado"
                                ? "Completados"
                                : "Cancelados"}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Date Filter */}
                  <div>
                    <span className="block text-sm font-semibold mb-3 text-on-surface">Fecha</span>
                    <div className="space-y-3">
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
                        <input
                          type="date"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                          placeholder="Desde"
                          className="w-full pl-10 pr-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                      </div>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
                        <input
                          type="date"
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                          placeholder="Hasta"
                          className="w-full pl-10 pr-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Promo Card */}
              <div className="relative h-48 rounded-xl overflow-hidden shadow-sm group cursor-pointer border border-outline-variant">
                <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 to-transparent flex flex-col justify-end p-6 z-10">
                  <span className="text-on-primary text-xs font-bold uppercase tracking-widest mb-1">
                    Oferta Exclusiva
                  </span>
                  <p className="text-on-primary text-base font-black leading-tight">
                    15% DCTO en tu próximo viaje al Sur
                  </p>
                </div>
                <img
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt="Luxury bus at sunset"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCb0W95JLr-OngASQEhiXJl894gQDw65K5Lou5-_5sIKHUHMs_u-tSmCfiZAJIS6mdd_-0EF8Vb3AfnlE1rUuOEFeZ4Z2LbJtcEVN9PsrYCRJrhI1Ekp-GGDt8Wbuv2_-GUp0F4DMQ-AS3L4kOA_wEEYpxdUGbJFnjn5J55J_8LDn5DsCLHvREjZFvdrKu3RvbdxT9xb8emmxzEN80Ar3nI6227XApLtErTL7gv1ljpXtVU20pZFL2gzVOsW-J3upKZh-QKdFhdmce_"
                />
              </div>
            </aside>

            {/* Bookings List */}
            <section className="flex-1 space-y-6 animate-scaleUp">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className={`rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 ${
                      booking.uiState === "Completado"
                        ? "bg-surface border-outline-variant/30 opacity-90 hover:opacity-100"
                        : booking.uiState === "Cancelado"
                          ? "bg-surface border-outline-variant/30 opacity-70 hover:opacity-100"
                          : "bg-surface-container-lowest border-outline-variant"
                    }`}
                  >
                    <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-6">
                        <div
                          className={`w-16 h-16 rounded-lg flex items-center justify-center border ${
                            booking.uiState === "Próximo"
                              ? "bg-surface-container border-outline-variant text-primary"
                              : "bg-surface-container-high border-outline-variant/20 text-outline"
                          }`}
                        >
                          <span
                            className="material-symbols-outlined text-3xl"
                            style={{ fontVariationSettings: "'FILL' 0" }}
                          >
                            {booking.uiState === "Cancelado" ? "cancel" : "directions_bus"}
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <h4
                              className={`text-base font-bold tracking-tight ${
                                booking.uiState === "Cancelado"
                                  ? "text-on-surface-variant line-through"
                                  : "text-on-surface"
                              }`}
                            >
                              {booking.viaje?.ruta?.origen?.ciudad || "Santiago"}
                            </h4>
                            <span className="material-symbols-outlined text-outline text-sm">
                              arrow_forward
                            </span>
                            <h4
                              className={`text-base font-bold tracking-tight ${
                                booking.uiState === "Cancelado"
                                  ? "text-on-surface-variant line-through"
                                  : "text-on-surface"
                              }`}
                            >
                              {booking.viaje?.ruta?.destino?.ciudad || "Destino"}
                            </h4>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-on-surface-variant text-xs font-semibold">
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">event</span>
                              {formatTripDate(booking.viaje?.fechaSalida)}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">schedule</span>
                              {formatTripTime(booking.viaje?.fechaSalida)}
                            </span>
                            {booking.asientos.length > 0 && (
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">
                                  event_seat
                                </span>
                                Asiento: {booking.asientos.join(", ")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-start md:items-end gap-3.5">
                        {/* Custom Badges */}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            booking.uiState === "Próximo"
                              ? "bg-secondary-container text-on-secondary-container"
                              : booking.uiState === "Completado"
                                ? "bg-surface-container-highest text-on-surface-variant"
                                : "bg-error-container text-on-error-container"
                          }`}
                        >
                          {booking.uiState}
                        </span>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                          {booking.uiState === "Próximo" && (
                            <>
                              <button
                                onClick={() => setTicketModalBooking(booking)}
                                className="px-4 py-2.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-container transition-colors active:scale-95 cursor-pointer shadow-sm"
                              >
                                Ver Ticket
                              </button>
                              <button
                                onClick={() => setCancelModalBooking(booking)}
                                aria-label="Cancelar Reserva"
                                className="p-2 border border-error/20 hover:border-error text-error hover:bg-error-container/30 rounded-lg transition-all active:scale-95 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {booking.uiState === "Completado" && (
                            <Link
                              href="/"
                              className="px-4 py-2.5 bg-surface-container text-on-surface-variant border border-outline-variant rounded-lg text-xs font-bold hover:bg-surface-variant hover:text-primary transition-colors cursor-pointer inline-block text-center"
                            >
                              Volver a Reservar
                            </Link>
                          )}

                          {booking.uiState === "Cancelado" && (
                            <button
                              onClick={() => setTicketModalBooking(booking)}
                              className="px-4 py-2.5 text-primary text-xs font-bold hover:underline transition-colors cursor-pointer"
                            >
                              Ver Detalles
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-12 text-center shadow-sm animate-scaleUp">
                  <span className="material-symbols-outlined text-5xl text-outline-variant mb-4 block">
                    directions_bus
                  </span>
                  <h3 className="text-lg font-bold text-on-surface mb-1">Sin viajes encontrados</h3>
                  <p className="text-on-surface-variant text-sm max-w-sm mx-auto">
                    No se encontraron reservas que coincidan con los filtros aplicados.
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="mt-6 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-container transition-all active:scale-95 cursor-pointer"
                  >
                    Mostrar todos los viajes
                  </button>
                </div>
              )}
            </section>
          </div>
        </main>

        <Footer />
      </div>

      {/* STUNNING TICKET MODAL */}
      {ticketModalBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest w-full max-w-[480px] rounded-2xl overflow-hidden shadow-2xl border border-outline-variant flex flex-col max-h-[90vh]">
            <header className="px-6 py-4 bg-primary text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">confirmation_number</span>
                <span className="text-base font-bold">Pase de Abordar</span>
              </div>
              <button
                onClick={() => setTicketModalBooking(null)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
              {/* Ticket Branding */}
              <div className="flex justify-between items-start border-b border-dashed border-outline-variant pb-4">
                <div>
                  <h5 className="text-lg font-bold text-primary">TravelEase</h5>
                  <p className="text-xs text-on-surface-variant font-medium">
                    Viaja cómodo y seguro
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-outline uppercase block">Código</span>
                  <span className="text-sm font-bold text-on-surface">
                    {ticketModalBooking.codigoReserva}
                  </span>
                </div>
              </div>

              {/* Boarding Info Card */}
              <div className="bg-surface-container-low p-4 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-2/5">
                    <span className="text-xs text-outline uppercase font-semibold block">
                      Origen
                    </span>
                    <span className="text-base font-bold text-on-surface block leading-tight">
                      {ticketModalBooking.viaje?.ruta?.origen?.ciudad}
                    </span>
                    <span className="text-[10px] text-on-surface-variant font-medium block truncate">
                      {ticketModalBooking.viaje?.ruta?.origen?.terminal}
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center w-1/5">
                    <span className="material-symbols-outlined text-primary text-xl">
                      directions_bus
                    </span>
                    <div className="w-full flex items-center mt-1">
                      <div className="w-1.5 h-1.5 rounded-full border border-primary"></div>
                      <div className="flex-grow border-t border-dashed border-primary"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    </div>
                  </div>
                  <div className="w-2/5 text-right">
                    <span className="text-xs text-outline uppercase font-semibold block">
                      Destino
                    </span>
                    <span className="text-base font-bold text-on-surface block leading-tight">
                      {ticketModalBooking.viaje?.ruta?.destino?.ciudad}
                    </span>
                    <span className="text-[10px] text-on-surface-variant font-medium block truncate">
                      {ticketModalBooking.viaje?.ruta?.destino?.terminal}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-outline-variant/40 pt-3">
                  <div>
                    <span className="text-[10px] text-outline uppercase font-semibold block">
                      Fecha Salida
                    </span>
                    <span className="text-xs font-bold text-on-surface">
                      {formatTripDate(ticketModalBooking.viaje?.fechaSalida)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-outline uppercase font-semibold block">
                      Hora Salida
                    </span>
                    <span className="text-xs font-bold text-on-surface">
                      {formatTripTime(ticketModalBooking.viaje?.fechaSalida)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Passenger & Seats Info */}
              <div className="grid grid-cols-2 gap-y-4 text-sm px-1">
                <div>
                  <span className="text-[10px] text-outline uppercase font-semibold block">
                    Pasajero
                  </span>
                  <span className="font-bold text-on-surface">
                    {ticketModalBooking.nombrePasajero}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-outline uppercase font-semibold block">
                    Email
                  </span>
                  <span className="font-bold text-on-surface text-xs truncate max-w-full block">
                    {ticketModalBooking.correoPasajero}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-outline uppercase font-semibold block">
                    Asientos
                  </span>
                  <span className="font-extrabold text-primary text-base">
                    {ticketModalBooking.asientos.join(", ") || "N/A"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-outline uppercase font-semibold block">
                    Monto Total
                  </span>
                  <span className="font-bold text-on-surface">
                    ${ticketModalBooking.montoTotal.toLocaleString("es-CL")}
                  </span>
                </div>
                {ticketModalBooking.viaje?.bus && (
                  <>
                    <div>
                      <span className="text-[10px] text-outline uppercase font-semibold block">
                        Patente Bus
                      </span>
                      <span className="font-bold text-on-surface text-xs">
                        {ticketModalBooking.viaje.bus.placa}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-outline uppercase font-semibold block">
                        Modelo
                      </span>
                      <span className="font-bold text-on-surface text-xs">
                        {ticketModalBooking.viaje.bus.modelo}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Barcode representation */}
              <div className="border-t-2 border-dashed border-outline-variant pt-6 flex flex-col items-center justify-center gap-2">
                {ticketModalBooking.uiState === "Cancelado" ? (
                  <div className="w-full py-4 bg-error-container/30 border border-error/20 rounded-lg text-center">
                    <span className="text-error font-bold text-sm tracking-wide uppercase">
                      TICKET CANCELADO - REEMBOLSADO
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="bg-white p-2.5 rounded-lg border border-outline-variant shadow-sm w-full flex justify-center py-5">
                      {/* Fake barcode constructed with CSS widths */}
                      <div className="flex h-12 items-stretch justify-center w-full max-w-[280px]">
                        {[
                          2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 1, 2, 2, 1, 3, 1, 4, 1, 2, 1, 3,
                          2, 1, 4, 1, 2, 2, 1, 3,
                        ].map((width, idx) => (
                          <div
                            key={idx}
                            className={`${idx % 2 === 0 ? "bg-black" : "bg-transparent"}`}
                            style={{ width: `${width}px` }}
                          ></div>
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] text-outline font-mono tracking-widest mt-1">
                      {ticketModalBooking.id.substring(0, 18).toUpperCase()}
                    </span>
                  </>
                )}
              </div>
            </div>

            <footer className="px-6 py-4 bg-surface-container border-t border-outline-variant flex gap-3 justify-end">
              <button
                onClick={() => setTicketModalBooking(null)}
                className="px-4 py-2 border border-outline-variant rounded-lg text-xs font-bold text-on-surface hover:bg-surface-variant transition-colors cursor-pointer"
              >
                Cerrar
              </button>
              {ticketModalBooking.uiState === "Próximo" && (
                <button
                  onClick={() => {
                    setCancelModalBooking(ticketModalBooking);
                    setTicketModalBooking(null);
                  }}
                  className="px-4 py-2 bg-error text-white text-xs font-bold rounded-lg hover:bg-error/90 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Cancelar Viaje</span>
                </button>
              )}
            </footer>
          </div>
        </div>
      )}

      {/* CONFIRM CANCELLATION MODAL */}
      {cancelModalBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[105] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest w-full max-w-[400px] rounded-xl overflow-hidden shadow-2xl border border-outline-variant p-6 space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-error-container text-error rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-on-surface">¿Cancelar esta reserva?</h3>
                <p className="text-sm text-on-surface-variant font-normal leading-relaxed">
                  Esta acción cancelará tu reserva{" "}
                  <strong className="text-on-surface font-semibold">
                    {cancelModalBooking.codigoReserva}
                  </strong>{" "}
                  para el viaje de{" "}
                  <strong className="text-on-surface font-semibold">
                    {cancelModalBooking.viaje?.ruta?.origen?.ciudad}
                  </strong>{" "}
                  a{" "}
                  <strong className="text-on-surface font-semibold">
                    {cancelModalBooking.viaje?.ruta?.destino?.ciudad}
                  </strong>
                  . Tus asientos serán liberados.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-outline-variant/40 pt-4">
              <button
                onClick={() => setCancelModalBooking(null)}
                disabled={cancellingId !== null}
                className="px-4 py-2 border border-outline-variant rounded-lg text-xs font-bold text-on-surface hover:bg-surface-variant transition-colors cursor-pointer disabled:opacity-50"
              >
                No, mantener
              </button>
              <button
                onClick={confirmCancel}
                disabled={cancellingId !== null}
                className="px-4 py-2 bg-error text-white text-xs font-bold rounded-lg hover:bg-error/90 transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {cancellingId ? (
                  <span>Cancelando...</span>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Sí, cancelar reserva</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyBookingsPage;
