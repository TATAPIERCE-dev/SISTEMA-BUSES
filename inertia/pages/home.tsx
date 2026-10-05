import React, { useState, useEffect } from "react";
import { Head, router, Link } from "@inertiajs/react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  const cities = [
    "Santiago",
    "Valparaíso",
    "Concepción",
    "La Serena",
    "Temuco",
    "Antofagasta",
    "Iquique",
    "Puerto Montt",
    "Rancagua",
    "Talca",
    "Chillán",
    "Osorno",
  ];
  const [origen, setOrigen] = useState("Santiago");
  const [destino, setDestino] = useState("Valparaíso");
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    // Simple reveal animation for hero text
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get("/search", { origen, destino, fecha });
  };

  const handlePresetSearch = (destName: string) => {
    router.get("/search", { origen: "Santiago", destino: destName, fecha });
  };

  return (
    <>
      <Head title="Inicio - TravelEase" />
      <div className="min-h-screen flex flex-col bg-background text-on-background font-sans antialiased">
        <Header />

        <main className="flex-grow">
          {/* Hero Section */}
          <section className="relative h-[85vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCO9gIbj5gkUI1-QiaSh2k5s40ds-2i-mtqR5XSh01_fJGlc-eQQ3-ZeMIrWRaHShkNhIugDSaTaroR5aFsHxo_mWHQF5RRkaO9rv5raWkPrGjTfVzZatliRj8rPxk6v8HmCpMsmq2yaEZL8AehsbnvElSI4n5p6Phd4tlLhOOKfFvAJer4khINF96lJISZ2BJ3PFQyejEXYSPEtD5siXBGa3h8inY1ljIXmo49Lmqb6o4LAZaD7f3eASolOxqLRmhlWdplehi0AuiW"
                alt="Paisaje Chileno"
                className="w-full h-full object-cover brightness-[0.85]"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
            </div>

            <div
              className="relative z-10 text-center px-4 md:px-12 max-w-4xl transition-all duration-[800ms] ease-out"
              style={{
                opacity: isAnimated ? 1 : 0,
                transform: isAnimated ? "translateY(0)" : "translateY(20px)",
              }}
            >
              <h1 className="text-white font-bold text-display-lg mb-4 drop-shadow-lg md:leading-tight">
                Descubre Chile con TravelEase
              </h1>
              <p className="text-white text-body-lg mb-12 opacity-95 drop-shadow-md">
                Tu viaje soñado comienza aquí. Confort, puntualidad y las mejores rutas.
              </p>

              {/* Search Bar Container */}
              <div className="glass-effect rounded-xl p-4 md:p-6 shadow-xl max-w-5xl mx-auto w-full border border-white/30">
                <form
                  onSubmit={handleSearch}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
                >
                  <div className="flex flex-col text-left gap-2">
                    <label className="font-semibold text-label-md text-on-surface-variant px-1">
                      Origen
                    </label>
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary">
                        location_on
                      </span>
                      <select
                        value={origen}
                        onChange={(e) => setOrigen(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-gray-900"
                        required
                      >
                        <option value="" disabled>
                          Selecciona una ciudad
                        </option>
                        {cities.map((city) => (
                          <option key={city} value={city} disabled={city === destino}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col text-left gap-2">
                    <label className="font-semibold text-label-md text-on-surface-variant px-1">
                      Destino
                    </label>
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary">
                        near_me
                      </span>
                      <select
                        value={destino}
                        onChange={(e) => setDestino(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-gray-900"
                        required
                      >
                        <option value="" disabled>
                          Selecciona una ciudad
                        </option>
                        {cities.map((city) => (
                          <option key={city} value={city} disabled={city === origen}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col text-left gap-2">
                    <label className="font-semibold text-label-md text-on-surface-variant px-1">
                      Fecha
                    </label>
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary">
                        calendar_today
                      </span>
                      <input
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-gray-900"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-primary text-on-primary py-3 px-8 rounded-lg font-semibold text-label-md hover:bg-surface-tint transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 h-[50px] cursor-pointer"
                  >
                    <span className="material-symbols-outlined">search</span>
                    Buscar Viajes
                  </button>
                </form>
                <datalist id="city-options">
                  {cities.map((city) => (
                    <option key={city} value={city} />
                  ))}
                </datalist>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-24 px-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="flex flex-col items-center p-8 rounded-xl bg-surface-container-lowest hover:shadow-lg transition-all border border-outline-variant/30">
                <div className="w-16 h-16 rounded-full bg-primary-container/10 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary text-4xl">shield</span>
                </div>
                <h3 className="font-semibold text-headline-md mb-3 text-on-background">
                  Seguridad
                </h3>
                <p className="text-on-surface-variant text-body-md">
                  Conductores certificados y vehículos monitoreados 24/7 con GPS para tu
                  tranquilidad.
                </p>
              </div>

              <div className="flex flex-col items-center p-8 rounded-xl bg-surface-container-lowest hover:shadow-lg transition-all border border-outline-variant/30">
                <div className="w-16 h-16 rounded-full bg-primary-container/10 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary text-4xl">
                    airline_seat_recline_extra
                  </span>
                </div>
                <h3 className="font-semibold text-headline-md mb-3 text-on-background">Confort</h3>
                <p className="text-on-surface-variant text-body-md">
                  Asientos ergonómicos, climatización inteligente y Wi-Fi de alta velocidad en cada
                  ruta.
                </p>
              </div>

              <div className="flex flex-col items-center p-8 rounded-xl bg-surface-container-lowest hover:shadow-lg transition-all border border-outline-variant/30">
                <div className="w-16 h-16 rounded-full bg-primary-container/10 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary text-4xl">payments</span>
                </div>
                <h3 className="font-semibold text-headline-md mb-3 text-on-background">
                  Mejor Precio
                </h3>
                <p className="text-on-surface-variant text-body-md">
                  Garantizamos las tarifas más competitivas sin sacrificar la calidad premium del
                  servicio.
                </p>
              </div>
            </div>
          </section>

          {/* Destinations Section */}
          <section className="py-24 bg-surface-container-low">
            <div className="max-w-7xl mx-auto px-8">
              <div className="flex justify-between items-end mb-12">
                <div>
                  <h2 className="font-semibold text-headline-lg text-on-surface mb-2">
                    Destinos Destacados
                  </h2>
                  <p className="text-on-surface-variant text-body-lg">
                    Explora la magia de Chile desde el norte hasta el sur.
                  </p>
                </div>
                <Link
                  href="/search"
                  className="text-primary font-semibold text-label-md flex items-center gap-1 hover:underline cursor-pointer"
                >
                  Ver todos
                  <span className="material-symbols-outlined">chevron_right</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Torres del Paine */}
                <div className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="h-64 overflow-hidden">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXziR6bIrgBiR7ZqgecmS8k7Ik1GiyAHTci3xcmpmN-4gOsNYrZhBNkP9Xcx2eGfjVO-RrepZj3HrbHZnqgtszCCjWB5anhOYoe0yM7NVp1WltR05TzwXtMHr1t_GmCI4WZ-O_DV2SS2ho7FOdXAdTYoFMas-nD48vyR-AjN4IouaNwoKNtl1u6SZI1hQEvOUqeS-2hq2DqLFEDxp24sHZPgQF6Fqp4Ka7T9xEoBvwC9-9jpyT9QMSNaw1sGUZ0vxKXHC3qX2h8r_g"
                      alt="Torres del Paine"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-headline-md text-on-surface">
                        Torres del Paine
                      </h3>
                      <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-label-sm font-semibold">
                        Popular
                      </span>
                    </div>
                    <p className="text-on-surface-variant text-body-md mb-4">
                      Aventúrate en el corazón de la Patagonia Chilena.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-label-sm text-outline uppercase tracking-wider font-semibold">
                          Desde
                        </span>
                        <span className="text-primary font-bold text-headline-md">$45.000</span>
                      </div>
                      <button
                        onClick={() => handlePresetSearch("Torres del Paine")}
                        className="p-3 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* San Pedro / Atacama */}
                <div className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="h-64 overflow-hidden">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9A-HsIvgd1U2LN6C4vHHX21RyZ4mV-1ljBXg6FCIGJtJeyGGsa4c5ss7JAaWeUueYx9TAEE6adX1jFk_JrBh-WlShV9mvCOo_WdmSuQWcnvmBEiwgkF6S9tpo4n1gg2Wh-xPui3HL1fKolu56lmxGD98AfqTIr-TxbkiB7ruedCe368Se-p5e3QujRd1cQydUb37A9e9t-mqqBcNYCTILFCuYcbo8l-ar3NVRBV_zROEOsOu-zOXonSiLupyCOZsfKMR6cVRmTmap"
                      alt="San Pedro de Atacama"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-headline-md text-on-surface">Atacama</h3>
                      <span className="bg-primary-container text-white px-3 py-1 rounded-full text-label-sm font-semibold">
                        Norte
                      </span>
                    </div>
                    <p className="text-on-surface-variant text-body-md mb-4">
                      Descubre los paisajes más áridos y estrellados del mundo.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-label-sm text-outline uppercase tracking-wider font-semibold">
                          Desde
                        </span>
                        <span className="text-primary font-bold text-headline-md">$32.500</span>
                      </div>
                      <button
                        onClick={() => handlePresetSearch("Atacama")}
                        className="p-3 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Viña del Mar */}
                <div className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="h-64 overflow-hidden">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwZ64XX4_ZbcuWx5JjOoxjRuRUTLm6Wd3zgv-9cKYaFZuR7ZUz02rD_1kTxGch8rmZSEY5qvJOVRiPjWpo3WD1AVIQbiOmJrFtRL8stmA2MnsWnZzWemUF-AbjHBqLun26dD29ESRtLT6hcHZyqM6DrLPmwcu4HRM6ROxkCaIp_5LR5KgLysuxOBfqsGcuMde6hOvnCbzq7f1xXd5OeIeB1-MZX-AJaBow65CVYF4Hd0HqtHbjnOIs5vQGoGsv7tuL0EPWPr-7d3ys"
                      alt="Viña del Mar"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-headline-md text-on-surface">
                        Viña del Mar
                      </h3>
                      <span className="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-full text-label-sm font-semibold">
                        Costa
                      </span>
                    </div>
                    <p className="text-on-surface-variant text-body-md mb-4">
                      Relájate en la ciudad jardín y sus hermosas playas.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-label-sm text-outline uppercase tracking-wider font-semibold">
                          Desde
                        </span>
                        <span className="text-primary font-bold text-headline-md">$18.900</span>
                      </div>
                      <button
                        onClick={() => handlePresetSearch("Viña del Mar")}
                        className="p-3 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Newsletter / CTA */}
          <section className="py-24 px-8 max-w-7xl mx-auto">
            <div className="max-w-4xl mx-auto bg-primary rounded-[2rem] p-12 text-center text-on-primary relative overflow-hidden shadow-2xl">
              {/* Abstract Background Patterns */}
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary-container/20 rounded-full blur-3xl"></div>

              <h2 className="font-semibold text-headline-lg mb-6 relative z-10 text-white">
                ¿Listo para tu próxima aventura?
              </h2>
              <p className="text-body-lg mb-10 opacity-90 relative z-10 text-white">
                Suscríbete para recibir ofertas exclusivas y guías de viaje directamente en tu
                correo.
              </p>

              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col md:flex-row gap-4 relative z-10 max-w-lg mx-auto"
              >
                <input
                  type="email"
                  className="flex-grow px-6 py-4 rounded-xl text-on-background bg-white border-none outline-none focus:ring-4 focus:ring-white/30 transition-all font-sans text-gray-900"
                  placeholder="tu@email.com"
                  required
                />
                <button
                  type="submit"
                  className="bg-on-background text-white px-8 py-4 rounded-xl font-semibold text-label-md hover:bg-surface-tint transition-all whitespace-nowrap cursor-pointer"
                >
                  Suscribirme
                </button>
              </form>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
