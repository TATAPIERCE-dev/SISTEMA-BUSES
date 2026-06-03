import { Head } from "@inertiajs/react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function HelpPage() {
  return (
    <>
      <Head title="Centro de Ayuda - TravelEase" />
      <div className="min-h-screen flex flex-col bg-background text-on-background font-sans antialiased">
        <Header />

        <main className="flex-grow">
          {/* Header Section */}
          <section className="py-12 border-b border-outline-variant bg-surface">
            <div className="max-w-4xl mx-auto px-6">
              <h1 className="font-bold text-headline-lg text-on-background mb-4">
                Centro de Ayuda
              </h1>
              <p className="text-on-surface-variant text-body-lg">
                Encuentra documentación, guías de usuario y términos de servicio de TravelEase.
              </p>
            </div>
          </section>

          {/* Main Content Container */}
          <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col gap-16">
            {/* Simple FAQ Section */}
            <section id="faq">
              <h2 className="font-bold text-headline-md text-on-background mb-8 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-3xl">quiz</span>
                Preguntas Frecuentes
              </h2>
              <div className="space-y-4">
                <details className="group bg-white border border-outline-variant rounded-lg overflow-hidden">
                  <summary className="flex justify-between items-center p-6 cursor-pointer list-none font-bold text-on-background hover:bg-surface-container-low transition-colors select-none">
                    <span>¿Cómo puedo solicitar un cambio de fecha en mi pasaje?</span>
                    <span className="material-symbols-outlined transition-transform duration-200 group-open:rotate-180 text-gray-500">
                      expand_more
                    </span>
                  </summary>
                  <div className="p-6 pt-4 text-on-surface-variant leading-relaxed border-t border-outline-variant bg-gray-50/50">
                    Los cambios de fecha están sujetos a la disponibilidad y a las condiciones de la
                    tarifa adquirida. Puede gestionar su cambio a través del portal "Gestionar
                    Reservas" o enviando un ticket a nuestro equipo de soporte con su número de
                    reserva.
                  </div>
                </details>

                <details className="group bg-white border border-outline-variant rounded-lg overflow-hidden">
                  <summary className="flex justify-between items-center p-6 cursor-pointer list-none font-bold text-on-background hover:bg-surface-container-low transition-colors select-none">
                    <span>¿Cuál es el peso máximo permitido para el equipaje de bodega?</span>
                    <span className="material-symbols-outlined transition-transform duration-200 group-open:rotate-180 text-gray-500">
                      expand_more
                    </span>
                  </summary>
                  <div className="p-6 pt-4 text-on-surface-variant leading-relaxed border-t border-outline-variant bg-gray-50/50">
                    El límite estándar es de 23kg por pieza de equipaje facturado. Para tarifas
                    premium, este límite puede extenderse hasta los 32kg. Recomendamos verificar su
                    confirmación de reserva para detalles específicos.
                  </div>
                </details>

                <details className="group bg-white border border-outline-variant rounded-lg overflow-hidden">
                  <summary className="flex justify-between items-center p-6 cursor-pointer list-none font-bold text-on-background hover:bg-surface-container-low transition-colors select-none">
                    <span>¿Tienen servicio de atención al cliente los fines de semana?</span>
                    <span className="material-symbols-outlined transition-transform duration-200 group-open:rotate-180 text-gray-500">
                      expand_more
                    </span>
                  </summary>
                  <div className="p-6 pt-4 text-on-surface-variant leading-relaxed border-t border-outline-variant bg-gray-50/50">
                    Nuestro equipo de soporte por correo electrónico opera 24/7. Las consultas
                    recibidas durante el fin de semana son priorizadas según la urgencia del viaje.
                  </div>
                </details>
              </div>
            </section>

            {/* Terms and Conditions Section */}
            <section className="prose max-w-none" id="terms">
              <h2 className="font-bold text-headline-md text-on-background mb-8 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-3xl">description</span>
                Términos y Condiciones
              </h2>
              <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant space-y-6">
                <div>
                  <h4 className="font-bold text-on-background mb-2">1. Política de Reservas</h4>
                  <p className="text-on-surface-variant leading-relaxed">
                    Todas las reservas están sujetas a confirmación inmediata mediante el pago total
                    de la tarifa. TravelEase se reserva el derecho de cancelar reservas no pagadas
                    dentro del plazo de 2 horas desde la pre-reserva.
                  </p>
                </div>
                <div className="border-t border-outline-variant pt-6">
                  <h4 className="font-bold text-on-background mb-2">
                    2. Reembolsos y Cancelaciones
                  </h4>
                  <p className="text-on-surface-variant leading-relaxed">
                    Los reembolsos se procesarán en un plazo de 7 a 14 días hábiles. Las tarifas
                    identificadas como 'No Reembolsables' solo permitirán la recuperación de tasas
                    aeroportuarias o de uso de terminal, según corresponda por ley.
                  </p>
                </div>
                <div className="border-t border-outline-variant pt-6">
                  <h4 className="font-bold text-on-background mb-2">3. Conducta del Pasajero</h4>
                  <p className="text-on-surface-variant leading-relaxed">
                    El pasajero se compromete a seguir todas las normas de seguridad dictadas por el
                    personal de a bordo. El incumplimiento de estas normas puede resultar en la
                    denegación del embarque sin derecho a reembolso.
                  </p>
                </div>
              </div>
            </section>

            {/* Support Focus Section */}
            <section className="py-12 border-t border-outline-variant" id="contact">
              <div className="max-w-2xl">
                <h2 className="font-bold text-headline-md text-on-background mb-4">
                  ¿No encontraste lo que buscabas?
                </h2>
                <p className="text-on-surface-variant mb-8 text-body-lg">
                  Envíanos un correo electrónico para abrir un ticket de soporte. Nuestro equipo
                  técnico revisará tu caso de forma personalizada.
                </p>

                <div className="bg-primary text-on-primary p-8 rounded-2xl flex flex-col md:flex-row items-center gap-6 shadow-lg">
                  <div className="bg-on-primary/10 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-4xl text-white">mail</span>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="font-bold text-xl mb-1 text-white">Envíanos un Email</h3>
                    <p className="opacity-90 text-sm text-white/90">
                      Tiempo estimado de respuesta: 4-6 horas laborales.
                    </p>
                  </div>
                  <a
                    href="mailto:soporte@travelease.cl"
                    className="px-8 py-3 bg-white text-primary rounded-full font-bold hover:bg-surface-container-lowest transition-all active:scale-95 text-sm inline-block text-center flex-shrink-0 shadow-sm"
                  >
                    Crear Ticket
                  </a>
                </div>

                <div className="mt-8 flex items-center gap-3 text-on-surface-variant text-sm">
                  <span className="material-symbols-outlined text-base">info</span>
                  <p>
                    También puedes contactarnos por teléfono al{" "}
                    <span className="font-bold text-on-background">+34 900 123 456</span> para
                    emergencias en curso.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
