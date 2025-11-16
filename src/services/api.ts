// src/services/api.ts
// OFFLINE MODE — NO API CALLS
export const fetchCars = async () => {
  // Mock data — same as your Express server
  return [
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
      description:
        "Super clean Tokunbo Camry. First body, leather seat, thumbstart.",
    },
    {
      id: "2",
      make: "Honda",
      model: "Accord",
      year: 2019,
      price: 9200000,
      mileage: 52000,
      transmission: "automatic",
      fuel: "petrol",
      location: "Abuja",
      condition: "foreign used",
      images: ["/accord.jpg"],
      featured: true,
    },
    {
      id: "3",
      make: "Toyota",
      model: "Corolla",
      year: 2020,
      price: 7200000,
      mileage: 92000,
      transmission: "automatic",
      fuel: "petrol",
      location: "Lagos",
      condition: "nigerian used",
      images: ["/corolla.jpg"],
    },
    {
      id: "4",
      make: "Mercedes-Benz",
      model: "C300",
      year: 2017,
      price: 15500000,
      mileage: 45000,
      transmission: "automatic",
      fuel: "petrol",
      location: "Lagos",
      condition: "foreign used",
      images: ["/c300.jpg"],
      featured: true,
    },
  ];
};
