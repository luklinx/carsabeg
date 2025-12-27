"use client";

import React from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  id?: string;
  value: Date | null;
  onChange: (d: Date | null) => void;
  minDate?: Date;
  timeIntervals?: number; // minutes
  label?: string;
};

export default function DateTimePicker({
  id,
  value,
  onChange,
  minDate,
  timeIntervals = 30,
  label,
}: Props) {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // limit times to business hours by default (09:00 - 17:00)
  const filterTime = (time: Date) => {
    const hour = time.getHours();
    return hour >= 9 && hour < 17;
  };

  return (
    <div>
      {label ? (
        <label className="text-xs font-bold text-gray-700">{label}</label>
      ) : null}
      <div className="mt-1">
        <ReactDatePicker
          id={id}
          selected={value}
          onChange={onChange}
          showTimeSelect
          timeIntervals={timeIntervals}
          timeCaption="Time"
          dateFormat="yyyy-MM-dd HH:mm"
          minDate={minDate}
          filterTime={filterTime}
          className="w-full border px-3 py-2 rounded-lg"
        />
        <div className="text-xs text-gray-600 mt-1">
          Times shown in your timezone: {tz}
        </div>
      </div>
    </div>
  );
}
