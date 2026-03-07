// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LinkedField, useLinkedInputs } from './useLinkedInputs';

// Simple numeric converter: single (x1), double (x2), triple (x3)
type ScaleKey = 'single' | 'double' | 'triple';

const scaleFields: Record<ScaleKey, LinkedField<number>> = {
  single: { read: s => Number(s), write: v => String(v) },
  double: { read: s => Number(s) / 2, write: v => String(v * 2) },
  triple: { read: s => Number(s) / 3, write: v => String(v * 3) },
};

const isValidNumber = (v: number) => !isNaN(v) && isFinite(v);

function renderScaleHook() {
  return renderHook(() => useLinkedInputs(scaleFields, isValidNumber));
}

describe('useLinkedInputs', () => {
  it('initializes all field values as empty strings', () => {
    const { result } = renderScaleHook();
    expect(result.current.values).toEqual({ single: '', double: '', triple: '' });
  });

  it('sets the first field as the initial active field', () => {
    const { result } = renderScaleHook();
    expect(result.current.activeField).toBe('single');
  });

  it('propagates a single field change to all other fields', () => {
    const { result } = renderScaleHook();

    // Set single=6 → canonical value is 6, double=12, triple=18
    act(() => result.current.handleChange('single', '6'));

    expect(result.current.values).toEqual({
      single: '6',
      double: '12',
      triple: '18',
    });
  });

  it('propagates changes from non-first fields correctly', () => {
    const { result } = renderScaleHook();

    // Set double=10 → canonical = 10/2 = 5, single=5, triple=15
    act(() => result.current.handleChange('double', '10'));

    expect(result.current.values).toEqual({
      single: '5',
      double: '10',
      triple: '15',
    });
  });

  it('keeps raw input for the active field (not write() output)', () => {
    const { result } = renderScaleHook();

    // "06" parses to 6 but should be kept as-is for the edited field
    act(() => result.current.handleChange('single', '06'));

    expect(result.current.values.single).toBe('06');
    // Other fields get write() output
    expect(result.current.values.double).toBe('12');
    expect(result.current.values.triple).toBe('18');
  });

  it('only updates the active field when input is invalid', () => {
    const { result } = renderScaleHook();

    // First set valid values
    act(() => result.current.handleChange('single', '5'));
    expect(result.current.values).toEqual({
      single: '5',
      double: '10',
      triple: '15',
    });

    // Now enter invalid input in single
    act(() => result.current.handleChange('single', 'abc'));

    expect(result.current.values).toEqual({
      single: 'abc',
      double: '10',
      triple: '15',
    });
  });

  it('handles sequential changes correctly', () => {
    const { result } = renderScaleHook();

    act(() => result.current.handleChange('single', '3'));
    expect(result.current.values).toEqual({
      single: '3',
      double: '6',
      triple: '9',
    });

    // Now change from double field
    act(() => result.current.handleChange('double', '20'));
    expect(result.current.values).toEqual({
      single: '10',
      double: '20',
      triple: '30',
    });

    // Change from triple field
    act(() => result.current.handleChange('triple', '30'));
    expect(result.current.values).toEqual({
      single: '10',
      double: '20',
      triple: '30',
    });
  });

  it('handles empty string input (Number("") is 0, so it propagates)', () => {
    const { result } = renderScaleHook();

    // Set initial valid state
    act(() => result.current.handleChange('single', '4'));

    // Empty string → Number('') = 0, which is valid, so all fields update
    act(() => result.current.handleChange('single', ''));
    expect(result.current.values).toEqual({
      single: '',
      double: '0',
      triple: '0',
    });
  });

  it('allows setting the active field', () => {
    const { result } = renderScaleHook();

    act(() => result.current.setActiveField('triple'));
    expect(result.current.activeField).toBe('triple');
  });

  it('handles zero as valid input', () => {
    const { result } = renderScaleHook();

    act(() => result.current.handleChange('single', '0'));
    expect(result.current.values).toEqual({
      single: '0',
      double: '0',
      triple: '0',
    });
  });

  it('handles negative numbers', () => {
    const { result } = renderScaleHook();

    act(() => result.current.handleChange('double', '-8'));
    expect(result.current.values).toEqual({
      single: '-4',
      double: '-8',
      triple: '-12',
    });
  });

  it('handles decimal values', () => {
    const { result } = renderScaleHook();

    act(() => result.current.handleChange('single', '1.5'));
    expect(result.current.values).toEqual({
      single: '1.5',
      double: '3',
      triple: '4.5',
    });
  });

  it('recovers from invalid input when valid input is entered', () => {
    const { result } = renderScaleHook();

    act(() => result.current.handleChange('single', '5'));
    act(() => result.current.handleChange('single', 'bad'));
    expect(result.current.values.single).toBe('bad');

    // Now enter valid input again
    act(() => result.current.handleChange('single', '10'));
    expect(result.current.values).toEqual({
      single: '10',
      double: '20',
      triple: '30',
    });
  });
});
