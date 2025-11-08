// src/components/ui/input.tsx
import React, { forwardRef } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(props, ref) {
  const { className = "", ...rest } = props;
  return (
    <input
      ref={ref}
      {...rest}
      className={`px-3 py-2 rounded-md border focus:outline-none focus:ring ${className}`}
    />
  );
});

export default Input;
