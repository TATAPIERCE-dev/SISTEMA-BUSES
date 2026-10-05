import { Head, Link } from "@inertiajs/react";
import { CheckCircle, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

interface InvoicePageProps {
  reservation: {
    code: string;
    passenger: string;
    email: string;
    total: number;
    createdAt: string;
    trip: { origin: string; destination: string; departure: string; operator: string };
    seats: number[];
  };
}

export default function InvoicePage({ reservation }: InvoicePageProps) {
  return (
    <>
      <Head title="Factura - TravelEase" />
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-10 md:py-16">
          <Card className="overflow-hidden border-slate-200 shadow-sm">
            <div className="bg-blue-600 p-8 text-center text-white">
              <CheckCircle className="mx-auto mb-3 h-14 w-14" />
              <h1 className="text-3xl font-black">¡Compra confirmada!</h1>
              <p className="mt-2 text-blue-100">
                Este es un comprobante de prueba, sin cobro real.
              </p>
            </div>
            <CardContent className="space-y-7 p-6 md:p-10">
              <div className="flex items-start justify-between gap-4 border-b border-dashed border-slate-200 pb-5">
                <div>
                  <p className="text-xs font-bold uppercase text-slate-400">Factura</p>
                  <p className="font-mono text-lg font-black">{reservation.code}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Emitida</p>
                  <p className="font-bold">{reservation.createdAt}</p>
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase text-slate-400">Pasajero</p>
                  <p className="font-bold">{reservation.passenger}</p>
                  <p className="text-sm text-slate-500">{reservation.email}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-slate-400">Asientos</p>
                  <p className="font-bold">{reservation.seats.join(", ")}</p>
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 p-5">
                <p className="text-xs font-bold uppercase text-slate-400">Viaje</p>
                <p className="mt-1 text-xl font-black">
                  {reservation.trip.origin} → {reservation.trip.destination}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  {reservation.trip.departure} · {reservation.trip.operator}
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-5">
                <span className="font-bold text-slate-500">Total pagado</span>
                <strong className="text-3xl font-black text-blue-600">
                  ${reservation.total.toLocaleString("es-CL")}
                </strong>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Printer className="h-4 w-4" /> Imprimir factura
                </Button>
                <Link
                  href="/"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 px-4 text-sm font-bold"
                >
                  Volver al inicio
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    </>
  );
}
