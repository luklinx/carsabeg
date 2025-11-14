// src/server/index.ts
import express from "express";
import cors from "cors";
import type { Car } from "@/types";

const app = express();
app.use(cors());
app.use(express.json());

const cars: Car[] = [
  {
    id: "1",
    make: "Toyota",
    model: "Camry",
    year: 2018,
    price: 8500000,
    mileage: 68000,
    transmission: "automatic",
    fuel: "petrol",
    location: "Lagos",
    condition: "foreign used",
    images: ["/camry.jpg"],
    featured: true,
  },
];

app.get("/api/cars", (req, res) => {
  res.json({ success: true, data: cars });
});

app.get("/api/cars/:id", (req, res) => {
  const car = cars.find((c) => c.id === req.params.id);
  if (!car) return res.status(404).json({ success: false, error: "Not found" });
  res.json({ success: true, data: car });
});

export default app;
