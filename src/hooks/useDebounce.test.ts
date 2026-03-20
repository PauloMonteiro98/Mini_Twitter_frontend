import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('useDebounce Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('deve retornar o valor inicial imediatamente', () => {
    const { result } = renderHook(() => useDebounce('teste', 500));
    expect(result.current).toBe('teste');
  });

  it('deve atualizar o valor apenas após o tempo de delay especificado', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'react', delay: 500 } }
    );

    rerender({ value: 'reactjs', delay: 500 });

    expect(result.current).toBe('react');

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe('reactjs');
  });
});