"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { ComponentCarCardProps } from "@/types";
import { formatCompactNumber } from "@/lib/utils";

function calculateCarRent(city_mpg: number, year: number) {
  const age = Math.max(0, new Date().getFullYear() - year);
  // simple heuristic: base + mpg factor - age factor
  const base = 40;
  const mpgFactor = Math.round(city_mpg / 8);
  const ageFactor = Math.round(age * 0.6);
  return Math.max(15, base + mpgFactor - ageFactor);
}

function generateCarImageUrl(car: any) {
  if (Array.isArray(car.images) && car.images.length) return car.images[0];
  return "/placeholder.jpg";
}

import CustomButton from "./CustomButton";

export default function CarCardNew({ car }: ComponentCarCardProps) {
  const { city_mpg = 0, year = 2020, make, model, transmission = "a", drive = "f" } = car as any;
  const [isOpen, setIsOpen] = useState(false);

  const carRent = calculateCarRent(city_mpg, year);
  const img = generateCarImageUrl(car);

  return (
    <div className="car-card group bg-white rounded-2xl shadow-md p-4 flex flex-col">
      <div className="flex items-start justify-between">
        <h2 className="text-lg font-black">
          {make} {model}
        </h2>
      </div>

      <p className="flex mt-3 text-2xl leading-7 font-extrabold">
        <span className="self-start text-sm font-semibold mr-1">$</span>
        {carRent}
        <span className="self-end text-sm font-medium ml-2">/day</span>
      </p>

      <div className="relative w-full h-40 my-3">
        <Image src={img} alt="car" fill className="object-contain" />
      </div>

      <div className="flex items-center gap-4 mt-2">
        <div className="flex flex-col items-center text-sm text-gray-700">
          <Image src="/steering-wheel.svg" width={20} height={20} alt="steering" />
          <span className="mt-1">{transmission === "a" ? "Automatic" : "Manual"}</span>
        </div>

        <div className="flex flex-col items-center text-sm text-gray-700">
          <Image src="/tire.svg" width={20} height={20} alt="drive" />
          <span className="mt-1">{(drive || "").toUpperCase()}</span>
        </div>

        <div className="flex flex-col items-center text-sm text-gray-700">
          <Image src="/gas.svg" width={20} height={20} alt="mpg" />
          <span className="mt-1">{city_mpg} MPG</span>
        </div>
      </div>

      <div className="mt-4">
        <Link href={`/car/${(car as any).id || ""}`}> 
          <CustomButton
            title="View More"
            handleClick={() => setIsOpen(true)}
            containerStyles="w-full py-3 rounded-full bg-green-600 hover:bg-green-700"
            textStyles="text-white font-bold"
          />
        </Link>
      </div>
    </div>
  );
}
