import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PostModal } from './PostModal';

describe('Componente PostModal', () => {
  it('deve renderizar o texto de chamada e o botão', () => {
    render(<PostModal onClick={vi.fn()} />);
    
    expect(screen.getByText('E aí, o que está rolando?')).toBeInTheDocument();
    expect(screen.getByText('Postar')).toBeInTheDocument();
  });

  it('deve chamar a função onClick quando clicado', () => {
    const handleClick = vi.fn();
    
    render(<PostModal onClick={handleClick} />);
    
    const triggerContainer = screen.getByText('E aí, o que está rolando?').parentElement;
    
    if (triggerContainer) {
      fireEvent.click(triggerContainer);
    }
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});