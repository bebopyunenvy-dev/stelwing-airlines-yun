'use client';
import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  text_font_size?: string;
  text_font_weight?: string;
  text_line_height?: string;
  text_color?: string;
  fill_background_color?: string;
  border_border_radius?: string;
}

const Button = ({
  text,
  text_font_size = 'text-base',
  text_font_weight = 'font-medium',
  text_line_height = 'leading-normal',
  text_color = 'text-white',
  fill_background_color = 'bg-[#DCBB87]',
  border_border_radius = 'rounded-full',
  className = '',
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`${text_font_size} ${text_font_weight} ${text_line_height} ${text_color} ${fill_background_color} ${border_border_radius} transition-all duration-200 ${className}`}
      {...props}
    >
      {text}
    </button>
  );
};

export default Button;
