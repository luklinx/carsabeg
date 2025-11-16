// src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-20">
      <div className="container mx-auto px-6 text-center">
        <p className="text-2xl font-bold mb-4">Cars Abeg</p>
        <p className="text-gray-400 mb-6">No Wahala. Just Quality Cars.</p>
        <p className="text-sm">
          © {new Date().getFullYear()} Cars Abeg. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
