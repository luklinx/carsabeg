// src/app/contact/page.tsx
export default function Contact() {
  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-center mb-12">
        Contact Cars Abeg
      </h1>
      <div className="max-w-2xl mx-auto">
        <form className="space-y-6">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-4 border rounded-lg"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            className="w-full p-4 border rounded-lg"
          />
          <textarea
            placeholder="Message"
            rows={5}
            className="w-full p-4 border rounded-lg"
          ></textarea>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-4 rounded-lg font-bold"
            onClick={(e) => {
              e.preventDefault();
              const name = (e.target as any).form[0].value;
              const phone = (e.target as any).form[1].value;
              const msg = (e.target as any).form[2].value;
              window.open(
                `https://wa.me/2348123456789?text=Name: ${name}%0APhone: ${phone}%0AMessage: ${msg}`
              );
            }}
          >
            Send via WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
}
