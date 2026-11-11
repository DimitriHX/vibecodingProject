import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const FIELD = "h-10 w-full rounded-xl border border-line bg-surface px-3 text-sm text-ink placeholder:text-ink-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-soft";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(FIELD, className)} {...props} />;
}

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

interface SelectProps<T extends string> extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange" | "value"> {
  value: T;
  options: readonly SelectOption<T>[];
  onValueChange: (value: T) => void;
}

export function Select<T extends string>({ value, options, onValueChange, className, ...props }: SelectProps<T>) {
  return (
    <select
      value={value}
      onChange={(event) => onValueChange(event.target.value as T)}
      className={cn(FIELD, "cursor-pointer pr-8", className)}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function Field({ label, htmlFor, error, children }: { label: string; htmlFor: string; error?: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="text-xs font-medium uppercase tracking-wide text-ink-muted">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-[#a14f57]">{error}</p>}
    </div>
  );
}
