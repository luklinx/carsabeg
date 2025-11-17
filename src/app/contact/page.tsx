// src/app/contact/page.tsx
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact - Cars Abeg",
  description: "Get in touch for car inquiries. No Wahala!",
};

export default function Contact() {
  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-center mb-12">
        Contact Cars Abeg
      </h1>
      <div className="max-w-2xl mx-auto">
        <p className="text-center text-gray-600 mb-8">
          Ready to get your ride? Chat with us!
        </p>
        <ContactForm />
      </div>
    </div>
  );
}
