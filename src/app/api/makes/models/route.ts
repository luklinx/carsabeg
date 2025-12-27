import { NextResponse } from "next/server";

// Sample models map. Extend or back with a DB for production-scale lists.
const MODELS: Record<string, string[]> = {
  Toyota: ["Corolla", "Camry", "RAV4", "Land Cruiser", "Hilux"],
  Honda: ["Civic", "Accord", "CR-V", "HR-V", "Pilot"],
  Nissan: ["Altima", "Sentra", "X-Trail", "Patrol", "Kicks"],
  BMW: ["3 Series", "5 Series", "X3", "X5", "7 Series"],
  "Mercedes-Benz": ["C-Class", "E-Class", "S-Class", "GLC", "GLE"],
  Audi: ["A3", "A4", "A6", "Q3", "Q5"],
  Hyundai: ["Elantra", "Sonata", "Tucson", "Santa Fe", "Palisade"],
  Kia: ["Rio", "Forte", "Sportage", "Sorento", "Telluride"],
  Ford: ["Fiesta", "Focus", "Mondeo", "Escape", "Explorer", "F-150"],
  Chevrolet: ["Spark", "Aveo", "Malibu", "Cruze", "Equinox", "Trailblazer"],
  Lexus: ["IS", "ES", "RX", "NX", "LX"],
  Mazda: ["Mazda3", "Mazda6", "CX-3", "CX-5", "CX-9"],
  Volkswagen: ["Golf", "Passat", "Polo", "Tiguan", "Touareg"],
  Mitsubishi: ["Lancer", "Outlander", "Pajero", "ASX", "Mirage"],
  Subaru: ["Impreza", "Forester", "Outback", "Legacy", "Crosstrek"],
  Jeep: ["Wrangler", "Cherokee", "Grand Cherokee", "Compass", "Renegade"],
  "Land Rover": ["Discovery", "Range Rover", "Defender", "Evoque"],
  Porsche: ["911", "Cayenne", "Macan", "Panamera"],
  Tesla: ["Model S", "Model 3", "Model X", "Model Y"],
  Volvo: ["S60", "S90", "XC40", "XC60", "XC90"],
  Renault: ["Clio", "Megane", "Duster", "Koleos"],
  Peugeot: ["208", "308", "3008", "5008"],
  Fiat: ["500", "Panda", "Tipo", "Punto"],
  Suzuki: ["Swift", "Vitara", "Ignis", "Jimny"],
  Skoda: ["Octavia", "Fabia", "Superb", "Kodiaq"],
  Seat: ["Ibiza", "Leon", "Ateca", "Arona"],
  Mini: ["Cooper", "Countryman"],
  Iveco: ["Daily", "Eurocargo"],
  Dodge: ["Charger", "Challenger", "Durango"],
  Ram: ["1500", "2500"],
  Other: [],
};

export function GET(req: Request) {
  const url = new URL(req.url);
  const make = url.searchParams.get("make") || "";
  const q = (url.searchParams.get("q") || "").toLowerCase();

  const list = MODELS[make] || [];
  const filtered = q ? list.filter((m) => m.toLowerCase().includes(q)) : list;
  return NextResponse.json({ models: filtered });
}
