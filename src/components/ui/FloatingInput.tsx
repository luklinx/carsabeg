"use client";

import React, { useState, useEffect } from "react";

type Option = { value: string; label: string };

interface FloatingInputProps {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string | number | undefined;
  placeholder?: string;
  className?: string;
  as?: "input" | "textarea" | "select";
  options?: Option[];
  min?: number;
  inputClassName?: string;
  inputProps?:
    | React.InputHTMLAttributes<HTMLInputElement>
    | React.TextareaHTMLAttributes<HTMLTextAreaElement>
    | React.SelectHTMLAttributes<HTMLSelectElement>;
}

export default function FloatingInput({
  name,
  label,
  type = "text",
  defaultValue,
  placeholder = "",
  className = "",
  as = "input",
  options = [],
  min,
  inputClassName,
  inputProps,
}: FloatingInputProps) {
  const [value, setValue] = useState<string>(
    defaultValue === undefined || defaultValue === null
      ? ""
      : String(defaultValue)
  );

  useEffect(() => {
    setValue(
      defaultValue === undefined || defaultValue === null
        ? ""
        : String(defaultValue)
    );
  }, [defaultValue]);

  const baseInputClasses = inputClassName
    ? inputClassName
    : `peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-rose-600 ${className}`;

  return (
    <div className="relative">
      {as === "input" && (
        <>
          <input
            name={name}
            type={type}
            defaultValue={defaultValue as string | number | undefined}
            placeholder=" "
            min={min}
            className={baseInputClasses}
            onChange={(e) => setValue(e.target.value)}
            aria-label={label}
            {...(inputProps as React.InputHTMLAttributes<HTMLInputElement>)}
          />
          <label
            htmlFor={name}
            className={`absolute left-0 -top-3.5 text-gray-600 text-sm transition-all pointer-events-none bg-white px-1
              peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-2
              peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm`}
          >
            {label}
          </label>
        </>
      )}

      {as === "textarea" && (
        <>
          <textarea
            name={name}
            defaultValue={defaultValue as string | number | undefined}
            placeholder=" "
            rows={4}
            className={`peer w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-rose-600 ${className}`}
            onChange={(e) => setValue(e.target.value)}
            aria-label={label}
            {...(inputProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
          <label
            htmlFor={name}
            className={`absolute left-0 -top-3.5 text-gray-600 text-sm transition-all pointer-events-none bg-white px-1
              peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-3
              peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm`}
          >
            {label}
          </label>
        </>
      )}

      {as === "select" && (
        <>
          <select
            name={name}
            defaultValue={defaultValue as string | number | undefined}
            className={baseInputClasses}
            onChange={(e) => setValue(e.target.value)}
            aria-label={label}
            {...(inputProps as React.SelectHTMLAttributes<HTMLSelectElement>)}
          >
            <option value="">{placeholder || label}</option>
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <label
            className={`absolute left-0 transition-all pointer-events-none bg-white px-1
              ${
                value
                  ? "-top-3.5 text-sm text-gray-600"
                  : "top-2 text-base text-gray-600"
              }
              peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm`}
          >
            {label}
          </label>
        </>
      )}
    </div>
  );
}
