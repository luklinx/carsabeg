// src/app/page.tsx
// import CarCard from "@/components/CarCard";
import ClientHome from "@/components/ClientHome"; // ← NEW COMPONENT

export const revalidate = 0;

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <section className="text-center py-20 px-6 bg-gradient-to-b from-green-600 to-green-800 text-white">
        <h1 className="text-7xl md:text-9xl font-black mb-4">CARS ABEG</h1>
        <p className="text-3xl md:text-3xl font-bold">
          Tokunbo & Nigerian Used
        </p>
        <p className="text-xl mt-4">Clean Cars • Verified • Instant Buyers</p>
      </section>

      {/* CLIENT-SIDE CARS — THIS FIXES EVERYTHING */}
      <ClientHome />
    </main>
  );
}
