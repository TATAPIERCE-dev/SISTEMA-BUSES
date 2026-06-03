import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface BusUnit {
  id: string;
  plate: string;
  model: string;
  capacity: number;
  status: "Activo" | "Mantenimiento" | "Fuera de Servicio";
  lastRoute: string;
  floors: 1 | 2;
}

export default function FleetPage() {
  const [buses, setBuses] = useState<BusUnit[]>([
    {
      id: "1",
      plate: "ABC-1234",
      model: "Scania Touring K-Series",
      capacity: 45,
      status: "Activo",
      lastRoute: "Santiago - Valparaíso",
      floors: 1,
    },
    {
      id: "2",
      plate: "XYZ-9876",
      model: "Mercedes-Benz Travego",
      capacity: 52,
      status: "Mantenimiento",
      lastRoute: "Santiago - Concepción",
      floors: 1,
    },
    {
      id: "3",
      plate: "JKL-5566",
      model: "Volvo 9700 Grand L",
      capacity: 60,
      status: "Activo",
      lastRoute: "Santiago - La Serena",
      floors: 2,
    },
    {
      id: "4",
      plate: "MNP-1122",
      model: "Irizar i8 Premium",
      capacity: 38,
      status: "Fuera de Servicio",
      lastRoute: "-",
      floors: 1,
    },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPlate, setNewPlate] = useState("");
  const [newCapacity, setNewCapacity] = useState("");
  const [newModel, setNewModel] = useState("Scania Touring K-Series");
  const [newStatus, setNewStatus] = useState<"Activo" | "Mantenimiento">("Activo");
  const [newFloors, setNewFloors] = useState<1 | 2>(1);

  const totalFleetCount = buses.length;
  const activeCount = buses.filter((b) => b.status === "Activo").length;
  const maintenanceCount = buses.filter((b) => b.status === "Mantenimiento").length;
  const totalCapacity = buses.reduce((sum, b) => sum + b.capacity, 0);
  const availabilityRate =
    totalFleetCount > 0 ? ((activeCount / totalFleetCount) * 100).toFixed(1) : "0.0";

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewPlate("");
    setNewCapacity("");
  };

  const handleSaveBus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlate || !newCapacity) {
      return;
    }
    setBuses((prev) => [
      {
        id: String(Date.now()),
        plate: newPlate.toUpperCase(),
        model: newModel,
        capacity: parseInt(newCapacity) || 40,
        status: newStatus,
        lastRoute: "-",
        floors: newFloors,
      },
      ...prev,
    ]);
    handleCloseModal();
  };

  const handleDeleteBus = (id: string) => {
    if (window.confirm("¿Eliminar vehículo?")) {
      setBuses((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBuses = buses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(buses.length / itemsPerPage);

  return (
    <>
      <Head title="Gestión de Flota" />
      <AdminLayout onOpenRegisterModal={handleOpenModal}>
        <main className="p-6 md:p-8 lg:p-10 max-w-[1400px] mx-auto">
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Flota</h2>
              <p className="text-gray-500 mt-0.5">
                Supervisión en tiempo real de unidades operativas.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500 font-semibold">Total Flota</span>
                    <span className="bg-blue-100 text-blue-600 p-2 rounded-lg">🚌</span>
                  </div>
                  <div className="text-3xl font-black text-gray-900">{totalFleetCount}</div>
                  <div className="text-blue-600 text-sm mt-2 font-bold">+3 este mes</div>
                </CardContent>
              </Card>
              <Card className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500 font-semibold">En Operación</span>
                    <span className="bg-green-100 text-green-600 p-2 rounded-lg">✅</span>
                  </div>
                  <div className="text-3xl font-black text-gray-900">{activeCount}</div>
                  <div className="text-gray-500 text-sm mt-2">
                    {availabilityRate}% disponibilidad
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500 font-semibold">Mantenimiento</span>
                    <span className="bg-amber-100 text-amber-600 p-2 rounded-lg">🔧</span>
                  </div>
                  <div className="text-3xl font-black text-gray-900">{maintenanceCount}</div>
                  <div className="text-red-600 text-sm mt-2 font-bold">2 Urgentes</div>
                </CardContent>
              </Card>
              <Card className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500 font-semibold">Capacidad Total</span>
                    <span className="bg-gray-100 text-gray-600 p-2 rounded-lg">👥</span>
                  </div>
                  <div className="text-3xl font-black text-gray-900">
                    {totalCapacity.toLocaleString("es-CL")}
                  </div>
                  <div className="text-gray-500 text-sm mt-2">Asientos disponibles</div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-4 text-sm font-bold text-gray-500">Placa</th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-500">Modelo</th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-500">Capacidad</th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-500">Estado</th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-500">Última Ruta</th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-500 text-center">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentBuses.map((bus) => (
                      <tr key={bus.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-blue-600">{bus.plate}</td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">{bus.model}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                          <div>{bus.capacity} Pasajeros</div>
                          <div className="text-gray-500 text-xs mt-0.5">
                            {bus.floors} Piso{bus.floors > 1 ? "s" : ""}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={cn(
                              "px-3 py-1 rounded-full text-xs inline-flex items-center gap-1 font-bold",
                              bus.status === "Activo" && "bg-green-100 text-green-700",
                              bus.status === "Mantenimiento" && "bg-amber-100 text-amber-700",
                              bus.status === "Fuera de Servicio" && "bg-red-100 text-red-700",
                            )}
                          >
                            <span
                              className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                bus.status === "Activo" && "bg-green-500",
                                bus.status === "Mantenimiento" && "bg-amber-500",
                                bus.status === "Fuera de Servicio" && "bg-red-500",
                              )}
                            ></span>
                            {bus.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                          {bus.lastRoute}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              href="/admin/configurator"
                              title="Editar"
                              className="p-1.5 hover:bg-blue-100 rounded-lg text-blue-600 transition-all inline-block"
                            >
                              ✏️
                            </Link>
                            <button
                              onClick={() => handleDeleteBus(bus.id)}
                              title="Eliminar"
                              className="p-1.5 hover:bg-red-100 rounded-lg text-red-600 transition-all"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 bg-gray-50 flex justify-between items-center border-t border-gray-200">
                <span className="text-sm text-gray-500 font-medium">
                  Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, buses.length)} de{" "}
                  {buses.length}
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-30"
                  >
                    ◀
                  </button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={cn(
                        "w-8 h-8 rounded-lg font-bold text-sm",
                        currentPage === i + 1
                          ? "bg-blue-600 text-white shadow-sm"
                          : "hover:bg-gray-200 text-gray-500",
                      )}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-30"
                  >
                    ▶
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <Card className="bg-white w-full max-w-lg rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">Registrar Nueva Unidad</h3>
                <button onClick={handleCloseModal} className="p-1.5 hover:bg-gray-100 rounded-full">
                  ✕
                </button>
              </div>
              <form onSubmit={handleSaveBus}>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="regPlate">Placa</Label>
                      <Input
                        id="regPlate"
                        placeholder="ABC-1234"
                        value={newPlate}
                        onChange={(e) => setNewPlate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="regCapacity">Capacidad</Label>
                      <Input
                        id="regCapacity"
                        type="number"
                        placeholder="45"
                        min={10}
                        max={90}
                        value={newCapacity}
                        onChange={(e) => setNewCapacity(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="regModel">Modelo</Label>
                    <select
                      id="regModel"
                      value={newModel}
                      onChange={(e) => setNewModel(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                    >
                      <option value="Scania Touring K-Series">Scania Touring K-Series</option>
                      <option value="Mercedes-Benz Travego">Mercedes-Benz Travego</option>
                      <option value="Volvo 9700 Grand L">Volvo 9700 Grand L</option>
                      <option value="Irizar i8 Premium">Irizar i8 Premium</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Pisos</Label>
                    <div className="flex gap-6 mt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-700">
                        <input
                          type="radio"
                          name="floors"
                          checked={newFloors === 1}
                          onChange={() => setNewFloors(1)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span>1 Piso</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-700">
                        <input
                          type="radio"
                          name="floors"
                          checked={newFloors === 2}
                          onChange={() => setNewFloors(2)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span>2 Pisos</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Estado</Label>
                    <div className="flex gap-6 mt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-700">
                        <input
                          type="radio"
                          name="status"
                          checked={newStatus === "Activo"}
                          onChange={() => setNewStatus("Activo")}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span>Activo</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-700">
                        <input
                          type="radio"
                          name="status"
                          checked={newStatus === "Mantenimiento"}
                          onChange={() => setNewStatus("Mantenimiento")}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span>Mantenimiento</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-gray-50 flex justify-end gap-3 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-200 rounded-lg"
                  >
                    Cancelar
                  </button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
                  >
                    Guardar
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </AdminLayout>
    </>
  );
}
