import { useState } from "react";
import { Head, router, Link } from "@inertiajs/react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ConfigCell {
  colIndex: number;
  type: "empty" | "seat" | "wc" | "exit" | "coffee";
  label: string;
}
type FloorGrid = { row1: ConfigCell[]; row2: ConfigCell[] };
type ActiveTool = "seat" | "wc" | "exit" | "coffee" | "clear";

export default function BusConfiguratorPage() {
  const [internalName, setInternalName] = useState("V-204 Santiago Express");
  const [plate, setPlate] = useState("ABCD-12");
  const [serviceType, setServiceType] = useState("Salón Cama");
  const [floorsCount, setFloorsCount] = useState<1 | 2>(1);
  const [activeTab, setActiveTab] = useState<1 | 2>(1);
  const [activeTool, setActiveTool] = useState<ActiveTool>("seat");

  const createEmptyRow = (count = 11): ConfigCell[] =>
    Array.from({ length: count }, (_, i) => ({ colIndex: i, type: "empty", label: "" }));

  const [floor1Grid, setFloor1Grid] = useState<FloorGrid>({
    row1: [
      { colIndex: 0, type: "seat", label: "1" },
      { colIndex: 1, type: "seat", label: "4" },
      { colIndex: 2, type: "seat", label: "7" },
      { colIndex: 3, type: "seat", label: "10" },
      { colIndex: 4, type: "empty", label: "" },
      { colIndex: 5, type: "empty", label: "" },
      { colIndex: 6, type: "wc", label: "wc" },
      { colIndex: 7, type: "empty", label: "" },
      { colIndex: 8, type: "seat", label: "25" },
      { colIndex: 9, type: "seat", label: "28" },
      { colIndex: 10, type: "seat", label: "31" },
    ],
    row2: [
      { colIndex: 0, type: "seat", label: "2" },
      { colIndex: 1, type: "seat", label: "5" },
      { colIndex: 2, type: "seat", label: "8" },
      { colIndex: 3, type: "empty", label: "" },
      { colIndex: 4, type: "seat", label: "14" },
      { colIndex: 5, type: "seat", label: "17" },
      { colIndex: 6, type: "empty", label: "" },
      { colIndex: 7, type: "seat", label: "23" },
      { colIndex: 8, type: "empty", label: "" },
      { colIndex: 9, type: "seat", label: "29" },
      { colIndex: 10, type: "exit", label: "🚪" },
    ],
  });

  const [floor2Grid, setFloor2Grid] = useState<FloorGrid>({
    row1: [
      { colIndex: 0, type: "seat", label: "32" },
      { colIndex: 1, type: "seat", label: "35" },
      { colIndex: 2, type: "seat", label: "38" },
      ...createEmptyRow(8).map((c, idx) => ({ ...c, colIndex: idx + 3 })),
    ],
    row2: [
      { colIndex: 0, type: "seat", label: "33" },
      { colIndex: 1, type: "seat", label: "36" },
      { colIndex: 2, type: "seat", label: "39" },
      ...createEmptyRow(8).map((c, idx) => ({ ...c, colIndex: idx + 3 })),
    ],
  });

  const handleSetFloors = (num: 1 | 2) => {
    setFloorsCount(num);
    if (num === 1) {
      setActiveTab(1);
    }
  };

  const handleCellClick = (rowIndex: 1 | 2, colIndex: number) => {
    const activeGrid = activeTab === 1 ? floor1Grid : floor2Grid;
    const setGrid = activeTab === 1 ? setFloor1Grid : setFloor2Grid;
    const currentRow = rowIndex === 1 ? [...activeGrid.row1] : [...activeGrid.row2];
    const targetCell = { ...currentRow[colIndex] };

    if (activeTool === "clear") {
      targetCell.type = "empty";
      targetCell.label = "";
    } else if (activeTool === "seat") {
      if (targetCell.type === "seat") {
        targetCell.type = "empty";
        targetCell.label = "";
      } else {
        const f1Seats = [...floor1Grid.row1, ...floor1Grid.row2].filter(
          (c) => c.type === "seat",
        ).length;
        const f2Seats =
          floorsCount === 2
            ? [...floor2Grid.row1, ...floor2Grid.row2].filter((c) => c.type === "seat").length
            : 0;
        targetCell.type = "seat";
        targetCell.label = (f1Seats + f2Seats + 1).toString();
      }
    } else if (activeTool === "wc") {
      targetCell.type = "wc";
      targetCell.label = "🚽";
    } else if (activeTool === "exit") {
      targetCell.type = "exit";
      targetCell.label = "🚪";
    } else if (activeTool === "coffee") {
      targetCell.type = "coffee";
      targetCell.label = "☕";
    }

    currentRow[colIndex] = targetCell;
    setGrid({
      row1: rowIndex === 1 ? currentRow : activeGrid.row1,
      row2: rowIndex === 2 ? currentRow : activeGrid.row2,
    });
  };

  const getCounts = () => {
    const combined = [
      ...floor1Grid.row1,
      ...floor1Grid.row2,
      ...(floorsCount === 2 ? [...floor2Grid.row1, ...floor2Grid.row2] : []),
    ];
    const seatsCount = combined.filter((c) => c.type === "seat").length;
    const servicesCount = combined.filter((c) => ["wc", "exit", "coffee"].includes(c.type)).length;
    const loadCapacity = (seatsCount * 0.28 + servicesCount * 0.15).toFixed(1);
    return { seatsCount, servicesCount, loadCapacity };
  };

  const { seatsCount, servicesCount, loadCapacity } = getCounts();

  const handleSaveConfiguration = () => {
    if (!internalName || !plate) {
      alert("Completa los campos obligatorios.");
      return;
    }
    alert(`Unidad ${internalName} (${plate}) guardada.`);
    router.visit("/admin/fleet");
  };

  const renderConfigCell = (cell: ConfigCell, rowIndex: 1 | 2) => (
    <div
      key={cell.colIndex}
      onClick={() => handleCellClick(rowIndex, cell.colIndex)}
      className={cn(
        "w-12 h-12 flex items-center justify-center rounded-lg border-2 cursor-pointer text-sm transition-all hover:scale-[1.05] hover:border-blue-600 active:scale-95",
        cell.type === "empty" && "border-dashed border-gray-300 text-gray-400 hover:bg-gray-100",
        cell.type === "seat" && "border-blue-600 bg-blue-50 text-blue-600 font-bold shadow-sm",
        cell.type === "wc" && "border-green-500 bg-green-50 text-green-600",
        cell.type === "exit" && "border-amber-500 bg-amber-50 text-amber-600",
        cell.type === "coffee" && "border-gray-500 bg-gray-100 text-gray-700",
      )}
    >
      {cell.type === "seat" ? cell.label : <span className="text-lg">{cell.label}</span>}
    </div>
  );

  return (
    <>
      <Head title="Configurador de Autobús" />
      <AdminLayout>
        <main className="p-6 md:p-8 lg:p-10 max-w-[1400px] mx-auto">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Configurador de Autobús</h2>
                <p className="text-gray-500 mt-0.5">
                  Diseña la distribución de asientos y servicios.
                </p>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/admin/fleet"
                  className="px-6 py-2 rounded-lg border border-blue-600 text-blue-600 font-bold hover:bg-blue-50 text-sm inline-flex items-center justify-center"
                >
                  Cancelar
                </Link>
                <Button
                  onClick={handleSaveConfiguration}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Guardar
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              <section className="xl:col-span-3 flex flex-col gap-6">
                <Card className="p-6 border border-gray-200 shadow-sm bg-white">
                  <CardContent className="p-0 flex flex-col gap-5">
                    <h3 className="text-sm text-blue-600 font-black uppercase tracking-wider">
                      Información Básica
                    </h3>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="intName">Nombre Interno</Label>
                        <Input
                          id="intName"
                          value={internalName}
                          onChange={(e) => setInternalName(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="plPlate">Placa</Label>
                        <Input
                          id="plPlate"
                          value={plate}
                          onChange={(e) => setPlate(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="srvType">Tipo de Servicio</Label>
                        <select
                          id="srvType"
                          value={serviceType}
                          onChange={(e) => setServiceType(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                        >
                          <option value="Salón Cama">Salón Cama</option>
                          <option value="Semicama">Semicama</option>
                          <option value="Premium Suite">Premium Suite</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="p-6 border border-gray-200 shadow-sm bg-white">
                  <CardContent className="p-0 flex flex-col gap-4">
                    <h3 className="text-sm text-blue-600 font-black uppercase tracking-wider">
                      Estructura
                    </h3>
                    <div className="flex p-1 bg-gray-100 border border-gray-200 rounded-lg">
                      <button
                        onClick={() => handleSetFloors(1)}
                        className={cn(
                          "flex-1 py-2 text-sm rounded-md font-bold transition-all",
                          floorsCount === 1
                            ? "bg-white shadow-sm text-blue-600"
                            : "text-gray-500 hover:bg-white/40",
                        )}
                      >
                        1 Piso
                      </button>
                      <button
                        onClick={() => handleSetFloors(2)}
                        className={cn(
                          "flex-1 py-2 text-sm rounded-md font-medium transition-all",
                          floorsCount === 2
                            ? "bg-white shadow-sm text-blue-600"
                            : "text-gray-500 hover:bg-white/40",
                        )}
                      >
                        2 Pisos
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </section>

              <section className="xl:col-span-6 flex flex-col gap-4 overflow-hidden">
                {floorsCount === 2 && (
                  <div className="flex items-end border-b border-gray-200 px-2 gap-2">
                    <button
                      onClick={() => setActiveTab(1)}
                      className={cn(
                        "px-6 py-2.5 text-sm rounded-t-lg transition-colors border-b-2 font-bold cursor-pointer",
                        activeTab === 1
                          ? "text-blue-600 border-blue-600 bg-gray-50 font-black"
                          : "text-gray-500 border-transparent hover:bg-gray-100",
                      )}
                    >
                      Nivel 1
                    </button>
                    <button
                      onClick={() => setActiveTab(2)}
                      className={cn(
                        "px-6 py-2.5 text-sm rounded-t-lg transition-colors border-b-2 font-bold cursor-pointer",
                        activeTab === 2
                          ? "text-blue-600 border-blue-600 bg-gray-50 font-black"
                          : "text-gray-500 border-transparent hover:bg-gray-100",
                      )}
                    >
                      Nivel 2
                    </button>
                  </div>
                )}
                <div className="relative bg-gray-100 rounded-2xl border border-gray-200 p-8 overflow-x-auto min-h-[400px] flex flex-col items-center justify-center">
                  <div className="relative bg-white border-4 border-gray-300 rounded-l-[60px] rounded-r-[20px] shadow-md w-[700px] h-[280px] flex flex-col p-4 shrink-0">
                    <div className="absolute left-0 top-0 bottom-0 w-20 border-r-4 border-gray-300 bg-gray-50 flex flex-col items-center justify-center gap-2 rounded-l-[56px]">
                      <div className="w-10 h-10 rounded-full border-2 border-blue-600 flex items-center justify-center text-blue-600 bg-blue-50">
                        🧑
                      </div>
                      <span className="text-[10px] font-black text-gray-400 uppercase">Cabina</span>
                    </div>
                    <div className="ml-20 flex-grow flex flex-col justify-between py-2.5 px-4 h-full">
                      <div className="flex gap-2 justify-start">
                        {(activeTab === 1 ? floor1Grid.row1 : floor2Grid.row1).map((cell) =>
                          renderConfigCell(cell, 1),
                        )}
                      </div>
                      <div className="w-full h-8 bg-gray-200 rounded-full opacity-60 flex items-center px-4 border border-gray-300">
                        <span className="text-[10px] text-gray-400 font-black tracking-[1em] uppercase">
                          Pasillo
                        </span>
                      </div>
                      <div className="flex gap-2 justify-start">
                        {(activeTab === 1 ? floor1Grid.row2 : floor2Grid.row2).map((cell) =>
                          renderConfigCell(cell, 2),
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-4 bg-white/90 px-4 py-2 rounded-full border border-gray-200 text-[10px] font-bold text-gray-500 shadow-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-2.5 h-2.5 rounded bg-blue-50 border border-blue-600"></div>
                      <span>ASIENTO</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2.5 h-2.5 rounded bg-green-50 border border-green-500"></div>
                      <span>WC</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2.5 h-2.5 rounded bg-amber-50 border border-amber-500"></div>
                      <span>SALIDA</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2.5 h-2.5 rounded bg-gray-100 border border-gray-500"></div>
                      <span>CAFÉ</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2.5 h-2.5 rounded border-2 border-dashed border-gray-300"></div>
                      <span>VACÍO</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="xl:col-span-3">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
                  <div className="p-6 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-sm text-blue-600 font-black uppercase tracking-wider">
                      Herramientas
                    </h3>
                    <p className="text-[12px] text-gray-500 mt-1">
                      Selecciona una herramienta y luego haz clic en una casilla.
                    </p>
                  </div>
                  <div className="p-4 grid grid-cols-2 gap-3">
                    {[
                      {
                        tool: "seat" as const,
                        icon: "💺",
                        label: "Asiento",
                        active: "border-blue-600 bg-blue-50 text-blue-600",
                        inactive:
                          "border-transparent bg-gray-100 hover:border-gray-300 text-gray-500",
                      },
                      {
                        tool: "wc" as const,
                        icon: "🚽",
                        label: "Baño",
                        active: "border-green-500 bg-green-50 text-green-600",
                        inactive:
                          "border-transparent bg-gray-100 hover:border-gray-300 text-gray-500",
                      },
                      {
                        tool: "exit" as const,
                        icon: "🚪",
                        label: "Salida",
                        active: "border-amber-500 bg-amber-50 text-amber-600",
                        inactive:
                          "border-transparent bg-gray-100 hover:border-gray-300 text-gray-500",
                      },
                      {
                        tool: "coffee" as const,
                        icon: "☕",
                        label: "Café",
                        active: "border-gray-500 bg-gray-100 text-gray-700",
                        inactive:
                          "border-transparent bg-gray-100 hover:border-gray-300 text-gray-500",
                      },
                    ].map(({ tool, icon, label, active, inactive }) => (
                      <button
                        key={tool}
                        onClick={() => setActiveTool(tool)}
                        className={cn(
                          "flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all h-20",
                          activeTool === tool ? active : inactive,
                        )}
                      >
                        <span className="text-xl mb-1">{icon}</span>
                        <span className="text-xs font-bold">{label}</span>
                      </button>
                    ))}
                    <button
                      onClick={() => setActiveTool("clear")}
                      className={cn(
                        "col-span-2 flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all h-16",
                        activeTool === "clear"
                          ? "border-red-500 bg-red-50 text-red-600 font-bold"
                          : "border-transparent bg-gray-100 hover:border-gray-300 text-gray-500",
                      )}
                    >
                      <span className="text-xl mb-0.5">🗑️</span>
                      <span className="text-xs font-bold">Borrar Elemento</span>
                    </button>
                  </div>
                  <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-bold text-gray-900">Resumen</span>
                      <span className="px-2 py-0.5 bg-blue-600 rounded text-[9px] text-white font-black">
                        AUTO
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500 font-medium">Asientos:</span>
                        <span className="font-bold text-gray-900">{seatsCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 font-medium">Servicios:</span>
                        <span className="font-bold text-gray-900">{servicesCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 font-medium">Carga:</span>
                        <span className="font-bold text-gray-900">{loadCapacity}t</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </AdminLayout>
    </>
  );
}
