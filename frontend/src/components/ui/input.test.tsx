import React, { createRef } from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Input from './input';

describe('Input component', () => {
  it('accepts forwarded ref', () => {
    const ref = createRef<HTMLInputElement>();
    const { getByPlaceholderText } = render(<Input placeholder="test-input" ref={ref} /> as any);
    const el = getByPlaceholderText('test-input') as HTMLInputElement;
    expect(el).toBeDefined();
    // ref should point to the same element
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toBe(el);
  });
});
