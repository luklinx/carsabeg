// src/app/inventory/page.tsx
import { useSearchParams } from "next/navigation";
import { fetchCars } from "@/services/api";
import { Car } from "@/types";
import CarCard from "@/components/CarCard";

export default async function Inventory({
  searchParams,
}: {
  searchParams: {
    make?: string;
    minPrice?: string;
    maxPrice?: string;
    condition?: string;
    year?: string;
  };
}) {
  const cars: Car[] = await fetchCars();
  const { make, minPrice, maxPrice, condition, year } = searchParams;

  const filtered = cars.filter((car) => {
    if (make && car.make.toLowerCase() !== make.toLowerCase()) return false;
    if (minPrice && car.price < Number(minPrice)) return false;
    if (maxPrice && car.price > Number(maxPrice)) return false;
    if (condition && car.condition.toLowerCase() !== condition.toLowerCase())
      return false;
    if (year && car.year !== Number(year)) return false;
    return true;
  });

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-800/70 mb-8">
        Cars for Sale
      </h1>
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <h3 className="text-xl font-bold text-gray-800/70">Filters</h3>
          <div className="space-y-4">
            <select defaultValue="" className="w-full p-3 border rounded-lg">
              <option value="">All Makes</option>
              <option value="Toyota">Toyota</option>
              <option value="Honda">Honda</option>
              <option value="Mercedes-Benz">Mercedes</option>
            </select>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Price Range</label>
              <input
                type="number"
                placeholder="Min ₦"
                defaultValue={minPrice}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Max ₦"
                defaultValue={maxPrice}
                className="w-full p-2 border rounded"
              />
            </div>
            <select defaultValue="" className="w-full p-3 border rounded-lg">
              <option value="">All Conditions</option>
              <option value="foreign used">Foreign Used</option>
              <option value="nigerian used">Nigerian Used</option>
              <option value="brand new">Brand New</option>
            </select>
            <input
              type="number"
              placeholder="Year"
              defaultValue={year}
              className="w-full p-3 border rounded-lg"
            />
            <button className="w-full bg-green-600 text-white py-3 rounded-lg font-bold">
              Apply Filters
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          <p className="mb-6 text-gray-600">{filtered.length} cars found</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
