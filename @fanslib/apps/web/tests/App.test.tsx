import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('Dummy test', () => {
  it('should render without crashing', () => {
    render(<span>Test</span>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
