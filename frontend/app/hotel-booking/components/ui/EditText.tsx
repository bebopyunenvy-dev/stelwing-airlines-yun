'use client';
import { CSSProperties, InputHTMLAttributes, useState } from 'react';

interface EditTextProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  placeholder?: string;
  text_font_size?: string;
  text_font_family?: string;
  text_font_weight?: string;
  text_line_height?: string;
  text_text_align?: string;
  text_color?: string;
  fill_background_color?: string;
  border_border_radius?: string;

  layout_gap?: string;
  layout_width?: string;
  padding?: string;
  position?: string;

  variant?: 'default' | 'outline' | 'filled';
  size?: 'small' | 'medium' | 'large';

  label?: string;
  error?: string;
}

const EditText = ({
  placeholder = 'Enter Email',
  text_font_size = 'text-xs',
  text_font_family = 'Noto Sans',
  text_font_weight = 'font-medium',
  text_line_height = 'leading-xs',
  text_text_align = 'left',
  text_color = 'text-secondary-text',
  fill_background_color = 'bg-secondary-muted',
  border_border_radius = 'rounded-lg',

  layout_gap,
  layout_width,
  padding,
  position,

  label,
  error,

  variant = 'default',
  size = 'medium',
  disabled = false,
  className,
  onChange,
  ...props
}: EditTextProps) => {
  const [value, setValue] = useState('');

  const variantClass = {
    default:
      'bg-bg-input-background text-text-input-text focus:ring-bg-primary-light',
    outline:
      'bg-transparent border border-border-primary text-text-primary focus:ring-bg-primary-light',
    filled:
      'bg-bg-secondary-muted text-text-primary focus:ring-bg-primary-light',
  }[variant];

  const sizeClass = {
    small: 'text-xs px-3 py-2',
    medium: 'text-xs px-3 py-2',
    large: 'text-sm px-4 py-3',
  }[size];

  const optionalClass = [
    layout_gap ? `gap-[${layout_gap}]` : '',
    layout_width ? `w-[${layout_width}]` : '',
    padding ? `p-[${padding}]` : '',
    position || '',
  ]
    .filter(Boolean)
    .join(' ');

  const styleClasses = [
    text_font_size,
    text_font_family.startsWith('font-') ? text_font_family : '',
    text_font_weight,
    text_line_height,
    text_color,
    fill_background_color,
    border_border_radius,
    error ? 'border-red-500 focus:ring-red-500' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const customStyles: CSSProperties = {
    ...(text_font_family && !text_font_family.startsWith('font-')
      ? { fontFamily: text_font_family }
      : {}),
    ...(text_text_align ? { textAlign: text_text_align as any } : {}),
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
    onChange?.(event);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-2">
          {label}
        </label>
      )}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={handleChange}
        style={customStyles}
        className={`w-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variantClass} ${sizeClass} ${optionalClass} ${styleClasses} ${className || ''}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${props.id}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${props.id}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default EditText;
