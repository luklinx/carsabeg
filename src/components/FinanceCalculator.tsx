"use client";

import { useState, useMemo } from "react";
import CustomButton from "@/components/CustomButton";

interface Props {
  price: number;
}

function monthlyPayment(principal: number, annualRate: number, months: number) {
  if (months <= 0) return 0;
  const r = annualRate / 12 / 100; // monthly rate
  if (r === 0) return principal / months;
  return (r * principal) / (1 - Math.pow(1 + r, -months));
}

export default function FinanceCalculator({ price }: Props) {
  const [downPayment, setDownPayment] = useState(10); // percent
  const [interest, setInterest] = useState(12); // annual percent
  const [termYears, setTermYears] = useState(3);

  const dpAmount = useMemo(
    () => (price * downPayment) / 100,
    [price, downPayment]
  );
  const loanAmount = Math.max(0, price - dpAmount);
  const months = termYears * 12;
  const monthly = monthlyPayment(loanAmount, interest, months);

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-md border border-gray-100">
      <h3 className="text-lg font-black mb-3">Car Finance Calculator</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-gray-700">
            Vehicle price
          </label>
          <div className="text-xl font-black text-green-600">
            ₦{price.toLocaleString()}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-700">
            Down payment (%)
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-sm text-gray-600">
            {downPayment}% • ₦{dpAmount.toLocaleString()}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-700">
            Interest (annual %)
          </label>
          <input
            type="number"
            min={0}
            step={0.1}
            value={interest}
            onChange={(e) => setInterest(Number(e.target.value))}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-700">
            Term (years)
          </label>
          <select
            value={termYears}
            onChange={(e) => setTermYears(Number(e.target.value))}
            className="w-full border px-3 py-2 rounded-lg"
          >
            {[1, 2, 3, 4, 5, 6, 7].map((y) => (
              <option key={y} value={y}>
                {y} year{y > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 bg-gray-50 p-4 rounded-lg flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-600">Estimated monthly payment</div>
          <div
            key={Math.round(monthly)}
            className="text-2xl font-black text-gray-900 transition-transform duration-500 transform-gpu motion-reduce:transform-none"
          >
            ₦{Math.round(monthly).toLocaleString()}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Loan amount</div>
          <div className="font-black">
            ₦{Math.round(loanAmount).toLocaleString()}
          </div>
          <div className="text-xs text-gray-600">over {months} months</div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <CustomButton
          btnType="button"
          containerStyles="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-black"
        >
          Proceed to Apply
        </CustomButton>
        <CustomButton
          btnType="button"
          containerStyles="px-4 py-2 bg-white border border-gray-200 rounded-lg font-bold"
        >
          Download Plan
        </CustomButton>
      </div>
    </div>
  );
}
