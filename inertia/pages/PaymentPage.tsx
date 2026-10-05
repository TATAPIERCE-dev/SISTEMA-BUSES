import { useEffect, useState } from "react";
import { Head, router } from "@inertiajs/react";
import { CreditCard, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

interface PaymentPageProps {
  viajeId: string;
  seatIds: string[];
  holdId: string;
  passenger: { nombrePasajero: string; correoPasajero: string; telefonoPasajero: string };
  trip: { origin: string; destination: string; departure: string; operator: string; model: string };
  total: number;
}

export default function PaymentPage({
  viajeId,
  seatIds,
  holdId,
  passenger,
  trip,
  total,
}: PaymentPageProps) {
  const [cardBrand, setCardBrand] = useState<"Visa" | "Mastercard">("Visa");
  const [cardNumber, setCardNumber] = useState("4111111111111111");
  const [cardName, setCardName] = useState("JUAN PEREZ");
  const [cardExpiry, setCardExpiry] = useState("12/30");
  const [cardCvv, setCardCvv] = useState("123");
  const [timeLeft, setTimeLeft] = useState(600);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = window.setInterval(() => setTimeLeft((time) => Math.max(0, time - 1)), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (timeLeft === 0) {
      return setError("El tiempo para pagar expiró. Selecciona nuevamente tus asientos.");
    }
    if (!/^\d{16}$/.test(cardNumber)) {
      return setError("Ingresa una tarjeta de 16 dígitos.");
    }
    if (cardName.trim().length < 3) {
      return setError("Ingresa el nombre del titular.");
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)) {
      return setError("La fecha debe tener formato MM/AA.");
    }
    if (!/^\d{3,4}$/.test(cardCvv)) {
      return setError("Ingresa un CVV válido.");
    }

    router.post("/bookings", {
      viajeId,
      holdId,
      asientoIds: seatIds,
      ...passenger,
      cardBrand,
      cardNumber,
      cardName,
      cardExpiry,
      cardCvv,
    });
  };

  return (
    <>
      <Head title="Pago - TravelEase" />
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                Finalizar compra
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
                Paga tu reserva
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Completa tus datos de pago para confirmar el asiento.
              </p>
            </div>
            <div className="hidden items-center gap-3 text-xs font-bold md:flex">
              <span className="rounded-full bg-blue-600 px-3 py-1.5 text-white">1 Viaje</span>
              <span className="h-px w-8 bg-slate-300" />
              <span className="rounded-full bg-blue-600 px-3 py-1.5 text-white">2 Pago</span>
              <span className="h-px w-8 bg-slate-300" />
              <span className="text-slate-400">3 Confirmación</span>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <div className="bg-gradient-to-br from-blue-700 to-blue-500 p-6 text-white">
                <p className="text-xs font-bold uppercase tracking-widest text-blue-100">
                  Tu viaje
                </p>
                <p className="mt-3 text-2xl font-black">
                  {trip.origin} <span className="text-blue-200">→</span> {trip.destination}
                </p>
                <p className="mt-2 text-sm text-blue-100">
                  {trip.departure} · {trip.operator}
                </p>
              </div>
              <CardContent className="space-y-5 p-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-400">Operador</p>
                    <p className="mt-1 font-bold">{trip.operator}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-400">Bus</p>
                    <p className="mt-1 font-bold">{trip.model}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-400">Pasajero</p>
                    <p className="mt-1 font-bold">{passenger.nombrePasajero}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-400">Asientos</p>
                    <p className="mt-1 font-bold">{seatIds.length}</p>
                  </div>
                </div>
                <div className="border-t border-dashed border-slate-200 pt-5">
                  <div className="flex items-end justify-between">
                    <span className="font-bold text-slate-500">Total a pagar</span>
                    <strong className="text-3xl font-black text-blue-600">
                      ${total.toLocaleString("es-CL")}
                    </strong>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-100 p-6">
                <CardTitle className="flex items-center justify-between text-xl">
                  <span>Datos de tarjeta</span>
                  <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs text-amber-700">
                    <Timer className="h-4 w-4" />{" "}
                    {Math.floor(timeLeft / 60)
                      .toString()
                      .padStart(2, "0")}
                    :{(timeLeft % 60).toString().padStart(2, "0")}
                  </span>
                </CardTitle>
                <p className="text-xs text-slate-500">
                  Tu asiento se mantiene disponible mientras completas el pago.
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={submit} className="space-y-4">
                  <div>
                    <Label>Tipo de tarjeta</Label>
                    <div className="mt-1.5 grid grid-cols-2 gap-3">
                      {(["Visa", "Mastercard"] as const).map((brand) => (
                        <button
                          key={brand}
                          type="button"
                          onClick={() => {
                            setCardBrand(brand);
                            setCardNumber(
                              brand === "Visa" ? "4111111111111111" : "5555555555554444",
                            );
                          }}
                          className={`h-11 rounded-lg border-2 text-sm font-bold transition-colors ${
                            cardBrand === brand
                              ? "border-blue-600 bg-blue-50 text-blue-700"
                              : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"
                          }`}
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Número de tarjeta</Label>
                    <Input
                      className="mt-1.5 h-11"
                      value={cardNumber}
                      onChange={(e) =>
                        setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))
                      }
                      inputMode="numeric"
                      placeholder="0000 0000 0000 0000"
                    />
                  </div>
                  <div>
                    <Label>Nombre del titular</Label>
                    <Input
                      className="mt-1.5 h-11"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Como aparece en la tarjeta"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Vencimiento</Label>
                      <Input
                        className="mt-1.5 h-11"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value.slice(0, 5))}
                        placeholder="MM/AA"
                      />
                    </div>
                    <div>
                      <Label>CVV</Label>
                      <Input
                        className="mt-1.5 h-11"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        inputMode="numeric"
                        placeholder="123"
                      />
                    </div>
                  </div>
                  {error && (
                    <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
                  )}
                  <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
                    Datos de prueba: no se realiza ningún cobro real.
                  </div>
                  <Button
                    type="submit"
                    className="h-12 w-full bg-blue-600 font-bold text-white hover:bg-blue-700"
                  >
                    <CreditCard className="h-4 w-4" /> Confirmar pago de $
                    {total.toLocaleString("es-CL")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
