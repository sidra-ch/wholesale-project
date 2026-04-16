"use client";

import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 9999,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="p-2.5 hover:bg-light-gray transition-colors disabled:opacity-40"
      >
        <Minus className="h-4 w-4" />
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          const v = parseInt(e.target.value) || min;
          onChange(Math.min(max, Math.max(min, v)));
        }}
        className="w-16 text-center text-sm font-medium border-x border-gray-200 py-2 outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="p-2.5 hover:bg-light-gray transition-colors disabled:opacity-40"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
