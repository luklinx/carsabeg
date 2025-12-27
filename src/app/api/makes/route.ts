import { NextResponse } from "next/server";

// Small sample makes list. Replace or extend with a DB or external dataset as needed.
const MAKES = [
  "Toyota",
  "Honda",
  "Nissan",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Hyundai",
  "Kia",
  "Ford",
  "Chevrolet",
  "Lexus",
  "Mazda",
  "Volkswagen",
  "Mitsubishi",
  "Subaru",
  "Jeep",
  "Land Rover",
  "Porsche",
  "Tesla",
  "Volvo",
  "Renault",
  "Peugeot",
  "Fiat",
  "Suzuki",
  "Skoda",
  "Seat",
  "Mini",
  "Iveco",
  "Dodge",
  "Ram",
  "Other",
];

export function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || url.searchParams.get("query") || "").toLowerCase();
  const limit = Math.min(Number(url.searchParams.get("limit") || "20"), 200);

  const results = MAKES.filter((m) => m.toLowerCase().includes(q)).slice(0, limit);
  return NextResponse.json({ makes: results });
}
