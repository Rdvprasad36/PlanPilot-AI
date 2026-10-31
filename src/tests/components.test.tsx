import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '../components/ui/Button';
import { TextField } from '../components/ui/TextField';

expect.extend(toHaveNoViolations);

describe('UI Component Accessibility (WCAG 2.2 AA)', () => {
  it('Button renders without accessibility violations', async () => {
    const { container } = render(<Button>Click Me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('TextField renders with proper label and no violations', async () => {
    const { container } = render(<TextField label="Event Title" required />);
    expect(screen.getByText('Event Title')).toBeInTheDocument();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
