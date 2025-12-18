import { Minus, Plus } from 'lucide-react';
import { Button } from './ui/button';

interface DFQuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function DFQuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
}: DFQuantitySelectorProps) {
  const handleDecrease = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || min;
    if (newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handleDecrease}
        disabled={value <= min}
        className="h-10 w-10 rounded bg-[var(--df-accent-gold)] hover:bg-[var(--df-accent-gold)]/90 text-white border-none disabled:opacity-50 disabled:bg-gray-300"
      >
        <Minus className="h-4 w-4" />
      </Button>

      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        min={min}
        max={max}
        className="w-16 h-10 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--df-accent-gold)]"
      />

      <Button
        variant="outline"
        size="icon"
        onClick={handleIncrease}
        disabled={value >= max}
        className="h-10 w-10 rounded bg-[var(--df-accent-gold)] hover:bg-[var(--df-accent-gold)]/90 text-white border-none disabled:opacity-50 disabled:bg-gray-300"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
